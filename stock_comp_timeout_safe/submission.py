from pathlib import Path
import numpy as np
import pandas as pd

WINDOW = 60


def _find_input_dir() -> Path:
    here = Path(__file__).resolve().parent
    cwd = Path.cwd()
    candidates = (
        here / "input",
        here.parent / "input",
        cwd / "input",
        cwd.parent / "input",
    )
    for p in candidates:
        if (p / "prices_daily_quotes_valid.parquet").is_file():
            return p
    raise FileNotFoundError("prices_daily_quotes_valid.parquet was not found in bounded input paths")


def _rolling_mean_by_code(values: np.ndarray, code_id: np.ndarray, date_i8: np.ndarray, window: int) -> np.ndarray:
    # Numeric sort: Code -> Date. No pandas groupby/apply/rolling.
    order = np.lexsort((date_i8, code_id))
    c = code_id[order]
    x = values[order]

    y = np.empty(len(x), dtype=np.float64)
    if len(x) == 0:
        return y

    starts = np.flatnonzero(np.r_[True, c[1:] != c[:-1]])
    ends = np.r_[starts[1:], len(x)]

    for s, e in zip(starts, ends):
        a = x[s:e]
        ok = np.isfinite(a)
        v = np.where(ok, a, 0.0)

        cs = np.empty(len(a) + 1, dtype=np.float64)
        cs[0] = 0.0
        np.cumsum(v, out=cs[1:])

        cc = np.empty(len(a) + 1, dtype=np.int32)
        cc[0] = 0
        np.cumsum(ok.astype(np.int32), out=cc[1:])

        i = np.arange(len(a), dtype=np.int64)
        lo = np.maximum(0, i + 1 - window)
        sm = cs[i + 1] - cs[lo]
        n = cc[i + 1] - cc[lo]
        y[s:e] = np.divide(sm, n, out=np.full(len(a), np.nan), where=n > 0)

    out = np.empty(len(x), dtype=np.float64)
    out[order] = y
    return out


def predict():
    input_dir = _find_input_dir()
    path = input_dir / "prices_daily_quotes_valid.parquet"

    # One parquet file, four columns only. No fins/listed_info/model files.
    df = pd.read_parquet(path, columns=["Date", "Code", "Close", "Volume"])

    if "Date" not in df.columns or "Code" not in df.columns:
        df = df.reset_index()

    date = pd.to_datetime(df["Date"], errors="coerce")
    code = df["Code"].astype(str)

    close = pd.to_numeric(df["Close"], errors="coerce").to_numpy(dtype=np.float64, copy=False)
    volume = pd.to_numeric(df["Volume"], errors="coerce").to_numpy(dtype=np.float64, copy=False)

    # Persistent one-file proxy for small/illiquid stocks.
    # log1p stabilizes outliers; 60-day averaging reduces turnover.
    dollar_volume = np.where((close > 0) & (volume >= 0), close * volume, np.nan)
    log_dollar_volume = np.log1p(dollar_volume)

    code_id, _ = pd.factorize(code, sort=True)
    date_i8 = date.to_numpy(dtype="datetime64[ns]").astype(np.int64, copy=False)

    avg_log_dv = _rolling_mean_by_code(
        log_dollar_volume,
        code_id.astype(np.int32, copy=False),
        date_i8,
        WINDOW,
    )
    signal = -avg_log_dv

    # Missing rows are neutral rather than dropped.
    signal = np.nan_to_num(signal, nan=0.0, posinf=0.0, neginf=0.0)

    idx = pd.MultiIndex.from_arrays(
        [date.to_numpy(), code.to_numpy()],
        names=["Date", "Code"],
    )
    return pd.DataFrame({"signal": signal}, index=idx)
