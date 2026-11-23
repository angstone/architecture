# 0002 Jurisdiction packs: national law as signed plugins

Status: proposed, target Merry 5.3. Date: 2026-11-23. Not part of Merry 5.2; no normative text of 5.2 changes for it.

## Context
Each country has its own law. The owner (2026-11-23): the architecture must let Brazilian law be plugins, both of architecture for Brazil and of functionality, partly independent. The mechanisms already exist in the core: legal compliance in a serverless network (`docs/spec/10-legal.md`), the `consent` record with its `regions` field in the runtime record (`docs/spec/01-registry.md`, R0(c)), erasure and retention (R0(d)), and the plugin grant (R3).

## Proposal
- **In the core (mechanism):** erasure, consent records, retention, region routing, the plugin grant. Identical in every jurisdiction.
- **In a signed jurisdiction pack (policy):** which periods, which consents, which duties apply. Brazil first: LGPD, Marco Civil da Internet, Código de Defesa do Consumidor. A pack is a plugin sealed and signed like any other (R1, R3) and named by the `consent.regions` field.
- **Which law applies:** the pack of the user's residence and the pack of the executor's region both bind; where they conflict the stricter protection of the user wins; a pack that cannot be honoured makes the action refuse, never run.
- **Never a plugin:** anything that weakens the trust core (sealing, verdict agreement, stake, the invite tree, the signed runtime record); a pack may add duties, never remove a core guarantee.

## Alternatives
1. **Law hard-coded in the core, one rule set per country.** Simple to read; every new country is a core release and a new freeze.
2. **Jurisdiction packs as signed plugins over a fixed mechanism (proposed).** The core stays one rule set; a country is a pack reviewed by a local lawyer.
3. **Fully independent per-country networks.** Strongest isolation; splits the ledger and the members, which defeats one network.

## Decision
Alternative 2, as the simplest that keeps the core single. To be written into the spec at Merry 5.3 with its tests; the lawyer's confirmation of D1 to D18 (OI-33) stays the gate for any claim of lawfulness.
