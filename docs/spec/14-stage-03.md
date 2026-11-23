**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 3: 2 of 2, the first member key and the limb desktop or a founding member's phone

What it is: the sealing set becomes 2 of 2, made of the first member's key and either the limb desktop or a founding
member's smartphone logged in as that member. An `epoch` entry sealed by the current set (the first member, 1 of 1) names
epoch 1: two node keys, threshold 2. Proposal: from then on a person key never seals, only node keys do.
The two nodes are node keys drawn on the device (key.ts), never login keys. Proposal: each node announces itself
with a node announcement (kind 31990) carrying a signature of its owner's login key over the node key, so a node is
provably its owner's. The seed pins stay the first member key's one key at this stage (OI-9, decided); the set is 2 of 2
(OI-2, decided); the 2 of 3 the plan recommended (docs/plan/2026-11-11-luminarkon-node.md
4.8) is retired.

Guarantees (threat model):
- No single key seals: `seal-threshold` below 2 (network/test/node.seal.test.ts, node.two-devices.test.ts). After the
  hand-over the old set's seal is refused (network/test/epoch.handover.test.ts).
- Code fact: the ledger's `epoch` rule checks the next key (network/src/impl/ledger.ts, the `epoch` rule in `validateRule`): a hand-over
  whose members are empty, repeated or not keys is refused `epoch-members-invalid`, and a threshold that is not an
  integer in 1..n is refused `epoch-threshold-invalid`; the seal check refuses a threshold below 1 (`sealQuorum`; network dev
  d7f8cb5; network/test/ledger.epoch-validate.test.ts, red 361a46b, green 8ab2a1d). Gap left, said plainly:
  `next.scheme` is not checked at the hand-over, and the seal check accepts only `set-bip340/1` (the seal check's scheme test), so a
  hand-over naming another scheme seals nothing afterwards until the scheme rule is written.
- An honest node signs one digest per (epoch, seq) (`Votes`, seal.ts). With two members, both must agree, so no single
  leader can get two sealed entries at one seq.
- Code fact, said plainly: a 2-of-2 epoch set that loses one key cannot rotate, because an `epoch` entry needs
  `threshold` of the current set (network/src/impl/ledger.ts `epoch` rule). Recovery: the seed pins are one key
  (OI-9), so that key signs a new seed and a new genesis (network/src/seed/council.ts `pinsAuthority`: before any
  council rule applies, the pinned keys alone authorise a seed, threshold 1) and the network is replanted from that
  seed. A lost key at 2 of 2 therefore costs a replant, never the network.
- Limit: a node key on the relay's allow list may write any kind, uncapped, and is not revoked when its owner's invite
  is (the relay's allow list sits outside the invite tree); a stolen device's node key is a free writer until its row
  is removed and the set rotates.

Passage condition (by code):
- Condition, 2 of 2: a seal needs both of the two keys and one alone is refused; after the hand-over the old key
  no longer seals; a hand-over naming a bad set or threshold is refused. Tests exist, each exits 0:
  network/test/node.two-devices.test.ts, node.seal.test.ts, epoch.handover.test.ts, ledger.epoch-validate.test.ts.
- If the proposed node announcement (above) is adopted: network/test/node.announce.test.ts exits 0 (to be
  written: one without a valid owner signature, or bound to another genesis, is refused).
- On alfa: `node /home/ss/automation/projects/personal/angstone/network/scripts/node-verify.ts <epoch entry id> --relay
  wss://alfa.angstone.app/relay --genesis <genesis>` exits 0 and a checkpoint sealed by both exits 0 "sealed by 2 of threshold 2"; the record
  site/docs/qa/<date>-stage-3-handover.md.

The user is told: en "Two devices must agree before anything counts: the first member's and a founding member's." / pt-BR "Dois aparelhos
precisam concordar antes que algo valha: o do primeiro membro e o de um membro fundador."

Code it adds: network/src/node/announce.ts (the proposed node announcement with its owner signature, planned); proposal:
a `kinds` field on the relay's allow rows so a node key writes only node kinds (planned). The seed pins do
not change at this stage (OI-9).

Code today: network/src/node/{key,seal,node}.ts, network/src/impl/ledger.ts (`epoch`, `epochKeyOf`),
network/src/seed/council.ts.

### Legal (Stage 3)

The sealing set grows from one to two. The legal reading of Q27 (a single set is a transitional decision point) is
shortened by this stage: the text of Q27 names Stage 3 and the threshold stage as its end, and the documentation says so
openly. No new requirement; the 2-of-2 key held by the first member and a second device keeps Q26 (no custody of a third party's key).

