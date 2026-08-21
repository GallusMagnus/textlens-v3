import { textLensTaxonomy } from "../../taxonomyData";
import { decodingCrosswalkByTextLensId } from "./decodingAntisemitismCrosswalk";
import type {
  CompiledTaxonomyMapping,
  CoreAnalysisMode,
  ModeUsageRole,
  SupportType,
  TaxonomyOrigin,
} from "../types";

const CORE_MODES: CoreAnalysisMode[] = [
  "general",
  "decoding_antisemitism",
  "healthcare",
  "academic",
  "legal_profession",
  "bccsa",
  "press_code",
];

const CONSENSUS_KEYS = new Set(["ihra", "jda", "nexus"]);
const ONTOLOGY_KEYS = new Set(["decoding_antisemitism_2024"]);
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
  "aba_resolution_514_antisemitism",
  "aba_resolutions_611_613_2025",
  "us_national_strategy_counter_antisemitism",
  "global_guidelines_countering_antisemitism",
  "title_vi_shared_ancestry_discrimination",
  "eeoc_religious_discrimination_accommodation",
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
  if (ONTOLOGY_KEYS.has(sourceKey)) return "framework";
  if (TERMINOLOGY_KEYS.has(sourceKey)) return "terminology";
  if (INTEGRITY_KEYS.has(sourceKey)) return "integrity";
  if (isGuardrailItem) return "guardrail";
  return "direct";
}

function getOrigin(referenceKeys: string[]): TaxonomyOrigin {
  const nonFrameworkKeys = referenceKeys.filter((key) => key !== "textlens_framework");
  const hasConsensus = nonFrameworkKeys.some((key) => CONSENSUS_KEYS.has(key));
  const hasOntology = nonFrameworkKeys.some((key) => ONTOLOGY_KEYS.has(key));
  const hasIntegrity = nonFrameworkKeys.some((key) => INTEGRITY_KEYS.has(key));
  const hasTerminology = nonFrameworkKeys.some((key) => TERMINOLOGY_KEYS.has(key));
  const onlyFramework = referenceKeys.length > 0 && nonFrameworkKeys.length === 0;

  if (onlyFramework) return "textlens-extension";
  if (hasOntology && !hasConsensus && !hasIntegrity && !hasTerminology) return "source-specific";
  if (hasConsensus && !hasOntology && !hasIntegrity && !hasTerminology) return "external-consensus";
  if (!hasConsensus && !hasOntology && (hasIntegrity || hasTerminology)) return "source-specific";
  return "mixed";
}

function toModeUsageRole(weight: string | undefined): ModeUsageRole {
  if (
    weight === "primary" ||
    weight === "supporting" ||
    weight === "advisory" ||
    weight === "guardrail"
  ) {
    return weight;
  }
  return "excluded";
}

function getModeWeight(item: (typeof textLensTaxonomy)[number], mode: CoreAnalysisMode) {
  if (mode === "decoding_antisemitism") {
    const crosswalkItems = decodingCrosswalkByTextLensId.get(item.id) || [];
    const rankedRoles: ModeUsageRole[] = ["primary", "supporting", "advisory", "guardrail", "excluded"];
    return crosswalkItems
      .map((crosswalkItem) => crosswalkItem.sourceRoleByMode.decoding_antisemitism)
      .filter(Boolean)
      .sort((a, b) => rankedRoles.indexOf(a as ModeUsageRole) - rankedRoles.indexOf(b as ModeUsageRole))[0];
  }
  if (item.modeWeighting?.[mode]) return item.modeWeighting[mode];
  if (mode === "legal_profession") return item.modeWeighting?.general;
  return undefined;
}

export const taxonomyMappings: CompiledTaxonomyMapping[] = textLensTaxonomy.map((item) => {
  const isGuardrailItem = item.family === "Protected non-trigger";
  const decodingCrosswalkItems = decodingCrosswalkByTextLensId.get(item.id) || [];
  const referenceKeys = Array.from(
    new Set([
      ...item.referenceKeys,
      ...decodingCrosswalkItems.map(() => "decoding_antisemitism_2024"),
    ])
  );

  const modeUsage = CORE_MODES.reduce(
    (acc, mode) => {
      const crosswalkRole = decodingCrosswalkItems
        .map((crosswalkItem) => crosswalkItem.sourceRoleByMode[mode])
        .filter(Boolean)[0];
      acc[mode] = toModeUsageRole(crosswalkRole || getModeWeight(item, mode));
      return acc;
    },
    {} as Record<CoreAnalysisMode, ModeUsageRole>
  );

  return {
    taxonomyItemId: item.id,
    taxonomyCategoryTitle: item.categoryTitle,
    taxonomySection: item.section,
    origin: getOrigin(referenceKeys),
    scoreImpact: item.primaryScoreImpact,
    referenceNote: item.referenceNote,
    sourceSupports: referenceKeys.map((sourceKey) => ({
      sourceKey,
      supportType: getSupportType(sourceKey, isGuardrailItem),
      rationale:
        sourceKey === "decoding_antisemitism_2024"
          ? decodingCrosswalkItems.map((crosswalkItem) => crosswalkItem.note).join(" ")
          : item.referenceNote,
    })),
    modeUsage,
  };
});

export const taxonomyMappingById = new Map(
  taxonomyMappings.map((mapping) => [mapping.taxonomyItemId, mapping])
);
