export interface CommunicationType {
  id: string;
  label: string;
  description: string;
  typicalRhetoricalFunctions: string[];
  interpretiveRisks: string;
  analysisGuidance: string;
}

export interface RhetoricalFunction {
  id: string;
  label: string;
  description: string;
  analysisGuidance: string;
}

export const communicationTypes: CommunicationType[] = [
  {
    id: "academic_article",
    label: "academic article",
    description: "Peer-reviewed papers, research manuscripts, or clinical reviews published in established scientific or sociological journals.",
    typicalRhetoricalFunctions: ["reporting", "argument", "educational explanation", "professional guidance"],
    interpretiveRisks: "May dress ideological animus or unsupported historical generalizations in clinical, technical vocabulary, utilizing scholarly authority to bypass standard reviews.",
    analysisGuidance: "Cross-reference claims with the COPE guidelines. Check if peer citations are cherry-picked or if extreme political conclusions are drawn from narrow empirical datasets."
  },
  {
    id: "editorial_commentary",
    label: "editorial or commentary",
    description: "Opinion pieces, guest columns, or editorial analyses expressing strong arguments or points of view within broad media publications.",
    typicalRhetoricalFunctions: ["argument", "advocacy", "moral appeal", "accusation"],
    interpretiveRisks: "Often utilizes highly emotive descriptions, leading adjectives, or selective timelines to establish a political argument rather than direct, objective balance.",
    analysisGuidance: "Look for structural double standards, unsourced extreme framing (such as apartheid or genocide definitions applied loose as labels), or coded classical tropes masquerading as policy debate."
  },
  {
    id: "open_letter",
    label: "open letter",
    description: "Public letters signed by groups of academics, healthcare professionals, or public figures, aimed at pressuring administrations or shifting public consensus.",
    typicalRhetoricalFunctions: ["moral appeal", "public mobilisation", "accusation", "advocacy"],
    interpretiveRisks: "Scholarly review indicates these letters often function as urgent moral mobilization documents rather than neutral, verified reports. They tend to compress complex event chains into simple urgent moral binaries, omitting historical timeline context, victims, or standard investigative uncertainties.",
    analysisGuidance: "Evaluate how signatories, collective professional identity, and institutional branding are utilized as credibility signals. Check for evidence-handling problems, scope expansion, preconditions, and authority laundering under Layer 3. Note: These features are not automatically antisemitic, but are highly relevant to rhetorical and evidentiary analysis."
  },
  {
    id: "public_petition",
    label: "public petition",
    description: "Campaign documents seeking collections of signatures to demand specific administrative boycotts, firings, policy shifts, or institutional condemnations.",
    typicalRhetoricalFunctions: ["public mobilisation", "moral appeal", "accusation", "advocacy"],
    interpretiveRisks: "Petitions compress complex events into urgent moral binaries. They frequently omit chronological order or alternative explanations, relying on maximum public mobilization and moral pressure.",
    analysisGuidance: "Assess for extreme double standards, high-pressure moral guilt-tripping, or efforts to exclude Jewish or Zionist groups from normal workspace protections under the umbrella of a moral campaign."
  },
  {
    id: "institutional_statement",
    label: "institutional statement",
    description: "Official releases or policy statements issued by corporate communications offices, university cabinets, or administrative agencies.",
    typicalRhetoricalFunctions: ["institutional positioning", "professional guidance", "reporting"],
    interpretiveRisks: "Commonly prioritizes brand safety or political alignments over robust objective evidence, sometimes adopting highly generalized external language without empirical auditing.",
    analysisGuidance: "Check if the statement applies unique double standards to its sub-groups or associates, or if it compromises academic freedom to placate external political pressures."
  },
  {
    id: "professional_society_statement",
    label: "professional society statement",
    description: "Resolutions, open consensus decrees, or policy frameworks adopted by assemblies or boards of specialized professional guilds (e.g., medical associations, academic societies).",
    typicalRhetoricalFunctions: ["professional guidance", "institutional positioning", "moral appeal", "advocacy"],
    interpretiveRisks: "Risk of leveraging the collective authority of a non-political technical profession to endorse controversial geopolitical policy positions, isolating members who disagree.",
    analysisGuidance: "Analyze if the societal statement uses professional clinical terminology to justify selective exclusions, or treats particular national identities as inherently toxic under a scientific veneer."
  },
  {
    id: "news_report",
    label: "news report",
    description: "Traditional news articles or dispatches intended to provide objective, fact-based reporting on current events and conflicts.",
    typicalRhetoricalFunctions: ["reporting"],
    interpretiveRisks: "Risk of systemic omission of context, selective quoting, failure to verify partisan allegations, or utilizing pathologizing headlines.",
    analysisGuidance: "Compare against the SA Press Code or relevant media ethics statutes. Verify that the report separates verified, demonstrated hechos from editorial allegations."
  },
  {
    id: "interview",
    label: "interview",
    description: "Transcripts or summaries recording direct conversations with academic specialists, political actors, or witnesses.",
    typicalRhetoricalFunctions: ["reporting", "argument", "advocacy"],
    interpretiveRisks: "The source's unvetted personal testimonies or highly distorted historical claims can be presented as direct facts without appropriate interviewer challenge or analytical balance.",
    analysisGuidance: "Examine if the broadcast or print structure offers immediate corrective context for demonstrably false claims, or if it functions as a megaphone for classical stereotypes."
  },
  {
    id: "broadcast_segment",
    label: "broadcast segment",
    description: "Television bulletins, radio news broadcasts, analytical podcasts, or video journalism documentaries.",
    typicalRhetoricalFunctions: ["reporting", "argument", "public mobilisation"],
    interpretiveRisks: "High risk of introducing emotive bias through selected dramatic soundtracks, graphic b-roll editing, and tone of voice without providing rigorous balance.",
    analysisGuidance: "Refer directly to the BCCSA regulatory codes. Audit whether alternative viewpoints were presented within a reasonable proximity, or if affected groups were denied immediate reply rights."
  },
  {
    id: "social_media_post",
    label: "social media post",
    description: "Short posts, graphical threads, or digital captions shared on microblogging networks or professional social channels.",
    typicalRhetoricalFunctions: ["public mobilisation", "accusation", "moral appeal", "argument"],
    interpretiveRisks: "Highly visual, compressed format that naturally maximizes moral moralization, slurs, bad-faith interpretations, and direct, overt, or coded antisemitic content.",
    analysisGuidance: "Focus immediately on Layer 1 slurs, biological dehumanization, collective guilt accusations, or online harassment campaigns designed to exclude specific populations."
  },
  {
    id: "complaint_response_letter",
    label: "complaint or response letter",
    description: "Formal correspondence sent to regulatory councils, university directors, editors, or legal representatives regarding controversial materials.",
    typicalRhetoricalFunctions: ["complaint escalation", "correction or rebuttal", "argument"],
    interpretiveRisks: "May present extremely polarized summaries to maximize administrative pressure, or conversely, could attempt to stonewall legitimate public accountability.",
    analysisGuidance: "Determine whether the complaint relies on concrete evidence (such as the specific clauses of the Press Code) or utilizes sweeping ideological accusations to silence debate."
  },
  {
    id: "conference_abstract",
    label: "conference abstract",
    description: "Brief, non-peer-reviewed proposals outlining planned research presentations at upcoming professional congresses.",
    typicalRhetoricalFunctions: ["educational explanation", "argument", "advocacy"],
    interpretiveRisks: "Often accepts speculative, non-empirical assertions at a preliminary stage to facilitate networking, occasionally smuggling in unchecked bias.",
    analysisGuidance: "Assess whether the research premise relies on standard sociological definitions or assumes highly contentious conclusions as unquestioned facts to secure presentation slots."
  },
  {
    id: "journal_issue_collection",
    label: "journal issue or themed collection",
    description: "Whole volumes or clustered special editions of peer-reviewed journals dedicated to a single theme or political issue.",
    typicalRhetoricalFunctions: ["educational explanation", "advocacy", "institutional positioning"],
    interpretiveRisks: "Risk of systematic gatekeeping, where the guest editors selectively accept papers sharing a single militant worldview, entirely locking out competing research or corrections.",
    analysisGuidance: "Examine if the issue has a balanced cross-section of academic affiliations, or if academic correction policies are systematically bypassed to protect the collection's thesis."
  },
  {
    id: "other",
    label: "other",
    description: "General or unclassified texts that do not fit standard categories but require rhetorical and standard examination.",
    typicalRhetoricalFunctions: ["reporting", "argument", "advocacy"],
    interpretiveRisks: "Varied formats that present hybrid writing styles, requiring standard custom contextual criteria.",
    analysisGuidance: "Analyze the core underlying flow of arguments against the comprehensive 3-Layer taxonomy regardless of format."
  }
];

export const rhetoricalFunctions: RhetoricalFunction[] = [
  {
    id: "reporting",
    label: "reporting",
    description: "The description or chronicling of factual occurrences, physical incidents, historical timelines, or empirical research observations.",
    analysisGuidance: "Focus on whether the chronological sequence, essential contextual facts, and alternative perspectives are reported accurately and neutrally."
  },
  {
    id: "argument",
    label: "argument",
    description: "Constructing logical connections between ideas, arguments, premises, and conclusions to persuade the reader of a specific point.",
    analysisGuidance: "Examine the validity of the evidence, whether comparisons are accurate (e.g. avoiding Nazi inversion in Layer 2), and if claims are structured fairly."
  },
  {
    id: "advocacy",
    label: "advocacy",
    description: "Consistently promoting, supporting, or campaigning for a specific civic cause, policy outcome, political stance, or human rights initiative.",
    analysisGuidance: "Distinguish legitimate human rights advocacy from systemic, exclusionary targeting of Jewish or Zionist groups from public spaces."
  },
  {
    id: "accusation",
    label: "accusation",
    description: "Directly charging specific individuals, administrative groups, states, or ethnic circles with illegal, unethical, or morally corrupt behaviors.",
    analysisGuidance: "Confirm that accusations are supported by distinct facts and targeted at conscious decision-makers, rather than ascribing collective guilt or biological dehumanization."
  },
  {
    id: "moral_appeal",
    label: "moral appeal",
    description: "Invoking deep ethical principles, values of justice, or humanitarian concerns to elicit an emotional response, solidarity, or action.",
    analysisGuidance: "Audit under Layer 3 to determine whether moral sentiment is being used to bypass verification, displace the subject, or convert contested claims into settled conclusions."
  },
  {
    id: "public_mobilisation",
    label: "public mobilisation",
    description: "Calling on populations, students, workspace members, or citizens to organize massive demonstrations, boycotts, or letters to pressure a target.",
    analysisGuidance: "Examine if the target is singled out using extreme double standards, or if mobilization tactics cross over from civic pressure into identity-based exclusion."
  },
  {
    id: "institutional_positioning",
    label: "institutional positioning",
    description: "Aligning an administration, agency, or corporation with a particular group, belief, or policy to project a positive reputation or manage risk.",
    analysisGuidance: "Check if public relations concerns lead to the adoption of sweeping, unverified bias or structural double standards against minority groups."
  },
  {
    id: "professional_guidance",
    label: "professional guidance",
    description: "Providing formal, ethical, clinical, or technical rulesets and directions for registered practitioners in a specialized guild.",
    analysisGuidance: "Ensure that clinical guidelines are applied uniformly, rather than introducing selective blockades or exclusions targeting specific national backgrounds."
  },
  {
    id: "reputational_attack",
    label: "reputational attack",
    description: "A deliberate or systematic campaign designed to damage the professional standing, credibility, or licenses of target figures or associations.",
    analysisGuidance: "Audit if the attack is weaponized with dual-loyalty accusations, classical conspiracy theories, or slurs rather than legitimate professional feedback."
  },
  {
    id: "complaint_escalation",
    label: "complaint escalation",
    description: "Formally submitting concerns to administrative regulators, tribunals, or authorities to seek official corrections, fines, or investigations.",
    analysisGuidance: "Assess if the complaint claims are grounded in distinct clauses of professional codes or are designed to silence scholarly disagreement."
  },
  {
    id: "correction_rebuttal",
    label: "correction or rebuttal",
    description: "Disputing published assertions or claims, presenting counter-arguments, logistical corrections, or empirical proofs to clear the record.",
    analysisGuidance: "Evaluate the factual rigor of the correction, verifying that it adheres to constructive debate rather than dismissing verified victimhood."
  },
  {
    id: "educational_explanation",
    label: "educational explanation",
    description: "Explaining complex scientific, sociological, historical, or legal mechanisms to educate students or general audiences.",
    analysisGuidance: "Verify that academic definitions are not watered down, and exceptions/exemptions for open, non-discriminatory debate are clearly demarcated."
  },
  {
    id: "other",
    label: "other",
    description: "Miscellaneous or hybrid rhetorical purposes that require customized evaluation.",
    analysisGuidance: "Assess the overall rhetorical effect of the wording, ensuring it doesn't serve as an undercover vehicle for animus."
  }
];
