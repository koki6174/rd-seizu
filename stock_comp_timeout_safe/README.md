# Stock Competition 2026 — Timeout-safe submission (2026-10-04)

## Decision

The previous fundamental 4-factor and 3-factor submissions both timed out at the official 1800-second CPU limit.
This version intentionally removes all expensive financial processing.

Primary submission:
- reads **one parquet file only**: `prices_daily_quotes_valid.parquet`
- reads **four columns only**: Date / Code / Close / Volume
- does not read fins_statements, listed_info, target, raw_target, beta, macro files, or model files
- does not use merge_asof, pandas groupby.apply, pandas groupby.rolling, ML, GPU, or network
- computes a 60-trading-day average log dollar-volume signal with NumPy cumulative sums
- output signal is the negative rolling average: lower persistent dollar volume ranks higher

Rationale:
- official samples previously showed the standalone illiquidity block had positive Valid Sharpe (+0.57)
- the main objective of this revision is to eliminate the timeout failure mode
- no official Valid target is used

The archive `stock_comp_2026_final_submission_timeout_safe.zip` contains only `submission.py` at ZIP root.

A diagnostic `submission_ultra_static.py` is also stored in the full research archive. It is not the recommended submission because its signal has no established alpha; it exists only if an even smaller-I/O runtime diagnostic is needed.
