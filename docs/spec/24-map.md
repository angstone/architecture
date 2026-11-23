**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## 3. Map: every plan to its stage

### 3.1 docs/plan/2026-11-11-luminarkon-node.md, by section

| section | stage | note |
| --- | --- | --- |
| 1 Outcome | 0, 3 | the node on every device is 0 (landed); two device nodes sealing on the test network is 3 |
| 2 What exists | 0 | the inventory |
| 3 Alternatives and the choice | 0 | Alt 1 landed |
| 4 Design of Alt 1 | 0 to 6 | its subsections below |
| 4.1 Module layout | 0 | landed |
| 4.2 The node key | 0 | landed (key.ts) |
| 4.3 Validation | 0, 5 | rules and vectors landed; the Python duplicate retires at 5 |
| 4.4 Attestation | 0, 3 | the node record (kind 8917) landed; the proposed node announcement (kind 31990) is 3 |
| 4.5 The threshold seal | 0, 3, 4 | threshold 1 live at 0; 2 of 2 at 3; growth at 4; FROST OI-10 |
| 4.6 Sync | 0, 6 | relay carrier and the checkpoint pin landed; the direct carrier is 6 |
| 4.7 Listing as a node | 0, 3, 5 | allow list at 0; `kinds` field at 3; retired for the bind at 5 |
| 4.8 Custody and recovery | 3 | rotation by `epoch` entry; its 2-of-3 recommendation is retired by the 2-of-2 ruling (OI-2) |
| 5 Security claims | 0 | each claim's test exists |
| 6 First live slice | 0, 3 | the plan's work items N1-N8 (network), S1, S2 (site) landed; the test-network live proof is stage 3's passage |
| 7 Open source | 1 | LICENSE waits on owner action (OI-13) |
| 8.1 Relays by IP, pinned | 6 | OI-8 |
| 8.2 Nearby mesh | 6 | OI-8 |
| 8.3 Bridges | 6 | OI-8 |
| 8.4 The shell as a node | 6 | |
| 8.5 A Node relay calling rules.ts; FROST | 5; OI-10 | |
| 8.6 Admission by the node announcement (kind 31990) instead of the allow list | 5 | |
| 9 ETA | retired | the slice landed |
| 10 Worktrees | retired | the forks are merged |
| 11 Stake | 4, 7 | the stake table is 4; its slash item is OI-3; the bond after exit (part 6 of 1.5) is 7 |
| 12 The test network genesis by the ladder | 0, 1, 3 | steps 1-5 are the runbook (0, 1); step 6 is 3 |
| 13 Glossary and the naming guard | 0, every stage | landed; network/test/glossary.guard.test.ts |
| 14 Economy | 0, 4 | the `reward` rule landed; the node-to-account binding is 4 |
| 15 Plan review | 0 to 6 | H1-H6 and M1-M13 landed or placed as the stages above say |
| 16 N7 the typed contract | 0 | landed (contract.ts) |
| 17 N8 the reward reducer | 0, 4 | landed; live crediting at 4 |
| 18 Five drawers | every stage | the frame (1.10) |

### 3.2 The other plan files

| file | stage | note |
| --- | --- | --- |
| docs/plan/2026-11-10-new-network.md | 0, 2 | P1-P10 landed; P11 the test-network run is stage 0's passage; making the site a seed is stage 2 |
| network/docs/plan/2026-11-11-stage-2-upgrade-from-any-node.md | 2 | seed-publish and seed-follow; landed, network dev 944b8a7 |
| site/docs/plan/2026-11-11-stage-2-reducers-in-seed.md | 2 | the reducer sources in the signed seed; landed, site dev 6270cbf |
| docs/plan/2026-11-11-architecture-research.md | every stage | snippet-only research for the alternatives of section 4; nothing in it is a fact of this document |
| docs/plan/2026-11-11-input-pipes.md | 0, 5 | items 1-13 landed (fields.ts, the site pipes, the boundary matrix and gate); items 14-15 (relay ports) land at 5 |
| docs/plan/2026-11-11-native-shell.md | 6 | the shell as a node, the APK, phone-to-phone install; blocked on JDK 21 and the SDK |
| docs/plan/network-seed-and-login.md | 0 | landed; superseded by 2026-11-10-new-network.md |
| docs/plan/login-e2e.md | 0 | landed |
| docs/plan/todo.md | 0, 2, 6 | the seed as one file (A1-A4) is 2 and 6; the native body is 6; older sections history |
| docs/plan/car-mode.md, car-capture-m0.md, car-device-token.md, car-passenger.md, car-voice.md | open (product) | Angstone Car, parked; not on the trust ladder; its code stays |
| docs/plan/limb-android.md | retired | superseded by 2026-11-11-native-shell.md |
| docs/plan/map-engine.md | open (product) | research only |
| site/docs/plan/2026-11-06-bug-bounty.md | 0, 8 | the `bounty` entry and the registry landed; issuance by the council only is 8 |
| site/docs/plan/2026-11-08-tools-owner-stack.md | 0 | product; landed |
| site/docs/plan/2026-11-09-account-storage-redo.md | 0, 5 | profile records on the network landed; every field through the nodes is 5 |
| site/docs/plan/2026-11-09-with-who-location.md | 5 | a message is a Lumi Action at 5; legal rule before promotion |
| site/docs/plan/2026-11-10-seo-geo-aio.md | 0 | the build's discoverability files (site/src/discover/discover.ts; site/src/discover/discover-build.test.ts); not on the trust ladder |

Nothing above is orphan: each row is a stage, "open (product)" with its reason, or "retired" with what replaced it.

