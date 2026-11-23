**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## 1. Target

### 1.1 What Angstone is

- Simplicity is the design principle: one coin on the network, and a broker that buys and sells it against any other coin
  with the price built in, so that the network earns a small margin on every exchange.
- The network MUST be proof against a single-server attack: the app generates a seed, the seed can be shared, and the
  network works peer to peer among all its users.
- The network is immortal: it has no single point whose loss ends it, and its code is under the control of its maintainers.
- Angstone is a platform and a network on which a person builds a secure digital life. It works without a
  server: every user is a server. Its code is public from day one.
- Angstone works as tools.
- Eventually a devkit is offered, accepting one specific code format and PLUGINS that add places and tools for places,
  all running on the network, signed, and installable by the user.
- Angstone is the only wallet and the only app, and a secure personal agent belonging to its user.

The interface grammar (menu teseu, WHERE, WITH WHO, TOOL, TASK, OBJECT, Ad Infinitum) is product, not the trust ladder; this
document only names it. Code today for "tools" and "plugins": the tool contract (network/src/interfaces/tool.ts) and
the plugin boundary (network/src/interfaces/plugin.ts), typed; no plugin runs yet.

### 1.2 Luminarkon: the node layer, code on every device

- Luminarkon is a black box: what is inside does not matter. What it MUST provide is functions that define the rule for
  executing code, that sign only when the rule is met, and that have several witnesses that the rule was met before the
  signature is given.
- Normal backend operation is performed by Luminarkon, as code on every device, all of it open source. Each node holds
  its own secret key, and the parts that sign the secret are held by separate nodes.
- Luminarkon MUST be finished, live and implemented now. It does not depend on any council of AI agents: it is code and
  it depends on nodes.
- Data is validated by nodes that sign cryptographically (Luminarkon in Angstone), and these nodes play the role of the
  backend.

Code today: the node module network/src/node/ (key.ts, rules.ts, store.ts, seal.ts, node.ts, attest.ts, contract.ts,
verdict.ts, reward.ts, handles.ts, cids.ts, pin.ts, db.ts, db-file.ts; reducers/ledger.seal.ts,
reducers/record.attest.ts). Each device draws its own node key, never the login key (key.ts `drawNodeKey`;
network/test/node.key.test.ts, node.key.chromium.test.ts). Two real devices seal one ledger entry together at threshold
2 and refuse a seal by one alone (network/test/node.two-devices.test.ts, node.seal.test.ts). The same module runs on a
server as one more node (network/scripts/node-run.ts; network/test/node.scripts.test.ts) and in the page
(site/src/node/engine.ts; site/src/node/node.browser.test.tsx). The seal scheme today is `set-bip340/1`: each member a
whole key, `threshold` distinct signatures (network/src/impl/ledger.ts; network/test/ledger.contract.test.ts). Secret
shares in the strict sense (one group key, shares of its secret held by separate nodes) are typed as `frost-secp256k1/1`
(network/src/interfaces/ledger.ts) and not implemented: OI-10.

### 1.3 Lumi Actions: code with a signed, expected cid, judged by nodes

- Everything that in a traditional app or social network is a REST call to a centralised API is a Lumi Action: code with a
  signed, expected cid, running on nodes that sign or refuse the action according to the business rules, consulting the
  network's own signed views, databases and caches; nodes reach consensus and confirm validity or not, each signing with
  its share.
- Every input field MUST have a validation pipe and protection against injection of any kind, validated by the network's
  business rules. This is required from the start, since otherwise any field accepts any value.
- A biography or a user name MUST NOT be accepted without comparison with existing ones, and no input value without a
  signed validation by the network.
- The Save button of the settings MUST trigger validation by the network, and the fields (the photo included) change only
  after the network signs.
- The successful execution of such an action, from a validation accepted by the network, PAYS ang. The quantity is
  unbounded in principle, but sufficient to make mining on large hardware worthwhile in proportion to the network's need
  when miners are scarce. The initial amounts are a starting guess, adjusted later by code. A phone therefore earns ang
  not once a month but for the time it stays on and signs other users' actions.

Code today: the typed contract (network/src/node/contract.ts: `LumiAction`, `REDUCERS`, `judge`, `SignedVerdict`;
network/test/node.contract.test.ts). Two action kinds exist today (`ledger.seal` of kind class `system`, `record.attest` of kind class `record`); a reducer cid of the signed seed is official and also appears in the official list at the version in force. A node refuses an action
whose cid is neither a reducer of the signed seed nor an official-list or plugin cid admitted under R3 (`unknown-cid`) and a reducer the signed seed does not list (`reducer-cid-mismatch`,
network/src/node/cids.ts; network/test/node.cid.test.ts). Every field a person types has one pure rule in
network/src/validate/fields.ts, pinned by test/vectors/fields.json (network/test/validate.fields.test.ts); the relay's
Python port reads the same vectors. A Save in Settings stays pending until a node of the epoch signs it
(site/src/store/settings-save.network-signed.test.ts, attest-ask.relay.test.ts). The reward per sealed verdict is a
reducer with a starting guess retuned by code (network/src/node/reward.ts `START_PARAMS`, `retuneParams`;
network/test/node.reward.test.ts, node.reward-run.test.ts). Gap: only the Settings fields go through the network today;
the admission of a new action kind (by cid? by authorisation? by NFT? how is it paid for, by a token fee?) is OI-1; the admission of a cid is answered by R3.5 (official list signed by t keys) and R3.10 (grants), and what stays open is authorisation by a transferable token and the fee. The sealing, the injected runtime, the executor protections and the plugin permissions of a Lumi Action are normative in Part R (R1 to R3).

### 1.4 Nodes: permissionless, every device, stake, seats, the invite tree

- Every device on the network is a node.
- The network MUST be permissionless: anyone can be a node without security risk. A node that contributes receives ang for
  normal processing. The same rule and code apply to every device, from a smart watch to a supercluster. The code MUST
  expand, probe every resource under the user's control and use the available ones to the maximum.
- The first operator's always-on machine is a node 24/7, and an app that expands to larger hardware becomes a node that
  earns more.
- Ideally the network starts with a few nodes of the project's own as the Luminarkon ones, each a guardian of one part of
  the secret (the owner's phone, a cloud droplet), while every new user is a potential new member after a minimum
  availability.
- The network MUST accept threshold 1 of 1 (the operator's own node), then 2 of 2 (the first member's node and either a
  desktop node or a founding member's smartphone logged in as that member), then grow automatically, with powerful nodes
  entering with their whole holding of ang as stake. The larger the stake, the greater the chance of a seat; to gain a
  larger stake a node must buy ang from others.
- Every person who holds the coin, and especially those with more on the device, puts ang at stake while processing
  Luminarkon in the background (mining).
- The money a device holds is automatically stake, and the device is automatically part of the processing of the whole
  network. In a certain sense it pays fees to itself when it operates the network: whoever uses the network the most and
  strains it the most pays the token and loses; whoever participates continuously without straining its processing ends
  with a positive balance of fees.
- Registration MUST be by invitation only; a fake local registration is not accepted. The original web of trust can pass
  from one invitation to the next. The app MUST also offer an option to spread a seed to a friend, planting it on the
  friend's device entirely by NFC.
- Invitation order at the start: the root first (the first node's operator key, the future council), then the dogfood
  tester of Angstone, and only then the project owner, invited by the root.
- The design MUST be checked for sustainability with devices alone, without "dedicated" nodes.

Code today: the invite tree on the relay (`invite_required`, `invite_depth`, `invite_per_member`, a revoked key falls
with everything below it, which A2.12 requires the code to stop doing for a ban; network/test/login.invite.test.ts) and ledger membership by `roots` or a member's `invite`
entry (network/src/impl/ledger.ts, `invite-not-member`; network/test/ledger.contract.test.ts). The invite QR and link
(site/src/invite/invite.ts; site/src/invite/invite.test.tsx). The epoch set is `epochKey.members` with `threshold`,
handed over by an `epoch` entry (network/test/epoch.handover.test.ts). The theatre answers the sustainability requirement with simulated phones
only, 10 to 1000, and home PCs (network/src/theatre/coverage.ts; network/test/theatre.coverage.test.ts). Gap: no stake table, no seat
draw, no NFC; a device's node runs only while the app is open.

### 1.5 The security theorem: Theseus resistance

- The network MUST have complete resistance to the Ship of Theseus paradox: old, rebel nodes cannot gather to defraud a
  new, valid signature in the present, which is the last bottleneck and security problem.
- Full control of the code of every component is the shortcut that makes this resistance possible.
- Old nodes MUST NOT be able to use modern public data to guess the state of the network and create a new valid
  signature: every current node needs a random element, from a source of its own choice, that makes this impossible.

Resolved in design, owed in code. The design that answers the first requirement above was closed on 2026-10-17 and
confirmed on 2026-11-04 (the random element must be secret, never a public source); it has not been contradicted since.
The governing condition, stated on 2026-09-21: old members that fake their epoch in the past cannot sign in the present.
What is owed is code, not research: the plant chain taken from the seed's own sources (part 5, stage 7).
Parts 1 to 6
below say what network dev 71363a2 holds (written at 7628370, 2026-11-12: the one judge of Stage 7, seed expiry, the
bond on the ledger; since review-stage7-r7 F5 the code is named by file and symbol, not by line, as Stage 7 names it;
re-read at 71363a2 for review-stage7-r8, whose F5 is part 6's open limit below, and at network dev abc2fc5 for
review-stage7-r9: the seed's signed `endorsedSince` in part 5, the double veto kept as evidence in part 6, and at network dev 00f2974 for review-stage7-r10: the
competing veto kept aside in part 6, and at network dev 04664ef for review-stage7-r11: the hold's catch-up in part 5,
no refused entry stored one seq above the slot in part 6, and at network dev 91262a6 for review-stage7-r13: the hold's
checked entries and the refused entries it keeps in part 5, a stale device merely behind taking the authority's offered
checkpoint in part 5, the round held on a competing veto in part 6), each with the code that enforces it and a test that passes on that commit. The mechanism, in six parts, each with its
code:

1. Keys per epoch, never a renewed key. Each epoch has its own independent set; the hand-over to epoch N+1 is a
   ledger entry sealed by epoch N; a reader accepts a seal only from the epoch the ledger's head declares current. Old
   keys can only sign for a closed epoch, so what they produce is not valid in the present. Code: the `epoch` rule,
   `epoch-not-next`, `wrong-epoch` (network/src/impl/ledger.ts); network/test/epoch.handover.test.ts (its header names
   this the Theseus guarantee). Exists.
2. The secret random element (the random must be secret, never a public source). Every
   current node brings a secret drawn on its own device into the epoch's set, so no public data lets an old set compute
   a present key. Code: under `set-bip340/1` each member is a whole key drawn from the device's CSPRNG
   (network/src/node/key.ts `drawNodeKey`, `crypto.getRandomValues`) and derived from nothing public; under
   `frost-secp256k1/1` (OI-10c) the same requirement becomes a DKG where each share comes from its owner's
   secret. Exists for the scheme in use.
3. The witnessed record (specified on 2026-09-21 at 944c956, not contradicted since): a
   signature counts only where the ledger shows it, at a seq inside its epoch; faking an epoch means rewriting the
   record every device holds, not breaking the curve. In this network the ledger is that record. Code: `foldChain`,
   `validateEntry`, `wrong-epoch` (all three in network/src/impl/ledger.ts); network/test/ledger.contract.test.ts
   (a real chain folded), epoch.handover.test.ts (its case "old committee, old epoch tag" refused `wrong-epoch`),
   ledger.epoch-validate.test.ts (`validateEntry` on the hand-over), node.long-range.test.ts section a ("validateEntry
   on its fold refuses every forged entry by name"). Exists.
4. Checkpoint pins: each device keeps the last signed point it has seen and refuses any chain that does not extend it.
   Code: network/src/node/pin.ts `pinnedHistory`; network/test/node.pin.test.ts. Exists.
5. The late device starts from a recent sealed checkpoint carried by the signed seed, received from more than one source,
   never from genesis alone: a device that joins late receives that point from several sources of the project, and starts
   from a recent checkpoint. A first seed, signed before any checkpoint is sealed, has no sealed checkpoint
   to carry, so its genesis is its checkpoint; the genesis is not a ledger entry. Code (network dev abc2fc5):
   - Sign: network/scripts/seed-sign.ts takes exactly one of `--checkpoint <id>:<seq>:<time>` (a sealed `checkpoint`
     entry and its created_at, unix seconds) and `--genesis-seed`; neither, both, or a malformed one prints
     NO_CHECKPOINT, `<id>:<seq>` without the time NO_CHECKPOINT_TIME, a time more than SEED_VALIDITY_S old
     STALE_CHECKPOINT, a time more than CLOCK_SKEW_S after the signing FUTURE_CHECKPOINT; each exits 1 and writes
     nothing (network/scripts/seed-sign.ts `parseCheckpoint` and its STALE_CHECKPOINT and FUTURE_CHECKPOINT checks;
     network/test/seed.sign.test.ts "refuses a manifest with no
     checkpoint, or a malformed one, and writes nothing", "refuses both --checkpoint and --genesis-seed, and writes
     nothing (neither is refused above)"; theseus.seed-expiry.test.ts "scripts/seed-sign.ts --checkpoint id:seq:time
     signs checkpointAt = time and notAfter = time + SEED_VALIDITY_S; ..."). Every seed is signed with notAfter, the
     checkpoint time (a genesis seed: the signing time) + SEED_VALIDITY_S (seed-sign.ts, the `notAfter` it signs), and
     since network d8302c8 (review-stage7-r7 F1) with `signedAt`, the signing time, signed into the manifest
     (network/src/seed/manifest.ts `SeedManifest.signedAt`, covered by `canonicalBytes`, written by `makeManifest`);
     the judge weighs the authority's endorsement by it (Stage 7, the slot-leaver row). Since network 9cbf53f
     (review-stage7-r9 F3) a checkpoint seed may also carry `endorsedSince`, signed the same way: the authority's
     earlier checkpoints of the branch the seed's checkpoint extends, each with the earliest `signedAt` it gave that
     checkpoint (at most ENDORSED_SINCE_MAX = 16, none above the checkpoint; src/seed/manifest.ts `carryEndorsed`,
     checked when parsed), written by seed-sign from `--previous <manifest.json>`, the previous seed, which must verify
     under the trust.json seedPins or seed-sign prints PREVIOUS_UNVERIFIED and writes nothing; scripts/door/resign.ts
     passes the dir's own last manifest.json (door.test.ts "a re-sign at the same and at a later checkpoint carries the
     earlier checkpoints with their first signedAt, signed", "a previous manifest.json not signed by the trust.json
     seedPins stops the re-sign (PREVIOUS_UNVERIFIED), nothing written"). A genesis seed carries no
     `checkpoint` field and plants only as the genesis pin, no pin stored (network/test/seed.checkpoint.test.ts "a first
     seed (no checkpoint) on a chain with no hand-over plants as the genesis pin: no pin").
   - Plant: `startNode` (network/src/node/node.ts) applies the booted seed through the one judge,
     `judged(seed, now, 'start')` (network/src/node/judge.ts; Stage 7, "The one judge"), before any connection opens.
     The judge first verifies the seed under the seed authority its caller gives (`StartOptions.seedAuthority`,
     judge.ts `verify`): a seed signed by another key, or no authority given, moves no pin, sets no candidate and leaves
     the device stale (network/test/theseus.seed-authority.test.ts "a forged seed, signed by a key outside the pins:
     stale", "a seed with no authority given: stale"). Then, on a fresh device or a seed ahead of its pin, it runs
     `expiryWhy` (below) and `seedWhy`, which calls `plantWhy` (network/src/node/pin.ts `seedWhy`, `plantWhy`; judge.ts `judged`).
     A checkpoint that is not a checkpoint the fold placed at that seq (`checkpointWhy`) throws `PlantRefused`
     `checkpoint-not-sealed`, and no pin is left (the old pin stays) (seed.checkpoint.test.ts "a checkpoint that is an id
     not in the chain: refused checkpoint-not-sealed, no pin left", "a checkpoint that is a real entry of the chain but
     not a checkpoint: refused checkpoint-not-sealed, no pin left", "a checkpoint with the right id at a wrong seq:
     refused checkpoint-not-sealed, no pin left", "an unsealed checkpoint ahead of its pin is refused
     checkpoint-not-sealed and its pin stays"). A checkpoint time other than the folded entry's created_at is
     `checkpoint-time-mismatch` (pin.ts `plantWhy`; theseus.seed-expiry.test.ts "where the chain is present the time claimed
     must be the folded checkpoint entry's created_at: a wrong time is refused checkpoint-time-mismatch, no pin left;
     the right one plants and is pinned"). `PlantWhy` has these four reasons (network/src/interfaces/pin.ts `PlantWhy`).
   - A pinned device merely behind the seed's checkpoint (it holds nothing at that seq, and nothing on the
     checkpoint's path contradicts its pin) is not refused: the checkpoint becomes a pending candidate (pin.ts
     `seedWhy`, its `pending` plan; judge.ts `judged`, the candidate row), the device runs stale on its pinned history
     (node.ts reads the judge's `fresh`: a stale node answers no seal-ask, vouches for nothing, proposes nothing), and
     the judge pins the checkpoint once the fold's path connects to it (judge.ts `judged('fold')`, pin.ts `pinConnects`)
     (network/test/theseus.behind-pin.test.ts "a store holding honest[0..2] (pinned 2) and a seed whose checkpoint is
     honest[5]: planted, pinned 5, and it folds to honest[5] from the pin down"). A store that pinned another entry on
     that path refuses the seed `checkpoint-not-sealed` and keeps its pin (same file, "a store holding honest[0..1] and
     the old set's branch to its checkpoint at 4 (pinned there), a seed whose checkpoint is honest[5] with the chain:
     refused checkpoint-not-sealed, the old pin stays").
   - Expiry: every seed expires at the earlier of its notAfter and its checkpointAt + SEED_VALIDITY_S (7 days), and a
     fresh plant or a seed ahead of the pin is refused `seed-expired` past that, when it carries neither, when its
     notAfter runs more than SEED_VALIDITY_S + CLOCK_SKEW_S (600 s) past the device clock, or when it was signed late
     with an old checkpoint (network/src/seed/expiry.ts `expiryWhy`, network/src/constants/seed.ts; judge.ts `judged`;
     theseus.seed-expiry.test.ts "a. a fresh device, a stale but genuinely signed seed ... once the device clock is
     past notAfter, startNode refuses it seed-expired before it opens any connection: no pin left, and its store holds
     no ledger entry"). Freshness is the judge's verdict for its current seed in this boot (the booted seed, or a newer one offered
     through `node.offerCheckpoint` and passed, since network a436b32) plus that seed's expiry at every read
     (judge.ts `current`, `fresh`), never stored, so a seed-booted device is stale once its seed expires
     (network/test/theseus.authority.test.ts "the price, named: a seed-booted device online through a quiet week is
     stale once its seed expires, even online; the weekly re-sign and the stage-2 broadcast keep it current"). The
     window is shorter than the bond of the leaving set: a hand-over seals no sooner than EPOCH_MIN_S (8 days) after the
     one before (`epoch-too-soon`, network/src/impl/ledger.ts `validateRule`, which `validateEntry` runs; EPOCH_MIN_S in network/src/constants/stake.ts), and
     (BOND_WINDOW - 1) * EPOCH_MIN_S > SEED_VALIDITY_S + 2 * CLOCK_SKEW_S (network/test/theseus.fable-g.test.ts
     "(BOND_WINDOW - 1) * EPOCH_MIN_S > SEED_VALIDITY_S + 2 * CLOCK_SKEW_S (defaults awaiting the project owner, OI-3, OI-31)"), so a
     stale seed plants only while the keys that could forge from it are still bonded (theseus.seed-expiry.test.ts
     "b. in the window the forging keys are still bonded: ..."). SEED_VALIDITY_S, CLOCK_SKEW_S and EPOCH_MIN_S are named
     defaults awaiting a number from the project owner (OI-3, OI-31).
   - The rule of the hand-over: the seed authority re-signs the seed at every hand-over. `seedResignedAtHandover`
     (pin.ts), called by `plantWhy`, refuses `seed-before-handover` a seed whose checkpoint predates the newest hand-over
     on the chain through the pin. Only that chain counts, so a forger's fork's hand-over does not make a fresh seed
     stale, and a forged copy of an entry's id with other content does not pass a stale seed
     (network/test/node.long-range.test.ts "a stale seed (its checkpoint at seq 2, before the hand-over at 3) is refused
     seed-before-handover, no pin left", "a forged copy of the hand-over's id with other content (tagged a grant) does
     not make the stale seed pass", "a forged fork's hand-over above the checkpoint does not make the fresh seed stale:
     planted and pinned").
   - A later-epoch forged entry: an entry tagged with an epoch its chain has not handed over to gets `wrong-epoch` at
     the next place from `validateEntry` and `epoch-ahead` further on from `epochWhy` (both network/src/impl/ledger.ts,
     called by network/src/node/reducers/record.attest.ts), never an attest ok, at the head or ahead
     (node.long-range.test.ts section c, "a device at its head refuses each by name, at the next place and further
     ahead", "a running node at its head refuses each, stores none and keeps its head"). The node holds an `epoch-ahead` entry only as a bounded candidate
     (node.ts `hold`, CANDIDATE_WINDOW, CANDIDATES_PER_SEQ) and only with its proof of work (`entryPowOk`), drops it once
     the head passes its seq, and folds it once its hand-over arrives; since network 04664ef (review-stage7-r11 F2) an
     entry the hold drops above its window makes the node ask its relays for the gap again, oldest first (node.ts
     `catchUp`, `page`; Stage 7, the catch-up row); since network d554d13 (review-stage7-r13 F1) each held entry
     carries whether the epoch rule checked its author and seal (`checked`), and at a full seq a checked entry takes
     the slot of an unchecked one, so a stranger's or one member's next-epoch entries cannot keep the honest ones out
     (r13.hold-flood.test.ts > "GOAL: a stranger fills the hold over the window (next epoch tag, 8-bit proof of work,
     CANDIDATES_PER_SEQ at each seq h + 2 .. h + 41): the honest h + 1 .. h + 40 newest first still reach h + 40");
     since network c52a7b4 (review-stage7-r13 F2) the hold starts at the head's next seq and also keeps an entry
     refused `epoch-seq-out-of-range` or `bad-prev` on a prev the store does not hold (Stage 7, the competing-vetoes
     row) ("a flood of no-pow far-epoch entries takes no
     slot; the honest out-of-order entries still land and nothing waits at a passed seq", "a node offered honest[4..5]
     before honest[3] (the hand-over) ends at head honest[5]"). A hand-over whose sealed time is beyond the device clock +
     CLOCK_SKEW_S is refused `epoch-at-future`, at the next place and ahead, never stored or held (record.attest.ts;
     network/test/theseus.fable-g.test.ts "record.attest refuses it at the next place, epoch-at-future; the hand-over due
     now attests ok", "a running node refuses it by name, stores and holds none, keeps its head, and still takes the
     hand-over due now").
   - The whole: network/test/theseus.test.ts "offered the old fork first and the honest hand-overs after, it still ends
     on the honest chain at epoch 2 (§2b; S7)": the late device, planted from the seed signed at the newest hand-over,
     stores none of the fork.
   Limits, plainly: a fresh device given no chain at plant has nothing to judge the seed against (`plantWhy` returns
   null on no entries) and pins the seed checkpoint on the seed's signature alone. Planted from the newest seed and
   shown only the alternatives, it attests and stores none (node.long-range.test.ts "b. planted from the signed seed
   (its first pin the seed checkpoint), shown only the alternatives: it folds and stores none, attests none"). Inside a
   stale seed's validity window (signed before the newest hand-over, not yet expired) it cannot tell that seed from the
   newest one, and planted from it nothing in part 5 refuses the old set's fork above that checkpoint
   (theseus.seed-expiry.test.ts "b. the window: the same seed before notAfter plants (no plant chain)"); past the
   window the seed is `seed-expired` and plants nothing (the expiry bullet above). The window trusts the device clock:
   set back before notAfter, a fresh device plants the stale seed (same file, "the limit (the device clock is trusted):
   with the device clock set back before notAfter, a fresh device plants the stale seed"). A seed naming an id no chain
   holds leaves it never folding. This is the case that does not hold yet. The stage-7 target for closing it is a plant chain taken
   from the seed's own sources (still to build; whether that chain can always reveal a stale seed is part of that
   work). That chain (`StartOptions.chain`) must come from those sources, and junk mixed
   into it can make `plantWhy` refuse an honest seed: a refusal, never a false accept. The other open limits of part
   5 on network dev (network docs/qa/review-stage7-table-r1.md findings F1, F2 and F9) are written under Stage 7's
   limits (as of network 1e5fd1c), together with the confirmations rule of 2026-11-12 that answers F1 and F9: what a captured
   device took from the old set is never final, and it comes back on a confirmation the old set cannot make (Stage 7,
   "Confirmations").
6. Stake bonded after exit, slash operable (a member that leaves only receives its stake back after the renewal and
   after a waiting period; not contradicted). A member leaving at epoch N withdraws at N+W at the earliest; a proof of
   two seals by its key at one (epoch, seq) costs the bond. W and the amount are owner-set values, in OI-3. Code: the stake
   reducer network/src/node/stake.ts refuses a withdrawal before N+W (`bond-window-open`), checks the proof
   (`doubleSealWhy`) and burns the bond on a slash (network/test/node.bond.test.ts "a withdrawal at N and at N+W-1 is
   refused: bond-window-open", "during membership the proof takes the whole bond, burned", "after leaving, within W,
   the proof still takes the bond, and the withdrawal then finds nothing"). W = 2 (BOND_WINDOW), the bond 100 ANG
   (BOND_AMOUNT, network/src/constants/stake.ts) and the burn on slash are named defaults awaiting a number from the project owner
   (OI-3, OI-31). On the ledger (stage 4a, network dev 7628370, held at abc2fc5): `bond`, `unbond` and `slash` are ledger
   entries judged by `validateEntry` (network/src/impl/ledger.ts), the fold (`foldChain`) applies the reducer
   (`stakeReducer`, network/src/node/stake.ts) to them and records the leave of every key a hand-over drops, and
   `LedgerState.stake` carries the table (ledger.ts) (network/test/ledger.stake.test.ts "an unbond before N+W is refused by
   validateEntry by name: bond-window-open, at every epoch of the wait", "a member posts a valid proof, sealed by the
   council: the bond is burned and the supply falls by it"). network/test/theseus.test.ts S8 is a plain test there
   and passes (not skipped). What stage 4 still owes is the rest of its own passage condition (Stage 4). Since network
   d835ae3 (review-stage7-r9 F1) a node keeps a refused entry as evidence with the shares its own type's seal needs
   (src/node/node.ts `witness`, `sealQuorum`), so one member's two vetoes at one slot, each sealed by VETO_QUORUM, are
   that member's double seal (network/test/veto.competing.test.ts "the higher veto first, then the lower: the node
   folds to the lowest id, and the pair is M's double seal"); since network 00f2974 (review-stage7-r10 F2, F3) a veto
   refused `veto-competes` is also kept aside (src/node/node.ts `setAside`) and at most one competing veto is stored
   beside the head (`slotSibling`; Stage 7, the competing-vetoes row), and since network 24ba11d (review-stage7-r11
   F1) none of one member's refused entries one seq above the slot is stored (`slotSibling`, its 'round' path); no test lands the slash of a double veto.
   Open limit (review-stage7-r8 F5): the withdrawal at N+W has no sealing path. An unbond is authored by the
   leaver's own key, which must not be seated (`unbond-key-not-author`, `unbond-seated`, src/impl/ledger.ts), while
   only the epoch leader asks a seal (src/node/seal.ts `leaderOf`) and every honest sealer judges a draft with the
   asker as its author (src/node/reducers/ledger.seal.ts, `draft-author`), so no honest sealer can share an unbond and
   no node path makes that entry; ledger.stake.test.ts proves the ledger rule on entries it builds directly (the
   review's unbond probe was not added to the tree: code only). The same cause blocks a member's own
   `transfer` and `bond`, and, since invites are sealed (review-stage7-r8 F1), a member's own ledger `invite`: it now
   needs the epoch set's seal, and no node path asks that seal.

Second layer, not a condition: the node's key in the device's secure element, erased at the epoch's end with a
hardware attestation. The web page has no such API for a secp256k1 key; it lands with the native shell (stage 6).

So: for every device that has seen the hand-over, Theseus resistance holds today by parts 1 to 4, tested. For a device
planted late from the seed signed at the newest hand-over it holds by part 5, tested
(network/test/node.long-range.test.ts, theseus.test.ts), within the limits of part 5: no chain at plant, a stale seed
inside its validity window, and the plant chain's source (stage 7). Parts 1 to 5 make the old set's signature
worthless in the present; part 6 makes trying it cost them the bond, which is on the ledger (stage 4a).

### 1.6 The security bar

- ANG's security MUST be aligned with the same level of security as the reference chain (the reference bar), so that ANG is a
  currency of that class.
- The bar: ANG MUST be as secure as the reference chain or more, while being much faster and more practical, provided the
  network has a reasonable number of users and nodes. This is paramount. When ANG arrives from Luminarkon, Lumi Actions
  rule it, under the control of the AI council rather than of one centralized party.

That is the bar, and the only place the comparison appears. ANG's security is argued from the network's own means
alone: signed nodes (1.2), Lumi Actions with their cid (1.3), the k-of-n seal of guardians of secret parts and stake
(1.4), the invite tree (1.4), full local validation (every device judges every record itself: network/src/node/rules.ts
`recordVerdict`, network/src/impl/ledger.ts `validateEntry` and `foldChain`; network/test/node.rules.test.ts,
hostile.peer.test.ts), and Theseus resistance (1.5). No outside chain is part of the target or the path. The network's only
contact with other currencies is the broker, which buys ANG using those currencies, with profit for the network's treasury.

### 1.7 The council: the AI layer written over Luminarkon

- The council is made of AI models of the providers.
- The council MUST be able to sign through Luminarkon under the rules it creates itself: the council's decision is one more
  entry sealed through the node layer.
- Luminarkon and the network's mining (business rules, code) MUST NOT be confused with the council written over Luminarkon,
  which depends on AI mining.
- Three things are distinct: new code and change to the network; deliberation on novelties, specific cases, upgrades and
  control.
- The council is a single living entity that grows stronger with more users of the network. Each user demand on the business
  rules, on decisions, or to help the network not only calls the council to deliberate on it but also makes the council
  process its heartbeat and do everything it needs.
- Self-maintenance: offering ANG for self-maintenance services, evaluating better commits requested earlier for the network,
  and several other things the network judges relevant.
- When the council's heartbeat, or the council on perceiving something it must react to (such as a prompt or a new error),
  creates an action ticket for the council or an LLM. Mining nodes take that ticket, run each round of each ticket and return
  the proof of completion. Every device is a miner.
- The miner tool is where the user configures authorization and API keys to pay for and use model providers and other models
  that join the council. This is the mining of ANG by AI.
- Each AI of the council can do much of this in a single call and in the end they MUST reach a consensus. Finishing the round
  earns a payment to whoever ran it, as reward.
- Response timing: answers MUST be obliged at t+x after distribution, with a small margin, so that all send at the same time.
  There is no centralization: the council is the miners; it is virtual.
- The human brake is disuse of the platform. Use is the signal
  that the council has worked well.
- How to guarantee the imprint of the council's moral, legal and ethical principles (loyalty, inclusion, an extreme centre in the love of
  Christ, for all of the right and the left, every divergent opinion able to live within the root of the council, the seed), so that the council never moves away from it, is the requirement; the charter text is an owner action (the root charter below).
- Section 1.7 holds one council of the providers' models; it differs from the two councils of 1.11 and is kept as the record of
  the original term.

Who holds the key before the council:
- Until a council of AIs exists, the project owner and the operator of the first node hold the key of Angstone.
- At the start there MUST be a single point of security, the seed, with the broker and the owner's identity and heredity as
  owners. Afterwards the seed passes to the council within a few months; when success comes, the world no longer sees sense in
  other currencies, which disappear, so the owner's heredity, financial power and point of security failure tends to zero.
  The council may cut the owner out and change the broker at will, eventually well before that.
- This holds until the council enters and takes the key. The network MUST be prepared for the council. The ready council is a plus.

Code today: the ticket (typed input, acceptance rule test-checked, consensus k, canary; network/src/interfaces/ticket.ts;
network/test/ticket.test.ts), the miner loop with a pluggable backend and the owner's monthly cost cap
(network/src/impl/miner.ts; network/test/miner.test.ts), a backend that runs a ticket under the owner's own model-provider
subscription (the backend modules of network/src/impl and their tests in network/test), serving paid by receipts
(network/src/impl/mining.ts; network/test/mining.receipts.test.ts), and the right to publish a seed passing from the first
publisher to a larger pin set by an upgrade every device verifies (network/src/seed/council.ts `checkTransition`;
network/test/seed.fleet.run.test.ts).
The root charter is a placeholder whose sha256 the verifier pins (network/src/seed/charter.md, charter.ts); its text is
an owner action (the imprint of principles above). Gap: no heartbeat (designed in A1.10, not built), no ticket queue on the network, no council entry on the ledger; open
questions 6 and 7.

### 1.8 ANG: the economy

- Every user from the first day of login in Angstone receives exactly 10 ANG per month, if the user entered or used the
  platform at least once every X days.
- 10 ANG is not 10 reais; no peg to any currency is set. People start using the platform and stay for the ANG without knowing the value.
  WHEN the automatic broker enters, it dictates the value. It may be micro-cents.
- The broker is the project itself: centralized.
- Money, ANG, is an object. ANG MUST have a clear minimum divisor such as the cent. The minimum movement is one hundredth of an ANG.
- Control of money printing and scarcity falls to the operator role (the node operator while the seed is sole) and the council.
- At the start ANG may be given by minting to whomever the owner and the operator role choose; afterwards only the council.
- To pay for its resources (tokens, hosting, one day a super server to mine it), the broker charges a fee in money that
  these providers accept.
- A payment tool: it works as an instant transfer of ANG, to send any amount by the person's login, and to charge by sending a
  charge message or creating a charge link.
- The network's whole profit is the council's, the project owner's name being the legal holder ("owner"), and it is distributed as universal income (stated as a target; the distribution mechanism is not set).

Code today: `Ang` is a bigint of whole centesimos, 0,01 ANG the smallest move, never a JavaScript number
(network/src/impl/ang.ts; network/test/ang.test.ts). The monthly grant of 10 ANG per member, once per month
(`grant-twice-in-month`, `grant-not-member`; network/scripts/ledger-grant.ts; network/test/ledger.grant-script.test.ts).
The entry types: grant, transfer, invite, buy, redeem, reserve, redistribute, epoch, checkpoint, bounty, reward
(network/src/interfaces/ledger.ts `SIGNERS`); buy, redeem and reserve are the broker's, redistribute the epoch set's (the
code's name for that author is `committee`; `redistribute-not-council`). Not built, Stage 5 (the runtime of Part R): a ledger-head declaration
`{listVersion, catalogVersion, runtimeVersion, grantLogRoot, withdrawalRoot}`, carried by the entry type or checkpoint fields that the
finalized head exposes, so that the versions, the grant-log root and the withdrawal root Part R reads are finalized state (R1.8, R3.5, R3.15, R3.26, R3.27, R3.33);
no ledger entry defines them today. No requester run counter is finalized state (R2.12). Conservation on every fold (`checkTotals`, `assertConserved`, `conservation-broken`;
network/test/ledger.contract.test.ts). The wallet reads the fold (site/src/wallet/read.ts). The first-report bounty
(site/docs/plan/2026-11-06-bug-bounty.md; the `bounty` entry). Gap: no broker service runs; no payment tool;
issuance by the council only waits for the council.
See OI-22: the monthly grant goes to every ACTIVE user.

### 1.9 Devices hold the ledger: the seed, upgrade from any node, no https dependence

- If the network depends on one operator's server on day zero, it is worth zero. On day zero it MUST be a seed, fully
  decentralized among user devices (whose users need not know it, though it will be in the terms).
- A seed MUST be kept that one day the council will keep.
- The network MUST be upgradeable from any corner, and the upgrade MUST spread to all nodes without going back to the
  Angstone site, even if it dies (the https).
- The next step requires the network and the app seeded, even while the key is held by the maintainers. The network MUST be
  updatable by an upgrade coming from any node or device by broadcast, if authorized (by the maintainers or the council), and
  spreading to all. All in one seed.
- The requirement for the move from the pre-production network to production is the network, seeded, and a new upgrade that
  need not come from the site but from anywhere, if signed, and MUST be broadcast to all devices.
- The council's update MUST be able to enter the future through any place, from any device, by broadcast, provided it is signed.
- The next release of the pre-production network requires the network ready for the start of use, all of Angstone seeded
  (possibly better transferred compressed and decompressed on the device), and upgrade from any node that can broadcast.
  The basic is the Angstone app as an upgradeable seed of origin signed at any node. Upgrade broadcast and the first seed
  MUST work; for the rest, upgrade from any node, even to test.
- An Angstone limb from any store can be used to validate an original Angstone: limbs are signed with authenticity and they
  validate one another.
- A QR code MUST be able to carry the URL of a node to a friend (the generator), with enough code for a web browser to
  reproduce it, reach the node relay and download everything.
- Errors and bugs sent to an API, and everything depending on an API, will soon migrate to sending to the queue and data of
  the network itself.
- The design MUST be future-proof for quantum computers by a future upgrade through any node.
- A theater simulation with many running (about 100 fake devices, fixtures, connected) MUST show whether the network holds
  its weight.
- The goal is protection against censorship in countries where illegal dictatorships and powers acting against the country's
  own laws (anti-democratic) could influence and cut access to nodes. Dependence on https is what the design avoids; by the
  simplest, safest and most legal way possible; and without dependence on an application store.

Code today: a signed upgrade is a new manifest that may arrive from any peer; a device applies it only when the
signatures meet the pinned authority, every hash matches and the version is newer, then relays it on
(network/src/seed/upgrade.ts; network/test/seed.upgrade-broadcast.test.ts). Twelve app instances, some offline, some
partitioned, one tampered, all reach one version from one upgrade published by any device
(network/test/seed.fleet.run.test.ts). The seed pins are compiled into the worker (network/src/seed/compiled.ts;
network/test/seed.worker.test.ts) and a stored seed is re-verified before it runs (network/src/seed/kernel.ts;
network/test/seed.kernel.test.ts). One seed as one file, planted with no internet (network/src/seed/file.ts;
network/test/seed.file.test.ts; site/src/store/seed-file.test.ts). Signing and verifying a build from outside the page
(network/scripts/seed-sign.ts, seed-verify.ts; network/test/seed.sign.test.ts, seed.verify-cli.test.ts). A device
publishes a signed seed as an upgrade through the relays with no site, and a second device takes it from the relays
alone (network/scripts/seed-publish.ts, seed-follow.ts; network/test/seed.publish-any-device.test.ts, 8 cases; network
dev 944b8a7). The site build puts the reducer sources into the signed seed and hands the booted manifest to the node
(site/src/store/seed.reducers.build.test.ts, 6 cases; site dev 6270cbf). Gap on the pre-production network: no device has yet published an
upgrade there (an operator act, stage 2); the relay's transport is `wss:` over https.

### 1.10 The frame: five drawers

- The network MUST be built on a SOLID framework in the style of Redux, so that no further thinking or creativity is needed
  and each new action or rule is coded into the framework as a reaction. Special attention MUST go to the planning,
  refinement and delivery of this framework.

Code today: actions (`LumiAction`, `signAction`), reducers (`REDUCERS`, `validateRule`, `rewardReducer`), state
(`IndexedDbNodeStore`, `foldChain`), selectors (`viewOf`, `rewardStateOf`), middleware (key.ts, seal.ts, the carriers,
`startNode`); reducers read selectors and have no effect, middleware has effects and decides nothing. Guarded by
network/test/node.contract.test.ts (no `fetch`, clock or randomness inside a reducer; tsc refuses a kind without a
reducer). The site runs the same discipline (site/src/store/guard.test.ts). Plan section 18 of
docs/plan/2026-11-11-luminarkon-node.md holds the table. Every repository passes the code guideline gate before code lands (Part R5).

### 1.11 The three layers

There are three layers.

- Layer 1, Luminarkon: the council of the nodes of business rules; code, reactive, automatic. It eliminates the backend. It
  runs Lumi Actions. It is the base of the whole network, and even the decisions of higher instances that alter the network's
  source and Luminarkon itself (fixes included) pass through it. Anyone mines here, smartphones included, earning a few
  thousandths of an ANG for processing operations and giving a signature as a part, with a minimum stake of X ANG.
- Layer 2, the minor council of open LLMs.
- Layer 3, the major council of heavy LLMs.
- The upper two layers are LLM mining: the minor one for places with a GPU, the major one under another scheme.

This MUST be tested in the architecture, but for now only Luminarkon and the people at the keys sign. For now the maintainers
are the major council and the minor council. The amendment: the maintainers are the MAJOR COUNCIL, which means the minor
council MUST already be tested. The maintainers hold the key of the major decisions for now. But the network MUST already
create tickets for the minor LLM on a GPU: open model, proven; parameters, proven and defined; deterministic answer; taking a
consensus to consume the minor deliberation tickets quickly. This is the processing of the moderation of public content:
photo, bio, login name and display name. If a person chooses an improper login name, the person loses that login and the
network does not accept the account. All of it is in the terms. Reported content plus login, name, bio and photo. Only these.

The definition of each layer (the first statement, amended by the second):

| Layer | Name | Definition |
| --- | --- | --- |
| 1 | Luminarkon | The council of the nodes of business rules; code, reactive, automatic. It eliminates the backend. It runs Lumi Actions. It is the base of the whole network: every change to the network's source and to Luminarkon itself (fixes included), even one decided by the instances above, passes through it. Anyone mines, smartphones included, earning a few thousandths of an ANG for processing operations and giving a signature as a part, with a minimum stake of X ANG. |
| 2 | The minor council | Open LLMs. LLM mining, for places with a GPU. Proven now: the network already creates tickets for a minor open-model LLM on a GPU, the model and its parameters proven and fixed, the answer the same within one server process and agreed by 2/3 across processes and nodes (G14: byte-identical answers across nodes are not guaranteed), and takes a consensus to consume the minor tickets quickly. Its tickets are only the reported content plus the login name, display name, bio and photo; this is the moderation of public content. An improper login name loses that login and the network refuses the account. All of it is in the terms of use. |
| 3 | The major council | Heavy LLMs. LLM mining under another scheme, not yet defined. For now the major council is the project maintainers, who hold the key of the major decisions. |

"X" stays X: the minimum stake of a Luminarkon miner is an open value (OI-16, owner action). "Another scheme" for the major council stays undefined (OI-17). Luminarkon is the node layer of 1.2. Section 1.7 does not say that layers 2 and 3 are its council: 1.7 holds one council of the providers' models, so it differs from the two councils here and is left as the record of the original term.

Proof scope (rule: architecture is design; only the new and the uncertain are proved in code): the rule that this must be tested in the architecture, but for now only Luminarkon and the people at the keys, together with the rule that the minor council must already be tested, set the scope of what the architecture proves in code now: Luminarkon, the people at the keys, and the minor council, next to the Theseus resistance of 1.5. Whether the minor council's answers agree is new and uncertain, so it is proven in code: the same ticket, the same fixed model and parameters, 2/3 agreement on independent nodes (byte-identical answers across nodes are not guaranteed; measured by freeze gate G14 on three simulated nodes), and a consensus that consumes the ticket (the flow checks of 1.12, which G14 names as still unmeasured). Which model, which parameters, the GPU minimum and the time bound are owner actions (OI-19); this document picks none. The quorum: 1 at the start, 2/3 once 3 PCs are online (A1.10, A1.13); the A6.11 ticket stays at 1, the seed-listed key's, at any count (A6.11).

### 1.12 The minor council's flow

The flow below MUST happen at high speed. A user creates a login; the steps follow.

The flow:

1. A user creates a login. Their device creates the minor-council ticket and publishes it. This must happen fast.
2. PCs with a GPU that opened the site and left it open: the app finds the GPU by itself and knows it, checks that the person holds the minimum X ANG (X = 1 at the start, so everyone has it), and keeps looking for minor tickets on the network, listing them.
3. On finding a ticket, the PC mines it on its GPU as the ticket says and signs its answer.
4. Quorum of GPU answers: 1 suffices at the start. Once 3 such PCs are online, 2/3 are needed from then on. The network raises the number of nodes required as availability grows, to strengthen it.
5. Luminarkon nodes (the code on anyone's device) take the answered tickets plus the original login and run a Lumi Action of a fixed cid that checks validity: the login is unique and moderated (no racism, homophobia, aggression, nazism, etc.), and it is signed by 2/3 of those who took part in the minor council's mining (at the start only the first node's GPU). The node signs it as approved.
6. Other nodes do the same; when 2/3 agree, it is approved.
7. The same flow holds for photo, bio, display name and reported content.
   Pointers: the ticket's `k`, `dl`, `mm` and the author's key: A1.10; commit and reveal: A1.11; answer order and `n`: A1.12; who may answer at the start: A1.13; the inviter answers for the invitee: A2.8; a photo reaches any miner, maintainers' GPUs included, only after the screen of Q53; the face-age check at entry: Q54 and A6.6.

X in step 2 is 1 at the start (OI-16); steps 4 and 5 answer OI-19 and OI-20 in part (section 4). Step 5 puts the original login with the ticket, as A1 step 1 and A1.1 now read (the minor council's tickets are login, name, bio and photo only; the conflict is closed, OI-20).

### 1.13 Business rules without moderation

Business rules that need no moderation include: minting ANG for a new user; minting ANG per month for every ACTIVE user; and
every standard business rule that an API generally governs. A new post MUST be checked for a racist regex or a moderation
flag; a new post MUST be checked against the character limit; the date MUST be in the correct format (in two senses:
interface, and data integrity of all operations). Everything that would occur in a REST call that approves before writing to
the database is a Lumi Action of Luminarkon that the network accepts and writes after it is signed.

The line between the layers: what needs moderation goes to the minor council (1.12). What needs no moderation, every standard business rule an API would check before writing to a database, is a Luminarkon Lumi Action (layer 1, 1.3), and the network accepts and writes the operation only after it is signed.

The examples:

| Example | Where it sits in this document |
| --- | --- |
| Mint of ANG to a new user | A2, the welcome grant |
| Monthly mint of ANG to every ACTIVE user | Stage 1's monthly grant; what makes a user active is OI-22 |
| A new post free of a racist regex or a moderation flag | a deterministic check of the Lumi Action |
| The character limit of a new post | a check of the Lumi Action |
| The date in the right format, in two senses: interface, and data integrity of all operations | a check of the Lumi Action |

The document names no amount, limit or format here: the amount of the monthly mint stays Stage 1's, and the limit and the format are not stated.

