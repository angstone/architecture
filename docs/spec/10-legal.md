**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Legal compliance in a serverless network

Status: design section on legal compliance. It specifies what a network without a central server must do to meet the
applicable legislation (data-subject rights, court orders foreseen in law, record keeping and the like). Each stage gains a
closing "Legal" subsection; the text of Stages 0 to 9 is otherwise unchanged. This is design, not legal advice, and no
line of it says the network complies with a law: it lists what the network must do, and each sentence is a test that turns
red or green. The reading of the law is conservative and provisional until a lawyer confirms it. Sources: the legal norm
study (norms, doubts D1-D18, requirements LR1-LR28; "(v)" there marks an article to re-check before it enters a term or a
filing), the legal decisions document (the decisions taken and the sentences Q1-Q56), the record of rulings of
2026-11-14 and the dev inventories 01, 04, 06 and 07. Law references below are the ones those documents carry; this
section adds none.

### The law fits a server; the network has none

The laws assume an identifiable controller, a provider with a server, a court that can order one party to act. This
network has devices that hold their own keys, relays that carry signed records, and a ledger that nobody can edit. The
design answer is six rules, each one stated earlier in this document, now written as a duty:

1. **Duty follows possession.** Whoever holds a copy answers for it: a device for its own, a relay operator for its
   storage, Angstone LTDA for what it publishes and defines (page, sign-up, invites, error reports, ledger rules). A
   relay operator delivers only what it has and says "I do not hold it" for the rest; it never starts collecting data to
   satisfy an order (LR16).
2. **The ledger holds keys and numbers, never a person.** The link between a key and a person (handle, profile, photo,
   invite, guardian e-mail) lives in records the data subject can erase; erasing them leaves every ledger entry intact
   and the ledger refers to no handle (Q4, Q5).
3. **Erasure is honest.** A deletion request is a signed kind 5 event plus a vanish request that the relays of the
   network honour by contract; sealed profile and photo are erased by destroying or rotating the decryption key; no text
   promises complete erasure and every text names what stays (the ledger, copies on foreign relays and devices) (Q6-Q9).
4. **Removal is sovereign per node.** Each node, relay and client keeps its own block list by event id and by key; no
   list distributed through the seed or the ledger can bind a node that did not adopt it; a signed upgrade never carries
   a block (Q15, Q16). An order reaches what its addressee controls, and the answer to the authority says where the
   technical limit lies.
5. **No value, no promise, no custody.** The ledger of this version accepts no real currency, no producer of `buy`, `redeem` or
   `reserve` runs, no text suggests return, and nothing in the network freezes a balance; conversion belongs to an
   authorised partner or to a later stage (Q26-Q34, Q39, Q40).
6. **Every duty is a sentence a command can fail.** Each requirement below is one testable sentence with its law
   reference, a stage and a layer; where no check exists yet the text says "to be written" and no stage is passed on it.

### Who is who (decisions D1, D5, D6)

| Actor | Role by design | Duties the architecture gives it | Layer |
| --- | --- | --- | --- |
| Angstone LTDA | controller of what it defines (sign-up, invites, error reports, ledger rules, the static page); provider in the conservative reading of Decree 12.975/2026; supplier of the product (ECA Digital art. 1, CDC) | public roles document, data-subject and officer channel, notification flow, transparency report, log policy, terms | site, Luminarkon (rules) |
| Relay operator | controller of its own storage (reading A); provider for what it serves | operator contract accepted at entry in the seed list, remove by id, preserve, deliver by court order only what it holds, publish contact and terms (NIP-11), country | relay |
| Device holder | handles own data (LGPD art. 4 I) | holds the key; may export, erase, revoke consent from the device | Luminarkon (node), site |
| Sealing nodes, stake | no settled classification; a single sealing set (one key, Stage 0) is named a transitional decision point | stake only one's own, no delegation, no custody, no promise of yield | Luminarkon |
| Minor council | reviews only what was reported; never reads everything | see "Illegal content and the council" below | council |
| Drawn miner of an A6.11 ticket (in this version only the seed-listed key's node, operated by the operator of the first node, A1.13) | operator of the controller (LGPD art. 39) for the fields of one authorized 16-17 profile, only for that ticket | processes them only to answer it, accepts the operator terms at bonding (the seed node's holder included) and the security duty of LGPD art. 46, erases them at the ticket's conclusion or void (A6.11) | council |
| Plugin author | author of a plugin cid, named only by an author key in the manifest (R1.1); identity attested by an `author-identity` record signed by `t` member keys (R3.26) | legal name, working contact and country kept current in that record, a failed contact liveness check suspends listing | Luminarkon (plugin) |
| Broker (future) | the only external edge; Angstone never operates it without Central Bank authorisation (D15) | identification, record keeping, suspicious-operation report, refusal of conversion | broker |

### Requirements: one testable sentence each

Layers: **L1** Luminarkon (node layer, the ledger), **C** the council, **R** the relay, **S** the site and its static page.
Trigger is the order of delivery from the law document: **ALFA** (the alfa channel already handles personal data and runs a
relay and error reports), **PUBLIC** (before the network opens to the public), **VALUE** (before any conversion of ANG).
Stage is where the requirement is built (a proposal of this section). No suite was run for this section; the sentences
are not yet tests.

**A. Data-subject rights (access, erasure of the key-person link, portability)**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q3 | The static page shows the data-subject channel and the officer's name, and the app accepts a request for access, correction or erasure through it with the answer recorded. | LGPD 18, 41 (LR7) | 0 | S | ALFA |
| Q4 | A test fails if a ledger entry of kind 8913 carries any field beyond keys and numbers (handle, name, photo, e-mail, IP, place or free text). | LGPD 6 III, 46; EDPB 48-49 (LR3) | 0 | L1 | ALFA |
| Q5 | Handle, sealed profile, invite and the guardian's e-mail sit in records the holder can erase, and a test shows that erasing them changes no ledger entry and leaves no handle referenced by the ledger. | LGPD 12, 16, 18 (LR4) | 0 | S, R | ALFA |
| Q9 | The app exports the holder's data (own events, transaction history, acceptance of the terms) as a readable file, and a round-trip test checks the content. | LGPD 18; LR28 | 5 | S | ALFA |
| Q6 | The client emits a kind 5 event (NIP-09) for each own record on erasure, and a test checks the signed event at the relay. | LGPD 16, 18 (LR5) | 5 | S, L1 | PUBLIC |
| Q7 | The relay purges the event a kind 5 of its author names, and every record whose `x` is that event's text digest (Q15), unless a legal hold of Q56 stands on it, and a test shows the row gone afterwards and a record of the request kept. | LGPD 16, 18 (LR5) | 5 | R | PUBLIC |
| Q8 | Sealed profile and photo are erased by destroying or rotating the decryption key, and a test shows the sealed copy no longer opens. | LGPD 16, 18 (LR5) | 5 | S, L1 | PUBLIC |
| Q41 | Every processing has a legal basis in a table; consent is signed by key, kept on the device and revocable, and withdrawal erases or anonymises where consent is the basis; a test fails on a processing without a row. | LGPD 7, 8, 11, 16 (LR6) | 0 | S | ALFA |

**B. Court orders and notices foreseen in law (removal, delivery, blocking)**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q12 | A notification flow exists (receive, confirm receipt, decide with reasons, allow contestation) with recorded tickets, and a test walks the four states. | Decree 12.975 16-D to 16-F; STF Themes 987/533 (LR14) | 5 | R, S | PUBLIC |
| Q13 | Every relay of the seed publishes its contact and terms (NIP-11 `contact`, `terms_of_service`), and a test fails for one that does not. | Decree 12.975 16-A; ECA Digital 40 (LR14) | 2 | R | PUBLIC |
| Q15 | Node, relay and client keep a local block list by event id and by key, and a test shows an event blocked at one node is not served there and still served by another; a block, a kind 5 purge (Q7) or a disable by Q21 of an event also acts on every record whose `x` equals that event's text digest, moderation tickets included, and a test fails if a ticket carrying a removed post's text is still served. | MCI 19, 21; ECA 241-A; Decree 12.975 16-G (LR13) | 5 | L1, R, S | PUBLIC |
| Q16 | No block list travels through the seed or the ledger in a way that binds another node, and a test fails if a signed upgrade can impose a block on a node that did not adopt it. | MCI 19 ("limites técnicos"); STF 987/533 (LR13) | 2 | L1 | PUBLIC |
| Q21 | The operator has a tool to disable an id, isolate a restricted copy and export it for communication to the authority, and a test shows the three steps on a relay. | ECA 241-A, 241-B, 190-F §2 (LR15) | 5 | R | PUBLIC |
| Q22 | The app has no path to view an event marked as illegal material, and a test shows a marked event does not render. | ECA 241-B; ECA Digital 27 (LR15) | 5 | S | PUBLIC |
| Q39 | The ledger has no entry type that freezes a balance and `redistribute` accepts only the network's rule reasons; a test covers the absence. | Law 13.810 8-9; Law 9.613 (LR27, D18) | 4 | L1 | VALUE |
| Q44 | One written procedure answers an order or a request (verify authority and scope, deliver only what is held, answer "not held" for civil qualification and address, refuse a generic collective request, register each request, state the technical limit to the judge), and a check fails if the procedure file or the register is absent. | MCI 10, 19, 20, 22; Decree 8.771 11; Law 12.850 15, 21; CPP 13-A; ECA 190-F §2 (LR16) | 5 | R, S | PUBLIC |
| Q45 | The operator's terms forbid monitoring or handing over private communication, private messages stay end-to-end sealed so the operator cannot read them, and a test shows a relay holds no key that opens one. | Law 9.296 10; MCI 7, 10 (LR17) | 5 | R | PUBLIC |

What the relay operator can and cannot do under an order, from inventory 07 and the law document (it decides which
order is answerable): it **can**, on its own relay only, remove a row by id, deliver identifiers, timestamps, public
events, handles, the invite tree and its own access log, refuse or limit a key (`invite-revoke` and the allow-list
already block writes of one account), and preserve. It **cannot** forge, open sealed profile or photo, rewrite the ledger,
erase from other relays or devices, deliver what it does not hold, or freeze a balance. An order reaches the addressee's
storage; the ledger history and foreign copies are outside any operator's reach, and the answer says so.

**C. Record retention and logs**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q37 | A log policy exists per component (relay, error reports, static page) with purpose, retention and access, and a test checks the file covers the three. | MCI 13-16; Decree 8.771 13 §2 (LR10) | 0 | S, R | ALFA |
| Q38 | The relay Angstone runs keeps an access table (IP, time, logical port when needed) with a 6-month `expires` and automatic purge, a row under a legal hold of Q56 excepted, and the host log rotates by time; a test with a fixed clock shows the 6-month-and-1-day row removed and the 5-month row kept. | MCI 15; Decree 8.771 15-A (LR10, D17) | 5 | R | ALFA |
| Q43 | An error report leaves the device only with consent, sealed for the network's report key, with no IP kept beyond Q37, and a test shows the report refused without the consent record. | LGPD 6 III, 7, 8, 46 (LR11) | 5 | S | PUBLIC |
| Q42 | An incident procedure exists with the notice deadline and a record of every incident for 5 years, and a check fails if the procedure or the register is absent. | LGPD 46-49; Decree 8.771 13, 16; Res. ANPD 15/2024 (v) (LR9) | 0 | S, R | ALFA |
| Q10 | Each relay entry of the seed carries a `country`, and a test fails for an entry without it. | LGPD 33-36 (LR12) | 2 | L1 | PUBLIC |
| Q11 | Before the first send the app says events go to relays and in which countries they sit, and an interface test checks the notice. | LGPD 33-36 (LR12) | 6 | S | PUBLIC |

Retention rule: the ledger is kept for good because it holds no personal data (Q4); everything else is kept for the
shortest term its purpose and the law allow, and a term is a column and a purge, never a promise in a text.

**D. Controller and operator roles**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q1 | The static page includes a public roles document saying, per processing, who is agent (Angstone, relay operator, holder), and a test fails if it is absent from the package. | LGPD 5, 37, 39, 42; EDPB 36-44 (LR1) | 0 | S | ALFA |
| Q2 | A relay enters the seed list only with the operator contract accepted (security, incident, retention, report channel, removal by id, preservation, country), and a genesis test fails if an entry without a signed acceptance is taken. | LGPD 39, 42, 33-36 (LR2) | 2 | L1, R | PUBLIC |
| Q20 | A data-protection impact report is written for the public ledger, the relay, the age check and the delivery of an authorized 16-17 profile's fields to the drawn miner, in this version only the seed-listed key's node (A6.11), and a test checks the file is in the package. | LGPD 38 (LR8) | 2 | S | PUBLIC |
| Q14 | Angstone publishes an annual transparency report generated from the tickets, and a test generates it from a sample ticket base. | Decree 12.975 20-A (LR14) | 5 | S | PUBLIC |
| Q27 | The documentation names the single sealing set as a transitional decision point and ties its end to the threshold stage, and a test fails if the passage is missing. | Law 14.478 5; EDPB 43-44 (LR26) | 0 | L1 | VALUE |

**E. Minors and illegal content**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q17 | Sign-up asks the age, stores only the age band (never date or document) and refuses under 16, and a test covers 15, 16, 17 and 18. | ECA Digital 9, 24; CC 3-5; LGPD 14 (LR18) | 1 | S | PUBLIC |
| Q18 | The device produces the age-band signal and consumes the browser or OS signal when one exists, and a test shows the signal holds the band only. | ECA Digital 12-14; Decree 12.880 24-25 (LR18) | 1 | S, L1 | PUBLIC |
| Q19 | An account of 16-17 opens with a private profile, place off, no profiling and limited interaction, and a test checks each default; the profile turns public only as A6.8-A6.9 say. | ECA Digital 6-7, 22, 26 (LR20) | 1 | S | PUBLIC |
| Q35 | An account of 16-17 opens only with an invite signed by the guardian's key and bound to it, and a test shows the refusal without it. | CC 4, 171; ECA Digital 24 §3 (LR19) | 1 | S, L1 | PUBLIC |
| Q46 | The terms show the indicative age rating in Portuguese and the accepted version stays on the device, and a test checks both. | ECA Digital 8; Decree 12.880 12-13 (LR21) | 0 | S | PUBLIC |

**F. The ANG boundary (value, custody, conversion)**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q26 | The holder's key never leaves the device and no Angstone code signs `transfer` for a third party; a search test fails if such a producer exists. | Law 14.478 5; Res. BCB 520 9 (LR26) | 0 | L1 | VALUE |
| Q28 | The ledger rejects any entry with a real-currency field, and a test covers the rejection. | Law 14.478 3; Res. BCB 520 (LR25) | 1 | L1 | VALUE |
| Q29 | No producer of `buy`, `redeem` or `reserve` runs on the network before a classification opinion of ANG is recorded in `docs/legal/`, and a test fails if one exists without it. | Law 14.478 3; Law 12.865 6 (LR25) | 1 | L1 | VALUE |
| Q31 | No ledger entry pays the inviter with the invitee's value, and a test shows conservation per invite. | Law 1.521 2 IX (LR24) | 1 | L1 | ALFA |
| Q32 | The `bond` rule accepts only the node's own balance and rejects delegation, and a test covers the rejection. | Law 14.478 5; Res. BCB 520 2, 9 (LR26) | 4 | L1 | VALUE |
| Q34 | No component Angstone publishes offers buying or redeeming ANG against currency before the authorised partner is named in `docs/legal/`, and a test fails if one exists. | Law 14.478 2; Res. BCB 519-520 (LR25) | 4 | S, broker | VALUE |
| Q48 | At the broker, a checklist of identification, 5-year record, suspicious-operation report, originator and beneficiary data and the COAF report exists before any conversion, and a check fails without it. | Law 9.613 9-12; Res. BCB 520 43-47, 591/2026 (LR27) | 4 | broker | VALUE |

**G. Transparency to the consumer and to the reader**

| Id | Requirement | Law | Stage | Layer | Trigger |
| --- | --- | --- | --- | --- | --- |
| Q23 | A test fails if the page, a term or an i18n string targets the EU (language, currency or advertising). | GDPR 3(2) (not verified); D9 (LR12) | 0 | S | PUBLIC |
| Q24 | The static page shows the supplier's CNPJ, address and contact, and a test fails if any is missing. | CDC 6, 30-31; Decree 7.962 2, 4, 5 (LR22) | 0 | S | ALFA |
| Q25 | The Portuguese terms carry a summary, the limiting clauses in evidence and a keepable copy, and the accepted version stays on the device; a test checks the four. | CDC 46-47, 51 (LR21, LR22) | 0 | S | PUBLIC |
| Q30 | A test fails if any public text (pages, terms, i18n) suggests appreciation, return, investment or income of ANG. | Law 1.521 2 IX; CP 171-A; Law 7.492 6-7 (LR24) | 0 | S | ALFA |
| Q33 | No text or screen of the node uses language of yield or return of the stake, covered by the Q30 test. | Law 6.385 2 IX (LR24, LR26) | 4 | S | VALUE |
| Q36 | The terms carry the clause that accepts a signature by key as proof, and a test checks it in the accepted version. | MP 2.200-2 10 §2 (LR19) | 0 | S | PUBLIC |
| Q40 | The terms say Angstone does not freeze a balance on the network and that only the broker refuses a conversion, and a test checks the passage. | Law 13.810 8 (LR27) | 4 | S | VALUE |
| Q47 | The static page and the app conform to a declared technical standard (WCAG as a technical reference, not law) with an automated test and the accessibility symbol. | LBI 63 §1; CDC 6 with LBI 100 (LR23) | 0 | S | ALFA |

### Illegal content and the council

The council rulings are fixed and not reopened: a minor council moderates, anyone may report freely, no model reads
everything, the profile is always moderated, display names are unique, no parody. The duties the law adds
to the council, as sentences (layer C):

- **Q49** The council acts only on content someone reported, in the fast layer, and never scans the network; a test shows
  an unreported event is never queued for review, except the tickets the rulings open by name with no report: a write the
  layer-1 check of A1.14 sends to `unclear` (held pending its ticket), the guardian's authorization ticket of A6.11, and the
  profile moderation of flow 1.12: every new login, display name, bio and photo (the profile is always moderated; the photo
  goes through the minor council, Q53), except a profile private under A6.8, whose fields are
  judged only by the A6.11 ticket, and a profile in the closed scope of A2.15, served to no one, whose fields enter
  this profile moderation when the scope opens (Q54). (D8.)
- **Q50** A report on content the law treats as criminal (child abuse material, non-consensual intimate images, grooming,
  abduction: the report categories `child-abuse`, `intimate-image`, `grooming`, `abduction` of A1 step 1) goes to the
  operator's procedure of Q21 and Q44, not to the council to look at: the council holds no path to view it (Q22) and a test
  shows the report is routed to the operator with the id only. (ECA 241-A, 241-B; Law 13.718; MCI 21; LR15.)
- **Q51** Every council decision on a report is recorded with its reason and can be contested, through the flow of Q12; the
  council's removal is a proposal each node adopts into its own block list (Q15, Q16), never an order that binds a node. A
  test shows a decision without a reason is refused and a council decision does not alter a node that did not adopt it
  (except the A6.11 authorization ticket, whose conclusion every node's own rule A6.11 reads, A1 step 7).
  (Decree 12.975 16-D to 16-G; STF 987/533.)
- **Q52** The seed pin's signing key (the seed stays the one security point of the network) is
  held offline, never on a host that serves or runs a task; each signed seed carries the hash of the next pin key (the pattern
  of the epoch hand-over, `epoch-next-not-precommitted`); a device refuses an upgrade signed by a key that is neither the current
  pin nor the pre-committed next one, a fifth `PlantWhy` beside the four of `src/interfaces/pin.ts`; and a device applies a changed
  pin or code only after a delay window `PIN_DELAY_S`, awaiting the owner's number, in which a published contradicting seed halts the
  plant. Recovery after a theft is the pre-committed next key, never the stolen one, and it takes precedence (KERI
  pre-rotation): a seed signed by the next key cannot be halted by a seed of the current key, only a next-key seed halts a
  current-key change, and the next-key seed once planted retires the current key for good. A test fails if a
  seed signed by an uncommitted key plants, if a change applies inside the window, and if a contradicting seed of the current
  key halts or outruns a next-key seed. No second signer is added (that would change the single security point).
  The weekly re-sign of a seed within `SEED_VALIDITY_S` (the seed re-sign of Stage 7) would otherwise put the pin key on an
  online host. So the roles split as TUF splits root and timestamp (https://theupdateframework.io/docs/security/):
  the offline pin key signs only a change of code, of pin, of the `checkpoint` or of the freshness key, and names in the manifest one online
  freshness key that may re-sign only the seed's `notAfter` and `signedAt`, with every file hash, the pin and the `checkpoint`
  equal to the last pin-signed seed's and a `signedAt` never earlier than the last pin-signed seed's; a device refuses a freshness-signed seed whose file hashes, pin or `checkpoint` differ
  from the last pin-signed one, or whose `signedAt` is earlier than it, so a stolen freshness key cannot backdate the endorsement time the judge keeps (`slotRace`, `beats`), and a test fails if a backdated freshness re-sign lowers the kept `signedAt`, so advancing the checkpoint, which carries the seed authority's weight at equal epoch (at equal
  epoch the seed authority's checkpoint outweighs a branch the committed council sealed; see the section on open items), needs the pin key. The freshness key changes nothing that runs and no checkpoint, so the one
  security point stays the pin key; a stolen freshness key can only keep a seed fresh or let it go stale. The pre-committed next pin key is kept on a different medium from the current one.
  The rotation logic itself is a kernel below the seed that no seed replaces: it holds the committed next-key
  hash, a seed signed by the current key can never change that hash (only a rotation signed by the next key commits a new
  one, KERI pre-rotation, https://weboftrust.github.io/ietf-keri/draft-ssmith-keri.html), and the kernel always accepts a
  rotation by the committed next key, whatever code a thief's seed planted. So a device that missed the halt in the window,
  withheld by a relay (Stage 0, "The relay can withhold") or offline, still accepts the owner's next-key rotation later. A test
  fails if a freshness-signed seed changes a file hash, the pin or the `checkpoint` and still plants, if a current-key seed changes the committed next-key hash,
  and if a device that planted a current-key seed refuses the later rotation by the committed next key.
  Residual: a thief who holds both the current key and the pre-committed next key. (LGPD 46 to be confirmed by the
  lawyer; launch gate G15.)
- **Q53** No photo pixel reaches any miner, the GPUs of the initial operators included, before the photo's hash is checked against a list of
  known abuse-material hashes by the relay Angstone LTDA runs, before any ticket carrying the photo is published (the photo of an `authorized` 16-17 profile, delivered encrypted to the drawn miner, is screened the same way before its delivery, A6.11); a hash on the list is routed to the operator's procedure of Q21, Q44 and Q50
  with the id only and never queued to a miner, and a test shows a listed hash never reaches a miner's ticket. The screen also
  comes before anyone reads the photo: a profile photo travels in the clear (A4) and a stranger may read it (A4.2), so a seed
  relay refuses to store or serve an `ang.photo/2` record until its hash has passed this check, and a third-party relay of the
  seed takes the same duty by the Q2 contract; a test fails if a stranger reads an unscreened photo record from
  a seed relay. The photo flow
  stays (the photo goes through the minor council); only the order changes. The screening method and the list source
  await the lawyer's advice and an owner ruling (Open item OI-37). At the start only the first node's GPU mines (1.12 step 4), and unscreened pixels stored on the operator's own machine are
  themselves the exposure of ECA 241-B ("possess or store"), so the gate binds at the first photo ticket, initial operators
  included (launch gate G16). (ECA 241-A, 241-B; Q22, Q50.)
- **Q54** The age estimated from a face (every entrant, besides the login check, passes a face assessment for age) is computed on the device; only the signed or zero-knowledge result, over or under the age bar, goes to
  the network (A6.6); the face never leaves the device and never reaches a relay, the ledger or a miner, since the face and its
  estimate are biometric and sensitive data (LGPD 11), and a test captures a sign-up's traffic
  and fails on any byte of the capture. It narrows the 16-17 guardian-authorization requirement (A6.8-A6.11) and closes none of it: it makes the 16-17 band measurable on the device
  (the precondition of Q19; for Q17, the web age-gate requirement, it is a first layer only on the web: without the native shell's attestation of
  stage 6, a modified page or a virtual camera can produce the over/under result, so there it is no stronger than
  self-declaration, which ECA Digital art. 9 §1 forbids; the 16-17 band enters only through the guardian's invite of Q35,
  A6.10, and attested capture comes at stage 6; until then a web over-18 result admits nobody without the
  inviter's signed age statement in its countersign, A2.15, so a forged "over 18" alone admits no under-16; a forged one with a willing inviter's statement admits it only into the closed scope of A2.15, private, no invites, no age-restricted content, until the attested capture), and what a 16-17 account's public profile
  shows is answered: born private, public only on the guardian's key (A6.8-A6.10). Launch gate G18. The check is processed
  on the holder's own device and not shared, by zero-knowledge proof and cryptography; it is done by the camera, a live
  capture on the device and never an uploaded photo (A6.6). The document photo by the same means is a later version, age
  only for now (A6.7, not in this version).
- **Q55** Reporting abuse material to the authority is a duty, not a tool: every Q53 hash hit and every Q50 report of the
  categories `child-abuse`, `grooming` or `abduction`, and of `intimate-image` when it shows a child or adolescent, produces a sent communication to the competent authority named by the lawyer, within the deadline the
  regulation sets, through the export of Q21, and each one is registered in Q44's register with its time of sending. A test
  shows a Q53 hit yields one registered communication and fails if a hit or a Q50 report inside the categories above ends with none. (ECA Digital, Lei
  15.211/2025, art. 27 caput, "shall remove and communicate", to be confirmed by the lawyer; ECA 241-A.)
- **Q56** A report places a legal hold above erasure and purge: a Q50 report, a Q53 hit, or a preservation request or court
  order registered in Q44 (MCI 15 §2, 22) places a hold on the event id and its author key, and on every key and event the
  report or the order names; while the hold stands, the relay refuses the kind 5 purge of Q7 for that id (the request is recorded, as Q7
  reads, and answered after the hold), the access rows of Q38 for that author are kept past their 6 months, and the key
  destroy or rotation of Q8 waits; the held copy stays restricted and confidential as Q21 and ECA 241-B §3 read, and the hold
  ends only by the term of the law or the authority's word, registered in Q44. Third-party relays of the seed take the same
  hold by the Q2 contract. A test fails if a kind 5 against a held id deletes it, if Q38 purges a held author's row at 6 months
  and 1 day, and if Q8 erases a held sealed copy. (ECA Digital, Lei 15.211/2025, art. 27 §2, "shall retain", for the term of
  MCI 15, to be confirmed by the lawyer; ECA 241-B §3.)
- The risk of "hosts or moderates" (ECA 241-A §1 III, new wording) is accepted and noted for the lawyer (D8).

Q49-Q51 are added by this section from D6, D8 and the council rulings (Q52-Q54: pin custody, the known-hash screen, the face-age check); the law document carries no such Q numbers. Stage: 8
(the council layer), with the report intake and the operator routing of Q50 from Stage 5.

### Hand-over: decisions, what is open, what only the owner can take

Decisions D1-D18 are taken in the legal decisions document, each provisional until a lawyer confirms it. The map
from decision to requirement is: D1 Q1-Q3; D2 Q4-Q5; D3 Q4-Q9; D4 Q10-Q11; D5 Q12-Q14; D6 Q12, Q15-Q16; D7 Q17-Q20;
D8 Q21-Q22; D9 Q23; D10 Q24-Q25; D11 Q26-Q27; D12 Q28-Q29; D13 Q30-Q31; D14 Q32-Q33; D15 Q34; D16 Q35-Q36; D17
Q37-Q38; D18 Q39-Q40. Q41-Q48 carry the requirements the decisions document lists as still binding without a new
decision (LR6, LR9, LR11, LR16, LR17, LR21, LR23, LR27). The age study with zkML or on-device assessment is a research item
with numbers, not a requirement.

**Requirement to decision.** Every Q of the tables above, with the decision it rests on, so the document carries each decision id
beside each sentence. Q41-Q48 rest on the requirements LR6, LR9, LR11, LR16, LR17, LR21, LR23 and LR27 that the decisions document
keeps binding without a new decision (Q46 also on D10, Q48 on D15); Q49-Q51 rest on the council rulings, D6 and D8; Q52-Q56 carry no decision id and rest on what each names (Q52 the single security point of the seed, Q53 the photo flow through the minor council, Q54 the face-age check, Q55 the duty to report and Q56 the legal hold).

| Q | Decision | Q | Decision | Q | Decision | Q | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q1 | D1 | Q14 | D5 | Q27 | D11 | Q40 | D18 |
| Q2 | D1 | Q15 | D6 | Q28 | D12 | Q41 | LR6 |
| Q3 | D1 | Q16 | D6 | Q29 | D12 | Q42 | LR9 |
| Q4 | D2, D3 | Q17 | D7 | Q30 | D13 | Q43 | LR11 |
| Q5 | D2, D3 | Q18 | D7 | Q31 | D13 | Q44 | LR16 |
| Q6 | D3 | Q19 | D7 | Q32 | D14 | Q45 | LR17 |
| Q7 | D3 | Q20 | D7 | Q33 | D14 | Q46 | LR21, D10 |
| Q8 | D3 | Q21 | D8 | Q34 | D15 | Q47 | LR23 |
| Q9 | D3 | Q22 | D8 | Q35 | D16 | Q48 | LR27, D15 |
| Q10 | D4 | Q23 | D9 | Q36 | D16 | Q49 | D8 |
| Q11 | D4 | Q24 | D10 | Q37 | D17 | Q50 | D8 |
| Q12 | D5, D6 | Q25 | D10 | Q38 | D17 | Q51 | D6 |
| Q13 | D5 | Q26 | D11 | Q39 | D18 | | |

Every requirement of the decisions document (Q1-Q40) is present in the tables above: this section carries all forty and
this index names each one's decision; Q41-Q56 are added by this document; none was left to enter.

Only the owner can: name the data-protection officer (D1, `OFFICER_D1`); take the provider position for the company (D5, `PROVIDER_D5`); choose and contract
the Central Bank-authorised partner (D15); hire the lawyer who confirms D3, D5, D7, D11, D12, D14, D17 and the guardian
clause of D16. None of this blocks building Q1-Q51 for the next frozen version; Q52-Q56 are launch gates (G15, G16, G18) and not built.

Open items, not decided here:

- Open item OI-34: whether Decree 12.975/2026 stands (it is contested); revisit on a ruling. No default is set.
- Open item OI-35: whether the static page, being a transmission, falls under MCI art. 15 as well as the relay (D17). No default is set.
- Open item OI-36: the capital and classification questions of the broker (D12, D15). No default is set.
- Open item OI-37: the screening method and the source of the known-hash list of Q53 await the lawyer and an owner action; G16 forbids the first photo ticket until the screen runs.

What exists today (inventories 01, 04, 06, 07): layer 1 is partial and has none of Q4-Q9 as a test; the relay has no
NIP-09, purge, vanish, tombstone or export, no access table and no retention by time (the host log rotates by size
only); the `invite-revoke` allow-list blocks the revoked account's writes and those of everything below it (A2.12); no production producer of `transfer`, `buy`, `redeem`
or `reserve` exists; the site's "Apagar tudo" (UI text) erases the device only; the terms draft claims a tombstone and a 15-day
by-hand service the code does not back (to be corrected before it is shown). Each gap is carried to the stage that
builds it, in the "Legal" subsection at the end of that stage.

