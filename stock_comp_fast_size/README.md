# Stock Competition 2026 — Fast Size deployment

Updated: 2026-10-04

## Status

The official beta-only submission completed successfully and scored **0.00653**. That establishes a known-good minimum runtime structure.

The goal of this branch is to move upward on the score/runtime Pareto frontier without returning to the financial-feature pipeline that timed out.

## Candidate A — recommended: exact Size-only, optimized

Signal:

```text
market_cap = Close * latest disclosed issued shares
signal = -log(market_cap)
```

Prior evidence from the competition research:
- Size-only local full-Train Sharpe: about **1.93**
- README-reported Valid Sharpe: **+1.18**
- Full 4-factor research champion: higher local Sharpe, but timed out and is not deployment-safe.

Implementation constraints:
- starts by reading beta, producing a proven fallback;
- reads only `Close` from prices;
- reads only one issued-shares column from each financial parquet;
- discovers the share column from parquet schema metadata;
- no ML;
- no rolling windows;
- no listed_info;
- no target/raw_target;
- no 1.2M-row merge_asof;
- per-security `np.searchsorted` on the small financial-event history;
- hard soft-budget checkpoints; if the Size path fails, returns beta-only.

## Candidate B — conservative: ScaleCategory + beta tie-break

Reads:
- beta_1day_valid
- listed_info_valid, `ScaleCategory` only

Mapping:
- Core30 -> largest
- Large70
- Mid400
- Small 1
- Small 2 -> smallest / highest size signal
- beta only breaks ties inside a size bucket.

This is a coarse size proxy. It is expected to be weaker than exact market cap but simpler than financial as-of reconstruction.

## Selection

1. Submit Candidate A first.
2. If Candidate A completes, use its official score as the new deployment baseline.
3. If Candidate A times out unexpectedly, submit Candidate B.
4. beta-only remains the final guaranteed fallback.

Do not restore CFO / Profit YoY / Sales-to-market-cap until Size-only has demonstrated safe official runtime.
