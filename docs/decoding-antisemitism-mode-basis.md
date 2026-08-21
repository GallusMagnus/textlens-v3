# Decoding Antisemitism Mode Basis

## Purpose

Decoding Antisemitism Mode applies one validated source as its governing method:

- Matthias J. Becker, Hagen Troschke, Matthew Bolton and Alexis Chapelan, eds., `Decoding Antisemitism: A Guide to Identifying Antisemitism Online`, Palgrave Macmillan / Springer Nature, 2024.

The mode is designed for source-faithful review. It should answer: what would the Decoding Antisemitism ontology identify in this submitted utterance?

## Source Boundary

This mode uses only `decoding_antisemitism_2024` as an active source. It should not import IHRA, JDA, Nexus, MAAZ, legal, publication, media or TextLens-only standards into the finding.

Other TextLens modes may use `decoding_antisemitism_2024` as an active supporting or advisory source, but only through:

- `src/analysis/rules/decodingAntisemitismCrosswalk.ts`
- `src/analysis/rules/taxonomyMappings.ts`
- the selected mode policy in `src/analysis/policies/modePolicies.ts`

This protects the TextLens taxonomy from being silently rewritten by a single source.

## Method

The mode should keep four questions separate:

1. Does the utterance communicate antisemitic meaning?
2. Which concept, stereotype, analogy, strategy or speech act is discernible?
3. What verbal, visual, multimodal or contextual pattern carries that meaning?
4. Is there a coherent non-antisemitic reading that requires abstention?

The mode analyses communicated meaning, not speaker identity or subjective intent.

## Abstention

The conservative outcome is required when:

- the submitted text is too short or excerpted
- the claim is concrete, specific, time-bounded or spatially limited
- the passage can be read coherently as non-antisemitic
- the category depends on missing context or external facts
- the finding would require deciding motive, identity or intent

In those cases, the report should use `not established`, `boundary-tested`, or a human-review prompt rather than forcing a finding.

## Contested Boundaries

Some Decoding categories are especially sensitive when used outside Decoding Antisemitism Mode:

- apartheid analogy / racist state
- colonialism analogies
- genocide
- double standards
- denial of Israel's right to exist
- BDS or general boycott support

In non-Decoding modes, these should remain source-specific or advisory unless the active mode's other sources and guardrails also support the finding.

## Implementation Files

- `src/sourceCatalog.ts`
- `src/standardsData.ts`
- `src/analysis/rules/sourceRules.ts`
- `src/analysis/rules/decodingAntisemitismCrosswalk.ts`
- `src/analysis/rules/taxonomyMappings.ts`
- `src/analysis/policies/modePolicies.ts`
- `src/analysis/engine/stagedAnalysis.ts`
- `src/analysis/compiledRuleLayer.ts`
