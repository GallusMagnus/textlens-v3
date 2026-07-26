# Healthcare Mode Basis

## Purpose

Healthcare mode is for reviewing health-sciences articles, editorials, correspondence, commentary, and related public-facing health writing where TextLens needs to assess:

- publication integrity and editorial standards
- health journalism quality and evidentiary transparency
- healthcare-in-conflict terminology and criteria mapping
- rhetoric, framing, identity language, and evidence handling
- antisemitism or anti-Zionism issues when they are actually present in the submitted text

Healthcare mode is not a legal adjudicator, a peer reviewer, or a fact-checking substitute. It is a structured screening and analysis aid for identifying passages that may require human review, author query, editorial response, correction request, or further TextLens analysis.

## Source Families

Healthcare mode draws from five source families.

1. Core antisemitism and Israel-related boundary frameworks
   - IHRA Working Definition
   - Jerusalem Declaration on Antisemitism
   - Nexus Document
   - TextLens working taxonomy

2. Medical publication and editorial integrity standards
   - ICMJE Recommendations
   - COPE and CSE publication ethics materials
   - WAME publication ethics and geopolitical intrusion policies

3. Identity-language and health reporting standards
   - JAMA race and ethnicity reporting guidance
   - AHCJ health journalism principles
   - Schwitzer health journalism quality criteria, where relevant

4. Healthcare-in-conflict and IHL terminology sources
   - ICRC Customary IHL Rules 1, 7, 14, 15, 25, and 28
   - ICRC Health Care in Danger materials
   - ICRC responsibilities of health-care personnel in armed conflict and emergencies

5. TextLens operational method
   - mode policy
   - compiled source rules
   - taxonomy mappings
   - staged analysis engine

Runtime source selection is defined in `src/analysis/policies/modePolicies.ts` and `src/analysis/rules/sourceRules.ts`.

## Permitted Findings

Healthcare mode may identify:

- unsupported or under-evidenced claims in the submitted text
- selective evidence, trigger omissions, loaded labels, intention inflation, or authority laundering
- blurred boundaries between research, opinion, advocacy, and editorial judgement
- unclear authorship, affiliation, conflict, peer-review, or editorial-process context
- imprecise identity language in medical or scientific claims
- loose or overstated healthcare-in-conflict terminology
- failure to distinguish allegation, evidence, expert opinion, legal standard, and legal finding
- passages that may require review under antisemitism or anti-Zionism frameworks

Findings should be phrased as analytical concerns, not final determinations.

## Prohibited Findings

Healthcare mode must not:

- decide whether an attack, military action, or incident was lawful or unlawful
- decide whether protected medical personnel or medical units retained or lost protected status
- declare that an article is false based on outside facts not supplied to TextLens
- infer author, editor, peer reviewer, or journal motive without textual or metadata support
- treat ICRC or IHL sources as antisemitism standards
- treat ICMJE, COPE, WAME, CSE, JAMA, or AHCJ materials as legal standards
- treat harsh criticism of Israel, Zionism, or state policy as antisemitic without additional textual evidence
- convert disproportionate attention to Israel into proof of antisemitism by itself
- suppress legitimate scientific, political, humanitarian, or editorial disagreement

When the evidence is incomplete, the correct output is a limitation, uncertainty note, or human-review prompt.

## Separation Of Questions

Healthcare mode should keep five questions separate:

1. Is there an antisemitism or anti-Zionism issue?
2. Is there a publication-integrity or editorial-process issue?
3. Is there a health journalism or evidence-quality issue?
4. Is there a healthcare-in-conflict terminology issue?
5. Is there a legal/IHL concept being invoked imprecisely?

A passage may raise more than one question, but the report should not collapse them into a single accusation.

## Relationship To The Literature Monitor

The literature monitor collects candidate articles. It does not decide that an article is biased, antisemitic, misleading, or suitable for complaint.

The Literature Explorer can help a reviewer select articles for analysis by journal, crisis signal, matched terms, status, or review priority. The handoff into TextLens analysis should be understood as a screening step: the article is being sent for structured review, not because the monitor has already made a substantive finding.

## Human Reviewer Role

The human reviewer remains responsible for:

- deciding whether the article is worth analysing
- checking whether TextLens saw enough of the article to assess it fairly
- deciding whether external verification is needed
- deciding whether to seek correction, correspondence, complaint, response, or no action
- deciding whether antisemitism analysis, accountability analysis, or healthcare publication analysis is the right next mode

TextLens can identify passages, map them to source families, and generate cautious review prompts. It should not replace domain judgement.

## Implementation Notes

Current runtime implementation:

- `src/analysis/policies/modePolicies.ts`
- `src/analysis/rules/sourceRules.ts`
- `src/analysis/rules/taxonomyMappings.ts`
- `src/analysis/engine/stagedAnalysis.ts`
- `src/sourceCatalog.ts`
- `src/taxonomyData.ts`

The current staged engine:

- extracts candidate passages from the submitted text
- screens protected political speech guardrails
- classifies surviving passages against allowed taxonomy items
- maps findings to source families in code
- scores and aggregates findings in code
- asks the model only for structured classification and synthesis
- validates quotes and source scope before returning a report

## Current Design Risks

Healthcare mode still shares a broad TextLens taxonomy with other professional modes. That is useful for consistency, but it creates a risk that antisemitism/rhetorical categories can dominate healthcare-publication review unless the report clearly separates source families and finding types.

The review-priority queue in the Literature Explorer is heuristic. It should not be described as evidence quality, article importance, or bias severity.

The corpus currently stores metadata and abstracts. Abstract-only analysis is useful for triage, but findings about a full article should be limited unless the full text is supplied.

## Calibration Standard

A good Healthcare mode finding should be:

- tied to an exact quote
- clear about the source family being used
- narrow about what TextLens can and cannot infer
- explicit about uncertainty
- framed as a review prompt unless the text strongly supports a more confident conclusion

If a finding would require outside facts, journal correspondence, peer-review history, military facts, or legal adjudication, Healthcare mode should say what needs to be checked rather than pretending to know it.
