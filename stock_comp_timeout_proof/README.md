# Stock Competition 2026 — Timeout-proof submission

Date: 2026-10-04

## Why this version exists

The prior research-oriented 4-factor and simplified price/fundamental variants timed out in the official CPU grader after 1800 seconds.

This version therefore treats successful execution as a hard constraint.

## Final deploy signal

```text
signal = -beta_1day_valid
```

Only `beta_1day_valid.parquet` is read.

There are:
- no financial statement files,
- no listed-info file,
- no price-history file,
- no merges,
- no merge_asof,
- no rolling windows,
- no groupby,
- no machine learning,
- no recursive file search,
- no GPU dependency.

The only material computation after the parquet read is negating one numeric column.

## Why beta

A deterministic arbitrary signal would sacrifice essentially all economic information. Beta is already provided as a Point-in-Time feature, changes relatively slowly, and requires no additional feature engineering. Lower beta is assigned a larger signal.

This is intentionally a deployment-first strategy, not the prior Research Champion.

## Expected complexity

If N is the number of validation rows:
- parquet I/O: one file / one value column plus index,
- computation: O(N),
- memory: one input DataFrame plus one output Series/DataFrame.

## Interpretation of another timeout

If this exact version still reaches the official 1800-second timeout, the bottleneck is unlikely to be joins, rolling feature construction, financial statement processing, ML inference, or Python-level strategy complexity because none of those are present.

The next diagnostic would be an index-only submission if the official file schema allows loading the MultiIndex without a data column.
