import { sourceCatalogList } from "../../sourceCatalog";
import type { CompiledSourceRule } from "../types";

type RuleSpec = Omit<
  CompiledSourceRule,
  "sourceKey" | "sourceName" | "shortLabel" | "sourceType" | "questions" | "applicationLimits"
> & {
  extraLimits?: string[];
};

const sourceRuleSpecs: Record<string, RuleSpec> = {
  ihra: {
    section: "Core Antisemitism Frameworks",
    usageKind: "trigger",
    clausePrefixes: ["IHRA"],
    allowedModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    analyticalUse:
      "Use for classic anti-Jewish stereotypes, collective guilt, Holocaust distortion, dual loyalty and Israel-related rhetoric that reuses those forms.",
    triggerSignals: [
      "Classic anti-Jewish stereotypes or dehumanising claims",
      "Collective Jewish responsibility claims",
      "Holocaust denial, distortion or inversion",
      "Dual-loyalty accusations",
    ],
    guardrailSignals: [
      "Criticism of Israel comparable to criticism of other countries should remain protected absent added anti-Jewish content.",
    ],
    extraLimits: [
      "Treat its examples as contextual illustrations, not automatic code triggers.",
    ],
  },
  jda: {
    section: "Core Antisemitism Frameworks",
    usageKind: "guardrail",
    clausePrefixes: ["JDA"],
    allowedModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    analyticalUse:
      "Use for boundary work: identifying antisemitism while preserving open debate on Israel, Palestine, Zionism, BDS and constitutional futures.",
    triggerSignals: [
      "Speech directed at Jews as Jews",
      "Compelled denunciation, collective guilt or anti-Jewish tropes",
      "Denial of equal Jewish collective existence",
    ],
    guardrailSignals: [
      "Evidence-based criticism of Israel",
      "Opposition to Zionism as a political doctrine",
      "BDS and constitutional advocacy absent added anti-Jewish hostility",
    ],
    extraLimits: [
      "Use its protected examples actively as guardrails, not only its trigger examples.",
    ],
  },
  nexus: {
    section: "Core Antisemitism Frameworks",
    usageKind: "guardrail",
    clausePrefixes: ["NEXUS"],
    allowedModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    analyticalUse:
      "Use when rhetoric about Israel or Zionism may derive from antisemitic myths, collective guilt logic, discriminatory treatment or dual-loyalty assumptions.",
    triggerSignals: [
      "Israel-related rhetoric derived from classic antisemitic myths",
      "Jewish collective culpability or a priori guilt",
      "Jews treated as uniquely disqualified from self-determination",
    ],
    guardrailSignals: [
      "Nonviolent criticism, activism or opposition to Zionism",
      "Disproportionate attention alone is not proof of antisemitism",
    ],
    extraLimits: [
      "Do not use Nexus to convert harsh politics into antisemitism without additional evidence of anti-Jewish animus.",
    ],
  },
  bccsa_fta: {
    section: "Media & Regulatory Codes",
    usageKind: "integrity",
    clausePrefixes: ["BCCSA-FTA"],
    allowedModes: ["bccsa"],
    analyticalUse:
      "Use for free-to-air broadcasting questions on harmful content, hate speech, accuracy, context, comment, controversial issues and rights of reply.",
    triggerSignals: [
      "News presented without fair context",
      "Comment blurred into fact",
      "Reply or opposing-viewpoint deficiencies on contested public issues",
    ],
    guardrailSignals: [
      "Robust commentary is permitted when clearly marked as comment and grounded in stated facts.",
    ],
  },
  bccsa_sub: {
    section: "Media & Regulatory Codes",
    usageKind: "integrity",
    clausePrefixes: ["BCCSA-SUB"],
    allowedModes: ["bccsa"],
    analyticalUse:
      "Use for subscription broadcasting where the service produced or commissioned the relevant news or comment content.",
    triggerSignals: [
      "Produced or commissioned content lacking truthfulness, fairness or context",
      "Comment grounded in unstated or unsupported facts",
    ],
    guardrailSignals: [
      "Only apply when the service itself produced or commissioned the content in issue.",
    ],
  },
  bccsa_on: {
    section: "Media & Regulatory Codes",
    usageKind: "integrity",
    clausePrefixes: ["BCCSA-ON"],
    allowedModes: ["bccsa"],
    analyticalUse:
      "Use for online content services under a licensed broadcaster's editorial control.",
    triggerSignals: [
      "Editorially controlled online news lacking truthfulness, fairness or context",
      "Comment/public-importance handling defects under the code",
    ],
    guardrailSignals: [
      "Confirm the content falls within editorial control before applying the code.",
    ],
  },
  press_code_sa: {
    section: "Media & Regulatory Codes",
    usageKind: "integrity",
    clausePrefixes: ["PRESS"],
    allowedModes: ["press_code"],
    analyticalUse:
      "Use for South African print and online journalism on accuracy, balance, context, fact-versus-comment, corrections, discrimination and hate speech.",
    triggerSignals: [
      "Material inaccuracies or missing balance/context",
      "Opinion or allegation presented as fact",
      "Discriminatory reference or hate-speech concerns",
    ],
    guardrailSignals: [
      "Protected comment remains protected when clearly identified and grounded in material facts.",
    ],
  },
  cope: {
    section: "Academic & Publication Standards",
    usageKind: "integrity",
    clausePrefixes: ["COPE"],
    allowedModes: ["academic", "healthcare"],
    analyticalUse:
      "Use for publication ethics, peer-review integrity, editorial fairness and responsible handling of disputes or corrections.",
    triggerSignals: [
      "Editorial or peer-review process concerns",
      "Bias, discrimination or retaliation affecting publication handling",
      "Need for transparent correction or correspondence mechanisms",
    ],
    guardrailSignals: [
      "Mere disagreement with an author's politics is not itself a publication-ethics breach.",
    ],
  },
  textlens_framework: {
    section: "TextLens Working Framework",
    usageKind: "framework",
    clausePrefixes: ["TL-", "TEXTLENS"],
    allowedModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    analyticalUse:
      "Use for the TextLens-specific rhetorical taxonomy: omission patterns, asymmetrical framing, pathologizing metaphors, laundering of claims and cumulative distortion.",
    triggerSignals: [
      "Selective context or evidentiary laundering",
      "Pathologizing or dehumanising rhetorical structures",
      "Asymmetrical agency, empathy or blame assignment",
    ],
    guardrailSignals: [
      "Treat these as analytical prompts that still require textual support and restraint.",
    ],
    extraLimits: [
      "This is a TextLens working framework, not an external binding source.",
    ],
  },
  icmje_recommendations_2026: {
    section: "Academic & Publication Standards",
    usageKind: "integrity",
    clausePrefixes: ["ICMJE"],
    allowedModes: ["academic", "healthcare"],
    analyticalUse:
      "Use for medical-journal conduct, authorship, editorial independence, conflicts, corrections and responsible communication of medical claims.",
    triggerSignals: [
      "Authorship/accountability uncertainty",
      "Conflict disclosure or editorial independence concerns",
      "Advocacy or opinion blurred into research or evidence claims",
    ],
    guardrailSignals: [
      "Do not treat ICMJE as an antisemitism definition or as a legal standard.",
    ],
  },
  wame_geopolitical_intrusion_editorial_decisions: {
    section: "Academic & Publication Standards",
    usageKind: "integrity",
    clausePrefixes: ["WAME-GEO"],
    allowedModes: ["academic", "healthcare"],
    analyticalUse:
      "Use for consistency of editorial treatment and for possible geopolitical pressure intruding into editorial decisions.",
    triggerSignals: [
      "Selective editorial treatment linked to geopolitical campaigns",
      "Advocacy replacing evidence-based editorial judgement",
      "Editorial independence concerns",
    ],
    guardrailSignals: [
      "Do not infer motive where the text shows only disagreement or harsh tone.",
    ],
  },
  wame_publication_ethics_policies: {
    section: "Academic & Publication Standards",
    usageKind: "integrity",
    clausePrefixes: ["WAME-ETH"],
    allowedModes: ["academic", "healthcare"],
    analyticalUse:
      "Use for medical-journal publication ethics, professionalism, conflict disclosure and accountable journal processes.",
    triggerSignals: [
      "Conflict or accountability defects",
      "Opaque peer-review or editorial process problems",
      "Need for correction or post-publication review pathways",
    ],
    guardrailSignals: [
      "Do not use WAME to suppress legitimate academic or political disagreement.",
    ],
  },
  jama_race_ethnicity_guidance_2021: {
    section: "Health Media Standards",
    usageKind: "integrity",
    clausePrefixes: ["JAMA"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use for precision and justification when texts invoke race, ethnicity, ancestry or group identity in medical/scientific contexts.",
    triggerSignals: [
      "Essentialist or imprecise identity language",
      "Group labels used without justification or definition",
      "Identity descriptors that stigmatise or imply determinism",
    ],
    guardrailSignals: [
      "Identity categories may be used when relevant, defined and justified.",
    ],
  },
  schwitzer_health_journalism_500_stories_2008: {
    section: "Health Media Standards",
    usageKind: "integrity",
    clausePrefixes: ["SCHWITZER"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use for public-facing health journalism quality questions such as benefits, harms, costs, alternatives and source conflicts.",
    triggerSignals: [
      "Benefits/harms or evidence quality not responsibly explained",
      "Exaggeration or disease-mongering patterns",
    ],
    guardrailSignals: [
      "Apply sparingly; it is a quality-study framework rather than a primary standards source.",
    ],
    extraLimits: [
      "Not currently used in the active healthcare mode policy.",
    ],
  },
  ahcj_health_journalism_principles: {
    section: "Health Media Standards",
    usageKind: "integrity",
    clausePrefixes: ["AHCJ"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use for public-facing health journalism on independence, source transparency, conflicts, context, uncertainty and avoidance of sensationalism.",
    triggerSignals: [
      "Context, source transparency or proportionality problems in health journalism",
      "Sensational framing likely to mislead the public",
    ],
    guardrailSignals: [
      "Use as journalism guidance, not as a substitute for medical-journal ethics standards.",
    ],
  },
  icrc_customary_ihl_rule_1: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE1-", "IHL-RULE1_", "RULE1"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for terminology and criteria-mapping around distinction between civilians and combatants.",
    triggerSignals: [
      "Civilians and combatants collapsed into one category",
      "Protected status asserted without clarifying whether the claim is factual, legal or rhetorical",
    ],
    guardrailSignals: [
      "Do not turn civilian-harm reporting alone into a legal conclusion.",
    ],
  },
  icrc_customary_ihl_rule_7: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE7-", "IHL-RULE7_", "RULE7"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for terminology and criteria-mapping around civilian objects, military objectives and alleged dual-use status.",
    triggerSignals: [
      "Object status assumed rather than explained",
      "Direct attack and incidental damage treated as the same claim",
    ],
    guardrailSignals: [
      "Do not treat damage alone as proof of illegality.",
    ],
  },
  icrc_customary_ihl_rule_14: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE14-", "IHL-RULE14_", "RULE14"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for precise handling of proportionality terminology.",
    triggerSignals: [
      "Proportionality used as a synonym for casualty imbalance",
      "Expected harm and anticipated military advantage not distinguished",
    ],
    guardrailSignals: [
      "Do not infer disproportionality from casualty numbers alone.",
    ],
  },
  icrc_customary_ihl_rule_15: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE15-", "IHL-RULE15_", "RULE15"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for careful framing of precautions, warnings, mitigation and feasibility.",
    triggerSignals: [
      "Outcome criticism collapsed into a precautions claim",
      "Feasibility or available information left undefined",
    ],
    guardrailSignals: [
      "Do not declare a failure of precautions without identifying the relevant alleged precaution and evidentiary basis.",
    ],
  },
  icrc_customary_ihl_rule_25: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE25-", "IHL-RULE25_", "RULE25"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for careful handling of medical personnel status, duties and allegations of attack or obstruction.",
    triggerSignals: [
      "Medical personnel and combatants blurred together",
      "Loss of protected status asserted without clarifying the basis",
    ],
    guardrailSignals: [
      "Do not treat ordinary medical work or treatment of wounded fighters as hostile conduct by itself.",
    ],
  },
  icrc_customary_ihl_rule_28: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["IHL-RULE28-", "IHL-RULE28_", "RULE28"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use only for careful handling of hospitals, ambulances and other medical-unit status.",
    triggerSignals: [
      "Medical-unit status asserted without evidentiary qualification",
      "Alleged misuse or warning requirements ignored or overstated",
    ],
    guardrailSignals: [
      "Do not declare an attack lawful or unlawful; assess only whether the article uses the concepts precisely.",
    ],
  },
  icrc_health_care_in_danger_making_case: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["ICRC-HCID"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use for healthcare-in-conflict framing: violence against care, access disruption, attacks on facilities and secondary humanitarian effects.",
    triggerSignals: [
      "Healthcare suffering used rhetorically without factual grounding",
      "Affected groups or types of harm described imprecisely",
    ],
    guardrailSignals: [
      "Use for framing and terminology, not legal adjudication.",
    ],
  },
  icrc_healthcare_personnel_responsibilities_conflict: {
    section: "Healthcare & International Humanitarian Law Sources",
    usageKind: "terminology",
    clausePrefixes: ["ICRC-RESP"],
    allowedModes: ["healthcare"],
    analyticalUse:
      "Use for the duties and rights of health-care personnel in conflict, including neutrality, confidentiality, records, disclosure dilemmas and media contact.",
    triggerSignals: [
      "Medical neutrality or staff duties described inaccurately",
      "Professional responsibilities collapsed into political obligations",
    ],
    guardrailSignals: [
      "Keep ethical, professional, factual and legal claims distinct.",
    ],
  },
  cse_publication_ethics_white_paper: {
    section: "Academic & Publication Standards",
    usageKind: "integrity",
    clausePrefixes: ["CSE-"],
    allowedModes: ["academic", "healthcare"],
    analyticalUse:
      "Use for stewardship of the scientific record, including corrections, retractions, expressions of concern, authorship and peer-review integrity.",
    triggerSignals: [
      "Need for correction or concern mechanisms",
      "Peer-review or authorship integrity problems",
      "Scientific-record responsibility concerns",
    ],
    guardrailSignals: [
      "Use for publication integrity, not as a standalone antisemitism source.",
    ],
  },
};

export const sourceRules: CompiledSourceRule[] = sourceCatalogList.map((item) => {
  const spec = sourceRuleSpecs[item.sourceKey];

  if (!spec) {
    throw new Error(`Missing compiled source rule spec for ${item.sourceKey}`);
  }

  const applicationLimits = Array.from(
    new Set([...(spec.extraLimits || []), item.limitations].filter(Boolean))
  );

  return {
    sourceKey: item.sourceKey,
    sourceName: item.sourceName,
    shortLabel: item.shortLabel,
    sourceType: item.sourceType,
    section: spec.section,
    usageKind: spec.usageKind,
    clausePrefixes: spec.clausePrefixes,
    allowedModes: spec.allowedModes,
    analyticalUse: spec.analyticalUse,
    questions: item.keyCriteria || [],
    triggerSignals: spec.triggerSignals,
    guardrailSignals: spec.guardrailSignals,
    applicationLimits,
  };
});

export const sourceRuleByKey = new Map(sourceRules.map((rule) => [rule.sourceKey, rule]));
