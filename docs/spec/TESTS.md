# TESTS: every rule R-id of Merry 5.2 -> its test, at a pinned network commit

**Access.** The links below point into `github.com/angstone/angstone-network`, a private repository. They resolve only for collaborators of that repository (today: only the founders). Nothing here is published; this file lives in the private architecture repository.

**Pinned commit:** `b5956b089faf9bd74a717da0191e6b33ef1b4fd6` (`origin/dev` of angstone-network when this was computed). **Run:** a clean clone of that commit, `npm ci`, then `npx vitest run <the 30 test files named by the rules>` on 2026-11-23: 438 tests, 438 passed, 0 failed, 0 skipped, 0 todo (raw: `docs/spec/TESTS.json`).

**Site pin (S10, 2026-11-23):** the four rows with a `site/src/plugin/` file are in `github.com/angstone/angstone-site` (private, same access), commit `d3fbba6eb9250e2c12f2ea34d5897c52d6cf6ba7` (`origin/dev`), `npm test` there: 245 files, 2253 passed, 2 skipped, 9 todo; the failures of that run (10 deterministic, all in files S10 does not touch and equally red at the base commit `13532e6`, plus one timing flake) are listed in that commit's `docs/qa/20261123T2245Z-merry5-s10-record.md`. `partial` for R3.17: its Test names a clause (a client restored from the user key alone walks `liveLink`) that is an `it.todo` until the grant log of S9 exists; the other clauses pass.

**Spec:** `merry-5.2.1` (the 5.2 text, commit 8157617, with its release token corrected); the `Test:` paragraph of each rule in `docs/spec/02-runtime.md` to `06-guidelines.md` names the files; the spec names files, not individual test titles, so the *test name* column gives the top-level suite title(s) found in the file by the run. Spec paths `test/...` are the network repo's paths. R0(a)-R0(e) are definitions without tests (not counted in the 105).

**Status words.** `pass`: every named file exists at the pin and every test in it passed this session. `pending-stage-N`: the named file does not exist at the pin; the rule belongs to a stage not yet implemented (stage = first stage file `docs/spec/15..19` that names the R-id, else its family: R1-R3 -> 5, R4 -> 4). `partial`: some named files pass, others pending. `merged`: the rule is a stub merged into another R-id, which carries the test. A pending rule is not a passing rule.

## Counts

| status | R-ids |
|---|---|
| merged | 8 |
| pass | 32 |
| partial | 1 |
| pending-stage-4 | 11 |
| pending-stage-5 | 51 |
| pending-stage-6 | 1 |
| pending-stage-7 | 1 |
| **total** | **105** |

No test failed and none was skipped. No named-but-missing file exists under another name at the pin (checked against `git ls-files`: the only lumi/plugin/scale test files are those listed here and `test/relay.scale.test.ts`). `pass` proves the named tests run green, not that they cover every clause of the rule.

## Table

| R-id | rule | test file # suite | link at pin | status |
|---|---|---|---|---|
| R1.1 | One seal. | `test/lumi.seal.unit.test.ts`#R1.1 one seal (15/15 tests) | [test/lumi.seal.unit.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.unit.test.ts) | pass |
| R1.2 | No external dependency. | `scripts/check-seal.mjs` | [scripts/check-seal.mjs](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/scripts/check-seal.mjs) | script-exercised |
|  |  | `test/lumi.seal.forms.test.ts`#R1.2 a one-file seal imports nothing at all / R1.2 the compiled bytes are what is scanned, in a folder seal too (30/30 tests) | [test/lumi.seal.forms.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.forms.test.ts) | pass |
|  |  | `test/lumi.seal.inside.test.ts`#R1.2 inside the folder (8/8 tests) | [test/lumi.seal.inside.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.inside.test.ts) | pass |
| R1.3 | Everything it needs arrives as data. | `test/lumi.capability.test.ts` | (planned; not in repo) | pending-stage-5 |
| R1.4 | The seal cid. | `test/lumi.cid.test.ts`#R1.4 the seal cid (8/8 tests) | [test/lumi.cid.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.cid.test.ts) | pass |
| R1.5 | Domain separation. | `test/lumi.domain.test.ts`#R1.5 domain separation (18/18 tests) | [test/lumi.domain.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.domain.test.ts) | pass |
| R1.6 | The runtime injects one small, versioned API. | `test/lumi.surface.test.ts`#R1.6 the runtime injects one small, versioned API (11/11 tests) | [test/lumi.surface.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.surface.test.ts) | pass |
| R1.7 | The runtime is content-addressed. | `test/lumi.runtime-cid.test.ts`#R1.7 the runtime is content-addressed (6/6 tests) | [test/lumi.runtime-cid.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-cid.test.ts) | pass |
| R1.8 | The runtime is signed by the network. | `test/lumi.runtime-sign.test.ts`#R1.8 a runtime record needs t distinct member signatures / R1.8 a member signs only a record it can stand behind / R1.8  (54/54 tests) | [test/lumi.runtime-sign.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-sign.test.ts) | pass |
| R1.9 | Behaviour is fixed by the pair. | `test/lumi.pair.test.ts` | (planned; not in repo) | pending-stage-5 |
| R1.10 | Determinism. | `test/lumi.determinism.test.ts` | (planned; not in repo) | pending-stage-5 |
| R1.11 | Size caps. | `test/lumi.caps.test.ts`#R1.11 size caps (9/9 tests) | [test/lumi.caps.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.caps.test.ts) | pass |
| R1.12 | The API. | `test/lumi.api-table.test.ts` | (planned; not in repo) | pending-stage-5 |
| R1.13 | What an action returns. | `test/lumi.response.test.ts` | (planned; not in repo) | pending-stage-5 |
| R1.14 | Runtime upgrade. | `test/lumi.runtime-upgrade.test.ts`#R1.14 rollout record admission / R1.14 the runtime in force / R1.14 the quoted epoch against the node head / R1.14 revoc (38/38 tests) | [test/lumi.runtime-upgrade.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-upgrade.test.ts) | pass |
| R1.15 | The official action is bound to its runtime. | `test/lumi.official-range.test.ts`#R1.15 the official action is bound to its runtime (3/3 tests) | [test/lumi.official-range.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-range.test.ts) | pass |
| R1.16 | Merged. | (stub) | | merged -> R1.2 (pass) |
| R1.17 | No run on a stale runtime view. | `test/lumi.runtime-stale.test.ts`#R1.17 a node holding a fresh head runs / R1.17 (1) a node cut off from the ledger refuses runs once its head is stale /  (29/29 tests) | [test/lumi.runtime-stale.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-stale.test.ts) | pass |
| R2.1 | Isolation. | `test/lumi.isolation.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.2 | The key is used only by the host over `verdictDigest`. | `test/lumi.sign-only.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.3 | A fresh sandbox for every execution. | `test/lumi.fresh-sandbox.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.4 | Frozen intrinsics. | `test/lumi.intrinsics.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.5 | Deterministic verdicts. | `test/lumi.verdict-equal.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.6 | Fuel, not wall-clock. | `test/lumi.fuel.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.7 | Limits per kind class. | `test/lumi.limits.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.8 | Signed refusal on overrun. | `test/lumi.refusal.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.9 | Crash containment. | `test/lumi.containment.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.10 | Poison-input quarantine. | `test/lumi.quarantine.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.11 | Per-requester rate budgets. | `test/lumi.budget.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.12 | No unbounded amplification. | `test/lumi.amplify.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.13 | The seal cid is verified before every load. | `test/lumi.load-verify.test.ts`#R2.13 the seal cid is verified before every load (15/15 tests) | [test/lumi.load-verify.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.load-verify.test.ts) | pass |
| R2.14 | The code cache is by cid. | `test/lumi.cache.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.15 | Budget stake is locked. | `test/lumi.stake-lock.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.16 | The limit numbers are runtime-record values. | `test/lumi.limits-record.test.ts`#R2.16 the limit numbers are runtime-record values (5/5 tests) | [test/lumi.limits-record.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-record.test.ts) | pass |
| R2.17 | Trust order of the kind classes. | `test/lumi.limits-order.test.ts`#R2.17 trust order of the kind classes (7/7 tests) | [test/lumi.limits-order.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-order.test.ts) | pass |
| R2.18 | Metering constants. | `test/lumi.metering-constants.test.ts`#R2.18 metering constants (9/9 tests) | [test/lumi.metering-constants.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.metering-constants.test.ts) | pass |
| R2.19 | Per-requester work bound. | `test/lumi.work-bound.test.ts` | (planned; not in repo) | pending-stage-5 |
| R2.20 | A refusal earns no credit and is never a dissent or slash. | `test/lumi.refusal-dissent.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.1 | Rejection before running. | `test/plugin.load-limits.test.ts` | (planned; not in repo) | pending-stage-6 |
| R3.2 | Code-injection refusal at load. | `test/plugin.scan.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.3 | Refusal does not rest on the scan alone. | `test/plugin.defence-in-depth.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.4 | No self-reference to the host. | `test/plugin.no-host-name.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.5 | The official list. | `test/lumi.official-list.test.ts`#R3.5 the official list / R3.5 classification of a cid / R3.5 the plugin listing / R3.5 the withdrawalRoot set / R3.5 the (45/45 tests) | [test/lumi.official-list.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-list.test.ts) | pass |
| R3.6 | What official means. | `test/lumi.official-limited.test.ts`#R3.6 what official means (8/8 tests) | [test/lumi.official-limited.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-limited.test.ts) | pass |
| R3.7 | A plugin reads no user data without a grant. | `test/plugin.no-grant.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.8 | The permission catalog. | `test/plugin.catalog.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.9 | The screen shows the list. | `site/src/plugin/authorize.screen.test.tsx`#R3.9: the screen shows the list (9/9 tests) | [site/src/plugin/authorize.screen.test.tsx](https://github.com/angstone/angstone-site/blob/d3fbba6eb9250e2c12f2ea34d5897c52d6cf6ba7/src/plugin/authorize.screen.test.tsx) | pass |
| R3.10 | The grant record. | `site/src/plugin/authorize.digest.test.tsx` | (planned; not in repo) | pending-stage-5 |
|  |  | `test/plugin.grant-sign.test.ts` | (planned; not in repo) | pending-stage-5 |
|  |  | `test/plugin.region-bind.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.11 | The executor checks both signatures. | `test/plugin.executor-check.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.12 | Reads outside the grant are refused. | `test/plugin.read-outside.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.13 | Nothing leaves but the verdict. | `test/plugin.verdict-shape.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.14 | Revocation. | `test/plugin.revoke.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.15 | Revocation propagation bound. | `test/plugin.log-consulted.test.ts` | (planned; not in repo) | pending-stage-5 |
|  |  | `test/plugin.revoke-propagate.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.16 | Grants do not transfer. | `test/plugin.no-transfer.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.17 | The grant history is shown to the person. | `site/src/plugin/grant-history.screen.test.tsx`#R3.17: the grant history is shown to the person (11/11 tests, 1 todo: the restored-client clause waits on S9) | [site/src/plugin/grant-history.screen.test.tsx](https://github.com/angstone/angstone-site/blob/d3fbba6eb9250e2c12f2ea34d5897c52d6cf6ba7/src/plugin/grant-history.screen.test.tsx) | partial |
| R3.18 | The entropy audit. | `test/plugin.entropy.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.19 | Plugin results never become authority. | `test/plugin.no-authority.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.20 | Disclosure is bounded across runs. | `test/plugin.disclosure-budget.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.21 | The permission screen enables authorization only after the whole list. | `site/src/plugin/authorize.gate.test.tsx`#R3.21: authorize is enabled only after the whole list (7/7 tests) | [site/src/plugin/authorize.gate.test.tsx](https://github.com/angstone/angstone-site/blob/d3fbba6eb9250e2c12f2ea34d5897c52d6cf6ba7/src/plugin/authorize.gate.test.tsx) | pass |
| R3.22 | Merged. | (stub) | | merged -> R3.10 (pending-stage-5) |
| R3.23 | No confusable plugin name. | `test/plugin.name-confusable.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.24 | Required means necessary; no service conditioned on an optional permission. | `test/plugin.no-conditioning.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.25 | Optional permissions are individual toggles. | `site/src/plugin/authorize.toggle.test.tsx`#R3.25: optional permissions are individual toggles (5/5 tests) | [site/src/plugin/authorize.toggle.test.tsx](https://github.com/angstone/angstone-site/blob/d3fbba6eb9250e2c12f2ea34d5897c52d6cf6ba7/src/plugin/authorize.toggle.test.tsx) | pass |
| R3.26 | Author identity is attested, and the network may withdraw. | `test/plugin.author-identity.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.27 | The run and bit counters are finalized records. | `test/plugin.counter-finality.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.28 | A plugin result reaches a requester only as an agreed bundle. | `test/plugin.bundle-release.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.29 | Release latency is one bucket. | `test/plugin.release-latency.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.30 | The run stamp is the executor's finalized head. | `test/plugin.sequence.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.31 | Merged. | (stub) | | merged -> R3.15 (pending-stage-5) |
| R3.32 | Members countersign a user-signed revocation. | `test/plugin.revoke-countersign.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.33 | The grant log is prunable and outside the ledger. | `test/plugin.log-structure.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.34 | Log leaves are keyed by a grant-held secret. | `test/plugin.log-keys.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.35 | Revoked entries are retained until expiry, then purged. | `test/plugin.log-retention.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.36 | No open-ended permission, grantor data only. | `test/plugin.catalog-subject.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.37 | Excluded sensitive classes. | `test/plugin.catalog-excluded.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.38 | A minor's refusal leaks nothing. | `test/plugin.catalog-minor.test.ts` | (planned; not in repo) | pending-stage-5 |
| R3.39 | Grants resolve under the catalog version in force. | `test/plugin.catalog-version.test.ts` | (planned; not in repo) | pending-stage-5 |
| R4.1 | Independent nodes. | `test/scale/independence.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.2 | The shapes. | `test/scale/shapes.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.3 | Threshold. | `test/scale/threshold.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.4 | Tolerated fault count. | `test/scale/tolerated.test.ts` | (planned; not in repo) | pending-stage-7 |
| R4.5 | What a byzantine member may do. | test/scale/byzantine.*.test.ts (pattern, no file exists) | not in repo | pending-stage-4 |
| R4.6 | What must be asserted. | test/scale/assert.*.test.ts (pattern, no file exists) | not in repo | pending-stage-4 |
| R4.7 | Thresholds for passing. | `test/scale/thresholds.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.8 | Merged. | (stub) | | merged -> R4.15 (pending-stage-4) |
| R4.9 | A missing, stale or red record blocks the stage. | `test/scale/release-block.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.10 | The harness is itself tested. | `test/scale/harness-negative.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.11 | Cost of the gate. | `test/scale/record-processes.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.12 | The runtime assertions start with the runtime. | `test/scale/stage-carveout.test.ts` | (planned; not in repo) | pending-stage-4 |
| R4.13 | Merged. | (stub) | | merged -> R4.15 (pending-stage-4) |
| R4.14 | Merged. | (stub) | | merged -> R4.15 (pending-stage-4) |
| R4.15 | Release evidence chain. | `scripts/check-seal.mjs` | [scripts/check-seal.mjs](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/scripts/check-seal.mjs) | script-exercised |
|  |  | `site/src/plugin/authorize.gate.test.tsx` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/guidelines/lockfile.test.ts` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/guidelines/no-bypass.test.ts` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/scale/record-validity.test.ts` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/scale/record.test.ts` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/scale/security-patch.test.ts` | (planned; not in repo) | pending-stage-4 |
|  |  | `test/scale/thresholds.test.ts` | (planned; not in repo) | pending-stage-4 |
| R5.1 | The source drawers. | `test/guidelines/drawers.test.ts`#R5.1 the source drawers (4/4 tests) | [test/guidelines/drawers.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/drawers.test.ts) | pass |
| R5.2 | Constants in their own files. | `test/guidelines/constants.test.ts`#R5.2 constants in their own files (10/10 tests) | [test/guidelines/constants.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/constants.test.ts) | pass |
| R5.3 | Types and interfaces in their own files. | `test/guidelines/interfaces.test.ts`#R5.3 types and interfaces in their own files (8/8 tests) | [test/guidelines/interfaces.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/interfaces.test.ts) | pass |
| R5.4 | Constants and interfaces are reusable. | `test/guidelines/imports.test.ts`#R5.4 constants and interfaces are reusable: imports go downward only (8/8 tests) | [test/guidelines/imports.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/imports.test.ts) | pass |
| R5.5 | The layout check runs in compile. | `test/guidelines/compile.test.ts`#R5.5 the layout check runs in compile (10/10 tests) | [test/guidelines/compile.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/compile.test.ts) | pass |
| R5.6 | Lint. | `test/guidelines/lint.test.ts`#R5.6 lint (12/12 tests) | [test/guidelines/lint.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/lint.test.ts) | pass |
| R5.7 | The seal check for Lumi Actions. | `test/guidelines/seal.test.ts`#R5.7 the seal check (10/10 tests) | [test/guidelines/seal.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/seal.test.ts) | pass |
| R5.8 | Python packages. | `test/guidelines/python.test.ts`#R5.8 the Python layout rule / R5.8 the rule in file scope and at the commit gate / R5.8 the import reader (28/28 tests) | [test/guidelines/python.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/python.test.ts) | pass |
| R5.9 | Types exported only from interfaces/. | `test/guidelines/type-surface.test.ts`#R5.9 types exported only from interfaces/ (5/5 tests) | [test/guidelines/type-surface.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/type-surface.test.ts) | pass |
| R5.10 | Scope. | `test/guidelines/scope.test.ts`#R5.10 scope (8/8 tests) | [test/guidelines/scope.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/scope.test.ts) | pass |
| R5.11 | The three gates. | `test/guidelines/gates.test.ts`#R5.11 the three gates (11/11 tests) | [test/guidelines/gates.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/gates.test.ts) | pass |
| R5.12 | Exit codes and refusal of misuse. | `test/guidelines/exit.test.ts`#R5.12 exit codes and refusal of misuse (6/6 tests) | [test/guidelines/exit.test.ts](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/exit.test.ts) | pass |
| R5.13 | Merged. | (stub) | | merged -> R4.15 (pending-stage-4) |
| R5.14 | Merged. | (stub) | | merged -> R4.15 (pending-stage-4) |
