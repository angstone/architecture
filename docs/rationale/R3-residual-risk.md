Rationale for: R3 (section residual risk, informative)

#### R3 residual risk (informative, not a requirement)

The following remain possible and are accepted, bounded and, where stated, audited:

- A plugin MAY return a wrong verdict for its own declared effect; the person who authorized it bears that effect, and
  the effect is labelled (R3.19).
- A plugin MAY encode up to the verdict's entropy bound (R3.18) of granted data into its verdict, per run; a grant
  therefore discloses at most the cumulative bit budget of its grant (R3.20); the bound is shown in the permission
  screen's risk line, which also says that an executor host reads the granted bytes in clear and is not bounded by it.
- Consent is evidenced by the digest of canonical text. A client other than the reference client may show different text; the grant record carries `clientId` (covered by the user signature) so the history screen shows which client signed, and the reference client refuses to render authorization for a plugin whose author key is also the signing client's publisher.
- Executor region is an operator declaration under the executor instrument (R3.10), not a technical proof. A misdeclared region breaches that instrument and is remedied by withdrawal from plugin runs after a finding. Data read before the finding is not recalled.
- A plugin MAY exhaust its requesters' budgets (R2.11) and nothing else's.
- Runs MAY still be released after a user's revocation for at most `FINALITY_WINDOW_S` plus one round timeout at an executor that has not yet
  received it (R3.14, R3.15); the disclosure in that window is bounded by the remaining budget of the grant (R3.20,
  R3.27).
- A plugin MAY refuse to terminate within its fuel; the cost is the plugin author's budget and a signed refusal, not a
  node's availability (R2.7-R2.9).
- A plugin MAY collude with its author's second plugin to correlate verdicts the same person authorized; correlation
  across plugins is limited by the fact that each grant is per cid and the person sees both in the grant history (R3.17).
- A flaw in the sandbox or the intrinsics freeze is not excluded; the layered defence (R3.2, R3.3, R2.1) and the
  isolation of the key (R2.2) mean such a flaw does not by itself reach the key.

