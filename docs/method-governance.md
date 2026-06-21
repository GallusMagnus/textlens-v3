# TextLens Method Governance

## Purpose

TextLens needs a method that is rigorous, transparent and adjustable without becoming opaque.

This document defines how to change the method over time.

## The Three Controlled Layers

Every methodological change should be made in one of three places only:

1. `source rules`
2. `taxonomy mappings`
3. `mode policies`

Do not blur these layers together.

In addition, TextLens now has a controlled execution layer:

4. `staged engine`

File:

- `src/analysis/engine/stagedAnalysis.ts`

Use this file when changing:

- candidate extraction logic
- guardrail-stage prompts or schemas
- taxonomy classification-stage prompts or schemas
- deterministic weighting logic
- synthesis-stage scope
- concern-level thresholds

### Source rules

File:

- `src/analysis/rules/sourceRules.ts`

Use this file when changing:

- what a source is for
- what kinds of questions it supports
- which signals are triggers
- which signals are guardrails
- what limits apply to the source
- which clause prefixes map back to that source

### Taxonomy mappings

File:

- `src/analysis/rules/taxonomyMappings.ts`

Use this file when changing:

- which sources support a taxonomy item
- whether a taxonomy item is external, mixed, source-specific or a TextLens extension
- how a taxonomy item is used by mode

### Mode policies

File:

- `src/analysis/policies/modePolicies.ts`

Use this file when changing:

- which sources are active in a mode
- how abstention should work in that mode
- how strict the hallucination-minimisation posture should be
- what boundary note should appear in that mode

## Change Order

When a new source or standard is reviewed, update in this order:

1. Audit the primary source.
2. Update `src/sourceCatalog.ts` with concise public-facing metadata.
3. Update `src/analysis/rules/sourceRules.ts` with the compiled operational rule.
4. Update `src/analysis/rules/taxonomyMappings.ts` if the source changes support for taxonomy items.
5. Update `src/analysis/policies/modePolicies.ts` only if the source should become active in one or more modes.
6. Update `src/analysis/engine/stagedAnalysis.ts` if the execution logic changes.
7. Update `docs/current-analysis-method.md` if runtime behaviour has changed.

## How To Adjust The Engine Safely

When changing the live engine:

1. Decide whether the change belongs in extraction, guardrails, classification, mapping, weighting or synthesis.
2. Prefer changing one stage at a time.
3. Keep deterministic responsibilities in code wherever possible.
4. Narrow prompts before expanding them.
5. Re-run lint and build after every engine change.

Changes that increase freeform model discretion should be treated as high-risk and justified explicitly.

## What Counts As A Faithful Change

A change is faithful when it does all of the following:

- preserves the actual boundary of the source
- does not attribute TextLens positions to external sources unless the source really supports them
- distinguishes trigger logic from guardrail logic
- states limitations explicitly
- keeps report claims narrower when evidence is incomplete

## How To Add A New Source

1. Add or revise the source metadata in `src/sourceCatalog.ts`.
2. Add a compiled source rule in `src/analysis/rules/sourceRules.ts`.
3. Add clause prefixes if findings may cite that source.
4. Decide whether the source is mainly:
   - `trigger`
   - `guardrail`
   - `integrity`
   - `terminology`
   - `framework`
5. Decide whether the source belongs in active mode policies yet.
6. Run lint and build.

## How To Change A Taxonomy Item

1. Edit the item in `src/taxonomyData.ts`.
2. Re-check its `referenceKeys`, `referenceNote`, `relevantModes` and `modeWeighting`.
3. Confirm that `src/analysis/rules/taxonomyMappings.ts` still represents the item honestly.
4. If the item is a TextLens extension, make that explicit rather than implying external consensus where none exists.

## Review Standard

Before accepting a methods change, ask:

- Does this narrow hallucination risk or widen it?
- Does this make a source boundary clearer or blurrier?
- Does this improve determinism or push more discretion back into a freeform prompt?
- Would a reviewer be able to see where a finding came from?

If the answer is no, the change is probably not ready.
