import { textLensTaxonomy } from "../../taxonomyData";
import type {
  CompiledTaxonomyMapping,
  CoreAnalysisMode,
  ModeUsageRole,
  SupportType,
  TaxonomyOrigin,
} from "../types";

const CORE_MODES: CoreAnalysisMode[] = [
  "general",
  "healthcare",
  "academic",
  "bccsa",
  "press_code",
];

const CONSENSUS_KEYS = new Set(["ihra", "jda", "nexus"]);
const INTEGRITY_KEYS = new Set([
  "bccsa_fta",
  "bccsa_sub",
  "bccsa_on",
  "press_code_sa",
  "cope",
  "icmje_recommendations_2026",
  "wame_geopolitical_intrusion_editorial_decisions",
  "wame_publication_ethics_policies",
  "jama_race_ethnicity_guidance_2021",
  "schwitzer_health_journalism_500_stories_2008",
  "ahcj_health_journalism_principles",
  "cse_publication_ethics_white_paper",
]);
const TERMINOLOGY_KEYS = new Set([
  "icrc_customary_ihl_rule_1",
  "icrc_customary_ihl_rule_7",
  "icrc_customary_ihl_rule_14",
  "icrc_customary_ihl_rule_15",
  "icrc_customary_ihl_rule_25",
  "icrc_customary_ihl_rule_28",
  "icrc_health_care_in_danger_making_case",
  "icrc_healthcare_personnel_responsibilities_conflict",
]);

function getSupportType(sourceKey: string, isGuardrailItem: boolean): SupportType {
  if (sourceKey === "textlens_framework") return "framework";
  if (TERMINOLOGY_KEYS.has(sourceKey)) return "terminology";
  if (INTEGRITY_KEYS.has(sourceKey)) return "integrity";
  if (isGuardrailItem) return "guardrail";
  return "direct";
}

function getOrigin(referenceKeys: string[]): TaxonomyOrigin {
  const nonFrameworkKeys = referenceKeys.filter((key) => key !== "textlens_framework");
  const hasConsensus = nonFrameworkKeys.some((key) => CONSENSUS_KEYS.has(key));
  const hasIntegrity = nonFrameworkKeys.some((key) => INTEGRITY_KEYS.has(key));
  const hasTerminology = nonFrameworkKeys.some((key) => TERMINOLOGY_KEYS.has(key));
  const onlyFramework = referenceKeys.length > 0 && nonFrameworkKeys.length === 0;

  if (onlyFramework) return "textlens-extension";
  if (hasConsensus && !hasIntegrity && !hasTerminology) return "external-consensus";
  if (!hasConsensus && (hasIntegrity || hasTerminology)) return "source-specific";
  return "mixed";
}

function toModeUsageRole(weight: string | undefined): ModeUsageRole {
  if (weight === "primary" || weight === "supporting" || weight === "guardrail") {
    return weight;
  }
  return "excluded";
}

export const taxonomyMappings: CompiledTaxonomyMapping[] = textLensTaxonomy.map((item) => {
  const isGuardrailItem = item.family === "Protected non-trigger";

  const modeUsage = CORE_MODES.reduce(
    (acc, mode) => {
      acc[mode] = toModeUsageRole(item.modeWeighting?.[mode]);
      return acc;
    },
    {} as Record<CoreAnalysisMode, ModeUsageRole>
  );

  return {
    taxonomyItemId: item.id,
    taxonomyCategoryTitle: item.categoryTitle,
    taxonomySection: item.section,
    origin: getOrigin(item.referenceKeys),
    scoreImpact: item.primaryScoreImpact,
    referenceNote: item.referenceNote,
    sourceSupports: item.referenceKeys.map((sourceKey) => ({
      sourceKey,
      supportType: getSupportType(sourceKey, isGuardrailItem),
      rationale: item.referenceNote,
    })),
    modeUsage,
  };
});

export const taxonomyMappingById = new Map(
  taxonomyMappings.map((mapping) => [mapping.taxonomyItemId, mapping])
);
