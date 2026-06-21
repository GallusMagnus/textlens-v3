# TextLens Current Analysis Method

## Status

This document describes the method currently implemented in code.

Date aligned to code review: 2026-06-21
Default pipeline: `v2 staged engine`
Feature flag: `TEXTLENS_PIPELINE_VERSION=v1|v2`

Consumer mode still uses its separate scoring path. Professional modes now default to the staged engine.

## Where The Method Lives

Core runtime files:

- `server.ts`
- `src/analysis/engine/stagedAnalysis.ts`
- `src/analysis/policies/modePolicies.ts`
- `src/analysis/rules/sourceRules.ts`
- `src/analysis/rules/taxonomyMappings.ts`
- `src/taxonomyData.ts`
- `src/sourceCatalog.ts`

## Core Design

The current professional-mode pipeline separates three controlled layers:

1. `mode policy`
2. `compiled source rules`
3. `taxonomy mappings`

The model is not asked to reinterpret the whole method from scratch on every run. It is constrained by these compiled layers.

## Live Pipeline

### Stage 0. Preprocess

Implemented in:

- `src/analysis/engine/stagedAnalysis.ts`

What happens:

- input text is normalized for analysis
- text is segmented into paragraphs and, where needed, sentence-like slices
- metadata gaps are recorded
- short-text and excerpt risk warnings are generated
- healthcare mode gets an explicit non-adjudication boundary warning

This stage makes no substantive finding.

### Stage 1. Candidate Passage Extraction

What happens:

- exact text segments are scored using a deterministic keyword universe derived from:
  - active taxonomy items
  - protected guardrails
  - active compiled source rules
- the engine selects the highest-salience segments plus nearby context segments
- candidate passages always remain verbatim slices of the submitted text

This reduces the amount of freeform text later stages need to interpret.

### Stage 2. Guardrail-First Screening

What happens:

- candidate passages are screened against the protected non-trigger categories:
  - ordinary political criticism
  - BDS / boycott advocacy
  - alternative state-model advocacy
- each candidate receives one of:
  - `blocked`
  - `proceed`
  - `ambiguous`

Important:

- blocked passages do not proceed to violation classification
- ambiguous passages may proceed, but later interpretation is expected to stay narrow

### Stage 3. Taxonomy Classification

What happens:

- only candidates that survive Stage 2 are classified
- only taxonomy items valid for the selected mode are supplied
- the classifier must either:
  - return a narrow flagged finding, or
  - abstain

Each candidate-level finding includes:

- taxonomy item
- explanation
- severity
- confidence
- alternative benign interpretation
- human-review flag

### Stage 4. Deterministic Standards Mapping

What happens:

- the backend maps each taxonomy finding to a standard or source deterministically in code
- it uses:
  - `taxonomyMappings`
  - mode policy
  - allowed source set
  - source-support type

This means standards application is no longer left entirely to a freeform model judgment.

### Stage 5. Weighting And Aggregation

What happens:

- each flagged finding is scored in code using:
  - finding severity
  - taxonomy score impact
  - mode weighting (`primary` or `supporting`)
  - finding confidence
- the engine then derives:
  - overall concern level
  - overall confidence

This is the first real backend weighting layer in TextLens.

### Stage 6. Structured Synthesis

What happens:

- the model receives only:
  - structured findings
  - guardrail findings
  - limitations
  - mode policy
- it does **not** reopen the full text for this stage

The synthesis stage returns:

- summary judgement
- short summary
- human review prompts
- suggested response / complaint draft
- any extra limitations

This reduces dependence on one end-to-end freeform summary pass.

### Stage 7. Backend Validation

Implemented in `sanitizeReport` in `server.ts`.

What happens:

- any flagged quote not found verbatim in the original text is removed
- any out-of-scope taxonomy reference is removed
- any out-of-scope source reference is removed
- warnings and boundary notes are added

## What Is Deterministic vs Model-Assisted

### Deterministic

- mode selection
- active source selection
- taxonomy eligibility by mode
- candidate text segmentation
- initial candidate ranking
- standards/source mapping
- weighting and aggregation
- backend validation

### Model-assisted

- guardrail screening judgments
- taxonomy classification on surviving passages
- final report synthesis

## Why This Is Better Than The Prior Path

- It separates extraction, screening, classification and synthesis.
- It gives protected speech guardrails their own stage.
- It makes standards mapping backend-controlled.
- It implements actual weighting in code.
- It reduces hallucination risk by narrowing what each model call is allowed to do.

## Current Limits

The engine is materially better than the prior single-pass design, but it is still a working system rather than a finished methodological endpoint.

Current limits include:

- candidate extraction still begins with keyword-based salience scoring
- guardrail and classification stages are still model-assisted
- weighting thresholds are currently heuristic and should be benchmarked
- the Methods UI page may still lag behind this document until separately revised

## Source Of Truth

If documentation and runtime behaviour diverge, the code is authoritative.
