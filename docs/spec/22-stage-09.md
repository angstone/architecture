**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Stage 9: quantum future-proofing by a signed upgrade from any node

What it is: the design must be future-proof against quantum attack, by a later upgrade deliverable through any node.
Records carry versions (`v` tags) and `SignatureScheme` is additive (network/src/interfaces/ledger.ts), so a new scheme
can arrive as a signed seed from any node (stage 2). The scheme is an open item: OI-12. Proposed switch rule, whatever
the scheme: an `epoch` entry names the switch epoch, and after it a signature in the old scheme
alone is refused.

Guarantees (threat model), under the proposed switch rule:
- After the switch epoch, a signature in the old scheme alone does not count for a seed, a seal or a key.
- Before the switch epoch nothing changes: the old scheme stays valid, so the upgrade breaks no device.
- Limit: a new scheme may have larger signatures; the records' caps then grow and the vectors say by how much.

Passage condition (by code):
- network/test/seed.scheme-switch.test.ts exits 0 (to be written against the chosen scheme and the proposed
  switch rule: a manifest signed under the chosen scheme verifies; after the switch epoch a manifest signed in the old
  scheme alone is refused `BAD_SIGNATURE`; before it, it verifies).
- network/test/node.scheme-switch.test.ts exits 0 (to be written: a seal at threshold under the chosen scheme
  verifies; an old-scheme share does not count after the switch epoch; the two-device run passes under the chosen
  scheme).

The user is told: en "Signatures are ready for quantum computers." / pt-BR "As assinaturas estão prontas para
computadores quânticos."

Code it adds: the chosen scheme's binding in network/src/impl/ (planned), its entry in the `SignatureScheme` union
(network/src/interfaces/ledger.ts) and in network/src/impl/ledger.ts, the seed signer and verifier
(network/scripts/seed-sign.ts, network/src/seed/verify.ts), the node key's draw under it (network/src/node/key.ts), the switch epoch rule.

Code today: `v` tags on records; the `SignatureScheme` union.

