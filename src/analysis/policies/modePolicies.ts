import type { ModePolicy } from "../types";

const PROTECTED_GUARDRAILS = [
  "L0-POLITI-CRIT",
  "L0-BOYCOTT-BDS",
  "L0-BINATIONAL",
] as const;

export const modePolicies: Record<ModePolicy["mode"], ModePolicy> = {
  general: {
    mode: "general",
    label: "Consensus Standards Mode",
    purpose:
      "Apply the core antisemitism frameworks together with the shared TextLens taxonomy for a context-sensitive rhetorical audit.",
    sourceRuleKeys: ["ihra", "jda", "nexus", "textlens_framework"],
    boundaryNote:
      "[TextLens Boundary Note: This analysis was conducted in Consensus Standards Mode. It is an independent analytical assessment using compiled source rules and the TextLens taxonomy, not a legal or regulatory adjudication.]",
    reportPositioning:
      "Use the core antisemitism frameworks as the main external reference set and identify clearly where TextLens is adding its own interpretive taxonomy.",
    hallucinationPolicy:
      "Default to restraint. If the text does not clearly support a claim, narrow it or abstain.",
    abstentionPolicy:
      "If a passage is harsh but still plausibly ordinary political criticism, BDS advocacy, or constitutional advocacy, protect it with guardrails unless additional triggering evidence is present.",
    protectedGuardrailIds: [...PROTECTED_GUARDRAILS],
  },
  healthcare: {
    mode: "healthcare",
    label: "Healthcare Publication Mode",
    purpose:
      "Assess rhetoric, publication integrity, health journalism quality, and healthcare-in-conflict terminology without making legal findings.",
    sourceRuleKeys: [
      "ihra",
      "jda",
      "nexus",
      "textlens_framework",
      "cope",
      "cse_publication_ethics_white_paper",
      "icmje_recommendations_2026",
      "wame_geopolitical_intrusion_editorial_decisions",
      "wame_publication_ethics_policies",
      "jama_race_ethnicity_guidance_2021",
      "ahcj_health_journalism_principles",
      "icrc_customary_ihl_rule_1",
      "icrc_customary_ihl_rule_7",
      "icrc_customary_ihl_rule_14",
      "icrc_customary_ihl_rule_15",
      "icrc_customary_ihl_rule_25",
      "icrc_customary_ihl_rule_28",
      "icrc_health_care_in_danger_making_case",
      "icrc_healthcare_personnel_responsibilities_conflict",
    ],
    boundaryNote:
      "[TextLens Boundary Note: Under Healthcare mode, publication-ethics, health-journalism, humanitarian and IHL sources are used for terminology, editorial and criteria-mapping only. TextLens does not make legal findings or adjudicate armed conflict lawfulness.]",
    reportPositioning:
      "Separate antisemitism questions, publication-integrity questions, and healthcare/IHL terminology questions rather than collapsing them into one finding.",
    hallucinationPolicy:
      "Do not infer legal meaning, protected-status loss, or editorial motive unless the submitted text itself supplies the basis.",
    abstentionPolicy:
      "If the article uses conflict-law or healthcare terminology loosely but the evidentiary basis is unclear, describe the precision problem rather than declaring a substantive violation.",
    protectedGuardrailIds: [...PROTECTED_GUARDRAILS],
  },
  academic: {
    mode: "academic",
    label: "Academic / Publication Mode",
    purpose:
      "Assess antisemitism, publication ethics, editorial independence and institutional fairness without suppressing legitimate disagreement.",
    sourceRuleKeys: [
      "ihra",
      "jda",
      "nexus",
      "textlens_framework",
      "cope",
      "cse_publication_ethics_white_paper",
      "icmje_recommendations_2026",
      "wame_geopolitical_intrusion_editorial_decisions",
      "wame_publication_ethics_policies",
    ],
    boundaryNote:
      "[TextLens Boundary Note: Academic mode safeguards academic freedom and scientific disagreement. Criticisms of bias or misconduct are limited to concrete content, process, evidence and editorial-integrity issues rather than political disagreement alone.]",
    reportPositioning:
      "Use publication and editorial standards for integrity/process findings and the core antisemitism frameworks for identity-hostility findings.",
    hallucinationPolicy:
      "Do not convert disagreement, activism or institutional controversy into an ethics breach without a concrete process or evidence problem.",
    abstentionPolicy:
      "If the text is polemical but not clearly discriminatory or procedurally defective, record the uncertainty and avoid overstated findings.",
    protectedGuardrailIds: [...PROTECTED_GUARDRAILS],
  },
  bccsa: {
    mode: "bccsa",
    label: "BCCSA Broadcasting Mode",
    purpose:
      "Assess South African broadcast content using the core antisemitism frameworks plus the relevant BCCSA codes on hate speech, fairness and contextual accuracy.",
    sourceRuleKeys: [
      "ihra",
      "jda",
      "nexus",
      "textlens_framework",
      "bccsa_fta",
      "bccsa_sub",
      "bccsa_on",
    ],
    boundaryNote:
      "[TextLens Boundary Note: This report provides drafting support for possible broadcasting complaints. TextLens is an independent analytical copilot and does not provide final BCCSA adjudications.]",
    reportPositioning:
      "Keep identity-hostility findings distinct from code-based accuracy, fairness, context and reply-right findings.",
    hallucinationPolicy:
      "Do not assume code coverage, factual error or reply-right failure unless the submitted text and metadata support that inference.",
    abstentionPolicy:
      "If broadcast metadata is incomplete, narrow the regulatory claim and record the limitation rather than guessing jurisdictional or procedural facts.",
    protectedGuardrailIds: [...PROTECTED_GUARDRAILS],
  },
  press_code: {
    mode: "press_code",
    label: "South African Press Code Mode",
    purpose:
      "Assess print and online journalism using the core antisemitism frameworks together with the South African Press Code.",
    sourceRuleKeys: [
      "ihra",
      "jda",
      "nexus",
      "textlens_framework",
      "press_code_sa",
    ],
    boundaryNote:
      "[TextLens Boundary Note: This analysis is an independent critique intended to support review under the South African Press Code. It is not affiliated with the Press Council and does not constitute a final adjudication.]",
    reportPositioning:
      "Separate hate/discrimination concerns from classic press-code questions such as accuracy, balance, context, fact-versus-comment and right of reply.",
    hallucinationPolicy:
      "Do not infer hidden sourcing failures, reply-right failures or inaccuracies unless the text or metadata supports those claims.",
    abstentionPolicy:
      "If a concern depends on missing context, identify the missing context and avoid converting suspicion into a code-breach claim.",
    protectedGuardrailIds: [...PROTECTED_GUARDRAILS],
  },
};

export function getModePolicy(mode: string) {
  return modePolicies[mode as keyof typeof modePolicies] ?? null;
}
