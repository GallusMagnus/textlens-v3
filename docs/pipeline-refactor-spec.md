# TextLens Analysis Pipeline Refactor Spec

## Status

Draft implementation specification for the next-generation TextLens analysis pipeline.

Update on 2026-06-21:

- Phase 1 compiled rule layer is implemented.
- A first live staged engine is implemented for professional modes.
- The remaining work is now refinement, benchmarking, and tighter determinism rather than initial scaffolding.

## Primary Goal

TextLens should provide:

1. An excellent, objective, reliable analysis pipeline.
2. An accurate public description of that pipeline.

The first priority is the pipeline itself. The methods description should be updated only after the new pipeline is implemented or at least structurally in place.

---

## Recommendation

### Recommendation: iterate on the current build, do not start from scratch

The current codebase already contains valuable audited work that should be preserved:

- a functioning UI and tab structure
- a reviewed standards registry
- a reviewed source catalog
- a reviewed taxonomy dataset
- prompt and validation safeguards already moving in the right direction
- mode-specific boundaries already encoded in the backend

Starting over completely would create avoidable risk:

- loss of the source-audit work already done
- increased chance of regression in the UI and workflow
- duplication of prompt, taxonomy, and standards effort
- slower iteration because the app shell would need rebuilding alongside the pipeline

### Recommended strategy

Refactor the analysis backend in place, but treat it as a new engine.

That means:

- keep the current app shell and data assets
- build a new staged analysis engine alongside the current single-pass engine
- switch modes or endpoints over only after validation

### Practical architecture decision

Implement a `v2` pipeline in parallel with the current path.

Do not mutate the current single-pass pipeline until the staged pipeline is working.

Recommended rollout:

1. keep current `server.ts` route live
2. add new analysis modules under `src/analysis/`
3. introduce a feature flag or endpoint switch:
   - `TEXTLENS_PIPELINE_VERSION=v1|v2`
   - or `/api/analyze` and `/api/analyze-v2`
4. compare outputs on a benchmark set
5. switch default only when precision and transparency are better

---

## If A Fresh Start Is Ever Chosen

This is not the current recommendation, but if a fresh start is chosen later, do it as a new backend engine, not a whole new product.

### In Codex, the right way to do that would be:

1. Create a new engine folder inside the same repo, not a separate app:
   - `src/analysis-v2/`
2. Preserve these existing assets as source-of-truth inputs:
   - `src/taxonomyData.ts`
   - `src/sourceCatalog.ts`
   - `src/standardsData.ts`
3. Port the analysis API only, not the entire UI.
4. Create a benchmark harness before wiring the new engine into the live UI.
5. Only after benchmark validation, swap the UI to use the new engine.

### Good Codex prompt for that path

> Build a new staged TextLens analysis engine under `src/analysis-v2/` without changing the existing UI. Reuse the current taxonomy and source catalog as inputs. Add a separate `/api/analyze-v2` endpoint, deterministic validators, and a benchmark harness.

That is the only kind of "start fresh" that makes sense here.

---

## Core Design Principle

The new pipeline should separate three layers clearly:

1. `source-derived rules`
2. `TextLens taxonomy`
3. `mode policy`

These layers must not be blurred together.

### Why this matters

- external sources do not all say the same thing
- TextLens has its own interpretive thesis, especially in general mode
- some sources act as triggers, some as guardrails, some only as terminology constraints
- reliability improves when the model is asked to satisfy compiled rules rather than reinterpret source summaries on every run

---

## Analytical Positioning

TextLens takes the position that modern antisemitism often appears through anti-Zionist rhetoric and modern libels such as:

- genocide
- apartheid
- colonialism

That position can and should be encoded in `general mode`.

However, it must be represented honestly as a TextLens analytical position, not falsely attributed in identical form to every external source.

### Therefore the engine should distinguish:

- `external consensus support`
- `external source-specific support`
- `TextLens internal interpretive extension`

This distinction is essential for methodological honesty.

---

## Proposed Pipeline

## Stage 0: Preprocess

Input normalization and risk detection only.

Tasks:

- normalize line breaks and whitespace
- preserve original text for quote validation
- detect excerpt/truncation indicators
- detect very short submissions
- capture missing metadata
- segment text into candidate passages

Outputs:

- normalized text
- segmentation map
- preprocessing warnings
- metadata completeness report

No substantive bias judgement happens here.

---

## Stage 1: Candidate Passage Extraction

Purpose:
Extract candidate verbatim passages that may be analytically relevant.

Rules:

- extract only exact quotations from the submitted text
- no standards assignment yet
- no final taxonomy judgement yet
- allow abstention

Output object:

```ts
type CandidatePassage = {
  id: string;
  exactQuote: string;
  startOffset?: number;
  endOffset?: number;
  surroundingContext?: string;
  extractionReason: string;
};
```

This stage should be narrow and over-inclusive rather than decisive.

---

## Stage 2: Guardrail-First Screening

Purpose:
Test candidate passages against protected/non-trigger rules before any violation is accepted.

This is where:

- ordinary political criticism
- constitutional advocacy
- rights claims
- boycott advocacy
- harsh but protected speech

must be evaluated first.

### Important policy rule

Protected categories are not blanket immunity.

Example:

- `BDS advocacy alone` may be protected
- `BDS advocacy + collective guilt + identity screening + anti-Jewish libels` may remain actionable

So the correct logic is:

- protected by default
- reopened only if additional trigger conditions are satisfied

Output object:

```ts
type GuardrailAssessment = {
  candidateId: string;
  status: "blocked" | "proceed" | "ambiguous";
  guardrailIds: string[];
  rationale: string;
  confidence: "low" | "moderate" | "high";
};
```

If blocked, the passage should not proceed to violation classification unless policy explicitly allows override.

---

## Stage 3: Taxonomy Classification

Purpose:
Classify only eligible passages against the allowed taxonomy for the selected mode.

Rules:

- only allowed taxonomy items for that mode
- only exact quotes
- confidence required
- alternative benign interpretation required for surviving findings
- abstention allowed

Output object:

```ts
type TaxonomyFinding = {
  candidateId: string;
  taxonomyItemId: string;
  confidence: "low" | "moderate" | "high";
  severity: "low" | "moderate" | "high" | "severe";
  explanation: string;
  alternativeBenignInterpretation: string;
  humanReviewNeeded: boolean;
};
```

---

## Stage 4: Deterministic Standards Mapping

Purpose:
Map validated taxonomy findings to an allowed standard or source rule.

This stage must not be freeform.

It should operate from a deterministic allowlist:

- per mode
- per taxonomy item
- per source rule

If no standard maps clearly, return `none` rather than improvising.

Output object:

```ts
type StandardsMapping = {
  taxonomyItemId: string;
  allowedRuleIds: string[];
  selectedRuleId: string | "none";
  rationale: string;
};
```

---

## Stage 5: Backend Validation

Purpose:
Reject unsupported, out-of-scope, or overclaimed findings.

Mandatory validators:

- quote exists verbatim in submitted text
- taxonomy item valid for mode
- standard/source valid for mode
- standard/source allowed for that taxonomy item
- guardrail conflict check
- confidence floor check
- legal overclaiming blocked in restricted modes
- summary cannot exceed surviving findings

Current code already does some of this in `server.ts`.
The new engine should formalize it as its own validation stage.

---

## Stage 6: Report Synthesis

Purpose:
Generate the user-facing report only from validated artifacts.

The summary must not be an unconstrained freeform essay.

Inputs to synthesis:

- validated findings
- validated guardrail results
- preprocessing warnings
- limitations
- confidence outcomes

The summary should be narrower than the evidence if necessary.

---

## Data Model Refactor

## 1. Source Rules

The current source catalog is too prose-heavy for deterministic use.

Add a compiled rule layer.

Suggested type:

```ts
type SourceRule = {
  id: string;
  sourceKey: string;
  clauseId: string;
  kind: "trigger" | "guardrail" | "constraint";
  appliesToModes: string[];
  supportsTaxonomyItems: string[];
  blocksTaxonomyItems?: string[];
  evidenceThreshold: "explicit" | "strong-inference" | "contextual";
  proposition: string;
  disallowedUses?: string[];
};
```

### What this means in practice

Instead of asking the model:

> What does IHRA or JDA mean here?

we ask:

> Which of these compiled rule propositions is satisfied by this exact quote?

That is much safer.

---

## 2. Mode Policy

Create a central mode-policy layer that explicitly defines:

- which taxonomy items are allowed
- which source rules are available
- which source rules are trigger rules
- which source rules are guardrail rules
- which confidence floor applies
- whether legal adjudication is forbidden

Suggested type:

```ts
type ModePolicy = {
  mode: "general" | "healthcare" | "academic" | "bccsa" | "press_code" | "consumer";
  allowedTaxonomyIds: string[];
  allowedSourceKeys: string[];
  allowedSourceRuleIds: string[];
  guardrailRuleIds: string[];
  confidenceFloor: "low" | "moderate" | "high";
  legalConclusionForbidden: boolean;
  summaryStyle: "adjudicative" | "review" | "barometer";
};
```

---

## 3. TextLens Internal Taxonomy Position

Each taxonomy item should declare its origin more explicitly.

Suggested field:

```ts
origin: "external_consensus" | "external_source_specific" | "textlens_internal";
```

This is especially important for `general mode`, where TextLens wants to encode a stronger interpretive thesis about modern antisemitism and anti-Zionist rhetoric.

---

## Deterministic Conversion Method: Source To Taxonomy

General method for converting a source into deterministic, reusable analytical inputs:

1. Identify the source proposition.
   Example:
   - collective responsibility
   - classic trope application
   - denial of equal existence

2. Label proposition type:
   - trigger
   - guardrail
   - scope constraint

3. Assign evidentiary threshold:
   - explicit text only
   - explicit or coded
   - contextual pattern required

4. Map proposition to allowed taxonomy items.

5. Record disallowed uses.
   Example:
   - not for legal adjudication
   - not for all criticism of Israel
   - not for public-health sourcing review

6. Store as structured rule, not narrative prose.

This compilation process should be manual and audited, not generated dynamically at runtime.

---

## Weighting: Move It Into Code

The current UI shows weighting metadata, but the backend does not truly enforce it.

That should change.

Weighting should be codified as policy logic, not vague presentation.

Suggested scoring inputs:

- taxonomy severity weight
- mode relevance weight
- source force weight
- guardrail reduction/block
- confidence penalty
- excerpt/truncation penalty

Suggested score influences:

```ts
type WeightProfile = {
  taxonomySeverity: number;
  modeRelevance: number;
  sourceForce: number;
  confidenceMultiplier: number;
  truncationPenalty: number;
  guardrailReduction: number;
};
```

### Important

Weighting should not silently create hidden deterministic final verdicts.
It should influence:

- prioritization
- concern level
- summary restraint
- human review requirements

It should not replace reasoning.

---

## General Mode

General mode should be explicitly defined as:

- TextLens consensus/product mode
- source-constrained, but with TextLens interpretive extensions

Built from:

- IHRA
- JDA
- Nexus
- TextLens internal modern-pattern taxonomy

### General mode policy recommendation

Use three labels internally:

- `consensus-supported`
- `source-supported but contested or scoped`
- `TextLens interpretive extension`

This allows TextLens to hold a strong methodological position without overstating uniform external consensus.

---

## Consumer Mode

Consumer mode should be retained only if clearly reframed.

### Recommended definition

Consumer mode is:

- a barometer mode
- not a standards adjudication mode
- not a binary antisemitism verdict mode

It may score:

- rhetorical intensity
- delegitimization pressure
- modern-pattern clustering
- response-worthiness

It should not be described as equivalent to the professional/source-constrained modes.

### Recommended implementation

- keep it separate from standards adjudication
- limit standards citation
- require explicit disclaimer in methods and UI
- keep outputs clearly labeled as barometric rather than regulatory

---

## Stronger Validators

Add these validators beyond the current implementation:

- reject severe findings with low confidence
- reject findings where quote length/context is too thin to support the claim
- reject standards not allowed for the chosen taxonomy item
- reject findings blocked by guardrails unless an override rule exists
- reject summary claims not grounded in surviving findings
- reject prohibited legal conclusions in healthcare/IHL mode
- reject unsupported motive inference

---

## Recommended Module Layout

Implement new analysis code under:

```txt
src/
  analysis/
    types.ts
    policies/
      modePolicies.ts
    rules/
      sourceRules.ts
      taxonomyMappings.ts
    stages/
      preprocess.ts
      extractCandidates.ts
      evaluateGuardrails.ts
      classifyTaxonomy.ts
      mapStandards.ts
      validateFindings.ts
      synthesizeReport.ts
    benchmark/
      cases/
      runner.ts
      scoring.ts
```

Suggested server integration:

- keep current `server.ts`
- move analysis orchestration into `src/analysis/runPipelineV2.ts`
- add `TEXTLENS_PIPELINE_VERSION=v2`

---

## Migration Plan

## Phase 1: data and policy scaffolding

Build:

- `ModePolicy`
- `SourceRule`
- taxonomy-to-standard allowlists

No UI changes required.

## Phase 2: staged backend

Implement:

- preprocess
- candidate extraction
- guardrail gate
- taxonomy classification
- deterministic standards mapping
- validators

Keep old endpoint alive.

## Phase 3: benchmark harness

Create a small evaluation set:

- clear direct antisemitism
- clear protected speech
- borderline anti-Zionist rhetoric
- healthcare/IHL terminology cases
- academic/publication ethics cases

Evaluate:

- false positives
- false negatives
- overclaiming
- unsupported standards citations
- quote accuracy

## Phase 4: methods rewrite

Only after the new engine is stable:

- rewrite Methods tab
- rewrite user guide language
- make the public description match the real pipeline

---

## Concrete Next Build Recommendation

The next implementation sprint should do only these four things:

1. create deterministic source-rule and mode-policy structures
2. introduce guardrail-first gating
3. split the single-pass analysis into staged backend functions
4. add a benchmark harness

Do not rewrite the whole UI first.
Do not rewrite the Methods tab first.
Make the engine true, then describe it accurately.

---

## Codex Execution Guidance

Recommended first Codex task:

> Create `src/analysis/` with types, mode policies, source rules, taxonomy mappings, and a `runPipelineV2` orchestration skeleton. Do not yet remove the current pipeline. Add a feature flag so the new engine can run in parallel.

Recommended second Codex task:

> Implement deterministic validation for taxonomy-to-standard mapping and a guardrail-first screening stage using the existing taxonomy and source catalog as inputs.

Recommended third Codex task:

> Add a benchmark harness with representative positive, negative, and borderline cases so we can compare `v1` and `v2` outputs before switching defaults.

---

## Final Decision

Refactor in place.

Build a new backend engine beside the old one.

Preserve the audited source work.

Do not start the whole product from scratch.
