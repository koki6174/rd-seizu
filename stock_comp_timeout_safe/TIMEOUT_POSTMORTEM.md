# Timeout postmortem — 2026-10-04

## Observed
Two official submissions exceeded the 1800-second limit.

1. Research Champion: 4-factor fundamental strategy.
2. Reduced deployable strategy: Size + CFO/Assets + Sales/MarketCap.

The second timeout invalidates the earlier synthetic benchmark as a deployment guarantee.

## Updated inference
The dominant risk is likely real-data I/O / financial parquet processing / environment-specific access, not arithmetic complexity alone.

## New hard rule
No financial parquet is read by the next official submission.

## Primary strategy
One-file 60-day low-dollar-volume proxy.

Complexity:
- one parquet scan, four columns
- O(N log N) numeric lexsort
- O(N) cumulative-sum rolling computation
- about 500 short Python loops, one per stock
- no cross-sectional transformation is required because the official evaluator ranks the returned signal each day

## Expected scoring trade-off
This is deliberately below the prior Research Champion in expected predictive strength.
However, a strategy that times out has no usable official score.
The known sample result for standalone illiquidity (+0.57 Valid Sharpe) gives some empirical support to retaining a liquidity/smallness proxy while aggressively reducing runtime.

## If this still times out
Submit the ultra-static diagnostic to determine whether the bottleneck is outside user code.
That version reads only raw_return_1day_valid and performs no historical computation.
