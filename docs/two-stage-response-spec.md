# TextLens Two-Stage Response Spec

## Status

Plain-English product specification.

Drafted: 2026-06-27
Updated: 2026-06-28

This document describes the confirmed MVP two-stage workflow for Accountability Mode and, potentially later, other TextLens modes.

---

## Core Idea

TextLens should separate:

1. `analysis`
2. `draft response`

The analysis should stay as neutral, disciplined, and evidence-focused as possible.

The draft response should be a second step where the user decides how strongly TextLens should frame the follow-up.

This avoids mixing two different jobs:

- identifying what the text says and how well it is supported
- deciding how hard to challenge the author or publisher

---

## Why This Matters

At the moment, a report can drift too quickly from:

- "this claim is serious and needs support"

to:

- "this claim may be false"

Those are not the same thing.

The stronger statement should not be the default.

It should depend on:

- what basis the user has selected
- what supporting materials are available
- what response goal the user has in mind

---

## Recommended Workflow

### Stage 1. Analysis

This stage should answer:

- what claims does the article make?
- what evidence does the article itself provide?
- what evidence is missing, weak, questionable, or incomplete?
- what should you check independently?

This stage should be as stable and reusable as possible.

It should not change much based on the user's appetite for confrontation.

### Stage 2. Draft Response

This stage should answer:

- what kind of response do you want to prepare?
- how strong should the challenge be?
- what basis are you relying on?
- what tone should the draft use?

This stage should transform the analysis into a user-selected output such as:

- a request for sources
- a request for clarification
- a correction request
- a firmer notice
- a public-facing response draft

---

## Default Position

The default should be:

- run Stage 1 analysis
- if the user asks for a draft response, default to `Cautious`

This means TextLens should begin from:

- "please substantiate these serious claims"

not from:

- "these claims are false"

---

## Stage 1 Output

The analysis stage should remain plain and disciplined.

For Accountability Mode, the core output can stay close to the current structure:

- summary
- claims made by the article
- evidence given in the article
- missing or questionable evidence
- suggested next steps
- limits of the report

Important rule:

Stage 1 should describe evidentiary strength and gaps.

Stage 1 should not, by default, make final truth claims about external events unless the contradiction is shown directly in the submitted material.

---

## Stage 2 User Settings

Stage 2 should have a small number of clear settings.

### 1. Response Position

- `Cautious`
  Ask the author or publisher to substantiate serious claims.
- `Firm`
  Say that claims appear unsupported, overstated, incomplete, or potentially misleading.
- `Assertive`
  Say that specified claims appear contradicted, seriously unreliable, or potentially false based on the selected supporting materials.

### 2. Basis Used For The Response

- `Article only`
- `Article + supporting materials`
- `Article + supporting materials + your notes`

This setting is essential because TextLens should not make stronger claims than the underlying basis allows.

### 3. Response Goal

For the MVP, Stage 2 should support:

- `Request sources and clarification`
- `Request correction`

The user may select either one or both.

This reflects the practical reality that many first-step responses ask the publisher both to show the basis for a claim and to clarify what exactly is being asserted.

### 4. Tone

For the MVP, tone should be fixed to:

- `Professional`

---

## Governing Rule

The response stage must not exceed the basis selected by the user.

Examples:

- If the basis is `Article only`, TextLens may say the article does not show enough support for the claim.
- If the basis includes strong supporting materials, TextLens may say the article appears to overstate, misstate, or conflict with the underlying record.
- If the basis is weak or incomplete, TextLens should stay cautious even if the user selects a stronger tone.

This is the single most important control rule in the two-stage design.

---

## Supporting Materials

The second stage becomes much more useful if the user has supporting materials.

In plain English, these are documents used to test whether the article matches the underlying record.

Examples:

- court orders and judgments
- official reports
- public institutional statements
- casualty datasets and methodology notes
- editorial or publication standards
- archived pages or screenshots
- user notes or prior correspondence

These materials should help TextLens ask:

- does the article accurately describe the source?
- does it overstate what the source says?
- does it omit a critical qualifier?
- does it cite a source that does not support the claim?
- is the source itself weak, indirect, or contested?

---

## Recommendation On Scope

### Short answer

Build this as a general TextLens pattern, but introduce it in `Accountability Mode` first.

### Why not make it universal immediately?

Not every mode needs the same kind of response drafting.

For example:

- Accountability Mode is directly about challenge, substantiation, and follow-up.
- Healthcare Mode is often more about standards, publication quality, patient risk, and editorial rigor.
- Academic Mode may be more concerned with argument quality, sourcing, and institutional framing.

So the response logic should not be forced into every mode all at once.

### Why still design it as a shared pattern?

Because the separation itself is useful across the product:

- first analyze
- then decide how to respond

That architecture is likely to be valuable in several modes even if the actual response options differ.

So the recommended product approach is:

1. `Phase 1`
   Implement the two-stage response model in Accountability Mode only.

2. `Phase 2`
   Reuse the same architecture in other modes where it adds value.

3. `Phase 3`
   Let each mode define its own response goals and permitted wording.

In other words:

- shared framework
- mode-specific response templates

---

## How This Might Apply To Other Modes Later

### Accountability Mode

Best fit for the full two-stage system.

Typical outputs:

- request for substantiation
- correction request
- formal notice
- public-facing challenge draft

### Healthcare Mode

Possible later fit, but with different response goals.

Typical outputs might be:

- request for sourcing or methodology clarification
- editor or publisher query
- note about evidence quality or publication standards
- internal review memo

This mode should stay especially careful about patient safety, scientific uncertainty, and non-adjudication language.

### Academic Mode

Possible later fit.

Typical outputs might be:

- request for clarification
- standards-based challenge
- peer-review style critique
- institutional follow-up memo

### Community / General Review Mode

Probably the weakest fit for now.

This mode is more interpretive and diagnostic.

It may still benefit from separate response drafting later, but it should not be the first place this is built.

---

## UX Recommendation

The user should not feel buried in settings before they have even seen the analysis.

So the sequence should be:

1. Run the analysis.
2. Show the report.
3. Offer `Draft Response` as a next step.
4. Let the user choose:
   - response position
   - basis
   - goal
   - tone
5. Generate the response draft from those settings.

This keeps the first experience simple and the second step intentional.

The Stage 2 form should also include:

- a free-text field for `your notes`

These notes become part of the selected response basis only if the user chooses:

- `Article + supporting materials + your notes`

---

## Recommended MVP

The first version should be modest.

### Stage 1

Keep the current Accountability Mode analysis structure, but treat it as analysis only.

The first-stage report should not automatically generate the final response draft as part of the core analysis action.

### Stage 2

Add a separate draft response action with:

- `Cautious`, `Firm`, `Assertive`
- `Article only`, `Article + supporting materials`, `Article + supporting materials + your notes`
- `Request sources and clarification`
- `Request correction`
- one fixed `Professional` tone
- a free-text notes field

The strongest claims should be allowed only where the selected basis supports them.

### Storage Model For MVP

Stage 1 and Stage 2 should be stored together under the same saved report.

The recommended MVP model is:

- one saved Accountability report
- one optional attached Stage 2 response object

This avoids creating a separate storage subsystem for draft responses while keeping the two stages conceptually distinct.

---

## Product Benefit

This two-stage model gives TextLens a stronger and more credible position.

It allows the product to say:

- first, here is the analysis
- second, here is the response you asked for
- third, here is how strong that response is allowed to be, given the basis selected

That is clearer for the user, safer for the product, and easier to extend later.
