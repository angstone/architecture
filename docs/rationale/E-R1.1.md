Rationale for: R1.1

Non-normative. It explains rule R1.1 of `docs/spec/02-runtime.md` and creates no requirement; where it differs from the rule, the rule governs. Proposed by the model `claude-fable-5-1`, kept only after the identifier check of `scripts/fable-reduce.mjs`.

A `.ts` file in the repository serves only authoring: because the seal holds the compiled `.js` bytes and the cid hashes those bytes, no transpiler is part of the runtime cid. Author data such as legal name, contact or country belongs to the `author-identity` record (R3.26), not to the manifest.
