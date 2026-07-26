export type LiteratureSourceProvider = "pubmed";

export type LiteratureCandidateTier = "direct" | "contextual" | "comparison";

export type LiteratureCorpusStatus =
  | "new"
  | "queued"
  | "analysed"
  | "needs_review"
  | "ignored";

export interface LiteratureLensDefinition {
  id: string;
  label: string;
  description: string;
  candidateTiers: Array<{
    tier: LiteratureCandidateTier;
    label: string;
    terms: string[];
  }>;
}

export interface LiteratureMonitorJournal {
  key: string;
  name: string;
  queryNames: string[];
  tier?: string;
  isCore?: boolean;
}

export interface LiteratureMonitorProfile {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  provider: LiteratureSourceProvider;
  lensIds: string[];
  searchTerms: string[];
  journals: LiteratureMonitorJournal[];
  dateFrom: string;
  dateTo?: string;
  lookbackDays?: number;
  defaultAnalysisMode: "healthcare" | "academic" | "accountability" | "consumer" | "general";
  batchSize: number;
}

export interface LiteratureMonitorConfig {
  version: string;
  updatedAt: string;
  lenses: LiteratureLensDefinition[];
  monitors: LiteratureMonitorProfile[];
}

export interface LiteratureMatchEvidence {
  monitorId: string;
  monitorLabel: string;
  lensIds: string[];
  candidateTier: LiteratureCandidateTier;
  matchedTerms: string[];
  matchedFields: string[];
  journalKey: string;
  journalTier?: string;
  retrievedAt: string;
  query: string;
}

export interface LiteratureCorpusItem {
  id: string;
  provider: LiteratureSourceProvider;
  pmid?: string;
  doi?: string;
  title: string;
  abstract: string;
  journal: string;
  journalKey?: string;
  journalTier?: string;
  publicationDate: string;
  year?: string;
  authors: string[];
  articleTypes: string[];
  url: string;
  canonicalUrl?: string;
  status: LiteratureCorpusStatus;
  firstSeenAt: string;
  lastSeenAt: string;
  matchedMonitors: string[];
  matchedLenses: string[];
  bestCandidateTier: LiteratureCandidateTier;
  matchEvidence: LiteratureMatchEvidence[];
  notes?: string;
  analysisReportIds?: string[];
}

export interface LiteratureCorpusRun {
  id: string;
  startedAt: string;
  completedAt: string;
  configVersion: string;
  monitorIds: string[];
  provider: LiteratureSourceProvider;
  foundCount: number;
  newCount: number;
  updatedCount: number;
  errors: string[];
}

export interface LiteratureCorpusStore {
  version: string;
  generatedAt: string;
  items: LiteratureCorpusItem[];
  runs: LiteratureCorpusRun[];
}

export interface LiteratureCorpusSummary {
  totalItems: number;
  newItems: number;
  analysedItems: number;
  monitorCount: number;
  lensCount: number;
  lastRunAt?: string;
}

export const EMPTY_LITERATURE_CORPUS: LiteratureCorpusStore = {
  version: "1",
  generatedAt: new Date(0).toISOString(),
  items: [],
  runs: [],
};

const tierRank: Record<LiteratureCandidateTier, number> = {
  direct: 3,
  contextual: 2,
  comparison: 1,
};

export function chooseBestCandidateTier(
  tiers: LiteratureCandidateTier[]
): LiteratureCandidateTier {
  return tiers.reduce<LiteratureCandidateTier>(
    (best, tier) => (tierRank[tier] > tierRank[best] ? tier : best),
    "comparison"
  );
}

export function summarizeLiteratureCorpus(
  corpus: LiteratureCorpusStore,
  config?: LiteratureMonitorConfig
): LiteratureCorpusSummary {
  const lastRun = corpus.runs[0];
  return {
    totalItems: corpus.items.length,
    newItems: corpus.items.filter((item) => item.status === "new").length,
    analysedItems: corpus.items.filter((item) => item.status === "analysed").length,
    monitorCount: config?.monitors.filter((monitor) => monitor.enabled).length || 0,
    lensCount: config?.lenses.length || 0,
    lastRunAt: lastRun?.completedAt,
  };
}

