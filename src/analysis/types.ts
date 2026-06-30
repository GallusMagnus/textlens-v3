import type { SourceCatalogItem } from "../sourceCatalog";
import type { TaxonomyItem } from "../taxonomyData";

export type CoreAnalysisMode =
  | "general"
  | "healthcare"
  | "academic"
  | "bccsa"
  | "press_code";

export type AnalysisMode = CoreAnalysisMode | "consumer";

export type SourceRuleSection =
  | "Core Antisemitism Frameworks"
  | "Media & Regulatory Codes"
  | "Academic & Publication Standards"
  | "Health Media Standards"
  | "Healthcare & International Humanitarian Law Sources"
  | "TextLens Working Framework";

export type SourceUsageKind =
  | "trigger"
  | "guardrail"
  | "integrity"
  | "terminology"
  | "framework";

export type TaxonomyOrigin =
  | "external-consensus"
  | "source-specific"
  | "textlens-extension"
  | "mixed";

export type SupportType =
  | "direct"
  | "guardrail"
  | "integrity"
  | "terminology"
  | "framework";

export type ModeUsageRole = "primary" | "supporting" | "advisory" | "guardrail" | "excluded";

export interface CompiledSourceRule {
  sourceKey: SourceCatalogItem["sourceKey"];
  sourceName: string;
  shortLabel: string;
  sourceType: string;
  section: SourceRuleSection;
  usageKind: SourceUsageKind;
  clausePrefixes: string[];
  allowedModes: CoreAnalysisMode[];
  analyticalUse: string;
  questions: string[];
  triggerSignals: string[];
  guardrailSignals: string[];
  applicationLimits: string[];
}

export interface ModePolicy {
  mode: CoreAnalysisMode;
  label: string;
  purpose: string;
  sourceRuleKeys: SourceCatalogItem["sourceKey"][];
  boundaryNote: string;
  reportPositioning: string;
  hallucinationPolicy: string;
  abstentionPolicy: string;
  protectedGuardrailIds: TaxonomyItem["id"][];
}

export interface CompiledTaxonomyMapping {
  taxonomyItemId: TaxonomyItem["id"];
  taxonomyCategoryTitle: TaxonomyItem["categoryTitle"];
  taxonomySection: TaxonomyItem["section"];
  origin: TaxonomyOrigin;
  scoreImpact: TaxonomyItem["primaryScoreImpact"];
  referenceNote: TaxonomyItem["referenceNote"];
  sourceSupports: Array<{
    sourceKey: SourceCatalogItem["sourceKey"];
    supportType: SupportType;
    rationale: string;
  }>;
  modeUsage: Record<CoreAnalysisMode, ModeUsageRole>;
}

export interface CompiledRuleLayer {
  version: string;
  status: "phase-1";
  generatedFrom: string[];
  modePolicies: ModePolicy[];
  sourceRules: CompiledSourceRule[];
  taxonomyMappings: CompiledTaxonomyMapping[];
}
