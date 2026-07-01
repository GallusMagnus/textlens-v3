export interface TextLensMetadata {
  title: string;
  author: string;
  platform: string;
  date: string;
  url: string;
  textType: string;
  jurisdiction: string;
  analysisMode: 'general' | 'healthcare' | 'academic' | 'bccsa' | 'press_code' | 'consumer' | 'accountability';
  communicationType?: string;
  rhetoricalFunction?: string;

  // Consumer Mode
  publicationProminenceTier?: 1 | 2 | 3 | 4 | 5;

  // BCCSA Broadcast Complaint Mode
  broadcaster?: string;
  channel?: string;
  programmeName?: string;
  broadcastDateTime?: string;
  transcriptAvailable?: boolean;
  watershedContext?: string;
  complainantSummary?: string;
  allegedHarm?: string;

  // Healthcare Publication Mode
  journalOrPublication?: string;
  articleType?: string;
  doiOrPmid?: string;
  authorAffiliation?: string;
}

export interface StandardClause {
  id: string; // e.g. "IHRA-1", "BCCSA-11.4"
  title: string;
  text: string;
}

export interface StandardDoc {
  id: string;
  name: string;
  shortName: string;
  category: 'Antisemitism Definitions' | 'Media & Broadcasting Codes' | 'Academic & Publishing Standards' | 'Rhetorical Frameworks';
  description: string;
  clauses: StandardClause[];
  fullTextUrl?: string;
  jurisdictionContext?: string;
}

export interface FlaggedPassage {
  id: string;
  textSnippet: string;
  layer: 1 | 2 | 3; // Layer 1, 2, or 3
  taxonomyItemId?: string;
  taxonomyCategoryTitle?: string;
  taxonomySection?: string;
  standardsApplied: {
    standardId: string;
    clauseId: string;
    standardName: string;
    clauseTitle: string;
  }[];
  explanation: string;
  uncertaintyLabel: 'Confident' | 'Probable' | 'Borderline / Ambiguous' | 'System Low Confidence';
  severity: 'Informational' | 'Minor Bias' | 'Moderate / Distorted' | 'Severe / Direct';
}

export interface EvidentiaryIssue {
  id: string;
  claimSnippet: string;
  unreliablePattern: string; // e.g. "Misrepresentation of Source", "Cherry-picking", "Double standards in casualty reporting"
  reasoning: string;
  suggestedAction: string;
}

export interface HumanReviewPrompt {
  id: string;
  question: string;
  contextNote: string;
}

export interface AnalysisTrace {
  analyzedAt: string;
  model: string;
  runtimeMs?: number;
  modelCallCount?: number;
  modelRuntimeMs?: number;
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export type AccountabilitySeverity = 'low' | 'moderate' | 'high' | 'severe';
export type AccountabilityResponsePosition = 'cautious' | 'firm' | 'assertive';
export type AccountabilityResponseBasis =
  | 'article_only'
  | 'article_plus_notes'
  | 'article_plus_supporting_materials'
  | 'article_plus_supporting_materials_and_notes';
export type AccountabilityResponseGoal =
  | 'request_sources_and_clarification'
  | 'request_correction';

export interface AccountabilityClaim {
  id: string;
  exactQuote: string;
  claimSummary: string;
  claimType: string;
  seriousness: AccountabilitySeverity;
  whyItMatters: string;
}

export interface AccountabilityEvidence {
  claimId: string;
  evidenceSummary: string;
  evidenceQuote: string;
  sourceNamed: string;
  credibilityConcern: string;
}

export interface AccountabilityEvidenceIssue {
  claimId: string;
  whatIsMissingOrQuestionable: string;
  whyItMatters: string;
  whatAuthorShouldProvide: string;
  whatYouShouldCheck: string;
  seriousness: AccountabilitySeverity;
}

export interface AccountabilityNextStep {
  priority: AccountabilitySeverity;
  task: string;
  reason: string;
}

export interface AccountabilityReport {
  summary: string;
  overallConcernLevel: AccountabilitySeverity;
  claimsMadeByArticle: AccountabilityClaim[];
  evidenceGivenInArticle: AccountabilityEvidence[];
  missingOrQuestionableEvidence: AccountabilityEvidenceIssue[];
  suggestedNextSteps: AccountabilityNextStep[];
  limitsOfThisReport: string[];
  antisemitismBackgroundNote: string;
}

export interface AccountabilityStageTwoResponse {
  position: AccountabilityResponsePosition;
  basis: AccountabilityResponseBasis;
  goals: AccountabilityResponseGoal[];
  tone: 'professional';
  userNotes: string;
  generatedDraft: string;
  generatedAt: string;
  cautionAcknowledged?: boolean;
}

export interface GlossaryContextItem {
  entryId: string;
  term: string;
  entryType: string;
  category: string;
  matchedAliases: string[];
  summary: string;
  whyItMatters: string;
  whenItMayBeAntisemitic: string;
  clarificationNote: string;
  relatedTaxonomyIds: string[];
  relatedSourceKeys: string[];
  sourceName: string;
}

export interface AnalysisReport {
  id: string;
  name: string;
  metadata: TextLensMetadata;
  originalText: string;
  summaryJudgement: string;
  flaggedPassages: FlaggedPassage[];
  evidentiaryIssues: EvidentiaryIssue[];
  standardsMentioned: string[]; // standard ids
  humanReviewPrompts: HumanReviewPrompt[];
  suggestedComplaintLanguage: {
    formalLetter: string;
    pressReleaseSummary: string;
    publicCorrectionRequest: string;
  };
  
  // New structured fields from the live analysis workflow
  overallConcernLevel?: 'none' | 'low' | 'moderate' | 'high' | 'severe' | 'uncertain';
  confidence?: 'low' | 'moderate' | 'high';
  analysisMode?: string;
  communicationType?: string;
  rhetoricalFunction?: string;
  shortSummary?: string;
  taxonomyItemsConsidered?: string[];
  protectedNonTriggersConsidered?: string[];
  guardrailFindings?: {
    reviewStatus?: 'blocked' | 'ambiguous';
    reviewLabel?: string;
    protectedCategory: string;
    quoteExcerpt?: string;
    whyRelevant: string;
    effectOnInterpretation: string;
  }[];
  limitations?: string[];
  suggestedComplaintOrResponse?: string;
  analysisTrace?: AnalysisTrace;
  accountabilityReport?: AccountabilityReport;
  stageTwoResponse?: AccountabilityStageTwoResponse;
  glossaryContext?: GlossaryContextItem[];

  // Consumer Mode scores
  consumerScores?: {
    antisemitismScore: number;
    antisemitismNarrative: string;
    antiZionistIntensityScore: number;
    antiZionistNarrative: string;
    rhetoricalDistortionScore: number;
    rhetoricalNarrative: string;
    worthyOfResponseScore: number;
    worthinessNarrative: string;
    doubleStandardAssessment: string;
    overallConsumerNarrative: string;
  };
}
