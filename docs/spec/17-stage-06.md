**Merry 5.2** · `going_merry_alpha_5.2` · frozen · 2026-11-23 · commit 8157617

## Stage 6: no https dependence, the seed phone to phone, plugins per place

What it is: dependence on https is to be avoided, and the means must be as simple, secure and lawful as possible. A seed is
spread from one device to another, planted entirely by NFC: one device placed against the other plants the app already
carrying an invite. A design option under study: a QR code carries the URL of a node (from the generator) and enough
code for a web browser to reproduce it, reach the node relay and download everything. Plugins are signed code per place. Once installed, a device needs no https, DNS or CA to
stay on the network: it reaches peers over the carrier chosen in OI-8, behind the `Carrier` interface
that exists (network/src/interfaces/transport.ts; `simulatedCarrier` and `relayCarrier`,
network/test/transport.contract.test.ts). Proposal, from the requirement of no dependence on an app store: a native
shell (docs/plan/2026-11-11-native-shell.md) that carries the seed in the APK and shares it phone to phone.

Guarantees (threat model):
- A planted seed is verified under the compiled pins before it runs; a seed from a friend's phone is trusted exactly as
  one from the site (network/test/seed.plant.test.ts, seed.file.test.ts).
- Plugins per place: a plugin, shipped at Stage 5, is a sealed Lumi Action of R1 to R3; its manifest holds the R1.1 content (name, kind class, fuel, runtime cid range, permissions each with a purpose sentence in each language the plugin offers and a required or optional mark (a required one with a necessity sentence), place and tools, author key)
  (R1.1, R3.1) and its seed header carries the cid, never reducer code (planned; the seed file header is built to extend); a plugin result reaches a requester only as a bundle of at least `t` identical signed verdicts (R3.28), and the manifest names its author by key only, the legal identity being the `author-identity` record (R3.26).
- Limit: a device with no reachable carrier is offline; it keeps judging what it holds and refuses any chain that does
  not extend its pinned checkpoint (`pinnedHistory`, exists).

Passage condition (by code):
- network/test/transport.no-https.test.ts exits 0 (to be written once OI-8 is answered: two devices exchange a
  record over the chosen carrier, with no https, no DNS and no CA in the path; the receiver verifies the record
  itself, as network/test/hostile.peer.test.ts already asserts for the simulated carrier).
- Proposal, on the requirement of no dependence on an app store: a native shell
  whose `apksigner verify --print-certs app-release.apk` exits 0 and whose device test "plant, kill, offline, cold
  start, served" passes (to be written in native/; docs/plan/2026-11-11-native-shell.md risk 4).
- On alfa: a phone with no internet is planted from another phone and later syncs; the record names the seed version.

The user is told: en "Angstone passes from phone to phone and works without a website. Nobody can cut it off by taking
a server." / pt-BR "O Angstone passa de celular para celular e funciona sem site. Ninguém corta a rede derrubando um
servidor."

Code it adds: the chosen carrier (OI-8) as one more `Carrier` in network/src/impl/transport.ts (planned),
the cid field of the seed header (planned; the plugin manifest of R1.1 and its load check R3.1 ship at Stage 5), a built and signed APK from native/ (none built yet).

Code today: network/src/seed/{file,plant}.ts, network/src/login/pair.ts (network/test/pair.qr.test.ts), site/src/share/qr.ts
(site/src/share/qr.test.tsx), site/src/invite/, native/ (Capacitor scaffold; the ShareApk plugin,
native/android/app/src/main/java/org/angstone/limb/ShareApkPlugin.java and native/src/share-apk.ts; the build and
release-signing script native/scripts/build-apk.sh).

### Legal (Stage 6)

With the seed passed phone to phone, nobody tells a device which relays to trust except the seed it carries, so the legal
facts ride in it: Q10 and Q2 (country and operator contract) hold for every relay a seed lists, Q16 holds for every seed
a device hands on (no block list binds the receiving node), and Q11 the notice that events go to relays and where they
sit appears before the first send, offline too. Plugins per place add nothing to the duties of Angstone as supplier; a
plugin that serves minors or collects personal data is a processing and needs its row in Q41. Layers: Luminarkon (seed),
site (notice). Legal passage condition: the notice check and the seed checks exit 0 (to be written).

