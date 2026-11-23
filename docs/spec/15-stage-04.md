**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Stage 4: growth by stake, seats, permissionless nodes, the reward live

What it is: the set then grows automatically as powerful hardware nodes enter with their total ANG as stake; the larger
the stake, the greater the chance of a seat; to hold that stake a node must buy ANG from others. The network is
PERMISSIONLESS: anyone may run a node without security risk, and a node that contributes receives ANG for normal
processing. A device's stake is the ANG balance of the account signed in on it,
read from the fold (the devices holding the most count). Any device may offer itself as a node (by the proposed node announcement of
stage 3). How a seat is drawn from the stakes is OI-14, which gives three alternatives; the
proposal is a deterministic function of the stake table and a public seed that every node recomputes, so an
`epoch` entry naming other seats is refused. Whether a seat also needs an invite is OI-4; the stage does not
assume an answer. The reward per sealed verdict is
credited, by proposal, to the account its owner signed in with (a node key itself never moves money). The
broker goes live so ANG can be bought (`buy`, `redeem`, `reserve`
entries exist). What a proven fraud costs a staked node is OI-3; its name and amount are not yet fixed.

Guarantees (threat model):
- A seat costs ANG at stake, which a forger cannot print (the larger the stake, the greater the chance of a seat); and,
  if OI-4 is answered "both", an invite from a member who answers for it. Under the proposed
  draw, seats are not claimed, they are computed, and every node checks the computation.
- Minting is bounded: a `reward` is refused unless its verdict is on chain, pays once, pays exactly the sealers, and
  its amount is the verifier's own (`reward-not-owed`, `reward-mismatch`; network/test/node.reward.test.ts).
- Issuance does not grow with traffic: today the reward per sealer is base*load/nodes with load the count
  of unrewarded paying entries (network src/node/reward.ts, `load: s.unrewarded.size`) and every `transfer` pays
  (src/impl/ledger.ts, `PAYING`), so self-transfers
  would inflate supply. The requirement: each checkpoint has a fixed issuance budget `ISSUE_PER_CHECKPOINT`, its value awaiting
  an owner value, split among the sealers of its paying verdicts; a checkpoint's rewards together never exceed it, whatever the load.
  A test fails if 1000 self-transfers in one checkpoint raise its total reward above the budget. Until built, the code
  contradicts this requirement.
- Said plainly: a proven double seal burns the bond in code (network c1e93c5); how much falls, W, and whether the whole stake falls are defaults awaiting a number (OI-3, OI-31).

Passage condition (by code):
- network/test/node.stake.test.ts exits 0 (to be written: two folds of one chain give one stake table; an account's
  two node keys count one balance).
- network/test/node.seats.test.ts exits 0 (to be written against the draw chosen in OI-14: a higher stake
  gives a higher chance of a seat; zero stake never; an `epoch` entry whose seats break the chosen rule is
  refused).
- Council stake on the ledger: network/test/theseus.test.ts "S8 (waits on stage 4: council stake on the ledger): its
  council stake is held on the ledger, locked through the resharing, then releasable (never locked forever)" passes
  (done on network dev 1e5fd1c, stage 4a: a plain test, not skipped; the bond, unbond and slash entries bind the bond
  reducer of 1.5 part 6 to the ledger: network/test/ledger.stake.test.ts > "its stake is held on the ledger, locked
  through the resharing for W epochs, then paid back (never locked forever)"). Its title keeps the words "waits on
  stage 4"; what stage 4 still owes is the rest of this list.
- network/test/node.reward.test.ts and node.reward-run.test.ts exit 0 (exist).
- On alfa: a third node, not one of the two founding nodes, takes a seat by stake; the record names the seats under the chosen
  rule.

The user is told: en "Devices with ANG at stake confirm the network and earn for it." / pt-BR "Aparelhos com ANG em
jogo confirmam a rede e ganham por isso."

Code it adds: network/src/node/stake.ts (the stake table, planned), seats.ts (the chosen draw, planned); proposal: the
`epoch` body gains member rows {node, account} so the fold knows a node's account; the broker service
(planned; the ledger side exists).

Code today: network/src/node/reward.ts, network/src/impl/ledger.ts (`reward`, `buy`, `redeem`, `reserve`),
network/src/impl/ang.ts.

Scale gate at this stage (R4.9, R4.12): the Stage 4 release record asserts (a) to (d) and (h) of R4.6 only, with the double-output clause of (b) excluded, and no Stage 4 record carries (e), (f), (g), the runtime cid, the list version or the runtime-record values digest; the cid, grant-log and plugin behaviours of R4.5 are scheduled only from Stage 5, and at Stage 4 the schedule holds the first four behaviours plus `unknown-cid` (R4.5, R4.12). The Stage 4 record owns the seed beacon of R4.7 (the output of the first round, of the public randomness source pinned in the attester, published after the artifact digest is fixed), one member build artifact digest per shipped target and the `builderKey` of R4.15, and the deploy script refuses a target absent from the record (R4.15, R4.9); Stage 4 MUST NOT ship, deploy or serve while its record is missing, stale or red.

### Legal (Stage 4)

Requirements built here: Q32 stake only of one's own balance, no delegation; Q33 no yield language; Q39 no entry type that
freezes a balance and `redistribute` only for network rule reasons; Q40 the terms say so; Q34 and Q48 the broker, the only
external edge, does not exist as an Angstone service before an authorised partner is named (D15), and when it does, its
checklist exists first. Reward is for attested work (a verdict), never a return on the effort of others (D14). Layers:
Luminarkon (bond, redistribute), site (text), broker. Legal passage condition: checks exit 0 (to be written); the lawyer's
confirmation of D12, D14 and D18 is recorded in `docs/legal/` before any conversion (trigger VALUE).

