# Literature Monitor MVP

The literature monitor is an upstream corpus builder for TextLens. In the current MVP it is deliberately narrow: it runs the same PubMed humanitarian title/abstract search used by the Humanitarian Attention Dashboard, against the same dashboard journal list, stores the retrieved article metadata and abstracts, and lets the Research Lab hand selected abstracts into the existing TextLens analysis workflow.

## What Exists

- The configured dashboard monitor lives in `config/literature-monitors.example.json`.
- The local corpus store lives in `data/literature-corpus/corpus.json`.
- PubMed retrieval is implemented in `scripts/update_literature_corpus.mjs`.
- Shared browser/server types live in `src/research/literatureCorpus.ts`.
- Server endpoints:
  - `GET /api/research/literature-corpus`
  - `POST /api/research/literature-corpus/status`
- The Research Lab displays one fixed **Run / Update Corpus** action, corpus summary, filters, matched humanitarian terms, status, and an Analyse handoff.

## Run It

The Research Lab includes a **Humanitarian Dashboard PubMed Search** panel for ordinary UI-driven use. Press **Run / Update Corpus** to run the fixed dashboard PubMed search and refresh the corpus table.

The command line remains available for operations and repeatable backfills.

Dry run:

```bash
npm run corpus:dry-run
```

Write the corpus:

```bash
npm run corpus:update
```

Backfill a specific window:

```bash
node scripts/update_literature_corpus.mjs --since 2023-10-07 --until 2026-07-25
```

Run the dashboard corpus monitor:

```bash
node scripts/update_literature_corpus.mjs --monitor humanitarian-dashboard-corpus
```

Set `NCBI_EMAIL` in the environment when running regular PubMed monitoring so NCBI can associate polite API traffic with the project.

## Design Notes

Retrieval and analysis are separated. This first monitor should be treated as the dashboard corpus, not as an antisemitism or anti-Zionism detector. A second dashboard can later slice the stored corpus by journal, crisis, matched terms, article type, review status, and TextLens analysis status.

Candidate tiers are:

- `direct`: explicit Israel, Gaza, Jewish, Zionism, antisemitism, or closely adjacent signals.
- `contextual`: high-salience conflict, legal/moral accusation, and health-system attack framing.
- `comparison`: crisis-comparison material for attention and prioritisation analysis.

The MVP stores abstracts and metadata only. Full-text retrieval, scheduling, Firestore persistence, analysis batching, and alert digests are natural next steps.
