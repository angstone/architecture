**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## 4. Open items

Each item is a neutral question with its options. Where three alternatives are given, the Occam pick is marked
"proposal"; none is a decision until it is recorded as a ruling. Where an item has no value set, it says "No default is set".
Items already decided or closed are kept with their number and marked so.

1. OI-1. How is a new Lumi Action (cid) admitted and authorised, and how is it charged? Requirements stated so far: admission by
   cid; authorisation by a transferable token (an NFT is the option named); the owner may burn that token to
   guarantee that the signing right now rests in the code; the fee is paid in a token; a signature that fails
   because of a faulty rule is paid for anyway, to prevent flooding. R3.5 (official list signed by t keys) and R3.10
   (grants) answer the admission of a cid; what stays open is authorisation by a transferable token and the fee.
   No default is set.
2. OI-2. Decided (on an owner statement, as read at the time): the ladder after 1 of 1 is 2 of 2 (the initial authority's key and a second device key, a desktop node
   or the project owner's phone); the 2 of 3 was the plan's recommendation (docs/plan/2026-11-11-luminarkon-node.md 4.8), not
   a ruling, and is retired.
   Code fact kept in view: a 2-of-2 set that loses one key cannot rotate (network/src/impl/ledger.ts `epoch` rule).
   Recovery is by the seed pins, which stay one key until the council takes them (OI-9).
   With that key a new seed and a new genesis are signed, and the network is replanted from it. A recorded ruling can
   change this.
3. OI-3. What does a proven fraud cost a staked node, and how many epochs after leaving does a member's stake stay bonded
   (W (`BOND_WINDOW`), part 6 of 1.5)? The choice among (a), (b) and (c), the amount and W (`BOND_WINDOW`) are owner values. No default is set for the choice among (a), (b) and (c); W and the amount are owner values, and the code defaults of OI-31 (`BOND_WINDOW` 2, `BOND_AMOUNT` 100 ANG) are placeholders awaiting that number. Three alternatives for the cost: (a) the node loses a fixed
   share of its stake named in the `epoch` entry's params, retuned by code like the reward (proposal: one reducer,
   the pattern of reward.ts); (b) the node loses its whole stake, used to repay who lost; (c) no loss of stake, the node
   is only removed from the set and the invite tree revokes it.
4. OI-4. "PERMISSIONLESS" beside invite-only access: does the invite gate the account only, while
   running a node stays open to any device, or both? No default is set.
5. OI-5. Decided (on an owner statement, as read at the time), not open: Theseus resistance is the six-part design of 1.5. The secret random element is part 2,
   the checkpoint carried by the signed seed is part 5, and the bond after exit is part 6. Only the
   bond's window W and amount stay open, inside OI-3.
6. OI-6. How is a miner kept from faking a model's answer? The adopted mechanism is the answer forced at t+x
   after distribution for all at once; the remaining mechanisms proposed beside it were not adopted. Is anything else
   required? No default is set.
7. OI-7. Closed top models as council seats through the miners' API keys: how is a seat's model
   version proven? No code answers it. No default is set.
8. OI-8. The carriers that replace https (the requirement is to avoid depending on https, in the simplest, most secure and
   lawful way possible). The named carriers are proposals, not rulings. Three alternatives: (a) relays named by
   address with their key pinned in the seed (trust.json `relays` as {url, pubkey}; a relay whose challenge answer
   does not verify under its pinned key is dropped, test network/test/seed.relay-pin.test.ts to be written), plus a
   direct carrier between nearby devices (a WebRTC data channel in the page, Bluetooth in the shell; test
   network/test/transport.direct.test.ts to be written) (proposal: the `Carrier` interface exists and the seed
   already carries `relays`); (b) a mesh carrier in the native shell only, the web page keeping relays; (c) bridges
   through third-party networks for public records.
9. OI-9. Decided (on an owner statement, as read at the time): the seed pins stay one key until the council takes them. The requirement: at the start there is a single
   point of security, the seed; within a few months the seed passes to the council, and the council's acts are
   authorised by the council. So from stage 3 to stage 7 the epoch
   set seals and the single seed key alone publishes seeds, and a lost epoch key is recovered by a new genesis under that
   seed. At stage 8 the council takes the pins
   by an upgrade signed through the node layer (`checkTransition` exists). Neither the two node keys as pins nor a 2-of-3 pin set is on the
   path. The code's name for the pin set (network/src/seed/council.ts, `councilThreshold`) is left to the maintainers; it
   is not a ruling.
10. OI-10. The seal of many members: three alternatives for how the set grows past 2 (stage 4). (a) `set-bip340/1` as today,
    each member a whole key, `threshold` signatures, one leader asking (proposal: exists and tested); (b) a
    proposer-round protocol so no single member can stall a seq, with threshold
    max(2, ceil(2n/3)) and a rule that a set below `threshold` distinct owners is refused; (c) one group key with
    secret shares (`frost-secp256k1/1`, typed, not implemented), parts that jointly sign the secret, in the strict
    sense. The numbers and classes of (b) are proposals, not rulings.
11. OI-11. (part of OI-10, kept separate because it is a number) The threshold rule for n members of the epoch set. Code fact: the
    ledger's `epoch` rule refuses a hand-over whose threshold is not an integer in 1..n (`epoch-threshold-invalid`)
    or whose members are empty, repeated or not keys (`epoch-members-invalid`) (network/src/impl/ledger.ts `validateRule`; network/test/ledger.epoch-validate.test.ts; network dev d7f8cb5); a timed hand-over with 2t <= n is refused
    `epoch-quorum-invalid` (code fact: the ledger range check accepts 1..n; the quorum rule is Part R), and a legacy one may carry it (any integer in 1..n passes the ledger's range check; the quorum rule refuses 2t <= n for a timed hand-over); within that, the number is an owner value. Gap left: `next.scheme` is not checked at the hand-over. The seed pin set already enforces
    max(2, ceil(2n/3)) (network/src/seed/council.ts `councilThreshold`). Three alternatives: (a) the epoch
    set takes the same rule as the seed pins, max(2, ceil(2n/3)), one number for both sets, except n = 1 (t = 1) (proposal: the function
    exists and is tested; R4.3 states max(2, ceil(2n/3)) as its working value pending this ruling); (b) a strict majority, floor(n/2) + 1, cheaper on liveness, weaker against a split; (c) a
    number set by the council in the `epoch` entry's params within a floor to be named.
12. OI-12. Quantum future-proofing: the scheme. Three alternatives: (a) a hybrid of the current BIP-340 and ML-DSA
    (FIPS 204), both signatures required so a break of either alone changes nothing; applied to the seed manifest
    first, then the seal scheme (`hybrid-bip340-mldsa/1` beside `set-bip340/1`), then node and login keys at their
    next rotation, with ML-KEM (FIPS 203) for the recovery wraps; signatures grow to a few kilobytes (proposal);
    (b) ML-DSA alone after a switch epoch, smaller change, no fallback if ML-DSA is broken; (c) wait for a standard the
    browsers ship natively, no code now. The scheme names are proposals, not rulings.
13. OI-13. The LICENSE (plan section 7; MIT recommended). Owner action; nothing is public before it is chosen (the code is to
    be public from day one). No default is set; nothing is published before it is chosen.
14. OI-14. The seat draw (stage 4): how seats follow stake (the largest stakes have more chance of a seat). Three
    alternatives: (a) a deterministic function of the stake table and a public seed (the last sealed checkpoint's id)
    that every node recomputes, so an `epoch` entry naming other seats is refused (proposal: checkable by every
    node, no new randomness); (b) the n largest stakes take the seats, no chance element, simplest to read, open to
    one rich owner; (c) a lottery each node draws locally and proves with its own signature, which only the drawing
    node can check.
15. OI-15. The relay's rules (stage 5). Today the Python relay (network/relay/ed-relay) holds its own copy of the rules, held
    equal to the node's by one vector file (network/test/node.rules.test.ts, validate.fields.test.ts). Three
    alternatives: (a) a relay in TypeScript that calls the same `recordVerdict`, `entryVerdict` and `REDUCERS` the
    devices run, the Python rules retired (proposal: one code validates everywhere, no vector file to keep
    equal); (b) keep the Python relay and the vector file, every new rule landing with its vector; (c) a relay with no
    rules at all, store-and-forward only, every reader folding and judging for itself.
16. OI-16. The minimum stake X ANG of a Luminarkon miner (1.11: a minimum stake in ANG, X). X is an owner value; the doc names no number. Partly decided (1.12 step 2): X = 1 ANG at the start (`X_DEFAULT`); the later value stays open, and no default is set for it.
17. OI-17. The mining scheme of the major council, layer 3: undefined, and the doc defines none. No default is set.
18. OI-18. Which Luminarkon signature seals the welcome grant (A2): one node's, the node set's quorum, or the epoch set's seal. The doc names no key or quorum; an owner ruling, or the stage-1 design, decides. No default is set.
19. OI-19. The minor council's proof parameters (1.11): which open model, which parameters, the GPU minimum, the consensus quorum and the time bound. None is named, and the doc picks none. The 2/3 quorum of A1 is an earlier rule and is not re-read here as the answer. Partly decided (1.12 step 4): the quorum of GPU answers is 1 at the start, and 2/3 once 3 such PCs are online, the network raising the required count as availability grows. Still open: the open model, its parameters, the GPU minimum and the time bound (`dl`, A1.11). No default is set for the other values.
20. OI-20. Whether a minor-council ticket may carry the login name, display name, bio and photo of the account it judges. Partly decided (1.12 step 5): the ticket carries the original login with the content judged. A1 step 1 and A1.1 carry exactly the login name, display name, bio and photo and nothing else of the author, none of them for a private profile and only their digests in the guardian's authorization ticket of an `authorized` profile (A6.11, A1.1), since a contradiction may not stand. What stays is a pending item, not an open conflict: the lawyer's review of those four fields against LGPD minimisation.
21. OI-21. The rule for an improper login name (the person loses that login and the network refuses the account): what counts as improper, and where the refusal is written in the terms. The doc has no such rule today. No default is set.
22. OI-22. What makes a user ACTIVE for the monthly mint, and whether it replaces or qualifies Stage 1's monthly 10 ANG to every member. No default is set.
23. OI-23. A ticket without 2/3: what happens when no answer reaches 2/3 of the seated nodes (none seen in 200 measured tickets): re-ask, escalate, or reject by default. Measured: 200/200 tickets reached 2/3 among three simulated nodes in round 2 (`7e9ef1fbb`) and in round 3 (`aa9c94a73`), none without; with two verdicts and three nodes a majority always exists, so the case needs a third answer value, an unparseable answer, a timeout or fewer than three seated nodes, none of which was measured. No default is set.
24. OI-24. Decided: until 3 PCs are online only the seed-listed key of the first operator's GPU may answer a ticket (A1.13); the `q=1` risk is closed. Closed.
25. OI-25. Decided: only the direct inviter is banned, the ban does not climb (A2.9; ruling `inviter-liable-in-network-one-third-banned-inviter-banned`). Closed.
26. OI-26. Decided: all invites ever (A2.10), the banned inviter loses inviting and mining, honest invitees stay (A2.11), and the whole balance and stake are burned (A2.13). Closed for those parts. The profile part is closed too, decided: born private, public only when the guardian authorizes with the guardian's own key (A6.8, A6.9); the proof that the key's holder is the guardian stays open (A6.10, G21). Still open in this line: to whom the invitees of a banned inviter are re-parented (the root or the banned key's own inviter; the re-parent itself is required by A2.12). Not yet asked. No default is set.
27. OI-27. Future, outside the current release: the document photo checked by the same means as the face age (on the device, zk, nothing shared) is a later version (only age now; A6.7). No decision is asked now.
28. OI-28. A 16-17 profile born private (A6.8) against a moderation ticket that carries its photo, bio and name to a miner. Two options: (a) the ticket encrypted only to the seated miners; (b) the judgment made at the moment of the guardian's authorization. Option (a) does not close: the draw is sealed after the ticket is written, so the author cannot encrypt to it, and the drawn miners would hold a minor's private data with no LGPD role. Decided: option (b): a private 16-17 profile is judged only when the guardian authorizes making it public; no private data to any miner. Written as A6.11.
29. OI-29. An honest dissent on the minor council. The rule is that a ban for incorrect answers can occur only because miners run malicious code, and that errors are punished in those who disagree; G14 measured that an honest miner on another backend can dissent with no malicious code. A2.8 counts only the `lumi-dissent` slash of A1.15. Question: whether an honest, reproducible dissent may still burn the bond under A1.9. Options: (a) a reproducible dissent takes the strike of A1.8 (paid nothing) and never the slash; (b) it is slashed as A1.9 reads, with S and M raised to absorb the measured drift; (c) one backend fixed in the model manifest, so any dissent is malicious by definition. Decided: for Luminarkon (deterministic code with a cid, where dissent without intent is impossible) a dissent burns the bond; written as A1.15. This does not apply to the councils. For the minor council: a single dissent does not punish; only dissent well above the measured noise (for example more than 10% over 50 tickets) or no answer is punished; 2/3 decides each ticket. Written as A1.9. The numbers are fixed: `M` = 50, `D_MAX` = 10%, `S` = 3.
30. OI-30. A guilty inviter's flight. The `lumi-dissent` slashes of A1.15 are a public view (A2.8 counts only those, never a council strike of A1.8), so an inviter can see its invitees heading to a ban and move its balance before A2.8 fires; only the welcome 1 ANG is locked (A2.14), so the burn of the whole balance and stake (A2.13) takes what is left. A2.15 closes the framing half (only countersigned invitees count). Options: (a) from an invitee's first sealed `lumi-dissent` slash until the inviter's A2.8 outcome, the inviter's balance cannot leave its account, which must first be checked by the lawyer against Q39 (no entry type that freezes a balance, Law 13.810); (b) the burn of A2.13 also reaches what the inviter transferred after that first slash, debited from the receiving accounts; (c) accepted as a residual, the burn takes what is left. Proposal: (a) if the lawyer clears it against Q39 (no entry type freezes a balance, Law 13.810), else (c). No default is set.
31. OI-31. The stake and epoch numbers BOND_WINDOW (2), BOND_AMOUNT (100 ANG), SEED_VALIDITY_S (7 days), EPOCH_MIN_S (8 days) and CLOCK_SKEW_S (600 s) are code defaults awaiting the owner's number (OI-3); VETO_QUORUM = max(1, n - t) is the approved formula, fixed by code (an approved ruling); for `MIN_EPOCH_SPAN` (a seq count, used for the veto slot) and `MAX_EPOCH_SPAN` (days, R3.10) no default is set; `PROPOSE_EVERY_S` (R1.17; a code default of 21,600 s in `constants/seed.ts`) and `MAX_EPOCH_SPAN_SEQS` (R0(c); a code default of 100,000, today named `MAX_EPOCH_SPAN` in `constants/stake.ts`) are protocol constants awaiting the owner's number; council stake is on the ledger (stage 4a).
32. OI-32. The message-delay bound Delta (the round timeout of R4). Proposal (not a default): Delta <= 30 s, one seal round, a working value pending this item; no test measures it; no value is set. R4.7 uses 30 s as its working value.
33. OI-33. The 56 testable legal requirements Q1-Q56 and the decisions D1-D18 are written in the text; no Q has a test yet, and D1-D18 are provisional until a lawyer confirms them. The 40 requirements of the D1-D18 decisions document are each present in this file with their decision id; text done, tests to be written.
34. OI-34. Whether Decree 12.975/2026 stands (it is contested); revisit on a ruling. No default is set.
35. OI-35. Whether the static page, being a transmission, falls under MCI art. 15 as well as the relay (D17). No default is set.
36. OI-36. The capital and classification questions of the broker (D12, D15). No default is set.
37. OI-37. The screening method and the source of the known-hash list of Q53 await the lawyer and an owner action; G16 forbids the first photo ticket until the screen runs.
38. OI-38. Whether the roots also receive the welcome grant (`ROOTS_GRANT`) besides the Stage 1 monthly 10 ANG. No default is set.
39. OI-39. Leader rotation, or a slash ask from a member who is not the leader (Stage 7). No default is set; today there is no leader rotation.
40. OI-40. The value of `MAX_GRANT_EPOCHS`, a `grantEpochs` constant of R0(c) with `MAX_GRANT_EPOCHS × MAX_EPOCH_SPAN ≤ 180` (`MAX_EPOCH_SPAN` in days): epoch length is not fixed by this document. No default is set.
41. OI-41. The value of `FINALITY_WINDOW_S`, the bound within which a revocation reaches every node of the epoch and the window of R3.27; no default is set.
42. OI-42. The value of `LIVENESS_CURE_EPOCHS`, the epochs within which a failed contact liveness check must be cured (R3.26) and the minimum number of epochs a fallback runtime named by a runtime-revocation record stays usable (R1.14); no default is set.
43. OI-43. The values of the runtime-record fields `buckets` (including `tableCap`, `invitedKeysPerRoot` and the two verification shares, and the load-time assertions of R0(c) and R0(e)), `metering.queryCharge`, `metering.nMax`, `metering.supportedDevices` and `consent` as R0(c) lists them (the retention periods of `consent` are fixed by R0(d), not by this item); no default is set; and the gate constant `RELEASE_HOLDERS_MIN` of R4.15 (the least number of release-key holders the record may state), whose default is 5 until set; the price of starving one chosen unstaked key by its floor share (R2.11) is a stated residual of the values of this item, the price and not a decision.
44. OI-44. Whether the role recorded for each executor region in R3.9 and R3.10 (processor, or independent controller) is the right one for the independent node operators, whether relay operators stay controllers of their own storage (reading A of "Who is who"), and whether Brazil is an adequate destination for residents of the European Union: for the lawyer of G13, whose answer is owed before the legal texts leave the provisional state; this document does not decide either. No default is set.

