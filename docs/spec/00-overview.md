**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

# Angstone architecture: the target and the path
The target of the whole system, part by part (section 1), the runtime and the gates (Part R) and the order of the path (section 2); the stage sections record what holds today.

## This version

This version stands alone. This one document holds the law, the council, the 1 ANG, the screens, the legal decisions D1-D18, the public profile, zk age and Where for institutions. It is architecture, not code: where a mechanism is built on a fork the text names the commit; where it is design only the text says so. Freezing a version of this document is an owner action; the "Freeze gate" at the end of this file lists what must hold before it, each item with the command that proves it. Until the freeze, no deployment is made from this document's work; after it, the network is reset with the new code and restarts from a new genesis and a new invite tree (the deploy scripts perform the reset, never a worker by hand). Nothing of the ledger survives the reset: no balance, entry, handle, profile, relay row, invite or council ticket of earlier and dev networks carries over, and no text may promise that it does; the invite tree restarts at the roots with the first invite issued after the genesis; whether the root keys change is decided at the freeze (G12); the documents, the code, the frozen tags and the brand are kept; after the reset the 1 ANG welcome grant (A2) funds each new member from the new genesis.

This text is Merry 5.2.1 (frozen): the frozen 5.2 text with its release token corrected, and no other requirement change. Last full review (round 7, five lenses: security, consistency and mechanism, law, economics, fidelity) 0 CRITICAL 0 HIGH. The digest is in the tag message.

Changes in 5.2, ten corrections C1 to C10 (the defects D1 to D10 of the owner-values ruling, not the legal decisions D1-D18), each with the section of its correction: C1 the unstaked subtree has its own floor slice of the unverified pool, divided equally among its holders, with a load-time assertion that the ceiling of subtrees is at least 1 (R2.11); C2 the cadence of proposals is a protocol constant and every proposal seals a checkpoint (R1.17, R0(c)); C3 the two epoch bounds have two names, `MAX_EPOCH_SPAN` in days and `MAX_EPOCH_SPAN_SEQS` in seqs, the seq side produced by the `nextSeq` commitment and the days side by a fail-closed check of the plugin class, a deliberate liveness coupling (plugin runs are refused until a hand-over) (R0(c), R1.17, R3.10); C4 the eviction price in two resources and the order in which its values are ruled (R0(e)); C5 the subtree-share bound is declared an identity and the usability floor of the free allotment is the assertion that binds (R0(e)); C6 the storage bounds are tied to the supported device by a measured corpus over the entry counts the slices can reach (R2.6, R0(e)); C7 the per-connection cap is per connection and a relay that multiplexes users shares one (R2.11); C8 the record declares the maximum set size it serves, `metering.nMax`, and `queryCharge` is asserted at load against it at the weakest admitted threshold (R0(c)); C9 the bound of staked keys inside an invited subtree (R0(e)); C10 the executor role, the relay operators' reading and the adequacy of the destination country are an open item for the lawyer (OI-44, G13).

### Names: merry-N, sunny-N, menu teseu

Conventions that bind every text and every artifact:

- The architecture version is named `merry-N`, with N counting from 1. This document is the current version, `merry-5.2.1` (the release token, stated once, here).
- Once the seed passes to the council and a major council exists, the architecture series is named `sunny-N`, from 1.
- The names of the channels (alfa, dev, prod) and the host alfa.angstone.app are not architecture names and do not change: the channel is not the architecture.
- The ME menu is named `menu teseu`, written exactly so: lowercase, never translated to "Theseus", never capitalised. Every person's menu is their teseu: the same name for all, never the person's name. The security theorem's "Theseus resistance" is a different thing and keeps its name.

### What this version adds: normative Part R

Part R is normative. Its five sections:

| # | Section | Rule |
| --- | --- | --- |
| R1 | Sealed Lumi Actions with injected runtime | A Lumi Action is one sealed file or folder with no imports; the runtime injects a versioned API. |
| R2 | Executor protections | The executor that runs a Lumi Action is protected against abusive or faulty actions. |
| R3 | Plugin actions and permissions | A plugin cid reads no user data without a signed grant. |
| R4 | Scale proof gate | Scale tests gate every stage from Stage 4 (the set grows past 2); Stages 0 to 3 run the shapes n = 1 (t = 1) and n = 2 (t = 2) only. Assertions (e), (f), (g) and the runtime cid, the list version and the runtime-record values digest of the release record are asserted only from the stage that ships the runtime (Stage 5); at Stage 4 the battery asserts (a) to (d) and (h), with the double-output clause of (b) excluded. |
| R5 | Code guideline gate | A guideline validator gates every repository. |

### The reset

After the freeze of this version the network is reset with the new code and restarts from zero. The reset is a deploy-script step by the orchestrator, never a worker's, and no worker deploys anything before the freeze. A new genesis ledger entry and a seed manifest are signed again for this version's contract; the previous network's contract cid is not carried over. Whether the root keys change (`ROOT_KEYS_CHANGE`) is decided at the freeze (G12). Nobody keeps an old invite or an old account: the invite tree restarts at the roots, the first invite is issued after the genesis, each member signs up again with a new invite and a new passkey, and the account return of A5 applies only inside the new network. Nothing of the ledger survives: no balance, entry, handle, profile, relay row, invite or council ticket of earlier and dev networks carries over, and no text may promise that it does. Kept: the documents, the code, the frozen tags and the brand. After the reset the 1 ANG welcome grant (A2) funds each new member from the new genesis.

### Status of open items

Items still binding on the implementation, each a neutral question or a state of the code; where a value is not decided, no default is set:

- Open item OI-31: the stake and epoch numbers: BOND_WINDOW (2), BOND_AMOUNT (100 ANG), SEED_VALIDITY_S (7 days), EPOCH_MIN_S (8 days) and CLOCK_SKEW_S (600 s) are code defaults awaiting the owner's number (OI-3); VETO_QUORUM = max(1, n - t) is the approved formula, fixed by code (an approved ruling); for `MIN_EPOCH_SPAN` (a seq count, used for the veto slot) and `MAX_EPOCH_SPAN` (days, R3.10) no default is set; `PROPOSE_EVERY_S` (R1.17; a code default of 21,600 s in `constants/seed.ts`) and `MAX_EPOCH_SPAN_SEQS` (R0(c); a code default of 100,000, today named `MAX_EPOCH_SPAN` in `constants/stake.ts`) are protocol constants awaiting the owner's number; council stake is on the ledger (stage 4a).
- Open item OI-32: the message-delay bound Delta has a proposal, Delta <= 30 s (one seal round), a working value pending OI-32, not a default; no test measures it and no value is set. R4.7 uses 30 s as its working value.
- Open item OI-33: the 56 testable legal requirements Q1-Q56 and the decisions D1-D18 are written in the text; no Q has a test yet, and D1-D18 are provisional until a lawyer confirms them. The 40 requirements of the D1-D18 decisions document are each present in this file with their decision id; text done, tests to be written.
- Open item OI-39: leader rotation, or a slash ask from a non-leader; no default is set; today only the epoch leader asks the double-seal slash.
- Open item OI-40: the value of `MAX_GRANT_EPOCHS` (a `grantEpochs` constant of R0(c), with `MAX_GRANT_EPOCHS × MAX_EPOCH_SPAN ≤ 180`, `MAX_EPOCH_SPAN` in days) is not set; epoch length is not fixed by this document.
- Open item OI-41: the value of `FINALITY_WINDOW_S` (a `windows` constant of the runtime record), the bound within which a revocation reaches every node of the epoch and the window of R3.27; no default is set.
- Open item OI-42: the value of `LIVENESS_CURE_EPOCHS` (a `windows` constant of the runtime record), the epochs within which a failed contact liveness check must be cured (R3.26) and the minimum number of epochs a fallback runtime named by a runtime-revocation record stays usable (R1.14); no default is set.
- Open item OI-43: the values of the runtime-record fields `buckets` (including `tableCap`, `invitedKeysPerRoot` and the two verification shares, and the load-time assertions of R0(c) and R0(e)), `metering.queryCharge`, `metering.nMax`, `metering.supportedDevices` and `consent` as R0(c) lists them (the retention periods of `consent` are fixed by R0(d), not by this item); no default is set; and the gate constant `RELEASE_HOLDERS_MIN` of R4.15 (the least number of release-key holders the record may state), whose default is 5 until set; the price of starving one chosen unstaked key by its floor share (R2.11) is a stated residual of the values of this item, the price and not a decision.
- Open item OI-44: whether the role recorded for each executor region in R3.9 and R3.10 (processor, or independent controller) is the right one for the independent node operators, whether relay operators stay controllers of their own storage (the reading A of "Who is who"), and whether Brazil is an adequate destination for residents of the European Union, are for the lawyer of G13; the texts of the legal decisions and of `consent` stay provisional until the lawyer answers, and this document decides none of them; no default is set.
- T1 liveness limits (Stage 7): a stale device moves only toward an authority checkpoint, and withholding the re-signed seed stalls fresh devices.
- Every genesis seed carries no checkpoint: node-run refuses it unless `--genesis-only`, and such devices stay exposed to capture until seeds carry a checkpoint.
- A seed worker built before 186edcf refuses a seed that carries `signedAt`, and one built before 9cbf53f refuses a seed that carries `endorsedSince`: rebuild the worker before publishing such a seed.
- A bounty reward is credited only when the epoch leader carries it in the sealed checkpoint (`bounties`, at most MAX_BOUNTIES = 4); a bare `bounty` entry does not fold (`bounty-unsealed`). The member's own ledger invite and the unbond have no node path that asks their seal; no honest sealer can share an unbond.
- The site wallet double-folds while a node runs (High, three findings); fixes not landed unless the closed section proves otherwise.
- Two rounds sealed on two different vetoes (the vetoer double-sealing again) remain a named limit. Start-up and the fork choice still fold from the genesis. The junk memo and the failed-candidate memo share one cap (512), so a real failed candidate may be folded again (time only).
- A display name is unique and public (record `ang.name/1`, relay table `display_names` mirroring `handles`, rule A4.4): design only. The public profile records `ang.profile/2` and `ang.photo/2` still need their engine wiring.
- The minor council's ticket pool and 2/3 quorum over kind-8917 records: replication into the reducers is the next slice. Two-tier finality with the legitimacy principle (Stage 7b) and the proven-inference council seat (Stage 8b) are written, not built.

Every claim in this document is one of two things: a requirement stated as a requirement, or code that exists, named by its path and the test that proves it. A mechanism that is a proposal is marked as a proposal and is not a fact. A gap in the requirements is a question in the open items, never a mechanism. Names are the glossary's (docs/GLOSSARY.md). Paths are relative to the repository root of the angstone project. The byte copy of this file is site/docs/qa/2026-11-11-architecture.md, committed on site dev after each parent commit.

The architecture is made on day zero to be ready for and compatible with everything in it, and is treated as real and certain. The target already contains the target and the path to it, not only the path to the next step. Architecture comes first, code after. The root cause is fixed through the single standard path, and no patchwork branches are created. So: section 1 is the target, Part R the runtime and the gates, section 2 the path as stages (with the ordered features and the legal compliance sections inside it), section 3 the map of every plan to a stage, section 4 what is open, section 5 what is in flight. Each new piece of code names its stage first.

## R. Runtime, plugins and release gates (normative)

This part states what a Lumi Action is as a sealed artifact, the runtime that executes it, the protections an executor
node owes itself, the rules under which third-party (plugin) actions may run and read user data, the scale proof that
gates every stage from Stage 4 on (the set grows past 2 there; Stages 0 to 3 run the shapes n = 1 with t = 1 and
n = 2 with t = 2 only; assertions (e), (f), (g) of R4.6 and the runtime cid, the list version and the runtime-record values digest of R4.15 are asserted only from
the stage that ships the runtime, Stage 5, and at Stage 4 the battery asserts (a) to (d) and (h) with the double-output clause of (b) excluded, R4.12), and the code guidelines that gate every repository. It builds on 1.3 (Lumi Actions), 1.4 (nodes,
stake, the invite tree), 1.10 (the frame) and Stage 5 (every action a Lumi Action). The key words MUST, MUST NOT,
SHOULD and MAY are to be read as in RFC 2119. Each requirement has an id `R<section>.<n>`, is one testable sentence,
and names an automated, code-decidable check on its `Test:` line. `Enforced at:` names the point where the check bites:
load (an executor loads a seal), runtime (an executor runs it), release (a stage ships), compile, commit, or task end (a worker's task).

Vocabulary used here, as in the rest of the document: `cid` is the content identifier of a sealed artifact; a verdict
is a signed answer `{ok}` or `{ok:false, reason}` over an action and a view; a member key is a key of the epoch set
`epochKey.members`; `t` is `threshold`, with `2t > n` for a set of `n` members created under the epoch rule (a legacy `sealed` hand-over
may break it, Stage 7); a verdict share is a node's signature
piece over the network key, and the share of a `ledger.seal` verdict is a seal share (R2.2); the relay is a carrier that can only withhold; stake as in 1.4;
the five drawers are those of 1.10, and the four source drawers of R5 and the sealed `lumi/` directory are the source layout. An action kind is a specific action
(`ledger.seal`, `record.attest`, and the others); a kind class is one of `system`, `record`, `payment`, `plugin`
(R2.7), and every action kind belongs to exactly one kind class (today `ledger.seal` is of class `system` and
`record.attest` of class `record`); a refusal class is the `<class>` of a `REFUSED:<class>` (R2.8). The round timeout
is the Delta of OI-32 (working value 30 s, a proposal pending OI-32, not a default).

