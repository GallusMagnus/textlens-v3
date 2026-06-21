import { sourceCatalogList } from "../sourceCatalog";
import { textLensTaxonomy } from "../taxonomyData";
import { getModePolicy, modePolicies } from "./policies/modePolicies";
import { sourceRuleByKey, sourceRules } from "./rules/sourceRules";
import { taxonomyMappingById, taxonomyMappings } from "./rules/taxonomyMappings";
import type { CompiledRuleLayer, CoreAnalysisMode } from "./types";

const CORE_MODES: CoreAnalysisMode[] = [
  "general",
  "healthcare",
  "academic",
  "bccsa",
  "press_code",
];

export const compiledRuleLayer: CompiledRuleLayer = {
  version: "2026-06-21",
  status: "phase-1",
  generatedFrom: [
    "src/taxonomyData.ts",
    "src/sourceCatalog.ts",
    "src/analysis/policies/modePolicies.ts",
    "src/analysis/rules/sourceRules.ts",
    "src/analysis/rules/taxonomyMappings.ts",
  ],
  modePolicies: CORE_MODES.map((mode) => modePolicies[mode]),
  sourceRules,
  taxonomyMappings,
};

export function getAllowedSourceKeysForMode(mode: string) {
  const policy = getModePolicy(mode);
  return policy ? [...policy.sourceRuleKeys] : [];
}

export function getRelevantSourceCatalogItems(mode: string) {
  const allowed = new Set(getAllowedSourceKeysForMode(mode));
  return sourceCatalogList.filter((item) => allowed.has(item.sourceKey));
}

export function getRelevantSourceRules(mode: string) {
  const allowed = new Set(getAllowedSourceKeysForMode(mode));
  return sourceRules.filter((rule) => allowed.has(rule.sourceKey));
}

export function getAllowedTaxonomyItems(mode: string) {
  if (!CORE_MODES.includes(mode as CoreAnalysisMode)) {
    return [];
  }

  return textLensTaxonomy.filter(
    (item) =>
      item.family !== "Protected non-trigger" &&
      item.relevantModes.includes(mode as CoreAnalysisMode)
  );
}

export function getProtectedNonTriggerItems() {
  return textLensTaxonomy.filter((item) => item.family === "Protected non-trigger");
}

export function isTaxonomyItemAllowedInMode(taxonomyItemId: string, mode: string) {
  const item = textLensTaxonomy.find((candidate) => candidate.id === taxonomyItemId);
  if (!item) return false;
  if (item.family === "Protected non-trigger") return true;
  if (mode === "consumer") {
    return item.relevantModes.includes("general");
  }
  if (!CORE_MODES.includes(mode as CoreAnalysisMode)) {
    return false;
  }
  return item.relevantModes.includes(mode as CoreAnalysisMode);
}

export function getSourceKeyForClauseId(clauseId: string) {
  const normalized = clauseId.trim().toUpperCase();
  if (!normalized) return "";

  for (const rule of sourceRules) {
    for (const prefix of rule.clausePrefixes) {
      const upperPrefix = prefix.toUpperCase();
      if (normalized.startsWith(upperPrefix)) {
        return rule.sourceKey;
      }

      if (
        normalized.includes(`${upperPrefix}-`) ||
        normalized.includes(`${upperPrefix}_`) ||
        normalized.includes(`${upperPrefix}:`) ||
        normalized.endsWith(upperPrefix)
      ) {
        return rule.sourceKey;
      }
    }
  }

  return "";
}

export { getModePolicy, sourceRuleByKey, taxonomyMappingById };
