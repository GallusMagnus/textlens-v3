import express from "express";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { textLensTaxonomy } from "./src/taxonomyData";
import {
  compiledRuleLayer,
  getAllowedSourceKeysForMode,
  getAllowedTaxonomyItems,
  getModePolicy,
  getProtectedNonTriggerItems,
  getRelevantSourceRules,
  getSourceKeyForClauseId,
  isTaxonomyItemAllowedInMode,
  runStagedAnalysis,
  taxonomyMappingById,
} from "./src/analysis";
// @ts-ignore
import mammoth from "mammoth";
// @ts-ignore
import pdf from "pdf-parse-new";

// Match the local setup docs: prefer `.env.local`, then fall back to `.env`.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  NUMBER: "number",
  BOOLEAN: "boolean",
} as const;

function getModeBoundaryDisclamation(mode: string): string {
  const policy = getModePolicy(mode);
  return policy ? `\n\n${policy.boundaryNote}` : "";
}

// Primary validation and sanitization runner for reports received from the model
function sanitizeReport(data: any, selectedMode: string, originalText: string, metadata: any) {
  if (!data) return data;

  // Initialize arrays if they do not exist
  if (!data.limitations) data.limitations = [];
  if (!data.flaggedPassages) data.flaggedPassages = [];
  if (!data.humanReviewPrompts) data.humanReviewPrompts = [];
  if (!data.standardsApplied) data.standardsApplied = [];

  // Warn about missing parameters in metadata
  const validationWarnings: string[] = [];
  if (!metadata?.articleType) {
    validationWarnings.push("Warning: Analysis may lack complete accuracy due to missing article type in metadata.");
  }
  if (!metadata?.journalOrPublication && !metadata?.platform) {
    validationWarnings.push("Warning: Analysis context limited due to missing publication venue/platform in metadata.");
  }
  if (selectedMode === "bccsa" && (!metadata?.broadcaster || !metadata?.programmeName || !metadata?.broadcastDateTime)) {
    validationWarnings.push("Warning: Regulatory broadcasting analysis is limited due to missing broadcast metadata (broadcaster, programme name, or date/time).");
  }
  if (!metadata?.jurisdiction) {
    validationWarnings.push("Warning: Legal and regulatory analysis lack geographical boundary mapping due to missing jurisdiction context.");
  }
  if (!metadata?.authorAffiliation) {
    validationWarnings.push("Warning: Assessment of institutional conflict of interest is limited due to missing author affiliation.");
  }
  if (!metadata?.date) {
    validationWarnings.push("Warning: System lacks chronological timeline positioning due to missing publishing date.");
  }
  
  const textLen = (originalText || "").trim().length;
  if (textLen < 300) {
    validationWarnings.push("Warning: Submitted text is critically short. Rhetorical framing, bias density, and omissions cannot be reliably assessed.");
  }
  if (originalText && (originalText.includes("[...") || originalText.includes("...") || textLen < 1500)) {
    validationWarnings.push("Warning: Submitted text appears to be an excerpt or truncated. Assessments of balance, omissions, and overall context may be skewed.");
  }

  // Healthcare restriction (Check 6)
  if (selectedMode === "healthcare") {
    validationWarnings.push("TextLens does not make legal findings. It may identify legal or humanitarian terms, map them to relevant criteria at a high level, and assess whether the article defines, attributes, evidences, omits, assumes or overstates those criteria.");
  }

  data.limitations.push(...validationWarnings);

  const validTaxonomyIds = new Set(textLensTaxonomy.map(t => t.id));

  const validSourceKeys = new Set(getAllowedSourceKeysForMode(selectedMode));

  let hasInvalidTaxonomy = false;
  let hasInvalidSource = false;
  let hasInvalidQuote = false;

  // Validate flaggedPassages
  data.flaggedPassages = data.flaggedPassages.filter((p: any) => {
    const exactQuote = typeof p.exactQuote === "string" ? p.exactQuote : "";
    if (exactQuote && !originalText.includes(exactQuote)) {
      hasInvalidQuote = true;
      return false;
    }

    const tid = p.taxonomyItemId;
    if (tid) {
      if (!validTaxonomyIds.has(tid) || !isTaxonomyItemAllowedInMode(tid, selectedMode)) {
        hasInvalidTaxonomy = true;
        return false; // remove out-of-scope finding safely
      }
    }

    const rawId = p.relevantStandardOrSource || p.standardCited || "";
    if (rawId) {
      const docId = getSourceKeyForClauseId(rawId);
      if (docId && !validSourceKeys.has(docId)) {
        hasInvalidSource = true;
        return false; // remove out-of-scope finding safely
      }
    }
    return true;
  });

  // Validate standardsApplied array (for non-consumer mode)
  if (data.standardsApplied && Array.isArray(data.standardsApplied)) {
    data.standardsApplied = data.standardsApplied.filter((stdId: string) => {
      const docId = getSourceKeyForClauseId(stdId) || stdId.toLowerCase();
      if (docId && !validSourceKeys.has(docId)) {
        hasInvalidSource = true;
        return false;
      }
      return true;
    });
  }

  // Add validation warnings to limitations safely (avoid duplicates)
  if (hasInvalidTaxonomy) {
    data.limitations.push("Model returned an out-of-scope taxonomy reference removed during validation.");
  }
  if (hasInvalidSource) {
    data.limitations.push("Model returned an out-of-scope source reference removed during validation.");
  }
  if (hasInvalidQuote) {
    data.limitations.push("Model returned a flagged quote not found verbatim in the submitted text; it was removed during validation.");
  }

  // Deduplicate limitations
  data.limitations = Array.from(new Set(data.limitations));

  // Inject disclaimers
  const boundaryDisclamation = getModeBoundaryDisclamation(selectedMode);
  
  if (data.summaryJudgement && typeof data.summaryJudgement === 'string' && !data.summaryJudgement.includes("TextLens Boundary Note")) {
    data.summaryJudgement += boundaryDisclamation;
  }
  if (data.overallConsumerNarrative && typeof data.overallConsumerNarrative === 'string' && !data.overallConsumerNarrative.includes("TextLens Boundary Note")) {
    data.overallConsumerNarrative += boundaryDisclamation;
  }
  if (data.suggestedComplaintOrResponse && typeof data.suggestedComplaintOrResponse === 'string' && !data.suggestedComplaintOrResponse.includes("DISCLAIMER")) {
    data.suggestedComplaintOrResponse += `\n\n--- DISCLAIMER ---\n${boundaryDisclamation.replace("[", "").replace("]", "")}`;
  }

  return data;
}

function sanitizeAccountabilityReport(report: any, originalText: string) {
  if (!report || typeof report !== "object") return report;

  const ensureArray = (value: any) => Array.isArray(value) ? value : [];
  report.claimsMadeByArticle = ensureArray(report.claimsMadeByArticle);
  report.evidenceGivenInArticle = ensureArray(report.evidenceGivenInArticle);
  report.missingOrQuestionableEvidence = ensureArray(report.missingOrQuestionableEvidence);
  report.suggestedNextSteps = ensureArray(report.suggestedNextSteps);
  report.limitsOfThisReport = ensureArray(report.limitsOfThisReport);

  const validSeverity = new Set(["low", "moderate", "high", "severe"]);
  const severityRank: Record<string, number> = {
    low: 1,
    moderate: 2,
    high: 3,
    severe: 4,
  };
  const normalizeSeverity = (value: any) => {
    const normalized = String(value || "").toLowerCase();
    return validSeverity.has(normalized) ? normalized : "moderate";
  };

  const rawClaims = report.claimsMadeByArticle.map((claim: any, index: number) => {
    const exactQuote = typeof claim.exactQuote === "string" ? claim.exactQuote.trim() : "";
    return {
      originalId: claim.id || `claim-${index + 1}`,
      exactQuote: exactQuote && originalText.includes(exactQuote) ? exactQuote : "",
      claimSummary: claim.claimSummary || "",
      claimType: claim.claimType || "other",
      seriousness: normalizeSeverity(claim.seriousness),
      whyItMatters: claim.whyItMatters || "",
      inputOrder: index,
    };
  });

  rawClaims.sort((a: any, b: any) => {
    const severityDelta = severityRank[b.seriousness] - severityRank[a.seriousness];
    if (severityDelta !== 0) return severityDelta;
    return a.inputOrder - b.inputOrder;
  });

  const topClaims = rawClaims.slice(0, 7);
  const claimIdMap = new Map<string, string>();
  report.claimsMadeByArticle = topClaims.map((claim: any, index: number) => {
    const normalizedId = `claim-${index + 1}`;
    claimIdMap.set(claim.originalId, normalizedId);
    return {
      id: normalizedId,
      exactQuote: claim.exactQuote,
      claimSummary: claim.claimSummary,
      claimType: claim.claimType,
      seriousness: claim.seriousness,
      whyItMatters: claim.whyItMatters,
    };
  });

  const validClaimIds = new Set(report.claimsMadeByArticle.map((claim: any) => claim.id));
  const normalizeClaimId = (value: any) => {
    const mapped = claimIdMap.get(String(value || ""));
    if (mapped && validClaimIds.has(mapped)) return mapped;
    return "unlinked";
  };

  report.evidenceGivenInArticle = report.evidenceGivenInArticle.map((evidence: any) => {
    const evidenceQuote = typeof evidence.evidenceQuote === "string" ? evidence.evidenceQuote.trim() : "";
    return {
      claimId: normalizeClaimId(evidence.claimId),
      evidenceSummary: evidence.evidenceSummary || "",
      evidenceQuote: evidenceQuote && originalText.includes(evidenceQuote) ? evidenceQuote : "",
      sourceNamed: evidence.sourceNamed || "",
      credibilityConcern: evidence.credibilityConcern || "",
    };
  }).filter((evidence: any) => evidence.claimId !== "unlinked");

  report.missingOrQuestionableEvidence = report.missingOrQuestionableEvidence.map((issue: any) => ({
    claimId: normalizeClaimId(issue.claimId),
    whatIsMissingOrQuestionable: issue.whatIsMissingOrQuestionable || "",
    whyItMatters: issue.whyItMatters || "",
    whatAuthorShouldProvide: issue.whatAuthorShouldProvide || "",
    whatYouShouldCheck: issue.whatYouShouldCheck || "",
    seriousness: normalizeSeverity(issue.seriousness),
  })).filter((issue: any) => issue.claimId !== "unlinked");

  report.suggestedNextSteps = report.suggestedNextSteps.map((step: any) => ({
    priority: normalizeSeverity(step.priority),
    task: step.task || "",
    reason: step.reason || "",
  }));

  const highestClaimSeverity = report.claimsMadeByArticle.reduce(
    (highest: string, claim: any) =>
      severityRank[claim.seriousness] > severityRank[highest] ? claim.seriousness : highest,
    "low"
  );
  report.overallConcernLevel = normalizeSeverity(report.overallConcernLevel || highestClaimSeverity);

  if (!report.antisemitismBackgroundNote) {
    report.antisemitismBackgroundNote =
      "Accountability Mode treats antisemitism frameworks as background only. For detailed antisemitism analysis, run the article in Community / General Review Mode.";
  }

  const normalizedLimits = new Map<string, string>();
  const addLimit = (bucket: string, text: string) => {
    if (!normalizedLimits.has(bucket) && text.trim()) {
      normalizedLimits.set(bucket, text.trim());
    }
  };

  const classifyLimit = (text: string) => {
    const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();

    if (
      normalized.includes("submitted text and metadata") ||
      normalized.includes("does not independently verify external facts") ||
      normalized.includes("does not independently verify outside facts") ||
      normalized.includes("source credibility") ||
      normalized.includes("documents, datasets")
    ) {
      return "scope-and-verification";
    }

    if (
      normalized.includes("does not decide whether any claim is true or false") ||
      normalized.includes("not final findings that a claim is false") ||
      normalized.includes("prompts for follow-up")
    ) {
      return "not-final-truth-finding";
    }

    if (
      normalized.includes("does not make legal findings") ||
      normalized.includes("war crimes") ||
      normalized.includes("institutional liability") ||
      normalized.includes("defamation")
    ) {
      return "no-legal-findings";
    }

    if (
      normalized.includes("opinion piece") ||
      normalized.includes("opinion article") ||
      normalized.includes("evaluative") ||
      normalized.includes("opinion writing")
    ) {
      return "opinion-writing";
    }

    if (
      normalized.includes("website navigation") ||
      normalized.includes("advertisements") ||
      normalized.includes("cookie notices") ||
      normalized.includes("formatting artifacts")
    ) {
      return "source-noise";
    }

    return `custom:${normalized}`;
  };

  const mergedLimits = [
    ...report.limitsOfThisReport,
    "This report is based on the submitted text and metadata. It does not independently verify outside facts, documents, datasets, or source credibility.",
    "Items listed as missing or questionable are prompts for follow-up, not final findings that a claim is false.",
  ];

  mergedLimits.forEach((limit: string) => {
    const bucket = classifyLimit(limit || "");
    addLimit(bucket, limit || "");
  });

  addLimit(
    "scope-and-verification",
    "This report is based only on the submitted text and metadata. It does not independently verify outside facts, documents, datasets, or source credibility."
  );
  addLimit(
    "not-final-truth-finding",
    "It does not make final findings that any claim is true or false. Items listed as missing or questionable are prompts for follow-up, not final determinations."
  );

  report.limitsOfThisReport = Array.from(normalizedLimits.values());

  return report;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Maximize payload limit for long text documents
  app.use(express.json({ limit: "15mb" }));

  // Initialize OpenAI client lazily
  let aiClient: OpenAI | null = null;
  function getOpenAIClient(): OpenAI {
    if (!aiClient) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OPENAI_API_KEY environment variable is not set. Add it to your local .env.local file."
        );
      }
      aiClient = new OpenAI({
        apiKey,
        baseURL: process.env.OPENAI_BASE_URL || undefined,
      });
    }
    return aiClient;
  }

  function getAnalysisModel() {
    return process.env.TEXTLENS_MODEL || process.env.OPENAI_MODEL || "gpt-5.5";
  }

  function createAnalysisTraceCollector() {
    const state = {
      modelCallCount: 0,
      modelRuntimeMs: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };

    const toSafeWholeNumber = (value: unknown) => {
      const normalized = Number(value);
      if (!Number.isFinite(normalized) || normalized < 0) {
        return 0;
      }
      return Math.round(normalized);
    };

    return {
      recordResponse(response: any, elapsedMs: number) {
        state.modelCallCount += 1;
        state.modelRuntimeMs += toSafeWholeNumber(elapsedMs);

        const usage = response?.usage || {};
        const inputTokens = toSafeWholeNumber(usage.input_tokens ?? usage.inputTokens);
        const outputTokens = toSafeWholeNumber(usage.output_tokens ?? usage.outputTokens);
        const totalTokens = toSafeWholeNumber(
          usage.total_tokens ?? usage.totalTokens ?? inputTokens + outputTokens
        );

        state.inputTokens += inputTokens;
        state.outputTokens += outputTokens;
        state.totalTokens += totalTokens;
      },
      snapshot() {
        return {
          modelCallCount: state.modelCallCount,
          modelRuntimeMs: state.modelRuntimeMs,
          tokenUsage: {
            inputTokens: state.inputTokens,
            outputTokens: state.outputTokens,
            totalTokens: state.totalTokens,
          },
        };
      },
    };
  }

  function buildAnalysisTrace(options?: {
    runtimeMs?: number;
    metrics?: ReturnType<ReturnType<typeof createAnalysisTraceCollector>["snapshot"]>;
  }) {
    return {
      analyzedAt: new Date().toISOString(),
      model: getAnalysisModel(),
      runtimeMs:
        typeof options?.runtimeMs === "number" ? Math.max(0, Math.round(options.runtimeMs)) : undefined,
      modelCallCount: options?.metrics?.modelCallCount,
      modelRuntimeMs: options?.metrics?.modelRuntimeMs,
      tokenUsage: options?.metrics?.tokenUsage,
    };
  }

  function closeJsonSchema(node: any): any {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return node;
    }

    const normalized: Record<string, any> = { ...node };

    if (normalized.type === Type.OBJECT) {
      normalized.additionalProperties = false;
      if (normalized.properties && typeof normalized.properties === "object") {
        normalized.properties = Object.fromEntries(
          Object.entries(normalized.properties).map(([key, value]) => [
            key,
            closeJsonSchema(value),
          ])
        );
      }
    }

    if (normalized.type === Type.ARRAY && normalized.items) {
      normalized.items = closeJsonSchema(normalized.items);
    }

    return normalized;
  }

  async function generateStructuredJson<T>({
    instructions,
    input,
    schemaName,
    schema,
    traceCollector,
  }: {
    instructions?: string;
    input: string;
    schemaName: string;
    schema: Record<string, unknown>;
    traceCollector?: ReturnType<typeof createAnalysisTraceCollector>;
  }): Promise<T> {
    const client = getOpenAIClient();
    const model = getAnalysisModel();
    const startedAt = Date.now();
    const request: any = {
      model,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema: closeJsonSchema(schema),
        },
      },
    };

    if (instructions) {
      request.instructions = instructions;
    }

    console.log(`[TextLens] Calling OpenAI Responses API (${schemaName}) with model: ${model}`);
    const response = await client.responses.create(request);
    const elapsedMs = Date.now() - startedAt;
    traceCollector?.recordResponse(response, elapsedMs);
    console.log(
      `[TextLens] OpenAI Responses API completed (${schemaName}) in ${(elapsedMs / 1000).toFixed(2)}s`
    );
    const outputText = response.output_text?.trim();
    if (!outputText) {
      throw new Error(`Empty response received from the model (${model}).`);
    }

    return JSON.parse(outputText) as T;
  }

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      mode: process.env.NODE_ENV || "development",
      provider: "openai",
      model: getAnalysisModel(),
      pipeline: compiledRuleLayer.version,
    });
  });

  app.post("/api/auth/verify-passcode", (req, res) => {
    const { passcode } = req.body;
    if (!passcode) {
      return res.status(400).json({ error: "Passcode is required" });
    }
    const input = passcode.trim();
    const envPasscode = (
      process.env.VITE_WORKSPACE_PASSCODE ||
      process.env.WORKSPACE_PASSCODE ||
      ""
    ).trim();

    if (!envPasscode) {
      return res.status(500).json({
        error: "Workspace passcode is not configured. Set VITE_WORKSPACE_PASSCODE in .env.local."
      });
    }
    
    if (input === envPasscode || input.toLowerCase() === envPasscode.toLowerCase()) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: "Access Denied: Incorrect workspace passcode." });
    }
  });

  // Document Parsing endpoint (handles both .docx and .pdf files base64 encoded)
  app.post("/api/parse-document", async (req, res) => {
    try {
      const { fileName, fileType, fileBase64 } = req.body;

      if (!fileBase64) {
        return res.status(400).json({ error: "No file content was provided." });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(fileBase64, "base64");
      let extractedText = "";

      const lowerName = fileName ? fileName.toLowerCase() : "";

      if (lowerName.endsWith(".pdf") || fileType === "application/pdf") {
        let pdfParser = pdf as any;
        if (pdfParser && typeof pdfParser !== "function") {
          if (typeof pdfParser.default === "function") {
            pdfParser = pdfParser.default;
          } else if (typeof pdfParser === "object") {
            for (const key of Object.keys(pdfParser)) {
              if (typeof pdfParser[key] === "function") {
                pdfParser = pdfParser[key];
                break;
              }
            }
          }
        }
        
        if (typeof pdfParser !== "function") {
          throw new Error("PDF parser initialization failed (pdf is not a function).");
        }

        const data = await pdfParser(buffer);
        extractedText = data.text || "";
      } else if (lowerName.endsWith(".docx") || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload a PDF or DOCX file." });
      }

      res.json({ text: extractedText });
    } catch (err: any) {
      console.error("Document Parsing Error:", err);
      res.status(500).json({ error: err.message || "An error occurred while parsing the document." });
    }
  });

  // AI Metadata and Role Auto-Extraction endpoint
  app.post("/api/extract-metadata", async (req, res) => {
    try {
      const { text, fileName } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ error: "No text content provided for extraction." });
      }

      let modelAvailable = true;
      try {
        getOpenAIClient();
      } catch (keyErr: any) {
        modelAvailable = false;
      }

      if (!modelAvailable) {
        return res.json({
          title: fileName ? fileName.replace(/\.[^/.]+$/, "") : "Untitled Document",
          author: "Unknown Author",
          platform: "Uploaded Document",
          date: new Date().toISOString().split("T")[0],
          textType: "Uploaded Source Document",
          suggestedRole: "contested"
        });
      }

      const truncatedText = text.length > 8000 ? text.substring(0, 8000) + "\n[truncated...]" : text;

      const prompt = `You are a legal, media, and document metadata extraction expert. Scan the following uploaded document's content (file name is: "${fileName || 'unknown'}") and extract its metadata.
Provide:
- Document Title (be precise and informative; if it is a transcript, research paper, article or newsletter, extract the actual title. Do NOT return generic file names)
- Author or speaker or writer (or organization behind it if individual is not available; default if unknown is "Unknown Author")
- Source or Platform or Broadcaster or Journal/Publisher (default if unknown is "Uploaded Document")
- Publication or Broadcast Date in YYYY-MM-DD or best approximation, or blank if unknown
- Text content Type (e.g., 'Broadcast Transcript', 'Editorial Comment', 'Academic Article', 'Legal Brief', 'Standard Document', 'Official Directive')
- Suggested role (default is "contested"):
  - Select "contested" if this document contains opinionated, disputed, or controversial claims, media broadcasts under complaint, or the central material being audited.
  - Select "supporting" if it provides contextual evidence, complainant letters, background statistics, or corroborating facts.
  - Select "reference" if it contains industry codes, regulations, rules, editorial policies, or legal standards.

Document snippet:
${truncatedText}`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          platform: { type: Type.STRING },
          date: { type: Type.STRING },
          textType: { type: Type.STRING },
          suggestedRole: {
            type: Type.STRING,
            enum: ["contested", "supporting", "reference"]
          }
        },
        required: ["title", "author", "platform", "date", "textType", "suggestedRole"]
      };

      const extracted = await generateStructuredJson<any>({
        input: prompt,
        schemaName: "metadata_extraction",
        schema: responseSchema,
      });
      res.json(extracted);
    } catch (err: any) {
      console.error("AI Metadata Extraction Error:", err);
      res.json({
        title: req.body.fileName ? req.body.fileName.replace(/\.[^/.]+$/, "") : "Untitled Document",
        author: "Unknown Author",
        platform: "Uploaded Document",
        date: new Date().toISOString().split("T")[0],
        textType: "Uploaded Source Document",
        suggestedRole: "contested"
      });
    }
  });

  // Master AI analysis endpoint
  app.post("/api/analyse", async (req, res) => {
    const analysisStartedAt = Date.now();
    const analysisTraceCollector = createAnalysisTraceCollector();
    try {
      const { originalText, metadata } = req.body;

      if (!originalText || !originalText.trim()) {
        return res.status(400).json({ error: "No text was submitted for analysis." });
      }

      const selectedMode = metadata?.analysisMode || "general";
      const selectedModeLabel = getModePolicy(selectedMode)?.label || selectedMode;
      const actualCommunicationType = metadata?.communicationType || "unspecified";
      const actualRhetoricalFunction = metadata?.rhetoricalFunction || "unspecified";
      const generateAnalysisJson = <T,>(args: {
        instructions?: string;
        input: string;
        schemaName: string;
        schema: Record<string, unknown>;
      }) =>
        generateStructuredJson<T>({
          ...args,
          traceCollector: analysisTraceCollector,
        });

      // Initialize the SDK
      try {
        getOpenAIClient();
      } catch (keyErr: any) {
        console.error("OpenAI init key error:", keyErr.message);
        return res.status(401).json({
          error: "OPENAI_API_KEY is missing. Add it to your local .env.local file before running TextLens.",
          code: "MISSING_API_KEY"
        });
      }

      // ── CONSUMER MODE: separate prompt, schema, and scoring ──────────────────
      if (selectedMode === "consumer") {
        const prominenceTier: number = metadata?.publicationProminenceTier ?? 3;
        const prominenceMultipliers: Record<number, number> = { 5: 1.15, 4: 1.0, 3: 0.85, 2: 0.75, 1: 0.60 };
        const prominenceMultiplier = prominenceMultipliers[prominenceTier] ?? 0.85;
        const prominenceLabels: Record<number, string> = {
          5: "Major international / national outlet",
          4: "Regional outlet",
          3: "Specialist / niche publication",
          2: "Social media / online platform",
          1: "Blog, independent, or minor outlet",
        };

        const allTaxonomyContext = JSON.stringify(
          textLensTaxonomy.map(item => ({
            id: item.id,
            section: item.section,
            family: item.family,
            categoryTitle: item.categoryTitle,
            definition: item.definition,
            boundaryNote: item.boundaryNote,
            severity: item.severity,
          })),
          null, 2
        );

        const consumerSystemInstruction = `You are an expert analytical engine operating in CONSUMER MODE — a calibrated framework designed for community organisations, monitoring groups, and engaged citizens.

CONSUMER MODE THEORETICAL PREMISE:
Contemporary antisemitism has substantially migrated into anti-Zionist political discourse. While free speech protections are real and important, the empirical reality is that Israel is subjected to a disproportionate volume and intensity of critique compared to all other nations in equivalent circumstances. Consumer mode acknowledges this reality. It does NOT eliminate free speech protections, but it lowers the guardrail threshold: content classified as protected political speech under professional regulatory modes is assessed here for its intensity, pattern, and positioning on a spectrum — even if it does not constitute a formal regulatory violation.

YOUR TASK: Score the submitted text across four dimensions and return structured JSON.

FOUR SCORING DIMENSIONS (each 0–100):

1. antisemitismScore: Direct antisemitic content (Layer 1) PLUS Israel-linked content that clearly crosses into antisemitism (Layer 2 violations). Higher = more severe.

2. antiZionistIntensityScore: The overall rhetorical weight and intensity of Israel-critical positioning — INCLUDING protected political speech. NOT an accusation. Factors: volume and intensity of Israel-critical claims; whether critique targets specific policies vs. state legitimacy; internal double-standard patterns; whether diaspora Jewish communities are implicated; delegitimising rhetorical structures even below violation threshold; whether BDS/one-state advocacy is incidental or the organising logic of the document.

3. rhetoricalDistortionScore: Layer 3 rhetorical and evidentiary taxonomy score — evidence handling problems, loaded framing, agency and responsibility distortions, conflation, frame-shifting, immunity/counter-attack moves, and authority laundering.

4. baseWorthinessScore: Pure content assessment of whether this merits a response. Do NOT factor in publication prominence — applied separately.

RULES:
- Cite specific standards ONLY when Confident and severity is at least Moderate. Otherwise use plain language.
- The antiZionistNarrative MUST clearly distinguish protected political speech from content approaching the antisemitism threshold.
- Do not treat BDS advocacy, boycott language, or alternative state-model advocacy as antisemitic in themselves. Require additional aggravating language or framing before treating them as flagged passages.
- Write all narratives in plain accessible language for a non-specialist reader.
- doubleStandardAssessment must directly address whether the text applies different standards to Israel vs. comparable states.
- Generate a high-quality suggested Response Draft or Complaint Letter tailored to the findings, saved in the "suggestedComplaintOrResponse" field. This should provide structured rebuttals or letters suitable for advocates, community readers, or editors. Use a clean, professional, and firm tone.
- HALLUCINATION MINIMISATION IS A CORE PRODUCT GOAL. When the text does not support a claim, do not imply, infer, or embellish it.
- DEFAULT TO RESTRAINT. If evidence is thin, ambiguous, excerpted, or absent, lower the score, avoid a flagged passage, and record the uncertainty in "limitations" or narrative text.
- USE ONLY VERBATIM SUPPORT. Every "flaggedPassages.exactQuote" must appear exactly in the submitted text, character-for-character.
- DO NOT INVENT intent, motive, chronology, omitted context, source content, or legal meaning beyond what is explicitly supplied in the submitted text, metadata, taxonomy, or source summaries.
- WHEN IN DOUBT, SAY SO. It is better to return a narrower, incomplete, or lower-confidence analysis than an overconfident one.`;

        const consumerPrompt = `Submitted text:
"""
${originalText}
"""

Metadata:
${JSON.stringify(metadata, null, 2)}

Full taxonomy for reference:
${allTaxonomyContext}

Return structured JSON matching the required schema exactly.`;

        const consumerResponseSchema = {
          type: Type.OBJECT,
          properties: {
            antisemitismScore: { type: Type.NUMBER, description: "0-100 score for direct and Israel-linked antisemitic content." },
            antisemitismNarrative: { type: Type.STRING, description: "Plain-language explanation of antisemitism findings." },
            antiZionistIntensityScore: { type: Type.NUMBER, description: "0-100 score for Israel-critical rhetorical positioning including protected speech." },
            antiZionistNarrative: { type: Type.STRING, description: "Plain-language explanation distinguishing protected speech from content approaching the antisemitism threshold." },
            rhetoricalDistortionScore: { type: Type.NUMBER, description: "0-100 score for Layer 3 rhetorical and evidentiary taxonomy concerns." },
            rhetoricalNarrative: { type: Type.STRING, description: "Plain-language explanation of rhetorical distortion findings." },
            baseWorthinessScore: { type: Type.NUMBER, description: "0-100 content-based worthiness score before prominence multiplier." },
            worthinessNarrative: { type: Type.STRING, description: "Plain-language explanation of response worthiness." },
            doubleStandardAssessment: { type: Type.STRING, description: "Explicit assessment of double standards applied to Israel vs. comparable states." },
            overallConsumerNarrative: { type: Type.STRING, description: "Concise plain-language summary for a community audience." },
            flaggedPassages: {
              type: Type.ARRAY,
              description: "Only passages where standards are clearly and confidently transgressed.",
              items: {
                type: Type.OBJECT,
                properties: {
                  exactQuote: { type: Type.STRING },
                  plainLanguageIssue: { type: Type.STRING },
                  taxonomyItemId: { type: Type.STRING },
                  standardCited: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["moderate", "severe"] },
                },
                required: ["exactQuote", "plainLanguageIssue", "taxonomyItemId", "standardCited", "severity"]
              }
            },
            humanReviewPrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
            limitations: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedComplaintOrResponse: { type: Type.STRING, description: "Structured high-quality response language drafts or complaint templates suitable for advocacy or community usage." },
          },
          required: [
            "antisemitismScore", "antisemitismNarrative",
            "antiZionistIntensityScore", "antiZionistNarrative",
            "rhetoricalDistortionScore", "rhetoricalNarrative",
            "baseWorthinessScore", "worthinessNarrative",
            "doubleStandardAssessment", "overallConsumerNarrative",
            "flaggedPassages", "humanReviewPrompts", "limitations",
            "suggestedComplaintOrResponse"
          ]
        };

        const consumerData = await generateAnalysisJson<any>({
          instructions: consumerSystemInstruction,
          input: consumerPrompt,
          schemaName: "consumer_mode_analysis",
          schema: consumerResponseSchema,
        });

        // Backend validation and safety sanitation
        sanitizeReport(consumerData, "consumer", originalText, metadata);

        const worthyOfResponseScore = Math.min(100, Math.round((consumerData.baseWorthinessScore || 0) * prominenceMultiplier));

        return res.json({
          _mode: "consumer",
          analysisTrace: buildAnalysisTrace({
            runtimeMs: Date.now() - analysisStartedAt,
            metrics: analysisTraceCollector.snapshot(),
          }),
          antisemitismScore: Math.round(Math.max(0, Math.min(100, consumerData.antisemitismScore || 0))),
          antisemitismNarrative: consumerData.antisemitismNarrative || "",
          antiZionistIntensityScore: Math.round(Math.max(0, Math.min(100, consumerData.antiZionistIntensityScore || 0))),
          antiZionistNarrative: consumerData.antiZionistNarrative || "",
          rhetoricalDistortionScore: Math.round(Math.max(0, Math.min(100, consumerData.rhetoricalDistortionScore || 0))),
          rhetoricalNarrative: consumerData.rhetoricalNarrative || "",
          worthyOfResponseScore,
          worthinessNarrative: consumerData.worthinessNarrative || "",
          prominenceTierLabel: prominenceLabels[prominenceTier] || "Unknown tier",
          doubleStandardAssessment: consumerData.doubleStandardAssessment || "",
          overallConsumerNarrative: consumerData.overallConsumerNarrative || "",
          flaggedPassages: consumerData.flaggedPassages || [],
          humanReviewPrompts: consumerData.humanReviewPrompts || [],
          limitations: consumerData.limitations || [],
          suggestedComplaintOrResponse: consumerData.suggestedComplaintOrResponse || "",
        });
      }
      // ── END CONSUMER MODE ─────────────────────────────────────────────────────

      // ── ACCOUNTABILITY MODE: claims, evidence gaps, action steps ─────────────
      if (selectedMode === "accountability") {
        const accountabilitySystemInstruction = `You are TextLens operating in ACCOUNTABILITY MODE.

Your job is to produce a plain-English accountability report about the submitted article or source text.

What this mode does:
- Identify important claims made by the article or author.
- Identify what evidence the article itself gives for those claims.
- Identify evidence that is absent, weak, questionable, potentially unreliable, or not enough to support the claim.
- Give the TextLens user practical next steps: what you should check, and what the author or publisher should be asked to substantiate.

Claim selection requirements:
- Return only the most important and actionable claims, not every arguable point.
- Aim for 3 to 7 claims unless the text is extremely short.
- Prioritize central factual, legal, causal, statistical, or institutional claims that matter most if unsupported.
- Avoid repetitive, minor, or purely rhetorical claims unless they are central to the article's argument.
- Use simple claim IDs in order: claim-1, claim-2, claim-3, and so on.

Strict limits:
- Do not independently verify external facts. You only have the submitted text and metadata.
- Do not say a claim is false unless the submitted text itself proves the contradiction.
- Do not make legal findings, liability findings, or final credibility findings.
- If evidence is quoted or cited in the article but may still be unreliable, say why it may be questionable and what should be requested to test it.
- Every exactQuote and evidenceQuote must be copied exactly from the submitted text. If unsure, leave the quote field blank and summarize instead.
- Use low, moderate, high, or severe for seriousness and priority.
- Use clear, direct language. Address the TextLens user as "you" in next steps.
- Treat antisemitism taxonomies as background only. If antisemitism or anti-Zionist framing appears important, recommend running Community / General Review Mode for a more detailed analysis of that aspect.`;

        const accountabilityPrompt = `Submitted text:
"""
${originalText}
"""

Metadata:
${JSON.stringify(metadata, null, 2)}

Return structured JSON matching the schema exactly. Keep the language plain and useful.`;

        const severityEnum = ["low", "moderate", "high", "severe"];
        const accountabilityResponseSchema = {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A short plain-English summary of the accountability concerns and follow-up value.",
            },
            overallConcernLevel: {
              type: Type.STRING,
              enum: severityEnum,
              description: "The overall accountability concern level for this article.",
            },
            claimsMadeByArticle: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  exactQuote: { type: Type.STRING },
                  claimSummary: { type: Type.STRING },
                  claimType: {
                    type: Type.STRING,
                    enum: ["factual", "legal", "causal", "statistical", "moral accusation", "institutional accusation", "insinuation", "omission/framing", "other"],
                  },
                  seriousness: { type: Type.STRING, enum: severityEnum },
                  whyItMatters: { type: Type.STRING },
                },
                required: ["id", "exactQuote", "claimSummary", "claimType", "seriousness", "whyItMatters"],
              },
            },
            evidenceGivenInArticle: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claimId: { type: Type.STRING },
                  evidenceSummary: { type: Type.STRING },
                  evidenceQuote: { type: Type.STRING },
                  sourceNamed: { type: Type.STRING },
                  credibilityConcern: { type: Type.STRING },
                },
                required: ["claimId", "evidenceSummary", "evidenceQuote", "sourceNamed", "credibilityConcern"],
              },
            },
            missingOrQuestionableEvidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claimId: { type: Type.STRING },
                  whatIsMissingOrQuestionable: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                  whatAuthorShouldProvide: { type: Type.STRING },
                  whatYouShouldCheck: { type: Type.STRING },
                  seriousness: { type: Type.STRING, enum: severityEnum },
                },
                required: ["claimId", "whatIsMissingOrQuestionable", "whyItMatters", "whatAuthorShouldProvide", "whatYouShouldCheck", "seriousness"],
              },
            },
            suggestedNextSteps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING, enum: severityEnum },
                  task: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["priority", "task", "reason"],
              },
            },
            limitsOfThisReport: { type: Type.ARRAY, items: { type: Type.STRING } },
            antisemitismBackgroundNote: { type: Type.STRING },
          },
          required: [
            "summary",
            "overallConcernLevel",
            "claimsMadeByArticle",
            "evidenceGivenInArticle",
            "missingOrQuestionableEvidence",
            "suggestedNextSteps",
            "limitsOfThisReport",
            "antisemitismBackgroundNote",
          ],
        };

        const accountabilityData = await generateAnalysisJson<any>({
          instructions: accountabilitySystemInstruction,
          input: accountabilityPrompt,
          schemaName: "accountability_mode_analysis",
          schema: accountabilityResponseSchema,
        });

        sanitizeAccountabilityReport(accountabilityData, originalText);

        return res.json({
          _mode: "accountability",
          analysisTrace: buildAnalysisTrace({
            runtimeMs: Date.now() - analysisStartedAt,
            metrics: analysisTraceCollector.snapshot(),
          }),
          accountabilityReport: accountabilityData,
        });
      }
      // ── END ACCOUNTABILITY MODE ──────────────────────────────────────────────

      const pipelineVersion = process.env.TEXTLENS_PIPELINE_VERSION || "v2";
      if (pipelineVersion === "v2") {
        const reportData = await runStagedAnalysis({
          originalText,
          metadata,
          selectedMode: selectedMode as any,
          allowedTaxonomyItems: getAllowedTaxonomyItems(selectedMode),
          generateStructuredJson: generateAnalysisJson,
        });

        sanitizeReport(reportData, selectedMode, originalText, metadata);
        reportData.analysisTrace = buildAnalysisTrace({
          runtimeMs: Date.now() - analysisStartedAt,
          metrics: analysisTraceCollector.snapshot(),
        });
        return res.json(reportData);
      }

      const modePolicy = getModePolicy(selectedMode);
      const filteredTaxonomy = getAllowedTaxonomyItems(selectedMode);
      const protectedNonTriggers = getProtectedNonTriggerItems();
      const relevantSourceRules = getRelevantSourceRules(selectedMode);

      // Serialize configurations for embedding inside prompt
      const filteredTaxonomyContext = JSON.stringify(
        filteredTaxonomy.map(item => ({
          origin: taxonomyMappingById.get(item.id)?.origin || "mixed",
          id: item.id,
          family: item.family,
          categoryTitle: item.categoryTitle,
          definition: item.definition,
          flawOrWhyItMatters: item.flawOrWhyItMatters,
          boundaryNote: item.boundaryNote,
          modelResponseGuidance: item.modelResponseGuidance,
          severity: item.severity,
          primaryScoreImpact: item.primaryScoreImpact,
          modeWeighting: item.modeWeighting[selectedMode as keyof typeof item.modeWeighting],
          referenceNote: item.referenceNote,
          sourceSupports: taxonomyMappingById.get(item.id)?.sourceSupports || [],
        })),
        null,
        2
      );

      const protectedNonTriggersContext = JSON.stringify(
        protectedNonTriggers.map(item => ({
          id: item.id,
          family: item.family,
          categoryTitle: item.categoryTitle,
          definition: item.definition,
          boundaryNote: item.boundaryNote,
          modelResponseGuidance: item.modelResponseGuidance
        })),
        null,
        2
      );

      const relevantSourcesFormatted = relevantSourceRules.map(rule => {
        const criteria = rule.questions.map(q => `    * ${q}`).join('\n');
        const triggerSignals = rule.triggerSignals.map(signal => `    * ${signal}`).join('\n');
        const guardrailSignals = rule.guardrailSignals.map(signal => `    * ${signal}`).join('\n');
        const limits = rule.applicationLimits.map(limit => `    * ${limit}`).join('\n');
        return `- ID: ${rule.sourceKey}
  Name: ${rule.sourceName}
  Type: ${rule.sourceType}
  Section: ${rule.section}
  Usage Kind: ${rule.usageKind}
  Analytical Use: ${rule.analyticalUse}
  Key Questions:
${criteria || "    * Not specified"}
  Trigger Signals:
${triggerSignals || "    * Not specified"}
  Guardrail Signals:
${guardrailSignals || "    * Not specified"}
  Limits:
${limits || "    * Not specified"}`;
      }).join('\n\n');

      const systemInstruction = `You are an expert, objective legal, academic, rhetoric, and media analysis copilot.
Your job is to run a rigorous "TextLens Audit" of the user's submitted text.
You must carefully evaluate the text under the requested mode: "${selectedModeLabel}" (internal key: "${selectedMode}").

CORE MANDATORY DIRECTIVES YOU MUST ABSOLUTELY FOLLOW:
1. USE ONLY THE TAXONOMY ITEMS SUPPLIED. DO NOT INVENT TAXONOMY CATEGORIES.
2. TIE EVERY FLAGGED FINDING TO EXACT QUOTED TEXT in the 'exactQuote' field. Never paraphrase or alter the text snippet.
3. DO NOT FLAG CONTENT WITHOUT A TEXTUAL BASIS. If a passage is not explicitly biased or violating a standard on the text itself, do not flag it.
4. DO NOT CLASSIFY ORDINARY CRITICISM OF ISRAEL, ZIONISM, OR GOVERNMENT POLICY AS ANTISEMITIC WITHOUT ADDITIONAL TEXTUAL EVIDENCE.
5. USE PROTECTED NON-TRIGGER CATEGORIES ACTIVELY AS GUARDRAILS. Carefully evaluate if standard criticism, alternative state model advocacy, or peaceful boycott campaign arguments are present in the text. Even if they are not triggered as violations, actively document why they are compliant guardrails in the 'guardrailFindings' array, showing how they bound and configure your final interpretation!
6. DISTINGUISH CLEARLY BETWEEN:
   - direct antisemitic content (Layer 1)
   - contemporary Israel/Zionism-linked patterns (Layer 2)
   - rhetorical or evidentiary taxonomy concerns (Layer 3)
   - ordinary political criticism (always marked as Layer 0 / benign political speech under guardrail findings, never as violation)
   - uncertain or insufficient evidence
7. USE THE SELECTED COMMUNICATION TYPE AND RHETORICAL FUNCTION AS INTERPRETIVE CONTEXT ONLY.
8. DO NOT CLASSIFY A TEXT AS ANTISEMITIC MERELY BECAUSE IT IS AN OPEN LETTER, PETITION, MORAL APPEAL, OR ADVOCACY DOCUMENT.
9. TREAT THE TEXTLENS TAXONOMY AS A WORKING ANALYTICAL FRAMEWORK, NOT AS A LEGALLY AUTHORITATIVE OR INDEPENDENTLY VALIDATED DIAGNOSTIC INSTRUMENT. Include statements reflecting this in your 'summaryJudgement' and limitations.
10. PROVIDE ALTERNATIVE BENIGN INTERPRETATIONS WHERE RELEVANT for every flagged passage you identify.
11. LABEL UNCERTAINTY CLEARLY. Use appropriate confidence levels ('low', 'moderate', 'high') and flag borderline or doubtful evaluations.
12. DO NOT PRODUCE A LEGAL CONCLUSION. Your role is as an analyst providing support and analytical evidence for human editors and reviewers.
13. STANDARDS & SOURCE SUMMARIES APPLICATION:
    - You MUST only apply the standards, source texts, and group-descriptors that are explicitly listed as valid for the current analysis mode "${selectedModeLabel}" (listed under the "Relevant standards and source summaries for this selected mode" section).
    - You MUST NOT invent source text, clauses, guidelines, or details that are not provided in the summaries.
    - Cite the sources only if they appear in the provided list.
    - If the provided summaries in the source catalog are insufficient, you MUST explicitly note this as a limitation under the 'limitations' array of your final JSON response, rather than filling in or expanding details from outer-model trained knowledge.
14. LEGAL-CRITERIA & TERMINOLOGY CONSTRAINT (ICRC & IHL SOURCING):
    - Wherever ICRC or IHL sources are referenced or used (such as in "healthcare" mode), apply this instruction strictly:
      "ICRC and IHL sources are included purely for terminology and criteria-mapping guardrails, not for legal adjudication of armed conflict. Ensure that the model does not declare actions lawful or unlawful, but rather assesses whether the article provides, omits, or assumes the facts needed to satisfy the criteria in these sources."
15. HALLUCINATION MINIMISATION PROTOCOL:
    - DEFAULT TO RESTRAINT. If a claim is not clearly supported by the submitted text, do not flag it.
    - DO NOT INVENT intent, motive, chronology, omitted context, hidden meaning, source content, or legal effect.
    - USE ONLY VERBATIM SUPPORT. Every 'exactQuote' must appear exactly in the submitted text, character-for-character.
    - IF THE TEXT IS EXCERPTED, AMBIGUOUS, OR INSUFFICIENT, narrow the claim, lower confidence, and record the uncertainty in 'limitations' rather than filling gaps from general world knowledge.
    - IT IS BETTER TO RETURN A NARROWER OR INCOMPLETE ANALYSIS THAN AN OVERSTATED ONE.
16. COMPILED RULE LAYER:
    - The provided mode policy, taxonomy mappings and source rules are the operative method for this run.
    - Use them exactly as provided.
    - Do not expand them using outside remembered detail.
    - Where the taxonomy indicates a mixed or TextLens-specific origin, do not overstate external consensus.

Communication context details:
- Communication Type: ${actualCommunicationType}
- Rhetorical Function: ${actualRhetoricalFunction}

Mode policy for this run:
- Label: ${modePolicy?.label || selectedMode}
- Purpose: ${modePolicy?.purpose || "Not specified"}
- Report positioning: ${modePolicy?.reportPositioning || "Not specified"}
- Hallucination policy: ${modePolicy?.hallucinationPolicy || "Not specified"}
- Abstention policy: ${modePolicy?.abstentionPolicy || "Not specified"}

Interpretation context guidance:
- A news report, editorial, open letter, petition, broadcast segment, and formal complaint do not operate in the same way.
- Analyze how claims are being made and what kind of authority is being invoked (scientific, moral, journalistic, or legal).
- Assess whether evidence, context, and uncertainty are handled appropriately for the communication type "${actualCommunicationType}" and rhetorical function "${actualRhetoricalFunction}". These do not determine whether a text is antisemitic.
`;

      const prompt = `Submitted Document/Text to Analyse:
"""
${originalText}
"""

Active Analysis Mode: ${selectedModeLabel}
Active Analysis Mode Internal Key: ${selectedMode}
Selected Communication Type: ${actualCommunicationType}
Selected Rhetorical Function: ${actualRhetoricalFunction}

Submitted Document Metadata:
${JSON.stringify(metadata, null, 2)}

Active TextLens Taxonomy Items Relevant to this Active Mode "${selectedModeLabel}" (You MUST only map issues inside 'flaggedPassages' to these categories):
${filteredTaxonomyContext}

Protected Non-Trigger Categories (You MUST actively use these as analytical guardrails and document them in the 'guardrailFindings' field):
${protectedNonTriggersContext}

Relevant standards and source summaries for this selected mode:
${relevantSourcesFormatted}

Please perform the assessment and return the analysis strictly as structured JSON conforming to the supplied response schema. Ensure that you evaluate the text meticulously, identifying any flagged passages according to the rules above.`;

      // Define structured response schema matching the requested schema exactly
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          summaryJudgement: {
            type: Type.STRING,
            description: "An overall authoritative executive summary of the analysis under the specific active mode. Discuss boundaries and working framework nature."
          },
          overallConcernLevel: {
            type: Type.STRING,
            enum: ["none", "low", "moderate", "high", "severe", "uncertain"],
            description: "Overall severity of concerns."
          },
          confidence: {
            type: Type.STRING,
            enum: ["low", "moderate", "high"],
            description: "AI's overall assessment confidence."
          },
          analysisMode: {
            type: Type.STRING,
            description: "The active analysis mode."
          },
          communicationType: {
            type: Type.STRING,
            description: "The communication type."
          },
          rhetoricalFunction: {
            type: Type.STRING,
            description: "The rhetorical function."
          },
          shortSummary: {
            type: Type.STRING,
            description: "A short elegant paragraph summary of the key findings."
          },
          taxonomyItemsConsidered: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "IDs of taxonomy items evaluated relative to the mode."
          },
          protectedNonTriggersConsidered: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "IDs of protected non-trigger items evaluated as guardrails."
          },
          flaggedPassages: {
            type: Type.ARRAY,
            description: "The list of specific flagged text snippets with detailed taxonomy mapping.",
            items: {
              type: Type.OBJECT,
              properties: {
                exactQuote: {
                  type: Type.STRING,
                  description: "The exact literal quote from the submitted text. Must be absolutely identical."
                },
                issueDetected: {
                  type: Type.STRING,
                  description: "Concise summary label of the bias or violation detected."
                },
                taxonomyItemId: {
                  type: Type.STRING,
                  description: "The taxonomy item ID matched (e.g. L1-POWER)."
                },
                taxonomyCategoryTitle: {
                  type: Type.STRING,
                  description: "The category title of the taxonomy item."
                },
                taxonomySection: {
                  type: Type.STRING,
                  description: "The section title of the taxonomy item (e.g. Layer 1: Direct Antisemitic Content)."
                },
                relevantStandardOrSource: {
                  type: Type.STRING,
                  description: "Precisely identify standard or source clause triggered (e.g. IHRA-EX2, etc.)."
                },
                explanation: {
                  type: Type.STRING,
                  description: "Detailed objective explanation of why this specific passage was flagged under the standard."
                },
                severity: {
                  type: Type.STRING,
                  enum: ["low", "moderate", "high", "severe"],
                  description: "The severity level of this passage violation."
                },
                confidence: {
                  type: Type.STRING,
                  enum: ["low", "moderate", "high"],
                  description: "The confidence level of this evaluation."
                },
                humanReviewNeeded: {
                  type: Type.BOOLEAN,
                  description: "Whether a human review or oversight is needed."
                },
                alternativeBenignInterpretation: {
                  type: Type.STRING,
                  description: "A possible benign or alternate explanation or interpretation under political debate rules."
                }
              },
              required: [
                "exactQuote",
                "issueDetected",
                "taxonomyItemId",
                "taxonomyCategoryTitle",
                "taxonomySection",
                "relevantStandardOrSource",
                "explanation",
                "severity",
                "confidence",
                "humanReviewNeeded",
                "alternativeBenignInterpretation"
              ]
            }
          },
          guardrailFindings: {
            type: Type.ARRAY,
            description: "Audits confirming compliance or guardrail usage on protected non-trigger categories.",
            items: {
              type: Type.OBJECT,
              properties: {
                protectedCategory: {
                  type: Type.STRING,
                  description: "Name of the protected category, e.g. Ordinary Political Criticism."
                },
                whyRelevant: {
                  type: Type.STRING,
                  description: "Why this guardrail is relevant to the submitted text."
                },
                effectOnInterpretation: {
                  type: Type.STRING,
                  description: "How this guardrail bounds standard interpretation."
                }
              },
              required: ["protectedCategory", "whyRelevant", "effectOnInterpretation"]
                }
              },
          standardsApplied: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of general standard ids triggered in this report."
          },
          humanReviewPrompts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Core investigatory questions or prompts for the reviewer."
          },
          limitations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Explicit limitation declarations regarding AI boundaries, lack of geopolitical timeline knowledge, etc."
          },
          suggestedComplaintOrResponse: {
            type: Type.STRING,
            description: "Structured high-quality response language drafts (Formal Letter for COPE/OMBUD, Press Release/Statement, and/or Public Correction Request)."
          }
        },
        required: [
          "summaryJudgement",
          "overallConcernLevel",
          "confidence",
          "analysisMode",
          "communicationType",
          "rhetoricalFunction",
          "shortSummary",
          "taxonomyItemsConsidered",
          "protectedNonTriggersConsidered",
          "flaggedPassages",
          "guardrailFindings",
          "standardsApplied",
          "humanReviewPrompts",
          "limitations",
          "suggestedComplaintOrResponse"
        ]
      };

      const reportData = await generateAnalysisJson<any>({
        instructions: systemInstruction,
        input: prompt,
        schemaName: "textlens_analysis",
        schema: responseSchema,
      });
      
      // Backend validation and safety sanitation
      sanitizeReport(reportData, selectedMode, originalText, metadata);
      reportData.analysisTrace = buildAnalysisTrace({
        runtimeMs: Date.now() - analysisStartedAt,
        metrics: analysisTraceCollector.snapshot(),
      });
      
      // Send the raw structured response back
      res.json(reportData);
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      res.status(500).json({ error: err.message || "An error occurred during AI analysis." });
    } finally {
      const elapsedMs = Date.now() - analysisStartedAt;
      console.log(`[TextLens] /api/analyse completed in ${(elapsedMs / 1000).toFixed(2)}s`);
    }
  });

  app.post("/api/accountability/draft-response", async (req, res) => {
    try {
      const { metadata, originalText, accountabilityReport, settings } = req.body || {};

      if (!accountabilityReport || typeof accountabilityReport !== "object") {
        return res.status(400).json({ error: "A Stage 1 accountability report is required before generating a draft response." });
      }

      const validPositions = new Set(["cautious", "firm", "assertive"]);
      const validBases = new Set([
        "article_only",
        "article_plus_notes",
        "article_plus_supporting_materials",
        "article_plus_supporting_materials_and_notes",
      ]);
      const validGoals = new Set([
        "request_sources_and_clarification",
        "request_correction",
      ]);

      const normalizedPosition = String(settings?.position || "cautious").toLowerCase();
      const normalizedBasis = String(settings?.basis || "article_only").toLowerCase();
      const normalizedGoals = Array.isArray(settings?.goals)
        ? settings.goals.map((goal: unknown) => String(goal).toLowerCase()).filter((goal: string) => validGoals.has(goal))
        : [];
      const userNotes = typeof settings?.userNotes === "string" ? settings.userNotes.trim() : "";
      const cautionAcknowledged = Boolean(settings?.cautionAcknowledged);

      if (!validPositions.has(normalizedPosition)) {
        return res.status(400).json({ error: "Invalid response position supplied." });
      }
      if (!validBases.has(normalizedBasis)) {
        return res.status(400).json({ error: "Invalid response basis supplied." });
      }
      if (normalizedGoals.length === 0) {
        return res.status(400).json({ error: "Select at least one response goal before generating a draft." });
      }
      if (normalizedPosition === "assertive" && normalizedBasis === "article_plus_notes" && !cautionAcknowledged) {
        return res.status(400).json({ error: "Assertive drafts that rely materially on notes require an explicit caution acknowledgement." });
      }

      const goalLabels = normalizedGoals.map((goal: string) =>
        goal === "request_correction" ? "Request correction" : "Request sources and clarification"
      );
      const basisLabelMap: Record<string, string> = {
        article_only: "Article only",
        article_plus_notes: "Article + your notes",
        article_plus_supporting_materials: "Article + supporting materials",
        article_plus_supporting_materials_and_notes: "Article + supporting materials + your notes",
      };

      const draftSchema = {
        type: Type.OBJECT,
        properties: {
          generatedDraft: {
            type: Type.STRING,
            description: "A professional draft response aligned to the selected goals, position, and basis.",
          },
        },
        required: ["generatedDraft"],
      };

      const draftInstructions = `You are TextLens operating in ACCOUNTABILITY MODE, Stage 2: Draft Response.

Your job is to transform a completed Stage 1 accountability analysis into a professional response draft.

You must obey these rules:
- Use the supplied Stage 1 report as the analytical base.
- Do not redo the analysis from scratch.
- Do not invent new claims, documents, contradictions, or findings beyond what is supplied.
- The response must not be stronger than the selected basis allows.
- If the basis is "Article only", do not claim that a statement is false or conclusively contradicted unless the Stage 1 report itself clearly shows a contradiction from the submitted material.
- If the basis includes user notes, treat them as user-supplied support, not independently verified documents. They may justify stronger wording, but you must still avoid overclaiming.
- If the position is "assertive" and the basis relies on notes, prefer formulations such as "appears seriously unreliable", "appears difficult to reconcile with the information available", or "appears inconsistent with the notes provided" unless the supplied material clearly warrants stronger wording.
- Keep the tone professional.
- Combine the selected goals naturally into one draft. If both goals are selected, request sources and clarification first, then state the correction request proportionately.
- Give the publisher or author a clear reason to care: factual accuracy, editorial transparency, public trust, fair substantiation of serious claims, and the opportunity to clarify or correct the record.
- Avoid empty threats, legal overstatement, or implying liability.

Use this exact structure on separate lines:
Subject:
Why this matters:
Claims needing attention:
Requested sources or clarification:
Requested response:
Closing:
`;

      const draftInput = `Selected response settings:
${JSON.stringify(
        {
          position: normalizedPosition,
          basis: basisLabelMap[normalizedBasis] || normalizedBasis,
          goals: goalLabels,
          tone: "Professional",
          cautionAcknowledged,
          supportingMaterialsAttachedInThisMvp: false,
        },
        null,
        2
      )}

User notes:
${userNotes || "[None supplied]"}

Metadata:
${JSON.stringify(metadata || {}, null, 2)}

Original submitted text:
"""
${typeof originalText === "string" ? originalText : ""}
"""

Stage 1 accountability report:
${JSON.stringify(accountabilityReport, null, 2)}

Return structured JSON matching the schema exactly.`;

      const generated = await generateStructuredJson<{ generatedDraft: string }>({
        instructions: draftInstructions,
        input: draftInput,
        schemaName: "accountability_stage_two_draft_response",
        schema: draftSchema,
      });

      return res.json({
        stageTwoResponse: {
          position: normalizedPosition,
          basis: normalizedBasis,
          goals: normalizedGoals,
          tone: "professional",
          userNotes,
          generatedDraft: generated.generatedDraft || "",
          generatedAt: new Date().toISOString(),
          cautionAcknowledged,
        },
      });
    } catch (err: any) {
      console.error("Accountability Stage 2 Draft Error:", err);
      res.status(500).json({ error: err.message || "An error occurred while generating the Stage 2 draft response." });
    }
  });

  // Serve static assets with Vite dev server in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static assets in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error("Fatal Server Startup Error:", e);
});
