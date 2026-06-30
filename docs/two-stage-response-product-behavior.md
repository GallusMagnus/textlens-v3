# TextLens Two-Stage Response

## Product Behavior Note

Audience: potential users, testers, and early reviewers.

Updated: 2026-06-28

---

## What This Feature Does

TextLens Accountability Mode separates:

1. `analysis`
2. `draft response`

This means the product does not immediately jump from reviewing an article to accusing it of being false or misleading.

Instead, it first shows the analytical picture:

- what the article claims
- what evidence the article gives
- what support appears missing, weak, or questionable
- what the user should check next

Only after that can the user choose to generate a response draft.

---

## Why This Matters

In accountability work, there is an important difference between:

- saying that a serious claim needs support

and:

- saying that a claim appears false or contradicted

Those are not the same step.

TextLens is designed to keep those steps separate so that the response stays proportionate to the evidence available.

---

## How The MVP Works

### Stage 1: Analysis

The user submits the article or other contested material.

TextLens produces an Accountability report that focuses on:

- claims made by the article
- evidence given in the article
- missing or questionable evidence
- suggested next steps
- limits of the report

The first stage is intended to be neutral, disciplined, and reusable.

By default, it should not make final truth claims about external events unless contradiction is directly shown in the submitted material.

### Stage 2: Draft Response

After reviewing the Stage 1 report, the user can choose to generate a response draft.

The user controls:

- `Response position`: `Cautious`, `Firm`, or `Assertive`
- `Basis used`: `Article only`, `Article + supporting materials`, or `Article + supporting materials + your notes`
- `Response goals`: `Request sources and clarification`, `Request correction`, or both

For the MVP, tone is fixed to:

- `Professional`

Stage 2 also includes:

- a free-text field for user notes

---

## Governing Rule

The draft response must not be stronger than the basis selected by the user.

Examples:

- If the basis is `Article only`, TextLens should focus on asking the publisher to substantiate, clarify, or qualify serious claims.
- If the basis includes strong supporting materials, TextLens may say that an article appears to overstate, misstate, or conflict with the underlying record.
- If the user includes notes, those notes may shape the response only when the basis explicitly includes them.

This is the main safeguard in the feature.

---

## How Supporting Materials Are Used

Supporting materials help the user test whether the article matches the underlying record.

Examples include:

- court orders and judgments
- official reports
- public statements
- datasets and methodology notes
- editorial or publication standards
- screenshots, archives, or prior correspondence

TextLens should use these materials to ask questions such as:

- does the article accurately describe the source?
- does it overstate what the source says?
- does it leave out a key qualifier?
- does it rely on a source that does not support the claim?

---

## Default Product Position

The default TextLens stance in this workflow is cautious.

In plain language, the product should begin from:

- `please substantiate or clarify these serious claims`

not from:

- `these claims are false`

That stronger language should only appear if the selected basis supports it.

---

## What Potential Users Should Expect

Potential users should understand that this feature is meant to help them:

- review contested claims more systematically
- separate analysis from advocacy
- produce better structured and more proportionate follow-up drafts

It is not designed to:

- make final legal findings
- decide truth on the basis of unsupported assumptions
- replace independent editorial, legal, or factual review

---

## MVP Scope

The MVP is for:

- `Accountability Mode` only

It is not yet intended as a universal behavior across all TextLens modes.

Other modes may adopt the same two-stage structure later, but with different response goals and different boundaries.
