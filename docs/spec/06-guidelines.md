**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

### R5 Code guidelines as a gate

Every repository passes the guideline validator before code lands. The rules come from the project standards; the
validator prints one line per breach as `<file>: [rule-id] <reason>`, exits 1 on any breach and prints
`guidelines: GREEN` and exits 0 when clean. A rule name below is the testable criterion: the check passes when the
validator prints no line with that rule on the repository.

**R5.1 The source drawers.** The source tree `src/` MUST hold only the directories `constants/`, `interfaces/`,
`modules/<name>/`, `tools/`, the sealed-action directory `lumi/`, and the entry files `index.ts` and `main.ts` with
their tests. A different directory breaks `not-a-drawer`; a loose source file at the top of `src/` breaks `loose-entry`.
Test: fixtures with a stray directory and a stray file print the two rules and exit 1
(`test/guidelines/drawers.test.ts`).
Enforced at: compile, commit.

**R5.2 Constants in their own files.** A named constant (UPPER_SNAKE assigned a literal, array, object, regular
expression, `Set` or `Map`) MUST live in a file under `constants/`; elsewhere it breaks `constant-outside-constants`.
Test: a fixture with a named constant in a module prints the rule (`test/guidelines/constants.test.ts`).
Enforced at: compile, commit.

**R5.3 Types and interfaces in their own files.** An exported `type` or `interface` MUST be declared under
`interfaces/`; elsewhere it breaks `type-outside-interfaces` (tests and `*.test-support.ts` files are exempt, and a
re-export such as `export type { X } from` is not a declaration). The `interfaces/` drawer MUST hold types only: no
exported function, class, const or let breaks `interfaces-types-only`.
Test: fixtures for a declared exported type in a module, a re-export and a function in `interfaces/`; the first and
third print their rule, the second prints nothing (`test/guidelines/interfaces.test.ts`).
Enforced at: compile, commit.

**R5.4 Constants and interfaces are reusable.** The drawers MUST import only downward: `constants/` imports only
`constants/`; `interfaces/` imports only `interfaces/` and `constants/`; `tools/` imports only `interfaces/`,
`constants/` and `tools/`; breaking this is `drawer-import`; a module MUST NOT import a type from another module (a
type shared by two modules lives in `interfaces/`); breaking this is `cross-module-type`; both the `import type` form and
the inline `{ type X }` form count.
Test: fixtures for each direction and for both type-import forms (`test/guidelines/imports.test.ts`).
Enforced at: compile, commit.
Rationale: E-R5.4

**R5.5 The layout check runs in compile.** The package's `compile` script MUST run `scripts/check-layout.mjs`, directly
or through a script it calls; otherwise the validator prints `compile-runs-layout`. The compile step is pure: it
type-checks, runs the layout check (which calls the seal check `scripts/check-seal.mjs`, R1.1) and builds, nothing else.
Test: a package whose `compile` script omits the layout check prints the rule; one that calls it through
`npm run <script>` passes; the validator proves it behaviourally by running `npm run compile` in a scratch copy with a
planted breach, and a script such as `tsc && node scripts/check-layout.mjs || true` fails because the exit is zero
(`test/guidelines/compile.test.ts`).
Enforced at: compile.

**R5.6 Lint.** Every package MUST carry the lint configuration at the digest pinned in the validator, with no plugin and no `ignores` entry not in it, and with `linterOptions: {noInlineConfig: true, reportUnusedDisableDirectives: "error"}` set in it so an inline directive is itself a finding; a tree configuration that differs breaks `eslint-config`; it MUST have the
linter installed (otherwise `eslint-installed`), the lint gate running the `eslint` executable from the trusted base at the exact version and integrity digest pinned in the validator, never one resolved from the tree's `node_modules`, and every file MUST pass it with zero warnings (otherwise one
`<file>: [eslint] <ruleId> <message>` line per finding, with `parse` when a file cannot be parsed).
Test: fixtures with no config, with config and no install, with one lint warning, with a config carrying an `ignores` entry on `src/`, and with a file carrying an inline `eslint-disable` directive print the five outcomes
(`test/guidelines/lint.test.ts`).
Enforced at: commit.
Rationale: E-R5.6

**R5.7 The seal check for Lumi Actions.** The repository source `src/lumi/<name>.ts` is compiled to the sealed `.js` bytes, and the check runs on those sealed bytes (R1.2); the compiled one-file seal MUST import nothing; a compiled folder seal `src/lumi/<name>/` MUST import
only relative paths that resolve inside its own folder; a breach prints `lumi-seal`, with the offending import named.
Inside a seal the top-level drawer import rules are replaced by the seal rule; a one-file seal holds its own types and
constants, and a folder seal's source keeps its own `constants/` and `interfaces/` subfolders under `src/lumi/<name>/`, and the sealed bytes hold the compiled `.js` of `constants/` and no file for `interfaces/`; the constant and type rules
apply to the folder seal's files outside those subfolders.
Test: the import forms of R1.2 each print `lumi-seal`; a clean folder seal with internal `constants/` and
`interfaces/` is green (`test/guidelines/seal.test.ts`).
Enforced at: compile, commit, load.

**R5.8 Python packages.** A Python package MUST pass the Python layout check; a breach prints `python-layout`.
Test: a Python fixture with a stray module prints the rule (`test/guidelines/python.test.ts`).
Enforced at: commit.

**R5.9 Types exported only from interfaces/.** Except the exemptions of R5.3 and the internal `interfaces/` of a folder
seal (R5.7), no file outside `interfaces/` MAY export a type or interface, so that the set of shared types is exactly
the content of `interfaces/` (R5.3); this is `type-outside-interfaces`.
Test: the repository-wide validator run prints no `type-outside-interfaces` line; and the compiled public type surface
of the package equals the export list of `interfaces/` plus the function and value exports of `modules/` and
`tools/` (`test/guidelines/type-surface.test.ts`).
Enforced at: compile, release.
Rationale: E-R5.9

**R5.10 Scope.** The validator MUST judge in two scopes: the whole repository (every package under the path given,
skipping only paths that are untracked or gitignored at the pinned base, every tracked file under `src/` being judged), and only the listed files (`--files`), the scope used by the gates;
a file a change touched MUST be fully clean in the file-scope run, and debt in an untouched file belongs to the
repository-scope verdict; a change to `package.json`, an eslint configuration, `scripts/` or a lockfile forces the package-level rules (`compile-runs-layout`, `eslint-config`) in file scope.
Test: a repository with one red file and one touched clean file gives exit 0 in file scope for the clean file and exit
1 in repository scope, and a commit that changes only the `compile` script of a `package.json` runs the package-level rules in file scope and is refused when they are red (`test/guidelines/scope.test.ts`).
Enforced at: commit, task end, release.

**R5.11 The three gates.** The validator MUST gate three points: (1) commit: a `git commit` whose committed files are red
is refused before it runs; (2) task end: a task is not marked done while any file it wrote is red, and a worker's first
stop is blocked while a file it wrote is red; the breaches are shown on top of the result; (3) release: the
whole-repository run is green, recorded in the release record of R4.15 from Stage 4 and, before Stage 4, in the stage's record under `site/docs/qa/`.
Test: a commit with a red file is refused; a task that wrote a red file ends `failed`; a release with a red repository
run exits 1 (`test/guidelines/gates.test.ts`).
Enforced at: commit, task end, release.

**R5.12 Exit codes and refusal of misuse.** The validator MUST exit 0 with `guidelines: GREEN` when clean, exit 1 with
a `guidelines: RED, <n> breach(es)` line and one `[rule-id]` line per breach otherwise, and MUST refuse a call it does
not understand (a flag other than `--files`) with a message and a non-zero exit; a check that exited 1 with no
offender line MUST raise an error rather than report green.
Test: the three outcomes are asserted on fixtures, including a stub check that exits 1 with no line, which fails the
validator itself (`test/guidelines/exit.test.ts`).
Enforced at: commit, task end, release.

**R5.13 Merged.** Merged into R4.15.

**R5.14 Merged.** Merged into R4.15.

### Index of requirements

| id | summary | enforcement point | test (placeholder) |
|---|---|---|---|
| R0.a | registry: refusal classes, locality, counting, dissent rule, carried record | G22 | registry check of G22 |
| R0.b | registry: signed structures and hash domains, prefix, signer, fields | G22 | registry check of G22 |
| R0.c | registry: runtime record fields, units, readers, value holders; ledger-head declaration | G22 | registry check of G22 |
| R0.d | registry: grant data model, `grantIndex`, `grantKey`, leaf, retention, erasure | G22 | registry check of G22 |
| R0.e | registry: admission definitions (subtree share, grant-counter record, live-grant cap, revocation verification share, reserved pool) | G22 | registry check of G22 |
| R1.1 | one sealed file or folder, plugin manifest (name, kind class, fuel, runtime range, permissions each with a purpose sentence in each language offered, place and tools, author key) inside the seal; kind class fixed by source | compile, load | `test/lumi.seal.unit.test.ts` |
| R1.2 | no import, require, URL, escape from the seal; AST scan, extension allow-list; one-file and folder import rules | compile, commit, load | `test/lumi.seal.forms.test.ts`, `test/lumi.seal.inside.test.ts` |
| R1.3 | input only via `Lumi.params` and `Lumi.read` | load, runtime | `test/lumi.capability.test.ts` |
| R1.4 | seal cid over canonical layout | release, load | `test/lumi.cid.test.ts` |
| R1.5 | every signed structure and hash domain is a row of R0(b) with its own prefix and, for a signed row, a type tag | runtime | `test/lumi.domain.test.ts` |
| R1.6 | one injected versioned API | load, release | `test/lumi.surface.test.ts` |
| R1.7 | runtime has its own cid | release | `test/lumi.runtime-cid.test.ts` |
| R1.8 | runtime record (fields of R0(c)) signed by `t` member keys | load | `test/lumi.runtime-sign.test.ts` |
| R1.9 | verdict records (action cid, runtime cid), input digest and request id | runtime | `test/lumi.pair.test.ts` |
| R1.10 | no clock, randomness, network, filesystem | runtime, release | `test/lumi.determinism.test.ts` |
| R1.11 | size caps of seals | load | `test/lumi.caps.test.ts` |
| R1.12 | the API table and its kind classes | load, runtime | `test/lumi.api-table.test.ts` |
| R1.13 | one verdict by `Lumi.setResponse` | runtime | `test/lumi.response.test.ts` |
| R1.14 | runtime upgrade, `notAfter`, revocation, security-patch `notBefore` | load, release | `test/lumi.runtime-upgrade.test.ts` |
| R1.15 | official entry names its runtime range | load | `test/lumi.official-range.test.ts` |
| R1.16 | Merged into R1.2 | R1.2 | R1.2 |
| R1.17 | no run on a stale runtime view | runtime | `test/lumi.runtime-stale.test.ts` |
| R2.1 | sandbox without host capabilities | runtime | `test/lumi.isolation.test.ts` |
| R2.2 | key used only by the host over `verdictDigest` | runtime | `test/lumi.sign-only.test.ts` |
| R2.3 | fresh sandbox per execution | runtime | `test/lumi.fresh-sandbox.test.ts` |
| R2.4 | frozen intrinsics, builtin allow-list | load, runtime | `test/lumi.intrinsics.test.ts` |
| R2.5 | identical verdict bodies | runtime, release | `test/lumi.verdict-equal.test.ts` |
| R2.6 | fuel metering with builtin cost functions, not wall-clock | runtime | `test/lumi.fuel.test.ts` |
| R2.7 | limits per kind class table | load, runtime | `test/lumi.limits.test.ts` |
| R2.8 | signed `REFUSED:<class>`, classes and counting from R0(a) | runtime | `test/lumi.refusal.test.ts` |
| R2.9 | crash containment, supervisor | runtime, release | `test/lumi.containment.test.ts` |
| R2.10 | poison-input quarantine | runtime | `test/lumi.quarantine.test.ts` |
| R2.11 | per-requester token bucket, only for keys with stake or inviter | runtime | `test/lumi.budget.test.ts` |
| R2.12 | no unbounded amplification: node-local admission, no cross-node counter | runtime, release | `test/lumi.amplify.test.ts` |
| R2.13 | seal cid verified at every load | load | `test/lumi.load-verify.test.ts` |
| R2.14 | code cache keyed by cid pair | load | `test/lumi.cache.test.ts` |
| R2.15 | budget stake locked until `BOND_WINDOW` epochs after | runtime | `test/lumi.stake-lock.test.ts` |
| R2.16 | limit numbers are runtime-record values | load | `test/lumi.limits-record.test.ts` |
| R2.17 | trust order of the kind classes | release | `test/lumi.limits-order.test.ts` |
| R2.18 | metering constants: 100 ms bucket and 1,000,000 fuel quantum as starting values, changed only by a runtime record | runtime, release | `test/lumi.metering-constants.test.ts` |
| R2.19 | per-requester work bound: tokens spent at the node before the run, tokens at most `c` per node, plugin bundles at most `floor(c x (n - b) / (t - b))` | runtime, release | `test/lumi.work-bound.test.ts` |
| R2.20 | a refusal earns no credit and is never a dissent or slash | runtime | `test/lumi.refusal-dissent.test.ts` |
| R3.1 | plugin rejected before running on limits | load | `test/plugin.load-limits.test.ts` |
| R3.2 | static injection scan | load | `test/plugin.scan.test.ts` |
| R3.3 | defence beyond the scan | runtime | `test/plugin.defence-in-depth.test.ts` |
| R3.4 | no host self-reference | runtime | `test/plugin.no-host-name.test.ts` |
| R3.5 | official list and plugin listing signed by `t` keys | load | `test/lumi.official-list.test.ts` |
| R3.6 | official is limited like any action | runtime, release | `test/lumi.official-limited.test.ts` |
| R3.7 | no user data without a grant | runtime | `test/plugin.no-grant.test.ts` |
| R3.8 | permission catalog with per-permission run and bit caps | load, runtime | `test/plugin.catalog.test.ts` |
| R3.9 | permission screen with purpose, controller attestation and risk line | commit, release | `site/src/plugin/authorize.screen.test.tsx` |
| R3.10 | grant signed by user and network, run and bit budget, bounded expiry, shown-text digest | load, runtime | `test/plugin.grant-sign.test.ts`, `site/src/plugin/authorize.digest.test.tsx`, `test/plugin.region-bind.test.ts` |
| R3.11 | executor checks both signatures | runtime | `test/plugin.executor-check.test.ts` |
| R3.12 | read outside grant refused | runtime | `test/plugin.read-outside.test.ts` |
| R3.13 | only a shape-checked verdict leaves | runtime | `test/plugin.verdict-shape.test.ts` |
| R3.14 | user-signed revocation takes effect at once at the holder | runtime | `test/plugin.revoke.test.ts` |
| R3.15 | revocation propagation bound, every run consults the grant log | runtime, release | `test/plugin.revoke-propagate.test.ts`, `test/plugin.log-consulted.test.ts` |
| R3.16 | grants do not transfer between cids | runtime | `test/plugin.no-transfer.test.ts` |
| R3.17 | grant history visible to the person | commit, release | `site/src/plugin/grant-history.screen.test.tsx` |
| R3.18 | verdict entropy bound audit | load, release | `test/plugin.entropy.test.ts` |
| R3.19 | plugin verdicts carry no authority | runtime | `test/plugin.no-authority.test.ts` |
| R3.20 | disclosure bounded across runs by the grant | runtime | `test/plugin.disclosure-budget.test.ts` |
| R3.21 | authorize button only after the whole list | commit, release | `site/src/plugin/authorize.gate.test.tsx` |
| R3.22 | Merged into R3.10 | R3.10 | R3.10 |
| R3.23 | no confusable plugin name | release | `test/plugin.name-confusable.test.ts` |
| R3.24 | required means necessary; no service conditioned on an optional permission | release | `test/plugin.no-conditioning.test.ts` |
| R3.25 | optional permissions are individual toggles | commit, release | `site/src/plugin/authorize.toggle.test.tsx` |
| R3.26 | author identity attested by `t` member keys; network withdrawal | runtime, release | `test/plugin.author-identity.test.ts` |
| R3.27 | run and bit counters are finalized records | runtime | `test/plugin.counter-finality.test.ts` |
| R3.28 | plugin result released only as a `t`-node bundle | runtime | `test/plugin.bundle-release.test.ts` |
| R3.29 | release latency is one 100 ms bucket | runtime | `test/plugin.release-latency.test.ts` |
| R3.30 | run stamp is the executor's finalized head | runtime | `test/plugin.sequence.test.ts` |
| R3.31 | Merged into R3.15 | R3.15 | R3.15 |
| R3.32 | members countersign a user-signed revocation within the round bound of R4.7 | runtime | `test/plugin.revoke-countersign.test.ts` |
| R3.33 | grant log prunable and outside the ledger | runtime, release | `test/plugin.log-structure.test.ts` |
| R3.34 | log leaves addressed and enumerated as R0(d) states | runtime | `test/plugin.log-keys.test.ts` |
| R3.35 | retention, purge and erasure as R0(d) states | runtime, release | `test/plugin.log-retention.test.ts` |
| R3.36 | no open-ended permission, grantor data only | load, runtime | `test/plugin.catalog-subject.test.ts` |
| R3.37 | excluded sensitive classes, minors | load, runtime | `test/plugin.catalog-excluded.test.ts` |
| R3.38 | a minor's refusal leaks nothing | runtime | `test/plugin.catalog-minor.test.ts` |
| R3.39 | grants resolve under the catalog version in force | load, runtime | `test/plugin.catalog-version.test.ts` |
| R4.1 | independent processes, keys, stores | release | `test/scale/independence.test.ts` |
| R4.2 | shapes n = 3, 7, 21, 51; stretch 101 | release | `test/scale/shapes.test.ts` |
| R4.3 | threshold with 2t > n, working value max(2, ceil(2n/3)) | release | `test/scale/threshold.test.ts` |
| R4.4 | tolerated count: 2t-n-1 safety, t-1 accountable safety, n-t liveness | release | `test/scale/tolerated.test.ts` |
| R4.5 | byzantine behaviours scheduled | release | `test/scale/byzantine.*.test.ts` |
| R4.6 | assertions (a) to (h) | release | `test/scale/assert.*.test.ts` |
| R4.7 | pass/fail thresholds | release | `test/scale/thresholds.test.ts` |
| R4.8 | Merged into R4.15 | R4.15 | R4.15 |
| R4.9 | missing, stale or red record blocks from Stage 4 | release | `test/scale/release-block.test.ts` |
| R4.10 | harness negative controls | release | `test/scale/harness-negative.test.ts` |
| R4.11 | process count equal to n recorded | release | `test/scale/record-processes.test.ts` |
| R4.12 | runtime assertions start at the stage that ships the runtime | release | `test/scale/stage-carveout.test.ts` |
| R4.13 | Merged into R4.15 | R4.15 | R4.15 |
| R4.14 | Merged into R4.15 | R4.15 | R4.15 |
| R4.15 | release evidence chain: default-deny reviewed paths, review signatures, attester-computed record, validity, `reduced` records, lockfile | commit, release | `test/scale/record.test.ts`, `test/scale/record-validity.test.ts`, `test/scale/thresholds.test.ts`, `test/scale/security-patch.test.ts`, `test/guidelines/no-bypass.test.ts`, `test/guidelines/lockfile.test.ts` |
| R5.1 | source drawers: `not-a-drawer`, `loose-entry` | compile, commit | `test/guidelines/drawers.test.ts` |
| R5.2 | `constant-outside-constants` | compile, commit | `test/guidelines/constants.test.ts` |
| R5.3 | `type-outside-interfaces`, `interfaces-types-only` | compile, commit | `test/guidelines/interfaces.test.ts` |
| R5.4 | `drawer-import`, `cross-module-type` | compile, commit | `test/guidelines/imports.test.ts` |
| R5.5 | `compile-runs-layout` | compile | `test/guidelines/compile.test.ts` |
| R5.6 | `eslint-config`, `eslint-installed`, `eslint` | commit | `test/guidelines/lint.test.ts` |
| R5.7 | `lumi-seal` | compile, commit, load | `test/guidelines/seal.test.ts` |
| R5.8 | `python-layout` | commit | `test/guidelines/python.test.ts` |
| R5.9 | types exported only from `interfaces/` | compile, release | `test/guidelines/type-surface.test.ts` |
| R5.10 | whole-repository and file scope | commit, task end, release | `test/guidelines/scope.test.ts` |
| R5.11 | three gates: commit, task end, release | commit, task end, release | `test/guidelines/gates.test.ts` |
| R5.12 | exit codes, misuse refused | commit, task end, release | `test/guidelines/exit.test.ts` |
| R5.13 | Merged into R4.15 | R4.15 | R4.15 |
| R5.14 | Merged into R4.15 | R4.15 | R4.15 |

