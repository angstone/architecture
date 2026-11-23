# Security policy

This repository is a specification. A security defect here is a flaw in the design: a rule that can be satisfied by a system that is still unsafe, two rules that contradict each other, a missing refusal, a bound that is not enforced, or a privacy property that does not hold.

## Reporting

Report privately through GitHub security advisories:

<https://github.com/angstone/architecture/security/advisories/new>

Do not open a public issue or pull request for a vulnerability. Include the rule (R-id) or section, the scenario that breaks it, and, if you have one, the change that would close it.

## What to expect

- Acknowledgement within 7 days.
- An assessment and, where the report holds, a fix proposed as a pull request against the next version; credit if you want it.
- The frozen text of a tag is not edited in place; a fix to a published version is published as a new version with its own tag, and the advisory says which versions are affected.

## Scope

In scope: the specification text, the rationale and decisions, and the scripts in `scripts/` and the workflow in `.github/`. Out of scope: the code repositories of the project (they are not this repository) and third-party services.

## Supported versions

| version | tag | supported |
| --- | --- | --- |
| Merry 5.2.1 | `going_merry_alpha_5.2.1` | yes |
| Merry 5.2 | `going_merry_alpha_5.2` | superseded by 5.2.1 (the same text, its release token corrected) |
