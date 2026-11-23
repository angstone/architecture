**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 5: every action a Lumi Action, one rule set on every node, the relay a carrier

What it is: everything that was a call to a centralised REST API is now a Lumi Action, and this holds from the start.
Every field a person types and every record a device publishes goes
through the network's rules and is signed by nodes before it counts: name, handle, bio, photo, invites,
messages, the payment tool (a payment of ANG to a handle), error reports. Proposal for the relay: the Python relay's own rules
retire, and a relay in TypeScript calls the same `recordVerdict`, `entryVerdict` and `REDUCERS` the devices run, so one
code validates everywhere; rate budgets stay a defence of each relay, never a rule of validity. Each new action is one
reducer plus its test (1.10). Each such action is sealed and executed under the runtime, protections and permissions of Part R (R1 to R3).

Guarantees (threat model):
- A relay can only withhold. It cannot alter, forge or mint, and a device never takes a relay's word for validity
  (network/test/hostile.peer.test.ts, node.rules.test.ts).
- No field is accepted without the network's rule (network/src/validate/fields.ts; network/test/validate.fields.test.ts)
  and, for a person's records, without `threshold` member verdicts (site/src/store/settings-save.network-signed.test.ts).
- A node that signs an action under a cid that is neither a reducer of the signed seed nor an official-list or plugin cid
  admitted under R3 gets no count (`unknown-cid`; a reducer cid of the signed seed is official and also appears in the official list at the version in force; network/test/node.contract.test.ts).

Passage condition (by code):
- Condition: no field and no record of a person counts before the network's rule passed it and
  `threshold` member verdicts signed it. Tests exist for Settings (site/src/store/settings-save.network-signed.test.ts,
  attest-ask.relay.test.ts; network/test/validate.fields.test.ts) and are to be written, one per new field or action,
  in the same shape: site/src/profile/profile.network-signed.test.ts, site/src/invite/invite.network-signed.test.ts,
  site/src/with-who/message.network-signed.test.ts, site/src/pay/pay.network-signed.test.ts (a payment to a handle
  lands only after `threshold` member verdicts; a charge link is a signed record).
- If OI-15 is answered (a): network/test/node.rules.test.ts with its agreement cases turned into identity
  (the relay under test is the TypeScript relay) and network/test/relay.ts-impl.test.ts exit 0 (to be written: the TS
  relay passes relay.hardening, relay.persistence, relay.backup, relay.scale by name); on alfa the TS relay runs beside
  the Python one with equal stores, then alone, the record showing equal `ed-relay backup` counts.
- On alfa: a profile edit, an invite and a payment each go pending to saved only after member verdicts; the record names
  the records and the verdicts.

The user is told: en "Your device checks everything itself. A relay only delivers; it can never change anything." /
pt-BR "Seu aparelho verifica tudo sozinho. Um relay só entrega; nunca consegue alterar nada."

Code it adds: new action kinds in `ACTION_KINDS` with their reducers (profile, handle, invite, message, payment, report), each declared with one official kind class of R2.7 (`system`, `record` or `payment`; `plugin` is never an action kind, R3.5);
the payment tool in the site (planned); if OI-15 is answered (a), network/relay-ts/ (rules imported from
src/node).

Code today: network/src/node/{rules,contract,attest}.ts, network/src/validate/fields.ts, network/relay/ed-relay (Python),
site/src/store/settings-save.network-signed.test.ts, site/src/errors/pipe.ts.

Release and runtime rules of this stage (Part R):
- The Stage 5 release record adds assertions (e), (f), (g), the runtime cid, the list version and the runtime-record values digest to the (a) to (d) and (h) of Stage 4 (R4.12) and the double-output clause of (b).
- An executor refuses runs when its finalized ledger head is stale: host time exceeds the signed checkpoint time of the head by more than 2 x `EPOCH_MIN_S` (1 x for the `system` and `payment` kind classes, `FINALITY_WINDOW_S` plus one round timeout for `plugin`, R1.17), and a new runtime record takes effect no earlier than 3 epochs after its finalization, 1 epoch for a signed security patch (R1.14).
- The sandbox is an interpreter whose engine is part of the runtime cid, running in WASM linear memory or in a one-pipe process (R2.1, R2.4); no stage text relies on an engine-measured heap or a host JS engine.
- The `listing` record of each plugin (R3.5), the `author-identity` record and the network withdrawal record (R3.26) are signed structures that this stage ships with the plugin runtime.
- A requester's run admission is the node-local token bucket spent before the run starts; the network-wide bounds are derived from the node buckets, `n`, `t` and the number of byzantine members and no requester counter is finalized state (R2.12, R2.19).
- A plugin result reaches a requester only as a bundle of at least `t` identical signed verdicts, never as a single node's reply (R3.28).
- The grant log is a prunable structure outside the ledger, only its Merkle root is finalized, and the run and bit counters of a grant are records of that log (R3.33, R3.27).
- The `author-identity` record (R3.26), signed by `t` member keys, is a new signed structure; the plugin manifest holds only the author key (R1.1), and the legal name, contact and country live in that record.
- Epoch length is not fixed by this document: `MAX_GRANT_EPOCHS` is a `grantEpochs` constant of R0(c) with `MAX_GRANT_EPOCHS × MAX_EPOCH_SPAN ≤ 180` (R3.10; `MAX_EPOCH_SPAN` in days), its value an open item (OI-40); this stage adds the ledger rule that refuses at the fold a commitment of `nextSeq` further than `MAX_EPOCH_SPAN_SEQS` seqs (`epoch-nextseq-invalid`, `genesis-nextseq-invalid`; R0(c)) and the plugin-class check of R1.17 that refuses runs when an epoch is not handed over within `MAX_EPOCH_SPAN` days of sealed time; the R1.17 check reads `MAX_EPOCH_SPAN` from the `grantEpochs` field of the runtime record in force at the held head.

### Legal (Stage 5)

This stage carries most of the legal work, because the relay becomes a carrier of every action and the rights of the
holder meet it. Each new action kind is judged against the list: erasure (a kind 5 as an action, Q6; the relay purge and
vanish request, Q7; sealed profile erasure by key, Q8; export, Q9), reports and notices (Q12 flow, Q14 transparency
report, Q21 operator tool, Q22 no viewing path, Q50 routing to the operator), blocking (Q15 local block list by id and by
key at node, relay and client), orders (Q44 one procedure and its register, Q45 no monitoring, private messages sealed),
retention (Q38 access table with 6-month expiry and purge, Q43 error reports with consent). The relay rewrite (Python to
TypeScript, if OI-15 is answered (a)) must carry Q7, Q21, Q38 and Q44 or the rewrite does not pass. Layers:
relay for purge, tool, table and procedure; site for export, notice and consent; Luminarkon for the kind 5 action and the
sealed key. Legal passage condition: the checks named in the requirement sentences exit 0 (to be written); until then
the terms may not claim erasure, tombstone or a service level the code does not back. The privacy notice classifies the grant log as pseudonymous personal data, names the network operator as controller, gives the data-protection contact, the retention periods of R3.35 and the erasure path (a tombstone) (R3.34, R3.35). A plugin author's legal name, contact and country are held only in the `author-identity` record signed by `t` member keys (R3.26), never in the manifest, and the grant log holds no per-person entry on the ledger (R3.33).

