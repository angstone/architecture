**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 0: first network, one sealing key, 1 of 1 (Build A)

What it is: until a council of AIs exists, a founding pair holds the authority of the network. The relay is wiped, and a new ledger
genesis is written with `roots: [first member]` and `epochKey {members: [first member zero key], threshold: 1}`. The first
node runs on the droplet (network/scripts/node-run.ts) and signs every Save; every device runs the node module and shows
the node line in Settings. Procedure: site/docs/qa/2026-11-11-alfa-hatch-runbook.md. Build A: site d2ea445, network
2b59ff2. The order of accounts is fixed: the first member, the dogfood tester, then the project owner.

Guarantees (threat model):
- The operator of the first node can do what a 1-of-1 set can: seal any checkpoint, grant to any root, refuse to sign a
  Save (it stays pending and says so). The same operator holds the one seed pin, so can publish a changed site and every
  device accepts it; `seed-verify` proves only that the served build is the one the pin holder signed (custody of the pin
  key: Q52). The operator cannot forge a member's record (`verifyEvent`, checked by every device), break conservation
  (`checkTotals`, `assertConserved`) or move a member's ANG (`transfer` is member-authored, `transfer-from-not-author`).
- The relay can withhold and rate-limit; it cannot alter a record or mint; a ledger entry it stores (kind 8913) is
  judged by every reader's own fold.
- Plain limit: one person holds the seal and the seed pin. This is a test network.

Passage condition (by code):
- `node /home/ss/automation/projects/personal/angstone/network/scripts/seed-verify.ts https://alfa.angstone.app
  --auth-file <file> --expect-version $VA` exits 0 from any directory (exists; network/test/seed.verify-cli.test.ts).
- `head -1 $NODE_DIR/node-run.log | jq -e --arg first "$FIRST_ZERO_PUB" '.node == $first'` exits 0 (exists, runbook 2b).
- A Save goes pending to saved with the first node online: site/src/store/attest-ask.relay.test.ts and
  site/src/store/settings-save.network-signed.test.ts exit 0 (exist); on alfa, the dogfood re-check of runbook 4.3.
- `cd network && node_modules/.bin/vitest run` exits 0 (exists; 69 files at 2b59ff2).

The user is told: en "Alfa is a test network. One computer, the operator's, confirms what you save and the ANG you hold." / pt-BR
"O Alfa é uma rede de teste. Um computador, o do operador, confirma o que você salva e os ANG que você tem."

Code it adds: none beyond Build A.

Code today: network/src/node/ (1.2), network/src/validate/fields.ts, network/scripts/{node-run,node-verify,ledger-grant,
seed-sign,seed-verify,gate-auth}.ts, the relay's basic-auth gate flags and npub allow rows
(network/test/relay.auth-gate.test.ts); site/src/node/{engine.ts,NodeLines.tsx}, the pending and saved states, the one
error pipe (site/src/errors/pipe.ts).

### Legal (Stage 0)

Requirements built here: Q1 roles document, Q3 data-subject channel, Q4 and Q5 no person in the ledger, Q23 no EU
targeting, Q24 supplier identification, Q25 and Q46 terms with summary, rating and kept version, Q30 no promise of value,
Q36 key-signature clause, Q37 log policy, Q41 basis per processing, Q42 incident procedure, Q47 accessibility, Q26 and Q27
(the key stays on the device; the single sealing set of the first member is named a transitional decision point, not a feature). Layers:
site for the page and terms, Luminarkon for Q4, Q26 and Q27, relay for the log policy.
Legal passage condition: each sentence above has a check that exits 0 on the package of the page and on the ledger
fold; none exists yet (to be written), so Stage 0 is not marked legally passed.

