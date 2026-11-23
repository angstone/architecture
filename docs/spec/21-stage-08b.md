**Merry 5.2.1** · `going_merry_alpha_5.2.1` · frozen · 2026-11-23 · commit 8157617

## Stage 8b: a council seat with proven inference (future, after Stage 8; not built)

What it is: a proposal, adopted, that answers OI-7 (how a seat's model
version is proven). The approved model version is an on-chain commitment to its weights. Each seat's judgment carries
a proof of inference against that commitment. The prover is drawn by VRF, staked, and slashed when its proof fails.

Limits, said plainly:
- Only open weights, run on the seat's own hardware, can be proven this way.
- A closed model behind a vendor's API cannot be proven: the miner's key over its answer
  proves nothing about the model. Such a seat is a lite tier, never final on its own.

Prior art, ideas only, no code taken: Theseus AI Labs (a company, not the Theseus tests of Stage 7), "Tensor Commits":
KZG commitments over weight tensors and Terkle trees; linear operations proved, non-linear ones spot-checked, about 96%
detection (https://www.theseuschain.com/docs/tensor-commits); its tiers of provers
(https://www.theseuschain.com/docs/provers); its architecture whitepaper v1.0, April 2026.

Passage condition (by code):
- network/test/inference.commit.test.ts exits 0 (to be written: an approved model version is a sealed entry holding
  the commitment to its weights; a judgment naming another commitment is refused).
- network/test/inference.proof.test.ts exits 0 (to be written: a seat's judgment with a valid inference proof against
  the committed weights counts; one with a failed proof is refused and the prover, drawn by VRF and staked, is
  slashed; a judgment from a closed API model counts only in the lite tier, never final alone).

Code it adds: the model commitment entry, the proof check in the seat's reducer, the VRF draw of the prover (planned).

Code today: none.

