# Changelog

## going_merry_alpha_5.2 (frozen, tag at `8157617`)
- Layout: the monolithic `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE-FINAL.md` of `going_merry_alpha_5.1` moved with `git mv` to `docs/archive/going_merry_alpha_5.1/`; nothing deleted, no tag touched.
- New layout: `docs/spec/` (normative, version header on every file), `docs/rationale/`, `docs/decisions/`, `docs/plan/`, `docs/reviews/`.
- The 4,456 lines of 5.1 are split by source range without changing a character; reassembly equals the original (`scripts/check-spec.mjs --lossless`).
- Text: 5.1 plus corrections C1 to C10 of the defects D1 to D10 (owner-values ruling), as frozen at the tag; no other requirement change.
- The tag was set on the monolithic `docs/ARCHITECTURE.md` before this layout existed and is never moved; the layout is proven to be a lossless split of the file at the tag (`node scripts/check-spec.mjs --freeze going_merry_alpha_5.2`).

## going_merry_alpha_5.1
Erratum of 5: citation and glossary corrections, no requirement change.
