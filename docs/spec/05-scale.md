**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

### R4 Scale proof as a release gate

A stage from Stage 4 on (the set grows past 2) ships only when multi-node tests prove it at scale. Stages 0 to 3 run
the shapes n = 1 (t = 1) and n = 2 (t = 2) only, and their own condition passes them; R4.9 is an extra condition of
Stage 4 and later. A result at one node, at two nodes, or against a simulator that shares code, keys or a store between
members, proves nothing about agreement at scale, and MUST NOT release a stage from Stage 4 on.

**R4.1 Independent nodes.** A scale test MUST run each member as a separate OS process with its own key, its own
store directory and its own sandbox pool, joined only through the relay of the stage under test (the carrier of Stage 5 from Stage 5); no member MAY
share memory, a key, a database file or a module-level object with another.
Test: the harness records the PID, key fingerprint and store path of each member and asserts all are pairwise
distinct before any assertion runs (`test/scale/independence.test.ts`).
Enforced at: release.

**R4.2 The shapes.** From Stage 4 on, the gate MUST run the full battery at n = 3, 7, 21 and 51; n = 51 is the required scale shape;
n = 101 is a stretch gate whose result is recorded and whose failure is reported but does not by itself refuse a
stage that passed the required shapes; the harness MUST accept any larger n and run it when asked.
Test: the harness refuses to write a release record unless the shapes 3, 7, 21 and 51 each appear with a result
(`test/scale/shapes.test.ts`).
Enforced at: release.

**R4.3 Threshold.** For each n the threshold t MUST satisfy `2t > n`, with `t = max(2, ceil(2n/3))` as the
working value (OI-11 alternative a, pending its ruling) for n of 3 or more, and `t = n` for the Stage 0 to 3 shapes n = 1 and n = 2;
the harness MUST refuse a configuration with `2t <= n`.
Test: `t` for n = 3, 7, 21, 51, 101 is 2, 5, 14, 34, 68; a configuration with n = 21 and t = 10 is refused
(`test/scale/threshold.test.ts`).
Enforced at: release.

**R4.4 Tolerated fault count.** The number of byzantine members that safety must survive, `f`, is at most `t - 1`
members: no set of members smaller than `t` produces any of: a seal other than a veto sealed at VETO_QUORUM (which
confirms nothing, Stage 7), a checkpoint, a counted verdict; for byzantine count `f < 2t - n` no two honest devices
read conflicting finals (safety); for `2t - n <= f <= t - 1` two conflicting quorums MAY exist (two quorums share at least
`2t - n` members) and the guarantee is accountable safety only: when two devices exchange conflicting finals, a
double-seal proof naming at least `2t - n` members is produced and the doubly sealing members are slashable (Stage 7);
liveness is required only while at least `t` honest members are reachable, i.e. while byzantine plus offline members
number at most `n - t`; for the tolerated count the gate uses `f = n - t` for liveness, `f = 2t - n - 1` for safety and
`f = t - 1` for accountable safety; for n = 51 and t = 34 that is 17, 16 and 33.
Test: with exactly `t - 1` byzantine members acting together no such seal, no such checkpoint and no counted verdict is produced by them alone;
with `f = 2t - n - 1` no two honest devices read conflicting finals, and with `f = t - 1` two conflicting finals
exchanged between devices yield a double-seal proof naming at least `2t - n` members, the two cases asserted separately; with exactly `n - t` unavailable members the network still produces a counted verdict; with
`n - t + 1` unavailable members every request is refused, never answered wrongly (`test/scale/tolerated.test.ts`).
Enforced at: release.

**R4.5 What a byzantine member may do.** The fault schedule MUST include, per run, members that: sign two conflicting
verdicts for one action; withhold their verdict or their seal share; replay an earlier signed verdict or share under
a later epoch or sequence; delay their output beyond the round timeout; sign a verdict under an action cid, runtime
cid or seal cid that neither the signed seed, nor the official list (R3.5), nor a plugin that passed R3.1 carries
(`unknown-cid`, `cid-mismatch`); lie about their grant
log (claim a grant that was revoked, deny one that exists); and answer a plugin run with a wrong refusal; the `cid-mismatch`,
grant-log and plugin behaviours, and the scenarios `byzantine.rollout`, `byzantine.revocation`, `byzantine.stale-head`,
`byzantine.relay-replay` and `byzantine.flood-relays` (a budget flood through 1 and 20 relays), are scheduled only from
Stage 5 (R4.12), and at Stage 4 the schedule holds the first four plus a verdict under a cid the signed seed lacks
(`unknown-cid`, a node-level admission refusal of 1.3, not a `REFUSED:<class>` of R2.8 and never counted as a refusal-side verdict).
Test: one named scenario per behaviour, with the seed and schedule fixed, in `test/scale/byzantine.*.test.ts`; the
rollout, revocation and stale-head scenarios assert the refusals of R1.14, R3.15 and R1.17, and the flood scenario the
bounds of R2.12 and R2.19.
Enforced at: release.

**R4.6 What must be asserted.** In every run of every shape the harness MUST assert all of:
(a) agreement: every honest node that counts a verdict for an action counts the same verdict bytes;
(b) safety: no set smaller than `t` produces any of: a seal other than a veto sealed at VETO_QUORUM (which confirms
nothing), a checkpoint, a counted verdict; for `f < 2t - n` no two honest devices read conflicting finals, and for
`2t - n <= f <= t - 1` accountable safety only, a double-seal proof naming at least `2t - n` members, the two cases
asserted separately, and two outputs of one node for one request id, with the same `quotedHeadEpoch` and a differing `readDigest`, yielding a double-output proof (R2.2) naming at least `2t - n` members (the double-output clause only from Stage 5, R4.12);
(c) liveness while byzantine plus offline members number at most `n - t`: a valid action reaches `t` counted verdicts
within the round bound of the shape, and beyond that count the network refuses and does not guess;
(d) determinism of the verdict bytes across nodes (R2.5): all honest nodes' verdict bytes for one action are
identical;
(e) grant enforcement across all nodes (R3; from Stage 5, R4.12): an ungranted read, a revoked grant and a one-byte changed plugin cid are
refused at every node, and no verdict derived from ungranted data is counted;
(f) runtime cid agreement (R1.8, R1.14; from Stage 5, R4.12): every honest node runs under the same runtime cid, and a node on a different
runtime is refused by the others;
(g) limits (from Stage 5, R4.12): a plugin over its fuel returns a signed refusal at every node and is counted nowhere as `valid`;
(h) store integrity: every honest store verifies after the run.
Test: one assertion function per letter, each with a negative control that injects the fault and expects the assertion
to fail (`test/scale/assert.*.test.ts`).
Enforced at: release.
Rationale: E-R4.6

**R4.7 Thresholds for passing.** A shape passes only when all assertions of R4.6 hold in at least 100 seeded runs, each
with its own seed (`H("angstone/lumi-seed/v1\0" || commit || index || beacon)`, `beacon` being the output of round `R` of the source pinned in the attester, `R` the first round whose publication time is later than the attester-recorded time at which the artifact digest was fixed; the attester refuses a record whose round is any other or whose source differs) and its own fault schedule, with zero violations of those of (a), (b), (d), (e), (f), (g) and
(h) asserted at that stage (R4.12), and a deterministic exhaustive corpus of fault schedules for n = 3 and n = 7 run
for the safety shape; every gate attempt of the lineage since the last signed record (any candidate tree) is appended to an append-only log keyed by that lineage (R4.15 clause 8) and its count stated in
the record (R4.15); (c) holds in at least 95 of those 100 liveness runs, and the failures MUST each be a typed refusal, never a
wrong verdict; the round bound of liveness is 3 round timeouts (the Delta of OI-32, working value 30 s, a proposal pending OI-32, not a default) at n <= 21 and 6 at
n > 21; the p99 latency of a verdict at n = 51 MUST be recorded.
Test: the harness computes pass/fail from the run table and exits 1 under any threshold miss; a table with one
violation of (a) among 100 fails; a table with 99 runs fails; a round bound of 6 timeouts is applied at n = 22 and 3 at
n = 21; a seed that is not `H("angstone/lumi-seed/v1\0" || commit || index || beacon)` is refused, as is a record with a beacon from an earlier round; a record without its attempt count, or without the
exhaustive n = 3 and n = 7 corpus, is refused (`test/scale/thresholds.test.ts`).
Enforced at: release.

**R4.8 Merged.** Merged into R4.15.

**R4.9 A missing, stale or red record blocks the stage.** A stage from Stage 4 on MUST NOT ship, deploy or serve when
its record is missing, is stale (R4.15), or is red.
Test: the release check exits 1 for each of the three conditions and 0 for a fresh, green record
(`test/scale/release-block.test.ts`); the deploy script runs it first.
Enforced at: release.

**R4.10 The harness is itself tested.** The harness MUST pass its own negative controls: a seeded broken member (a
node that signs two verdicts, a node on the wrong runtime) MUST make the corresponding assertion fail.
Test: each broken-member fixture makes its assertion exit 1 (`test/scale/harness-negative.test.ts`).
Enforced at: release.

**R4.11 Cost of the gate.** The battery MUST run on separate machines or containers when n exceeds the cores of the
host; running n = 51 on fewer than 51 cores in one container sharing a kernel is allowed only with every member
a separate process and the process count, equal to n, recorded in the release record.
Test: the record carries a process count equal to n (`test/scale/record-processes.test.ts`).
Enforced at: release.

**R4.12 The runtime assertions start with the runtime.** Assertions (e), (f), (g) of R4.6 and the runtime cid, the list
version and the runtime-record values digest of R4.15 MUST be asserted only from the stage that ships the runtime (Stage 5), and at Stage 4 the battery MUST
assert (a) to (d) and (h) with the double-output clause of (b) excluded; the behaviours and scenarios of R4.5 other than the first four and `unknown-cid` are scheduled only from Stage 5, and a Stage 4 record without them is accepted green; a Stage 4 record that carries any of (e), (f), (g), the runtime cid, the list version or the values digest is refused.
Test: a Stage 4 record without (e), (f), (g) and without a runtime cid is accepted green, and a Stage 4 record carrying a runtime cid is refused; a Stage 5 record missing any
of them is refused (`test/scale/stage-carveout.test.ts`).
Enforced at: release.

**R4.13 Merged.** Merged into R4.15.

**R4.14 Merged.** Merged into R4.15.

**R4.15 Release evidence chain.** A release record, its attestation and every review behind it MUST satisfy the following numbered clauses, built on one default-deny model: what is not named as trusted or as non-consensus is untrusted and reviewed. Each clause carries its own test.

1. The trusted base (the validator, the scale harness with its fixtures, fault schedules and negative controls, the hooks, the lint configuration and the linter package, the lockfile, and the attester's own pins) MUST be pinned by digest in the attester and MUST never be read from the tree under test, so that only the members and the code under test come from the tree, and a change to any element of the trusted base is a reviewed change (clause 3); the release-key set (one public key per natural person) and `RELEASE_HOLDERS_MIN` MUST be pinned in the attester, a change of the set is a clause-3 reviewed change signed by at least 2 holders other than the one added or removed, and a holder who authored or committed a commit (author as defined in clause 4) MUST NOT sign a review of it, by person and not by key.
Test: (1) a tree that edits the harness, its fixtures or its negative controls to print green obtains no attestation, and (2) a run whose computed harness digest differs from the pin is refused; (3) a record or review signed by a key outside the pinned set, a change of the set without 2 other holders, and a review of a commit by a second key of its author are each refused (`test/scale/record.test.ts`).

2. A gate MUST NOT be bypassed by a flag, an environment variable or a skip list that the committer or the task controls; a rule changes only by a change of the validator under its own tests; a client hook is advisory, and a server-side check on the pushed range MUST run the same pinned validator and MUST NOT hold a release key or `builderKey`.
Test: the validator's source has no read of a skip variable, running the commit gate with `--no-verify`-style shell forms still refuses a red commit, a commit that edits the validator and adds a breach is refused, a tracked file under a directory named `cache` inside `src/` is judged, and a server-side check configured with a release key or `builderKey` fails its own start (`test/guidelines/no-bypass.test.ts`).

3. The reviewed path set MUST be default-deny: every path under the repository is reviewed (two valid review signatures from release-key holders who are neither author nor committer of the commit, clause 4) unless it is on the non-consensus list pinned in the attester, and that list MUST exclude `site/src/plugin/**`, `scripts/**`, anything under `src/`, anything under `lumi/`, lockfiles, test files (`test/**` and `site/**/*.test.*`), the `scripts` (including `compile`) of any `package.json`, configuration files (including the eslint configuration and its plugins), the validator, `scripts/check-*.mjs`, the scale harness and the declaration of the list itself.
Test: a push that edits `scripts/check-seal.mjs`, a harness fixture, a lockfile entry, the `compile` script of a `package.json`, a file under `lumi/`, the declaration of the list, `site/src/plugin/authorize.gate.test.tsx` or any other test file without two valid review signatures is refused, a path not on the list is treated as reviewed, and a docs-only push needs no review (`test/guidelines/no-bypass.test.ts`).

4. Every review MUST be a signature by a release-key holder's release key of the `review signature` structure of R0(b) over the commit hash and the tree hash, verified by the attester and by the server-side check of clause 2 at every stage including before Stage 4; every commit in the range MUST carry a signature by its author's release key or registered author key (a signed commit), the attester maps the signer to a person, and a commit without one is refused; a holder whose key signed the commit, or who pushed it to the server-side check, counts as its author for clauses 4 and 5; each commit in the range that touches a path outside the non-consensus list MUST carry review signatures from 2 distinct holders who are neither author nor committer of the commit, and an unsigned such commit in the range blocks the record, and the signers of the record MUST include a holder who reviewed none of the range.
Test: a record with an unreviewed commit, one with a single reviewer, one whose review entry is a name and not a valid signature over the commit and tree hash, one with a review signed by the author or committer of the commit, one with an unsigned commit touching a path outside the non-consensus list, one with a commit with forged author fields reviewed by its true author, and one whose signers include no holder who reviewed none of the range are each refused, also before Stage 4, and a commit touching only listed paths needs no signature while a mixed commit does (`test/scale/record.test.ts`).

5. The release record MUST be signed by at least 2 release-key holders, none of whom authored (clause 4) or committed any commit in the range since the last signed record or holds the `builderKey`, and the record MUST state the number of holders of the pinned set (clause 1), which MUST be at least `RELEASE_HOLDERS_MIN` (default 5, OI-43).
Test: a record signed by fewer than 2 distinct holders, by a holder who authored a commit in the range or holds the `builderKey`, or stating fewer holders than `RELEASE_HOLDERS_MIN` is refused (`test/scale/record.test.ts`).

6. The attester MUST compute everything it signs (each digest of the harness files it launched, the lockfile, the member build artifacts and the pinned test list computed by the `attester digests` row of R0(b), and the run table digest, the `guidelines:` line from its own run of the pinned validator in the jail over the checkout, and the result and count of the unit suites named in the Test lines of R1 to R3, run from the pinned test list, computed by the attester itself) in a process separate from the tree under test, and the `builder attestation` structure of R0(b) MUST be signed only by that process with `builderKey`, which lives in a separate attestation process or HSM not reachable by code of the tree under test.
Test: a tree whose test reads `builderKey` or signs with it fails to obtain an attestation, a record whose hand-edited `guidelines:` line differs from the attester's own validator run fails verification, and a record that declares a harness digest or lockfile digest differing from the attester's computation, or a suite absent from the pinned test list, is refused (`test/scale/record.test.ts`).

7. Tree code (build, tests, members, and every validator step that executes tree-supplied code such as `compile`, the eslint configuration and plugins) MUST run in a jail with no network except the harness-owned private inter-member link (no route to any other host and no DNS), no key material, no secrets and no write access outside the scratch directory, and the harness MUST run in a separate process under a different identity, signing the run table with a key held only by the harness process, which the attester verifies, with the run-table directory neither writable nor readable by the jail.
Test: a planted compile script that reads an env secret or opens a socket to any host fails inside the jail while the members still reach each other over the private link, and a member that writes or replaces the run table obtains no attestation (`test/guidelines/no-bypass.test.ts`, `test/scale/record.test.ts`).

8. The seeds MUST derive from the pinned public beacon round published after the artifact digest is fixed (`H("angstone/lumi-seed/v1\0" || commit || index || beacon)`, R4.7), and the record MUST carry the beacon value, its round and the pinned public source; the attempt log is kept by lineage, the lineage being every candidate tree whose merge-base with the last signed record's commit is that commit, and the attester keys the log by that signed commit, never by a name or hash supplied by the committer, and refuses a candidate whose merge-base differs from the last signed record: every failed attempt of the lineage since the last signed record, on any tree of it, is listed in the record, and a candidate tree whose lineage has an attempt that violated (a), (b), (d), (e), (f), (g) or (h) MUST NOT be signed until the violating seed is replayed against the tree to be signed and root-caused in the record, the new attempt including that seed.
Test: a seed that is not `H("angstone/lumi-seed/v1\0" || commit || index || beacon)` or a beacon from an earlier round is refused, a violating attempt followed by a green one without the replay of the violating seed is refused, also when the violating attempt was on another tree of the lineage (one differing only in a comment), a re-rooted tree (a fresh branch, a squashed root or a changed commit message) after a violating attempt is refused, and the attester refuses a record whose failed attempts contain a safety violation without the replay (`test/scale/thresholds.test.ts`, `test/scale/record.test.ts`).

9. The record MUST name the commit hash (equal to `git rev-parse HEAD` at the gate), the n values with their t, the seeds, the gate-attempt count, every run attempted (failed ones included), the fault schedules (by digest and in full), one member build artifact digest per shipped target (platform, arch, host runtime build; each MUST equal the deployed artifact's digest for that target), the runtime cid, the list version and the runtime-record values digest of R0(b) from the stage that ships the runtime (R4.12), the per-assertion results with counts, the process count of each shape (equal to its n, R4.11), the p99 verdict latency at n = 51, the number of holders of the pinned set, the beacon value, its round and the pinned source, the failed-attempt list of the lineage, the harness digest, the lockfile digest, the unit-suite result and count and the pinned-test-list digest (clause 6), the `guidelines:` result of R5.11, `reduced` when the record is from clause 11, the `builderKey` and the verdict pass or fail; the harness MUST run in a clean checkout on the builder machine, MUST run at least `ceil(n/4)` members per target, MUST assert equal R2.5 corpus bytes across targets, MUST refuse to sign if the checkout hash differs from the attested one; the deploy script refuses a target absent from the record, and the record is stored with the stage's documentation under `site/docs/qa/`.
Test: the record schema is validated, its commit equals `git rev-parse HEAD` at the gate, it lists every attempted run and one digest per target, a target absent from it is refused by the deploy script, its artifact digests equal the deployed ones, and it carries the `guidelines:` result, the beacon and its source, the harness digest, the process count and the p99 latency (`test/scale/record.test.ts`).

10. A record MUST be valid if and only if every deployed target's artifact digest equals the recorded digest and, for a record that carries them (from Stage 5, R4.12), the runtime cid, the official-list version and the runtime-record values digest equal the recorded ones; a diff confined to the non-consensus list of clause 3 that leaves every target digest and the runtime cid unchanged reuses the record, and any path outside that list makes the record stale.
Test: a docs-only diff reuses the record, as does a diff confined to the non-consensus list that leaves the digests unchanged, and a diff of test files blocks (test files are reviewed paths, clause 3); a `src/` diff, a changed dependency in the build configuration, a changed official list and a changed runtime-record limit each block (`test/scale/record-validity.test.ts`).

11. The harness MUST support a `--security-patch` run of the shapes 3, 7 and 21 plus a final n = 51 run before deploy, at 30 seeded runs per shape instead of 100, each assertion except (c) at zero violations and (c) in at least 29 of the 30 runs, and the record is marked `reduced`; the reduced run MUST still run the exhaustive n = 3 and n = 7 corpus of R4.7.
Test: the flag runs exactly those four shapes at 30 runs each and writes a release record marked `reduced` that lists them, and a run without the exhaustive corpus is refused (`test/scale/security-patch.test.ts`).

12. A `reduced` record MUST be valid only for a security-patch diff, which is one that carries a vulnerability identifier (the `vulnerability identifier` structure of R0(b)) signed by at least 2 release-key holders and also by one member key of the epoch set that is not a release-key holder, and touches at most 200 lines outside tests, with at most 600 non-test lines accumulated in `reduced` records since the last full record; two consecutive `reduced` records on one lineage are refused, so the next record is a full one, except a second `reduced` record whose diff fixes a regression introduced by the first, with both vulnerability identifiers signed by at least 2 holders, and an identifier MUST NOT appear in two `reduced` records, its signature covering `len4(identifier) || identifier || commit hash || tree hash` (identifier as defined in R0(b)).
Test: a `reduced` record is refused for any other diff, for a diff over the size cap, for one that takes the lines accumulated since the last full record over 600, for a diff without the identifier or with an identifier lacking the non-holder member signature, and as a second consecutive one unless its diff fixes a regression of the first with both identifiers signed by at least 2 holders, in which case it is accepted, an identifier reused in a second `reduced` record or attached to another diff is refused, and a variant spelling of a used identifier (lower case, or with trailing whitespace) is refused (`test/scale/security-patch.test.ts`).

13. The build MUST install only from a lockfile in which every package carries an integrity digest, from a trusted-base mirror, with install scripts disabled; any lockfile entry change, for any package, is a reviewed change (clause 3), and the record lists the lockfile digest computed by the attester (clause 6).
Test: a lockfile entry without an integrity digest, an install script and an unreviewed lockfile change are each refused (`test/guidelines/lockfile.test.ts`).

14. The collusion of at least 2 release-key holders with a non-holder author defeating the gate is a stated residual risk of this part, bounded by the `t` rebuilding members (R1.8) and the R1.14 revocation.
Test: the residual risk is stated in this requirement and no clause above claims to prevent it; a record signed by 2 colluding holders for a commit authored by a non-holder passes the attester, and the runtime-revocation of R1.14 and the rebuild by the `t` members of R1.8 take effect on it (`test/scale/record.test.ts`).
Enforced at: commit, release.

