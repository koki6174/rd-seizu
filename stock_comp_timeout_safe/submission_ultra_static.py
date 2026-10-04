from pathlib import Path
import numpy as np
import pandas as pd


def _find_input_dir() -> Path:
    here = Path(__file__).resolve().parent
    cwd = Path.cwd()
    for p in (here / "input", here.parent / "input", cwd / "input", cwd.parent / "input"):
        if (p / "raw_return_1day_valid.parquet").is_file():
            return p
    raise FileNotFoundError("raw_return_1day_valid.parquet not found")


def predict():
    # Diagnostic fallback: minimum I/O and no rolling, joins, training, or large feature tables.
    p = _find_input_dir() / "raw_return_1day_valid.parquet"
    df = pd.read_parquet(p)
    if "Date" not in df.columns or "Code" not in df.columns:
        df = df.reset_index()
    date = pd.to_datetime(df["Date"], errors="coerce")
    code = df["Code"].astype(str)

    # Stable per-code ordering; designed for runtime diagnosis, not expected alpha.
    codes = pd.factorize(code, sort=True)[0].astype(np.float64)
    signal = -codes
    idx = pd.MultiIndex.from_arrays([date.to_numpy(), code.to_numpy()], names=["Date", "Code"])
    return pd.DataFrame({"signal": signal}, index=idx)
