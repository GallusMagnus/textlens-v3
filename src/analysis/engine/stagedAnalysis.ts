import type { TaxonomyItem } from "../../taxonomyData";
import type { TextLensMetadata } from "../../types";
import {
  getModePolicy,
  getProtectedNonTriggerItems,
  getRelevantSourceRules,
  getSourceKeyForClauseId,
  taxonomyMappingById,
} from "../compiledRuleLayer";
import type {
  CompiledSourceRule,
  CoreAnalysisMode,
  ModeUsageRole,
} from "../types";

const Type = {
  OBJECT: "object",
  STRING: "string",
  ARRAY: "array",
  NUMBER: "number",
  BOOLEAN: "boolean",
} as const;

type StructuredJsonGenerator = <T>(args: {
  instructions?: string;
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
}) => Promise<T>;

type EngineConfidence = "low" | "moderate" | "high";
type EngineSeverity = "low" | "moderate" | "high" | "severe";

interface PreprocessWarning {
  code: string;
  message: string;
}

interface TextSegment {
  id: string;
  exactText: string;
  normalizedText: string;
  startOffset: number;
  endOffset: number;
  index: number;
  score: number;
  reasons: string[];
}

interface CandidatePassage {
  id: string;
  exactQuote: string;
  startOffset: number;
  endOffset: number;
  surroundingContext: string;
  extractionReason: string;
  sourceSegmentId: string;
}

interface CandidateWithGuardrailContext extends CandidatePassage {
  guardrailStatus?: GuardrailAssessment["status"];
  guardrailIds?: string[];
  guardrailRationale?: string;
}

interface GuardrailAssessment {
  candidateId: string;
  status: "blocked" | "proceed" | "ambiguous";
  guardrailIds: string[];
  rationale: string;
  confidence: EngineConfidence;
}

interface ClassificationFinding {
  candidateId: string;
  findingStatus: "flagged" | "abstain";
  taxonomyItemId: string;
  issueDetected: string;
  explanation: string;
  severity: EngineSeverity;
  confidence: EngineConfidence;
  humanReviewNeeded: boolean;
  alternativeBenignInterpretation: string;
}

interface ScoredFinding {
  candidateId: string;
  exactQuote: string;
  taxonomyItemId: string;
  issueDetected: string;
  explanation: string;
  severity: EngineSeverity;
  confidence: EngineConfidence;
  humanReviewNeeded: boolean;
  alternativeBenignInterpretation: string;
  taxonomyCategoryTitle: string;
  taxonomySection: string;
  relevantStandardOrSource: string;
  standardSourceKey: string;
  score: number;
}

interface SynthesisResponse {
  summaryJudgement: string;
  shortSummary: string;
  humanReviewPrompts: string[];
  suggestedComplaintOrResponse: string;
  additionalLimitations: string[];
}

interface StagedAnalysisInput {
  originalText: string;
  metadata: TextLensMetadata;
  selectedMode: CoreAnalysisMode;
  allowedTaxonomyItems: TaxonomyItem[];
  generateStructuredJson: StructuredJsonGenerator;
}

interface StagedAnalysisOutput {
  summaryJudgement: string;
  overallConcernLevel: "none" | "low" | "moderate" | "high" | "severe" | "uncertain";
  confidence: EngineConfidence;
  analysisMode: string;
  analysisTrace?: {
    analyzedAt: string;
    model: string;
  };
  communicationType: string;
  rhetoricalFunction: string;
  shortSummary: string;
  taxonomyItemsConsidered: string[];
  protectedNonTriggersConsidered: string[];
  flaggedPassages: Array<{
    exactQuote: string;
    issueDetected: string;
    taxonomyItemId: string;
    taxonomyCategoryTitle: string;
    taxonomySection: string;
    relevantStandardOrSource: string;
    explanation: string;
    severity: EngineSeverity;
    confidence: EngineConfidence;
    humanReviewNeeded: boolean;
    alternativeBenignInterpretation: string;
  }>;
  guardrailFindings: Array<{
    reviewStatus: "blocked" | "ambiguous";
    reviewLabel: string;
    protectedCategory: string;
    quoteExcerpt: string;
    whyRelevant: string;
    effectOnInterpretation: string;
  }>;
  standardsApplied: string[];
  humanReviewPrompts: string[];
  limitations: string[];
  suggestedComplaintOrResponse: string;
}

const STOP_WORDS = new Set([
  "about",
  "after",
  "against",
  "also",
  "among",
  "been",
  "being",
  "between",
  "could",
  "does",
  "from",
  "have",
  "into",
  "itself",
  "just",
  "more",
  "must",
  "only",
  "other",
  "over",
  "should",
  "such",
  "than",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "under",
  "using",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
]);

const HOT_WORDS = [
  "jew",
  "jewish",
  "zion",
  "zionist",
  "zionism",
  "israel",
  "israeli",
  "antisemit",
  "holocaust",
  "nazi",
  "apartheid",
  "genocide",
  "colonial",
  "boycott",
  "bds",
  "dehuman",
  "guilt",
  "conspiracy",
  "blood",
  "loyalty",
  "ceasefire",
  "medical",
  "hospital",
  "journal",
  "editor",
  "broadcast",
  "press",
  "civilian",
  "combatant",
  "proportionality",
  "precaution",
];

function normalizeWhitespace(value: string) {
  return value.replace(/\r\n/g, "\n").replace(/\t/g, " ").replace(/[ ]{2,}/g, " ").trim();
}

function tokenize(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(
          (token) =>
            token.length >= 4 &&
            !STOP_WORDS.has(token) &&
            !/^\d+$/.test(token)
        )
    )
  );
}

function trimSlice(raw: string, start: number, end: number) {
  let adjustedStart = start;
  let adjustedEnd = end;

  while (adjustedStart < adjustedEnd && /\s/.test(raw[adjustedStart])) {
    adjustedStart += 1;
  }

  while (adjustedEnd > adjustedStart && /\s/.test(raw[adjustedEnd - 1])) {
    adjustedEnd -= 1;
  }

  return {
    text: raw.slice(adjustedStart, adjustedEnd),
    start: adjustedStart,
    end: adjustedEnd,
  };
}

function splitParagraphSlices(rawText: string) {
  const slices: Array<{ text: string; start: number; end: number }> = [];
  const boundaryRegex = /\n\s*\n/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = boundaryRegex.exec(rawText)) !== null) {
    const slice = trimSlice(rawText, cursor, match.index);
    if (slice.text) slices.push(slice);
    cursor = match.index + match[0].length;
  }

  const trailing = trimSlice(rawText, cursor, rawText.length);
  if (trailing.text) slices.push(trailing);

  if (slices.length === 0 && rawText.trim()) {
    const fallback = trimSlice(rawText, 0, rawText.length);
    if (fallback.text) slices.push(fallback);
  }

  return slices;
}

function splitLongSliceIntoSentences(
  rawText: string,
  slice: { text: string; start: number; end: number }
) {
  if (slice.text.length <= 650) {
    return [slice];
  }

  const parts = slice.text.split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/);
  if (parts.length <= 1) {
    return [slice];
  }

  const results: Array<{ text: string; start: number; end: number }> = [];
  let localCursor = slice.start;

  for (const part of parts) {
    const foundAt = rawText.indexOf(part, localCursor);
    if (foundAt === -1) continue;
    const segment = trimSlice(rawText, foundAt, foundAt + part.length);
    if (segment.text) results.push(segment);
    localCursor = foundAt + part.length;
  }

  return results.length > 0 ? results : [slice];
}

function buildKeywordUniverse(
  taxonomyItems: TaxonomyItem[],
  sourceRules: CompiledSourceRule[]
) {
  const taxonomyTokens = taxonomyItems.flatMap((item) =>
    tokenize(
      [
        item.categoryTitle,
        item.quoteLabel,
        item.definition,
        item.boundaryNote,
        item.referenceNote,
      ].join(" ")
    )
  );

  const sourceTokens = sourceRules.flatMap((rule) =>
    tokenize(
      [
        rule.analyticalUse,
        rule.triggerSignals.join(" "),
        rule.guardrailSignals.join(" "),
        rule.questions.join(" "),
      ].join(" ")
    )
  );

  return new Set([...taxonomyTokens, ...sourceTokens, ...HOT_WORDS]);
}

function scoreSegment(
  segmentText: string,
  keywordUniverse: Set<string>,
  mode: CoreAnalysisMode
) {
  const normalized = normalizeWhitespace(segmentText).toLowerCase();
  const tokens = tokenize(normalized);
  const tokenSet = new Set(tokens);
  const matchedKeywords = tokens.filter((token) => keywordUniverse.has(token));
  const hotWordHits = HOT_WORDS.filter((word) => normalized.includes(word)).length;
  const punctuationBoost =
    (segmentText.match(/!/g)?.length || 0) > 0 ||
    (segmentText.match(/["“”]/g)?.length || 0) >= 2
      ? 1
      : 0;
  const modeBoost =
    mode === "healthcare" &&
    /(hospital|medical|civilian|combatant|ihl|icrc|proportionality|precaution)/i.test(segmentText)
      ? 2
      : mode === "academic" &&
          /(journal|editor|publication|peer review|editorial|author)/i.test(segmentText)
        ? 2
        : mode === "bccsa" &&
            /(broadcast|programme|channel|news|segment|reply|fairness)/i.test(segmentText)
          ? 2
          : mode === "press_code" &&
              /(report|article|headline|comment|reply|correction|press)/i.test(segmentText)
            ? 2
            : 0;

  const score =
    Math.min(4, matchedKeywords.length) +
    Math.min(4, hotWordHits) +
    punctuationBoost +
    modeBoost;

  const reasons = [
    matchedKeywords.length > 0
      ? `matched ${Math.min(4, matchedKeywords.length)} taxonomy/source keywords`
      : "",
    hotWordHits > 0 ? `contains ${hotWordHits} high-salience terms` : "",
    modeBoost > 0 ? `matches ${mode} mode vocabulary` : "",
  ].filter(Boolean);

  return { score, reasons };
}

function buildSegments(
  rawText: string,
  allowedTaxonomyItems: TaxonomyItem[],
  sourceRules: CompiledSourceRule[],
  mode: CoreAnalysisMode
) {
  const keywordUniverse = buildKeywordUniverse(
    [...allowedTaxonomyItems, ...getProtectedNonTriggerItems()],
    sourceRules
  );
  const paragraphSlices = splitParagraphSlices(rawText);
  const sentenceSlices = paragraphSlices.flatMap((slice) =>
    splitLongSliceIntoSentences(rawText, slice)
  );

  return sentenceSlices.map((slice, index) => {
    const normalizedText = normalizeWhitespace(slice.text);
    const { score, reasons } = scoreSegment(normalizedText, keywordUniverse, mode);
    return {
      id: `seg-${index + 1}`,
      exactText: slice.text,
      normalizedText,
      startOffset: slice.start,
      endOffset: slice.end,
      index,
      score,
      reasons,
    };
  });
}

function getSurroundingContext(rawText: string, start: number, end: number) {
  const contextStart = Math.max(0, start - 180);
  const contextEnd = Math.min(rawText.length, end + 180);
  return rawText.slice(contextStart, contextEnd).trim();
}

function extractCandidatePassages(
  rawText: string,
  segments: TextSegment[]
) {
  const scored = [...segments].sort((a, b) => b.score - a.score || a.index - b.index);
  const selectedIds = new Set<string>();

  for (const segment of scored) {
    if (segment.score >= 3) {
      selectedIds.add(segment.id);
    }
    if (selectedIds.size >= 12) break;
  }

  if (selectedIds.size < 6) {
    for (const segment of scored.slice(0, 8)) {
      selectedIds.add(segment.id);
    }
  }

  const selectedIndices = new Set<number>();
  for (const segment of segments) {
    if (selectedIds.has(segment.id)) {
      selectedIndices.add(segment.index);
      if (segment.index > 0) selectedIndices.add(segment.index - 1);
      if (segment.index < segments.length - 1) selectedIndices.add(segment.index + 1);
    }
  }

  const candidates = segments
    .filter((segment) => selectedIndices.has(segment.index))
    .slice(0, 18)
    .map((segment, index): CandidatePassage => ({
      id: `cand-${index + 1}`,
      exactQuote: segment.exactText,
      startOffset: segment.startOffset,
      endOffset: segment.endOffset,
      surroundingContext: getSurroundingContext(rawText, segment.startOffset, segment.endOffset),
      extractionReason:
        segment.reasons.join("; ") || "selected as contextual candidate passage",
      sourceSegmentId: segment.id,
    }));

  if (candidates.length > 0) return candidates;

  return segments.slice(0, 4).map((segment, index) => ({
    id: `cand-${index + 1}`,
    exactQuote: segment.exactText,
    startOffset: segment.startOffset,
    endOffset: segment.endOffset,
    surroundingContext: getSurroundingContext(rawText, segment.startOffset, segment.endOffset),
    extractionReason: "fallback candidate from opening text segment",
    sourceSegmentId: segment.id,
  }));
}

function buildPreprocessWarnings(
  rawText: string,
  normalizedText: string,
  metadata: TextLensMetadata,
  mode: CoreAnalysisMode
) {
  const warnings: PreprocessWarning[] = [];

  if (normalizedText.length < 300) {
    warnings.push({
      code: "short-text",
      message:
        "Submitted text is short. Broader framing, omissions and balance assessments may be unstable.",
    });
  }

  if (
    normalizedText.length < 1500 ||
    /\[\.\.\.|truncated|excerpt/i.test(rawText) ||
    /\.\.\./.test(rawText)
  ) {
    warnings.push({
      code: "possible-excerpt",
      message:
        "Submitted text may be excerpted or truncated. Findings should be interpreted cautiously.",
    });
  }

  if (!metadata.jurisdiction) {
    warnings.push({
      code: "missing-jurisdiction",
      message: "Jurisdiction metadata is missing, limiting regulatory boundary analysis.",
    });
  }

  if (!metadata.date) {
    warnings.push({
      code: "missing-date",
      message: "Publication or broadcast date is missing.",
    });
  }

  if (mode === "bccsa") {
    if (!metadata.broadcaster || !metadata.programmeName || !metadata.broadcastDateTime) {
      warnings.push({
        code: "missing-broadcast-metadata",
        message:
          "Broadcast metadata is incomplete, so any BCCSA-specific procedural conclusion should be treated cautiously.",
      });
    }
  }

  if (mode === "academic" || mode === "healthcare") {
    if (!metadata.authorAffiliation) {
      warnings.push({
        code: "missing-affiliation",
        message:
          "Author affiliation is missing, limiting conflict and institutional-context assessment.",
      });
    }
  }

  if (mode === "healthcare") {
    warnings.push({
      code: "healthcare-boundary",
      message:
        "Healthcare mode uses humanitarian and IHL sources for terminology and criteria-mapping only, not legal adjudication.",
    });
  }

  return warnings;
}

function hasEscalationCue(text: string) {
  return /(\bgenocid(?:e|al)\b|\bapartheid\b|\bsettler[- ]colonial(?:ism)?\b|\bcolonial(?:ism)?\b|\bfascis(?:m|t)\b|\bwhite[- ]supremac(?:y|ist)\b|\bnazi\b|\bholocaust\b|\bdual loyalty\b|\bblood libel\b|\bcabal\b|\blobby\b|\billegitimat(?:e|cy)\b|\bno right to exist\b|\berase\b|\beradicate\b|\bliquidat(?:e|ion)\b|\beliminat(?:e|ion)\b|\bwipe\b|\bdismantl(?:e|ing)\b|\bentity\b|\bparasite\b|\bcancer\b|\bvirus\b|\bzionis[mt]\b)/i.test(
    text
  );
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function runGuardrailStage(
  generateStructuredJson: StructuredJsonGenerator,
  candidates: CandidatePassage[],
  metadata: TextLensMetadata,
  mode: CoreAnalysisMode,
  allowedTaxonomyItems: TaxonomyItem[]
) {
  const protectedItems = getProtectedNonTriggerItems();
  const policy = getModePolicy(mode);
  const sourceRules = getRelevantSourceRules(mode);
  const escalationCues = allowedTaxonomyItems
    .filter(
      (item) =>
        item.primaryScoreImpact === "High" || item.primaryScoreImpact === "Moderate"
    )
    .map((item) => ({
      id: item.id,
      categoryTitle: item.categoryTitle,
      definition: item.definition,
      boundaryNote: item.boundaryNote,
    }));
  const triggerSignals = Array.from(
    new Set(sourceRules.flatMap((rule) => rule.triggerSignals))
  );
  const batches = chunkArray(candidates, 6);
  const assessments: GuardrailAssessment[] = [];

  for (const batch of batches) {
    const input = `Mode (internal key): ${mode}
Mode (user-facing label): ${policy?.label || mode}
Communication Type: ${metadata.communicationType || "unspecified"}
Rhetorical Function: ${metadata.rhetoricalFunction || "unspecified"}

Protected guardrails:
${JSON.stringify(
      protectedItems.map((item) => ({
        id: item.id,
        categoryTitle: item.categoryTitle,
        definition: item.definition,
        boundaryNote: item.boundaryNote,
      })),
      null,
      2
    )}

Do not auto-block if any escalation cue is plausibly present:
${JSON.stringify(escalationCues, null, 2)}

Trigger signals that can override a simple guardrail block:
${JSON.stringify(triggerSignals, null, 2)}

Candidate passages:
${JSON.stringify(batch, null, 2)}
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        assessments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              candidateId: { type: Type.STRING },
              status: {
                type: Type.STRING,
                enum: ["blocked", "proceed", "ambiguous"],
              },
              guardrailIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              rationale: { type: Type.STRING },
              confidence: {
                type: Type.STRING,
                enum: ["low", "moderate", "high"],
              },
            },
            required: [
              "candidateId",
              "status",
              "guardrailIds",
              "rationale",
              "confidence",
            ],
          },
        },
      },
      required: ["assessments"],
    };

    const instructions = `You are the TextLens guardrail stage.

Your task is to screen candidate passages against the protected non-trigger categories BEFORE any violation finding is allowed.

Rules:
- Use only the supplied protected guardrails.
- "blocked" means the passage is best treated as protected speech unless more evidence appears elsewhere.
- "proceed" means the passage is not protected by the listed guardrails and may move to taxonomy classification.
- "ambiguous" means the guardrail might apply, but the passage still warrants narrow later review.
- Return only candidate IDs that were supplied.
- Keep rationale precise and restrained.
- Do not invent surrounding context or motive.
- A passage should be "blocked" only when it is straightforwardly protected political criticism, BDS advocacy, or constitutional/state-model advocacy and does not plausibly contain any escalation cue or trigger signal.
- If a passage plausibly contains delegitimising threshold-testing language, collective accusation, essentialising or group-based blame, dehumanising/pathologising language, eliminationist framing, Nazi/Holocaust inversion, or any comparable escalation cue, do NOT mark it "blocked". Use "ambiguous" or "proceed".
- In Consensus Standards Mode specifically, harsh Israel/Zionism criticism is not automatically exempt. If genocide, apartheid, colonialism, illegitimacy, or similar claims plausibly test the boundary between protected criticism and antisemitic delegitimisation, keep the passage available for later classification.`;

    const result = await generateStructuredJson<{ assessments: GuardrailAssessment[] }>({
      instructions,
      input,
      schemaName: "textlens_guardrail_stage",
      schema,
    });

    assessments.push(...result.assessments);
  }

  return assessments;
}

async function runClassificationStage(
  generateStructuredJson: StructuredJsonGenerator,
  candidates: CandidateWithGuardrailContext[],
  metadata: TextLensMetadata,
  mode: CoreAnalysisMode,
  allowedTaxonomyItems: TaxonomyItem[],
  sourceRules: CompiledSourceRule[]
) {
  if (candidates.length === 0) return [] as ClassificationFinding[];

  const batches = chunkArray(candidates, 6);
  const findings: ClassificationFinding[] = [];

  for (const batch of batches) {
    const input = `Mode: ${mode}
Communication Type: ${metadata.communicationType || "unspecified"}
Rhetorical Function: ${metadata.rhetoricalFunction || "unspecified"}

Allowed taxonomy items:
${JSON.stringify(
      allowedTaxonomyItems.map((item) => ({
        id: item.id,
        section: item.section,
        family: item.family,
        categoryTitle: item.categoryTitle,
        definition: item.definition,
        boundaryNote: item.boundaryNote,
        modelResponseGuidance: item.modelResponseGuidance,
      })),
      null,
      2
    )}

Relevant compiled source rules:
${JSON.stringify(
      sourceRules.map((rule) => ({
        sourceKey: rule.sourceKey,
        usageKind: rule.usageKind,
        analyticalUse: rule.analyticalUse,
        triggerSignals: rule.triggerSignals,
        applicationLimits: rule.applicationLimits,
      })),
      null,
      2
    )}

Candidate passages with guardrail context:
${JSON.stringify(batch, null, 2)}
`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        findings: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              candidateId: { type: Type.STRING },
              findingStatus: {
                type: Type.STRING,
                enum: ["flagged", "abstain"],
              },
              taxonomyItemId: { type: Type.STRING },
              issueDetected: { type: Type.STRING },
              explanation: { type: Type.STRING },
              severity: {
                type: Type.STRING,
                enum: ["low", "moderate", "high", "severe"],
              },
              confidence: {
                type: Type.STRING,
                enum: ["low", "moderate", "high"],
              },
              humanReviewNeeded: { type: Type.BOOLEAN },
              alternativeBenignInterpretation: { type: Type.STRING },
            },
            required: [
              "candidateId",
              "findingStatus",
              "taxonomyItemId",
              "issueDetected",
              "explanation",
              "severity",
              "confidence",
              "humanReviewNeeded",
              "alternativeBenignInterpretation",
            ],
          },
        },
      },
      required: ["findings"],
    };

    const instructions = `You are the TextLens taxonomy classification stage.

Rules:
- Use only the supplied taxonomy items.
- Classify only if the candidate passage itself supports the finding.
- If the evidence is weak, ambiguous, excerpted or not clearly within the taxonomy, return "abstain".
- Treat guardrail context as important but not dispositive. A prior "blocked" guardrail status does NOT bar a flagged finding if the passage itself plausibly crosses a supplied taxonomy threshold.
- If a passage combines harsh Israel/Zionism criticism with genocide/apartheid/colonial/illegitimacy/eliminationist or comparable escalation language, test it against the supplied taxonomy rather than automatically abstaining.
- Do not invent intent, chronology, omitted context or unseen material.
- Keep explanations narrow.
- Every candidateId must come from the supplied batch.`;

    const result = await generateStructuredJson<{ findings: ClassificationFinding[] }>({
      instructions,
      input,
      schemaName: "textlens_classification_stage",
      schema,
    });

    findings.push(...result.findings);
  }

  return findings;
}

function getConcernLevel(totalScore: number) {
  if (totalScore <= 0) return "none" as const;
  if (totalScore < 4) return "low" as const;
  if (totalScore < 8) return "moderate" as const;
  if (totalScore < 13) return "high" as const;
  return "severe" as const;
}

function confidenceMultiplier(value: EngineConfidence) {
  if (value === "high") return 1;
  if (value === "moderate") return 0.75;
  return 0.5;
}

function severityPoints(value: EngineSeverity) {
  if (value === "severe") return 4;
  if (value === "high") return 3;
  if (value === "moderate") return 2;
  return 1;
}

function impactPoints(value: TaxonomyItem["primaryScoreImpact"]) {
  if (value === "High") return 3;
  if (value === "Moderate") return 2;
  if (value === "Low") return 1;
  return 0;
}

function roleMultiplier(value: ModeUsageRole) {
  if (value === "primary") return 1.2;
  if (value === "supporting") return 0.8;
  return 0;
}

function chooseStandardForFinding(
  mode: CoreAnalysisMode,
  taxonomyItem: TaxonomyItem
) {
  const mapping = taxonomyMappingById.get(taxonomyItem.id);
  if (!mapping) {
    return {
      relevantStandardOrSource: taxonomyItem.likelyStandards?.[0] || "TEXTLENS",
      standardSourceKey: "textlens_framework",
    };
  }

  const rankedSupports = [...mapping.sourceSupports]
    .filter((support) => {
      const policy = getModePolicy(mode);
      return policy?.sourceRuleKeys.includes(support.sourceKey);
    })
    .sort((a, b) => {
      const rank = (value: string) => {
        if (value === "direct") return 1;
        if (value === "integrity") return 2;
        if (value === "terminology") return 3;
        if (value === "framework") return 4;
        return 5;
      };
      return rank(a.supportType) - rank(b.supportType);
    });

  const chosenSupport = rankedSupports[0];
  const matchingLikelyStandard = (taxonomyItem.likelyStandards || []).find(
    (clauseId) =>
      chosenSupport && getSourceKeyForClauseId(clauseId) === chosenSupport.sourceKey
  );

  return {
    relevantStandardOrSource:
      matchingLikelyStandard ||
      taxonomyItem.likelyStandards?.[0] ||
      chosenSupport?.sourceKey.toUpperCase() ||
      "TEXTLENS",
    standardSourceKey: chosenSupport?.sourceKey || "textlens_framework",
  };
}

function scoreFindings(
  mode: CoreAnalysisMode,
  candidates: CandidatePassage[],
  classificationFindings: ClassificationFinding[],
  allowedTaxonomyItems: TaxonomyItem[]
) {
  const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const taxonomyMap = new Map(allowedTaxonomyItems.map((item) => [item.id, item]));

  const findings: ScoredFinding[] = [];

  for (const finding of classificationFindings) {
    if (finding.findingStatus !== "flagged") continue;
    const candidate = candidateMap.get(finding.candidateId);
    const taxonomyItem = taxonomyMap.get(finding.taxonomyItemId);
    if (!candidate || !taxonomyItem) continue;

    const standardChoice = chooseStandardForFinding(mode, taxonomyItem);
    const numericScore =
      (severityPoints(finding.severity) + impactPoints(taxonomyItem.primaryScoreImpact)) *
      roleMultiplier(taxonomyItem.modeWeighting[mode]) *
      confidenceMultiplier(finding.confidence);

    findings.push({
      candidateId: finding.candidateId,
      exactQuote: candidate.exactQuote,
      taxonomyItemId: taxonomyItem.id,
      issueDetected: finding.issueDetected,
      explanation: finding.explanation,
      severity: finding.severity,
      confidence: finding.confidence,
      humanReviewNeeded: finding.humanReviewNeeded,
      alternativeBenignInterpretation: finding.alternativeBenignInterpretation,
      taxonomyCategoryTitle: taxonomyItem.categoryTitle,
      taxonomySection: taxonomyItem.section,
      relevantStandardOrSource: standardChoice.relevantStandardOrSource,
      standardSourceKey: standardChoice.standardSourceKey,
      score: Number(numericScore.toFixed(2)),
    });
  }

  return findings;
}

function deriveOverallConfidence(
  findings: ScoredFinding[],
  guardrailAssessments: GuardrailAssessment[],
  warnings: PreprocessWarning[]
): EngineConfidence {
  if (warnings.some((warning) => warning.code === "possible-excerpt")) {
    if (findings.length === 0) return "low";
  }

  if (findings.length === 0) {
    const blockedOnly =
      guardrailAssessments.length > 0 &&
      guardrailAssessments.every((assessment) => assessment.status !== "proceed");
    return blockedOnly ? "moderate" : "low";
  }

  const score =
    findings.reduce((sum, finding) => {
      if (finding.confidence === "high") return sum + 3;
      if (finding.confidence === "moderate") return sum + 2;
      return sum + 1;
    }, 0) / findings.length;

  if (score >= 2.5) return "high";
  if (score >= 1.75) return "moderate";
  return "low";
}

function buildGuardrailFindings(
  assessments: GuardrailAssessment[],
  candidates: CandidatePassage[]
) {
  const protectedItems = new Map(
    getProtectedNonTriggerItems().map((item) => [item.id, item.categoryTitle])
  );
  const candidateQuotes = new Map(
    candidates.map((candidate) => [candidate.id, candidate.exactQuote])
  );

  return assessments
    .filter(
      (assessment) =>
        assessment.guardrailIds.length > 0 &&
        (assessment.status === "blocked" || assessment.status === "ambiguous")
    )
    .map((assessment) => {
      const reviewStatus: "blocked" | "ambiguous" =
        assessment.status === "blocked" ? "blocked" : "ambiguous";
      return {
        reviewStatus,
        reviewLabel:
          assessment.status === "blocked"
            ? "Protected-Speech Guardrail Applied"
            : "Boundary Tested: Review Continued",
        protectedCategory:
          assessment.guardrailIds
            .map((id) => protectedItems.get(id) || id)
            .join(", ") || "Protected guardrail",
        quoteExcerpt: candidateQuotes.get(assessment.candidateId) || "",
        whyRelevant: assessment.rationale,
        effectOnInterpretation:
          assessment.status === "blocked"
            ? "This passage was treated as protected or presumptively protected political speech unless other evidence clearly displaced that protection."
            : "A guardrail was considered, but it did not justify automatic exemption. This passage remained available for later classification against the applicable taxonomy and standards.",
      };
    });
}

async function runSynthesisStage(
  generateStructuredJson: StructuredJsonGenerator,
  mode: CoreAnalysisMode,
  metadata: TextLensMetadata,
  findings: ScoredFinding[],
  guardrailFindings: Array<{
    reviewStatus: "blocked" | "ambiguous";
    reviewLabel: string;
    protectedCategory: string;
    quoteExcerpt: string;
    whyRelevant: string;
    effectOnInterpretation: string;
  }>,
  limitations: string[],
  overallConcernLevel: StagedAnalysisOutput["overallConcernLevel"],
  overallConfidence: EngineConfidence
) {
  const policy = getModePolicy(mode);
  const modeLabel = policy?.label || mode;

  const input = `Mode policy:
${JSON.stringify(policy, null, 2)}

Metadata:
${JSON.stringify(
    {
      analysisModeInternal: metadata.analysisMode,
      analysisModeLabel: modeLabel,
      communicationType: metadata.communicationType,
      rhetoricalFunction: metadata.rhetoricalFunction,
      title: metadata.title,
      author: metadata.author,
      platform: metadata.platform,
      jurisdiction: metadata.jurisdiction,
    },
    null,
    2
  )}

Overall concern level: ${overallConcernLevel}
Overall confidence: ${overallConfidence}

Structured findings:
${JSON.stringify(
    findings.map((finding) => ({
      exactQuote: finding.exactQuote,
      taxonomyItemId: finding.taxonomyItemId,
      taxonomyCategoryTitle: finding.taxonomyCategoryTitle,
      taxonomySection: finding.taxonomySection,
      relevantStandardOrSource: finding.relevantStandardOrSource,
      explanation: finding.explanation,
      severity: finding.severity,
      confidence: finding.confidence,
    })),
    null,
    2
  )}

Guardrail findings:
${JSON.stringify(guardrailFindings, null, 2)}

Limitations already identified:
${JSON.stringify(limitations, null, 2)}
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      summaryJudgement: { type: Type.STRING },
      shortSummary: { type: Type.STRING },
      humanReviewPrompts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      suggestedComplaintOrResponse: { type: Type.STRING },
      additionalLimitations: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: [
      "summaryJudgement",
      "shortSummary",
      "humanReviewPrompts",
      "suggestedComplaintOrResponse",
      "additionalLimitations",
    ],
  };

  const instructions = `You are the TextLens synthesis stage.

Rules:
- Synthesize ONLY from the supplied structured findings, guardrails, limitations and mode policy.
- Do not reopen the raw text or invent new evidence.
- Be objective and restrained.
- When naming the analysis mode in prose, use this exact user-facing label: "${modeLabel}".
- Make clear that TextLens is an analytical aid rather than a legal or regulatory adjudicator.
- Human review prompts should be concrete and useful.
- The draft response should be professionally toned and proportional to the findings.
- The draft response must not just list objections or demands. It should briefly explain why the author, editor, publisher, or institution has a reason to care: factual accuracy, editorial standards, public trust, fair treatment of serious claims, and the opportunity to clarify or correct the record.
- If requesting substantiation, make the request practical and specific. Avoid empty threats, legal overstatement, or implying that TextLens has made a final adjudication.`;

  return generateStructuredJson<SynthesisResponse>({
    instructions,
    input,
    schemaName: "textlens_synthesis_stage",
    schema,
  });
}

export async function runStagedAnalysis({
  originalText,
  metadata,
  selectedMode,
  allowedTaxonomyItems,
  generateStructuredJson,
}: StagedAnalysisInput): Promise<StagedAnalysisOutput> {
  const analysisStartedAt = Date.now();
  const normalizedText = normalizeWhitespace(originalText);
  const policy = getModePolicy(selectedMode);
  const sourceRules = getRelevantSourceRules(selectedMode);
  const preprocessWarnings = buildPreprocessWarnings(
    originalText,
    normalizedText,
    metadata,
    selectedMode
  );
  const segments = buildSegments(
    originalText,
    allowedTaxonomyItems,
    sourceRules,
    selectedMode
  );
  const candidates = extractCandidatePassages(originalText, segments);
  console.log(
    `[TextLens] Staged analysis prepared ${segments.length} segments and ${candidates.length} candidate passages for mode "${selectedMode}".`
  );

  const guardrailStartedAt = Date.now();
  const guardrailAssessments = await runGuardrailStage(
    generateStructuredJson,
    candidates,
    metadata,
    selectedMode,
    allowedTaxonomyItems
  );
  console.log(
    `[TextLens] Guardrail stage completed in ${((Date.now() - guardrailStartedAt) / 1000).toFixed(2)}s with ${guardrailAssessments.length} assessments.`
  );

  const guardrailMap = new Map(
    guardrailAssessments.map((assessment) => [assessment.candidateId, assessment])
  );
  const reviewableCandidates: CandidateWithGuardrailContext[] = candidates
    .filter((candidate) => {
      const assessment = guardrailMap.get(candidate.id);
      if (!assessment) return true;
      if (assessment.status !== "blocked") return true;
      return hasEscalationCue(
        `${candidate.exactQuote}\n${candidate.surroundingContext}\n${assessment.rationale || ""}`
      );
    })
    .map((candidate) => {
      const assessment = guardrailMap.get(candidate.id);
      return {
        ...candidate,
        guardrailStatus: assessment?.status,
        guardrailIds: assessment?.guardrailIds || [],
        guardrailRationale: assessment?.rationale || "",
      };
    });
  console.log(
    `[TextLens] ${reviewableCandidates.length} candidate passages advanced to classification.`
  );

  const classificationStartedAt = Date.now();
  const classificationFindings = await runClassificationStage(
    generateStructuredJson,
    reviewableCandidates,
    metadata,
    selectedMode,
    allowedTaxonomyItems,
    sourceRules
  );
  console.log(
    `[TextLens] Classification stage completed in ${((Date.now() - classificationStartedAt) / 1000).toFixed(2)}s with ${classificationFindings.length} findings.`
  );
  const scoredFindings = scoreFindings(
    selectedMode,
    reviewableCandidates,
    classificationFindings,
    allowedTaxonomyItems
  );
  const totalScore = Number(
    scoredFindings.reduce((sum, finding) => sum + finding.score, 0).toFixed(2)
  );
  const overallConcernLevel = getConcernLevel(totalScore);
  const overallConfidence = deriveOverallConfidence(
    scoredFindings,
    guardrailAssessments,
    preprocessWarnings
  );
  const guardrailFindings = buildGuardrailFindings(guardrailAssessments, candidates);
  const limitations = Array.from(
    new Set([
      ...preprocessWarnings.map((warning) => warning.message),
      scoredFindings.length === 0
        ? "No passage cleared the staged threshold strongly enough to support a confident substantive finding."
        : "",
      guardrailFindings.length > 0
        ? "Protected or potentially protected political-expression guardrails materially shaped the interpretation."
        : "",
      policy?.hallucinationPolicy || "",
    ].filter(Boolean))
  );

  const synthesisStartedAt = Date.now();
  const synthesis = await runSynthesisStage(
    generateStructuredJson,
    selectedMode,
    metadata,
    scoredFindings,
    guardrailFindings,
    limitations,
    overallConcernLevel,
    overallConfidence
  );
  console.log(
    `[TextLens] Synthesis stage completed in ${((Date.now() - synthesisStartedAt) / 1000).toFixed(2)}s.`
  );

  const finalLimitations = Array.from(
    new Set([...limitations, ...(synthesis.additionalLimitations || [])])
  );
  const standardsApplied = Array.from(
    new Set(scoredFindings.map((finding) => finding.relevantStandardOrSource))
  );
  const taxonomyItemsConsidered = Array.from(
    new Set(scoredFindings.map((finding) => finding.taxonomyItemId))
  );
  const protectedNonTriggersConsidered = Array.from(
    new Set(guardrailAssessments.flatMap((assessment) => assessment.guardrailIds))
  );
  console.log(
    `[TextLens] Staged analysis completed in ${((Date.now() - analysisStartedAt) / 1000).toFixed(2)}s with ${scoredFindings.length} flagged passages and concern level "${overallConcernLevel}".`
  );

  return {
    summaryJudgement: synthesis.summaryJudgement,
    overallConcernLevel,
    confidence: overallConfidence,
    analysisMode: selectedMode,
    communicationType: metadata.communicationType || "unspecified",
    rhetoricalFunction: metadata.rhetoricalFunction || "unspecified",
    shortSummary: synthesis.shortSummary,
    taxonomyItemsConsidered,
    protectedNonTriggersConsidered,
    flaggedPassages: scoredFindings.map((finding) => ({
      exactQuote: finding.exactQuote,
      issueDetected: finding.issueDetected,
      taxonomyItemId: finding.taxonomyItemId,
      taxonomyCategoryTitle: finding.taxonomyCategoryTitle,
      taxonomySection: finding.taxonomySection,
      relevantStandardOrSource: finding.relevantStandardOrSource,
      explanation: finding.explanation,
      severity: finding.severity,
      confidence: finding.confidence,
      humanReviewNeeded: finding.humanReviewNeeded,
      alternativeBenignInterpretation: finding.alternativeBenignInterpretation,
    })),
    guardrailFindings,
    standardsApplied,
    humanReviewPrompts: synthesis.humanReviewPrompts,
    limitations: finalLimitations,
    suggestedComplaintOrResponse: synthesis.suggestedComplaintOrResponse,
  };
}
