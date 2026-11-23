**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

# Angstone architecture, specification

Version in force: Merry 5.2.1, `merry-5.2.1`, the 5.2 text (frozen at commit `8157617`, tag `v5.2`, kept in `docs/archive/v5.2/`) with its release token corrected, no requirement changed; the text of 5.2.1 is `docs/archive/merry-5.2.1/ARCHITECTURE.md`, and the header commit names the 5.2 text. This folder is that text split by source range, character for character, except that every file opens with the version header and 13 `Rationale:` pointer lines are added (the check excludes them); the informative section "R3 residual risk" of the 5.2 text lives only in `docs/rationale/R3-residual-risk.md` (non-normative; no rule cites it by name). The 5.1 sentences replaced by corrections C1 to C10 are kept verbatim in `docs/rationale/E-5.1-superseded.md`. Which test backs which rule, with its status at a pinned network commit: `TESTS.md`.

| version | tag | status |
| --- | --- | --- |
| Merry 5.2.1 | `merry-5.2.1` | frozen, in force (erratum of 5.2: the release token only) |
| Merry 5.2 | `v5.2` | frozen, superseded by 5.2.1 |
| Merry 5.1 | `v5.1` | frozen, superseded by 5.2 |
| Merry 5 | `v5` | frozen, superseded |
| Merry 2 | `v2` | frozen, superseded |
| alpha 1 | `architecture-alpha-1` | frozen, superseded |

## Files

| file | content |
| --- | --- |
| `00-overview.md` | this version, names, the reset, open-item status, Part R preamble |
| `01-registry.md` | R0: the registry |
| `02-runtime.md` to `06-guidelines.md` | R1 to R5 (rules `R<s>.<n>`) and the index of requirements |
| `07-target.md` | section 1, the target |
| `08-path-intro.md`, `11-` to `23-` | section 2, the stages 0 to 9 |
| `09-features.md`, `10-legal.md` | the ordered features A1 to A7, legal compliance |
| `24-map.md` to `27-freeze-gate.md` | sections 3 to 5, the freeze gate |

A rule reads `**Rn.m Title.** one MUST statement`, then `Test:` (the test file) and `Enforced at:`; its rationale, when it has one, is `docs/rationale/E-Rn.m.md`. Rationale is non-normative and creates no rule. Decisions with their alternatives are in `docs/decisions/`.

## Checks

`node scripts/check-spec.mjs` (every R-id exactly once, every rationale pointing at an existing R-id, one identical header on every file); `--lossless <archived monolith>` (reassembly equals the original line for line); `--freeze v5.2` (every header names the tag, says frozen and carries the tag's own commit, and the spec is the lossless split of the text at the tag).

The corrections D1 to D10 of the owner-values ruling (C1 to C10) are in this text: they are the difference between 5.1 and 5.2.
