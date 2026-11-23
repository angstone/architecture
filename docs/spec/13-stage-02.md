**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 2: the seedified network, a signed upgrade from any node, broadcast to all

What it is: the network is upgradable by an upgrade that comes from any node or device, is broadcast, is authorised by the
pinned authority (later the council) and spreads to all; everything travels in one seed. The broadcast of upgrades and
the first seed work; any node can then upgrade the rest, including for testing. On alfa: a seed
upgrade is signed by the seed pin set (today the one key of the first member, a single transitional authority) and published
from a device that is not the site's server; every device applies it and relays it on. The reducer sources travel in
the signed seed (the plan's work item N10), so a node refuses to run code the network did not sign.

Guarantees (threat model):
- A device applies a seed only when its signatures meet the pinned authority, every file hash matches and the version
  is newer than any it ran; a rollback is refused; a tampered byte is `HASH_MISMATCH` (network/src/seed/upgrade.ts,
  kernel.ts; network/test/seed.upgrade-broadcast.test.ts, seed.kernel.test.ts).
- The authority compiled into the worker is the only one a fresh device trusts; a stored authority that disagrees is
  `AUTHORITY_CONFLICT`, never a silent pick (network/src/seed/compiled.ts, worker.ts; network/test/seed.worker.test.ts).
- A node runs only reducers the signed seed lists (`reducer-cid-mismatch`; network/test/node.cid.test.ts).
- Plain limit: the seed pin set is one key. Whoever holds it publishes what every device runs. That limit closes
  when the council takes the key (stage 8; OI-9, decided: the pins stay the first member key's until then).

Passage condition (by code):
- network/test/seed.fleet.run.test.ts exits 0 (exists: one upgrade from any of twelve instances reaches all).
- network/test/seed.publish-any-device.test.ts exits 0 (exists, 8 cases, network dev 944b8a7: a device publishes a
  signed seed through a relay with no site; a second device applies it from the relay alone; a seed below the pinned
  authority, with a wrong hash or an older version is refused).
- site/src/store/seed.reducers.build.test.ts exits 0 (exists, 6 cases, site dev 6270cbf: the built manifest lists
  `reducers/ledger.seal.ts` and `reducers/record.attest.ts` with the `REDUCERS` cids; `startNode` with a manifest
  missing one refuses `reducer-cid-mismatch`).
- On alfa, owner action, the one part left: `node
  /home/ss/automation/projects/personal/angstone/network/scripts/seed-publish.ts --file <.aseed> --relay
  wss://alfa.angstone.app/relay --trust <pinned trust.json> --key <0600 file> --auth-user <u> --auth-password-file
  <f>` exits 0 from the limb or a phone, not from the droplet's site; then on a second device `node
  /home/ss/automation/projects/personal/angstone/network/scripts/seed-follow.ts --relay wss://alfa.angstone.app/relay
  --trust <pinned trust.json> --dir <dir> --expect-version $V --auth-user <u> --auth-password-file <f>` exits 0
  without visiting the site; the record site/docs/qa/<date>-stage-2-upgrade.md.

The user is told: en "Angstone updates itself from any device on the network, never only from a website. Every update
is signed and checked by your device." / pt-BR "O Angstone se atualiza a partir de qualquer aparelho da rede, nunca só
de um site. Toda atualização é assinada e verificada pelo seu aparelho."

Code it adds: the alfa record only; the code landed (below).

Code today: network/src/seed/{upgrade,kernel,compiled,worker,plant,file,manifest,verify,pins,trust,fleet,store-file}.ts;
network/scripts/{seed-sign,seed-verify,seed-publish,seed-follow}.ts (network dev 944b8a7); the site build step that puts
the reducer sources into the signed seed and hands the booted manifest to `startNode` (site dev 6270cbf);
site/src/store/{seed.ts,seed-engine.ts,seed-worker.ts}; network/src/node/cids.ts.

### Legal (Stage 2)

Requirements built here: the seed's relay list carries the legal facts of each relay (Q10 `country`, Q2 operator contract
accepted at entry, Q13 contact and terms published); Q16 a signed upgrade can never impose a block on a node that did not
adopt it (the upgrade carries code and seeds, never a removal order); Q20 the impact report of the public ledger, the
relay, the age check and the A6.11 delivery of an authorized 16-17 profile's fields to the drawn miner (the seed-listed key's node). Layers: Luminarkon (seed, upgrade), relay (NIP-11), site (impact report). Legal passage condition:
a genesis check refuses a relay entry without country or acceptance, and a check shows an upgrade cannot carry a block
(to be written).

