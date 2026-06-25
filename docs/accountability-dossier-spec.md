# TextLens Accountability And Dossier Mode Spec

## Status

Plain-English product specification.

Drafted: 2026-06-24

This document describes a possible future TextLens capability inspired by a more offensive, accountability-oriented workflow: not just rebutting allegations, but documenting them, tracing their downstream use, and preparing structured action packs.

This is a workflow specification, not a legal opinion and not a commitment that every feature below should be built exactly as written.

---

## Core Idea

TextLens already helps a user identify questionable claims, rhetorical distortions, and evidentiary gaps in a text.

The next logical step is to help the user move from:

- "this looks wrong"

to:

- "this has been documented"
- "the allegation chain has been mapped"
- "the evidence trail is organised"
- "the follow-up tasks are clear"
- "the correction, notice, or complaint package is ready for human review"

This mode should not try to act as a law firm, investigator, or court.

It should act as a disciplined evidence-and-workflow assistant.

---

## Product Goal

Create a TextLens mode that helps a user build a structured accountability case file around a contested allegation.

That case file should help the user:

1. identify the exact claims that matter
2. distinguish fact claims from insinuations, omissions, and framing devices
3. track where a claim came from and where it spread
4. record what evidence is already available
5. record what evidence still needs to be found independently
6. prepare an "action pack" for correction, notice, complaint, donor scrutiny, regulatory escalation, or legal review

---

## Product Positioning

This mode should be presented as:

- a dossier builder
- a claim-tracing assistant
- an evidence-organisation tool
- a notice-and-escalation preparation tool

It should not be presented as:

- a defamation detector
- an automated legal conclusion engine
- a final factual adjudicator
- a substitute for legal counsel

---

## Main User Need

The user is often not asking only:

- "is this article biased?"

They are asking:

- "what exactly is being alleged?"
- "where did this allegation come from?"
- "what evidence would rebut or test it?"
- "who repeated it?"
- "what should we do next?"

The product should therefore support action planning, not just content analysis.

---

## Recommended Name

Working names:

- `Accountability Mode`
- `Dossier Mode`
- `Claim Tracking & Action Mode`

Best current working label:

- `Accountability / Dossier Mode`

---

## Scope

This mode should work on a specific disputed source item, such as:

- an article
- a report
- a submission
- a UN or NGO document
- a press release
- a campus motion
- a speech transcript
- a donor or policy briefing

It may also support a small set of linked downstream items where the same allegation is repeated.

This should not initially be a full internet-scale monitoring system.

---

## Non-Goals

This mode should not initially:

- crawl the open web automatically
- verify every external fact on its own
- determine whether a statement is legally defamatory
- identify the correct legal jurisdiction automatically with confidence
- decide whether litigation should be filed
- assess damages
- accuse individuals of bad faith unless the record clearly supports that conclusion

---

## What TextLens Can And Cannot Source

This distinction must be explicit in both the interface and the exported output.

### What TextLens may source or document directly

TextLens can usually document or extract:

- the exact text supplied by the user
- exact quotations from that text
- metadata supplied by the user
- metadata extracted from uploaded files
- claims and passages flagged within the supplied text
- the presence or absence of citations inside the supplied text
- whether the same uploaded dossier contains repeated or circular references
- the internal structure of the allegation as expressed in the supplied material
- any linked source items the user uploads separately
- the workflow status of notices, tasks, and evidence requests entered by the user

If browser or connector capabilities are later added, TextLens may also document:

- URLs
- screenshots
- publication dates
- archived copies
- quoted public statements
- the existence of downstream republication

But these should still be treated as documented source records, not as final truth.

### What TextLens should help organise but not claim to determine independently

These are matters TextLens can help the user investigate, but should not present as settled unless backed by reviewed evidence:

- whether a claim is factually false
- whether an omission is materially misleading
- whether a source was knowingly reckless
- whether downstream actors had notice
- whether a regulator has jurisdiction
- whether a politician was protected by privilege
- whether a donor relationship is relevant
- whether legal harm is provable
- whether a court claim is likely to succeed
- whether a public body relied unlawfully on a report

### Required product rule

Every important finding in this mode should be labelled as one of:

- `Documented from supplied material`
- `Inferred but unverified`
- `Requires independent evidence`
- `Requires legal review`

This labelling is essential.

---

## Core Output: The Case File

The central object in this mode should be a structured case file.

Plain-English sections:

1. contested source
2. extracted claims
3. evidence already in hand
4. evidence still needed
5. allegation chain
6. affected parties
7. downstream use
8. task list
9. draft notices and complaints
10. exportable action pack

---

## Core Workflow

### Step 1. Load the contested source

The user uploads or pastes the primary item under dispute.

Examples:

- article
- report
- transcript
- campus resolution
- NGO dossier

### Step 2. Extract claims

TextLens should separate:

- direct factual allegations
- implied factual allegations
- legal characterisations
- causal claims
- insinuations
- omissions
- rhetorical pressure phrases

This is narrower and more useful than a generic "bias report."

### Step 3. Build the allegation map

For each claim, TextLens should help record:

- who made the claim
- where it appeared
- what source was cited
- whether the source is primary, secondary, or circular
- whether the claim appears again in later documents

### Step 4. Build the evidence ledger

For each contested claim, TextLens should separate:

- evidence the user already has
- evidence the user still needs to locate
- evidence that should be requested from others
- evidence that may require legal process or formal notice

### Step 5. Build the action pack

This should be the practical output.

The action pack should not mainly be rhetorical prose.

It should mainly be:

- a task list
- a document collection checklist
- an evidence trail
- a notice log
- optional draft letters

That is likely the strongest fit with the approach you described.

---

## Key Data Structures In Plain English

The product does not need to expose these as technical schema objects to users, but the workflow should be built around them.

### Claim Record

Each claim record should include:

- exact quote
- claim summary in plain English
- claim type
- location in source
- source cited by the author, if any
- contradiction or challenge point
- confidence level
- status:
  - documented
  - disputed
  - unverified
  - requires more evidence

### Source Record

Each source record should include:

- title
- author or issuing entity
- date
- URL or file
- source type
- uploaded copy or screenshot
- notes on relevance

### Downstream Use Record

Each downstream use record should include:

- repeating party
- date
- platform or venue
- exact reused allegation
- whether notice has been sent
- whether correction was made

### Notice Record

Each notice record should include:

- recipient
- date sent
- type of notice
- issue raised
- evidence attached
- response received
- next follow-up date

### Evidence Task Record

Each evidence task should include:

- task description
- why it matters
- who should do it
- target deadline
- status

---

## The Action Pack

This should be the main export.

### Recommended purpose

An action pack is a practical dossier for human use.

It is not a final legal submission.

It is a working pack that helps a user or team decide what to do next.

### Recommended sections

1. `Case Summary`

- what the source is
- why it is contested
- what kind of harm or risk may follow

2. `Priority Claims To Challenge`

- top contested allegations
- why they matter
- current evidence status

3. `Documents To Find`

Examples:

- original cited report
- full interview or transcript
- earlier version of article
- archived copy
- donor or funding disclosure
- methodology note
- institutional policy relied upon
- public body decision memo

4. `Evidence Trails To Follow`

Examples:

- trace quote from article back to NGO report
- compare NGO report to cited primary evidence
- identify whether later article copied earlier wording
- determine whether correction was ignored after notice
- track whether allegation moved from media into policy action

5. `Tasks`

Examples:

- obtain original source document
- preserve web snapshots
- collect republication examples
- prepare correction file
- send preservation notice
- check whether regulator or press body is available
- identify whether downstream user had notice before repeating claim

6. `Potential Follow-Up Paths`

Examples:

- press correction request
- editor letter
- donor complaint
- charity-regulator complaint
- university complaint
- professional-body complaint
- public body challenge
- referral for legal review

7. `Draft Materials`

Optional drafts:

- correction letter
- preservation request
- donor inquiry letter
- regulator complaint draft
- public response note

### Important design choice

The action pack should be checklist-heavy and evidence-heavy.

It should not mostly be long narrative prose.

That matches the use case better.

---

## Research Boundary Warnings

This mode should repeatedly tell the user:

- TextLens can organise, extract, compare, and document.
- TextLens cannot independently prove every external fact.
- TextLens can suggest what evidence is missing.
- The user or their advisers must still obtain and validate critical outside evidence.

This warning should appear:

- in the UI
- in exports
- in draft notices
- in case-file summaries

---

## User Experience Principles

### Principle 1. Show the boundary between "found" and "needed"

This is probably the most important design rule.

Every case file should make it obvious:

- what is already documented
- what remains unknown
- what must be independently checked

### Principle 2. Prefer disciplined structure over rhetorical heat

This mode should feel procedural and calm.

The product should not encourage overstatement.

### Principle 3. Make tasks actionable

The user should leave with:

- a set of next steps
- a document acquisition plan
- a notice plan
- a recordkeeping structure

### Principle 4. Keep human review central

The product should frequently invite human review before:

- accusing a person or entity of falsehood
- escalating to a regulator
- sending external notices
- exporting complaint packs

---

## Recommended UI Additions

These can be built without replacing the current analysis workflow.

### Option A: Add a new tab

Recommended new tab:

- `Dossier`

This tab would sit after `Report` and before or near `Export`.

### Option B: Add a mode

Recommended new mode:

- `Accountability / Dossier`

This mode would change the output emphasis from scoring and standards analysis toward claims, evidence, downstream use, and next actions.

### Option C: Keep analysis and dossier separate

Best practical path:

- first run analysis
- then promote report findings into a dossier workspace

This is probably the safest initial implementation.

---

## Recommended Phase 1 Scope

Phase 1 should avoid web automation and large factual promises.

### Phase 1 features

- claim extraction table
- contested allegation list
- evidence-in-hand vs evidence-needed tracker
- downstream use tracker entered manually by the user
- notice log
- task list
- action pack export
- draft correction and complaint templates

### Why this is a good first phase

- fits current TextLens architecture
- low legal overreach risk
- high practical value
- does not require broad autonomous research claims

---

## Recommended Phase 2 Scope

Only after Phase 1 is stable:

- URL capture
- screenshot capture
- archived-copy support
- linked-source comparison
- document bundle management
- connector-based source retrieval where the user explicitly provides or approves targets

Even in Phase 2, the product should still avoid pretending it has independently "proven" external facts.

---

## Export Formats

Recommended export types:

- `Action Pack`
- `Evidence Ledger`
- `Claim Comparison Table`
- `Notice Log`
- `Chronology Pack`

### Most useful first export

The first export should probably be:

- `Action Pack`

Because it is the best bridge between analysis and real-world action.

---

## Example Plain-English Output

An ideal output should read more like this:

"Three claims in the article should be prioritised. Two are directly documented in the uploaded material. One appears to rely on an external report that has not yet been obtained. Before sending a correction letter, obtain the original cited report, archive the article, and record all downstream republications. After notice is sent, track whether any recipient repeats the claim again."

And less like this:

"This article is defamatory and should lead to immediate legal action."

The first is useful and responsible.

The second is too strong for the system to claim.

---

## Risks

Main risks if built badly:

- overclaiming factual certainty
- overclaiming legal conclusions
- making users think the system has independently verified external facts
- generating accusatory drafts too early
- collapsing procedural work into emotional narrative

These risks are manageable if the workflow stays evidence-led and explicitly bounded.

---

## Summary Recommendation

This capability is feasible and fits TextLens well if it is built as:

- a dossier and evidence workflow layer

not as:

- an automated legal adjudication layer

The strongest version of this concept is a mode or tab that helps users:

- extract claims
- map allegation chains
- identify missing documents
- preserve evidence
- track notice
- prepare action packs

The action pack should be mostly:

- tasks
- documents to find
- evidence trails to follow
- draft notices for human review

That is both realistic and useful, and it matches the operational direction described in the article much better than simply adding more analytical prose.
