Rationale for: R3.27

Non-normative. It explains rule R3.27 of `docs/spec/04-plugins.md` and creates no requirement; where it differs from the rule, the rule governs. Proposed by the model `claude-fable-5-1`, kept only after the identifier check of `scripts/fable-reduce.mjs`.

The admission bound `floor(remaining × (n−t+1) / (2n−2t+1))` is derived from `f = 2t−n−1` byzantine nodes, `n−f` honest nodes and at least `t−f` honest verdicts per bundle, so that the bundles releasable in one `FINALITY_WINDOW_S` (OI-41) never exceed `remaining`.
