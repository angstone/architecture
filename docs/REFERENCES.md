# References

Non-normative. This file creates no requirement. It lists the external works that the specification (`docs/spec/`, Merry 5.2.1) names or relies on, where each can be read, and the licence it is published under. The specification cites these works by name and does not reproduce them. Licences marked "read at the source" were read at the linked source on 2026-11-23; the others are stated as the publisher states them and were not re-checked here.

## Cryptography and encodings

| work | what the specification uses it for | link | licence |
|---|---|---|---|
| FROST, RFC 9591, "The Flexible Round-Optimized Schnorr Threshold (FROST) Protocol for Two-Round Schnorr Signatures" (ciphersuite FROST(secp256k1, SHA-256)), typed in the text as `frost-secp256k1/1` | the council's group key whose secret shares are held by separate nodes (`docs/spec/07-target.md`, `24-map.md`, `25-open-items.md`) | https://www.rfc-editor.org/rfc/rfc9591 | © IETF Trust and the persons identified as authors; use under the IETF Trust Legal Provisions (read at the source) |
| SEC 2, "Recommended Elliptic Curve Domain Parameters" (secp256k1), Standards for Efficient Cryptography Group | the curve of every signature and key | https://www.secg.org/sec2-v2.pdf | © Certicom Research, as stated in the document; cited, not reproduced here |
| BIP-340, "Schnorr Signatures for secp256k1" | the signature scheme of keys and entries (`docs/spec/18-stage-07.md`, `25-open-items.md`) | https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki | BSD-2-Clause (the document's `License:` header, read at the source) |
| BLAKE3, "BLAKE3: one function, fast everywhere" (specification) | the digest of every signed record, BLAKE3-256 (`docs/spec/01-registry.md`, `02-runtime.md`) | https://github.com/BLAKE3-team/BLAKE3 and https://github.com/BLAKE3-team/BLAKE3-specs | the reference implementation: CC0 1.0, or alternatively Apache-2.0 (read at the source README) |
| SHA-256, FIPS 180-4 "Secure Hash Standard" | the hash inside FROST(secp256k1, SHA-256) and the `sha256` digests of the text | https://csrc.nist.gov/pubs/fips/180-4/upd1/final | NIST publication; a work of the US federal government, not subject to copyright in the United States (17 U.S.C. 105) |
| HMAC, RFC 2104 | the request digest of the plugin grant (`docs/spec/04-plugins.md`) | https://www.rfc-editor.org/rfc/rfc2104 | © IETF Trust; IETF Trust Legal Provisions |
| ML-DSA, FIPS 204, and ML-KEM, FIPS 203 | the post-quantum hybrid named as an open item (`docs/spec/25-open-items.md`) | https://csrc.nist.gov/pubs/fips/204/final and https://csrc.nist.gov/pubs/fips/203/final | NIST publications; US federal government works, not subject to copyright in the United States |
| WebAssembly Core Specification | the interpreter sandbox may run in WASM linear memory (`docs/spec/02-runtime.md`, `03-executor.md`) | https://www.w3.org/TR/wasm-core-2/ | © W3C; W3C permissive document licence (the notice on the specification, read at the source) |
| Passkeys, as standardised by W3C Web Authentication (WebAuthn) | the member's device credential and the account return (`docs/spec/04-plugins.md`, `09-features.md`) | https://www.w3.org/TR/webauthn-3/ | © W3C; W3C document licence |

## Protocol conventions

| work | what the specification uses it for | link | licence |
|---|---|---|---|
| RFC 2119 (BCP 14), "Key words for use in RFCs to Indicate Requirement Levels" | the meaning of MUST, SHOULD, MAY in `docs/spec/00-overview.md` | https://www.rfc-editor.org/rfc/rfc2119 | © IETF Trust; IETF Trust Legal Provisions |
| Nostr NIP-09, "Event Deletion Request" | the erasure event the client emits for its own records (`docs/spec/10-legal.md`, Q6) | https://github.com/nostr-protocol/nips/blob/master/09.md | public domain ("All NIPs are public domain", read at the source) |
| Nostr NIP-11, "Relay Information Document" | the relay's published contact and terms (`docs/spec/10-legal.md`, `13-stage-02.md`) | https://github.com/nostr-protocol/nips/blob/master/11.md | public domain (same statement) |
| Unicode Technical Standard #39, "Unicode Security Mechanisms" (confusable skeletons) | display-name exclusivity and the moderation fold (`docs/spec/09-features.md`) | https://www.unicode.org/reports/tr39/ | © Unicode, Inc.; Unicode Terms of Use / Unicode License |
| Roboto typeface | the screens' typography, rule A3.4 (`docs/spec/09-features.md`) | https://github.com/googlefonts/roboto | Apache-2.0 (the repository `LICENSE`, read at the source) |

## Law named in the legal decisions (`docs/spec/10-legal.md`, `09-features.md`, `04-plugins.md`)

Statutes and official texts are cited by number and article; they are sources of law, not works this repository reproduces. Brazil: Lei 13.709/2018 (LGPD), Lei 12.965/2014 (Marco Civil da Internet, "MCI") and Decreto 8.771/2016, Lei 8.069/1990 (ECA, art. 241-A, 241-B and 190-F) with Lei 15.211/2025 ("ECA Digital"), Lei 14.478/2022, Lei 13.810/2019, Lei 13.718/2018, Lei 12.865/2013, Lei 12.850/2013, Lei 9.613/1998, Lei 9.296/1996, Lei 7.492/1986, Lei 6.385/1976, Lei 1.521/1951, the Penal Code (CP) and the Code of Criminal Procedure (CPP). European Union: Regulation (EU) 2016/679 (GDPR, Art. 46 transfer safeguards) and the guidelines of the European Data Protection Board (EDPB) the text cites by paragraph. Official sources: the Presidency's legislation portal, planalto.gov.br/ccivil_03, and EUR-Lex, eur-lex.europa.eu. Brazilian statutes are not protected by copyright (Lei 9.610/1998, art. 8, IV); EU legal texts are published by the EU Publications Office on EUR-Lex under its legal notice. The reading of these laws in the specification is the project's, is not legal advice, and a lawyer is named as the owner of the open items that depend on them.

## This repository's own licence

The text of this repository is licensed under [CC BY 4.0](../LICENSE); see [NOTICE.md](../NOTICE.md) for what that licence does and does not grant.
