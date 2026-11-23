**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

### R1 Sealed Lumi Actions and the injected runtime

A Lumi Action is the unit of business rule. It is code whose bytes are fixed by a cid, run by executor nodes against
signed views, and it ends in exactly one thing: a verdict. The action holds no capability of its own; every capability
is lent by the runtime that executes it, through one injected namespace, `Lumi`.

**R1.1 One seal.** A Lumi Action MUST consist of exactly one sealed unit: either one source file, or one folder whose
files all live inside it; the only executable form of a seal is ECMAScript source in `.js` files with no type syntax; the entry file is `main.js` (folder form) or the single file (one-file form), and these are the only bytes executed; a seal MUST NOT hold two files whose names differ only by extension; a `.ts` file may exist in the repository for authoring, but the seal holds the compiled `.js` bytes and the cid hashes those bytes, so no transpiler is part of the runtime cid; a plugin seal MUST be the folder form and hold one `lumi.manifest` at its root, declaring
its name, kind class, fuel, runtime cid range, requested permissions (each with a purpose sentence in each language the plugin offers, marked required or
optional, and a required one with a necessity sentence), its place and tools, and the author key (schema `manifestSchema` of the runtime
record, R1.8), and no other datum about the author (no legal name, contact or country; those live in the
`author-identity` record, R3.26); the kind class of an action is fixed by its source, never by the manifest: an official
action takes it from its official-list entry (R3.5), which MUST equal its `ACTION_KINDS` declaration (a mismatch is refused at load with `lumi-seal`), a plugin is always `plugin`, and a manifest class other than `plugin` is refused
with `lumi-seal`; the manifest is a file of the seal and therefore part of the cid (R1.4), and a manifest outside the
seal is ignored.
Test: `test/lumi.seal.unit.test.ts` builds a seal from a file, from a folder, and from a folder holding a file that
resolves outside it; the first two are accepted, the third is refused with `lumi-seal`; a folder with no `main.js`, a seal holding both `main.js` and `main.ts`, and a `.ts` file inside a seal are refused with `lumi-seal`; a plugin folder without
`lumi.manifest` is refused, a manifest holding a legal name, contact or country field is refused, a plugin manifest with
`kind: system` is refused, and changing one byte of the manifest changes the cid.
Enforced at: compile (`scripts/check-seal.mjs`, called by `scripts/check-layout.mjs`, R5.5), load.
Rationale: E-R1.1

**R1.2 No external dependency.** A seal MUST NOT import, export-from, require or dynamically load anything outside
itself (no package, no `node:` module, no URL, no relative path that resolves outside the seal), in any form
(`import ... from`, `export ... from`, a side-effect `import`, `import()`, `require()`, `import x = require()`,
`import.meta`); a one-file seal MUST import nothing at all and a folder seal MUST import only relative paths that stay
inside the folder; a seal file MUST have an extension of the allow-list `.js .json`, except the file `lumi.manifest`
at the root of a plugin folder; the scan is AST-based and deny-by-default, and no directory name is skipped inside a seal.
Test: `check-seal.mjs` exits 1 with a `[lumi-seal]` line for each form in a fixture set, for a `.wasm` file, for a
breach under `build/` inside a seal, for a one-file fixture with any import and for a folder fixture importing a path
outside the folder, and exits 0 for the clean fixtures, a folder fixture importing a sibling inside the folder and a
plugin folder holding `lumi.manifest` (`test/lumi.seal.forms.test.ts`, `test/lumi.seal.inside.test.ts`).
Enforced at: compile, commit, load (the load scan of R3.2 repeats it on the sealed bytes).

**R1.3 Everything it needs arrives as data.** A seal MUST obtain its input only from `Lumi.params` and its views and
records only from `Lumi.read`; it MUST NOT reach any other source.
Test: a fixture action that reads a global, a module-level mutable singleton or an undeclared binding ends with
`REFUSED:capability` (`test/lumi.capability.test.ts`).
Enforced at: load, runtime.

**R1.4 The seal cid.** The cid of a seal MUST be the hash (BLAKE3-256, hex) over the canonical seal encoding:
`H("angstone/lumi-seal/v1\0" || count || entries)`, where `count` is the number of entries as an 8-byte big-endian
integer and `entries` are the files sorted by path in byte order of their UTF-8, each encoded as
`pathLen(4 BE) || path || dataLen(8 BE) || data`; paths are relative to the seal root, use `/`, contain no `.` or `..`
segment, are unique after ASCII case folding, have segments matching `[a-z0-9._-]` of at most 64 bytes, and avoid Windows reserved
names; any other path is refused with `lumi-seal`; a one-file seal is the one-entry case with the file name as its path; line endings and
timestamps are part of `data` and are never normalized by the hasher; the build produces one byte form.
Test: golden vectors (`test/vectors/seal-cid.json`) give the cid of a one-file seal, a three-file folder in two
creation orders, and one-byte mutations of path, length and content; the cid is equal for equal content in any creation order and differs for each mutation; paths `A.js` with `a.js`, an NFD name and a reserved name are refused (`test/lumi.cid.test.ts`).
Enforced at: release, load.

**R1.5 Domain separation.** Every signed structure and every hash domain introduced by Part R (the signed seed, checkpoint and ledger head are the ledger's own and are not rows) MUST be a row of R0(b), MUST have the domain prefix `angstone/lumi-<type>/v1\0` of that row and, for a signed row, the type tag of the R0(b) lead-in as its first canonical field (a hash-only row has none), and no value valid under one prefix or type tag MAY be valid under another.
Test: for each pair of digests over the same bytes, the digests differ; the prefix of every row of R0(b) is asserted, with a collision vector in which reads ("ab","c") and ("a","bc") give different `readDigest` values, and a signature over one structure type fails verification as every other type, the runtime-revocation record included (`test/lumi.domain.test.ts`).
Enforced at: runtime.

**R1.6 The runtime injects one small, versioned API.** The executor MUST expose to an action exactly the namespace
`Lumi` listed in R1.12 and nothing else; the namespace carries its `Lumi.version` (the runtime version number) and
the API MUST NOT change under a given runtime cid.
Test: enumerating every own and inherited property reachable from the sandbox's global object returns exactly the
list of R1.12 plus the language's frozen intrinsics, walking the `constructor` chain of every reachable function
(`test/lumi.surface.test.ts`).
Enforced at: load, release.

**R1.7 The runtime is content-addressed.** The runtime (its API implementation, its fuel metering, its sandbox
configuration, its builtin allow-list and its engine, one WASM image identical on every target) MUST be an artifact with its own cid, the runtime cid, computed as R1.4 over the
runtime's sealed files with the `runtime` prefix of R0(b).
Test: rebuilding the runtime from source twice yields the same runtime cid; changing one byte of any runtime file
changes it (`test/lumi.runtime-cid.test.ts`).
Enforced at: release.

**R1.8 The runtime is signed by the network.** A runtime cid MUST count as usable only when a runtime record
with the fields of R0(c) carries signatures from at least `t` distinct
member keys of the epoch in force; a member MUST sign a runtime record only if it rebuilt the runtime cid from source and the cid
appears in a green release record (R4.15) with at least 2 release-key signatures; a runtime-revocation record MUST name
a fallback runtime cid that is itself signed, or no run starts; an executor MUST refuse to run under a runtime cid
without such a record, and MUST NOT accept a record whose version is below the version declared by the finalized ledger
head, except a fallback record named by a finalized runtime-revocation record, which is judged against the revocation's declared `runtimeVersion`, and the head's `runtimeVersion` after a revocation MUST equal the fallback's version; the ledger head MUST declare the values of the ledger-head declaration of R0(c); a member MUST
sign a runtime record only if a list version signed by `t` members and finalized at or before the record's `notBefore`
names that runtime in the `runtimeRange` of every official entry.
Test: a record with `t-1` signatures, with `t` signatures one of which is a duplicate, with `t` signatures from a
non-member, and with a version below the ledger head's declared one are each refused with `runtime-unsigned`; `t`
distinct member signatures are accepted; with `t-1` byzantine signers plus one honest signer that refuses, a record for
a runtime absent from a green release record, a runtime absent from an official entry's range and a revocation without a
signed fallback are not completed; after a revocation naming an older fallback the head declares the fallback's version and the fallback record is accepted, not refused with `runtime-unsigned`; a ledger head lacking one of the declared values is refused
(`test/lumi.runtime-sign.test.ts`).
Enforced at: load.

**R1.9 Behaviour is fixed by the pair.** The verdict of an action MUST be a function of (action cid, runtime cid,
input, granted data, request id, quoted head epoch) only, and every signed verdict MUST record in its signed bytes the pair `(actionCid, runtimeCid)`
`inputDigest` and the request id `(requesterKey, seq)`, and `readDigest` (both of R0(b)) over every `Lumi.read`, the grant-log head epoch quoted by the signed run request (never the executor's own head) and, for a plugin
run, the digest of the user-signed grant record (`grantDigest` is empty for a non-plugin run); verdicts
count together only with equal `readDigest`, `inputDigest` and request id, `verifyVerdict` refuses a verdict whose pair, `inputDigest` or request id does not equal the request being counted, and a mismatch is a dissent only after the signed view is produced.
Test: two executors given the same quadruple of R2.5 under the same signed run request (request id and quoted head epoch) return identical verdict bodies (the bytes without the signing node's identity and signature), a verdict whose signed bytes omit
either cid, the `inputDigest`, the request id or the `readDigest` is refused by `verifyVerdict`, a verdict signed for input A and presented for input B (same reads) is refused, and a node on a lagging view is not struck before it
produces its signed view (`test/lumi.pair.test.ts`).
Enforced at: runtime.

**R1.10 Determinism.** An action MUST NOT observe a clock, randomness, the network, the filesystem, process
environment, locale, the iteration order of an unordered container, or any host object; time and randomness enter
only as explicit `Lumi.params` fields that the network itself signed (an epoch number, a sequence number, a seed
record) and the sealed time (`created_at`) of the entry judged.
Test: the executor runs every official action 1,000 times under varied host clocks, locales, timezones, memory
layouts and hash seeds and observes one verdict body byte string (the bytes without the signing node's identity and signature, `test/lumi.determinism.test.ts`).
Enforced at: runtime, release.

**R1.11 Size caps.** A seal MUST be at most 64 KiB of source for an official action and at most 32 KiB for a plugin;
it MUST hold at most 16 files and, for the folder form, at most the code cap of its kind class (R2.7) across all
files. A seal over its cap is refused at load, never truncated.
Test: seals of cap, cap+1 byte, 17 files, an oversized path and a plugin folder of 33 KiB over several files are
loaded; only the first is accepted
(`test/lumi.caps.test.ts`).
Enforced at: load.

**R1.12 The API.** The injected namespace MUST contain exactly the functions below, each of a declared capability
class; capability classes: `pure` (computation only), `read` (data lent by the runtime), `sign` (requests
the host's signature share without exposing the key piece), `output` (records the run's one result; the run continues until the action returns, so a `system` action may call `Lumi.sign` after it, and a second call is `REFUSED:double-response`); the kind classes that may call
each function are `system`, `record`, `payment` (the official kind classes of R2.7) and `plugin`; a call from a kind
class not listed MUST end the run with `REFUSED:capability`.

| function | capability class | kind classes | contract |
|---|---|---|---|
| `Lumi.version` | pure | all | the runtime version number (read-only integer) |
| `Lumi.params` | pure | all | the frozen, canonically decoded input of the run; never mutable |
| `Lumi.read(name, key?)` | read | all; plugin only inside its grant (R3.12) | returns a signed view or record `{digest, bytes}` the executor already holds; `name` is from the catalog of views and permissions; an unknown or ungranted name is `REFUSED:grant` |
| `Lumi.verify(scheme, msg, sig, pub)` | pure | all | verifies a signature of the document's schemes; returns a boolean; never throws on bad input |
| `Lumi.hash(domain, bytes)` | pure | all | BLAKE3-256, 32 bytes, over the `action` row of R0(b), so `("a","bc")` and `("ab","c")` never collide (a vector test pins this); the fixed prefix means an action never supplies an R0(b) prefix |
| `Lumi.codec.{encode,decode}(schema, v)` | pure | all | canonical encoding and strict decoding of the schemas of the signed vectors; decoding rejects trailing bytes and duplicate keys |
| `Lumi.fields.check(name, value)` | pure | all | the field rules of `validate/fields.ts` over the pinned vectors |
| `Lumi.bytes`, `Lumi.int` | pure | all | byte-string and bounded-integer helpers; integer arithmetic over `BigInt` with explicit width (at most 4096 bits), no floating point |
| `Lumi.sign(verdict)` | sign | `system` only | request, host signs: asks the host for this node's share over the digest of the verdict already recorded by `Lumi.setResponse`; a call before `Lumi.setResponse` is `REFUSED:no-verdict`; the host signs (R2.2); for the other kind classes the host signs after `Lumi.setResponse`, and a plugin never calls it |
| `Lumi.setResponse(verdict)` | output | all | records the verdict, the only output; a second call is `REFUSED:double-response` |

Test: a surface test (R1.6) lists exactly these names; for each function a call from every kind class is made and the
result matches the table (`test/lumi.api-table.test.ts`).
Enforced at: load, runtime.
Note: there is no `Lumi.now`, `Lumi.random`, `Lumi.fetch` or `Lumi.fs`; `Lumi.int` and `Lumi.bytes` take no numeric default
and no locale.

**R1.13 What an action returns.** An action MUST end by exactly one call to `Lumi.setResponse` with a verdict of the
schema of its action kind: `{ok: true}` or `{ok: false, reason}` where `reason` is a code from the closed reason set
of the action kind; any other end (return value, thrown error, no call) MUST be treated as `REFUSED:no-verdict`, except a reach for a global, binding or `Lumi` function outside the namespace, which ends with `REFUSED:capability` (R1.3, R1.12).
Test: actions returning a value, throwing, calling twice and never calling are each executed; each yields the typed
refusal named (`test/lumi.response.test.ts`).
Enforced at: runtime.

**R1.14 Runtime upgrade.** A new runtime MUST be rolled out as a new runtime cid with a new signed record (R1.8) that
names the runtime it supersedes, a `notBefore` epoch at least 3 epochs after the record's finalization epoch (at least 1 epoch for a record whose `securityPatch` field names a `security-patch flag` signed by at least 2 release-key holders and backed by a `reduced` record of R4.15, which the executor treats as a revocation of the runtime it supersedes, taking effect at the patch runtime's `notBefore`, never at finalization) and a
`notAfter` epoch; an executor MUST NOT start a new run
under a runtime whose `notAfter` epoch has passed, nor under any runtime other than the newest one, among runtimes not revoked, whose `notBefore`
has passed, the runtime in force for a run being the one in force at the run's quoted head epoch, and a node whose head is one epoch past the quoted epoch, or older than it, refusing with `REFUSED:stale-log`, and a node whose head is more than one epoch past it dropping the request without a signed output (R2.12, R3.30), before choosing a runtime; a runtime-revocation record's named fallback becomes the runtime in force at the record's finalization epoch, notwithstanding supersession, provided its `notAfter` has not passed, it is not a runtime revoked by a finalized record nor one superseded by a `securityPatch` runtime, and its `notAfter` MUST be at least `LIVENESS_CURE_EPOCHS` after the revocation epoch; a superseded runtime stays loadable only to re-verify old verdicts, never to execute; a runtime-revocation record is the structure of R0(b) signed by at least `t` distinct member keys, and a `t`-signed
runtime-revocation record MUST take effect at once: a verdict whose runtime cid is revoked by a record
finalized at or below the counting node's head MUST NOT be counted, and a node whose head is older than the epoch of
any revocation record it holds for its runtime MUST stop at once; a verdict records the runtime cid it ran under
(R1.9) and a verdict under a superseded runtime cid MUST stay verifiable for as long as the record chain is held. An
executor MUST NOT run an action under a runtime the action's own cid range did not declare compatible, and MUST NOT
silently migrate a pending run to a newer runtime.
Test: with runtimes A and B signed, a verdict made under A verifies after B is current; a run under A after B's
`notBefore` is refused, as is a run under A after its `notAfter` or after its revocation record; an action pinned to
A is refused under B with `runtime-mismatch`; a rollout record without `notBefore` or `notAfter`, or without `securityPatch` with `notBefore` under 3 epochs after finalization, is
refused; a revocation record whose fallback is a revoked runtime or one superseded by a `securityPatch` runtime is refused; a security-patch runtime record is runnable 1 epoch after finalization; a run quoting epoch `notBefore - 1` is executed under one runtime cid by every node whose head epoch is `notBefore - 1`, a node whose head is one epoch past the quoted epoch, or older than it, refuses with `REFUSED:stale-log`, and a node whose head is more than one epoch past it drops the request without a signed output; a verdict under a revoked runtime is not counted at a node whose head is past the revocation; a node whose head is 1 or 2 epochs behind a run quoting epoch `notBefore - 1` refuses with `REFUSED:stale-log`, and a record with `notBefore` at least 3 epochs after finalization reaches such nodes before `notBefore`; a run under the named fallback after the revocation of the newest runtime is accepted, and a record whose fallback `notAfter` is under `LIVENESS_CURE_EPOCHS` after the revocation epoch is refused (`test/lumi.runtime-upgrade.test.ts`).
Enforced at: load, release.

**R1.15 The official action is bound to its runtime.** Each entry of the official list (R3.5) MUST name the runtime
cid range it is certified for.
Test: an entry whose range omits the runtime in force is not runnable and returns `runtime-mismatch`
(`test/lumi.official-range.test.ts`).
Enforced at: load.

**R1.16 Merged.** Merged into R1.2.

**R1.17 No run on a stale runtime view.** An executor MUST NOT start a run unless it holds a finalized ledger head that is not stale (below) and has applied every runtime record up to that head; otherwise it MUST refuse with
`REFUSED:runtime-unsigned`; age is measured by the executor host's clock against the signed checkpoint time carried in the head: a head is stale when host time exceeds that time by more than 2 x `EPOCH_MIN_S` (1 x for `system` and `payment`; `FINALITY_WINDOW_S` plus one round timeout for the `plugin` kind class, which is served only after at least `n-t+1` distinct members answered the R3.15 query with a signed log root not older than the held head, an unanswered query being `REFUSED:stale-log`); a node with no clock reading, a node stale in the sense of Stage 7 (no seed signed by the pinned authority within `SEED_VALIDITY_S`), and a node that has seen a checkpoint time exceeding its host time by more than `CLOCK_SKEW_S` (a code default awaiting the owner's number, OI-31), a time counted only when carried by a checkpoint signed by `t` distinct member keys (R4.6(b)) and a single-signer time being ignored, each refuse with `REFUSED:runtime-unsigned`; head age is also measured by a monotonic uptime counter since the head was received, and a node refuses when either the host clock or the counter exceeds the bound; a host clock set back below the last head's checkpoint time is itself a refusal; the residual risk, stated here, is that a node whose clock and carrier are both controlled by the attacker serves only its own uncounted verdicts; the host clock is never visible to an action (R1.10); the head's checkpoint time advances by a rule and not by luck: the epoch leader MUST propose at least once every `PROPOSE_EVERY_S` (a protocol constant of the constants drawer, in seconds, never a script flag and never zero; it exists today in `constants/seed.ts` as a code default of 6 hours, awaiting the owner's number with OI-31) a proposal being one tick of the leader, and MUST seal a checkpoint, carrying the checkpoint time, in every tick of a proposal, beside the slash or the owed reward that tick also seals and never in its place (the node today seals one entry per tick, so this correction requires it to seal the checkpoint in that tick and not in a later one), a member MUST NOT seal a tick that proposes and carries no checkpoint, so that a backlog of owed rewards or a failed proposal cannot hold the checkpoint time back, and the record's `FINALITY_WINDOW_S` MUST be at least `2 x PROPOSE_EVERY_S + 3 x Delta + CLOCK_SKEW_S`, asserted at runtime-record load (a record failing it is refused `runtime-unsigned`), so that one failed proposal still leaves a head inside `FINALITY_WINDOW_S` plus one round timeout; for the plugin kind class a head is also stale when its checkpoint time is more than `MAX_EPOCH_SPAN x 86400` seconds past the `at` of the last timed hand-over, plus `FINALITY_WINDOW_S` plus one round timeout (an epoch not handed over within its bound: the run is refused `REFUSED:runtime-unsigned`, any hand-over cures it, nothing is refused at the fold; a chain with no timed hand-over yet has no such bound).
Test: (1) a node cut off from the ledger refuses runs once its head is stale (host time more than 2 x `EPOCH_MIN_S` past the checkpoint time, 1 x for `system` and `payment`); (2) a relay that replays one head for more than 2 x `EPOCH_MIN_S` makes the node refuse; (3) a node holding a runtime-revocation record
inside the held head refuses the revoked runtime; (4) a relay that drops the query answers makes the node refuse plugin runs, and a plugin run is refused once the head is older than `FINALITY_WINDOW_S` plus one round timeout; (5) a node with no seed signed within `SEED_VALIDITY_S` refuses a run once `SEED_VALIDITY_S` has passed; (6) a node shown a checkpoint time signed by `t` members ahead of its host time by more than `CLOCK_SKEW_S` refuses, and a time ahead by a day signed by one member is ignored; (7) a node whose clock is set back 1 day and whose relay replays the head refuses on the uptime counter; (8) a leader with a slash, three owed rewards and one failed proposal pending seals a checkpoint with each proposal and the head's checkpoint time never lags the proposal clock by more than `PROPOSE_EVERY_S` plus one failed proposal, a plugin run on a head more than `MAX_EPOCH_SPAN` days of sealed time past the last hand-over, plus `FINALITY_WINDOW_S` plus one round timeout, is refused and is served again after a hand-over, a leader built with a proposal period of 0 or without the constant is refused at start, and a record whose `FINALITY_WINDOW_S` is under `2 x PROPOSE_EVERY_S + 3 x Delta + CLOCK_SKEW_S` is refused at load (`test/lumi.runtime-stale.test.ts`).
Enforced at: runtime.
Rationale: E-R1.17

