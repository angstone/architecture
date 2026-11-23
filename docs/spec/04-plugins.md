**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

### R3 Plugin actions and permissions

A plugin is any Lumi Action whose cid is neither on the official list nor a reducer of the signed seed (R3.5). A plugin extends what the network can do without
the network's own maintainers writing it; it MUST NOT be able to read, change or export a person's data except by that
person's explicit, signed authorization.

**R3.1 Rejection before running.** A plugin MUST be rejected at load, before any of its code runs, when it breaks the
format, size or time limits: not a valid seal (R1.4), over the plugin code cap (R1.11, R2.7), a declared fuel above the
plugin budget, a manifest (the file `lumi.manifest` inside the seal, covered by the cid, R1.1) missing or malformed, or
a declared kind class other than `plugin`; a manifest outside the seal is ignored.
Test: fixtures breaking each limit, and a plugin whose manifest sits beside the seal, are loaded; each is refused with its rule and none executes a single instruction
(`test/plugin.load-limits.test.ts`, instruction counter equals 0).
Enforced at: load.

**R3.2 Code-injection refusal at load.** The loader MUST run a static scan on the sealed bytes and refuse a plugin
that contains any of: `eval`, the `Function` constructor in any spelling (`Function(`, `new Function`,
`constructor.constructor`), `import(`, `import.meta`, `require`, `with`, a write to `__proto__`, `constructor.prototype`
or `Object.setPrototypeOf` of an intrinsic, `globalThis`, `self`, `window`, `process`, `Reflect` over intrinsics,
`Proxy` over `Lumi`, string arguments to timers, a template or string compiled to code, or an identifier from the
deny-list of the runtime. The scan MUST run over the parsed syntax tree, not over text alone, and MUST refuse a seal it
cannot parse.
Test: a corpus of at least 40 injection samples (each spelling, comment and unicode-escape variant) is refused with
`plugin-injection` naming the line; a corpus of benign plugins passes (`test/plugin.scan.test.ts`).
Enforced at: load.

**R3.3 Refusal does not rest on the scan alone.** The runtime MUST also freeze the intrinsics and remove the
capabilities (R2.1, R2.4), so that a construct the scan missed has nothing to reach.
Test: with the scan disabled in a test build, the injection corpus of R3.2 is run; every sample ends in an error
inside the sandbox or a typed refusal, and none reaches a host effect (`test/plugin.defence-in-depth.test.ts`).
Enforced at: runtime.
Rationale: E-R3.3

**R3.4 No self-reference to the host.** A plugin MUST be unable to name its own cid or the node's identity through any
API; it receives only `Lumi.params` and the granted reads.
Test: a probe enumerates `Lumi` and the sandbox global and finds no function that returns the node key, the node id,
the host's file path or the action's own bytes (`test/plugin.no-host-name.test.ts`).
Enforced at: runtime.

**R3.5 The official list.** The network MUST publish an official action list: a record of the `list` row of R0(b) signed by at least `t` distinct member keys; a cid present in the list at the version in force is official; every other cid that is not a seed reducer is a plugin
(a plugin cid that passed R3.1 is admitted to run under R3; an official-list cid is admitted as official); a cid that is
a reducer of the signed seed is official and MUST also appear in the official list at the version in force; an executor
MUST NOT accept a list, catalog or runtime record whose version is below the version declared by the finalized ledger
head, and a node with no list MUST obtain that version from the ledger head, not from a relay; an entry whose `kindClass` is
`plugin` is refused; a plugin listing is a record of the `listing` row of R0(b), one per
plugin cid, signed by at least `t` distinct member keys only after R3.23, R3.24 and R3.26 passed, held outside the ledger, with
`status` one of `listed`, `suspended` or `withdrawn`, and a transition of `status` to `suspended` or `withdrawn` MUST also be entered in the `withdrawalRoot` set, to which the stale-log rule of R3.26 applies (a listing becomes `suspended` only by a failed liveness check (R3.26); a `suspended` listing refuses only new grants and delegate runs, R3.11; a user's own runs under a `suspended` listing continue until `LIVENESS_CURE_EPOCHS` after the suspension epoch, when the author key is withdrawn (R3.26); only `withdrawn` refuses every run).
Test: an entry of kind class `plugin` is refused, an entry whose `kindClass` differs from the `ACTION_KINDS` declaration of the action is refused at load with `lumi-seal`, a listing with `t-1` signatures or one whose author key has no valid
`author-identity` record is refused; a list with `t-1` signatures, a list signed after a forged `supersedes`, a list whose version is not
greater than the held one, and a stale list served by a relay to a node with an empty store are refused; a valid list
is accepted; a cid in neither the list nor the signed seed is classified `plugin`; a seed reducer cid (`ledger.seal`
today) is classified official, and a list at the version in force that omits it is refused; a node served the older `listed` record after a suspension or withdrawal refuses delegate runs with `REFUSED:stale-log`
(`test/lumi.official-list.test.ts`).
Enforced at: load.

**R3.6 What official means.** An official action MAY read system data in the extent its kind lists in the catalog of
R3.8, MAY call `Lumi.sign` if its kind class is `system` (R1.12), and is subject to R1 and R2 like any other action; being
official MUST NOT exempt an action from a limit of R2.7 or from the scale gate (R4).
Test: an official action over a limit gets `REFUSED:limit`; the release gate lists every official cid with a
scale-gate record (`test/lumi.official-limited.test.ts`).
Enforced at: runtime, release.

**R3.7 A plugin reads no user data without a grant.** A plugin MUST NOT receive any data of a person (profile,
messages, balance, contacts, device list, reports, any field that identifies a person) unless that person has
authorized that exact cid for a listed set of permissions (R3.8 to R3.14); without a grant, `Lumi.read` of any
person-bound name ends the run with `REFUSED:grant` (R3.12).
Test: a plugin without a grant reads each person-bound name of the catalog; every read is refused; with a grant, only
the granted names succeed (`test/plugin.no-grant.test.ts`).
Enforced at: runtime.

**R3.8 The permission catalog.** The network MUST maintain a versioned catalog of named permissions, each with the
exact data class it opens, the views or records it returns, the bytes it may return per run, a risk class, and the cap
of the maximum runs per epoch and of the cumulative bit budget a grant of it may carry (R3.10), and its `purposeTerms` list (R3.24); the catalog is a record
signed like the official list (R3.5).
Test: the catalog schema requires every field above, including both caps and `purposeTerms`, and refuses an entry without one
(`test/plugin.catalog.test.ts`).
Enforced at: load, runtime.

**R3.9 The screen shows the list.** Before a person can authorize a plugin, the client MUST show on one screen, in
the person's language: the plugin's name and cid (short and full form), the author key, the
author's legal name, contact and country as read from the `author-identity` record (R3.26) with that record's
version and attestation epoch, the network operator's legal identity and contact, the data-protection contact, the
retention periods of R3.35 and R3.26, the fact that `t` executors process the data with the countries or regions of those
executors and, for any executor region outside the `consent.adequacyList` of the runtime record (every region not on it shows its safeguard and risk sentence), the transfer safeguard under Art. 46 GDPR or Art. 33 I, II(a)-(d) LGPD that the `consent` field records for that region (standard clauses, BCR or equivalent), with the specific risk sentence, and the role of each executor (processor or independent controller) with the instrument binding it; consent under Art. 49(1)(a) GDPR or Art. 33 VIII LGPD applies only to a non-recurring transfer and MUST NOT be offered for runs, each delegate key as the only requesters besides the user key, the line derived from the delegate list (short form, with its label shown as "your label", R3.10), the sentence "a delegate receives the plugin's results about you and is not identified or vetted by the network; name only devices or people you control", every requested permission with its data
class in plain words and the purpose sentence the manifest declares for it, the bytes it may read, the maximum runs per
epoch and the cumulative bit budget each with its catalog cap, the expiry, the revocation path, the risk line with the
per-verdict bit bound of R3.18, the statement that the cumulative bit budget bounds what a plugin discloses to its requester and does not bound an executor host, which reads the granted bytes in clear, and the label "third-party".
Test: a rendering test asserts that the screen text contains each requested permission name, its data-class sentence
and its purpose sentence, the author's legal name, contact, country, record version and attestation epoch, the operator
identity and contact, the data-protection contact, the retention periods, the executors' countries or regions and, for a non-adequate region, the recorded transfer safeguard with its risk sentence, the role of each executor and no offer of consent as a transfer basis, the
each delegate key as the only requesters besides the user key (the line derived from the delegate list) with its label as "your label" and the delegate-recipient sentence (the label stays on this device and is not sent to executors or the author), the maximum runs and bit budget with their caps,
the risk line with its bit bound and the executor-host statement, and the "third-party" label, and no screen for a cid with no `listing` record (`site/src/plugin/authorize.screen.test.tsx`).
Enforced at: commit (UI test), release.

**R3.10 The grant record.** An authorization MUST be a record signed by the person's user key and countersigned by the
network binding, naming the fields of the grant record of R0(d), in that order, with the maximum runs per epoch and the cumulative bit budget each at most the catalog's cap for its
permission (R3.8); the expiry epoch MUST be at most `MAX_GRANT_EPOCHS` (R0(c)) after the
issued-at epoch (renewal needs a new screen), an `epoch` whose commitment of `nextSeq` exceeds `MAX_EPOCH_SPAN_SEQS` seqs MUST be refused at the fold, and an epoch not handed over within `MAX_EPOCH_SPAN` days of sealed time MUST make the plugin class refuse runs (the check of R1.17, R0(c) epoch bounds), and the countersignature MUST be refused with `unsigned-grant` unless the `grantIndex` rule of R0(d) holds,
and expiry, log purge and quarantine are evaluated against the epoch of the finalized ledger head, never a host clock;
the network binding is a signature of at least `t` distinct member keys over the digest of the user-signed record, given
only after the network's rule passed the record (the same `threshold` member verdicts a person's record needs, Stage 5),
and that rule MUST rebuild the consent text deterministically, in `consentLanguage` (which MUST be a language for which the manifest provides every purpose sentence, R3.24), from the grant fields, the catalog at its version, the
manifest, the named `author-identity` record version and the `consent` field of R0(c) of the named runtime record version, and refuse a digest mismatch with `unsigned-grant`, and MUST refuse a grant whose text lacks, for an executor region outside the `consent.adequacyList`, the transfer safeguard under Art. 46 GDPR or Art. 33 I, II(a)-(d) LGPD that the `consent` field records for that region (consent under Art. 49(1)(a) GDPR or Art. 33 VIII LGPD MUST NOT be offered for runs), and the client MUST NOT sign a grant whose delegate label carries text copied from the manifest, the listing or the plugin name (the network sees only `H(label)`), and MUST refuse with `unsigned-grant` unless a `listing` record for the cid with `status` `listed` and a matching `authorKey` is held, and the client MUST NOT render the R3.9 screen for a cid with no such record (the rule applies to plugin cids only; an official action needs no listing); the named runtime record version MUST equal the `consent`-bearing runtime record version in force at the epoch of the finalized head, and the issued-at epoch MUST be within 1 epoch of that head (R0(d), expiry), the countersignature being refused with `unsigned-grant` otherwise, and the client MUST show "not authorized" after an unconfirmed submission only after revoking that grant digest to `t` members (R3.14); a node MUST declare its region in its stake record (the safeguard and the executor role live only in the `consent` field), the declaration MUST be signed by the operator under the executor instrument named in the `consent` field for that region (processor or controller terms, safeguard clause, a sub-processor and location warranty), the selection of executors for plugin runs MUST use only nodes whose stake record carries that instrument signature at the epoch of the run stamp, and a node shown to run in another region (operator admission, or a member-signed finding) is withdrawn from plugin runs by a `withdrawalRoot` entry; and, for every run, a node MUST serve a plugin run only if that region is in the `consent` regions list of the runtime record version named by the grant and also in that of the runtime record in force at the run stamp, otherwise it refuses with `REFUSED:runtime-mismatch` (node-local, never counted), so a grant naming a version whose region list loses a region continues only in regions still listed, and a run under a superseded version is served only as the superseded runtime record version row of R0(d) states; a region outside the adequacy list with no recorded safeguard is not in the regions list and its nodes serve no plugin run.
Test: (1) a grant with only the user signature, with only the countersignature, with `t-1` countersignatures, with a
changed permission set, with a cid differing by one byte, with a runtime range not containing the runtime in force, with
an expiry over `MAX_GRANT_EPOCHS` after issue, without the maximum runs or the bit budget, with either over the
catalog's cap, with a delegate the shown text omits, with a cid that has a valid author identity but no `listed` listing record, with a `consentLanguage` the manifest does not fully provide, with executor regions or retention periods differing from the named record's `consent` field, or with a digest of altered consent text, or without `clientId`, or with a `grantIndex` above 0 without `prevLeafKey`, with a `prevLeafKey` found in neither the finalized log nor the tombstone, or whose own leaf address is occupied, or a grant at index 7 whose `prevLeafKey` is the address of index 0, is refused with `unsigned-grant`; (2) the complete record is accepted, also in a second `consentLanguage` the manifest provides; (3) a host clock set back 400 days still
refuses an expired grant; (4) the client refuses to sign a prefilled or confusable delegate label, or one copied from the manifest, the listing or the plugin name, and a grant record carries only `H(salt || label)`; (5) a grant with a non-adequate region and no recorded transfer safeguard or risk sentence is refused with `unsigned-grant`, a text offering consent under Art. 49 for runs is refused, and a region outside the adequacy list with no recorded safeguard is not in the `consent` regions list; (6) a commitment of `nextSeq` one seq past `MAX_EPOCH_SPAN_SEQS` is refused at the fold, and a head whose checkpoint time is past the `at` of the last hand-over by more than `MAX_EPOCH_SPAN` days plus `FINALITY_WINDOW_S` plus one round timeout makes the plugin class refuse runs until a hand-over (R1.17) (`test/plugin.grant-sign.test.ts`); (7) the grant record's text digest equals the digest of the
shown text (`site/src/plugin/authorize.digest.test.tsx`); (8) a node declaring region Z serves no run under a grant whose consent lists regions X and Y, and refuses it with the node-local `REFUSED:runtime-mismatch`, never counted toward the network's refusal; a region dropped by v+1 serves no run under a v grant, a region added by v+1 serves no run under a v grant whose own record omits it, and a countersignature naming a runtime record version other than the one in force at the finalized head is refused with `unsigned-grant`, while a run under an already countersigned grant naming a superseded version continues only in regions listed in both versions whose safeguard, role, operator and contact rows are identical in both, and is otherwise `REFUSED:runtime-mismatch`; (9) a node whose declaration lacks the instrument signature, or names a region whose instrument it did not sign, serves no plugin run, and a node shown to run in another region is withdrawn from plugin runs (`test/plugin.region-bind.test.ts`); (10) a record signed at epoch E and submitted at E+2 is refused with `unsigned-grant`, and a grant with 5 delegate keys and a grant with a delegate label of 33 characters are each refused with `unsigned-grant` (`test/plugin.grant-sign.test.ts`).
Enforced at: load, runtime.
Rationale: E-R3.10

**R3.11 The executor checks both signatures.** For each run of a plugin on behalf of a person, the executor MUST check the
user's signature, the network countersignature, the cid and runtime match, the expiry, the listing `status` not `withdrawn` (a `suspended` listing refuses new grants and runs by delegates, and the user's own runs continue until the cure period `LIVENESS_CURE_EPOCHS` ends), and the absence of a revocation
(R3.14) and of a withdrawal (R3.26), and MUST hand to the action only the granted data through `Lumi.read`; the run
request MUST be signed by the grant's user key or by a delegate key named in the user-signed grant, any other signer admitted by R2.11
being `REFUSED:grant` (a foreign signer with no bucket entry is dropped under R2.11 and gets no refusal; `REFUSED:grant` applies only to a signer admitted by R2.11).
Test: for each failing check, a withdrawn cid included, a run is attempted; a missing or invalid user signature or countersignature is `REFUSED:unsigned-grant`, and a cid mismatch, a runtime outside the grant's runtime range (a runtime outside the action's own range, R1.14 and R1.15, is `REFUSED:runtime-mismatch`), expiry, revocation, withdrawal, a `withdrawn` listing status, a `suspended` listing for a delegate-signed run, or foreign signer admitted by R2.11 (a signer not named in the grant included; one with no bucket entry is dropped with no refusal) is `REFUSED:grant` (`REFUSED:stale-log` for a revocation or withdrawal not yet finalized, R3.14, R3.26), and the
action's instruction counter is 0; a valid `grantKey` presented under a foreign requester key is refused with the
instruction counter at 0, and a bundle addressed to any key other than the request's `requesterKey` is refused (`test/plugin.executor-check.test.ts`).
Enforced at: runtime.

**R3.12 Reads outside the grant are refused.** A `Lumi.read` of any name or key outside the grant MUST be refused with
`REFUSED:grant`, signed by the executor, and the run MUST end at that call; the refusal does not leak whether the
name exists.
Test: a plugin reads one ungranted name and one non-existent name; both return the same refusal bytes
(`test/plugin.read-outside.test.ts`).
Enforced at: runtime.

**R3.13 Nothing leaves but the verdict.** A plugin MUST have no network, no filesystem, no timer and no logging
channel (R2.1); the only output is the verdict, whose size is capped (R2.7), whose shape is checked against the
verdict schema of its kind, and which MUST contain no free-text field. Where a kind needs a reason, it is a code from a
closed set of at most 32 values of at most 24 bytes; an integer or enumerated field MUST be range-checked; the body a plugin passes to `Lumi.setResponse` MUST contain no byte field (the digests the host adds under R1.9 are not part of that body).
Test: a plugin that tries to put granted data into every field of its verdict (long reason, extra key, oversize
integer, free string, a byte field of any length) is refused with `REFUSED:no-verdict` for a shape breach, the fixtures for `REFUSED:no-verdict` being under 512 B, and a verdict over the output size limit of R2.7 is `REFUSED:limit`
(`test/plugin.verdict-shape.test.ts`); the output entropy audit of R3.18 is run over the corpus.
Enforced at: runtime.

**R3.14 Revocation.** A person MUST be able to revoke a grant by a revocation record signed by the user key, a revocation MUST name exactly one grant digest and carry the `grantIndex` and the `grantKey` of that grant (recomputed by the client, R0(d)), and apply only to that grant; the countersignature of a revocation by a member is its receipt, signed under the `receipt` prefix (the `countersignature` type is used only for grants), and the
record MUST take effect at every executor that holds it, at the first sequence at which that executor holds it,
without waiting for a countersignature, its `sequence` field being informative only; the countersignature only places
the record in the grant log; the client MUST submit a revocation to at least `t` members and show it "in effect" only
after `t` signed receipts; a revocation MAY name a subset of the grant's permissions, and the executor MUST refuse
reads of those names immediately; a revocation MAY name a subset of delegate keys, and a revoked delegate key's run request is `REFUSED:grant` on the same rules as a permission subset; a run refused because of a revocation held by that node and not yet in the finalized grant log is `REFUSED:stale-log`, and `REFUSED:grant` is kept for a revocation at or below the finalized log root; the revocation status is disclosed only to the grant's user and delegate keys.
Test: a revocation naming one permission refuses reads of that name at once and leaves the others readable; a revocation naming one delegate key refuses that delegate's run with `REFUSED:grant` while the grant and the other delegate key keep running; a grant is revoked, and the client shows "in effect" only after `t` receipts; a user-signed revocation without countersignature refuses a run at the node that holds it
with `REFUSED:stale-log` and, once finalized, with `REFUSED:grant`; a revocation naming one grant digest leaves a later re-authorization of the same cid usable; a run at a later run stamp `(headEpoch, headSeq)` is `REFUSED:stale-log` before finality and `REFUSED:grant` after; a client restored from the user key alone revokes and erases a live grant
(`test/plugin.revoke.test.ts`).
Enforced at: runtime.

**R3.15 Revocation propagation bound.** A revocation MUST reach every node of the epoch within `FINALITY_WINDOW_S` (OI-41), and a run released at an executor that has not yet received it is bounded by `FINALITY_WINDOW_S` plus one round timeout (R1.17); an executor that cannot show it holds the grant log up to the log root of the latest finalized ledger head MUST refuse the
plugin run with `REFUSED:stale-log` rather than serve with a stale log, and an executor MUST consult the grant log for each
run, query at least `n - t + 1` members of the epoch for revocations of the grant at the
run stamp (an unanswered query being `REFUSED:stale-log`, an over-age head being `REFUSED:runtime-unsigned` by R1.17; a member signs the grant-independent log-root answer `{finalized head epoch, grantLogRoot}` once per finalized head and serves the cached signature, the per-grant answer carrying `grantDigest` and `revocationDigest` is signed per query and counts against the per-epoch query cap, and queries from one member are capped per epoch at the number of runs it executed) and refuse the run (`REFUSED:stale-log` while the revocation is not in the finalized log, `REFUSED:grant` once it is) at or after the sequence at which it holds or is told of a revocation; the grant log of this requirement is the structure of R3.33 and its head is
the log root finalized at the latest ledger head.
Test: a run at or after the revocation sequence is `REFUSED:stale-log` before finality and `REFUSED:grant` after (`test/plugin.log-consulted.test.ts`); the
stale-log refusal never counts and is never a dissent; with a node partitioned from the grant log, a plugin run is refused; after sync, the log head is shown and the
run is served; a revocation reported by the quorum an executor queries refuses the run before finality at that node only with the signed record or `t` matching `log-root answer` structures, and one byzantine report without a record does not refuse a run,
and a relay dropping the revocation toward `t-1` members releases no bundle after the `t` receipts; a
revocation applied at one node is visible on 21 of 21 nodes within `FINALITY_WINDOW_S`
(`test/plugin.revoke-propagate.test.ts`).
Enforced at: runtime, release.

**R3.16 Grants do not transfer.** A grant MUST bind exactly one plugin cid, and no grant MAY be inherited by another
cid, by a new version, by a plugin of the same author, or by a plugin with the same name; a plugin cid changed by one
byte MUST need a new authorization.
Test: a granted plugin is mutated by one byte; the mutated cid with the old grant is `REFUSED:grant`; a copy under a
new name has no grant (`test/plugin.no-transfer.test.ts`).
Enforced at: runtime.

**R3.17 The grant history is shown to the person.** The client MUST show, on a screen a person reaches in at most two
actions from Settings, every grant, revocation and every run of a plugin on the person's data (plugin name, cid,
permission, count, last run epoch), and MUST offer revoke on each line; the grant history is built from the person's own
signed records plus the grant-log leaves enumerated as R0(d) states, each verified against the `grantLogRoot` of the finalized head, and a plugin's own report is never a source (the network-held structure is the grant log, R3.33); every run that executed a `Lumi.read`,
refused runs included, MUST be a history entry, a run started by a delegate key MUST be shown with that key's label, and the client that signed each grant (`clientId`, R3.10) MUST be shown, and a plugin withdrawn by the network (R3.26) MUST show as "withdrawn by
network"; the signed record stays in the person's own store, which the person may
erase, and nothing needed to revoke or to erase is lost with it, since a restored client enumerates and rebuilds the history from the leaves as R0(d) states.
Test: after a grant, three runs, one refused run that read, and a revocation, the screen lists one grant with a count
of 4 and a revoked mark, and a withdrawn plugin shows "withdrawn by network"; a client restored from the user key alone with an empty store lists every grant by reading the floor record and walking `liveLink` from the sentinel, passing an expired purged grant at index 0; a delegate-started run and a refused run are each counted and the delegate's label is shown; the reading path is checked for depth by
a UI test (`site/src/plugin/grant-history.screen.test.tsx`).
Enforced at: commit (UI test), release.
Rationale: E-R3.17

**R3.18 The entropy audit.** For the `plugin` kind class, the verdict schema MUST carry no field whose bits-per-run
exceed the declared bound of its schema (the sum of bits of every enumerated, integer and fixed-length field, plus the
refusal class and the quantized fuel and latency bucket observable by the requester, R2.18); the release build MUST compute
that bound, and a plugin that publishes more than 16 bits per verdict in aggregate MUST be refused at load; an official
action is never of kind class `plugin` (R3.5).
Test: the schema auditor computes the bound for each plugin verdict schema; a schema with a 32-bit free integer is
refused, and so is one whose bound reaches 17 bits only through the refusal class and the buckets
(`test/plugin.entropy.test.ts`).
Enforced at: load, release.

**R3.19 Plugin results never become authority.** A verdict signed under a plugin cid MUST NOT count toward a
`threshold` of an action of the `system` kind class, toward a seal share or toward a reward of the `system` kind class; plugin
verdicts count only for the plugin's own declared effect, and that effect MUST be shown as plugin-made wherever the
person sees it.
Test: `countingVerdicts` over a mix of official and plugin verdicts counts only official ones for `ledger.seal`; a
screen test shows the plugin label on a plugin-made result (`test/plugin.no-authority.test.ts`).
Enforced at: runtime.

**R3.20 Disclosure is bounded across runs.** The executor MUST refuse further runs of a grant for the rest of an epoch on exhaustion of its maximum runs per epoch (the run counter restarts at the next epoch; `remaining` in R3.27 is the maximum minus the finalized counter of the current epoch for runs) and MUST suspend the grant on exhaustion of its cumulative bit budget (R3.10), the bits counted over the bound of R3.18, further use after that needing a new
authorization; the budget bounds what a plugin discloses to its requester and does not bound an executor host, which reads the granted bytes in clear.
Test: a plugin that varies its refusal class, its fuel use and its response time by a data bit is run until the grant
is exhausted; the grant is then suspended with `REFUSED:grant` (runs exhausted: refused until the next epoch, when the run counter restarts; bit budget exhausted: suspended until a new authorization) and the run count of an epoch never exceeds the grant's maximum
(`test/plugin.disclosure-budget.test.ts`).
Enforced at: runtime.
Rationale: E-R3.20

**R3.21 The permission screen enables authorization only after the whole list.** The client MUST enable the authorize
button only after the whole list of R3.9 was shown, and a plugin that requests a permission beyond what its manifest
declared MUST be refused.
Test: the button is disabled until the list is scrolled, and a manifest mismatch refuses
(`site/src/plugin/authorize.gate.test.tsx`).
Enforced at: commit (UI test), release.

**R3.22 Merged.** Merged into R3.10.

**R3.23 No confusable plugin name.** A plugin name MUST NOT equal or be confusable (case, homoglyph) with an official
entry name or another listed plugin's name.
Test: a plugin named like an official entry or with a homoglyph of another is refused at listing
(`test/plugin.name-confusable.test.ts`).
Enforced at: release.

**R3.24 Required means necessary; no service conditioned on an optional permission.** A plugin MUST NOT make its
service conditional on a permission its manifest does not mark as required, and a permission MAY be marked required only
if the plugin's declared function cannot run without it, which the listing review verifies against the manifest's
necessity sentence; a plugin whose required set contains a catalog risk-class `high` permission is refused at listing; the listing review MUST also verify that each purpose sentence contains a term from the `purposeTerms` list of the catalog entry of its permission (R3.8), is at most 200 characters, is plain text with no bidi controls, zero-width or confusable characters, and exists in every language the client offers, or the plugin is shown only in the languages provided.
Test: a plugin that refuses service when an optional permission is toggled off, one marking an unnecessary permission
required, one requiring a `high` permission, and one with a purpose sentence carrying bidi controls, over 200 characters, generic ("improve experience") or containing no term of the `purposeTerms` list are each refused at listing
(`test/plugin.no-conditioning.test.ts`).
Enforced at: release.

**R3.25 Optional permissions are individual toggles.** Each permission the manifest does not mark required MUST be an
individual toggle on the authorization screen, off by default, and the grant's permission set MUST contain only the
toggled ones.
Test: authorizing with every optional toggle off yields a grant with the required permissions only
(`site/src/plugin/authorize.toggle.test.tsx`).
Enforced at: commit (UI test), release.

**R3.26 Author identity is attested, and the network may withdraw.** A plugin MUST NOT be listed, and members MUST NOT
countersign a grant for it, unless a version-numbered `author-identity` record, signed by `t` member keys after
verifying the legal name, a working contact and the country, names the author key and is valid and unsuspended at the
issued-at epoch; the legal name, contact and country live in that record (retained and purged as the author-identity retention row of R0(d) states; the author MUST be shown this retention basis at attestation, which is the legitimate interest or legal-claim basis (Art. 6(1)(f), 17(3)(e) GDPR) and names the recipients (every grantor who sees the screen), and a request to erase the record MUST withdraw the author key and list no plugin); only the contact field is updatable without effect, and any change of legal name, country or author
key MUST suspend every grant naming an earlier identity version (`REFUSED:grant` once the suspension is in the finalized withdrawal root, `REFUSED:stale-log` before) until the person re-authorizes on the
R3.9 screen, and a suspension by identity change and a listing `status` transition (R3.5) are recorded in the `withdrawalRoot` set; a contact that fails its liveness check suspends listing, and a liveness failure not cured within `LIVENESS_CURE_EPOCHS` (OI-42) MUST withdraw the author key; a record signed by `t` member keys MAY withdraw a plugin cid or an author
key, which the executor MUST consult on every run (R3.11) and refuse with `REFUSED:grant` once it is in the finalized withdrawal root (`REFUSED:stale-log` before), and an executor that cannot
show the withdrawal set up to the head's `withdrawalRoot` MUST refuse a plugin run with `REFUSED:stale-log`.
Test: a plugin whose author key has no valid `author-identity` record is refused at listing and its grant is not
countersigned; updating the contact in the record leaves the plugin cid and existing grants valid; a change of legal
name, country or author key refuses runs under the earlier grants until re-authorization; a failed liveness
check suspends listing and, uncured past `LIVENESS_CURE_EPOCHS`, withdraws the author key so that runs are refused; a node starved of
the withdrawal record refuses runs with `REFUSED:stale-log`; after a withdrawal of a cid a run with a live grant is refused and a new grant is not
countersigned; the record is purged to its salted digest after the last grant naming it is purged and the key has no listed plugin, an erasure request withdraws the key, and after the purge hashing the known canonical record yields no match (`test/plugin.author-identity.test.ts`).
Enforced at: runtime, release.

**R3.27 The run and bit counters are finalized records.** The run counter and the bit counter of a grant MUST be records
of the grant log (R3.33) updated at finality, the counters of a leaf changing only by a `grant-counter record` of R0(b), proposed by the executor of the bundle with the signatures of `t` members and folded at finality in the log order of the fold rule of R0(e) (grant-counter record), an executor MUST admit unfinalized runs for a grant (the admissions whose request id is not yet entered in the finalized counter, per executing epoch, written in the atomic write of R2.19 and surviving a restart) only up to `floor(remaining × (n−t+1) / (2n−2t+1))` (`remaining` being the maximum
minus the finalized counter, of the current epoch for runs, `n` the members of the epoch), derived from `f = 2t−n−1` byzantine nodes, `n−f` honest
nodes and at least `t−f` honest verdicts per bundle, so that the bundles releasable in one `FINALITY_WINDOW_S` never
exceed `remaining` (the window being `FINALITY_WINDOW_S`, OI-41), and a run MUST NOT be served by a node that cannot show the finalized counter (`REFUSED:stale-log`); an admission whose record could not fold (R0(e), grant-counter record) stays counted, its run in the count of its executing epoch until that epoch ends and its bits in the cumulative count until the grant's expiry, as a counter per (grant, executing epoch) held at the node, at most `E_r x B` counters at the node, removed at the grant's expiry (the node-held row of R0(d)); a run over the unfinalized admission bound of a grant is `REFUSED:stale-log`, a run over the requester bound of R2.19 is `REFUSED:budget`, except a run failing both bounds, which is `REFUSED:stale-log` (R2.19), and `REFUSED:grant` for exhaustion applies only when the finalized counter shows the maximum reached.
Test: one grant driven through 1 and through 20 relays executes the same total runs, at most the maximum; one grant
driven concurrently through every `t`-subset of 21 nodes releases at most the maximum in bundles; a node
without the finalized counter serves no run; n = 51 with 16 byzantine nodes signing past the budget releases at most
`remaining` bundles (`test/plugin.counter-finality.test.ts`).
Enforced at: runtime.
Rationale: E-R3.27

**R3.28 A plugin result reaches a requester only as an agreed bundle.** A plugin result MUST be released to a requester
only as a bundle of at least `t` signed verdicts of identical bodies (the bytes without the signing node's identity and signature), each recording the same `readDigest` (which carries the grant digest, R1.9) and the same
`(actionCid, runtimeCid)`, and a node MUST NOT return a verdict to a requester directly; a bundle MUST be released only to the `requesterKey` of the signed run request, and that key MUST be the grant's user key or a delegate key named in it.
Test: one colluding executor that ignores the grant returns nothing usable to the requester (the copy of the bytes it read in clear on its own host is outside this test and is stated by R3.9); the client verifies the
bundle and rejects a verdict signed by fewer than `t` nodes (`test/plugin.bundle-release.test.ts`).
Enforced at: runtime.

**R3.29 Release latency is one bucket.** A plugin result MUST be released to the requester at the 100 ms
latency bucket of R2.18.
Test: the release latency of a plugin result is one value, a multiple of 100 ms (`test/plugin.release-latency.test.ts`).
Enforced at: runtime.

**R3.30 The run stamp is the executor's finalized head.** The run stamp `(headEpoch, headSeq)` MUST be the executor's finalized head epoch and
head sequence, recorded in its own signed pre-run reservation (the request `seq` is only the requester's counter), a sequence field in `Lumi.params` is data of the action and
never feeds the grant check, and a request is refused when it quotes a head one epoch older than the executor's, a pair `(requester key, seq)` already reserved being handled only by R2.12 and R2.19 (the exact replay of an executed request is answered with the cached signed result of the current epoch), and a request whose `seq` is at or below the retained highest seq of its key, or whose quote is older than the head by more than one epoch, is dropped without a signed output (R2.12); each of the other refusals is `REFUSED:stale-log`; the run request is the `run request` structure of R0(b) and the reservation the `pre-run reservation` structure; the nonce
is recorded in the grant-log leaf at finality by the fold of R0(e) (grant-counter record), an executor whose finalized head is older than the quoted one refuses with `REFUSED:stale-log`, and a head within the R1.17 bound is accepted when the quoted epoch equals it (the verdict's `readDigest` carries the quoted epoch, R1.9), a member MUST refuse a run whose nonce is already recorded or reserved at
any quorum member it queries (R3.15), and a grant's counters increment once per nonce.
Test: a request whose `Lumi.params` carries a sequence has it ignored by the grant check; a replayed request quoting a
head before the revocation, is refused, and one repeating a reserved pair is answered from the stored output or dropped (R2.12, R2.19); a captured signed request replayed to a
different `t`-subset executes no second run and leaves the counters unchanged; the exact replay at the executing node
returns the cached result, and a request replayed in the next epoch yields no second signed output (`test/plugin.sequence.test.ts`).
Enforced at: runtime.

**R3.31 Merged.** Merged into R3.15.

**R3.32 Members countersign a user-signed revocation.** Members MUST countersign a well-formed user-signed revocation whose `quotedHeadEpoch` is within one epoch of the member's finalized head (an older or later one is dropped, R2.12, and the client signs a fresh record) and whose leaf, found at the leaf address of R0(d) (from the `grantIndex` the revocation carries), is in the finalized grant log or that carries the signed grant record (R2.12), the countersignature being the receipt of R3.14,
within the round bound of R4.7 (3 round timeouts at n <= 21, 6 above).
Test: a well-formed user-signed revocation is countersigned within the round bound by every honest member, and a revocation signed at one epoch and delivered three epochs later is dropped with no unit spent, the same key then signing a fresh record that every honest member countersigns
(`test/plugin.revoke-countersign.test.ts`).
Enforced at: runtime.

**R3.33 The grant log is prunable and outside the ledger.** The grant log MUST be a prunable structure outside the
immutable ledger, only the Merkle roots `grantLogRoot` and `withdrawalRoot` are finalized on the ledger, and no grant, revocation, run or requester-counter entry MAY be written
to the ledger itself.
Test: after the purge the ledger holds no per-person entry (`test/plugin.log-structure.test.ts`).
Enforced at: runtime, release.

**R3.34 Log leaves are keyed by a grant-held secret.** Leaves of the network-held grant log MUST be addressed, keyed and enumerated as the `grantKey` derivation, leaf address, leaf content and restored-client enumeration rows of R0(d) state, and `grantKey` and `grantIndex` MUST be presented in the signed run
request and in a revocation; a purge MUST replace the leaf by its `index` and its salted digest at the same address (R3.35), the placeholder MUST be kept for the period the retention row of R0(d) states, an account erasure MUST convert the placeholders to a final tombstone, and the privacy notice MUST classify
the log as pseudonymous personal data.
Test: (1) a `grantKey` is recomputed identically from the user key and the `grantIndex` and differs between two grants of one cid; (2) a client restored from the user key alone finds every leaf by reading the floor record and walking `liveLink` from the sentinel, passing a purged leaf, and reads each grant digest from its leaf; (3) a leaf holds only the fields of the leaf content row of R0(d) and the network-held log holds no user key or cid in clear, a leaf of a grant spanning 3 epochs is found at epoch 3
and is not enumerable from public keys, and a purged leaf is only its `index` and its salted digest; (4) a grant after the purge of all earlier leaves is countersigned at index k+1 carrying `prevLeafKey`, a reused index or an occupied leaf address is refused, and after an account erasure the placeholders are one final tombstone (`test/plugin.log-keys.test.ts`).
Enforced at: runtime.

**R3.35 Revoked entries are retained until expiry, then purged.** The grant log and the node-held requester state MUST be retained, purged and erased as the retention and purge and the erasure and tombstone rows of R0(d) state, and the retention basis MUST be recorded in the privacy
notice; the retention periods of the `consent` field MUST equal those rows and the author-identity retention row, and a runtime record whose `consent` retention periods differ is refused `runtime-unsigned`.
Test: (1) revoke at epoch E, force the purge job, and the replayed grant is still `REFUSED:grant` until expiry; (2) an entry
expired `MAX_GRANT_EPOCHS + 1` epochs ago is purged; (3) an erased account leaves no per-person leaf after expiry, a run on a live grant after erasure is `REFUSED:grant`, and a runtime record with differing `consent` retention periods is refused; (4) after an account erasure the user key's next run of a non-plugin kind class is charged against the node's unchanged bucket (R2.19), a captured old request is still dropped, and a run of a delegate key is `REFUSED:grant`; (5) after a purge, hashing the known canonical entry yields no match
(`test/plugin.log-retention.test.ts`).
Enforced at: runtime, release.

**R3.36 No open-ended permission, grantor data only.** A permission MUST NOT be open-ended (a permission that reads
"all" is not in the catalog) and MUST open only data whose sole data subject is the grantor, so that counterparties'
content and identifiers in messages and contacts are not grantable and a permission over such a record returns only the
grantor's own fields.
Test: the catalog schema forbids a wildcard name; a messages permission returns none of a counterparty's content or
identifiers (`test/plugin.catalog-subject.test.ts`).
Enforced at: load, runtime.
Rationale: E-R3.36

**R3.37 Excluded sensitive classes.** The age and birth-date proofs and every minor-related datum of the age rules A6
MUST NOT be grantable to a plugin, and any record of a minor account MUST NOT be readable by a plugin, whatever grant
exists.
Test: a grant naming a permission of an excluded class is refused, and a plugin reading a minor's record gets no data
even with a valid grant (`test/plugin.catalog-excluded.test.ts`).
Enforced at: load, runtime.

**R3.38 A minor's refusal leaks nothing.** A minor's account MUST be refused a grant at the authorization screen, and
the refusal of the countersignature and every executor refusal on a minor's data MUST be byte-identical to the refusal
for an account with no grant and indistinguishable in timing.
Test: a plugin reading a minor's record returns refusal bytes equal to those of an account with no grant, in equal time
buckets of 100 ms (R2.18), even with a valid grant (`test/plugin.catalog-minor.test.ts`).
Enforced at: runtime.

**R3.39 Grants resolve under the catalog version in force.** An executor MUST resolve grants only under the catalog
version in force and MUST refuse a permission withdrawn from it.
Test: a grant naming a permission withdrawn from the catalog version in force, or a permission not in the catalog, is
refused (`test/plugin.catalog-version.test.ts`).
Enforced at: load, runtime.

