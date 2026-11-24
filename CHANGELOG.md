# Changelog

## merry-5.2.1 (erratum of 5.2, frozen)
- Erratum, no requirement change: the Names section of the 5.2 text still gave the release token as `v5`, so gate G23 counted the token on 2 lines instead of 1 (the audit finding E1). The token is now `merry-5.2.1`; every version header of `docs/spec/` carries it. Three single-line edits of the text, nothing else: the Names sentence; the sentence that said "This text is v5.2" (it now says "Merry 5.2.1" and carries no token, so the token stands once); the sed pattern that derives `$TAG` in G23 (`[a-z_]*[0-9]*` could not capture a dotted token, now `[a-z_0-9.]*`).
- In the project's source repository the corrected text is archived beside the 5.2 text; here `docs/spec/` is that text split by rule, and the earlier versions and their internal tags are untouched. The header commit (8157617) names the 5.2 text this erratum corrects: a commit cannot carry its own hash.
- In the source repository `scripts/check-spec.mjs --freeze merry-5.2.1` now checks the headers, the lossless split of the archived 5.2.1 text at the tag, and that the release token stands on exactly one line (G23).

## v5.2 (frozen, tag at `8157617`)
- Layout: the monolithic `docs/ARCHITECTURE.md` and `docs/ARCHITECTURE-FINAL.md` of `v5.1` moved with `git mv` to `docs/archive/v5.1/`; nothing deleted, no tag touched.
- The 5.1 sentences that 5.2 replaced are kept verbatim in `docs/rationale/E-5.1-superseded.md`; the rule-to-test table at a pinned network commit is `docs/spec/TESTS.md`.
- New layout: `docs/spec/` (normative, version header on every file), `docs/rationale/`, `docs/decisions/`, `docs/plan/`, `docs/reviews/`.
- The 5.2 text (4,466 lines; 5.1 has 4,455, the difference is the corrections C1 to C10) is split by source range without changing a character, apart from the version header and the `Rationale:` pointer lines the layout adds; reassembly (with those excluded) equals the original (`scripts/check-spec.mjs --lossless`, in the source repository).
- Text: 5.1 plus corrections C1 to C10 of the defects D1 to D10 (owner-values ruling), as frozen at the tag; no other requirement change.
- The tag was set on the monolithic `docs/ARCHITECTURE.md` before this layout existed and is never moved; the layout is proven to be a lossless split of the file at the tag (`node scripts/check-spec.mjs --freeze v5.2`, in the source repository).

## v5.1
Erratum of 5: citation and glossary corrections, no requirement change.
