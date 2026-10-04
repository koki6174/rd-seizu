import importlib.util
import json
import os
import time
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent
INPUT = ROOT / "synthetic_input"
INPUT.mkdir(exist_ok=True)

n_codes = 500
n_dates = 2500
codes = np.array([f"{1000+i:04d}0" for i in range(n_codes)], dtype=object)
dates = pd.bdate_range("2016-04-01", periods=n_dates)
mi = pd.MultiIndex.from_product([dates, codes], names=["Date", "Code"])
n = len(mi)

rng = np.random.default_rng(6174)

# beta: one value column
beta = pd.DataFrame({"beta": rng.normal(1.0, 0.35, n).astype("float32")}, index=mi)
beta.to_parquet(INPUT / "beta_1day_valid.parquet")

# price: only Close is needed by deploy code
base = rng.lognormal(np.log(1500), 0.7, n_codes)
close = np.tile(base, n_dates) * rng.lognormal(0, 0.02, n)
price = pd.DataFrame({"Close": close.astype("float32")}, index=mi)
price.to_parquet(INPUT / "prices_daily_quotes_valid.parquet")

# listed_info for conservative candidate
cats = np.array(["TOPIX Core30","TOPIX Large70","TOPIX Mid400","TOPIX Small 1","TOPIX Small 2"])
cat_by_code = cats[np.arange(n_codes) % len(cats)]
listed = pd.DataFrame({"ScaleCategory": np.tile(cat_by_code, n_dates)}, index=mi)
listed.to_parquet(INPUT / "listed_info_valid.parquet")

# Financial events: about quarterly, with exact long share column.
share_col = "NumberOfIssuedAndOutstandingSharesAtTheEndOfFiscalYearIncludingTreasuryStock"
ev_dates = dates[::60]
fmi = pd.MultiIndex.from_product([ev_dates, codes], names=["Date","Code"])
shares_code = rng.lognormal(np.log(50_000_000), 1.0, n_codes)
shares = np.tile(shares_code, len(ev_dates)) * rng.lognormal(0, 0.01, len(fmi))
fins_all = pd.DataFrame({share_col: shares.astype("float64")}, index=fmi)
cut = ev_dates[len(ev_dates)//3]
fins_all.loc[fins_all.index.get_level_values("Date") < cut].to_parquet(INPUT / "fins_statements_train.parquet")
fins_all.loc[fins_all.index.get_level_values("Date") >= cut].to_parquet(INPUT / "fins_statements_valid.parquet")

os.environ["INPUT_DIR"] = str(INPUT)

def load(path, module_name):
    spec = importlib.util.spec_from_file_location(module_name, path)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

results = {}
for fn, modname in [
    ("submission.py","fast_size"),
    ("submission_scale_beta.py","scale_beta"),
]:
    m = load(ROOT / fn, modname)
    t = time.perf_counter()
    out = m.predict()
    sec = time.perf_counter() - t
    assert isinstance(out, pd.DataFrame)
    assert len(out) == n
    assert out.shape[1] == 1
    assert out.index.names == ["Date","Code"]
    assert np.isfinite(out.iloc[:,0].to_numpy()).all()
    results[fn] = {"seconds": sec, "rows": len(out)}

print(json.dumps(results, indent=2))
(ROOT / "benchmark_results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
