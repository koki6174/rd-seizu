"""
Stock Competition 2026 - fast Size-only deployment

Goal:
- retain the historically strong Size factor
- stay CPU-safe
- fall back to the already-proven beta-only submission if anything fails

Known prior evidence:
- Size-only: local full-Train Sharpe ~1.93
- README-reported Valid Sharpe: +1.18
- beta-only official score: 0.00653 and completes successfully

Data used:
1) beta_1day_valid.parquet       : output index + safe fallback
2) prices_daily_quotes_valid.parquet : Close only
3) fins_statements_train.parquet     : issued shares only
4) fins_statements_valid.parquet     : issued shares only

No ML, no rolling windows, no listed_info, no target/raw_target.
"""

from pathlib import Path
import json
import os
import time

import numpy as np
import pandas as pd
import pyarrow.parquet as pq


BETA_FILE = "beta_1day_valid.parquet"
PRICE_FILE = "prices_daily_quotes_valid.parquet"
FINS_TRAIN_FILE = "fins_statements_train.parquet"
FINS_VALID_FILE = "fins_statements_valid.parquet"

# If the extra Size reconstruction has already consumed this much wall time
# at a checkpoint, return the proven beta-only fallback rather than risk timeout.
SOFT_BUDGET_SECONDS = 420.0

_SHARE_EXACT_CANDIDATES = [
    "NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock",
    "NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYear",
    "NumberOfIssuedAndOutstandingShares",
    "IssuedShares",
    "SharesOutstanding",
]


def _candidate_bases():
    here = Path(__file__).resolve().parent
    cwd = Path.cwd()
    out = []
    env_dir = os.environ.get("INPUT_DIR")
    if env_dir:
        out.append(Path(env_dir))
    out.extend([
        here / "input",
        here.parent / "input",
        cwd / "input",
        cwd,
        Path("/mnt/data/input"),
    ])
    seen = set()
    for p in out:
        s = str(p)
        if s not in seen:
            seen.add(s)
            yield p


def _input_file(name: str) -> Path:
    for base in _candidate_bases():
        p = base / name
        if p.is_file():
            return p
    raise FileNotFoundError(name)


def _normalize_index(df: pd.DataFrame) -> pd.DataFrame:
    if isinstance(df.index, pd.MultiIndex) and df.index.nlevels == 2:
        df.index = df.index.set_names(["Date", "Code"])
        return df
    if "Date" in df.columns and "Code" in df.columns:
        return df.set_index(["Date", "Code"])
    raise ValueError("Expected (Date, Code) MultiIndex or Date/Code columns")


def _read_one_value(path: Path, value_col: str) -> pd.DataFrame:
    # Normal path: pandas reconstructs the stored MultiIndex even when a
    # single value column is projected.
    try:
        df = pd.read_parquet(path, columns=[value_col])
        return _normalize_index(df)
    except Exception:
        # Defensive fallback for a parquet layout where Date/Code are ordinary
        # physical columns.
        names = set(pq.ParquetFile(path).schema_arrow.names)
        cols = [c for c in ("Date", "Code", value_col) if c in names]
        if value_col not in cols:
            raise
        df = pd.read_parquet(path, columns=cols)
        return _normalize_index(df)


def _read_beta():
    path = _input_file(BETA_FILE)
    df = pd.read_parquet(path)
    df = _normalize_index(df)
    if df.shape[1] < 1:
        raise ValueError("beta parquet has no value column")
    beta = pd.to_numeric(df.iloc[:, 0], errors="coerce")
    beta.name = "beta"
    return beta


def _beta_fallback(beta: pd.Series) -> pd.DataFrame:
    # This exact family has already completed in the official grader.
    x = -beta.astype("float64", copy=False)
    # Keep all outputs finite; median is neutral enough for missing beta.
    if not np.isfinite(x.to_numpy(copy=False)).all():
        med = x.groupby(level="Date").transform("median")
        x = x.where(np.isfinite(x), med).fillna(0.0)
    out = x.to_frame("prediction")
    out.index = out.index.set_names(["Date", "Code"])
    return out


def _share_column(path: Path) -> str:
    names = list(pq.ParquetFile(path).schema_arrow.names)
    for c in _SHARE_EXACT_CANDIDATES:
        if c in names:
            return c

    # Competition/J-Quants schemas sometimes use long descriptive names.
    ranked = []
    for name in names:
        low = name.lower()
        if "share" not in low:
            continue
        score = 0
        if "issued" in low:
            score += 6
        if "outstanding" in low:
            score += 6
        if "includingtreasurystock" in low.replace("_", ""):
            score += 5
        if "endoffiscalyear" in low.replace("_", ""):
            score += 3
        if "treasury" in low:
            score += 1
        if "average" in low:
            score -= 8
        if "eps" in low or "pershare" in low:
            score -= 12
        ranked.append((score, name))

    ranked.sort(reverse=True)
    if not ranked or ranked[0][0] <= 0:
        raise KeyError("Could not identify an issued-shares column")
    return ranked[0][1]


def _read_share_events(path: Path, share_col: str) -> pd.DataFrame:
    df = _read_one_value(path, share_col)
    s = pd.to_numeric(df.iloc[:, 0], errors="coerce")
    out = s.rename("shares").to_frame()
    out = out[np.isfinite(out["shares"]) & (out["shares"] > 0)]
    if out.empty:
        return out
    return out


def _asof_shares(price_index: pd.MultiIndex, events: pd.DataFrame) -> np.ndarray:
    # Only ~500 securities. Per-code np.searchsorted avoids a 1.2M-row
    # merge_asof and keeps memory bounded.
    n = len(price_index)
    result = np.full(n, np.nan, dtype=np.float64)

    p_dates = pd.to_datetime(price_index.get_level_values("Date")).to_numpy(dtype="datetime64[ns]")
    p_codes = price_index.get_level_values("Code").astype(str)

    ev = events.reset_index()
    ev["Code"] = ev["Code"].astype(str)
    ev["Date"] = pd.to_datetime(ev["Date"])
    ev = ev.sort_values(["Code", "Date"], kind="mergesort")

    ev_groups = {}
    for code, g in ev.groupby("Code", sort=False):
        dates = g["Date"].to_numpy(dtype="datetime64[ns]")
        vals = g["shares"].to_numpy(dtype=np.float64)
        ev_groups[code] = (dates, vals)

    # Factorize once, then group integer positions. This avoids creating
    # 1.2M Python integer objects/lists and is much cheaper than groupby.apply.
    code_ids, unique_codes = pd.factorize(p_codes, sort=False)
    order = np.argsort(code_ids, kind="stable")
    counts = np.bincount(code_ids, minlength=len(unique_codes))
    ends = np.cumsum(counts)
    starts = ends - counts

    for cid, code in enumerate(unique_codes):
        pair = ev_groups.get(str(code))
        if pair is None or counts[cid] == 0:
            continue
        pos = order[starts[cid]:ends[cid]]
        fd, fv = pair
        j = np.searchsorted(fd, p_dates[pos], side="right") - 1
        ok = j >= 0
        if np.any(ok):
            result[pos[ok]] = fv[j[ok]]

    return result


def predict():
    t0 = time.monotonic()

    # Always obtain the known-good output universe/fallback first.
    beta = _read_beta()
    fallback = _beta_fallback(beta)

    try:
        if time.monotonic() - t0 > SOFT_BUDGET_SECONDS:
            return fallback

        price = _read_one_value(_input_file(PRICE_FILE), "Close")
        # Align exactly to the beta output universe.
        price = price.reindex(beta.index)
        close = pd.to_numeric(price.iloc[:, 0], errors="coerce").to_numpy(dtype=np.float64)

        if time.monotonic() - t0 > SOFT_BUDGET_SECONDS:
            return fallback

        ft_path = _input_file(FINS_TRAIN_FILE)
        fv_path = _input_file(FINS_VALID_FILE)

        # Discover from schema metadata; do not load unused financial columns.
        share_col = _share_column(fv_path)
        if share_col not in pq.ParquetFile(ft_path).schema_arrow.names:
            share_col = _share_column(ft_path)

        ev_train = _read_share_events(ft_path, share_col)
        ev_valid = _read_share_events(fv_path, share_col)
        events = pd.concat([ev_train, ev_valid], axis=0)
        events = events[~events.index.duplicated(keep="last")]

        if time.monotonic() - t0 > SOFT_BUDGET_SECONDS:
            return fallback

        shares = _asof_shares(beta.index, events)

        market_cap = close * shares
        good = np.isfinite(market_cap) & (market_cap > 0)
        sig_arr = np.full(len(beta), np.nan, dtype=np.float64)
        sig_arr[good] = -np.log(market_cap[good])

        sig = pd.Series(sig_arr, index=beta.index, name="prediction")

        # Missing share histories are neutralized within each date. Use the
        # proven beta factor only as a tiny tie-breaker, never enough to
        # overwhelm a valid size rank.
        med = sig.groupby(level="Date", sort=False).transform("median")
        beta_tie = (-beta).clip(-5.0, 5.0) * 1e-9
        sig = sig.fillna(med).fillna(0.0) + beta_tie.fillna(0.0)

        if not np.isfinite(sig.to_numpy(copy=False)).all():
            return fallback

        out = sig.to_frame("prediction")
        out.index = out.index.set_names(["Date", "Code"])
        return out

    except Exception:
        # A scoring result is more valuable than a crash. This fallback is
        # intentionally broad because beta-only already completed officially.
        return fallback
