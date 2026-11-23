<p align="left">
  <img src="assets/social-preview.svg" alt="Angstone architecture, Merry 5.2.1" width="720">
</p>

# Angstone architecture

[![version](https://img.shields.io/badge/version-going__merry__alpha__5.2.1-1f6feb)](https://github.com/angstone/architecture/releases/tag/going_merry_alpha_5.2.1)
[![licence](https://img.shields.io/badge/licence-CC%20BY%204.0-2da44e)](LICENSE)
[![spec status](https://img.shields.io/badge/spec-frozen-8250df)](docs/spec/README.md)
[![R-ids](https://img.shields.io/badge/R--ids-105-0969da)](docs/spec/README.md)
[![spec checks](https://github.com/angstone/architecture/actions/workflows/spec-checks.yml/badge.svg)](https://github.com/angstone/architecture/actions/workflows/spec-checks.yml)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

**Angstone is a network where every device is a server.** There is no central operator to trust: a set of nodes that grows by stake seals one ledger by threshold signatures, every action a person takes is a sealed, versioned *Lumi Action* that runs the same rule set on every node, and no plugin reads a person's data without that person's signed, revocable grant. This repository is the architecture of Angstone: the normative specification, the reasoning behind it, the decisions with their alternatives, and the tests each rule is held to. It is architecture, not code: where a mechanism is built the text names the commit, where it is design only the text says so. Project site: <https://angstone.app>.

## The trust ladder

The path from one founding key to a council of AIs and a quantum-safe signature is ten stages. Each stage hands authority to a wider set, and each gate is a test, not a promise. Dashed stages are specified but not built.

```mermaid
flowchart LR
  S0["Stage 0<br/>one sealing key<br/>1 of 1"] --> S1["Stage 1<br/>three roots<br/>and the grant"]
  S1 --> S2["Stage 2<br/>signed upgrade<br/>from any node"]
  S2 --> S3["Stage 3<br/>2 of 2<br/>sealing set"]
  S3 --> S4["Stage 4<br/>growth by stake<br/>permissionless seats"]
  S4 --> S5["Stage 5<br/>every action a<br/>Lumi Action"]
  S5 --> S6["Stage 6<br/>no https dependence<br/>seed phone to phone"]
  S6 --> S7["Stage 7<br/>Theseus resistance<br/>for the late device"]
  S7 --> S8["Stage 8<br/>the council<br/>takes the key"]
  S8 --> S9["Stage 9<br/>quantum<br/>future-proofing"]
  S7 -.-> S7b["Stage 7b<br/>two finality tiers<br/>not built"]
  S8 -.-> S8b["Stage 8b<br/>proven inference<br/>not built"]
  classDef built fill:#e8f1ff,stroke:#1f6feb,color:#0b2a55
  classDef planned fill:#f6f8fa,stroke:#8c959f,color:#24292f,stroke-dasharray: 5 3
  class S0,S1,S2,S3,S4,S5,S6,S7,S8,S9 built
  class S7b,S8b planned
```

## Node, runtime, plugin, grant

A plugin is code written by someone else. It never touches a person's data directly: the runtime that the network itself signed injects a versioned API, and every read passes through a grant the person signed and the network countersigned.

```mermaid
flowchart TB
  subgraph person["Person's device"]
    UK["user key"]
    G["grant record<br/>plugin cid, permissions,<br/>runs per epoch, expiry"]
  end
  subgraph net["Network, epoch in force"]
    M["members, t of n<br/>countersign"]
    L[("ledger head<br/>runtimeVersion<br/>grantLogRoot")]
  end
  subgraph node["Node, executor"]
    RT["signed runtime record<br/>injects the versioned API"]
    CHK{"both signatures<br/>valid and log fresh?"}
    PA["plugin Lumi Action<br/>sealed, no imports"]
  end
  UK -->|signs| G
  G -->|submitted to| M
  M -->|countersigned grant| L
  L -->|finalized grant log| CHK
  RT --> CHK
  CHK -->|yes| PA
  CHK -->|no| REF["signed refusal<br/>unsigned-grant or stale-log"]
  PA -->|reads only what the grant names| OUT["signed output"]
```

## Admission and revocation

Admission is default-deny: a node refuses an action it cannot prove sealed, a plugin it cannot match to a catalog entry and a run without a valid grant. Revocation names exactly one grant, is signed by the person and reaches every node of the epoch within a bounded window.

```mermaid
sequenceDiagram
  autonumber
  participant P as Person
  participant N as Members t of n
  participant E as Executor node
  participant X as Plugin
  P->>N: grant record signed with the user key
  N->>N: network rule checks the record
  N-->>P: countersignature, grant enters the grant log
  X->>E: run request for a cid with the grant digest
  E->>E: check seal, cid, both signatures, log freshness
  alt any check fails
    E-->>X: signed refusal with a named class
  else all checks hold
    E-->>X: run inside the injected runtime, signed output
  end
  P->>N: revocation signed, names one grant digest
  N-->>P: receipt, revocation enters the log root
  N-->>E: log root within FINALITY_WINDOW_S
  X->>E: next run request
  E-->>X: refused, the grant is revoked at the finalized head
```

## The release gate

Nothing ships on trust in a person or a tool. The gate that decides is pinned by digest outside the tree under test, a commit needs reviewers who did not write it, and the scale battery runs the byzantine shapes before a record is signed (rules R4.1 to R4.15).

```mermaid
flowchart LR
  C["commit<br/>signed by its<br/>author's key"] --> R["two reviews by<br/>release-key holders<br/>neither author nor committer"]
  R --> V["server-side check<br/>pinned validator<br/>no skip flag, no bypass"]
  V --> B["scale battery<br/>n = 3, 7, 21, 51<br/>at least 100 seeded runs each"]
  B --> REC["release record<br/>signed by 2 or more holders<br/>none an author"]
  REC --> A["attestation<br/>harness digest matches the pin"]
  A --> D["ship, deploy, serve"]
  V -. red .-> X["blocked"]
  B -. red .-> X
  A -. mismatch .-> X
```

## How to read the spec

| you want | read | it is | it creates a requirement |
| --- | --- | --- | --- |
| what MUST hold | [`docs/spec/`](docs/spec/README.md) | the normative text, one rule per `R<section>.<n>`, each with its `Test:` and `Enforced at:` | yes |
| why a rule is the way it is | [`docs/rationale/`](docs/rationale) | one `E-R<section>.<n>.md` per rule that has a rationale | no |
| what was chosen over what | [`docs/decisions/`](docs/decisions) | numbered decision records with their alternatives | no |
| how a rule is proven | the `Test:` line of the rule | the test file and the cases that must refuse | the rule's own |
| what changed between versions | [`CHANGELOG.md`](CHANGELOG.md) | the diff in words | no |

Start with [`docs/spec/00-overview.md`](docs/spec/00-overview.md), then the stage you care about (`11-stage-00.md` to `22-stage-09.md`). Part R is `02-runtime.md` to `06-guidelines.md`.

## Attack and conformance tests

Each rule names the test that holds it in its `Test:` line. The tests live in the code repository of the project, which is **private: the links below are visible only to collaborators** (anyone else gets a 404). They are pinned to commit [`b5956b0`](https://github.com/angstone/angstone-network/commit/b5956b089faf9bd74a717da0191e6b33ef1b4fd6) of `angstone/angstone-network`. A test file a rule names that is not in that commit yet is a test still to be written: the rule is specified, the test is owed.

| spec part | scope | tests in the private repository (collaborators only) |
| --- | --- | --- |
| [`docs/spec/02-runtime.md`](docs/spec/02-runtime.md) | R1 Sealed Lumi Actions and the runtime | [`test/lumi.caps.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.caps.test.ts)<br>[`test/lumi.cid.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.cid.test.ts)<br>[`test/lumi.domain.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.domain.test.ts)<br>[`test/lumi.official-range.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-range.test.ts)<br>[`test/lumi.runtime-cid.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-cid.test.ts)<br>[`test/lumi.runtime-sign.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-sign.test.ts)<br>[`test/lumi.runtime-stale.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-stale.test.ts)<br>[`test/lumi.runtime-upgrade.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-upgrade.test.ts)<br>[`test/lumi.seal.forms.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.forms.test.ts)<br>[`test/lumi.seal.inside.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.inside.test.ts)<br>[`test/lumi.seal.unit.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.unit.test.ts)<br>[`test/lumi.surface.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.surface.test.ts) |
| [`docs/spec/03-executor.md`](docs/spec/03-executor.md) | R2 Executor protections | [`test/lumi.limits-order.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-order.test.ts)<br>[`test/lumi.limits-record.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-record.test.ts)<br>[`test/lumi.load-verify.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.load-verify.test.ts)<br>[`test/lumi.metering-constants.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.metering-constants.test.ts) |
| [`docs/spec/04-plugins.md`](docs/spec/04-plugins.md) | R3 Plugin actions and permissions | [`test/lumi.official-limited.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-limited.test.ts)<br>[`test/lumi.official-list.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-list.test.ts) |
| [`docs/spec/06-guidelines.md`](docs/spec/06-guidelines.md) | R5 Code guideline gate | [`test/guidelines/compile.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/compile.test.ts)<br>[`test/guidelines/constants.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/constants.test.ts)<br>[`test/guidelines/drawers.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/drawers.test.ts)<br>[`test/guidelines/exit.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/exit.test.ts)<br>[`test/guidelines/gates.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/gates.test.ts)<br>[`test/guidelines/imports.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/imports.test.ts)<br>[`test/guidelines/interfaces.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/interfaces.test.ts)<br>[`test/guidelines/lint.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/lint.test.ts)<br>[`test/guidelines/python.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/python.test.ts)<br>[`test/guidelines/scope.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/scope.test.ts)<br>[`test/guidelines/seal.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/seal.test.ts)<br>[`test/guidelines/type-surface.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/guidelines/type-surface.test.ts)<br>[`test/lumi.caps.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.caps.test.ts)<br>[`test/lumi.cid.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.cid.test.ts)<br>[`test/lumi.domain.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.domain.test.ts)<br>[`test/lumi.limits-order.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-order.test.ts)<br>[`test/lumi.limits-record.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.limits-record.test.ts)<br>[`test/lumi.load-verify.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.load-verify.test.ts)<br>[`test/lumi.metering-constants.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.metering-constants.test.ts)<br>[`test/lumi.official-limited.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-limited.test.ts)<br>[`test/lumi.official-list.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-list.test.ts)<br>[`test/lumi.official-range.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.official-range.test.ts)<br>[`test/lumi.runtime-cid.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-cid.test.ts)<br>[`test/lumi.runtime-sign.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-sign.test.ts)<br>[`test/lumi.runtime-stale.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-stale.test.ts)<br>[`test/lumi.runtime-upgrade.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.runtime-upgrade.test.ts)<br>[`test/lumi.seal.forms.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.forms.test.ts)<br>[`test/lumi.seal.inside.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.inside.test.ts)<br>[`test/lumi.seal.unit.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.seal.unit.test.ts)<br>[`test/lumi.surface.test.ts`](https://github.com/angstone/angstone-network/blob/b5956b089faf9bd74a717da0191e6b33ef1b4fd6/test/lumi.surface.test.ts) |

## Versions

| version | tag | status |
| --- | --- | --- |
| Merry 5.2.1 | `going_merry_alpha_5.2.1` | frozen, in force (erratum of 5.2: the release token only, no requirement changed) |
| Merry 5.2 | `going_merry_alpha_5.2` | frozen, superseded by 5.2.1 |
| Merry 5.1 | `going_merry_alpha_5.1` | frozen, superseded by 5.2 |
| Merry 5 | `going_merry_alpha_5` | frozen, superseded |
| Merry 2 | `going_merry_alpha_2` | frozen, superseded |
| alpha 1 | `architecture-alpha-1` | frozen, superseded |

Only Merry 5.2.1 and its tag are published here (the tag of 5.2 is kept, never moved); earlier versions live in the project's private history and their texts are not part of this repository. A tag is never moved.

## How to contribute

Humans and AIs are welcome. Every change is a pull request; the owner reviews and merges. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: a change to `docs/spec` cites the R-id it touches, adds or changes that rule's test reference and passes the checks, and a pull request written by an AI says so. Found a defect or an ambiguity? Open an [issue](https://github.com/angstone/architecture/issues/new/choose). A vulnerability goes through a private advisory, see [SECURITY.md](SECURITY.md). Conduct: [Contributor Covenant 2.1](CODE_OF_CONDUCT.md).

The text at the tag is frozen: a proposal that changes a requirement is a proposal for the next version, and is merged on `main` as such, never by editing history or moving the tag.

## How to verify

```sh
git clone https://github.com/angstone/architecture && cd architecture
git rev-parse 'going_merry_alpha_5.2.1^{commit}'     # the commit the tag names
git diff --stat going_merry_alpha_5.2.1 -- docs      # empty: the spec is the tag's text
node scripts/check-spec.mjs                          # 105 R-ids once, rationale pointers, one header
node scripts/check-names.mjs                         # no natural person is named
node scripts/check-links.mjs                         # every relative link resolves
sha256sum -c SHA256SUMS                              # after downloading the release assets next to it
```

- Tag: `going_merry_alpha_5.2.1`. The tag commit is printed by `git rev-parse` above and listed in the [release notes](https://github.com/angstone/architecture/releases/tag/going_merry_alpha_5.2.1).
- The `commit 8157617` in each spec header is the commit of the project's source repository that froze the 5.2 text this version corrects; the tag of this repository names the published commit.
- The release carries the paper, the full specification as one PDF and `SHA256SUMS`.

## Licence and editorial note

Text licensed under [CC BY 4.0](LICENSE). The specification is the frozen text of the version; the only edit made for this publication is that 2 mentions of a natural person's name were replaced by "the owner". Paths in the text (for example `network/`, `site/`, `test/`) refer to the code repositories of the project, not to this one. Cite as in [CITATION.cff](CITATION.cff).
