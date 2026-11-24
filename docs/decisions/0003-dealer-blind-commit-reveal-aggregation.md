# 0003 Dealer: blind commit-reveal aggregation for time-varying values

Status: proposed, target Merry 5.3. Date: 2026-11-24. Not part of Merry 5.2.1; no normative text of 5.2.1 changes for it, and no R-id is taken. The invention is the project founder's.

## Context
Executors of one Lumi Action (`docs/spec/02-runtime.md`, R1) run the same sealed code on different devices. When the action needs a value that varies slightly in real time (a price quote, a sensor reading, a clock offset), each executor reads a slightly different value at the same moment. The executors must still agree on one witnessed value, and the agreement must be reproducible by anyone later.

Two naive answers fail. If every executor publishes its value openly, the last to publish can copy or bias toward the others. If one node reads the value for all, that node is a single point of trust.

## Proposal
A standard tool of the Luminarkon tool set for Lumi Actions, named `dealer`, built on a broadcast function Luminarkon already has and abstracts so that an action calls it in one line. A dealer is a node that is blind: it never learns a value.

**Phase 1, commit.**
1. Each executor reads its own value `v_i`, encrypts it under a fresh key `k_i` as `Enc(k_i, v_i)`, and calls the dealer with the ciphertext.
2. The dealer holds every call open (a barrier) until the participant set of that run has called.
3. The dealer then answers all held calls at once with one identical list of all ciphertexts, signed by Luminarkon.

**Phase 2, reveal.**
4. Each executor returns to the receiver the signed list together with its own key `k_i`.
5. The receiver, which is signed by Luminarkon, checks the list signature, decrypts every entry for which a key arrived, and computes a deterministic aggregate over the values. That aggregate is the witnessed value.

## Why it works
- **No copying, no last-mover bias.** An executor commits before any other value exists in the clear to it: the list reaches it only after its own ciphertext is inside. Opening later cannot change what was committed.
- **The dealer learns nothing.** It sees only ciphertexts and a count. It cannot steer the result, and a dishonest dealer can at worst fail to answer (liveness, below).
- **Reproducible.** The list and the keys are the whole input. Anyone holding them recomputes the same aggregate with the same deterministic rule.
- **Cheap.** Two round trips, one signed list, no new trust assumption beyond the Luminarkon signature the receiver already has.

## Alternatives
1. **Open publication of each value, then aggregate.** Simplest, one round. Rejected: the last publisher sees all others and can bias or copy; there is no commitment.
2. **A single trusted reader of the value, results copied to all.** One round, no aggregation needed. Rejected: one node is the whole trust base and a single point of failure, against the network's premise that every device is a server and none is trusted alone.
3. **Hash commit then reveal between executors, with no dealer.** Hides values until all committed, with no extra node. Rejected as the base design: every executor must gather every commitment from every other, so the barrier and the agreed set become peer-to-peer coordination with its own failure cases; the dealer centralises only the barrier, holds no secret, and hands out one list, so every executor provably sees the same set.
4. **Chosen: the blind dealer with encrypted commits.** A hash commit in alternative 3 is the same primitive; the dealer replaces the peer-to-peer gathering with one signed, identical list.

## Open questions
Each is a decision still owed; none is answered here.
1. **Participant set and barrier timeout.** Who is the set of a run, how is it fixed before the first call, and after how long does the dealer release the list with the callers it has, or abort.
2. **A missing or wrong key.** An executor that returns no key, or a key that does not decrypt its entry to a valid value: is its entry dropped, does the run refuse, and what is the minimum count of opened entries.
3. **Aggregate rule.** Mean, trimmed mean or median, and the outlier bound. The mean is exposed to one extreme value; the median is robust but coarser. To be chosen per value kind and fixed in the action's seal.
4. **Dealer liveness and rotation.** A dealer that never answers stalls the run. Who may be a dealer, how it is replaced mid-run, and how the choice is made unpredictable so no one picks a dealer in advance.
5. **Replay protection per epoch.** A list from one run must not be accepted for another: bind each list and each ciphertext to the run id, the action cid and the epoch.

## Proposed requirement text
PROPOSED. Not normative. No R-id is taken; the number is assigned only when the text enters `docs/spec` at the next version with its test.

> **PROPOSED Dealer tool.** Luminarkon MUST provide the tool `dealer` to Lumi Actions: an executor submits `Enc(k, v)` of a time-varying value to a dealer, the dealer MUST answer every participant with the identical signed list of all submitted ciphertexts only after the participant set has submitted, and the receiver MUST compute the witnessed value as the deterministic aggregate of the entries decrypted with the keys the executors return with the list.
> Test: `dealer-commit-reveal-agrees` (pending, not written).
> Enforced at: Luminarkon runtime, tool set for Lumi Actions (pending).

## Decision
Proposed: the blind dealer. To be written into the spec at Merry 5.3 with its test once the open questions are answered; until then nothing here binds a build or a release.
