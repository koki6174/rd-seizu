"""
Stock Competition 2026 - conservative ScaleCategory + beta tie-break

One large Point-in-Time listed-info column + the already-proven beta file.
No financial statements, no price history, no rolling, no merge, no ML.
"""

from pathlib import Path
import os
import numpy as np
import pandas as pd

BETA_FILE = "beta_1day_valid.parquet"
LISTED_FILE = "listed_info_valid.parquet"


def _bases():
    here = Path(__file__).resolve().parent
    cwd = Path.cwd()
    vals = []
    env = os.environ.get("INPUT_DIR")
    if env:
        vals.append(Path(env))
    vals += [here/"input", here.parent/"input", cwd/"input", cwd, Path("/mnt/data/input")]
    seen = set()
    for p in vals:
        if str(p) not in seen:
            seen.add(str(p)); yield p


def _path(name):
    for b in _bases():
        p = b/name
        if p.is_file():
            return p
    raise FileNotFoundError(name)


def _norm(df):
    if isinstance(df.index, pd.MultiIndex) and df.index.nlevels == 2:
        df.index = df.index.set_names(["Date","Code"])
        return df
    if "Date" in df.columns and "Code" in df.columns:
        return df.set_index(["Date","Code"])
    raise ValueError("bad index")


def _beta():
    d = _norm(pd.read_parquet(_path(BETA_FILE)))
    s = pd.to_numeric(d.iloc[:,0], errors="coerce").rename("beta")
    return s


def _fallback(beta):
    s = -beta
    med = s.groupby(level="Date", sort=False).transform("median")
    s = s.where(np.isfinite(s), med).fillna(0.0)
    return s.to_frame("prediction")


def predict():
    beta = _beta()
    fb = _fallback(beta)
    try:
        d = pd.read_parquet(_path(LISTED_FILE), columns=["ScaleCategory"])
        d = _norm(d).reindex(beta.index)
        x = d.iloc[:,0].astype("string").str.lower().str.replace(" ", "", regex=False)

        score = pd.Series(4.5, index=beta.index, dtype="float64")
        score[x.str.contains("core30", na=False)] = 0.0
        score[x.str.contains("large70", na=False)] = 1.0
        score[x.str.contains("mid400", na=False)] = 2.0
        score[x.str.contains("small1", na=False)] = 3.0
        score[x.str.contains("small2", na=False)] = 4.0
        # Generic 'small' but not numbered.
        generic_small = x.str.contains("small", na=False) & ~(
            x.str.contains("small1", na=False) | x.str.contains("small2", na=False)
        )
        score[generic_small] = 3.5

        # Scale bucket dominates. Beta only breaks the many ties inside a bucket.
        sig = score * 10.0 + (-beta).clip(-5.0, 5.0) * 0.01
        sig = sig.where(np.isfinite(sig), 0.0)
        out = sig.to_frame("prediction")
        out.index = out.index.set_names(["Date","Code"])
        return out
    except Exception:
        return fb
