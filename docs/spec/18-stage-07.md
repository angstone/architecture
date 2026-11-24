**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 7: Theseus resistance for the late device (parts 5 and 6 of 1.5), as of network 91262a6

What it is: old and rebel nodes must not be able to assemble to forge a signature that is valid in the present; this is the last bottleneck and security problem. The condition in full: a set of keys that once sealed, and has since been handed over, cannot produce a signature any device accepts as valid now, including a device that joins late and never saw the hand-over. The mechanism is not open: it is the six parts of 1.5 and the confirmations rule (below), which turns a capture into a delay: what the old set gets a device to accept is never final, and the device comes back.

How to read this section: it describes the reference implementation state (network dev; site dev where the site is named).
Every claim is followed by the test that proves it, written file > test name (files under network/test/ unless another repo is named; each name is a title that exists in the tree, and every network file cited passes). Code is named by file and symbol, not by line. Nothing is stated as holding that no test holds; where only code holds a fact, the text says so. The named limits T1 to T3 and the mid-catch-up stale limit close the section, under "The one judge".
The section has been reviewed in rounds (network docs/qa/review-stage7-rN.md); each finding is closed in the text below, in a row with its tests, or named as a limit. The rows on coercion, a bare majority, timing, the authority's override and node-run's newer seeds ("Coercion, a bare majority, timing and the authority", after the guarantees) carry the findings of those rounds. The binding facts of the findings are:
- No set of members smaller than `t` produces a seal other than a veto sealed at VETO_QUORUM (which confirms nothing), a checkpoint, or a counted verdict; VETO_QUORUM seals are the single exception named in R4.4 and R4.6(b) (test/scale/tolerated.test.ts, Part R).
- A veto against a hand-over at its slot is judged at the slot (theseus.confirm.veto.test.ts, theseus.veto.slot.test.ts); the judge's fold continues from the head.
- A planted device with no pin behind its first checkpoint seed is not refused; its page boots through bootNode (the pin a genesis-seed device takes comes from its own fold, src/node/judge.ts).
- The authority's signing time is a signed `signedAt` field of the seed manifest, not derived from notAfter; beats() applies the same in-time rule below the slot; bootNode falls back on a planted device with no pin.
- The seal covers the entry's author and created_at.
- Invite and reserve entries are sealed by the epoch set; the bounty is kept unsealed and open, and a reward is at most BOUNTY_CAP bytes, with the leader packing a checkpoint so its seal-ask fits NODE_CAPS.
- A branch is weighed only by seals that verify, and a failed candidate is never folded twice; a low-forking junk checkpoint is weighed once and successor() reads from a suffix tally.
- A fresh draft past CLOCK_SKEW_S is refused; the earliest signedAt per checkpoint is kept in the node database.
- One member's two vetoes at one slot fold to one; at most one competing veto sits beside the head, and the fold continues from the entry below the slot; the round path takes the sibling veto from the evidence and the entries kept aside, and a veto refused `veto-competes` is kept aside; slotSibling's round path takes no veto above the slot and drops the candidate with the sibling when the fold does not take it.
- slotRace races a hand-over only when its seal verifies.
- The in-time endorsement is carried by the authority's later seeds; a stale device follows the authority's newer checkpoint.
- When the hold drops a ledger entry above its window, the node asks its relays for the gap again, oldest first, by `until` paging in pages of CANDIDATE_WINDOW.
- Each hold entry carries whether the epoch rule checked its author and seal, and a checked entry takes the slot of an unchecked one at a full seq; a refused entry past the epoch's end, or at the next seq on a prev the node does not hold, waits in the hold, and a round held on a competing veto is judged again when that veto arrives, so a relay's newest-first replay ends every device on the round (the competing-vetoes row).
- A stale device merely behind takes the seed authority's offered in-date checkpoint, freshness still computed at read time (the row on a seed-booted device's expiry).
- The slot-leaver row: the in-time case depends on arrival order (limit (b)).
- The unbond's missing sealing path is named (1.5 part 6).
The tests of the rounds include test/r8.invite-split.probe.test.ts, r8.junkfold.probe.test.ts, r8.round-clock.probe.test.ts, r8.kept-restart.probe.test.ts, r8.bounty-split.probe.test.ts, r9.double-veto.probe.test.ts, r9.lowjunk.perf.test.ts, r9.intime-carry.probe.test.ts, r9.stale-stuck.probe.test.ts, veto.competing.test.ts, r10.fat-bounty.test.ts, r10.veto-lofirst.test.ts, r10.veto-stream.perf.test.ts, r10.slotjunk.perf.test.ts, r11.veto-above.test.ts, r11.catchup.test.ts, r13.hold-flood.test.ts, r13.veto-order.test.ts and r13.stale-offer.test.ts, with theseus.confirm.veto.test.ts, theseus.offer-current.test.ts, theseus.veto.slot.test.ts, theseus.confirm.authority-vs-handover.test.ts and coercion.veto.test.ts.
The site rows are read at the reference site state: the wallet reads one fold per device and shows its finality, the page's engine hands startNode the compiled seed pins, the page's node takes each newer seed the upgrader applies, and the store is built by Redux Toolkit (which changes no Stage 7 row).

Guarantees (threat model), at the reference implementation state:
- A reader that knows the hand-over refuses the old set's seal (epoch.handover.test.ts > "over a real peer
  (ed-relay)", under "after the epoch hand-over, the past epoch signs nothing a reader accepts").
- A device that saw a checkpoint refuses another past at or before it that carries no confirmation (node.pin.test.ts >
  "B comes back on its own store: it keeps its pinned chain and refuses the other history, does-not-extend-checkpoint";
  "even with the other history in its store, B folds the pinned history"). The one way off a pinned branch is the fork
  choice of the confirmations rule below.
- An epoch's keys are drawn from each device's own secret, never from public data (src/node/key.ts `drawNodeKey`;
  node.key.test.ts > "is drawn with no argument from the CSPRNG: two draws differ, and the key is a BIP-340 pair").
- The late device (1.5 part 5): seed-sign signs only a seed carrying a sealed checkpoint with its time
  (`--checkpoint <id>:<seq>:<time>`) or a genesis seed (`--genesis-seed`), and refuses anything else, writing nothing
  (seed.sign.test.ts > "refuses a manifest with no checkpoint, or a malformed one, and writes nothing"; "refuses both
  --checkpoint and --genesis-seed, and writes nothing (neither is refused above)"; theseus.seed-expiry.test.ts >
  "scripts/seed-sign.ts --checkpoint id:seq:time signs checkpointAt = time and notAfter = time + SEED_VALIDITY_S; a
  time older than SEED_VALIDITY_S is refused STALE_CHECKPOINT, one more than CLOCK_SKEW_S ahead of the signing
  FUTURE_CHECKPOINT, ..."). `startNode` applies the booted seed through `judged()` (src/node/judge.ts), which refuses
  it, no pin left, for one of the four `PlantWhy` reasons (src/interfaces/pin.ts):
  - `checkpoint-not-sealed`, the fold did not place that checkpoint (seed.checkpoint.test.ts > "a checkpoint that is an
    id not in the chain: refused checkpoint-not-sealed, no pin left"; "a checkpoint that is a real entry of the chain
    but not a checkpoint: refused checkpoint-not-sealed, no pin left"; "a checkpoint with the right id at a wrong seq:
    refused checkpoint-not-sealed, no pin left");
  - `checkpoint-time-mismatch` (theseus.seed-expiry.test.ts > "where the chain is present the time claimed must be the
    folded checkpoint entry's created_at: a wrong time is refused checkpoint-time-mismatch, no pin left; the right one
    plants and is pinned");
  - `seed-before-handover` (node.long-range.test.ts > "a stale seed (its checkpoint at seq 2, before the hand-over at 3)
    is refused seed-before-handover, no pin left"; "a forged fork's hand-over above the checkpoint does not make the
    fresh seed stale: planted and pinned");
  - `seed-expired`, past the earlier of notAfter and checkpointAt + SEED_VALIDITY_S, or undated
    (theseus.seed-expiry.test.ts > "a. a fresh device, a stale but genuinely signed seed (checkpoint honest[2], notAfter
    = the time it was signed + SEED_VALIDITY_S), ..."; "a seed with no notAfter is refused seed-expired on a fresh
    device, no pin left: ...").
- No entry tagged with an epoch its chain has not handed over to gets an attest ok (node.long-range.test.ts > "a device
  at its head refuses each by name, at the next place and further ahead"; "a running node at its head refuses each,
  stores none and keeps its head"), and a hand-over timed beyond the device clock + CLOCK_SKEW_S is refused
  `epoch-at-future` (theseus.fable-g.test.ts > "record.attest refuses it at the next place, epoch-at-future; the
  hand-over due now attests ok").
- Planted from the seed signed at the newest hand-over and offered the old fork first, the device ends on the honest
  chain and stores none of the fork (theseus.test.ts > "offered the old fork first and the honest hand-overs after, it
  still ends on the honest chain at epoch 2 (§2b; S7)"; node.long-range.test.ts > "b. planted from the signed seed (its
  first pin the seed checkpoint), shown only the alternatives: it folds and stores none, attests none").
- The seed's trust is checked by the judge itself: `judged()` verifies the booted seed under
  `StartOptions.seedAuthority` before anything of it counts; a seed signed by another key, or no authority given,
  moves no pin and leaves the device stale (theseus.seed-authority.test.ts > "a forged seed, signed by a key outside
  the pins: stale"; "a seed with no authority given: stale"). network/scripts/node-run.ts takes the authority from the seedPins of its
  --genesis file alone (theseus.authority.test.ts > "a seed signed by the old set's key: refused before it starts, its
  database untouched"). The site's engine passes `seedAuthority` to startNode and the page hands it the compiled seed
  pins (site/src/node/engine.ts, site/src/main.tsx with `PAGE_SEED_AUTHORITY` from site/src/store/seed-engine.ts); the
  engine's tests run their node with it (site/src/node/node.browser.test.tsx). No
  test drives main.tsx's own line.
- A device behind the seed's checkpoint is not refused: the checkpoint becomes a pending candidate, the device runs
  stale on its pinned history (it answers no seal-ask, vouches for nothing, proposes nothing), and the judge pins the
  checkpoint once the fold's path connects to it (theseus.behind-pin.test.ts > "a store holding honest[0..2] (pinned
  2) and a seed whose checkpoint is honest[5]: planted, pinned 5, and it folds to honest[5] from the pin down"); a
  store that pinned another entry on that path refuses the seed (same file > "a store holding honest[0..1] and the old
  set's branch to its checkpoint at 4 (pinned there), a seed whose checkpoint is honest[5] with the chain: refused
  checkpoint-not-sealed, the old pin stays"). A planted device with no pin is not refused either (review-stage7-r6 F3): a
  seed whose checkpoint the device holds nothing at starts pending on it,
  as on a pinned one (src/node/pin.ts `seedWhy`, with the planted mark the judge passes), and the candidate connects
  when its path walks down to the genesis entry (pin.ts `reachesGenesis`), then is judged by `plantWhy` and
  `expiryWhy` as before. This is the genesis-seed device of every seed today when it is behind the authority's
  first checkpoint seed (theseus.genesis-behind.test.ts > "GOAL: a genesis-seed device holding 0..4, restarted through
  bootNode on the authority seed at 8, starts and reaches 8"; "CONTROL: the same device holding 0..9 (the checkpoint 8
  held) restarted on that seed starts and pins 8"). That held only while the fork held nothing at the seed's seq
  (review-stage7-r7 F3): a planted device with no pin, captured by a retired set's continuation of entries that are
  not checkpoints (grants), which holds an entry at the seed's seq, was refused `checkpoint-not-sealed`, and bootNode,
  finding no pin, rethrew, so no node ran on any later seed. Since network 3896ef8 bootNode takes the same fallback on
  a planted device with no pin (src/node/boot.ts `bootNode`, store.planted()): it starts on the held seed, or none,
  and hands the newer seed to `offerCheckpoint`, and the fork choice moves the device (theseus.nopin-boot.test.ts >
  "GOAL: the fork holds an entry at 8 (5'..9'): bootNode starts and the device ends on the true 8"; "CONTROL: the fork
  stops below 8 (5'..7'): bootNode starts and the device ends on the true 8"). A fresh device (no pin, never planted)
  given a chain without the checkpoint is still judged by `plantWhy` and refused, and bootNode rethrows for it.
- A seed-booted device, online or not, is stale once its seed expires, until a newer seed is applied
  (theseus.authority.test.ts > "the price, named: a seed-booted device online through a quiet week is stale once its
  seed expires, even online; the weekly re-sign and the stage-2 broadcast keep it current"; that test applies the
  newer seed by a restart). A newer seed applies to a running node too (review-stage7-r3 F2): the
  judge's verdict follows the newest seed it verified and passed in this boot (src/node/judge.ts `current`, `fresh`;
  src/node/node.ts reads `fresh`, not the booted seed), and a seed offered through `node.offerCheckpoint` becomes
  current once the fold holds its checkpoint and it passes `plantWhy` and `expiryWhy`, so a node past its booted
  seed's expiry is current again with no restart (theseus.offer-current.test.ts > "GOAL: offered the authority's
  newer, valid seed while running, it is current again and takes the next honest entry"; "CONTROL: an offered seed
  that is itself expired, or whose checkpoint the fold does not hold, leaves the node stale"; the latency from the
  offer to the next honest entry is printed, not asserted: 518 ms and 650 ms in the two recorded runs). This holds
  also for a stale device merely behind (review-stage7-r13 F3; on no fork, holding nothing above its pin) offered the
  authority's newer in-date seed: it must not stay at its pin refusing every later entry `stale-device`. The offer only
  adds to the authority's checkpoints (src/node/judge.ts `offer`); a fork choice that skipped every branch that only extends
  the fold's head would leave such a device stale, so the fork choice lets a branch that only extends the fold's head through only when the candidate is
  itself a checkpoint the seed authority signed (src/node/confirm.ts `forkChoice`, its `f === s.headSeq` test against
  `authority`), the judge then makes the offered seed current once the fold holds its checkpoint (src/node/judge.ts
  `judged('fold')`, the `offered` loop), and freshness is still read at each read from the current seed's expiry, never
  stored (judge.ts `fresh`: `current !== undefined && expiryWhy(current, at) === null`) (r13.stale-offer.test.ts >
  "GOAL (no relay): stale, offered the newer seed, the entries handed in newest first (the theseus shape): it reaches
  the head and is current"; "GOAL: stale, offered the newer seed, over the relay only: it reaches the honest head and
  is current", a device pinned at 19, 150 behind; "CONTROL: stale and not offered: it stays at its pin (stale is
  real)"; "CONTROL: the same device NOT stale (its seed in date), the same relay, no offer: it reaches the head"). The
  RV4-P4 control's not-held case: a stale node that holds the offered checkpoint aside
  recovers on the in-date seed, so that case runs on a second node never handed the checkpoint, which stays stale;
  the expired-seed case is unchanged (theseus.offer-current.test.ts, the CONTROL above). A device that slept
  longer than SEED_VALIDITY_S takes nothing of the old set's fork until a fresh seed (theseus.test.ts > "slept longer
  than SEED_VALIDITY_S: refused until a fresh seed, then honest[4] (F1)"; theseus.nextseq-slept.test.ts >
  "stale-device for every fork entry, the hand-over at nextSeq included; it stores none and keeps its head").
- Pre-rotation (fork/epoch-next-precommit): every hand-over names the next epoch's authority
  its predecessor committed (`nextHash`), and on a chain carrying `nextSeq` no entry of epoch e sits at nextSeq or
  after (src/impl/ledger.ts `epoch-next-not-precommitted`, `epoch-seq-out-of-range`). A device asleep at epoch N, woken
  with only the old set's branch to keys of its own, folds none of it (theseus.precommit.test.ts > "a device asleep at
  epoch N, woken with only the K' branch: the hand-over refused epoch-next-not-precommitted, nothing under K' folded,
  no evidence, no other branch"), and the old set's seal at nextSeq is refused in both arrival orders
  (theseus.nextseq.test.ts > "fork first: a device asleep at nextSeq - 1 refuses the fork at nextSeq and after it,
  holds no evidence, then takes the honest hand-over").
- Part 6 on the ledger (stage 4a): a set that leaves is bonded W epochs and a double seal costs the bond, through the
  `bond`, `unbond` and `slash` entries (ledger.stake.test.ts > "an unbond before N+W is refused by validateEntry by
  name: bond-window-open, at every epoch of the wait"; "a member posts a valid proof, sealed by the council: the bond
  is burned and the supply falls by it"; node.bond.test.ts > "a withdrawal at N and at N+W-1 is refused:
  bond-window-open"). The window of a stale seed is shorter than the bond (theseus.fable-g.test.ts > "(BOND_WINDOW -
  1) * EPOCH_MIN_S > SEED_VALIDITY_S + 2 * CLOCK_SKEW_S (defaults awaiting the owner, question 3)"). W = 2 (BOND_WINDOW),
  the bond 100 ANG (BOND_AMOUNT), the burn on slash, SEED_VALIDITY_S, CLOCK_SKEW_S and EPOCH_MIN_S are named defaults
  until the numbers are decided (OI-3, OI-31). Open (review-stage7-r8 F5): the withdrawal itself has no sealing path, since no
  honest sealer can share an unbond (1.5 part 6; the row "a member's own sealed entry" below).
- The confirmations rule (the subsection "Confirmations" below): nothing a captured device took from the old set
  reads final, and it switches back to the healthy majority's chain on a confirmation the old set cannot make
  (theseus.confirm.test.ts > "(a) the fork entry the captured device accepted at seq 16 reads not final, with fewer
  than X confirmations, while two fork checkpoints stand on it"; "(b) once the true chain (16..18) and the authority's
  later checkpoint on it (18) are delivered, the captured device switches ..." (it switches at the offer of that
  checkpoint; the true entries alone are refused and kept aside); theseus.confirm.precommit.test.ts > "(p2) the true 14, 15 and 16
  delivered (16 sealed by the committed epoch 1): the device switches on 16's arrival; 14 and 15 read final by the
  successor's seal, 16 not yet; the fork entries are off the fold").
- Limit, said plainly, the case that does not hold yet: a fresh device given no chain at plant pins the seed
  checkpoint on its signature alone (`plantWhy` returns null on no entries). Inside a stale seed's validity window
  (signed before the newest hand-over, not yet expired: at most SEED_VALIDITY_S, 7 days, from its checkpoint time) it
  cannot tell that seed from the newest one, and planted from it nothing in part 5 refuses the old set's fork above
  that checkpoint (theseus.seed-expiry.test.ts > "b. the window: the same seed before notAfter plants (no plant
  chain)"); inside that window the keys that could forge from it are still bonded (same file > "b. in the window the
  forging keys are still bonded: ..."), and what it takes reads not final until a confirmation (theseus.confirm.test.ts
  (a) above). The window trusts the device clock (theseus.seed-expiry.test.ts > "the limit (the device clock is trusted): with the device
  clock set back before notAfter, a fresh device plants the stale seed"). A seed naming an id no chain holds leaves it
  never folding. The stage-7 target for closing it is a plant chain taken from the seed's own sources (still to build;
  whether that chain can always reveal a stale seed is part of that work); junk mixed into that chain can block an
  honest plant (a refusal, never a false accept).
- Limit, said plainly (review-stage7-table-r1 F1): a device whose fold is before a hand-over
  (offline through it, or planted from a seed signed before it), inside its seed's window, may take the old set's
  continuation if it arrives first (theseus.test.ts > "the within-window twin: slept less, it follows the fork offered
  first; the double seal is kept as evidence and burns the bond through the slash (F1)"; theseus.nextseq-slept.test.ts
  > "the device follows the fork; the fork's entries and its hand-over at nextSeq are double seals against the honest
  ones"). It reads nothing of that continuation final (theseus.confirm.precommit.test.ts > "(p1) the captured device
  (14', 15' folded, its set the committed one) counts 0 confirmations on each fork entry"), and it returns when it sees
  a confirmation ((b) and (p2) above). Pre-rotation covers one epoch of sleep only
  (theseus.precommit.test.ts > "LIMIT (F1): pre-rotation covers one epoch of sleep; a council that re-seats the same
  members is one old set across two epochs, and a real device asleep two epochs folds what they forge (longer sleeps
  rely on the stale rule, fork/theseus-behind-pin, and seed expiry)").
- Limit, said plainly (the slot leaver, review-stage7-r4 F2): the same pre-hand-over device can be taken by one key of

  the leaving set alone. A veto sits at the hand-over's own slot and is sealed by VETO_QUORUM, one key of a 2-of-3 set;
  on an untimed chain, and on a timed one after D, the quorum's hand-over and a single member's veto are both valid at
  that seq. A device whose fold is before the slot takes whichever arrives first. If the veto comes first it reads it
  not final, and it comes back to the quorum's branch by the fork choice once the new set seals a checkpoint above the
  hand-over (or on an authority checkpoint, on a chain not committed from its genesis). There is no double seal, so
  nothing slashes that member (theseus.veto.slot-leaver.test.ts > "V1 (the limit): a device at 30 offered the lone veto
  first takes it, reads it not final, and given the true 31..33 comes back to the quorum's 33 by the fork choice;
  nothing slashes the vetoer"; "V1-c CONTROL: the same device given the true 31 first ends on 33 and refuses the
  veto"). So the cost the F1 limit names, the bond burned by a double seal, does not apply here. The code fix this row
  named is on dev since network 9852bf9 (review-stage7-r6 F1), with one exception kept on purpose: when the two branches
  part with a veto on one and a full-threshold hand-over on the other at one slot, the hand-over wins, whatever the
  arrival order and whatever authority checkpoints stand above the veto, unless the seed authority endorsed the veto's
  branch (an authority checkpoint above the fork point on it) before the hand-over's own sealed time, its `at`. That
  in-time case depends on the arrival order (review-stage7-r13 F4): `slotRace` returns null and `beats` decides, which
  moves neither way, so a device that already holds the hand-over stays on it (`committed && b.epoch < a.epoch` is
  false) and one that already holds the endorsed veto stays on the veto (the in-time rule), as limit (b) of the
  veto-against-hand-over row below states
  (src/node/confirm.ts `slotRace`, run before `beats`; the signing time is the seed's own signed `signedAt` field,
  src/seed/manifest.ts `SeedManifest.signedAt`, written by `makeManifest` and scripts/seed-sign.ts at the signing
  clock and covered by the signature, kept by src/node/judge.ts `addAuthority`, the earliest seen, and since network
  da74527 (review-stage7-r8 F4) kept per checkpoint in the node database, the `endorsed` row, read at start; a seed without
  `signedAt` still verifies and plants but endorses nothing in time, nor does any endorsement count against an untimed
  hand-over). Before network d8302c8 (review-stage7-r7 F1) the judge derived that time as notAfter less
  SEED_VALIDITY_S, which for every seed seed-sign makes is the checkpoint entry's created_at, not the signing moment:
  a routine seed signed an hour after the hand-over's `at`, on a veto-branch checkpoint created half an hour before
  it, counted as in time, and two devices read two finals at 31. Now that seed endorses nothing in time and both end
  on the hand-over (theseus.veto.signed-at.test.ts > "seed-sign signs signedAt (the signing time) into the manifest,
  covered by the signature; a seed without it still verifies"; "GOAL (the probe): veto branch checkpoint created 30
  min before the hand-over at, the authority signs its routine seed now (after the hand-over at) with the real
  seed-sign: both devices end on the hand-over, no two finals at 31"; "CONTROL: the same, the veto checkpoint created
  now (after the hand-over at): both end on the hand-over"; "a seed without signedAt endorses nothing in time: signed
  (by notAfter) before the hand-over, the veto still does not hold"). Before 9852bf9 the authority's routine seed signed above a lone veto
  that reached its node first kept every device fed the veto first on it, while the majority's hand-over read final on
  the others: two devices read two different entries at 31 final (review-stage7-r6 F1). Now both end on the hand-over
  (theseus.veto.authority-split.test.ts > "GOAL (the probe, untimed chain): the device fed the veto first (with the
  authority checkpoint on that branch) comes back to the majority hand-over; no two devices read conflicting entries at
  31 final"; "GOAL (timed chain, the authority endorsed the veto after the hand-over's sealed time): both devices end on
  the hand-over; only it reads final"; "CONTROL: without the authority checkpoint the device fed the veto first comes
  back to 33"). The exception is the coercion case, where the veto must hold: "KEPT (timed chain, the coercion case:
  the authority endorsed the veto before the hand-over's sealed time): the device that holds the veto stays on it and
  never reads the hand-over final" (same file). Before network da74527 (review-stage7-r8 F4) that held only until the
  device restarted: the judge kept each checkpoint's `signedAt` in memory, so a device restarted on the authority's
  routine re-sign of the same checkpoint held only the later time, the endorsement was no longer in time, and the same
  device read the hand-over at 31 final with no new signature by anyone. Now the earliest `signedAt` per checkpoint is
  written through the judge's one writer to the `endorsed` row and read at start (src/node/judge.ts, src/node/store.ts
  `endorsed`; one of ADVANCE_ROWS, so a node database file never restores it), and the veto holds across that restart
  (r8.kept-restart.probe.test.ts > "GOAL: restarted on the authority's routine re-sign of the SAME checkpoint 32'
  (signedAt now), the device that read the veto final never reads the hand-over at the same seq final"; "CONTROL:
  restarted on the same in-time seed (signedAt before the hand-over at), x stays on the veto and never reads the
  hand-over final"). The kept time adds no checkpoint by itself: it lowers the `signedAt` only of a checkpoint a seed
  verified in that boot names (the in-memory row below). Before network 9cbf53f (review-stage7-r9 F3) the in-time
  endorsement lived only in the first seed that carried it: a device that never verified that seed (offline when it
  was published, or new) held only the authority's later seeds on the same branch, each with a later `signedAt`, so
  for it the endorsement was late and it went to the hand-over, while a device that saw the first seed stayed on the
  veto: two finals at 31 with one honest authority. Now the authority's later seed carries it, in its signed
  `endorsedSince` list (1.5 part 5, written by seed-sign --previous): src/node/judge.ts `addAuthority` takes
  min(signedAt, endorsedSince) for the seed's own checkpoint and keeps the earlier ones as `since`, and
  src/node/confirm.ts `endorsedOn` counts a carried one only where the device's branch holds that id at that seq,
  above the fork point, in slotRace and in beats' in-time rule; a carried one is a time only, never an added
  checkpoint (r9.intime-carry.probe.test.ts > "GOAL: x offered the in-time seed, y (which missed it) offered the
  authority's routine re-sign of the same 32' (signedAt now): no two devices read two different entries at 31 final";
  "CONTROL: two devices on the veto branch, each offered the in-time seed (signedAt before the hand-over at): both stay
  on the veto"; "CONTROL (the fix opens no capture path): a carried endorsement of the entry at the fork point (30,
  below the slot) or of another branch's 31 (the hand-over) endorses nothing in time: the device goes to the
  hand-over"). Limits: the carry holds only for seeds signed with --previous (the weekly re-sign passes it;
  the callers in site/ and native/ pass none), the signer states that the previous seed is on the branch the new
  checkpoint extends (a previous seed of a branch the chain left endorses nothing on a device), at most 16 earlier
  checkpoints are carried, and such a seed fails on an old seed worker (the signedAt-and-old-builds row below). The
  coercion bar and the limits this leaves are in "Coercion, a bare majority, timing and the authority" below. The slot
  race applies to a device that is not stale; a stale device moves only toward an authority checkpoint, and since
  network 9cbf53f (review-stage7-r9 F4) also toward the authority's newer one when its own branch carries one (the T1
  liveness row below).
- Guarantee (the branches part below the slot, review-stage7-r7 F2, network d8302c8): the in-time rule holds below
  the slot too. Before d8302c8, `beats` kept a device on a branch carrying an authority checkpoint above the other
  branch's hand-over with no timing condition, so one member of a 2-of-3 set sealing both branches from seq 17 (a
  slashable double seal), a lone veto at 31 on branch A and the authority's routine seed on A signed after B's
  hand-over left devices fed A first on A and the others on B, each reading its own 17 final. Now, against a higher
  successor-confirmed epoch, the fold's authority checkpoint above that epoch's hand-over keeps the device only when
  its `signedAt` is before the hand-over's sealed `at`; an untimed hand-over, or a seed without `signedAt`, keeps
  nothing (src/node/confirm.ts `beats`, `weight`) (theseus.confirm.early-fork.test.ts > "GOAL (the probe): no two
  devices read two different entries at seq 17 final"; "CONTROL: without the authority seed on A, x comes to B (the
  majority hand-over) and only B's 17 reads final", under "review-stage7-r7 F2: the branches part below the slot (one
  member seals both), a lone veto at 31 on A, the authority signs A after the hand-over").
- Limit, said plainly (signedAt and old builds, review-stage7-r7 F1): a seed worker built before network 186edcf
  (the network's src/seed/worker, compiled into the site's sw.ts) rebuilds the signed bytes without `signedAt`, so it
  refuses a seed that carries it; every seed worker must be rebuilt at 186edcf or later before a seed with
  `signedAt` is published. A seed signed before d8302c8 carries no `signedAt`: it verifies and plants, and endorses
  nothing in time. The same holds for `endorsedSince` (review-stage7-r9 F3): a seed worker built before network
  9cbf53f drops the field when it parses the manifest, so the signed bytes differ and a seed that carries it fails
  signature verification there; every seed worker must be rebuilt at 9cbf53f or later before a seed with
  `endorsedSince` is published. A seed without it verifies as before. Code only: no test runs an old worker on a new
  seed.
- Guarantee (no twin of a sealed entry, review-stage7-r7 F4, network 36bcb24 and 3f5fb6f): the seal covers the
  entry's author and created_at (src/impl/ledger.ts `entryDigest(type, body, prev, seq, epoch, author, created_at)`,
  the one seal digest, read through `digestOfEntry` for a published entry and `draftDigest` for a draft). Before
  36bcb24 any one present member could re-author a sealed entry with another author or time: the same seal, another
  id, one digest, so no double seal, and a device fed that twin first refused every honest successor. Now the twin is
  refused, and a twin that members re-seal over its new author and time is two digests at one (epoch, seq), a
  slashable double seal. An honest sealer refuses a draft whose author is not the asker (`draft-author`) or whose
  created_at is further than CLOCK_SKEW_S from its clock (`created-at-skew`, src/node/reducers/ledger.seal.ts), and
  every draft is dated now (3f5fb6f) (ledger.twin.test.ts > "the twin (another author and created_at, the same seal,
  another id) is refused: seal-threshold"; "a twin re-sealed by members (new shares over its author and time) is a
  double seal: slashable evidence"; "an honest sealer refuses a draft whose created_at is off its clock by more than
  CLOCK_SKEW_S (created-at-skew) or whose author is not the asker (draft-author); on its clock it shares"; "GOAL: a
  device fed the twin first ends with the majority (head = the true 5)"; "CONTROL: without the twin the same device
  ends on the true 5"; "the way back: the authority checkpoint on the true 5, offered"). So one member can no longer
  re-date a sealed checkpoint, the time F1 once read; the F1 fixture now seals its veto-branch checkpoint at its own
  time through the real `buildEntry` (842e322). The bonds keep their bytes: a bond signs the hand-over's place (type,
  body, prev, seq, epoch), as before (ledger.ts `bondDraftDigest`).
- Guarantee (no entry takes a seq on one member's key alone, review-stage7-r8 F1, network ebceee8): `invite` and
  `reserve` are sealed by the epoch set (src/interfaces/ledger.ts `SIGNERS`, seal: true). Before ebceee8 any
  ordinary member, holding no epoch key, signed two different unsealed invites at one (prev, seq): both were valid,
  neither was a double seal, and delivered so that the leader's node took one and the members' nodes the other, no
  round sealed again, for good. The author's signature stays the author (`invite-not-member`, `author-role` for the
  broker); the set's seal decides the one entry at a seq, and two seals at one seq are a slashable double seal
  (r8.invite-split.probe.test.ts > "GOAL: two invites split the council; once each node is handed the other invite,
  the leader's next round still seals": the member's two invites, signed with no epoch key, are each refused
  seal-threshold and the leader's next rounds seal; "GOAL: signed by the broker alone ...": a reserve with no
  epoch key's seal takes no seq; "CONTROL: sealed by the set, a reserve and an invite are valid; two different ones at one seq are a
  double seal of each sealer key"). ebceee8 records that the site makes no 8913 invite or reserve (its invites are kind
  8914 records), so no product flow changed.
- Guarantee and limits (one member's two vetoes at one slot, review-stage7-r9 F1, network d835ae3, landed through the
  merges 4a15668 and abc2fc5; review-stage7-r10 F2 and F3, network 00f2974; review-stage7-r11 F1, network 24ba11d; review-stage7-r13 F2, network c52a7b4 and 5900b9c): a veto is sealed by VETO_QUORUM, one key of a 2-of-3 set, and the seal covers its
  created_at, so one member M can sign two vetoes at the slot (one body, two created_at, two ids), both valid there.
  Before d835ae3 the first a node took moved the slot on, so the second was refused `epoch-seq-out-of-range`; with the
  leader's node on one and another honest member's on the other, every later ask was `bad-prev` on the other's fold,
  M withheld its share, and no round of that epoch sealed again, with no way back for any device, and `witness` kept
  no evidence, since a veto carries fewer shares than the epoch threshold. Now, while the fold's head is a veto
  (nothing stored above the slot, so nothing sealed is reverted), a node stores a competing veto at the same place
  sealed at the veto quorum when its id is lower, and the fold takes the lowest id; each is refused as received
  (`veto-competes`), never attested (src/node/node.ts `slotSibling`); at a veto with competing vetoes the fold
  prefers the lowest veto that carries an entry the rules accept above it, else the lowest id
  (src/impl/ledger.ts `foldChainFrom`), and a round sealed on a competing veto at the slot is stored too, so a
  round sealed above one veto before the other arrived ends every node on that round (in the relay's newest-first
  order too since network c52a7b4, review-stage7-r13 F2, below); the judge does not continue the
  fold from the head when a new entry one above it names another prev (src/node/judge.ts `foldHeld`); and `witness` keeps an
  entry with `sealQuorum(type, k)` shares, so the pair is M's slashable double seal (1.5 part 6)
  (r9.double-veto.probe.test.ts > "GOAL: L takes M's first veto and B its second; once each is handed the other, the
  leader's next round still seals"; "CONTROL: L and B take the same veto: the leader's next round seals"; "the two
  vetoes are each valid at the slot, sealed by M alone, and differ"; veto.competing.test.ts > "the higher veto first,
  then the lower: the node folds to the lowest id, and the pair is M's double seal"; "the lower veto first, then the
  higher: the node stays on the lowest id, and the pair is M's double seal"; "the race: a round sealed above the
  higher veto reaches a node that moved to the lower one: it ends on the sealed round"; "no revert: a lower veto
  arriving once a round stands above the slot is not taken"). Before network
  00f2974 (review-stage7-r10 F2) that round held only for a sibling veto in the store: a higher veto went to `witness`
  and was refused `veto-competes`, neither stored nor kept aside, and the 'round' path looked only in the store, so a
  node that took the lower veto first, then the higher, refused the round sealed above the higher `bad-prev` and stayed
  on the lower veto for good, the authority's checkpoint on the round included. Since 00f2974 the 'round' path takes
  the sibling from the store, the evidence (`witness`) or the entries kept aside, stores it with the round and drops
  it again when the fold takes neither (src/node/node.ts `slotSibling`, src/node/store.ts `delete`), and a veto
  refused `veto-competes` is kept aside (`setAside`, in `consider`), so that node cannot be left off the sealed round
  by its arrival order (r10.veto-lofirst.test.ts > "GOAL: lower first, then the higher, then the round above the
  higher: it ends on the sealed round (the leader's chain)"; "GOAL: lower first, the higher, the round, then the
  authority's checkpoint on the round offered: it ends on the round"; "CONTROL (the r9 race): higher, lower, then the
  round above the higher: it ends on the sealed round"). Before network c52a7b4 (review-stage7-r13 F2) that held only
  in the r10 order (the vetoes before the round), not in the order a relay replays stored entries (ed-relay answers a
  REQ newest first): the round and the rounds above it arrived before either veto, so at the checkpoint they were
  refused `epoch-seq-out-of-range` (the veto that moves the epoch's end not yet folded) and never held, and on the
  lower veto the round at head + 1 was refused `bad-prev` and never held (the hold took only seq > head + 1), and
  nothing judged the round again once the higher veto came; the device ended on the lower veto at 16, not 31. Since
  c52a7b4 (tsc fix 5900b9c) a refused entry `epoch-seq-out-of-range` or `bad-prev` whose prev the store does not hold
  waits in the hold, marked checked when the epoch rule with the epoch's end set aside (`epochWhy` on `seqBounds: {}`)
  passes its author and seal; the hold takes seq > head, the head's next seq included; when a competing veto arrives
  and is refused `veto-competes`, the held entries naming it as prev are taken out of the hold and judged again, and a
  round the 'round' path takes retries the hold, so the rounds above it follow (src/node/node.ts `consider`, `hold`,
  `retryCandidates`) (r13.veto-order.test.ts > "GOAL (relay, newest first): a device at the checkpoint reaches the
  honest head on hi, the round and the 14 above it"; "GOAL (relay, newest first): the device that took M's lone lower
  veto first reaches the honest head on hi"; "CONTROL (no relay, the r10 order by hand): a device at the checkpoint
  reaches the honest head on hi"; "CONTROL (no relay, the r10 order by hand): the device that took the lower veto first
  reaches the honest head on hi", over the real ed-relay seeded with the chain). Limits, said plainly: an entry so held
  takes a place in the hold's bound (CANDIDATE_WINDOW, CANDIDATES_PER_SEQ), and rounds more than CANDIDATE_WINDOW above
  the head go to the catch-up walk (the catch-up row; code only, no test runs that walk with a competing veto); the
  tests run one relay and one lone competing veto. Before
  00f2974 (review-stage7-r10 F3) `slotSibling` stored
  every competing veto lower than the head, with no bound, and each store folded from the genesis (a median 10336 ms
  per veto at 2600 entries in the review, 12 of 12 stored). Since 00f2974 a node cannot hold more than one competing
  veto beside the head: when one stands there, the head veto a lower one replaces is deleted from the store and kept
  as evidence only, bounded by EVIDENCE_MAX (`slotSibling`, its `beside`), and the judge continues the fold from the
  fold of the entry below the slot when the history there is unchanged, else from the genesis (`foldHeld`, its
  `below`) (r10.veto-stream.perf.test.ts > "GOAL: highest id first: at most one of M's vetoes stored beside the head",
  at most 2 of the 12 stored, head included; "GOAL: highest id first: each veto costs about what one lowest id first
  does, no fold from the genesis per veto", within PER_VETO_X = 10 times the control's median plus PER_VETO_SLACK_MS =
  600 ms, N0 2600, V 12; "CONTROL: lowest id first: one veto stored, the rest cost one step each"). Before network
  24ba11d (review-stage7-r11 F1) that bound held at the slot only: the 'round' path took an entry at the head's seq + 1
  on the competing veto's prev once it was sealed at its own type's quorum (`sealQuorum(e.type, ...)`), stored it
  before the fold judged it, and when the fold did not take it deleted only the sibling it brought in, so one member's
  vetoes one seq above the slot, each sealed by VETO_QUORUM alone and refused `epoch-seq-out-of-range`, stayed in the
  store for good and were read at every fold (220 of 220 stored in the red run d25804c, a further one 19 ms against
  7 ms). Since 24ba11d the bound holds one seq above the slot too: the 'round' path takes no veto above the slot
  (`e.type !== 'veto'`, so the quorum checked is the epoch's threshold), and when the fold does not take the candidate
  it deletes the candidate along with the sibling, unless the store held it before, so a node cannot store one
  member's refused entries one seq above the slot (src/node/node.ts `slotSibling`, its 'round' path; src/node/store.ts
  `delete`) (r11.veto-above.test.ts > "CONTROL: the stream on the head veto's own prev: all refused, none stored";
  "GOAL: the stream on the sibling veto's prev: all refused, none stored, a further one costs near the control, and
  the round sealed above the sibling is still taken", K = 200 entries and NEXT = 20 more, the median of a further one
  within 2 times the control's plus 5 ms, and the round sealed at the epoch's threshold above the losing veto still
  taken). Chosen over a veto digest without created_at: the event
  id still hashes created_at, the proof-of-work nonce and the seal's signatures, so two vetoes by M keep two ids, and
  two members who each veto honestly compete too, which only the fold rule settles. Not taken, named: the review's
  part (b), no share above a veto until CLOCK_SKEW_S after it; the race it guards is closed instead by the fold
  preferring the veto a sealed round stands on. Limits, said plainly: two rounds sealed at the next seq on the two
  different vetoes need an honest member on each side to share above a different veto, that is M double-sealing
  again, and that case is not closed (d835ae3 names it open); the nodes come together only once each is handed the
  other veto (the probe hands them; since 00f2974 in either arrival order, r10.veto-lofirst.test.ts); and nothing lands the slash of the double veto in a test (the leader asks the
  slash its evidence proves, the "who may ask the slash" row below). Code only for those: no test seals two rounds on
  two vetoes.
- Guarantee and limits (the bounty, review-stage7-r8 F1, closed at network 73ef484, landed through the merge 1e9c28f;
  its size, review-stage7-r10 F1, closed at network 7382e2d): an issuer's reward takes no seq. Before 73ef484 `bounty` was an unsealed entry (0af99a2): the site's bounty handler
  (site ops/bounty.ts) publishes each reward with the dedicated issuer key alone, which holds no epoch key, so that
  one key could sign two different rewards at one (prev, seq), both valid, and delivered to different nodes they split
  the epoch set for good, as the invites did. Now the issuer's signed kind 8913 reward is carried inside the leader's
  sealed checkpoint (src/interfaces/ledger.ts `CheckpointBody.bounties`, its signature kept inside the body; the path
  handle claims and attest verdicts take): `bountyAskWhy` (src/impl/ledger.ts) is the one judge of a signed reward
  (its signature, version, its size, proof of work, author in the issuer set, its witnesses' attestations, the bounty's caps and
  the supply), `bountiesWhy` judges the 1 to MAX_BOUNTIES = 4 rewards of a checkpoint in order inside the checkpoint
  rule, the leader's node picks them (`pendingBounties`, created_at then id), and the
  fold credits them from the checkpoint (record id = the reward's event id); a bare `bounty` entry is refused
  `bounty-unsealed` (`validateRule`). src/impl/bounty.ts `publishBounty` publishes the signed reward as a request and
  waits until a sealed checkpoint credits it (`BountyNotSealed` past waitMs, 120 s by default)
  (r8.bounty-split.probe.test.ts > "GOAL: two rewards split no council: the leader's rounds still seal, every node
  holds one head, and each reward is credited once"; "CONTROL: one reward: the leader's next round seals and every
  node credits it"). Before 7382e2d (review-stage7-r10 F1) `bountyAskWhy` bounded no size and `propose` put the
  rewards first in a checkpoint of their own, so one valid reward with 60 witness attestations (14881 bytes in the
  review) built a 17290-byte seal-ask that the relay and every node refuse `over-cap` (NODE_CAPS 'seal-ask' = 16384,
  src/node/rules.ts); the request is stored and picked first at every propose, so no checkpoint sealed again: one
  issuer key halted the chain. Since 7382e2d a reward cannot be over BOUNTY_CAP = NODE_CAPS['seal-ask'] / 8 = 2048
  bytes of the compact event (`bountyAskWhy`, `bounty-too-big`; BOUNTY_CAP and `sizeOf` in src/node/rules.ts), and
  the leader cannot build a seal-ask over NODE_CAPS: `propose` (src/node/node.ts) adds the rewards, then the claims,
  then the attest verdicts one by one, each kept only while the ask stays `withinCap` (src/node/rules.ts, the same
  judge as `recordVerdict`'s `over-cap`), so one that does not fit waits for a later checkpoint and blocks none after
  it (r10.fat-bounty.test.ts > "GOAL: a reward with 60 witness attestations is refused by bountyAskWhy"; "GOAL: a
  reward with 60 witness attestations halts no chain: every round of the leader seals, no node credits it"; "GOAL:
  the leader never builds a seal-ask over NODE_CAPS 'seal-ask'; every round seals and all of it is sealed in time",
  MAX_BOUNTIES rewards, MAX_CLAIMS padded sign-ups and MAX_ATTESTS verdicts held together; "CONTROL: a reward of the
  site handler's shape (one witness) is valid; the leader's next round seals and credits it"; "CONTROL: eight valid
  padded sign-up profiles halt no chain: some checkpoint round still seals"). What remains, named: a reward is credited only when the epoch leader carries it (the leader as
  the one asker, the "who may ask the slash" row below: a leader that leaves it out leaves it uncredited, and the
  caller sees `BountyNotSealed`); and a chain that holds a bare `bounty` entry sealed before 73ef484 no longer folds
  past it (`bounty-unsealed`), as the no-regime-gate row below says of the seal digest. Code only for both: no test
  runs a leader that withholds a reward, nor folds an old chain with a bare bounty. The describe title of
  r8.invite-split.probe.test.ts still reads "r8 F1: the reserve by the broker (one privileged author); the bounty by
  an issuer stays open (see SIGNERS)", written before 73ef484.
- Limit, said plainly (a member's own sealed entry, review-stage7-r8 F5 and F1): only the epoch leader asks a seal

  (src/node/seal.ts `leaderOf`), and an honest sealer judges a draft with the asker as its author
  (src/node/reducers/ledger.seal.ts, `draft-author`), so no node path makes an entry authored by a member who is not
  the leader: the `unbond` (the withdrawal of 1.5 part 6, open there), a member's own `transfer` and `bond`, and since
  ebceee8 a member's own ledger `invite`, which now needs the epoch set's seal while no node path asks that seal.
  Code only: no test asks such a seal through a node.
- Limit, said plainly (no regime gate, review-stage7-r7 F4): the seal digest changed format at 36bcb24, and the
  ledger.seal reducer's cid moved to b4f856d8... (src/node/contract.ts). No chain sealed before 36bcb24 verifies on
  842e322 or later: a Build A chain must be wiped aside (plan B1, a new genesis) before 842e322 runs
  there, and every seed must be rebuilt and re-signed on the new chain. Code only: no test folds an old chain.
- Guarantee and limit (a seal round's clock, review-stage7-r7 F4 and review-stage7-r8 F3, network 897226d):
  created_at is under the seal, so every honest sealer, the leader's own judge included, refuses a draft older than
  CLOCK_SKEW_S (600 s, `created-at-skew`). Before 897226d the leader reused, for ever, the draft it asked first at that
  (epoch, seq) and head, its vote bound that digest, and the ask was stored, so a round that missed its threshold for
  ten minutes (the review's probe: the leader of a 2-of-3 set with the two other members offline) halted the chain for good, with no attacker. Now `propose`
  (src/node/node.ts) reuses a stored ask only while its created_at is within CLOCK_SKEW_S of now, and past that asks a
  fresh draft at the same place; the leader's vote (one digest per place) is written only when its own share leaves
  the node, in the entry it builds at the threshold, so a round that missed its threshold binds nothing
  (r8.round-clock.probe.test.ts > "GOAL: retried after CLOCK_SKEW_S + 1 s, and an hour later, the leader can still ask
  a draft at that seq (no permanent halt)"; "CONTROL: retried inside CLOCK_SKEW_S the leader still asks (it misses the
  threshold again, the chain is not halted)"). A member that shared the old digest keeps refusing the new one
  (`voted-other`), and one that never did may share it, so no honest key double seals; the seq then waits until the
  leader and the members that did not share the old digest reach the threshold t. Still only the leader asks, with no leader
  rotation and no timeout (the "who may ask the slash" row below). Code only for that wait: no test loses members'
  shares on their way to the leader.
- Limit, said plainly (F2): node-run requires --seed (`seed-required`; code only, no test runs it without --seed) and
  refuses a seed with no checkpoint (`seed-unpinned`) unless --genesis-only names that risk (network 7628370;
  noderun.pin.test.ts > "on a genesis seed
  (no checkpoint) node-run is refused at start (seed-unpinned): the old set's continuation would capture it";
  "--genesis-only names the risk: on a genesis seed node-run then starts, and says on stderr that it pins nothing"; "on
  a .aseed re-signed after the hand-over (checkpoint honest[4]) the fork offered first does not capture it: it ends on
  the honest chain and keeps no fork entry"). The residual: a node started with --genesis-only, and every device
  booted from a genesis seed, starts with no pin, so whichever entry arrives first at each seq above its last folded
  checkpoint is kept. It does not stay unpinned (review-stage7-r6 F5): while the device is fresh, and a genesis seed is
  fresh for its validity, the judge moves the pin to each checkpoint its fold reaches (src/node/judge.ts, "the fold's
  own last checkpoint moves the pin only while the device is fresh"), so such a device can be captured only above the
  last checkpoint it folded while fresh (theseus.genesis-behind.test.ts > "CONTROL: the same device holding 0..9 (the
  checkpoint 8 held) restarted on that seed starts and pins 8": it is pinned at 8 by its own fold). Every seed
  today is a genesis seed, so every device is in that position until the seeds carry a checkpoint (the seed-sign
  `--checkpoint` path above). The confirmations rule reads such a device's entries as it reads any device's (code:
  src/node/confirm.ts `finalityOf`; no test runs it on a genesis-seed device).
- Limit, said plainly (F9, now with a way back): a captured device has a way back, the fork choice of the
  confirmations rule, and only that: it moves the pin to another branch only on a confirmation the fold's branch lacks
  (theseus.confirm.test.ts > "(b4) the authority's checkpoint offered before the true entries arrive: the device
  switches when they do, in any order (18, 16, 17), and a restart on the same database keeps the true head (the pin
  moved with the fork choice)"). On a chain not committed from its genesis the true entries alone do not move it (same
  file > "(b3) on a chain not committed from its genesis, the true entries alone (no authority checkpoint) do not move
  a captured device: ..."). Since network 6a9bb17 (review-stage7-r5 F1) the way back holds for a true branch of any length
  above the fork point (functionally; its speed on a long chain is the fold-cost row below), not only one under
  ASIDE_MAX: the entries on the path to a verified authority checkpoint are
  kept outside that cap (the in-memory limit below) and replayed top-down under the new pin
  (theseus.confirm.wayback.test.ts > "P2 (goal): a true branch of 301 entries above the fork point (more than
  ASIDE_MAX = 256): it switches to the true top"; "P2-c CONTROL: a true branch of 201 entries above the fork point: it
  switches to the true top").
- Limit, said plainly (the eclipse): a device that sees only the old set's branch is stuck, never fooled: it reads none
  of it final, however long the branch grows, and runs no fork choice (theseus.confirm.test.ts > "(d) a device fed only
  the fork reads no fork entry final, however long the fork grows (40 sealed checkpoints above seq 16)"; "(d2) an
  eclipsed device fed the fork and every seed the old keys can sign naming the fork's checkpoints counts 0
  confirmations on every fork entry, and the honest-looking history above its seed checkpoint never reads final: it
  waits"; theseus.confirm.sim.test.ts > "eclipsed (the fork grown to 65 entries, built in ..."; D1, D2 and
  D3 reach every X up to 64, D4 and D5 stay at 0, the device reads every fork entry not final and runs no fork choice:
  it waits).
- Limit, said plainly (T1 and confirmations): a stolen seed authority key confirms a fork and, on a chain not committed
  from its genesis, moves captured devices onto it. On a committed chain a branch with a later sealing epoch is not
  left for an authority checkpoint (src/node/confirm.ts `beats`). Code only: no test steals the authority key.
- Limit, said plainly (a captured successor quorum): the successor confirms only while a quorum of the committed set's
  own nodes, at that set's full threshold, is not itself captured on the fork; a captured threshold of members would
  seal the fork under the next epoch, a double seal that is slashable. Fewer members confirm nothing: a successor seal
  counts only an entry sealed at the successor key's full threshold (src/impl/ledger.ts `sealQuorum`, the one rule
  `sealed()` uses; src/node/confirm.ts; review-stage7-r3 F1, network 91420f5), so a veto, sealed by VETO_QUORUM (one
  key of a 2-of-3 set), confirms nothing (theseus.confirm.veto.test.ts > "GOAL: with ONE epoch-1 member's veto on the
  fork, the old council's 14' and 15' still read not final"; "GOAL: with that veto, the captured device still comes
  back on the true 14, 15, 16 (p2's successor path)"; "GOAL: an eclipsed device planted at 13, fed only the fork and
  the veto, reads no fork entry final"). Members' nodes booted on the seed re-signed after the hand-over avoid the
  captured-threshold case; the code does not force it. One test holds that case: the captured quorum's seal makes fork
  entries read final, until an authority checkpoint on the true branch moves the device off them
  (theseus.confirm.precommit.test.ts (p5) above; confirmations.md section 6 names the case).
- Limit, said plainly (in memory only): the entries set aside for the fork choice (with proof of work: at a seq at or
  below a verified authority checkpoint the fold does not hold, one entry per seq outside the cap, the one on that
  checkpoint's walk-down path first; every other one in ASIDE_MAX = 256, src/constants/confirm.ts, the oldest dropped;
  src/node/judge.ts `aside`, since network 6a9bb17) and the authority checkpoints offered while running are kept in
  memory: at most ASIDE_MAX + (that checkpoint's seq + 1) entries, the second term bounded by the authority's
  signature, so an unverified flood grows neither; after a
  restart only the booted seed's checkpoint can count, so an entry final on a checkpoint offered while running may
  read not final again. What a restart no longer loses (review-stage7-r8 F4, network da74527) is the time the
  authority first signed a checkpoint: the earliest `signedAt` per checkpoint is in the node database (the `endorsed`
  row) and lowers the time of that checkpoint when a seed verified in the new boot names it, so a restart on the
  authority's re-sign of the same checkpoint keeps an in-time endorsement in time (the KEPT row above). The kept time
  adds no checkpoint by itself, so a restart on a seed that names no checkpoint on a branch counts no endorsement of
  that branch in that boot. So a restart is not shown to move finality only toward not final: before da74527 a
  restart on a re-sign moved a device from the veto final to the hand-over final, and what a device restarted on a
  seed naming no checkpoint on the veto's branch reads at the slot is not tested. The `endorsed` row is written only
  through the judge's writer in code (src/node/judge.ts `writeRows`, src/node/store.ts), but the runtime pin-rows guard
  (test/setup/pin-rows.guard.ts, ROWS: pin, candidate, planted) does not police it: a second writer of `endorsed`
  would not turn a test red (open). A
  booted seed whose checkpoint predates a hand-over the device folded is refused `seed-before-handover`, and the device
  is then stale: nothing reads final, not even the history under that seed, and it takes nothing above its head until
  a newer authority checkpoint is offered (src/node/judge.ts, `plantWhy`; probed, no test asserts it). And a
  flood of proof-of-work entries sent before the true entries can take their seqs first and push the true ones out of
  ASIDE_MAX, and entries that arrive before the authority checkpoint is offered wait in ASIDE_MAX alone; the walk down
  from that checkpoint then takes back every seq it reaches, and the device waits for the relay to send the rest again.
  Code only (no test floods it), named in network docs/plan/confirmations.md section 6.
- Limit, said plainly (fold cost): each fork-choice candidate whose path is whole is folded from the genesis
  (src/node/confirm.ts `forkChoice`; on a stale device, or a chain not committed from its genesis, a candidate below
  every authority checkpoint the fold lacks is skipped, since it cannot win). Measured, printed, not asserted
  (theseus.confirm.wayback.test.ts P2-c and P2, from the offer to the end of a delivery in order): 3.3 s (6.5 s inside the full landing run) for 201 true
  entries and 5.0 s (6.2 s there) for 301 since network 6a9bb17, where `verifyHash` keeps the signatures it found valid (src/nostr.ts,
  VERIFIED_MAX 8192); 45 s for 201 at network 56cb21b, nearly all of it re-verifying the same seals at every fold.
  Past that cache (about four signatures per sealed entry, so past about 2000 entries) every fold from the genesis
  re-verified every signature: at network 6a9bb17 a node holding 2600 sealed checkpoints took 18 s per honest entry
  (review-stage7-r6 F2). Since network d831d31 the judge holds its one fold with the ids it was folded from and
  continues it from the head while nothing changed at or below that head (src/node/judge.ts; src/impl/ledger.ts
  `foldChainFrom`, the checkpoint's conservation check a running recount, `recountStep`, not a recount of the whole
  prefix), so an entry extending the head costs one step: about 100 ms per entry at 2600 entries (node.foldcost.perf.test.ts
  > "a node holding ${N} sealed checkpoints takes each of the next ${MORE} within a median of ${BOUND_MS} ms", N =
  2600, MORE = 3, BOUND_MS = 500; it printed [103, 94, 93], [104, 98, 97] and [104, 103, 98] ms in three runs for
  d831d31, against [15539, 18444, 16432] before; ledger.fold-from.test.ts > "continued from the fold of 0..k, the fold
  of 0..11 (and the other at 9) equals foldChain from the genesis, for every k"; "does not change the fold it
  continues"). Still from the genesis, named: start-up (about 30 s for that node at 2600 entries: startMs 30307, 31769
  and 28473 in those runs, printed, not asserted), any fold after an entry changed at or below the head (save a competing veto at the head's
  seq, or a round on one, which since network 00f2974 continues from the fold of the entry below the slot, src/node/judge.ts
  `foldHeld`, review-stage7-r10 F3, the competing-vetoes row), and the fork
  choice, which folds each winning candidate's path from the genesis (src/node/confirm.ts `forkChoice`) and after
  which the judge folds from the genesis again. So the way back over a long true branch still pays whole folds, still so at network 71363a2.
- Guarantee (unsealed junk weighs nothing, review-stage7-r8 F2, network edc389b, landed in d27ec77; at the slot,
  review-stage7-r10 F4, network f1d581e): before
  edc389b the fork choice weighed a branch by the TYPE of its entries, so a stranger's unsealed `epoch` entry naming a
  key of its own, and up to ASIDE_MAX unsealed checkpoints on it (8 bits of proof of work each, kept aside), claimed a
  higher successor-confirmed epoch and won `beats` until the fold from the genesis threw the branch out, at every fold:
  each honest entry cost about one fold from the genesis per junk checkpoint (the review's [3343, 3309, 3529] ms per
  entry at 1200 entries and 40 junk checkpoints). Now `confirmations` and `weight` count an entry above the fork point
  as sealed only when its seal verifies at sealQuorum under the key that branch seats for its epoch, and a hand-over
  seats its `next` only when it is itself so sealed (src/node/confirm.ts `sealVerifies`); the fold's own entries keep
  their type's seal. Junk then weighs epoch -1 and `beats` refuses it before any fold. `forkChoice` walks a candidate
  down by prev only to the fold, and the whole path only for a branch that beats the fold's; and the judge keeps the
  ids of candidates whose fold from the genesis failed, never folded again (src/node/judge.ts, UNFOLDABLE_MAX = 2 *
  ASIDE_MAX = 512 ids, the oldest dropped first) (r8.junkfold.probe.test.ts > "GOAL: K unsealed junk checkpoints from a
  stranger kept aside on a committed chain: the next honest entry still costs about one fold step", the median under
  500 ms; "CONTROL: no junk, committed chain: the next honest entry costs one fold step"; "CONTROL: the same junk on a
  chain NOT committed from its genesis (authOnly skips it): one fold step"). Printed, not asserted beyond that median,
  as reported for edc389b: at 600 entries and 120 junk checkpoints (the defaults) [5324, 5000, 4873] ms per entry
  before, [30, 29, 31] after, the flood itself 360317 ms before and 3446 ms after; at 1200 and 40, [47, 49, 46]; in
  a later run at 71363a2 (defaults) [24, 25, 24], flood 2660 ms. That held for junk forking near the head, as
  the r8 probe's does; it did not hold for junk forking low on a chain with a past epoch (review-stage7-r9 F2): such a
  candidate lost `beats` without being folded, so it never entered the memo, and was weighed again at every fold
  against `weight` of the fold's own branch, where `successor(seq)` filtered the whole chain for every seq above the
  fork point, O((L - f) x L) per candidate: at 2000 entries of a past epoch and 256 junk checkpoints at seq 1, 2.95 s
  per honest entry. Since network 8d648af `forkChoice` (src/node/confirm.ts) weighs the candidate's own branch first and
  skips it, without weighing the fold's, when it carries neither a successor-confirmed epoch nor an authority
  checkpoint above the fork point and slotRace did not give it the slot (`beats` cannot then be true); when slotRace
  cannot apply at all (the entry above the fork point neither a hand-over nor a veto) that verdict goes to the judge's
  memo under a key of the candidate's id, the fork point and the authority's checkpoints, so it is not weighed again
  while they hold; the fold's own weight is computed once per call per fork point; and `successor` reads a suffix tally
  per successor epoch (r9.lowjunk.perf.test.ts > "GOAL: K unsealed junk checkpoints at seq 1 from a stranger: the next
  honest entry still costs about one fold step", N0 2000, K 256, the median under 500 ms; "CONTROL: no junk: the next
  honest entry costs one fold step"). Printed, not asserted beyond that median, as reported for 8d648af: [2950, 2974,
  2954] ms per honest entry in the review, [79, 73, 74] ms after; the flood itself 442985 ms then, 22653 ms after; in
  a later run at abc2fc5, control [81, 76, 80] ms, junk [91, 83, 93] ms, flood 20494 ms. A
  junk candidate whose entry above the fork point is a hand-over or a veto is not memoised: its own branch is weighed
  at each fold (the fold's is not). Before network f1d581e (review-stage7-r10 F4) that did not hold for an unsealed `epoch`
  entry at the slot of a fold whose head is a veto: `slotRace` read the types at f + 1 alone and gave that branch the
  slot, so `forkChoice` skipped `weight` and `beats` and folded each junk checkpoint on it from the genesis (a median
  9499 ms per junk entry at 2600 entries in the review). Since f1d581e such junk cannot take the slot: `slotRace`
  (src/node/confirm.ts) races a hand-over only when its seal verifies under the key its branch seats for its epoch
  (`confirmations`, its `sealed`), else returns null, so the junk is weighed as above, epoch -1, and skipped before any
  fold (r10.slotjunk.perf.test.ts > "GOAL: junk checkpoints on an unsealed hand-over at the slot cost about one step
  each (no fold from the genesis per junk)", the median under BOUND_MS = 2500 ms; "CONTROL: junk checkpoints on an
  unsealed grant at the slot cost about one step each"; "a SEALED hand-over at the slot (the committed set, sealed by
  the epoch's set) still wins the slot race against the lone veto"). Limits: the memo is in memory, per judge, so after a restart each such candidate
  is weighed or folded once again; and the weighed-junk keys and the failed-candidate ids share one memo and one cap
  (UNFOLDABLE_MAX = 512, the oldest dropped first), so a flood of junk can push a real failed candidate out and it is
  folded from the genesis again: time only, never a wrong verdict (code only).
- Limit, said plainly (who hands a running node a newer checkpoint): the authority's later checkpoint moves a captured
  device only through `node.offerCheckpoint` on the running node; startNode alone still drops a booted seed whose
  checkpoint contradicts the pin, and bootNode is what hands that seed to `offerCheckpoint` (the restart row below)
  (theseus.eclipse.test.ts > "pinned at honest 3, booted on a seed at alt 5 (contradicting honest at 2
  and 3): after a restart it is still the candidate, and the contradicting path drops it"). node-run has that caller
  since network f757fde (on dev 4d61af0): it follows the seed broadcast (8915/8916) on its relays with the app's one
  upgrader over the node's own relay connection (scripts/follow-seeds.ts) and offers each newer seed it holds to the
  running node (src/node/offer.ts), and a captured node-run takes the true chain within the bound the test asserts, 15
  s from the seed's publish (noderun.offer.test.ts > "captured by the old set's continuation, node-run takes the true
  chain after the authority's newer seed (v3) at the true head is announced; a stranger's seed moves nothing"; it
  printed 737 and 735 ms in two landing runs, printed, not asserted). The site half is on site dev
  since e635bb2 (red 3899bcf, green 60ba5ac, from site fork/offer-checkpoint-wire): the page's node takes each newer
  seed the upgrader applies, through `offerHeldSeeds` (site/src/node/engine.ts; site/src/node/offer-seed.browser.test.ts,
  read at site dev 8a70133). So the production callers today are node-run and the page's node engine.
- Guarantee (the page boots through bootNode, review-final-architecture-r6 N5, review-stage7-r6 F4): the page's node
  engine boots through the network's bootNode on its one plain boot path, held pin or not (site/src/node/engine.ts
  `bootNode`, site 2bcc29e, red dcd7704, then 8726b24, on site dev 023567a), so a captured page device reloaded on the
  authority's newer seed takes the same fallback as node-run: at or below its fork pin, or ahead of it with the fork
  holding an entry at that seq, it boots on the held seed and is handed the newer one through `offerCheckpoint`
  (site/src/node/boot-restart.browser.test.ts > "captured by the old set's continuation at seq 5, reloaded on v3 at the
  true head (seq 7), the page's node ends on the true chain", under "a captured device reloaded on the authority's
  newer seed ahead of its pin returns to the honest chain"; real Chromium, the real relay, bound 15 s). Before
  2bcc29e the engine booted through startNode and such a page ran no node, or dropped the newer seed.
- Limit, said plainly: a device planted from a seed that is itself a forgery is protected only by the seed pins (stage
  2), which are the network's trust root: the one key of the network's authority until the council takes it (1.7, stage 8). That is the root every
  network has, not a hole in the theorem.

Coercion, a bare majority, timing and the authority, as of network d741a79 (the veto against a hand-over at its slot
as of network c7eaaac, review-stage7-r6 F1):
- Guarantee (coercion of named members, time lock with veto, network 4869da2): a quorum of epoch e forced to sign
  cannot seat attacker keys at e+1 (coercion.sim.test.ts > "at nextSeq a hand-over to the attacker's keys is refused
  epoch-next-not-precommitted; before nextSeq epoch-seq-out-of-range; the committed one is taken"). What it can do is
  commit e+2 (same file > "the coerced hand-over (at back-dated to its floor, 16 days before the coercion; e+2
  committed to the attacker; bonds out of ANG it granted) and an honest one are both taken"). That commitment takes
  effect only at the next hand-over, which is refused `epoch-too-soon` before its maker's at + D (D = EPOCH_MIN_S).
  Until then max(1, n - t) of the present set cancel it with a veto, which re-seats the present set. The veto sits
  only at its epoch's hand-over slot (src/impl/ledger.ts `seqWhy`; review-stage7-r3 F3, network cdf7690), so
  squatting the earlier seqs cannot block it (coercion.veto.test.ts > "squatted to nextSeq - 1, one member of K2
  (2-of-3: n - t = 1) vetoes at nextSeq itself: taken; the slot moves on MIN_EPOCH_SPAN; the hand-over to the attacker
  is refused there and ever after; K2 re-seats as epoch 3" (MIN_EPOCH_SPAN is a seq count, not the `MAX_EPOCH_SPAN` of R3.10, which is in days; no default is set); "a veto before nextSeq (the epoch not squatted) is
  refused, epoch-seq-out-of-range; at nextSeq, after the squat, it is taken (review-stage7-r3 F3)"), and one member's
  veto cannot race the quorum's entry at a seq before that slot (theseus.veto.slot.test.ts > "a lone veto at a mid seq
  (16, the slot is 31) is refused: epoch-seq-out-of-range"; "GOAL: a device that is offered the lone veto first, then
  the honest 16, ends on the quorum's 16"; "CONTROL: the lone veto at the hand-over's own slot (31) is taken, and moves
  the slot on"). Nothing of
  the attacker's epoch is on any fold, so none of it reads final, before D, and never once vetoed (coercion.veto.test.ts >
  "nothing of the attacker's epoch reads final before D: with an honest at on the coerced hand-over, its seating is
  refused before at + EPOCH_MIN_S, so no entry of epoch 3 is on any fold; once vetoed, never"). VETO_QUORUM = max(1,
  n - t) (src/constants/stake.ts) is the approved formula, fixed by code (an approved ruling; not an open value). Its stated limit: one member can stop
  rotation, never safety (the liveness limit below). Review-stage7-r6 F1 showed that one member's lone veto at the slot,
  with the honest authority's routine checkpoint above it, split finality across devices (no double seal, so nothing
  slashed); since network 9852bf9 that veto loses at the slot (the slot-leaver row above), and the coercion bar and the
  limits that remain are the next row.
- Guarantee and limits (the veto against a hand-over at its slot, review-stage7-r6 F1, network 9852bf9 and 6579148;
  network docs/plan/coercion.md, section "veto vs hand-over, 2026-11-12 r6 F1"): a veto beats a full-threshold
  hand-over at its slot only when the seed authority endorsed the veto's branch before the hand-over's sealed time;
  otherwise the hand-over wins on every device that is not stale, whatever authority checkpoints stand above the veto
  (src/node/confirm.ts `slotRace`; theseus.veto.authority-split.test.ts, the rows above). The "unless" of the
  authority-versus-hand-over guarantee is that timed case: its fixture signs the authority's seed half an hour
  before B2's hand-over `at`, no assertion changed (network 6579148; theseus.confirm.authority-vs-handover.test.ts >
  "the authority's checkpoint at 32 on A2, above B2's hand-over at 31: the device stays on A2"). The coercion bar, in
  keys an attacker needs for an entry of its epoch to read final (2-of-3 sets, VETO_QUORUM 1): with no veto placed, t
  of K_e and all n of K_(e+1) silent, 2 + 3 = 5 keys; against a veto placed within D, t of K_e and t of K_(e+1)
  sealing the seating over the veto, 2 + 2 = 4 keys, the same before and after 9852bf9. The figure 5 holds only with
  no veto placed, and 4 is the bar once a veto is placed. Limits, said plainly: (a) the side effect with a back-dated
  `at`: a coerced set that back-dates its
  hand-over to its floor shrinks D (the back-dating row below), and a seating sealed by t of K_(e+1) with a back-dated
  `at` (honest sealers refuse an `at` off their clock, and since network 36bcb24 a draft created_at off it,
  `created-at-skew`) can carry a time before the authority's endorsement, so with 4
  keys that seating now also wins on the vetoed devices; (b) open: in the kept, in-time case, t of the next set sealing
  a hand-over over a veto the authority endorsed before it keeps a split (devices that hold the endorsed veto stay on
  it, the others read the hand-over final), and since 2t > n at least one of them also sealed the checkpoint above the
  veto on the other branch: that double sealer across the two branches (a seal at s on one branch, one at s' > s on a
  branch with another entry at s) is not slashed today; slashing it is the open item. Code only for (a) and for the
  slash gap: no test runs a back-dated seating against an endorsed veto, nor that pair of seals. EPOCH_MIN_S stays a
  default until the number is set (OI-3, OI-31).
- Limit, said plainly (back-dating): D is counted from the coerced hand-over's own at, which the coerced set seals; the
  real window shrinks by however long the coerced epoch ran past its floor (coercion.sim.test.ts > "the time: with
  the coerced at back-dated to its floor, the honest hand-over to the attacker is due at once (8 days before the
  coercion); with an honest at it is due EPOCH_MIN_S later").
- Limit, said plainly (judgement and liveness): a coerced commitment looks honest, so a person or a signal from outside
  must tell the vetoer. One member of a 2-of-3 present set can veto every commitment and keep its set seated; that
  stops rotation. Its veto at the slot splits no finality unless the seed authority endorsed it before the
  hand-over's sealed time (the row above, and its limits (a) and (b)). Its two vetoes at one slot no longer halt the
  epoch: they fold to one and are its double seal (review-stage7-r9 F1, the competing-vetoes row above, with its
  limits). The fold holds no authority key, so the authority's checkpoint is not a vetoer (code:
  src/impl/ledger.ts `sealed()`, the veto counted by VETO_QUORUM of the present set; network docs/plan/coercion.md; no
  test runs a veto in every epoch).
- Guarantee (a bare majority at one seq, network c1e93c5): two quorums of a key with 2t > n at one (epoch, seq) share at least
  one member (2t - n members); no device reads both final, and the pair is the shared members' slashable double seal; the finer split by byzantine count f is R4.4's, an addition and not a replacement. The tested case, one shared member
  (theseus.majority.test.ts > "(m1) A asks a checkpoint on relay 1 and a grant on relay 2 at one seq; B's and C's
  nodes each share the one they saw; on every device at most one of the two reads final, and both devices hold A's
  double seal, slashable on their fold"). It holds without a bound on message delay: finality is an authority
  checkpoint or a committed successor's seal, never a count of votes (src/node/confirm.ts `finalityOf`). Across
  devices, the one split left at a slot is the in-time veto of the r6 F1 row above (its limit (b)); below the slot an
  authority checkpoint keeps a device off a higher successor-confirmed epoch only under the same in-time rule
  (review-stage7-r7 F2, the row above). A timed
  hand-over to a key that breaks 2t > n is refused (ledger.quorum-bond.test.ts > "two disjoint halves of a 2-of-4 key
  seal two branches at one seq (shown on an untimed legacy chain); the timed hand-over that would create that key is
  refused: epoch-quorum-invalid"). Scope: the test runs the authority path; the committed-successor path is untested.
- Guarantee (the slash lands, network c1e93c5): a double seal is slashed in code. The leader's `propose` asks first
  for the slash its evidence proves (src/node/node.ts), the seal reducer seals it, and the ledger's `slash` case with
  `stakeReducer` applies it (src/impl/ledger.ts, src/node/stake.ts): the bond reads 0, closed 'slashed', on every fold
  (theseus.majority.test.ts > "(m2) after the hand-over to D, E, F (sealed through B's node), D's node, holding the
  evidence, proposes the slash of A; E and F share it; it takes its place and burns A's bond on every device's fold,
  B's and C's bonds held").
- Limit, said plainly (who may ask the slash): only the leader (src/node/seal.ts `leaderOf`, members[0] for the whole
  epoch) may ask, so a double-sealing leader is slashed only after a hand-over (theseus.majority.test.ts > "(m3) B's
  node holds the slashable proof against A, and its propose is refused not-leader (seal.ts leaderOf: members[0] for
  the whole epoch); B and C, an honest quorum, have no ask to share"). A leader that never hands over halts the epoch:
  there is no leader rotation and no timeout. Open item OI-39: leader rotation, or a slash ask from a member who is
  not the leader; no default is set; today there is no leader rotation.
- Timing (Delta): src names no bound on message delay, and safety depends on none (the two rows above). Liveness has
  these clocks: a seal round gathers shares for 30 s (src/node/node.ts `gather`; node-run gives max(5 s, half of
  --propose-every)); a hand-over ask must be timed within CLOCK_SKEW_S, 600 s, of the sealer's clock
  (ledger.quorum-bond.test.ts > "a bonded quorum hand-over draft on time is shared; one without at is still
  epoch-at-missing, one off the clock still epoch-at-skew"); a seed must be re-signed within SEED_VALIDITY_S, 7 days,
  or the device is stale (theseus.authority.test.ts > "the price, named: a seed-booted device online through a quiet
  week is stale once its seed expires, even online; the weekly re-sign and the stage-2 broadcast keep it current"),
  and a running node that is offered the re-signed seed (node-run through `offerHeldSeeds`) is current on it with no
  restart (network a436b32; theseus.offer-current.test.ts > "GOAL: offered the authority's newer, valid seed while
  running, it is current again and takes the next honest entry"); a
  slash must land before the leaver may withdraw, which with a back-dated exit is (BOND_WINDOW - 1) * EPOCH_MIN_S
  after its real exit, held above the stale seed's window plus 2 * CLOCK_SKEW_S (theseus.fable-g.test.ts > "(BOND_WINDOW - 1) * EPOCH_MIN_S > SEED_VALIDITY_S + 2 * CLOCK_SKEW_S
  (defaults awaiting the owner, question 3)"). Proposed bound: Delta <= 30 s, one seal round. No test measures
  Delta itself.
- The authority's checkpoint is bootstrap power, with a sunset at Stage 8, when the council
  takes the seed pins: it may refuse only entries that break a rule (retired or forged keys, a missing quorum, a broken
  precommit), never a valid majority, with one exception named in the r6 F1 row above: at a hand-over's slot, the
  authority's endorsement of a veto's branch before the hand-over's sealed time keeps a device on the veto against a
  full-threshold hand-over (the coercion case), and an endorsement after that time does not; since network d8302c8
  (review-stage7-r7 F2) the same in-time rule, by the seed's signed `signedAt`, governs an authority checkpoint above
  a higher epoch's hand-over when the branches part below the slot. Guarantee (network be791fe): on a chain committed from its genesis, a branch
  that carries a validly sealed committed hand-over E to E+1 above the fork point beats the device's branch that
  carries only the authority's checkpoint, unless that checkpoint stands above the hand-over that seated the new set
  (src/node/confirm.ts `beats`; where the branches part at the hand-over's slot with a veto on the device's branch,
  `slotRace` decides first, and that checkpoint keeps the device only if it was signed before the hand-over's `at`,
  and below the slot `beats` applies that rule itself (review-stage7-r7 F2); theseus.confirm.authority-vs-handover.test.ts > "the device on A (pinned at 14a, the
  authority's checkpoint offered) takes B on its arrival"). The "unless" is tested too (review-stage7-r3 F4, network
  ee2ba17): with the authority's checkpoint above the hand-over the device stays on its branch, and without it the
  same device takes the higher epoch (same file > "the authority's checkpoint at 32 on A2, above B2's hand-over at 31:
  the device stays on A2"; "CONTROL: without the authority's checkpoint, the device on A2 takes B2 (the higher
  successor-confirmed epoch)", under "unless: the authority's checkpoint above the hand-over keeps the device off the
  higher epoch"). At equal epoch the authority's checkpoint still outweighs
  a branch the committed set sealed: a captured device whose fork carries the committed set's own seal is moved off it
  by the authority's later checkpoint on the true branch (theseus.confirm.precommit.test.ts > "(p5) the committed
  set's quorum, captured on the fork, seals 16' there: 14' and 15' read final by that successor seal; the true 14, 15
  and 16 tie it (one epoch each) and move nothing; the authority's later checkpoint on the true 16 moves the device
  off the fork, and the same 14' and 15' then read not final in the same boot"). The authority is not a vetoer: the
  coercion veto is the present set's alone (the coercion rows above).
- Guarantee (H1, review-stage7-r2 F1, network e3c143a): a successor seal confirms only when it is sealed by epoch e+1,
  that epoch is not a re-seat, and its key is traced to the genesis through final hand-overs; so a re-seated set, old
  on the true chain, forges no successor confirmation (theseus.confirm.reseat.test.ts > "PROBE D: a re-seated council,
  now old on the true chain, forges the successor confirmation below a device's head"; "D4 (goal): an eclipsed device
  that folds the chained forgery itself (it never saw the true 14) reads none of the old members' entries final";
  "D5a (goal): an eclipsed device that folds the fork reads none of the old set's entries final"; "D5b (goal): a
  device holding the true 14, offered the fork, keeps its head and pin").
- Guarantee (restart on the newer seed, review-stage7-r2 F2, network 0376068): a captured device restarted on the
  authority's newer seed boots (src/node/boot.ts `bootNode`: when startNode refuses that seed against the held pin, the
  node boots on the held seed and is handed the newer one through `offerCheckpoint`) and ends on the true chain
  (theseus.confirm.restart.test.ts > "A1 (goal): restarted on the newer seed at the true head (18), it starts and ends
  on the true chain"; "C1 (goal): a device on the true chain (16..18), offered the authority's own old seed
  (checkpoint 15, before the hand-over) and the old council's fork of 40 checkpoints above 15, does not move and
  reads no fork entry final"); node-run does the same on a new --seed (noderun.restart.test.ts > "PROBE B (goal): a
  captured node-run restarted with the authority's newer seed as --seed (the operator's step its header names) starts
  and takes the true chain"). Those cases boot on a seed at the fork pin's own seq. The usual case is a seed ahead of
  the pin, since the true chain usually runs longer than the old set's fork: startNode takes it as a pending
  candidate and the judge drops that candidate once its path contradicts the pin. Since network b4e4143
  (review-stage7-r4 F1, landed at bb54e32) bootNode also hands the booted seed to `offerCheckpoint` when the started
  node's candidate is that seed's checkpoint, still pending. The device then ends on the true chain with no relay
  announcing the seed, so a seed carried out of band works too (theseus.confirm.restart.test.ts > "R1 (goal): captured
  at 17', restarted through bootNode on the newer seed at the true 18, fed the true chain (no hand offer): ends on the
  true 18"; "R2 (goal): captured at 18', restarted through bootNode on the newer seed at the true 19 (ahead by one):
  ends on the true 19"; noderun.restart.test.ts > "R3 (goal): a captured node-run (fork pin 5') restarted with the
  authority's newer seed at the true 6 (ahead of its pin, carried out of band, not announced) as --seed takes the true
  chain"). Those keep the fork's head below the seed's seq. When the fork holds an entry at that seq (the usual shape:
  a pin is the fork's last checkpoint and the head runs on above it), startNode refuses the seed
  `checkpoint-not-sealed`; since network 6a9bb17 (review-stage7-r5 F2) bootNode takes the same fallback as at the pin when
  the seed's path does not contradict the pin (src/node/pin.ts `pinContradicted`): it boots on the held seed, or none,
  and offers the seed (theseus.confirm.wayback.test.ts > "P1 (goal): captured (pin 17', head 18'), restarted through
  bootNode on the newer seed at the true 18: starts and ends on the true 18"; noderun.restart-ahead.test.ts > "P3
  (goal): node-run restarted with --seed at the true 6 (out of band, not announced) starts and takes the true chain").
  A seed ahead whose path contradicts the pin is still refused at start; one with nothing held at its seq starts
  pending and the fold drops it once its path contradicts the pin. The judge is unchanged: a booted seed by itself
  still moves no pin onto another branch (theseus.eclipse.test.ts E3, above). It is current there, in that same boot: since network a436b32 (review-stage7-r3 F2) the
  offered seed becomes the judge's current seed, so the node takes the next honest entry above the authority's
  checkpoint with no second restart (theseus.offer-current.test.ts > "GOAL: restarted on the newer seed (18) through
  bootNode, it takes the true chain and then the next honest entry (19)", under "R4-P3: the bootNode recovery path
  (node-run restarted on the newer --seed) after the switch"; it printed 1228 ms from the boot to 19 as reported for
  a436b32, 1605 ms in the rerun at d741a79, printed, not asserted). Before a436b32 it stayed stale at the
  authority's checkpoint for the rest of that boot.
- Limit, said plainly (T1 liveness, a stale device): a stale device (no verdict, or its seed expired) moves only toward
  an authority checkpoint (src/node/confirm.ts `beats`; theseus.confirm.reseat.test.ts > "PROBE D control: the same
  stale device offered the forgery without the re-seated epoch-1 seal stays on its fold"), so it waits on the
  authority however valid the majority's hand-over. Before network 9cbf53f (review-stage7-r9 F4) a stale device whose
  own branch carried any authority checkpoint above the fork point never moved while running (`b.authority > 0 &&
  a.authority === 0`): the authority's newer seed on another branch became current only once the fold held its
  checkpoint, which only that refused fork choice could give, so it stayed until a restart (the r6 F1 "late" case: the
  authority's routine seed at 32' on the lone veto's branch, signed after the hand-over's `at`). Now the stale rule is
  `b.authority > 0 && (a.authority === 0 || newer(b, a)) && !(committed && b.epoch < a.epoch)`, newer meaning the
  newest `signedAt` of b's authority checkpoints above the fork point is later than the newest on a, both sides' seeds
  carrying `signedAt` (else the rule before); a higher successor-confirmed epoch still holds (src/node/confirm.ts
  `beats`, `newer`). It opens no capture path while the authority is honest (T1): only the authority signs these, and
  it signs a newer checkpoint only on the branch it now follows (r9.stale-stuck.probe.test.ts > "GOAL: stale, the
  authority's late routine seed at 32' on the veto branch: offered the authority's newer seed at 33 and the
  majority's 31..33, it ends on 33"; "CONTROL: the same device, its seed not expired: it ends on the quorum's 33";
  "CONTROL: stale, but no authority checkpoint on the veto branch: offered the newer seed at 33 it ends on 33";
  "CONTROL (the fix opens no capture path): stale, the authority's seed at 33 signed BEFORE its seed at 32' on the
  device's branch: not newer, the device stays"). Limit, said plainly: the not-committed tail of `beats` is unchanged,
  `return b.authority > 0 && a.authority === 0`, so a device that is not stale (on a chain not committed from its
  genesis, or at equal epoch on a committed one) whose branch carries an authority checkpoint above the fork point is
  still not moved by the authority's newer checkpoint on another branch (the review's same shape outside the slot);
  and neither side is newer when a seed of either carries no `signedAt`. Code only for the tail: no test runs it.
- Guarantee and limits (catch-up from any distance behind, review-stage7-r11 F2, network 04664ef): a device any
  distance behind its relay catches up over that relay. Before 04664ef a node subscribed to kind 8913 with no `since`,
  the relay answers a REQ newest first (ORDER BY created_at DESC), and an entry above head + 1, refused `bad-prev`, was
  held only within CANDIDATE_WINDOW = 64 of the head (src/node/node.ts `hold`); the ones above went only to the fork
  choice's aside buffer, which is not replayed while no fork choice moves the pin, so an honest device behind by more
  than CANDIDATE_WINDOW + 1 stopped at its start + 64 (19 + 64 = 83, not 169, behind by 150 in the review) until a
  reconnect or restart, and a member node in that state shares no seal-ask. Now, when the hold drops an entry above
  its window, once the subscription's first EOSE came (`gap`, `eosed`), the node asks its relays for the gap again,
  oldest first: it walks the gap above the head's created_at down by `until` in pages of `limit` CANDIDATE_WINDOW,
  keeping only the page cursors, then asks again page by page from the oldest up, so each page lands inside the hold
  window as the head climbs; each page's entries are judged in turn as the subscription's are, and a page ends once
  every live relay sent its EOSE or after CATCHUP_PAGE_MS = 10 s; one walk runs at a time, and a pass that moves no
  head ends it (src/node/node.ts `catchUp`, `page`, `hold`) (r11.catchup.test.ts > "CONTROL: behind by 40 (<
  CANDIDATE_WINDOW): it reaches the head"; "behind by 150: it reaches the honest head over its relay"; "behind by 3 x
  CANDIDATE_WINDOW: it reaches the honest head over its relay", each a fresh honest device holding 0..19, pinned at 19
  by a fresh seed, over the real relay holding the honest chain). The bound: a walk is ceil(gap / CANDIDATE_WINDOW)
  pages down and as many up, each waiting at most CATCHUP_PAGE_MS, and it holds one cursor per page, never the gap's
  entries beyond the hold's CANDIDATE_WINDOW x CANDIDATES_PER_SEQ. Limits, said plainly: the tests hold it up to
  3 x CANDIDATE_WINDOW = 192 behind over one relay; beyond that distance, and over several relays, it is code only;
  an entry above the window that never takes a place costs one pass of the walk (code only, no test times it); and
  the walk follows the relays' created_at order, so it reaches only what its relays serve.
- Limit, said plainly (T1 liveness, seed-before-handover): a seed signed before the newest hand-over is refused
  (node.long-range.test.ts > "a stale seed (its checkpoint at seq 2, before the hand-over at 3) is refused
  seed-before-handover, no pin left"), so an authority that withholds the re-signed seed after a majority hand-over
  stalls every fresh device given the chain through the newest hand-over: it plants nothing until that seed is signed (a
  fresh device given no chain plants the stale seed inside its validity window, the limit of 1.5 part 5 above).

Passage condition (by code), every file passing on network dev 1e5fd1c (2026-11-12, the runs named above):
- network/test/node.long-range.test.ts exits 0 (exists: the keys of a past epoch seal alternative chains; a device that
  holds the original refuses them (`wrong-epoch`, `pinnedHistory`); a device planted from the seed's checkpoint and
  shown only the alternatives attests and stores none; a stale seed is refused `seed-before-handover`; epoch-ahead
  entries get no attest ok and wait, bounded, for their hand-over).
- network/test/seed.checkpoint.test.ts and seed.sign.test.ts exit 0 (exist).
- network/test/theseus.seed-expiry.test.ts and theseus.fable-g.test.ts exit 0 (exist).
- network/test/theseus.behind-pin.test.ts, theseus.seed-authority.test.ts and theseus.authority.test.ts exit 0 (exist).
- network/test/theseus.test.ts exits 0 (exists; its S8, the stage-4 passage test of council stake on the ledger
  (Stage 4), is a plain test and passes).
- network/test/node.bond.test.ts and ledger.stake.test.ts exit 0 (exist).
- network/test/theseus.precommit.test.ts, theseus.nextseq.test.ts and theseus.nextseq-slept.test.ts exit 0 (exist:
  pre-rotation and nextSeq, f9c63fb).
- network/test/theseus.confirm.test.ts, theseus.confirm.precommit.test.ts and theseus.confirm.sim.test.ts exit 0 (exist:
  the confirmations rule, 1e5fd1c).
- network/test/noderun.pin.test.ts and theseus.eclipse.test.ts exit 0 (exist).
- The two highs, run alone at network df1c025 (2026-11-12, a detached worktree, 2 files, 7 tests passed):
  F1 test/theseus.nextseq-slept.test.ts (3/3) passing at df1c025.
  F2 test/noderun.pin.test.ts (4/4) passing at df1c025.
- network/test/epoch.handover.test.ts, node.pin.test.ts and node.key.test.ts exit 0 (exist).
- network/test/coercion.sim.test.ts, coercion.veto.test.ts, theseus.majority.test.ts, ledger.quorum-bond.test.ts and
  noderun.offer.test.ts exit 0 (exist: coercion and the veto, 4869da2; the bare majority and its slash, c1e93c5;
  node-run's newer seeds, f757fde), all passing in the whole-suite run at 4d61af0.
- network/test/theseus.confirm.authority-vs-handover.test.ts, theseus.confirm.reseat.test.ts,
  theseus.confirm.restart.test.ts and noderun.restart.test.ts exit 0 (exist: be791fe, e3c143a, 0376068; with
  theseus.confirm.precommit.test.ts, 26 tests passed at 9bfcd83 on 2026-11-12).
- network/test/theseus.confirm.veto.test.ts, theseus.offer-current.test.ts and theseus.veto.slot.test.ts exit 0 (exist:
  review-stage7-r3 F1 91420f5, F2 a436b32, F3 cdf7690; with theseus.confirm.authority-vs-handover.test.ts (F4,
  ee2ba17) and coercion.veto.test.ts, 5 files, 22 tests passed at d741a79 on 2026-11-12).
- network/test/theseus.veto.slot-leaver.test.ts exits 0 (exists: review-stage7-r4 F2, the slot leaver limit held; with
  the F1 cases R1, R2 and R3 of theseus.confirm.restart.test.ts and noderun.restart.test.ts, passed in the landing run
  of bb54e32).
- network/test/theseus.veto.authority-split.test.ts, theseus.genesis-behind.test.ts, node.foldcost.perf.test.ts and
  ledger.fold-from.test.ts exit 0 (exist: review-stage7-r6 F1 9852bf9, F3 d22b69b, F2 d831d31), with
  theseus.confirm.authority-vs-handover.test.ts timed at 6579148, all at network dev c7eaaac.
- network/test/theseus.veto.signed-at.test.ts, theseus.confirm.early-fork.test.ts, theseus.nopin-boot.test.ts and
  ledger.twin.test.ts exit 0 (exist: review-stage7-r7 F1 and F2 d8302c8, F3 3896ef8, F4 36bcb24 and 3f5fb6f, the F1
  fixture at 842e322), run alone at network dev 842e322 on 2026-11-13 (4 files, 14 tests passed).
- network/test/r8.invite-split.probe.test.ts, r8.junkfold.probe.test.ts, r8.round-clock.probe.test.ts and
  r8.kept-restart.probe.test.ts exit 0 (exist: review-stage7-r8 F1 ebceee8 and 0af99a2, F2 edc389b, F3 897226d, F4
  da74527), run alone at network dev 71363a2 on 2026-11-13 (4 files, 11 tests passed).
- network/test/r8.bounty-split.probe.test.ts, r9.double-veto.probe.test.ts, veto.competing.test.ts,
  r9.lowjunk.perf.test.ts, r9.intime-carry.probe.test.ts, r9.stale-stuck.probe.test.ts and door.test.ts exit 0
  (exist: review-stage7-r8 F1 the bounty 73ef484; review-stage7-r9 F1 d835ae3, F2 8d648af, F3 and F4 9cbf53f), run
  alone at network dev abc2fc5 on 2026-11-13 (7 files, 42 tests passed).
- network/test/r10.fat-bounty.test.ts, r10.veto-lofirst.test.ts, r10.veto-stream.perf.test.ts and
  r10.slotjunk.perf.test.ts exit 0 (exist: review-stage7-r10 F1 7382e2d, F2 and F3 00f2974, F4 f1d581e), run with
  r9.double-veto.probe.test.ts, veto.competing.test.ts, r8.bounty-split.probe.test.ts, r8.junkfold.probe.test.ts and
  r9.lowjunk.perf.test.ts at network dev 00f2974 on 2026-11-13 (9 files, 28 tests passed).
- network/test/r11.veto-above.test.ts and r11.catchup.test.ts exit 0 (exist: review-stage7-r11 F1 24ba11d, F2
  04664ef), run alone at network dev 04664ef on 2026-11-13 (2 files, 5 tests passed).
- network/test/r13.hold-flood.test.ts, r13.veto-order.test.ts and r13.stale-offer.test.ts exit 0 (exist:
  review-stage7-r13 F1 d554d13, F2 c52a7b4 and 5900b9c, F3 52520b8), run with theseus.offer-current.test.ts (its
  RV4-P4 control changed at 91262a6) at network dev 91262a6 on 2026-11-13 (4 files, 29 tests passed); the full suite at
  91262a6 is 165 files, 1571 tests passed, tsc exit 0, as run by the landing (forks/r13-logs).
- To be written: a test that a fresh device takes its plant chain from the seed's own sources.

The user is told: en "Keys that left the network no longer count, not even for a brand-new device." / pt-BR "Chaves
que saíram da rede não contam mais, nem para um aparelho novo." And, by the confirmations rule, a wallet shows an entry
as pending until it reads final. On site dev the wallet reads the node's own fold and shows "Not yet confirmed by the
network" (pt-BR "Ainda não confirmado pela rede") while the fold's head is not final (site 136b769;
site/src/wallet/node-fold.test.ts).

Code it adds: the plant chain taken from the seed's own sources (`StartOptions.chain` in src/node/node.ts: the option
exists, and no production caller passes it).

Code today (network dev 1e5fd1c; added since, at 9bfcd83: network/src/node/offer.ts `offerHeldSeeds`,
network/scripts/follow-seeds.ts, network/src/node/boot.ts `bootNode`, the `veto` entry and VETO_QUORUM in
network/src/impl/ledger.ts and network/src/constants/stake.ts; at d741a79: `sealQuorum` and the veto's slot in
`seqWhy`, network/src/impl/ledger.ts, and the judge's current seed, `current` and `fresh` in network/src/node/judge.ts;
at 842e322: `SeedManifest.signedAt` in network/src/seed/manifest.ts, `addAuthority` reading it in
network/src/node/judge.ts and the in-time rule in `beats`, network/src/node/confirm.ts; the planted no-pin fallback of
`bootNode`, network/src/node/boot.ts; `entryDigest` over author and created_at, `digestOfEntry` and `draftDigest` in
network/src/impl/ledger.ts, and `draft-author` and `created-at-skew` in network/src/node/reducers/ledger.seal.ts; at
71363a2: `SIGNERS` with invite and reserve sealed in network/src/interfaces/ledger.ts, `sealVerifies` in
network/src/node/confirm.ts, the failed-candidate ids (UNFOLDABLE_MAX) and the `endorsed` row in
network/src/node/judge.ts and network/src/node/store.ts, and the fresh draft past CLOCK_SKEW_S in `propose`,
network/src/node/node.ts; at abc2fc5: `CheckpointBody.bounties` in network/src/interfaces/ledger.ts, `bountyAskWhy`,
`bountiesWhy`, `pendingBounties` and the competing vetoes in `foldChainFrom`, network/src/impl/ledger.ts, `slotSibling`
and `witness` by `sealQuorum` in network/src/node/node.ts, the suffix tally, the weighed-junk memo key, `endorsedOn`
and `newer` in network/src/node/confirm.ts, `endorsedSince` and `carryEndorsed` in network/src/seed/manifest.ts, and
seed-sign's `--previous` with PREVIOUS_UNVERIFIED; at 00f2974: BOUNTY_CAP, `withinCap` and `sizeOf` in
network/src/node/rules.ts, `bounty-too-big` in `bountyAskWhy`, network/src/impl/ledger.ts, the packing by `withinCap`
in `propose` and the sibling from the evidence or kept aside, `beside` and `setAside` of a competing veto in
`slotSibling` and `consider`, network/src/node/node.ts, `delete` in network/src/node/store.ts, `below` in `foldHeld`,
network/src/node/judge.ts, and the `sealed` check in `slotRace`, network/src/node/confirm.ts; at 04664ef: `catchUp`,
`page` and CATCHUP_PAGE_MS behind `hold`, and `slotSibling`'s 'round' path taking no veto and deleting the candidate
the fold does not take, network/src/node/node.ts; at 91262a6: `hold`'s `checked` entries, its start at the head's
next seq, the refused `epoch-seq-out-of-range` and `bad-prev` entries it keeps, and the held rounds judged again in
`consider` when their competing veto arrives, network/src/node/node.ts, and `forkChoice` taking an authority
checkpoint that extends the fold's head, network/src/node/confirm.ts): network/scripts/seed-sign.ts (`--checkpoint <id>:<seq>:<time>`, `--genesis-seed`,
NO_CHECKPOINT, NO_CHECKPOINT_TIME, STALE_CHECKPOINT, FUTURE_CHECKPOINT); network/scripts/node-run.ts (`--seed`,
`--genesis-only`, `seed-required`, `seed-unpinned`); network/src/node/judge.ts (`judged`, `PlantRefused`,
`claimJudge`, the offered authority checkpoints, the aside entries, the fork choice in `judged('fold')`);
network/src/node/confirm.ts (`finalityOf`, `forkChoice`, `beats`, `committedFromGenesis`) and
network/src/constants/confirm.ts (CONFIRMATIONS_X, ASIDE_MAX); network/src/node/node.ts (`startNode`, `hold`,
`witness` and `evidence()`, `finality`, `offerCheckpoint`, `setAside`); network/src/node/store.ts (`RowWrite.repin`);
network/src/node/pin.ts (`firstPin`, `seedWhy`, `plantWhy`, `checkpointWhy`, `seedResignedAtHandover`,
`pinnedHistory`, `pinContradicted`, `pinConnects`); network/src/interfaces/pin.ts (`PlantWhy`); network/src/seed/
expiry.ts (`expiryWhy`, `effectiveExpiry`) and network/src/constants/seed.ts (SEED_VALIDITY_S, CLOCK_SKEW_S);
network/src/node/key.ts; network/src/node/stake.ts and network/src/constants/stake.ts (BOND_WINDOW, BOND_AMOUNT,
EPOCH_MIN_S); network/src/impl/ledger.ts (`epoch`, `epoch-not-next`, `wrong-epoch`, `epoch-too-soon`, `epochWhy`,
`entryPowOk`, `bond`, `unbond`, `slash`, `nextHash`, `nextSeq`, `epoch-next-not-precommitted`,
`epoch-seq-out-of-range`); network/src/node/reducers/record.attest.ts (`epoch-at-future`); network/src/seed/{trust,
compiled}.ts.

### Confirmations: finality after X, and the way back

Principle: an entry may be believed wrongly for a while, provided the device recovers quickly, with the healthy majority
of the network around it. Transactions therefore receive a seal of validity and security only after X confirmations,
in the manner of a confirmation count.

The reference chain is only the security bar here (1.6): the count of confirmations is the shape the rule takes, and nothing in this
design depends on that chain. Plan and measurements: network docs/plan/confirmations.md.

- What one confirmation is: a signature the set that forks cannot make on its own branch, of one of two kinds.
  Authority: a checkpoint at or above the entry on the device's fold, named by a seed the seed authority signed and the
  node verified under the pinned authority, counted from the booted seed once the judge passed it or offered while
  running through `node.offerCheckpoint(manifest)` (theseus.confirm.test.ts > "(a2) on the planted device the history
  under the seed checkpoint (0..15) reads final with one confirmation (the booted seed's), and an honest entry above it
  (the true hand-over at 16) reads not final until the authority's later checkpoint on it, then final"). Successor: an
  entry above it on the fold sealed by the next epoch at that epoch's full threshold (src/impl/ledger.ts `sealQuorum`;
  a veto, sealed by VETO_QUORUM, confirms nothing: review-stage7-r3 F1, network 91420f5), not a re-seat, whose key is
  traced to the genesis through final hand-overs, on a chain whose genesis commits epoch 1's authority (H1, network e3c143a; `nextHash`, `nextSeq`; theseus.confirm.precommit.test.ts > "(p2) ..." above). The old set holds no
  authority key (T1), and a seed its keys sign is refused `not-authorized` (theseus.confirm.test.ts > "(b2) a device on
  the true chain (16..18 folded) is offered the old council's fork (40 checkpoints) and seeds the old keys sign naming
  the fork's checkpoints: every seed is refused not-authorized, nothing moves, the head stays the true 18"); it holds
  none of the successor's keys, so it cannot seal under the next epoch (theseus.confirm.precommit.test.ts > "(p3) no
  new capture path: a device on the true chain offered the fork (14', 15') does not move, and the fork's 15' with a
  checkpoint the old council seals under epoch 1 is refused"). Nor can the old set plus a minority of the successor:
  one successor member's veto on the old set's fork is no successor seal, so the fork's entries still read not final
  and the way back stays open; since review-stage7-r8 F1 (invite and reserve sealed by the set) that member
  cannot even fill the fork's seqs up to the veto's slot (theseus.confirm.veto.test.ts > "the lone member cannot squat
  its way to the veto's slot on the fork: its invite at 16', no seal of epoch 1, is refused"; "GOAL: with ONE epoch-1 member's veto on the fork, the old council's 14' and 15' still
  read not final"; "GOAL: with that veto, the captured device still comes back on the true 14, 15, 16 (p2's successor
  path)"; "GOAL: an eclipsed device planted at 13, fed only the fork and the veto, reads no fork entry final", under
  "F1: a lone epoch-1 member's veto on the old council's fork confirms nothing"). Only a captured threshold of the
  successor makes the successor kind on a fork (the captured successor quorum limit above).
- X: an entry reads final with CONFIRMATIONS_X = 1 confirmation (src/constants/confirm.ts), a default value until
  another number is set. One suffices because each kind is a signature the old set cannot produce (the successor kind needs the
  successor's full threshold, which neither the old set nor one member's veto gives; above); the simulation found no fork entry
  read final under either kind at any X from 1 to 64 (theseus.confirm.sim.test.ts > "captured (the fork of 3 entries
  above the seed checkpoint): D1, D2, D3 read fork entries final at X = 1 and 2; D4 and D5 read none at any X"). That
  chain's genesis has no nextHash, so there D5 is 0 by its definition; on a genesis that commits epoch 1, where D5
  counts, it is measured 0 on every fork entry too (same file > "captured (the fork of 3 entries above the seed
  checkpoint): D1 2,1,0,0; D2 3,3,3,3; D3 2,1,0,0; D4 and D5 0 at every X, measured on the committed chain"; "eclipsed
  (the fork grown to 65 entries and the old council's own hand-over at 81 to the committed set, 66 entries): ..."),
  while the honest chain's entries under the new set's seals read D5 2 (same file > "honest (the true 16..83 folded):
  ...").
- Finality is recomputed at read: `node.finality(id)` counts the confirmations at each call from the fold and the
  verified authority checkpoints (src/node/confirm.ts `finalityOf`, a function of the fold, the events and the checkpoints it is given, which writes
  nothing); no "final" latch exists (the (a2) test above reads the same entry not final, then final, in one boot, and
  theseus.confirm.precommit.test.ts > "(p5) the committed set's quorum, captured on the fork, seals 16' there: ..."
  reads 14' and 15' final, then not final, in one boot). Depth, distinct peers and bonded stake as seen by the fold were
  measured and refused as confirmations, since the old set makes each of them for free on its own branch
  (theseus.confirm.test.ts > "64 checkpoints above seq 16, each sealed by two old keys, every one valid on the fork
  view; no balance moves; more valid signatures than the true chain carries"; "32 fresh node keys judge the fork entry
  at seq 16 on the fork view and each signs an ok verdict"; the sim's D1 to D3 rows below).
- The fork choice, the way back: `forkChoice` (src/node/confirm.ts), run by the judge in `judged('fold')`, moves the pin
  (`RowWrite.repin`, src/node/store.ts, through the judge's writer) to a checkpoint off the fold whose whole history
  folds from the genesis, when its branch above the fork point carries a confirmation the fold's branch lacks (a later
  sealing epoch on a committed chain, which wins even against the fold's authority checkpoint unless that checkpoint
  stands above the hand-over that seated the new set; at a hand-over's slot against a veto, the hand-over wins unless
  the authority endorsed the veto's branch before the hand-over's sealed time, `slotRace`, network 9852bf9, and below
  the slot the fold's authority checkpoint holds against a higher epoch only under that rule, by the seed's signed
  `signedAt`, network d8302c8; else an authority checkpoint, never against a fold's branch with
  a higher successor-confirmed epoch; a stale device moves only toward an authority checkpoint, network 9bfcd83, or,
  since network 9cbf53f, toward one the authority signed after every one on its own branch; an endorsement the
  authority's later seed carries in `endorsedSince` counts in time only where the device's branch holds it). Refused entries are kept aside and judged again under the new pin ((b), (b4) and (p2) above). It opens no new
  capture path: a device on the true chain is moved neither by the fork at any length nor by a seed the old keys sign
  ((b2) and (p3) above).
- Equivocation evidence after the switch: the two continuations at one (epoch, seq) are the double-seal proof
  (src/node/stake.ts `doubleSealWhy`) that burns each sealer's bond, and `node.evidence()` still proves it after the
  switch from the entries the device once took (theseus.confirm.test.ts > "(c2) after the switch the fork entry 16 the
  device once took is off its fold, and evidence() still names P, Q and R with the hand-over and that entry, a proof
  stakeReducer burns on the true chain"; theseus.confirm.precommit.test.ts > "(p4) evidence() names the old sealers of
  14 and 14', and of 15 and 15' (one epoch, one seq, two digests)"). Publishing the slash stays the existing path, a
  `slash` entry sealed by the present set.
- The measured numbers (theseus.confirm.sim.test.ts prints them; every row below is asserted exactly, network
  4d61af0; the times are printed, not asserted, but the eclipsed fork's build is asserted under 5 s). Fork entries
  read final, per candidate, at X = 1, 2, 6, 64, any one a loss: captured device (3 fork
  entries): D1 depth 2, 1, 0, 0; D2 peers 3, 3, 3, 3; D3 bond 2, 1, 0, 0; D4 authority 0, 0, 0, 0; D5 successor 0, 0,
  0, 0. Eclipsed device (65 fork entries, built in 715 to 1114 ms over the runs of 2026-11-12): D1 64, 63, 59, 1; D2
  65 at every X; D3 64, 63, 59, 1 (1 at X = 64); D4 and D5 0 at every X; it sees head seq 80, every fork entry
  final=false, no fork choice. On a genesis committing epoch 1 (sim 1c, where D5 counts): captured the same rows;
  eclipsed (66 fork entries, the old council's own hand-over at 81 among them) D1 and D3 65, 64, 60, 2, D2 66 at every
  X, D4 and D5 0 at every X; an honest device on the true 16..83 reads D5 66, 66, 0, 0 of 68. Recovery over the
  real relay, authority path (sim 3, "the fork reaches the device first over the relay (captured); the true chain then
  arrives and is kept aside, and the authority's checkpoint switches it: the times from publish and from the offer"):
  the true chain reached the captured device 305 ms after its publish, offer to switch 474 ms, publish to switch 841 ms
  (the plan records 733 to 835 ms over its runs). Successor path, no authority (sim 4, "captured by the fork first
  (14', and the old council's own hand-over 15' to the committed set): D5 reads 0 on every fork entry; the true 14 and
  15 alone move nothing; the committed set's leader proposes the next checkpoint live and the device switches on it"):
  the committed set's leader sealed 14 owed rewards (16 to 29) before its first checkpoint (30, at 7735 ms), and the
  device switched 8819 ms after the first propose (the plan records about 9.7 s); the pin moves only to a checkpoint.
  These times are one run on the limb, 2026-11-12, at 1e5fd1c.
- What it costs: finality waits for a confirmation. A present-epoch entry reads final only at the
  authority's next checkpoint on it (today the authority signs at hand-overs, so finality is as fast as its cadence),
  or on a committed chain at the next hand-over (at least EPOCH_MIN_S, 8 days). A wallet must show "pending" until
  then (theseus.confirm.sim.test.ts > "D1 needs X entries above it (which the fork matches for free); D4 needs one
  authority checkpoint on or above it; the history under the booted seed's checkpoint is final at once"). Its limits
  are the "Limit, said plainly" bullets above (F1, the slot leaver, F2, F9, the eclipse, T1, the captured successor
  quorum, memory only, fold cost, the offered checkpoint, signedAt and old builds, no regime gate, a seal round's
  clock, the bounty, the competing vetoes, a member's own sealed entry, the not-committed tail of the stale rule).

### The one judge

One function, `judged(seed, now)`, holds three checks: `plantWhy` (the checkpoint is sealed, `checkpoint-time-mismatch`,
`seed-before-handover`), `expiryWhy` (the seed's effective expiry, bounded above by now + SEED_VALIDITY_S +
CLOCK_SKEW_S) and `seedResignedAtHandover`; in fold mode it also runs the fork choice of the confirmations rule
(above). It is the only function that may move the pin, set a pending candidate, or say a device is fresh. Start,
fold, receive, the at-or-below-pin path and the stale read all call it; no path keeps a subset of its checks. Freshness is never stored: a device is fresh only while it holds a seed signed by the pinned
authority whose effective expiry is ahead of its clock. The guard is a test that fails when a second write site of the
pin or of freshness exists.

A chain check is a property of the seed, fixed when it is applied; expiry is the only check that moves with time.
In plain words: `judged()` runs `plantWhy`, `expiryWhy` and `seedResignedAtHandover` every time a seed is applied (at start,
at connect, at revive, and for a seed at or below the pin), and the stale read checks only the expiry bound against now.
The reason: the continuous form, which would re-run the chain checks against the clock, would stall the whole network at
every honest rotation, and the fold already judges each entry.

**Freshness has no default.** A device is fresh only if `judged()` returned
a positive verdict for the booted seed when it was applied in this boot, and the expiry check passes at now on every
read. Since network a436b32 (review-stage7-r3 F2) the verdict is the judge's current seed, the newest seed it verified and
passed in this boot: the booted seed, or a seed offered later through `node.offerCheckpoint` once the fold holds its
checkpoint and it passes `plantWhy` and `expiryWhy` (src/node/judge.ts `current`, `fresh`; theseus.offer-current.test.ts
> "GOAL: offered the authority's newer, valid seed while running, it is current again and takes the next honest
entry"); the expiry check reads that seed. The
verdict lives only in the memory of the judge module and is never stored. Its absence is stale: no verdict, a pending
seed, or a refused seed are all stale. A candidate exists only for the booted seed: every boot clears it, and only a
boot on the seed that names it sets it. A stale device still takes pinned history up to the seed checkpoint, and becomes
fresh when `judged()` passes the seed at connect. A fork pin never reaches an honest checkpoint and stays stale; its way
back is the fork choice (Confirmations, above): `judged('fold')` moves the pin to the other branch, through the judge's
own writer (`RowWrite.repin`), only when that branch carries a confirmation the fork's branch lacks
(theseus.confirm.test.ts > "(b4) the authority's checkpoint offered before the true entries arrive: the device switches
when they do, in any order (18, 16, 17), and a restart on the same database keeps the true head (the pin moved with
the fork choice)"; theseus.confirm.precommit.test.ts > "(p2) the true 14, 15 and 16 delivered (16 sealed by the
committed epoch 1): the device switches on 16's arrival; 14 and 15 read final by the successor's seal, 16 not yet; the
fork entries are off the fold"). No resync from the seed exists in the code. The pin and candidate rows and the
verdict are private to the module that exports `judged()`, and a test fails if any other file imports their writer. Why not compute fresh from the pin alone: without
the hand-over check a pre-hand-over seed below the pin would read fresh, and with it on every read a running device
would go stale at every honest rotation.

Status: decided and on network dev: fork/theseus-behind-pin landed at e916313 (its round 10 green e7e1f88), and dev
1e5fd1c holds it, with the fork choice of fork/confirm-final (network/src/node/judge.ts; rounds 4 to 10 recorded in
network docs/qa/review-theseus-behind-pin-r4.md to docs/qa/review-theseus-behind-pin-r10.md).

Named limits:
- T1: the seed authority key is a single key outside the council, and it is assumed not compromised, until stage 8.
- T2: the stage-8 key transfer reopens old-holder forks; it has its own design and its own review.
- T3: a backward clock step past CLOCK_SKEW_S makes a device stale until its clock passes it.
- What the tests hold of them at 1e5fd1c: T1 and T2 are assumptions, and no test holds them (a stolen authority key is
  the T1 limit of the confirmations rule above). The device clock is trusted: a backward step past
  a seed's expiry makes the expired seed current again (theseus.judge.test.ts > "a backward clock step past its seed's
  expiry makes the expired seed current again (the seed applied while valid, so judged)"); no test holds the stale
  direction T3 names.
- The mid-catch-up stale limit: a device restarted on its own seed at its pin while it holds only part of the pinned
  history is stale until its fold reaches the seed checkpoint, and is then fresh in that boot; it fails closed, stale
  and never fooled (theseus.r8.test.ts > "restarted on the seed at 5 holding 4, 5: stale; given 3..0, the fold reaches
  5 and the device is fresh in this boot").

### Threats (TUF, a compromised old key set)

The attacks are TUF's (The Update Framework, https://theupdateframework.io/docs/security/ and the TUF specification,
"Goals to protect against specific attacks", https://theupdateframework.github.io/specification/latest/; the pages were
read through a web search on 2026-11-12, the direct fetch refused by the build machine's proxy), applied to the old key set:
keys that once sealed, handed over since, and now in an attacker's hands. "Wrong-key acceptance after rotation" is the
name used here for TUF's key-compromise goal. Each row was grepped and every file it cites passed in the whole-suite run at network
dev ec437ef (files under network/test/). Stage names the stage that delivers the guarantee; a cell with no test says
"named limit" and why.

| Attack | The guarantee | Stage | Network test, or named limit |
| --- | --- | --- | --- |
| Rollback (an older chain or seed, served as current) | A device never goes behind the last checkpoint it holds, nor below the seed version it runs: an older chain, or another past at or before the checkpoint, is refused does-not-extend-checkpoint. | 7 (the checkpoint pin, part 5), 2 (the seed version floor) | node.pin.test.ts > "B comes back on its own store: it keeps its pinned chain and refuses the other history, does-not-extend-checkpoint"; ledger.replica-stale.test.ts > "on return of a peer serving an older chain that stops before the checkpoint (a rollback): refused the same way"; seed.upgrade-broadcast.test.ts > "refuses an older version, and a different seed at the version it runs (no rollback)". |
| Indefinite freeze (the old view served forever) | A device knows it is frozen: freshness is a seed signed by the pinned authority within SEED_VALIDITY_S, read at every record, so past it the device is stale and src/node/node.ts refuses stale-device every ledger entry above its head, its pin and a pending seed checkpoint (at or below them entries are judged as before, so a stale device still takes its pinned history); with no peer answering, the replica serves its last verified head flagged stale: true, what it submits is pending and never final, and a peer's chain off its checkpoint is refused on return. | 7 (the stale rule) | theseus.eclipse.test.ts > "member B sees only its relay and reconnects every 6 days for 4 weeks: stale by the second week, it shares no fork ask and takes no fork entry"; ledger.replica-stale.test.ts > "with no peer answering, it serves its last verified head flagged stale: true"; "a submitted entry is queued and reported pending, and never counted as final: head, entries and checkpoint stay"; "on return of a peer serving the old key set's fork under the checkpoint: refused does-not-extend-checkpoint, head kept, stale". Named limit: inside the seed's window (at most SEED_VALIDITY_S, 7 days) a frozen device is not yet stale; it reads nothing of the old set's continuation final (the review-stage7-table-r1 F1 limit above). |
| Fast-forward (a hand-over or seed dated far ahead, so every honest next one looks old) | A hand-over timed beyond the device clock + CLOCK_SKEW_S is refused epoch-at-future, at the head and ahead of it, and is never held as a candidate; entries of an epoch the chain has not handed over to get no attest ok; a seed whose notAfter is too far ahead is refused seed-expired. | 7 (the hand-over clock and the epoch rule) | theseus.fable-g.test.ts > "record.attest refuses it at the next place, epoch-at-future; the hand-over due now attests ok"; "ahead of the head too (where only the epoch rule judges it): epoch-at-future, so it is never held as a candidate"; node.long-range.test.ts > "a device at its head refuses each by name, at the next place and further ahead"; theseus.seed-expiry.test.ts > "a device refuses a seed whose notAfter is more than SEED_VALIDITY_S + CLOCK_SKEW_S ahead of its clock: seed-expired on a fresh device, SEED_EXPIRED by plant()". Named limit: the fold itself has no clock, so the guarantee is the device's door, record.attest (theseus.fable-g.test.ts > "the hole is real: the fold takes the far-future hand-over (it has no clock), and then every honest next hand-over is epoch-too-soon"). |
| Mix-and-match (a seed and a chain, or a checkpoint and a state, that never stood together) | A seed binds its checkpoint's id, seq and time under one signature, and the device plants it only where the fold placed that very checkpoint with that created_at; a checkpoint pins the whole folded state by its digest. | 7 (part 5), 4 (the stake table in the digest) | theseus.seed-expiry.test.ts > "where the chain is present the time claimed must be the folded checkpoint entry's created_at: a wrong time is refused checkpoint-time-mismatch, no pin left; the right one plants and is pinned"; seed.checkpoint.test.ts > "a checkpoint with the right id at a wrong seq: refused checkpoint-not-sealed, no pin left"; ledger.stake.test.ts > "a checkpoint pins the stake table: a draft whose state digest has other bonds is refused, checkpoint-state-mismatch". |
| Endless data (a flood or a huge file) | Junk without proof of work takes no slot and leaves the evidence alone; a seed file and a seed blob are refused over their caps before they are read. | 7 (the door and the evidence bound), 2 (the seed caps) | node.long-range.test.ts > "a flood of no-pow far-epoch entries takes no slot; the honest out-of-order entries still land and nothing waits at a passed seq"; node.evidence.test.ts > "after the fork, EVIDENCE_MAX entries of junk (no pow, unsealed, under the threshold, foreign keys, epoch ahead) leave the fork's proof alone"; seed.file.test.ts > "8. SEED_FILE_MAX_BYTES is 64 MB: a reader refuses a bigger file before reading it"; relay.seed-kinds.test.ts > "refuses a blob one byte over the cap, naming the cap". Named limit: a flood of proof-of-work entries can push the true path out of the aside buffer (ASIDE_MAX, in memory, above; code only), and the replica's sync reads every ledger entry a peer serves up to its EOSE with no count or byte bound (src/impl/replica.ts; code only). |
| Wrong-key acceptance after rotation | After a hand-over the past epoch's keys seal nothing a reader accepts; a hand-over to keys its predecessor did not commit is refused epoch-next-not-precommitted; a seed signed by the old set's key is refused before the node starts. | 7 (hand-over and pre-rotation), 2 (the seed pins) | epoch.handover.test.ts > "over a real peer (ed-relay)", under "after the epoch hand-over, the past epoch signs nothing a reader accepts"; theseus.precommit.test.ts > "a device asleep at epoch N, woken with only the K' branch: the hand-over refused epoch-next-not-precommitted, nothing under K' folded, no evidence, no other branch"; theseus.authority.test.ts > "a seed signed by the old set's key: refused before it starts, its database untouched". Named limit: a device whose fold is before a hand-over, inside its seed's window, may take the old set's continuation offered first, and reads none of it final (theseus.test.ts > "the within-window twin: slept less, it follows the fork offered first; the double seal is kept as evidence and burns the bond through the slash (F1)"); pre-rotation covers one epoch of sleep, and a genesis-seed device is pinned only at the last checkpoint it folded while fresh, so it can be captured above it (the F1 and F2 limits above). |
| Slow retrieval (a drip that keeps a device in contact and never current) | Contact is not freshness: a device fed one old-set entry every 6 days, or a junk ask, is stale-device once its seed expires, and the honest seed then brings it to the honest head; the relay drops a socket that idles before AUTH and a subscriber that never reads. | 7 (the stale rule) | theseus.authority.test.ts > "a device on a seed valid a week is fed one fork entry every 6 days: by the second week (its seed expired) each is stale-device; the honest seed then plants and it reaches the honest head"; theseus.eclipse.test.ts > "a device given a junk ask from the old leader every 6 days is stale by the second week and takes no fork entry"; relay.hardening.test.ts > "a socket that sends nothing before AUTH is closed at the idle deadline; an AUTHed one stays"; relay.scale.test.ts > "F5 / S1: a subscriber that never reads stalls no publisher, and is dropped when its outbound queue overflows". Named limit: inside the seed's window an operator node fed the old set's drip follows it (theseus.authority.test.ts > "an operator node eclipsed while running is out of scope: it trusts its relays (fed the old set's drip while its seed is valid, it follows it)"); the replica's sync deadline is asserted against a stopped peer only, no test serves a peer that answers byte by byte (src/impl/replica.ts `sync`, timeoutMs). |

