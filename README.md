<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run TextLens in Codex

This repo contains the extracted TextLens app, adapted to run locally in Codex with the OpenAI API instead of AI Studio's Gemini integration.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `OPENAI_API_KEY` in `.env.local`
4. Optionally set `TEXTLENS_MODEL` if you do not want the default `gpt-5.5`
5. Run the app:
   `npm run dev`

The combined Express and Vite dev server runs on `http://localhost:3000`.

## Publish

### Recommendation

For this codebase, the easiest production path is:

- GitHub for source control
- Render for hosting

Why:

- TextLens is a combined React + Express app
- it needs a server-side `OPENAI_API_KEY`
- it already has a standard Node build/start flow

Netlify is possible in principle, but it is not the best fit for the current architecture because the app is not structured as Netlify Functions. Converting it would mean refactoring the backend.

AI Studio can deploy apps built in AI Studio Build Mode, but this local Codex codebase is no longer in that workflow. Recreating it there would be a separate project, not a one-click return path.

### GitHub + Render Steps

1. Create a new GitHub repository.
2. Push this `textlens-v3` folder to that repository.
3. In Render, choose `New +` then `Web Service`.
4. Connect the GitHub repo.
5. Render should pick up [`render.yaml`](/Users/garethkantor/Documents/TextLens/textlens-v3/render.yaml) automatically.
6. Set these environment variables in Render:
   - `OPENAI_API_KEY`
   - `VITE_WORKSPACE_PASSCODE`
   - optionally `TEXTLENS_MODEL`
7. Deploy.

### Manual Render Settings

If you do not use `render.yaml`, use:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

### Important Notes

- The server now respects `PORT`, which hosted Node platforms require.
- The production server serves the built frontend from `dist/`.
- Do not commit a real `.env.local` or API key to GitHub.
# textlens-v3
