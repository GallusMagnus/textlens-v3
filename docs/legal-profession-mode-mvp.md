# U.S. Legal (ABA) MVP

## Purpose

U.S. Legal (ABA) is a first-level TextLens mode for lawyers, bar associations, law firms, schools, universities and civil-rights reviewers evaluating a single submitted text or incident narrative.

The mode is built around ABA antisemitism policy and initiatives, especially Resolution 514, the Task Force to Combat Antisemitism, the 2025 ABA resolutions on K-12, higher education and the Global Guidelines, plus related U.S. civil-rights and workplace guidance.

The MVP helps reviewers separate:

- possible antisemitism concerns
- protected political speech boundaries
- education or workplace civil-rights screening questions
- institutional response and protocol gaps
- missing facts needed before escalation
- proportionate response language

It is not legal advice, a liability assessment, a disciplinary finding, or an ABA determination.

## Design

The mode reuses the existing v2 staged engine:

1. preprocess and identify limitations
2. extract candidate passages
3. apply protected-speech guardrails
4. classify surviving passages against the active taxonomy
5. map findings to active source families
6. synthesize a restrained report and response draft
7. validate quotes, sources and taxonomy scope

The MVP is intentionally single-text first. Users may add optional context fields, but TextLens should not treat them as a verified dossier.

## Inputs

Required:

- primary text or incident narrative
- title
- author, speaker or source
- platform or institutional source

Optional legal context:

- legal setting, such as law firm, K-12 school, university, bar association or workplace
- incident or reviewer concern
- relevant institutional policy excerpt
- desired output, such as triage memo, response draft or policy review

## Active Source Families

- IHRA Working Definition
- Jerusalem Declaration on Antisemitism
- Nexus Document
- TextLens working taxonomy
- ABA Resolution 514 and Task Force to Combat Antisemitism
- ABA 2025 Resolutions 611, 612 and 613
- U.S. National Strategy to Counter Antisemitism
- Global Guidelines for Countering Antisemitism
- Title VI shared ancestry / ethnic characteristics discrimination guidance
- EEOC religious discrimination and accommodation guidance

## Source Storage and Algorithm Access

The MVP stores source material as compact, structured summaries and rule records. It does not ingest or retrieve full ABA, OCR, EEOC, White House, State Department or other source texts at analysis time.

Storage locations:

- `src/analysis/policies/modePolicies.ts`: defines `legal_profession`, its user-facing label, active `sourceRuleKeys`, boundary note, report positioning, hallucination policy and abstention policy.
- `src/sourceCatalog.ts`: stores source metadata for human transparency, including source names, URLs, why each source is included, analytical role, key criteria and limitations.
- `src/standardsData.ts`: exposes the same source family to the Standards tab as short clause-like records.
- `src/analysis/rules/sourceRules.ts`: stores the compact rule layer the staged analysis engine uses: allowed mode, clause prefixes, analytical use, trigger signals and guardrail signals.
- `src/analysis/compiledRuleLayer.ts` and `src/analysis/rules/taxonomyMappings.ts`: compile which sources and taxonomy items are active for `legal_profession`.
- `src/analysis/engine/stagedAnalysis.ts`: applies the selected mode by extracting candidate passages, applying protected-speech guardrails, classifying surviving passages against active taxonomy/source rules, and synthesizing a report.

This design keeps the MVP transparent and bounded. The source URLs are included for human follow-up, but the model is instructed to rely only on the embedded summaries and rules supplied for the run. If a source summary is too thin to support a conclusion, the report should record that as a limitation rather than inventing external detail.

## Outputs

The MVP report should produce:

- summary judgement
- short summary
- flagged passages tied to exact quotes
- guardrail findings for protected speech
- standards or source references
- human review prompts
- limitations
- suggested complaint, memo or response language

Good output should say what a reviewer should check next rather than pretending to know external facts.

## Current MVP Boundaries

- The mode does not decide whether conduct is unlawful.
- The mode does not decide Title VI, Title VII, harassment, accommodation, retaliation, hostile-environment, or professional-conduct questions.
- The mode does not classify criticism of Israel, Zionism, BDS advocacy, or alternative state-model advocacy as antisemitic without added textual evidence.
- The mode does not infer institutional notice, motive, intent, comparator treatment, or policy breach unless supplied in the text or metadata.
- The mode is for partner demonstration and early reviewer feedback, not production legal reliance.

## Next Versions

Version 2 should add structured bundle analysis with explicit input roles:

- primary text
- incident record
- policy excerpt
- response history
- external authority
- user notes

Version 3 should add timeline and dossier generation, with every finding traceable to a specific input item.
