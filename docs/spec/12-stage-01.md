**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 1: three roots and the grant (Build B)

What it is: after the first member, the tester and the project owner have signed up on Build A, the genesis is rewritten
with `roots: [first member, tester, project owner]` (same `epochKey`), Build B is signed and published, and
`ledger-grant.ts` grants 10 ANG to each root for the month, authored and sealed by the first member key.
See OI-22: the grant may go to every ACTIVE user.

Guarantees (threat model): as stage 0, plus: a root is granted once per month (`grant-twice-in-month`), a non-member is
refused (`grant-not-member`), and the roots are named after their keys exist, so no key is named that nobody holds. The
first node's operator still seals alone and still holds the seed pin.

Passage condition (by code):
- `cd network && LEDGER_COUNCIL_KEY_FILE=<the first member key's 0600 file> node scripts/ledger-grant.ts --relay
  wss://alfa.angstone.app/relay --genesis <Build B ledger-genesis.json> --auth-user <user> --auth-password-file <file>
  --dry-run` prints three "would grant 10.00 ANG" lines; without `--dry-run` it publishes; run again it prints "already
  granted" three times and exits 0 (exists; network/test/ledger.grant-script.test.ts).
- `node /home/ss/automation/projects/personal/angstone/network/scripts/node-verify.ts <grant entry id> --relay
  wss://alfa.angstone.app/relay --genesis <Build B genesis>` exits 0 (exists; network/test/node.scripts.test.ts).

The user is told: en "Three founding accounts hold ANG. The operator's computer still confirms everything." / pt-BR "Três contas
fundadoras têm ANG. O computador do operador ainda confirma tudo."

Code it adds: none. Open item OI-13: the LICENSE (plan section 7); owner action.

Code today: as stage 0.

### Legal (Stage 1)

Requirements built here: the age and guardian rules that ride on the invite tree (Q17 age band and refusal under 16, Q18
age-band signal, Q19 defaults for 16-17, Q35 guardian-key invite) and the grant's boundary (Q28 no real currency, Q29 no
`buy`, `redeem` or `reserve` producer without a classification opinion, Q31 no invite pays value from the invitee). The
monthly grant and the invite stay rules of the network, never a payment by an entrant. Layers: site for sign-up, Luminarkon
for the ledger rules. A guardian e-mail is a notice, never proof (D16). Legal passage condition: checks for the
sentences above exit 0 (to be written); Stage 1 is not marked legally passed before.

