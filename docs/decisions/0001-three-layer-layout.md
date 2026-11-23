# 0001 Merry 5.2 in three layers: spec, rationale, tests

Status: accepted for Merry 5.2. Date: 2026-11-23.

## Context
The architecture was one file of 4,455 lines (609 KB). A reader who needs one rule loads all of it, and the version was stated in one place only.

## Alternatives
1. **Keep the monolith, add an index.** Cheapest; the reader still loads everything and rationale stays mixed with rules.
2. **Split by source range into spec files, one per Part R section and per stage, with rationale beside the rules (chosen).** Every rule keeps its id, its `Test:` line and a pointer to its rationale; every spec file carries the same version header; code proves nothing was lost.
3. **One file per rule.** Maximal routing; 105 plus files, cross-section reading becomes expensive and the registry R0 has no rule ids to name its files.

## Decision
Alternative 2 (Occam: the smallest change that gives routing and a visible version). The split is by source lines, character for character (`scripts/spec-split.mjs`, proved by `scripts/check-spec.mjs --lossless`); rationale lives in `docs/rationale/` and never creates a rule; decisions are numbered records here.

## Consequences
Checks: every R-id exactly once in `docs/spec`, every rationale names an existing R-id, every spec file opens with the one header, and a freeze is refused when a header differs from the tag.

The tag `going_merry_alpha_5.2` was set (on the monolith, with the corrections D1 to D10) before the layout work finished. A tag is never moved, so the layout is not a new freeze: the freeze check compares every header and the whole spec with the file at that tag.
