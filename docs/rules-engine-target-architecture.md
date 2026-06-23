# TextLens Rules Engine: Current State and Next-Stage Target Architecture

Date: 2026-06-23
Status: Architecture assessment and implementation recommendation

## Executive Summary

TextLens already has a meaningful Phase 1 rules-engine architecture:

- a staged professional-mode engine
- explicit mode policies
- a compiled source-rule layer
- a compiled taxonomy-mapping layer
- method and governance documentation

That is the good news. The main problem is that the current system still uses handwritten TypeScript as both:

1. the authoring format for standards, taxonomy, mappings and policies
2. the runtime artifact consumed by the engine and UI

That creates unnecessary duplication, weakens provenance, makes versioning manual, and leaves documentation vulnerable to drift.

The practical next step is not to replace the staged engine. It is to separate the rules system into:

1. human-authored source material
2. validated, generated rule artifacts
3. runtime consumption of compiled artifacts only
4. release/governance documentation generated and maintained alongside those artifacts

## What Exists Now

## 1. A real staged engine already exists

The current professional pipeline is implemented and documented:

- engine: `src/analysis/engine/stagedAnalysis.ts`
- current method doc: `docs/current-analysis-method.md`
- governance doc: `docs/method-governance.md`

The live pipeline already separates:

- mode policy
- source rules
- taxonomy mappings
- staged execution

That is a strong base. The repo is not starting from scratch.

## 2. The rules layer is already partially compiled

The current compiled layer is assembled in:

- `src/analysis/compiledRuleLayer.ts`
- `src/analysis/policies/modePolicies.ts`
- `src/analysis/rules/sourceRules.ts`
- `src/analysis/rules/taxonomyMappings.ts`

This gives TextLens:

- per-mode source activation
- per-source operational summaries
- per-taxonomy source-support metadata
- deterministic standard selection after classification

## 3. Source and taxonomy material already exist, but in multiple parallel forms

Today the same conceptual rules system is spread across several files:

- `src/standardsData.ts`
  - clause-level standard text used mainly for display/report lookup
- `src/sourceCatalog.ts`
  - prose metadata and public-facing summaries for each source
- `src/taxonomyData.ts`
  - taxonomy items, mode weighting, reference keys, likely standards
- `src/methodsData.ts`
  - narrative method-layer descriptions for UI copy

This means TextLens already contains substantial audited intellectual work. It also means the source of truth is fragmented.

## 4. There is already some validation and restraint

Current safeguards include:

- quote-verbatim validation in `server.ts`
- out-of-scope taxonomy/source removal in `server.ts`
- protected-speech guardrail stage in `stagedAnalysis.ts`
- boundary notes and limitations by mode
- deterministic scoring and aggregation

These are valuable and should be preserved.

## What Is Missing or Weak Today

## 1. No single canonical authoring layer

At present, rules are authored directly in executable TypeScript across multiple files. That causes four problems:

- source metadata, source clauses, source operational rules, and UI presentation are split apart
- some mappings are explicit while others are inferred
- the runtime can only be understood by reading code
- non-engineering review is harder than it should be

Most importantly, `sourceRules.ts` and `taxonomyMappings.ts` are not generated from a canonical reviewed rule repository. They are hand-maintained runtime code.

## 2. Clause-level provenance is weak

The repo has clause text in `src/standardsData.ts`, but the engine does not consume clause-level audited propositions directly. Instead, it consumes:

- source-level operational summaries in `sourceRules.ts`
- taxonomy-level references such as `referenceKeys`, `referenceNote`, and `likelyStandards` in `taxonomyData.ts`

That means the operational rule layer is only loosely connected to the exact source clauses that are supposed to justify it.

In practice, this makes it harder to answer:

- which exact clause supports this runtime rule?
- which TextLens interpretation extends beyond the source?
- what changed between one ruleset release and the next?

## 3. The compiled layer is not really a generated artifact yet

`compiledRuleLayer.ts` currently sets:

- a manual `version` string
- a manual `generatedFrom` list
- arrays imported directly from handwritten TS modules

So the system is "compiled" conceptually, but not operationally in the software-engineering sense. There is no build step that:

- validates authoring data
- resolves relationships
- emits a frozen artifact
- computes a release hash
- records source versions

## 4. Versioning is manual and incomplete

Today:

- `compiledRuleLayer.version` is a hand-edited date string
- `analysisTrace` stores model and timestamp
- reports do not appear to record a full ruleset manifest

Missing pieces:

- separate engine version vs ruleset version
- per-source version or audit revision
- artifact hash/content digest
- reproducible release manifest
- release notes tied to ruleset changes

## 5. Taxonomy mappings are still too implicit

Current taxonomy mappings are compiled mostly from `taxonomyData.ts`:

- origin is inferred from `referenceKeys`
- support type is inferred from source categories
- source support rationale is largely reused from `referenceNote`

This is a useful Phase 1 shortcut, but it is too implicit for long-term auditability. A mature rules engine should store reviewed mapping decisions directly, including:

- which source clause or proposition supports the mapping
- what kind of support it provides
- whether the support is direct, guardrail, integrity, terminology, or TextLens-only
- what the evidentiary threshold is

## 6. Human-readable docs are not yet artifact-linked

The repo already includes:

- `docs/current-analysis-method.md`
- `docs/method-governance.md`
- UI copy in `src/components/MethodsTab.tsx`
- narrative content in `src/methodsData.ts`

This is much better than having no method documentation. But it still leaves room for drift because:

- some docs are narrative only
- some UI explanations are hand-maintained
- docs are not generated from the same release manifest as the runtime artifact

## 7. Benchmarking and regression infrastructure are still missing

The repo acknowledges this gap in `docs/pipeline-refactor-spec.md`, but there is no evident benchmark harness or ruleset regression suite yet.

That matters because versioned rules without benchmarked release discipline are still hard to trust over time.

## Recommended Target Architecture

## Design Principle

Keep the current staged engine.

Replace the current handwritten rule-authoring model with a proper authoring-to-compile pipeline.

Human readability is a hard requirement, not a nice-to-have.

The taxonomy, source propositions, mappings and mode policies must remain inspectable by subject-matter experts in a form that does not require reading application code or reverse-engineering compiled output. The system should be designed so expert review happens on the authored method layer before release, with the compiled layer serving as a faithful runtime artifact rather than the primary place where meaning is discovered.

The target architecture should separate four layers:

1. source authoring layer
2. method authoring layer
3. compiled release artifact
4. runtime engine consumption

## 1. Source Authoring Layer

Create a non-executable authoring tree, for example:

```text
textlens-v3/
  rules/
    sources/
      ihra/
        source.yaml
        clauses.yaml
        audit.md
      jda/
        source.yaml
        clauses.yaml
        audit.md
      ...
    taxonomy/
      items.yaml
    mappings/
      taxonomy-support.yaml
    modes/
      general.yaml
      healthcare.yaml
      academic.yaml
      bccsa.yaml
      press_code.yaml
```

Use YAML or JSON for authoring. YAML is likely the more practical choice here because it is easy to review in Git and readable by non-engineers.

### Source storage recommendation

For each source, store:

- stable `sourceKey`
- canonical title
- source type
- jurisdiction/domain
- canonical URL
- publication date or upstream version label
- last audited date
- local audit revision
- limitations and disallowed uses
- whether the full text is locally stored, excerpted, or externally referenced

For each clause/proposition, store:

- stable `clauseId`
- short title
- exact audited excerpt or paraphrased proposition
- proposition type:
  - `trigger`
  - `guardrail`
  - `integrity`
  - `terminology`
  - `framework`
- evidence threshold:
  - `explicit`
  - `strong_inference`
  - `contextual_pattern`
- allowed modes
- disallowed uses
- rationale note

### Important practical decision

Do not require the runtime to parse full primary-source documents.

Instead, keep:

- a human-reviewed clause/proposition file
- a source audit note explaining how TextLens interprets that source
- exact excerpt references where licensing permits

That keeps the system precise without turning the runtime into a document-ingestion engine.

### Human-review requirement

Every source package should be reviewable by an expert in one sitting. In practice that means:

- short, readable source metadata
- clause or proposition files written for human inspection
- an audit note explaining inclusion, scope, limits and disputed interpretive choices
- stable ids so reviewers can discuss exact items without ambiguity

If a reviewer cannot understand why a source is active and how it is used without opening runtime code, the design has failed.

## 2. Method Authoring Layer

The taxonomy, mappings and mode policies should also move out of handwritten TS runtime modules into reviewed data files.

### Taxonomy authoring

Move the current `src/taxonomyData.ts` into a structured authoring file that keeps:

- taxonomy item id
- definition
- family
- severity metadata
- boundary note
- relevant modes
- mode weighting
- origin label

### Mapping authoring

Do not derive the long-term mapping layer purely from `referenceKeys`.

Instead, store explicit reviewed mapping records such as:

- taxonomy item id
- supporting `sourceKey`
- supporting `clauseId` or proposition id
- support type
- rationale
- mode role

This is the most important structural upgrade after source authoring itself.

Mappings should be authored in a way that lets an expert reviewer answer three simple questions quickly:

- what claim is this taxonomy item making?
- which source proposition supports it?
- where is TextLens extending beyond external source support?

### Mode policy authoring

Move mode-policy definitions into authoring files that include:

- active sources
- active propositions
- confidence floor
- allowed taxonomy ids
- protected guardrail ids
- non-adjudication constraints
- summary style / boundary text

## 3. Compiled Rule Release Layer

Add a compiler script, for example:

- `scripts/compile-ruleset.ts`

Its job should be to:

1. read all authored YAML/JSON
2. validate schemas
3. validate referential integrity
4. resolve source clauses into compiled operational propositions
5. resolve taxonomy-support mappings
6. resolve mode allowlists
7. emit a versioned artifact and manifest

Suggested outputs:

```text
src/generated/rules/
  compiledRuleLayer.json
  compiledRuleLayer.ts
  ruleset-manifest.json
  docs-summary.json
```

### The runtime rule layer should become generated-only

After migration, the staged engine should consume:

- `src/generated/rules/compiledRuleLayer.json` or `.ts`

It should not import handwritten `sourceRules.ts`, `taxonomyMappings.ts`, or `modePolicies.ts` as primary sources anymore.

Those files can be removed or turned into generated outputs.

## 4. Runtime Engine Layer

The existing staged engine is a good base and should remain the orchestrator.

Recommended runtime shape:

- `stagedAnalysis.ts` keeps extraction, guardrails, classification, scoring and synthesis
- the engine reads only compiled artifacts
- server-side validation becomes stricter and artifact-aware

### Runtime should attach release metadata to every report

Each analysis result should record:

- `engineVersion`
- `rulesetVersion`
- `rulesetHash`
- `selectedMode`
- `compiledAt`
- `sourceVersions`
- model and timestamp

That gives each report a reproducible methodological fingerprint.

## Versioning Recommendation

Use three separate version concepts.

## 1. Engine version

This tracks executable pipeline logic:

- candidate extraction changes
- validator changes
- scoring changes
- synthesis-stage constraints

Suggested format:

- semantic versioning, for example `engine 2.3.0`

## 2. Ruleset version

This tracks authored methodological content:

- new sources
- changed mappings
- revised mode policies
- taxonomy item changes

Suggested format:

- semantic versioning, for example `ruleset 1.4.0`

Versioning rule:

- major: breaking interpretive or output changes
- minor: additive source/taxonomy/policy changes
- patch: non-breaking corrections, wording clarifications, metadata fixes

## 3. Source revision

Each source should also carry its own revision metadata:

- upstream publication/version label
- TextLens audit revision
- last reviewed date

Example:

- `ihra`: upstream `2016`, audit revision `2026-06`
- `icmje_recommendations_2026`: upstream `2026`, audit revision `2026-06`

## 4. Artifact hash

Every compiled ruleset release should include a content hash.

That hash is what makes the release truly auditable:

- same source inputs + same compiler + same ruleset version => same hash

## Human-Readable Methods and Governance Documentation

The rules engine should ship with two kinds of docs:

## 1. Stable manual docs

Keep and improve:

- `docs/current-analysis-method.md`
- `docs/method-governance.md`

But reorganize them under a method folder, for example:

```text
docs/method/
  overview.md
  governance.md
  release-process.md
  authoring-guide.md
```

These should explain:

- what each layer means
- who can change what
- what review is required
- what counts as a breaking methodological change

## 2. Generated release docs

Generate and commit release-facing docs from the compiled artifact, for example:

```text
docs/method/releases/
  ruleset-1.4.0.md
docs/method/generated/
  active-sources.md
  active-modes.md
  taxonomy-origins.md
```

These generated docs should summarize:

- active sources by mode
- taxonomy origin labels
- source-to-taxonomy mappings
- boundary notes and non-adjudication constraints
- what changed since the previous ruleset

They should be optimized for expert review, not just developer convenience.

## 3. Per-source audit notes

Maintain one human-readable audit note per source:

```text
docs/method/source-audits/
  ihra.md
  jda.md
  nexus.md
  ...
```

Each source audit note should record:

- what the source is
- why TextLens includes it
- how TextLens uses it
- what TextLens explicitly does not use it for
- any contested or interpretive decisions

This is the missing bridge between raw source material and compiled runtime rules.

## 4. Expert review packet

Each ruleset release should also produce a compact review packet for non-engineering reviewers, for example:

- active taxonomy items
- new or changed mappings
- changed mode policies
- changed source propositions
- open interpretive questions

That packet can be generated as Markdown and reviewed before a ruleset version is approved.

## Practical Recommended Directory Layout

```text
textlens-v3/
  rules/
    schemas/
      source.schema.json
      clause.schema.json
      taxonomy.schema.json
      mapping.schema.json
      mode.schema.json
    sources/
      <sourceKey>/
        source.yaml
        clauses.yaml
        audit.md
    taxonomy/
      items.yaml
    mappings/
      taxonomy-support.yaml
    modes/
      general.yaml
      healthcare.yaml
      academic.yaml
      bccsa.yaml
      press_code.yaml
  scripts/
    compile-ruleset.ts
    validate-ruleset.ts
  src/
    generated/
      rules/
        compiledRuleLayer.json
        compiledRuleLayer.ts
        ruleset-manifest.json
    analysis/
      engine/
        stagedAnalysis.ts
  docs/
    method/
      overview.md
      governance.md
      release-process.md
      source-audits/
      releases/
      generated/
```

## What Should Be Built Next

## Phase 1: Establish the authoring model

Build next:

1. `rules/` authoring directory and schemas
2. source manifests and clause files for a small first set:
   - `ihra`
   - `jda`
   - `nexus`
   - `textlens_framework`
3. mode-policy authoring files
4. explicit taxonomy-support mapping file

Do not change the staged engine yet beyond reading generated output later.

## Phase 2: Add the compiler and manifest

Build next:

1. `scripts/compile-ruleset.ts`
2. schema validation and referential checks
3. generated `compiledRuleLayer`
4. generated `ruleset-manifest.json`

Compiler validation should fail on:

- orphan source keys
- orphan clause ids
- taxonomy items referencing unknown sources
- mappings without rationale
- modes referencing missing propositions
- duplicate ids

## Phase 3: Repoint runtime to generated artifacts

Build next:

1. update `stagedAnalysis.ts` to import generated compiled rules
2. update `server.ts` to attach ruleset metadata to reports
3. retire handwritten runtime rule modules or convert them to generated files

This is where the architecture becomes real.

## Phase 4: Add release and governance discipline

Build next:

1. method release notes
2. per-source audit notes
3. ruleset version policy
4. changelog and approval checklist
5. expert review packet for each ruleset release

At this point, methods documentation and software releases start moving together.

## Phase 5: Add benchmark and regression coverage

Build next:

1. benchmark cases
2. ruleset regression runner
3. release gate comparing old vs new ruleset behavior

This should cover:

- clear positive cases
- clear protected-speech cases
- borderline anti-Zionism cases
- healthcare terminology cases
- academic/publication-integrity cases
- quote-validation and standards-mapping regression cases

## Recommended Non-Goals for the Next Sprint

Do not do these first:

- rebuild the UI from scratch
- replace the staged engine with a new orchestration model
- move source storage into a database
- try to auto-derive compiled rules from primary-source PDFs at runtime

Those would increase complexity before the authoring/compiled boundary is fixed.

## Bottom Line

### What exists now

TextLens already has a credible Phase 1 rules engine with:

- staged execution
- mode policies
- compiled source rules
- compiled taxonomy mappings
- documented method boundaries

### What is missing

The missing piece is a true ruleset lifecycle:

- canonical authoring files
- clause-level provenance
- generated runtime artifacts
- real release versioning
- benchmarked ruleset governance
- expert-readable review surfaces at every layer

### What should be built next

The next-stage architecture should turn the current handwritten TypeScript rule files into:

1. reviewed authoring data
2. validated compiled artifacts
3. versioned releases with manifests and hashes
4. human-readable method docs tied to those same releases

That is the practical path to making TextLens more precise, transparent, maintainable and auditable over time without discarding the current engine.
