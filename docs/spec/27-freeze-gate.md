**Angstone Architecture — Merry 5.2.1** · `merry-5.2.1` · frozen · 2026-11-23 · commit 8157617

## Freeze gate: what must be true before this version is frozen

An architecture is the design, the target and the path, not the implementation. Only what is new and uncertain is proven
in code, as the Theseus resistance was (1.5). The proof scope is Luminarkon, people signing,
and the minor council; whether
the minor council's answers agree (the same within one server process in the original ticket order, 2/3 across processes
and nodes, never byte-identical by guarantee) is new and uncertain, so it is proven in code (G14). The freeze does not wait
for implementation: G4, G5, G6 and G7 are implementation work under their stages, not conditions to freeze; their rows below
stay as the record of that work.

The freeze is an owner action; nothing below freezes by itself. Each item is a command that prints nothing, or exits 0, when the item
holds; run from the workspace root. The table names each gate, what must be true and the expected result; the commands are in the fenced block below the table, under the gate id, with the variables defined at its top. Test runs go through
the offload runner `bin/ed-offload` (the limb), never the host. A row marked **open** was false when this section was written (2026-11-15).

**No contradiction, ever.** Every pair of passages that state rules in conflict is a grave design flaw, at least HIGH,
never editorial, because from a contradiction anything follows. The freeze criteria are G1-G3, G8-G14 and G22-G24 (G4-G7 are implementation work and G15-G21 launch gates, not freeze conditions) and the owner's action; G24 requires the last review's contradiction pass, which compares every pair of passages stating rules, to find 0 contradictions and 0 CRITICAL and 0 HIGH.

| # | Item that must be true | Proof (the command is under its gate id below) | Status when written |
| --- | --- | --- | --- |
| G1 | The document is the candidate: the version section, the feature section, the legal section and the freeze gate are in the home's file | prints nothing (no line `missing: ...`) | open until the fork lands |
| G2 | Every requirement Q1-Q56 and every decision D1-D18 is in the document | prints nothing (no line `missing ...`) | holds on the fork |
| G3 | No fork branch of the project repository is left unmerged into dev (the law fork included); the network and site forks are G4 | prints nothing, and the log command prints a line (the block asserts it) | open (the law fork's merge task was red at last status) |
| G4 | (implementation work, not a freeze condition) The council, 1 ANG, screens, public profile and return forks are landed in the network and site repositories | prints nothing (the G3 branch listing, run for these forks) | open |
| G5 | (implementation work, not a freeze condition) The network's check is green on dev: `npm run compile && npx vitest run` over the network package, excluding the invite-login, passkey-login and relay-scale tests | exits 0 | to be run at the gate |
| G6 | (implementation work, not a freeze condition) The site's check is green on dev: `npm run compile` over the site package, and `npm test` for the profile, return, explorer and council tests | exits 0 | to be run at the gate |
| G7 | (implementation work, not a freeze condition) The council pool, the welcome grant and the public profile vectors are tested | exits 0 | open until G4 |
| G8 | The zk age design document is written | exits 0 | open (the directory did not exist) |
| G9 | The Where for institutions design document is written | exits 0 | open (the directory did not exist) |
| G10 | This file cites both design documents by their exact paths, outside the gate | prints nothing (the block asserts at least 2 cites for each of the two paths) | holds on the fork |
| G11 | Nothing of the release was deployed before the freeze: no worker deploys anything before the freeze | the tag listing prints nothing, and the deploy-log grep for the release tag prints nothing | holds when the commands print nothing |
| G12 | The open items owed an answer are answered: the welcome grant (`WELCOME_GRANT`, decided: automatic, signed by Luminarkon, ruling `welcome-grant-automatic-signed-by-luminarkon`, recorded by adding the line `  value_of: WELCOME_GRANT` to that ruling), whether roots receive the grant (`ROOTS_GRANT`), the economic-parameters default X (`X_DEFAULT`, 1 ANG), the officer (`OFFICER_D1`, D1), the provider position (`PROVIDER_D5`, D5), `M`, `D_MAX` and `S` of the council penalty (decided: `M` = 50, `D_MAX` = 10%, `S` = 3, ruling `angstone-minor-council-m50-dmax10-s3`, recorded by adding the lines `  value_of: M`, `  value_of: D_MAX` and `  value_of: S` to that ruling; until then the gate is red for those four names), whether the root keys change at the freeze (`ROOT_KEYS_CHANGE`), and every value a row marks as awaiting an owner value (`K_MAX`, `ONLINE_WINDOW_S`, the `dl` and `mm` defaults, `RL`, `REPORT_PER_EPOCH`, `OPEN_PER_MINER`, `invite_per_member`, `MAX_GRANT_EPOCHS` (OI-40), `FINALITY_WINDOW_S` (OI-41), `LIVENESS_CURE_EPOCHS` (OI-42), `buckets`, `queryCharge`, `nMax`, `supportedDevices` and `consent` of OI-43 (`RELEASE_HOLDERS_MIN` keeps its default 5 and is not gated), `ISSUE_PER_CHECKPOINT`, the Delta of OI-32, the stake and epoch numbers of OI-31, `PIN_DELAY_S` (section "Illegal content and the council"), `FACE_AGE_MODEL`, `FACE_AGE_BAR_MARGIN` and `AGE_SCHEME` of A6.6, `TICKET_TEXT_MAX`, `MIN_EPOCH_SPAN`, `MAX_EPOCH_SPAN`, `MAX_EPOCH_SPAN_SEQS`, `PROPOSE_EVERY_S`, `BOND_WINDOW`, `BOND_AMOUNT`, `SEED_VALIDITY_S`, `EPOCH_MIN_S`, `CLOCK_SKEW_S` and `Delta`) | prints nothing: each name of the list of the G12 command has either a recorded ruling in `memory/RULINGS.yaml` (the path is relative to the workspace root), keyed by a ruling whose line is exactly `- id: <NAME>` or that carries the line `  value_of: <NAME>`, or a line `  accepted_open: <NAME>` in the same ruling record (a match of the whole line; an unrelated mention of the word does not count); the gate is red until each name has one of the two | owner ruling |
| G13 | The legal decisions stay marked provisional until a lawyer confirms (the executor role of R3.9 and R3.10, the relay operators' reading A and the adequacy of Brazil for residents of the European Union, OI-44, are the lawyer's), counted outside the gate | prints nothing (the block asserts the count: at least 1 `provisional`) | holds on the fork |
| G14 | The same minor-council ticket gives the same answer on the same node within one server process in the original ticket order, and across the three nodes 2/3 agreement is reached on every measured ticket, so a lone dissenting node does not stop a ticket closing. Byte-identical answers ACROSS nodes are NOT guaranteed: the protocol relies on 2/3. On ONE node, byte replay holds only in one server process, in the same ticket order as the original run (reload or not), and breaks when the order is reversed after a reload and across server processes of the same node (round 4; no single variable explains it) | prints nothing (the four reports, each present and non-empty); the directory is `G14_REPORTS` | **MEASURED**, reports `1b2348de3` (round 1, qwen2.5:1.5b-instruct), `7e9ef1fbb` (round 2, qwen3:1.7b), `aa9c94a73` (round 3), `5004f5df5` (round 4). Same node, same ticket: r1 200/200 (reversed after reload, and interleaved), r2 200/200 (reversed after reload; 4 concurrent), r3 197/200 final verdicts (reversed after unload/reload, GPU), r4 located the divergence: 855/855 answers identical in five arms of one server process in the original order, 2/855 differ when reversed after a reload, and 5/855 answers (1/200 final verdicts) differ across server processes of the same node. GPU vs CPU: 198/200 (r1), 198/200 (r2), 199/200 (r3). Three nodes (simulated from three runs on one machine: GPU, GPU mixed or reloaded, CPU): 2/3 reached on 200/200 tickets in r2 (198 unanimous, 2 split 2-1) and in r3 (197 unanimous, 3 split 2-1); with two verdicts and three nodes a majority always exists, and 2/3 absorbs a lone outlier, not a systematic backend split. Not covered by these reports and still unmeasured here: the flow checks of 1.12. Moderation quality (r3: adversarial REJECT 14/20 = 70.0% against a 90% bar) and the choice of model and parameters are NOT freeze conditions: they are OI-19. |
| G15 | (launch gate, not a freeze condition) The pin key's custody, the pre-committed next pin and the delay window are written before any real user or real data | prints nothing now (the row is written); the row's own test exits 0 before the delivery | open (design written, not built) |
| G16 | (launch gate) The known-hash screen of photos runs before the first photo ticket, the GPUs of the initial operators included, and before a seed relay serves the photo; every hit is communicated to the authority and held above erasure and purge | prints nothing now; each row's own test exits 0 before the first photo ticket or photo record | open (design written, not built) |
| G17 | (launch gate) Derived `k`, `dl`, `mm`, commit and reveal, seal-order answers (A1.7 sealed), the seed-only miner until 3 PCs (A1.13) and the inviter's liability hold before the first non-founder miner | prints nothing now; their own tests exit 0 before the first stranger miner | open (concept written, not built) |
| G18 | (launch gate) The face-age check on the device holds before any real user enters | prints nothing now; the row's own traffic-capture test exits 0 before any real user | open (concept written; model, bar margin and scheme await an owner value) |
| G19 | (launch gate) Only Luminarkon or the major council can set the economic parameters, ordered by the seal order, before the first non-founder miner | prints nothing now; the row's own test exits 0 before the first stranger miner | open (concept written, not built) |
| G20 | (launch gate) No ban of an inviter executes before the code matches A2.9-A2.13: a ban revokes the inviter's own key and rights, never its subtree, and burns its balance and stake | prints nothing now; the row's own test (network/test/login.invite.test.ts, "a ban of k leaves k's invitee m a member that may still write") exits 0 before the first ban is run in production | open (concept written; the code contradicts today, A2.12) |
| G21 | (launch gate) No 16-17 profile turns public before the guardian's signed authorization is checked by the network and the proof of guardianship is written | prints nothing now; the row's own test (A6.9 a-c) exits 0 before any 16-17 profile is public | open (rows written; the proof that the key's holder is the guardian awaits an owner ruling and the lawyer's guardian clause of D16) |
| G22 | Part R is present: sections R1 to R5 exist and all 105 R-ids (R1.1-R1.17, R2.1-R2.20, R3.1-R3.39, R4.1-R4.15, R5.1-R5.14) are defined, each with a row in the index; the registry R0 exists with its five tables, every `REFUSED:<class>` spelling named anywhere in the document is a row of R0(a), and every domain prefix `angstone/lumi-<type>/v1` named anywhere in the document is a row of R0(b); the runtime-record constants (R2.18, R3.10) are the rows of R0(c) | prints nothing | holds on this candidate |
| G23 | The document is neutral and impersonal: no person name, no message id, no quotation of a person, no forbidden third-party product word, no name of an earlier version, the release token only in the Names section; the three files under `tools/` (`forbidden-names.txt`, `forbidden-words.txt`, `quote-allow.txt`, under `projects/personal/angstone/`) are deliverables of the assembly and are created with it | every command prints nothing | open until the assembly passes |
| G24 | The last adversarial review has zero CRITICAL and zero HIGH findings, and its contradiction pass finds 0 contradictions; the findings file has one line per finding and no other text, and an empty file means zero findings | exits 0 | open until the review is run on the assembled document |

The commands, one block, run from the workspace root (each gate's expected result is the one the table states, and the block prints a `... red` line or exits non-zero when a gate that asserts a count fails):

```
P=projects/personal/angstone
D=$P/docs/ARCHITECTURE.md
TAG=$(sed -n 's/^- The architecture version is named .*This document is the current version, `\([a-z_0-9.]*\)` (the release token.*$/\1/p' $D)
G14_REPORTS=.ai-docs/analysis
FORBIDDEN_NAMES=$P/tools/forbidden-names.txt
FORBIDDEN_WORDS=$P/tools/forbidden-words.txt
QUOTE_ALLOW=$P/tools/quote-allow.txt

# G1
for h in "## This version" "## Features ordered 2026-11-15" "## Legal compliance in a serverless network" "## Freeze gate"; do grep -q "$h" $D || echo "missing: $h"; done

# G2
for q in $(seq 1 56); do grep -Eq "^\| Q$q \||\*\*Q$q\*\*" $D || echo "missing Q$q"; done; for d in $(seq 1 18); do grep -q "D$d[^0-9]" $D || echo "missing D$d"; done

# G3
for r in $P; do git -C $r branch --no-merged dev --list 'fork/*'; done
test -n "$(git -C $P log dev --oneline --grep=architecture-law)" || echo "G3 red: no architecture-law commit"

# G4
for r in $P/network $P/site; do git -C $r branch --no-merged dev --list 'fork/*'; done

# G5
bin/ed-offload personal/angstone/network --kind test -- sh -c 'npm run compile && npx vitest run --exclude test/login.invite.test.ts --exclude test/passkey-login.test.ts --exclude test/relay.scale.test.ts'

# G6
bin/ed-offload personal/angstone/site --kind test -- npm run compile
bin/ed-offload personal/angstone/site --kind test -- npm test

# G7
bin/ed-offload personal/angstone/network --kind test -- npx vitest run test/council.pool.test.ts test/ledger.welcome-grant.test.ts test/ledger.grant-script.test.ts test/validate.fields.test.ts

# G8
test -s $P/docs/design/2026-11-15-zk-age.md

# G9
test -s $P/docs/design/2026-11-15-where-institutions.md

# G10
for f in zk-age where-institutions; do test "$(sed '/^## Freeze gate/,$d' $D | grep -c "docs/design/2026-11-15-$f.md")" -ge 2 || echo "G10 red: $f"; done

# G11
git -C $P tag --list "$TAG"
grep -n "deploy.*$TAG" memory/HANDOFF.md

# G12 (red until each value has a recorded ruling)
for v in WELCOME_GRANT ROOTS_GRANT X_DEFAULT OFFICER_D1 PROVIDER_D5 M D_MAX S ROOT_KEYS_CHANGE K_MAX ONLINE_WINDOW_S REPORT_PER_EPOCH OPEN_PER_MINER invite_per_member MAX_GRANT_EPOCHS FINALITY_WINDOW_S LIVENESS_CURE_EPOCHS ISSUE_PER_CHECKPOINT TICKET_TEXT_MAX MIN_EPOCH_SPAN MAX_EPOCH_SPAN MAX_EPOCH_SPAN_SEQS PROPOSE_EVERY_S BOND_WINDOW BOND_AMOUNT SEED_VALIDITY_S EPOCH_MIN_S CLOCK_SKEW_S PIN_DELAY_S FACE_AGE_MODEL FACE_AGE_BAR_MARGIN AGE_SCHEME Delta buckets queryCharge nMax supportedDevices consent RL dl mm; do grep -Eq "^- id: $v$|^  value_of: $v$|^  accepted_open: $v$" memory/RULINGS.yaml || echo "G12 red: $v"; done

# G13
test "$(sed '/^## Freeze gate/,$d' $D | grep -c "provisional")" -ge 1 || echo "G13 red"

# G14
for r in determinism r2 r3 r4; do for f in "$G14_REPORTS"/*g14-$r.md; do test -s "$f" || echo "missing: $r"; done; done

# G15
for r in Q52; do grep -q "^- \*\*$r\*\*" $D || echo "missing $r"; done

# G16
for r in Q53 Q55 Q56; do grep -q "^- \*\*$r\*\*" $D || echo "missing $r"; done

# G17
for r in A1.10 A1.11 A1.12 A1.13 A2.8; do grep -q "^| $r " $D || echo "missing $r"; done

# G18
grep -q "^| A6.6 " $D || echo "missing A6.6"; grep -q "^- \*\*Q54\*\*" $D || echo "missing Q54"

# G19
for r in A3.6; do grep -q "^| $r " $D || echo "missing $r"; done

# G20
for r in A2.9 A2.10 A2.11 A2.12 A2.13; do grep -q "^| $r " $D || echo "missing $r"; done

# G21
for r in A6.8 A6.9 A6.10; do grep -q "^| $r " $D || echo "missing $r"; done

# G22
for r in R1 R2 R3 R4 R5; do grep -Eq "^#{2,4} $r[. :]" $D || echo "missing section $r"; done
for id in $(sed -n '/^## R\./,/^## 2\./p' $D | grep -Eo '^\| R[1-5]\.[0-9]+' | tr -d '| '); do grep -Eq "^\*\*$id[ .]" $D || echo "missing definition $id"; done
for id in $(grep -Eo '^\*\*R[1-5]\.[0-9]+' $D | tr -d '*'); do grep -Eq "^\| $id " $D || echo "missing index row $id"; done
test $(grep -Eo '^\*\*R[1-5]\.[0-9]+' $D | sort -u | wc -l) -eq 105 || echo "R-id count is not 105"
R0=$(sed -n '/^### R0 Registry/,/^### R1 /p' $D)
for r in a b c d e; do echo "$R0" | grep -q "^\*\*R0($r) " || echo "missing registry table R0($r)"; grep -q "^| R0.$r " $D || echo "missing index row R0.$r"; done
for c in $(grep -Eo 'REFUSED:[a-z][a-z-]*' $D | sort -u | cut -d: -f2); do echo "$R0" | grep -Fq "| \`REFUSED:$c\` |" || echo "missing refusal class $c in R0(a)"; done
for p in $(grep -Eo 'angstone/lumi-[a-z-]+/v1' $D | sort -u); do echo "$R0" | grep -Fq "\`$p" || echo "missing prefix $p in R0(b)"; done
for c in metering.releaseLatencyBucket metering.fuelQuantum grantEpochs.MAX_GRANT_EPOCHS grantEpochs.MAX_EPOCH_SPAN buckets.revocationVerificationShare buckets.maxLiveGrants buckets.proofLaneShare buckets.tableCap buckets.invitedKeysPerRoot; do echo "$R0" | grep -Fq "| \`$c\` |" || echo "missing R0(c) row $c"; done

# G23
test -s $FORBIDDEN_NAMES && test -s $FORBIDDEN_WORDS && test -s $QUOTE_ALLOW || echo "missing pattern or allow file"
grep -nEf $FORBIDDEN_NAMES $D
grep -niwEf $FORBIDDEN_WORDS $D
grep -nE "#[0-9]{4,5}" $D
awk -F'"' 'NF%2==1{for(i=2;i<=NF;i+=2) if(length($i)>=25) print "\"" $i "\""}' $D | sort -u | diff - $QUOTE_ALLOW
test "$(grep -c "$TAG" $D)" = 1 || echo "release token not once in the Names section"

# G24
REVIEW=${REVIEW:?set the findings file of the last adversarial review}
test -e $REVIEW && test "$(grep -Ec '^- (CRITICAL|HIGH)\b' $REVIEW)" = 0
```

The pattern files of G23 are `$P/tools/forbidden-names.txt` (person, organisation and earlier-version names) and `$P/tools/forbidden-words.txt` (whole words, including the third-party product word), written with the assembly; `$QUOTE_ALLOW` is the sorted list of the quoted spans over 25 characters that are allowed (literal identifiers, constants, UI strings and code, never a person's words); the diff against it prints nothing. The token check of G23 counts the release token in the document and passes only when it stands once, in the Names section; `$TAG` is derived from that line. The span check of G23 reads only lines with an even number of `"` characters, so a quote never pairs across prose, and the three pattern files are created with the assembly. The command of G11 reads the deploy log (`memory/HANDOFF.md`); it names no deploy of the release at any time before the freeze.


Not a gate item, stated plainly: Q1-Q56 and the A-tables are requirements; most of their tests are "to be written" and the
stage that builds each one carries them. Freezing the release freezes the architecture, not a claim that the law is met.

**The freeze, an owner action, the exact commands (run by the operator after the owner acts; they publish nothing).** `$TAG`, the release token of the Names section:

```
cd projects/personal/angstone
git tag -a "$TAG" -m "$TAG frozen, <date>" dev
git -C network tag -a "$TAG" -m "$TAG frozen, <date>" dev
git -C site tag -a "$TAG" -m "$TAG frozen, <date>" dev
```

Pushing the tags to a remote is a separate, outward-facing step and stays an owner action.


