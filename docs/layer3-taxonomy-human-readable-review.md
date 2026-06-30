# Layer 3 Human-Readable Review

Date: 2026-06-30
Branch: `codex/layer3-taxonomy-v2`

## Purpose

This note translates the current Layer 3 implementation into plain English so it can be reviewed by humans without reading the full TypeScript taxonomy registry.

## Scope decisions in this build

- Layer 3 now follows the June 30, 2026 taxonomy structure.
- BDS advocacy remains protected speech unless the text adds aggravating language or framing.
- `7.3 Cumulative framing` is deferred for a later multi-document build.

## Family 1: Evidence handling

- `1.1 Verification bypass`
  Plain English: the text treats checking or verification as unnecessary because the moral conclusion is supposedly already obvious.
- `1.2 Selective evidence`
  Plain English: the text includes only the facts that support one side of the argument.
- `1.3 Background omission`
  Plain English: important background needed to understand the event is left out.
- `1.4 Trigger omission`
  Plain English: the immediate precipitating event is omitted, making later action look causeless.
- `1.5 Contested claim as fact`
  Plain English: a disputed allegation is presented as settled fact.
- `1.6 Source inflation`
  Plain English: weak or partisan sourcing is presented as if it were authoritative confirmation.

## Family 2: Language and emphasis

- `2.1 Emotional loading`
  Plain English: adjectives or imagery steer the reader toward a verdict.
- `2.2 Unequal humanisation`
  Plain English: one side is personalised and the other is reduced to numbers or abstractions.
- `2.3 Asymmetric certainty`
  Plain English: one side's claims are stated plainly and the other side's claims are hedged.
- `2.4 Loaded labels`
  Plain English: labels do the moral work before evidence is discussed.
- `2.5 Scale distortion`
  Plain English: numbers are used without enough context to support the moral inference being encouraged.

## Family 3: Agency and responsibility

- `3.1 Passive responsibility`
  Plain English: grammar hides responsibility for one side while preserving it for the other.
- `3.2 Agency imbalance`
  Plain English: one side is treated as the only real actor and the other as only reacting or suffering.
- `3.3 Intention inflation`
  Plain English: harm is treated as proof of deliberate intent without showing the evidentiary bridge.
- `3.4 Responsibility transfer`
  Plain English: blame moves from decision-makers to wider identity or communal groups.

## Family 4: Conflation and substitution

- `4.1 Group conflation`
  Plain English: Jews, Israelis, Zionists, Jewish institutions, and the Israeli state are blurred together.
- `4.2 Government-state-people conflation`
  Plain English: a government's conduct is treated as revealing the essence of the whole country or people.
- `4.3 Policy-to-existence shift`
  Plain English: criticism of conduct slides into rejection of legitimacy or continued existence.
- `4.4 Analogy as proof`
  Plain English: a historical analogy is treated as if it proves the claim by itself.

## Family 5: Frame-shifting and preconditions

- `5.1 Scope expansion`
  Plain English: a precise issue is dissolved into a much larger frame to avoid the narrower question.
- `5.2 Subject change`
  Plain English: the original concern is replaced by a different issue.
- `5.3 Silence disqualification`
  Plain English: not speaking on another issue is treated as disqualifying the present concern.
- `5.4 Precondition`
  Plain English: concern about antisemitism is made conditional on first taking another political position.
- `5.5 Context substitution`
  Plain English: context is used to avoid judging the claim rather than clarify it.

## Family 6: Immunity and counter-attack

- `6.1 Credentialed immunity`
  Plain English: status or biography is used as a shield from criticism.
- `6.2 Definition immunity`
  Plain English: citing a preferred definition is treated as if it ends the argument.
- `6.3 Smear dismissal`
  Plain English: the objection is dismissed as fabricated or weaponised instead of being answered.
- `6.4 Motive attack`
  Plain English: the critic's motives are attacked instead of the critic's claim.
- `6.5 Victim reversal`
  Plain English: scrutiny is reframed as persecution of the speaker.
- `6.6 Counter-accusation`
  Plain English: the concern is displaced by an accusation against the complainant or critic.

## Family 7: Authority and amplification

- `7.1 Expertise laundering`
  Plain English: ideological claims are dressed up in professional or academic authority to gain unearned legitimacy.
- `7.2 Institutional amplification`
  Plain English: a claim is treated as stronger because institutions repeat or endorse it.
- `7.4 Moral inheritance`
  Plain English: past moral authority or liberation history is treated as if it settles the current case.

## Deferred item

- `7.3 Cumulative framing`
  Decision: not active in this build.
  Reason: it requires cross-publication or over-time analysis and is too easy to overapply in a single-text engine.

## Review notes

- `1.2`, `1.3`, and `1.4` are close together conceptually.
  They are still defensible, but the model may need examples and prompt discipline to keep them distinct.
- `3.4 Responsibility transfer` and `4.1 Group conflation` can overlap.
  In practice, `3.4` is about where blame lands; `4.1` is about category collapse.
- Layer 3 should stay visibly below Layer 1 and Layer 2 in seriousness.
  These are interpretive and evidentiary concerns, not self-sufficient proof of antisemitism.
- The current implementation now maps Layer 3 items to human-findable `TEXTLENS-1` to `TEXTLENS-7` standards families in the Standards tab rather than using hidden sub-item IDs.

## Recommended next review questions

1. Are the category titles short enough for report cards and UI chips?
2. Are the examples neutral and illustrative rather than too agenda-loaded?
3. Should any Family 5 or Family 6 items be downgraded to advisory-only in some modes?
4. Do we want report outputs to show the family number and item number together, for example `5.4 Precondition`, everywhere?

## Decisions after review

- The category titles are short enough and should stay as they are.
- The examples are neutral enough for this build.
- Family 5 and Family 6 should be treated more cautiously in complaint-oriented regulatory modes. In this build, BCCSA and Press Code modes now use them as `advisory` items rather than ordinary supporting items, so they are surfaced for review but down-weighted.
- The family-and-item number should be visible in the in-app report to help users inspect and refine the taxonomy. It does not need to be forced into every external response or export format.
