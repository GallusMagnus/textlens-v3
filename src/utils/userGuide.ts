/**
 * TextLens User Guide Generator
 * Generates and triggers download of a beautifully styled, comprehensive,
 * standalone HTML User & Reference Guide.
 */

export function downloadUserGuide(action: 'download' | 'view' = 'download') {
  const guideHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TextLens™ User Guide</title>
  <style>
    :root {
      --primary: #4f46e5;
      --primary-dark: #3730a3;
      --primary-light: #e0e7ff;
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-600: #475569;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
      --amber-600: #d97706;
      --amber-50: #fffbeb;
      --red-600: #dc2626;
      --red-50: #fef2f2;
      --blue-50: #eff6ff;
      --blue-700: #1d4ed8;
      --violet-50: #f5f3ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: var(--slate-700);
      background: var(--slate-50);
      line-height: 1.6;
    }
    header {
      background: linear-gradient(135deg, var(--slate-900) 0%, #1e293b 100%);
      color: white;
      padding: 3rem 2rem;
      border-bottom: 4px solid var(--primary);
    }
    .header-container, .container, .footer-container {
      max-width: 1040px;
      margin: 0 auto;
    }
    .header-meta {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.78rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 2.35rem;
      line-height: 1.1;
      margin: 0 0 0.7rem;
      color: white;
      letter-spacing: -0.03em;
    }
    .subtitle {
      max-width: 820px;
      margin: 0;
      color: #cbd5e1;
      font-size: 1.06rem;
    }
    .container { padding: 2.5rem 1.5rem; }
    .toc, section {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: 14px;
      box-shadow: 0 1px 3px rgba(15,23,42,0.04);
    }
    .toc {
      padding: 1.5rem 1.75rem;
      margin-bottom: 2.25rem;
    }
    .toc h2 {
      font-size: 0.9rem;
      border: 0;
      padding: 0;
      margin: 0 0 1rem;
      color: var(--slate-900);
      text-transform: uppercase;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: 0.08em;
    }
    .toc ul {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.55rem 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    @media (min-width: 760px) { .toc ul { grid-template-columns: 1fr 1fr; } }
    .toc a { color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.94rem; }
    .toc a:hover { text-decoration: underline; }
    section {
      padding: 2.3rem;
      margin-bottom: 2rem;
    }
    h2 {
      color: var(--slate-900);
      margin: 0 0 1.2rem;
      padding-bottom: 0.7rem;
      border-bottom: 1px solid var(--slate-200);
      font-size: 1.35rem;
    }
    h3 {
      color: var(--slate-800);
      margin: 1.6rem 0 0.65rem;
      font-size: 1.08rem;
    }
    p { margin: 0 0 1rem; font-size: 0.96rem; }
    ul, ol { margin: 0 0 1rem 1.3rem; padding: 0; }
    li { margin-bottom: 0.45rem; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.1rem 0 1.35rem;
      font-size: 0.9rem;
    }
    th, td {
      border: 1px solid var(--slate-200);
      padding: 0.75rem 0.85rem;
      vertical-align: top;
      text-align: left;
    }
    th { background: var(--slate-100); color: var(--slate-900); }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.86em;
      background: var(--slate-100);
      padding: 0.08rem 0.28rem;
      border-radius: 4px;
      color: var(--slate-900);
    }
    .callout {
      border-left: 4px solid var(--primary);
      background: var(--primary-light);
      color: #1e1b4b;
      padding: 1.05rem 1.2rem;
      border-radius: 9px;
      margin: 1.3rem 0;
      font-size: 0.93rem;
    }
    .callout strong { display: block; color: #312e81; margin-bottom: 0.25rem; }
    .warning { border-left-color: var(--amber-600); background: var(--amber-50); color: #78350f; }
    .warning strong { color: #92400e; }
    .danger { border-left-color: var(--red-600); background: var(--red-50); color: #7f1d1d; }
    .danger strong { color: #991b1b; }
    .ok { border-left-color: var(--emerald-600); background: var(--emerald-50); color: #064e3b; }
    .ok strong { color: #047857; }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 1.2rem 0;
    }
    @media (min-width: 760px) { .grid.two { grid-template-columns: 1fr 1fr; } .grid.three { grid-template-columns: repeat(3, 1fr); } }
    .card {
      border: 1px solid var(--slate-200);
      background: var(--slate-50);
      border-radius: 10px;
      padding: 1rem;
    }
    .card h3 { margin-top: 0; }
    .badge {
      display: inline-block;
      border: 1px solid var(--slate-300);
      border-radius: 999px;
      padding: 0.18rem 0.55rem;
      font-size: 0.74rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--slate-700);
      background: white;
      margin-bottom: 0.55rem;
    }
    .layer-list {
      list-style: none;
      margin-left: 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }
    .layer-list li {
      border: 1px solid var(--slate-200);
      border-left: 5px solid var(--primary);
      border-radius: 9px;
      padding: 0.9rem 1rem;
      background: white;
    }
    .layer-list li.guardrail { border-left-color: var(--emerald-600); }
    .layer-list li.traditional { border-left-color: var(--red-600); }
    .layer-list li.israel { border-left-color: var(--amber-600); }
    .layer-list li.rhetoric { border-left-color: var(--primary); }
    .small { font-size: 0.86rem; color: var(--slate-600); }
    footer {
      background: var(--slate-900);
      color: #94a3b8;
      padding: 2rem;
      font-size: 0.82rem;
    }
    .footer-container { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    @media print {
      body { background: white; color: black; }
      header { background: white; color: black; border-bottom: 2px solid black; padding: 1rem 0; }
      h1, .subtitle, h2, h3, p, li, td, th { color: black !important; }
      section, .toc { border: 0; box-shadow: none; page-break-inside: avoid; }
      a { color: black; text-decoration: underline; }
    }
  </style>
</head>
<body>
  <header>
    <div class="header-container">
      <div class="header-meta">
        <span><strong>System:</strong> TextLens</span>
        <span><strong>Guide:</strong> user and reference manual</span>
        <span><strong>Updated:</strong> June 2026</span>
      </div>
      <h1>TextLens™ User Guide</h1>
      <p class="subtitle">A practical guide to using TextLens: what the app does, how the mode families differ, what the outputs mean, and where human review remains essential.</p>
    </div>
  </header>

  <div class="container">
    <nav class="toc">
      <h2>Contents</h2>
      <ul>
        <li><a href="#overview">1. What TextLens is</a></li>
        <li><a href="#workflow">2. Basic workflow</a></li>
        <li><a href="#modes">3. Analysis modes</a></li>
        <li><a href="#taxonomy">4. Taxonomy and guardrails</a></li>
        <li><a href="#healthcare">5. Healthcare Publishing Mode</a></li>
        <li><a href="#legal-criteria">6. Legal terminology and criteria mapping</a></li>
        <li><a href="#sources">7. Standards and source summaries</a></li>
        <li><a href="#outputs">8. Outputs and exports</a></li>
        <li><a href="#responsible-use">9. Responsible use</a></li>
        <li><a href="#limits">10. Current limitations</a></li>
      </ul>
    </nav>

    <section id="overview">
      <h2>1. What TextLens is</h2>
      <p><strong>TextLens</strong> is a structured review tool for analysing articles, statements, broadcasts, academic texts and healthcare-publication materials that discuss Jews, Israel, Zionism, antisemitism or conflict-related humanitarian issues.</p>
      <p>It is designed to help users organise evidence, identify exact passages, compare the text against selected standards, consider benign interpretations, and prepare material for human review, education, research, editorial response or complaint drafting.</p>
      <div class="callout">
        <strong>Human review remains central</strong>
        TextLens is an analytical copilot. It does not censor content, decide complaints, act as a regulator, issue legal opinions, or replace editorial, legal, academic or community judgement.
      </div>
      <p>TextLens has two mode families:</p>
      <ul>
        <li><strong>Consumer Mode:</strong> a public-facing review mode for community monitoring, scoring and response-worthiness.</li>
        <li><strong>Professional Modes:</strong> standards-based modes for specialist, institutional, editorial and regulatory review.</li>
      </ul>
      <p>The app also separates three things that are often confused:</p>
      <ul>
        <li><strong>Mode:</strong> the review context selected by the user.</li>
        <li><strong>Taxonomy:</strong> the structured set of possible textual and rhetorical concerns.</li>
        <li><strong>Standards, frameworks and source summaries:</strong> the compact references made available to the model for the selected mode.</li>
      </ul>
    </section>

    <section id="workflow">
      <h2>2. Basic workflow</h2>
      <div class="grid two">
        <div class="card">
          <span class="badge">Step 1</span>
          <h3>Select the analysis mode</h3>
          <p>Choose between Consumer Mode and the Professional Modes. The selected mode controls the standards, source rules and boundaries used during review.</p>
        </div>
        <div class="card">
          <span class="badge">Step 2</span>
          <h3>Paste or upload text</h3>
          <p>Paste text directly or upload a PDF/DOCX file for text extraction. Extracted text should still be checked for completeness and formatting errors.</p>
        </div>
        <div class="card">
          <span class="badge">Step 3</span>
          <h3>Add metadata</h3>
          <p>Add title, author, publication platform, date, URL, article type, communication type and rhetorical function where available. Better metadata usually improves interpretation.</p>
        </div>
        <div class="card">
          <span class="badge">Step 4</span>
          <h3>Run and review</h3>
          <p>Run the analysis, inspect exact quotes, guardrail findings, alternative interpretations, limitations, source use and any draft response before using the output.</p>
        </div>
      </div>
      <div class="callout warning">
        <strong>Do not skip review</strong>
        A strong-looking report can still be wrong if the source text is incomplete, the metadata is wrong, or the model overstates a source summary. Treat outputs as review material, not final findings.
      </div>
      <p>At a high level, TextLens works in stages: it selects the relevant mode rules, looks for candidate passages in the submitted text, applies protected-speech guardrails, classifies surviving passages against the taxonomy, and then produces a structured summary for human review.</p>
    </section>

    <section id="modes">
      <h2>3. Analysis modes</h2>
      <p>TextLens separates <strong>Consumer Mode</strong> from <strong>Professional Modes</strong>. Consumer Mode is broader and more public-facing. The Professional Modes are narrower and more standards-bound.</p>
      <div class="grid two">
        <div class="card">
          <span class="badge">Consumer Mode</span>
          <h3>Community / General Review Mode</h3>
          <p>Used for community monitoring, scoring, response triage and broad public-facing review. It is not a regulatory or legal mode.</p>
        </div>
        <div class="card">
          <span class="badge">Professional Modes</span>
          <h3>Specialist review contexts</h3>
          <p>Used when the review needs a clearer standards framework, such as consensus antisemitism definitions, healthcare publication ethics, academic norms, broadcast rules or press-code review.</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Backend value</th>
            <th>Purpose</th>
            <th>Main output emphasis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Community / General Review Mode</strong></td>
            <td><code>consumer</code></td>
            <td>Community monitoring, education, advocacy triage and response-worthiness.</td>
            <td>Scoring/radar output, practical narrative, suggested response where warranted.</td>
          </tr>
          <tr>
            <td><strong>Consensus Standards Mode</strong></td>
            <td><code>general</code></td>
            <td>Balanced analysis using IHRA, JDA, Nexus and the TextLens framework.</td>
            <td>Standards-based judgement with strict guardrails and alternative interpretations.</td>
          </tr>
          <tr>
            <td><strong>Healthcare Publishing Mode</strong></td>
            <td><code>healthcare</code></td>
            <td>Healthcare, medical, bioethics, public-health, journal and healthcare-in-conflict publications.</td>
            <td>Publication ethics, medical-authority use, health reporting quality, conflict terminology and criteria mapping.</td>
          </tr>
          <tr>
            <td><strong>Academic/University Mode</strong></td>
            <td><code>academic</code></td>
            <td>Academic speech, scholarly commentary, university statements, petitions and open letters.</td>
            <td>Academic freedom guardrails, evidentiary standards, institutional authority and publication-ethics issues where relevant.</td>
          </tr>
          <tr>
            <td><strong>BCCSA Mode</strong></td>
            <td><code>bccsa</code></td>
            <td>South African broadcast and broadcaster-linked online content.</td>
            <td>Accuracy, context, fairness, balance, harm, right of reply and possible complaint drafting.</td>
          </tr>
          <tr>
            <td><strong>Press Code Mode</strong></td>
            <td><code>press_code</code></td>
            <td>South African print and online press material.</td>
            <td>Truth, accuracy, fairness, context, distinction between fact and comment, discrimination and possible complaint drafting.</td>
          </tr>
          <tr>
            <td><strong>Accountability Mode</strong></td>
            <td><code>accountability</code></td>
            <td>Plain-English review of what an article claims, what evidence it gives, what is missing, and what a responsible follow-up response should ask for.</td>
            <td>Stage 1 accountability report plus optional Stage 2 draft response built from that report.</td>
          </tr>
        </tbody>
      </table>
      <div class="callout warning">
        <strong>Accountability Mode is different</strong>
        Accountability Mode is not the main antisemitism-classification workflow. It treats antisemitism frameworks as background context only and focuses on accountability questions: what claims the article makes, what evidence it provides, what remains unsupported, and what an editor, author or institution should be asked to clarify.
      </div>
      <p>In practical terms, Accountability Mode is a two-step workflow. <strong>Stage 1</strong> produces the accountability analysis. <strong>Stage 2</strong> uses that completed analysis to draft a professional response. If you need a fuller antisemitism analysis, run the same text separately in Community / General Review Mode or another standards-based mode.</p>
      <p><strong>Communication type</strong> and <strong>rhetorical function</strong> are interpretive context. They do not decide whether a text is antisemitic or unethical; they help the system ask whether claims are appropriate for a news report, editorial, open letter, academic article, broadcast segment, formal complaint, petition or other text type.</p>
    </section>

    <section id="taxonomy">
      <h2>4. Taxonomy and guardrails</h2>
      <p>The taxonomy organises recurring textual patterns. It is a working analytical framework, not a legally authoritative diagnostic instrument. TextLens should tie each flagged concern to an exact quote and should also record protected-speech guardrails where relevant.</p>
      <ul class="layer-list">
        <li class="guardrail"><strong>Layer 0: Protected speech and non-trigger guardrails.</strong><br />Ordinary political criticism, human-rights advocacy, policy disagreement, BDS and other boycott advocacy, alternative political arrangements, and other protected expressions should not be treated as antisemitic without additional textual evidence. TextLens does not treat BDS as inherently antisemitic in this build, though some institutions and users would take a broader view.</li>
        <li class="traditional"><strong>Layer 1: Traditional antisemitism.</strong><br />Classic anti-Jewish slurs, conspiracy tropes, dehumanising language, collective guilt, blood-libel patterns, Holocaust denial or distortion, and similar content directed at Jews as Jews.</li>
        <li class="israel"><strong>Layer 2: Israel- and Zionism-related antisemitism.</strong><br />Patterns in which Israel or Zionism is used as a vehicle for antisemitic claims, such as denial of Jewish self-determination, Nazi inversion, demonisation, collective guilt, or use of classic tropes in Israel-related language.</li>
        <li class="rhetoric"><strong>Layer 3: Rhetorical and evidentiary taxonomy.</strong><br />This layer reviews seven families of concern: evidence handling, language and emphasis, agency and responsibility, conflation and substitution, frame-shifting and preconditions, immunity and counter-attack, and authority and amplification. These findings may distort understanding even when direct antisemitism is not present.</li>
      </ul>
      <div class="callout ok">
        <strong>Guardrails are not decorative</strong>
        A reliable TextLens report should actively ask whether protected criticism or benign interpretations apply. This is especially important for open letters, petitions, editorials and moral appeals.
      </div>
      <div class="callout warning">
        <strong>Current build scope</strong>
        The June 2026 Layer 3 taxonomy includes a cumulative-framing idea aimed at repeated distortions across multiple publications over time. That element is intentionally deferred in this build because the live engine analyses single submitted texts rather than publication histories or corpora.
      </div>
    </section>

    <section id="healthcare">
      <h2>5. Healthcare Publishing Mode</h2>
      <p><strong>Healthcare Publishing Mode</strong> is for healthcare, medical, public-health, bioethics, journal, institutional and healthcare-in-conflict texts. It should not be treated as a simple “COPE plus antisemitism” mode. It is a layered review.</p>
      <h3>Article type first</h3>
      <p>The report should first identify the type of article or text where possible: empirical research, review, editorial, commentary, correspondence, open letter, bioethics/legal analysis, health journalism, institutional statement, advocacy statement, public-health or humanitarian report, or other.</p>
      <h3>Healthcare mode review layers</h3>
      <table>
        <thead>
          <tr><th>Layer</th><th>What it asks</th><th>Main source families</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Antisemitism and anti-Zionism</td>
            <td>Does the text contain direct antisemitism, Israel/Zionism-related antisemitism, or protected political criticism?</td>
            <td>IHRA, JDA, Nexus, TextLens taxonomy</td>
          </tr>
          <tr>
            <td>Medical-journal and publication ethics</td>
            <td>Are article type, authorship, conflicts, editorial independence, peer review, correspondence, corrections or sponsorship issues relevant?</td>
            <td>COPE, ICMJE, WAME, CSE</td>
          </tr>
          <tr>
            <td>Evidence and reporting quality</td>
            <td>Are empirical, public-health or humanitarian claims sourced, proportionate, cautious and separated from advocacy or legal conclusion?</td>
            <td>ICMJE, WAME, CSE, health-journalism sources</td>
          </tr>
          <tr>
            <td>Health journalism</td>
            <td>For public-facing health texts: are benefits, harms, uncertainty, source conflicts, alternatives and context handled responsibly?</td>
            <td>Schwitzer/PLOS, AHCJ</td>
          </tr>
          <tr>
            <td>Healthcare in conflict</td>
            <td>Does the text use terms such as hospital, medical unit, medical neutrality, civilian harm, attack, proportionality or war crime carefully?</td>
            <td>ICRC Customary IHL rules, ICRC Health Care in Danger</td>
          </tr>
          <tr>
            <td>Responsibility allocation</td>
            <td>Does the article materially omit or minimise relevant actors, victims, causes, constraints or contested facts?</td>
            <td>TextLens framework plus mode-specific source summaries</td>
          </tr>
        </tbody>
      </table>
      <p>Healthcare mode should be symmetrical and evidence-based. It should not assume bad faith from omission alone. It should ask whether the omission materially changes the framing.</p>
    </section>

    <section id="legal-criteria">
      <h2>6. Legal terminology and criteria mapping</h2>
      <p>TextLens is not a court, judge, prosecutor, military legal adviser or fact-finding commission. It must not decide whether a war crime, genocide, unlawful attack, proportionality breach, collective punishment or other legal violation occurred.</p>
      <p>It may, however, perform <strong>legal terminology and criteria mapping</strong>. That means it can identify the legal or humanitarian term used, summarise relevant criteria at a high level, and assess whether the article defines, attributes, evidences, omits, assumes or overstates information relevant to those criteria.</p>
      <div class="callout danger">
        <strong>Legal boundary</strong>
        TextLens may say that an article’s legal terminology is unsupported, under-specified, overclaimed, selectively framed or presented with excessive certainty. It must not state that the underlying act was lawful or unlawful, proportionate or disproportionate, genocidal or not genocidal, a war crime or not a war crime.
      </div>
      <table>
        <thead>
          <tr><th>Term used in article</th><th>What TextLens may check</th><th>What TextLens must not decide</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Genocide</td>
            <td>Whether the article addresses protected group, prohibited acts, specific intent, attribution and whether the claim is allegation, opinion or finding.</td>
            <td>Whether genocide legally occurred.</td>
          </tr>
          <tr>
            <td>Disproportionate attack</td>
            <td>Whether the article distinguishes casualty numbers from proportionality criteria, including expected civilian harm and anticipated military advantage.</td>
            <td>Whether the attack was proportionate, disproportionate, lawful or unlawful.</td>
          </tr>
          <tr>
            <td>Attack on hospital / medical unit</td>
            <td>Whether the article distinguishes protected medical status, alleged misuse, loss of protection, warnings, military-objective claims, contested facts and attribution.</td>
            <td>Whether a particular strike or operation was lawful.</td>
          </tr>
          <tr>
            <td>Collective punishment / starvation / war crime</td>
            <td>Whether the term is defined, attributed, evidenced and separated from moral rhetoric or advocacy.</td>
            <td>Whether the legal violation occurred.</td>
          </tr>
        </tbody>
      </table>
      <p>Reports may use this wording: <em>“TextLens does not make legal findings. This section maps the article’s legal and humanitarian terminology against relevant criteria and identifies whether the article defines, attributes, evidences, omits or overstates those criteria.”</em></p>
    </section>

    <section id="sources">
      <h2>7. Standards and source summaries</h2>
      <p>The app uses compact source summaries, key criteria and compiled source rules embedded in the source catalogue. It does not dynamically retrieve or read the linked PDFs or web pages during analysis. The URLs are included for transparency and human follow-up.</p>
      <table>
        <thead>
          <tr><th>Mode</th><th>Core standards and sources</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Community / General Review</td>
            <td>IHRA, JDA, Nexus, TextLens framework. Used for community monitoring and response-worthiness, not regulatory findings.</td>
          </tr>
          <tr>
            <td>Consensus Standards</td>
            <td>IHRA, JDA, Nexus, TextLens framework, with stricter guardrails around protected political speech.</td>
          </tr>
          <tr>
            <td>Healthcare Publishing</td>
            <td>IHRA, JDA, Nexus, TextLens, COPE, ICMJE, WAME, JAMA race/ethnicity guidance, Schwitzer/PLOS health journalism sources, AHCJ principles, selected ICRC/IHL rules, ICRC Health Care in Danger, CSE.</td>
          </tr>
          <tr>
            <td>Academic</td>
            <td>IHRA, JDA, Nexus, TextLens, COPE, and medical-editorial sources where the item is medical scholarship or journal-related.</td>
          </tr>
          <tr>
            <td>BCCSA</td>
            <td>IHRA, JDA, Nexus, TextLens, BCCSA Free-to-Air Code, BCCSA Subscription Code, BCCSA Online Code.</td>
          </tr>
          <tr>
            <td>Press Code</td>
            <td>IHRA, JDA, Nexus, TextLens, South African Press Code. Health-journalism sources may be supplementary for health reporting but are not binding South African press-code sources.</td>
          </tr>
          <tr>
            <td>Accountability</td>
            <td>Focused mainly on the submitted article, metadata, and accountability-oriented reporting logic. Antisemitism frameworks remain background context only and are not used here as the primary classification engine.</td>
          </tr>
        </tbody>
      </table>
      <div class="callout warning">
        <strong>Source-summary limitation</strong>
        The model sees compact summaries and key questions, not full source texts. If a source summary is insufficient for a conclusion, the report should say so as a limitation rather than inventing detail.
      </div>
    </section>

    <section id="outputs">
      <h2>8. Outputs and exports</h2>
      <p>Reports may include an executive summary, concern level, confidence, exact flagged quotes, taxonomy mapping, standards applied, protected-speech guardrails, alternative interpretations, limitations, human-review prompts, and suggested response or complaint language where warranted.</p>
      <h3>Community / General Review Mode output</h3>
      <p>This mode is the scoring mode. It may report antisemitism content, anti-Zionist intensity, rhetorical distortion and response-worthiness, often displayed through a radar-style visual. These scores are analytical indicators, not formal findings.</p>
      <h3>Professional Mode output</h3>
      <p>These modes produce a more traditional structured report: flagged passages, standards or source references, guardrail findings, limitations and response or complaint drafting support where relevant.</p>
      <h3>Accountability Mode output</h3>
      <p>Accountability Mode produces a different report shape. Stage 1 identifies the article's main claims, the evidence the article gives, missing or questionable evidence, suggested next steps, and the limits of the present review. It is meant to help a user decide whether the article deserves clarification, correction, substantiation, or some other follow-up.</p>
      <p>Where Stage 2 is used, TextLens then drafts a professional response based on the completed Stage 1 analysis. That draft should still be checked and edited by a human reviewer before it is sent.</p>
      <h3>Draft responses and complaints</h3>
      <p>Draft language should be treated as a starting point. It should be checked by a human reviewer before submission, publication or circulation. Regulatory modes may assist with complaint framing, but they do not decide the complaint.</p>
      <h3>Export workspace</h3>
      <p>The app includes an export workspace for DOCX, PDF, CSV and copied summaries. In the current fork, export behaviour should be verified before relying on it as production file generation. Where export actions are simulated or incomplete, use the on-screen report and copied text as the reliable output.</p>
    </section>

    <section id="responsible-use">
      <h2>9. Responsible use</h2>
      <ul>
        <li>Always review exact quotes against the original source.</li>
        <li>Check whether the submitted text is complete, excerpted, badly extracted or missing context.</li>
        <li>Use the selected mode that matches the intended use. Do not use Community / General Review Mode as a regulatory finding.</li>
        <li>Address benign interpretations and protected-speech guardrails in any external complaint or response.</li>
        <li>Do not present TextLens as a court, regulator, journal editor, ombudsman or official adjudicator.</li>
        <li>Use draft responses as editable drafts, not final statements.</li>
      </ul>
    </section>

    <section id="limits">
      <h2>10. Current limitations</h2>
      <ul>
        <li><strong>Model fallibility:</strong> The AI may miss relevant context, overstate a concern, or apply a source summary too broadly.</li>
        <li><strong>Source summaries:</strong> The backend uses compact embedded summaries, not full live PDFs or web retrieval.</li>
        <li><strong>Metadata dependence:</strong> Missing author, venue, date, jurisdiction, article type or broadcast details can weaken the analysis.</li>
        <li><strong>Text extraction:</strong> PDF/DOCX extraction may omit tables, captions, footnotes, images or formatting.</li>
        <li><strong>Regulatory limits:</strong> BCCSA and Press Code modes may support complaint drafting but do not represent those bodies or make final findings.</li>
        <li><strong>Legal limits:</strong> Healthcare mode may map legal terminology to criteria but does not decide legality.</li>
        <li><strong>Export limits:</strong> Verify whether exports in your deployed version are real downloads or interface simulations.</li>
      </ul>
    </section>
  </div>

  <footer>
    <div class="footer-container">
      <span>TextLens™ user guide</span>
      <span>Structured analysis • human review required</span>
    </div>
  </footer>
</body>
</html>`;

  const blob = new Blob([guideHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  if (action === 'view') {
    window.open(url, '_blank');
    return;
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = 'TextLens_User_Guide.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
