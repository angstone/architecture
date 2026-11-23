**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Stage 8: the council takes the key

What it is: the council takes control of the key and of the issuance. Until the council enters, the initial seed key
holds the key; within a few months the seed passes to the council; afterwards only the council acts; the council
controls the printing of money and its scarcity. The council as described in 1.7: virtual, the miners are the council;
every device is a miner; the miner tool holds the owner's API keys and authorisation; a heartbeat and tickets; a round
ends in consensus and pays who ran it; answers are forced at t+x for all at once. Proposed for the join: a council
decision becomes an entry the nodes seal, so the council acts through the node layer; the issuance passes to it by such
entries. The seed pin set passes to it by a signed upgrade (`checkTransition`, OI-9). The root charter
(network/src/seed/charter.md) is written first by the project owner (owner action).

Guarantees (threat model):
- Proposed: whatever the council decides becomes valid only through the node layer, as a sealed entry judged by
  every device's own fold. A council answer is a record, a seal is the nodes'.
- A miner's answer is checked by the ticket's acceptance rule. Code today: only test-checked has behaviour; consensus
  of k and canary are typed with their parameters and accepted at posting, nothing more (network/src/interfaces/ticket.ts; network/test/ticket.test.ts). How a miner is kept from faking a closed model's
  answer beyond that is OI-6; how a seat's model version is proven is OI-7 (the adopted proposal is Stage 8b).
- Limit: the council's closed models run on vendors' servers through the miners' keys; the network sees
  answers, not the model.

Passage condition (by code):
- network/test/seed.fleet.run.test.ts exits 0 (exists: the right to publish a seed passes from the single seed key to a
  larger seed pin set by a signed upgrade).
- network/test/council.round.test.ts exits 0 (to be written: a ticket of kind consensus with k miners, answers forced
  at t+x, the agreed answer sealed as an entry by the epoch set, the round paid once to who ran it;
  proposed for the rest: a late or disagreeing miner earns nothing).
- network/test/ledger.council-issuance.test.ts exits 0 (to be written: after the hand-over entry, a `grant` or
  `redistribute` authored outside the council's set is refused `author-role`; before it, the initial authority's is accepted).
- On the test network: an upgrade and a grant whose authority is the council's set, not the single seed key; the record names the entries.

The user is told: en "The network now runs itself: many AI models, run through many people's own keys, decide together,
and the devices confirm." / pt-BR "A rede agora governa a si mesma: muitos modelos de IA, rodando pelas chaves de muitas
pessoas, decidem juntos, e os aparelhos confirmam."

Code it adds: the ticket queue on the network (planned), the miner tool in the site (planned), the heartbeat
(planned; A1.10), the council entry type on the ledger (planned), the real charter.

Code today: network/src/impl/{miner,mining}.ts and the backend modules of that directory, network/src/interfaces/ticket.ts,
network/src/seed/{council,charter}.ts, the `redistribute` entry.

### Legal (Stage 8)

When the council takes the key, the single sealing set of Q27 ends and the council becomes the layer that answers the
reports: Q49 (only what was reported, plus the tickets a ruling opens by name; fast layer, never a scan), Q50 (criminal-material reports routed to the operator,
the council holds no viewing path), Q51 (every decision recorded with reason, contestable, a proposal to each node and
never an order). The council does not custody anyone's key (Q26) and does not freeze balances (Q39). Layer: council.
Legal passage condition: the checks of Q49-Q51 exit 0 (to be written). Stages 7, 7b, 8b and 9 add no legal duty; they
must not weaken the ones above (a hand-over or upgrade that removes a legal check is refused by the same checks).

