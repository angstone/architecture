**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Stage 7b: legitimacy and two finality tiers (next after Stage 7; not built)

What it is: the legitimacy principle applied to finality. Ideally the threshold would be 50% + 1 of the seats; 2/3 is used because it is what can be achieved in practice, honestly. Once 2/3 is fixed it must never be assumed that more than 1/3 of the world's devices are rebels: if that happens, it is in principle legitimate for them to bring the network down, and it makes no sense to fight legitimacy. Whether 50% + 1 is practical is the first of this stage's open questions below.

The legitimacy principle, in words: the thresholds defend against fraud (sybil keys, an old set or retired council
that tries to act after its hand-over, the coercion of a few named members), never against a real legitimate
majority. If a real majority of the network leaves or turns against it, the design does not fight that majority.
The thresholds count council seats, not the world's devices: a threshold of 2/3 is 2/3 of the seats of the epoch set,
never a claim about how many devices in the world are honest. A device's legitimacy enters through the invite tree and
its stake (1.4, stage 4), which decide who may hold a seat.

Two finality tiers, proposed for this stage, not built and not decided:
- Today (Stage 7): a seal needs t of the epoch's n seats with 2t > n, a strict majority (src/impl/ledger.ts
  `sealed`; a 3-of-5 key is valid), with two exceptions (review-stage7-r8 F6): a veto is sealed by VETO_QUORUM =
  max(1, n - t), a minority (the veto exception of R4.4: it confirms nothing), one key of a 2-of-3 set (src/impl/ledger.ts `sealQuorum`), and a key seated by an untimed
  legacy hand-over may have 2t <= n (`sealed`, the `legacyKey` mark), so two disjoint halves of it can seal two
  branches at one seq (ledger.quorum-bond.test.ts > "two disjoint halves of a 2-of-4 key seal two branches at one seq
  (shown on an untimed legacy chain); the timed hand-over that would create that key is refused:
  epoch-quorum-invalid"). An entry reads final only on an authority checkpoint or a successor seal at the full
  threshold (Stage 7, Confirmations), never on a count of seats, and the veto's minority seal confirms nothing. Since
  network d835ae3 (review-stage7-r9 F1) one member's two minority-sealed vetoes at one slot fold to one (the lowest
  id, unless a sealed round stands above the other) and are kept as its double seal, so that minority seal no longer
  halts the epoch, and since network 00f2974 (review-stage7-r10 F2) in either order a node takes them (before it a
  node that took the lower first refused the round sealed above the higher `bad-prev`, src/node/node.ts `slotSibling`); two rounds sealed on two different vetoes, which needs that member to double-seal again with an
  honest member on each side, is open (Stage 7, the competing-vetoes row). The tiers below are proposed on the
  strict-majority rule, and must account for both exceptions.
- Fast finality, the proposal: 2/3 of the seats, safe under asynchrony (no bound on message delay).
- Slow finality: 50%+1 of the seats plus a wait of Delta. The same tier decides the way back to the healthy majority
  when the fast tier stalls (fewer than 2/3 of the seats answer).
- Under a partition longer than Delta the network halts or returns by checkpoint; it never runs blind.

Open questions for this stage (each carried to section 4 as an open item when it is not already there): the value of
Delta (Stage 7 names no bound in code; the proposal there is 30 s, one seal round); whether 50%+1 with the wait is the
practical majority rule intended by the legitimacy principle; who measures Delta on a real network, and what a device
does when its own clock says Delta passed but its peers disagree; how the slow tier reads beside the authority's
checkpoint of Stage 7 (T1); and whether a seat count can ever stand for the devices of the world, or the invite tree and
stake stay the only door.

Passage condition (by code):
- network/test/finality.tiers.test.ts exits 0 (to be written: an entry sealed by 2/3 of the seats reads final with
  no delay bound; an entry sealed by 50%+1 reads final only after Delta and only with no conflicting entry at its
  seq; two 50%+1 halves at one seq never both read final).
- network/test/finality.partition.test.ts exits 0 (to be written: under a partition longer than Delta no side reads a
  new entry final; after it heals the device returns to the healthy majority or by the authority's checkpoint).

Code it adds: the slow tier in src/node/confirm.ts and a named DELTA constant (planned).

Code today: none for the tiers; the fast tier is Stage 7's confirmations rule.

