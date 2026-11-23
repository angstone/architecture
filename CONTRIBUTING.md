# Contributing

Humans and AIs are welcome here. The same rules apply to both.

## The rules

1. **Every change is a pull request.** Nobody pushes to `main`, the owner included; `main` is protected (pull request, one approving review from the code owners, required checks, no force push, no deletion).
2. **A change to `docs/spec` is a change to a requirement.** It MUST:
   - cite the R-id it touches (for example `R3.10`) in the pull request description and in the commit message;
   - add or change that rule's `Test:` reference, so the rule stays held by a named test;
   - pass the checks below.
3. **The text at a tag is frozen.** `going_merry_alpha_5.2` is never moved and its text is never edited in place. A change of a requirement is a proposal for the next version: open it as a proposal (issue template "Proposal"), then a pull request that carries the next version's header and its own tag proposal. Editorial fixes that change no requirement (a typo, a broken link) go through the same pull request path and say so.
4. **AI-authored pull requests say so.** Tick the box in the pull request template and name the model or tool. An AI contribution is judged on the same evidence as a human one: the R-id, the test reference, the passing checks. A pull request that hides AI authorship is closed.
5. **Rationale creates no requirement.** `docs/rationale/` and `docs/decisions/` explain; they never add a MUST. A new requirement appears only in `docs/spec/`, once, under an unused R-id.
6. **No person is named.** The text is impersonal: the owner is "the owner". The check refuses names.
7. **No secrets, no personal data, no copied third-party text** beyond short quotation with its source.

## The checks

Run these before you open the pull request; the same run on every pull request is `.github/workflows/spec-checks.yml`.

```sh
node scripts/check-spec.mjs     # every R-id exactly once, rationale pointers resolve, one identical header on every spec file
node scripts/check-names.mjs    # no natural person is named
node scripts/check-links.mjs    # every relative link in every Markdown file resolves
```

On a pull request the workflow also runs `scripts/check-pr.mjs`: a pull request that touches `docs/spec` must cite an R-id and must change a `Test:` line.

Adding a rule changes the expected R-id count. That number and the version header live in `scripts/spec-meta.json`; a change to that file needs the code owner's review like any other.

## Style

English. Short sentences. A rule reads `**Rn.m Title.** one MUST statement`, then `Test:` and `Enforced at:`. Keep names precise. Do not reformat files you do not change: a diff that moves lines for taste is closed.

## Review

The code owner reviews every pull request. A review asks: does it cite its R-id, does the test reference exist and refuse what the rule says, does it contradict another passage (a contradiction is a defect of the highest severity). Reviews that do not converge after two rounds stop; the reviewer states the blocking point once and the owner decides.

## Conduct and security

Be kind and precise: see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). A vulnerability in the design is reported privately: see [SECURITY.md](SECURITY.md).

## Licence

By contributing you agree that your contribution is licensed under [CC BY 4.0](LICENSE), like the rest of the text.
