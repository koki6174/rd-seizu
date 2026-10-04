"""
Stock Competition 2026 - timeout-proof submission

Design goal:
- CPU only
- exactly one parquet read
- no recursive file search
- no merge / groupby / rolling / ML
- O(N) negation only

Signal:
    - beta_1day_valid
Lower-beta stocks receive larger signals.

The official evaluator performs the daily cross-sectional ranking.
"""

from pathlib import Path
import os
import pandas as pd

_FILE = "beta_1day_valid.parquet"


def _input_file() -> Path:
    """Find the single required parquet using a small fixed candidate list."""
    here = Path(__file__).resolve().parent
    cwd = Path.cwd()

    bases = []
    env_dir = os.environ.get("INPUT_DIR")
    if env_dir:
        bases.append(Path(env_dir))

    bases.extend([
        here / "input",
        here.parent / "input",
        cwd / "input",
        cwd,
        Path("/mnt/data/input"),
    ])

    seen = set()
    for base in bases:
        key = str(base)
        if key in seen:
            continue
        seen.add(key)
        p = base / _FILE
        if p.is_file():
            return p

    raise FileNotFoundError(
        f"{_FILE} was not found in the fixed input locations: "
        + ", ".join(str(x) for x in bases)
    )


def predict():
    """
    Return one-column DataFrame indexed by (Date, Code).

    This deliberately does not calculate any rolling features or joins.
    """
    df = pd.read_parquet(_input_file())

    # Normal distribution format: (Date, Code) are already the MultiIndex.
    if isinstance(df.index, pd.MultiIndex) and df.index.nlevels == 2:
        if df.shape[1] < 1:
            raise ValueError("beta parquet has no value column")
        s = -df.iloc[:, 0]
        out = s.to_frame("prediction")
        out.index = out.index.set_names(["Date", "Code"])
        return out

    # Defensive fallback if Date/Code were materialized as ordinary columns.
    if "Date" in df.columns and "Code" in df.columns:
        value_cols = [c for c in df.columns if c not in ("Date", "Code")]
        if not value_cols:
            raise ValueError("beta parquet has no value column")
        out = df.loc[:, ["Date", "Code", value_cols[0]]].set_index(["Date", "Code"])
        out.iloc[:, 0] = -out.iloc[:, 0]
        out.columns = ["prediction"]
        return out

    raise ValueError(
        "Unexpected beta parquet layout; expected MultiIndex(Date, Code) "
        "or Date/Code columns."
    )
