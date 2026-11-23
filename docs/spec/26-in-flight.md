**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## 5. In flight

- P1, stage 0: network/scripts/node-run.ts and ledger-grant.ts take `--auth-user --auth-password-file`; npub rows in
  allow. network 2b59ff2, done (network/test/relay.auth-gate.test.ts).
- P2, stage 0: trust.json mirrors the ledger genesis before each seed-sign. Runbook site faac818, done.
- P3, stage 0: Build A rebuilt on the test network from site d2ea445 and network 2b59ff2. Operator step; not done at this writing.
- P4, not on the path now: the pre-launch gate for production (real /termos and /privacidade, the discoverability
  tool, blind navigation, the published.yaml golden-source row, the legal second opinion, the contact word). Production
  is not pursued now. Its items belong to stage 5 (every record through the network) when production is requested again.
  None of them is in code today; the one branch started for item 15 (site, 271d814 and c8ef250) is parked, unmerged.
- P5, stage 6: the native APK (native/, Capacitor scaffold). Blocked on JDK 21 and the Android SDK on the limb.
- P6, stage 0 and every stage: the editorial boundary gate (site/scripts/boundary-gate.ts; site/src/qa/boundary-gate.test.ts)
  refuses a frontend merge without an ALLOW for every changed screen. Landed.
- Stage 1: Build B and the grant, the runbook's steps 3-6; waits on the three sign-ups and on P3.
- Stage 2: the next test-network step after stage 1. Its code landed on dev: the reducer sources in the signed seed (site dev
  6270cbf, site/src/store/seed.reducers.build.test.ts, 6 cases) and seed-publish.ts with seed-follow.ts (network dev
  944b8a7, network/test/seed.publish-any-device.test.ts, 8 cases). What is left is the test-network step itself, an
  operator step, with the two commands in the stage's passage condition.

