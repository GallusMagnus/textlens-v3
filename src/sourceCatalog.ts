export interface SourceCatalogItem {
  sourceKey: string;
  sourceName: string;
  sourceType: string;
  shortLabel: string;
  whyIncluded: string;
  url: string;
  notes: string;
  doi?: string;
  appliesToModes?: string[];
  role?: string;
  summary?: string;
  keyCriteria?: string[];
  limitations?: string;
}

export const sourceCatalogList: SourceCatalogItem[] = [
  {
    sourceKey: "ihra",
    sourceName: "IHRA Working Definition of Antisemitism",
    sourceType: "Working Definition",
    shortLabel: "IHRA Working Definition",
    whyIncluded: "Widely adopted working definition used by governments, universities, and institutions for monitoring, education, and policy guidance, especially where classic anti-Jewish motifs are expressed through Israel-related language.",
    url: "https://www.holocaustremembrance.com/resources/working-definitions-charters/working-definition-antisemitism",
    notes: "Important both for its trigger examples and for its explicit context caveat that criticism of Israel similar to that leveled against any other country cannot be regarded as antisemitic.",
    role: "Widely used working definition for antisemitism monitoring, education, and context-sensitive Israel-related analysis.",
    summary: "Use for classic anti-Jewish stereotypes, conspiratorial allegations, collective responsibility claims, Holocaust denial or distortion, dual-loyalty claims, and Israel-related rhetoric that uses these forms. Keep the source's context note in view when evaluating criticism of Israel.",
    keyCriteria: [
      "Are classic anti-Jewish stereotypes, conspiracy claims, or dehumanizing allegations present?",
      "Are Jews being held collectively responsible for the actions of Israel or of individual Jews?",
      "Are there Holocaust denial, minimization, invention, or exaggeration claims?",
      "Are dual-loyalty accusations, Nazi analogies, or classic antisemitic symbols being applied?",
      "Is criticism of Israel being treated as antisemitic even though it is similar to criticism leveled against other countries?"
    ],
    limitations: "IHRA is non-legally binding and its examples are contextual illustrations rather than a code. It should not be used to label all criticism of Israel antisemitic."
  },
  {
    sourceKey: "jda",
    sourceName: "Jerusalem Declaration on Antisemitism",
    sourceType: "Scholarly Declaration",
    shortLabel: "Jerusalem Declaration",
    whyIncluded: "Developed by international scholars to clarify antisemitism while also protecting open debate on Israel, Palestine, Zionism, and related political questions.",
    url: "https://jerusalemdeclaration.org/",
    notes: "Especially valuable for boundary work because it provides both examples that are on their face antisemitic and examples that are on their face not antisemitic.",
    role: "Scholarly interpretive framework for identifying antisemitism while preserving open political debate.",
    summary: "Use to assess whether speech targets Jews as Jews, relies on classical antisemitic tropes, imposes collective responsibility or compelled denunciation, or denies equal Jewish collective existence, while also protecting evidence-based criticism of Israel, constitutional advocacy, BDS, and harsh political speech that is not in itself antisemitic.",
    keyCriteria: [
      "Is the expression directed at Jews as Jews or at Jewish institutions as Jewish?",
      "Are classical antisemitic tropes, conspiracy claims, or coded evil narratives being used?",
      "Are Jews being treated as agents of Israel, collectively blamed, or forced to disavow Israel or Zionism?",
      "Is the speech denying Jews in Israel the right to exist and flourish in equality?",
      "Or is the speech better understood as evidence-based criticism of Israel, opposition to Zionism, constitutional advocacy, BDS, or harsh but protected political speech?"
    ],
    limitations: "JDA is non-legally binding and expressly distinguishes between antisemitic speech and merely unreasonable, excessive, or contentious political speech. Context and judgment remain essential."
  },
  {
    sourceKey: "nexus",
    sourceName: "The Nexus Document: Understanding Antisemitism at its Nexus with Israel and Zionism",
    sourceType: "Policy Guidance Framework",
    shortLabel: "Nexus Document",
    whyIncluded: "Designed as a guide for policymakers and community leaders dealing with the overlap between antisemitism, Israel, and Zionism, with explicit attention to both genuine antisemitic patterns and overreach risks.",
    url: "https://www.israelantisemitismnexus.org/",
    notes: "Useful when the question is whether rhetoric about Israel or Zionism actually derives from antisemitic myths, collective guilt logic, or discriminatory treatment, as distinct from harsh or disproportionate but non-antisemitic criticism.",
    role: "Policy-facing framework for distinguishing antisemitic Israel-related rhetoric from protected criticism and activism.",
    summary: "Use to assess whether Israel- or Zionism-related speech derives from antisemitic myths, stereotypes, collective culpability, dual-loyalty logic, or discriminatory denial of Jewish self-determination, while preserving nonviolent criticism, opposition to Zionism, and disproportionate attention to Israel when additional evidence of antisemitic animus is absent.",
    keyCriteria: [
      "Does rhetoric about Zionism or Israel derive from antisemitic myths or stereotypes?",
      "Are Jews presumed collectively guilty, a priori culpable, or incapable of setting aside loyalty to Israel?",
      "Is Israel being treated differently solely because it is a Jewish state, or are Jews alone being denied peoplehood or self-determination?",
      "Is hostility toward Jews connected to Israel being expressed in ways that risk or provoke violence?",
      "Or is the conduct better understood as nonviolent criticism, opposition, activism, or disproportionate attention that is not by itself proof of antisemitism?"
    ],
    limitations: "Nexus is guidance, not a binding legal definition. It explicitly warns that harsh criticism of Israel, opposition to Zionism, and disproportionate attention to Israel are not in themselves proof of antisemitism."
  },
  {
    sourceKey: "bccsa_fta",
    sourceName: "BCCSA Free-to-Air Code of Conduct for Broadcasting Service Licensees",
    sourceType: "Regulatory Broadcast Code",
    shortLabel: "BCCSA FTA",
    whyIncluded: "Regulatory standard governing free-to-air broadcasting in South Africa, including harmful-content restrictions, news accuracy, comment, controversial issues, and privacy.",
    url: "https://bccsa.co.za/",
    notes: "Important for both content restrictions and the structure of fair broadcasting: correct context, rectification, honest comment, opposing viewpoints, and rights of reply.",
    role: "Broadcasting regulator standard for public protections on hate speech and accuracy.",
    summary: "Use for free-to-air broadcasting in South Africa, especially violence and hate-speech restrictions, truthful and contextual news, rectification, honest comment, controversial issues, and right of reply.",
    keyCriteria: [
      "Is news presented in the correct context and in a fair manner?",
      "Is comment clearly distinguished from fact?",
      "Were opposing viewpoints fairly presented on a controversial issue of public importance?",
      "Was a right of reply or reasonable opportunity to respond provided where required?"
    ],
    limitations: "Applicable under broadcasting jurisdictions only."
  },
  {
    sourceKey: "bccsa_sub",
    sourceName: "BCCSA Code of Conduct for Subscription Broadcasting Service Licensees",
    sourceType: "Regulatory Broadcast Code",
    shortLabel: "BCCSA Subscription",
    whyIncluded: "Governs subscription broadcasting services, including harmful content, classification and parental controls, and special rules for any news or public-importance comment produced or commissioned by the service.",
    url: "https://bccsa.co.za/",
    notes: "Unlike the free-to-air code, the news/comment provisions are expressly tied to content the subscription service has produced or commissioned.",
    role: "Subscription carrier regulator code of conduct on verification and hate speech rules.",
    summary: "Use for subscription broadcasters, especially harmful-content restrictions, classifications and parental controls, and truthful, contextual news and comment where the service produces or commissions that content.",
    keyCriteria: [
      "If the service produced or commissioned the content, is news truthful, accurate, fair, and properly contextualized?",
      "Is comment clearly presented as comment and grounded in stated facts?",
      "Were opposing viewpoints and rights of reply handled fairly on controversial issues of public importance?",
      "Does the service comply with harmful-content and parental-control obligations?"
    ],
    limitations: "Limited to subscription service operators."
  },
  {
    sourceKey: "bccsa_on",
    sourceName: "BCCSA Code of Conduct for Online Content Services for Licensed Broadcasters",
    sourceType: "Regulatory Broadcast Code",
    shortLabel: "BCCSA Online",
    whyIncluded: "Code governing online content services under the editorial control of licensed broadcasters, including harmful content, advisories, news, comment, controversial issues, and privacy.",
    url: "https://bccsa.co.za/",
    notes: "This code covers online content under the signatory's editorial control and explicitly excludes social media content and user-generated content outside that editorial control.",
    role: "Editorial-control code for licensed broadcasters’ online content services.",
    summary: "Use for online streaming or on-demand content under a licensed broadcaster’s editorial control, especially harmful content, advisories, truthful and contextual news, comment, controversial issues, and privacy.",
    keyCriteria: [
      "Is the content within the signatory’s editorial control and therefore actually covered by the code?",
      "Is news truthful, accurate, fair, and properly contextualized?",
      "Is comment clearly presented as comment and grounded in indicated facts?",
      "Were opposing viewpoints and rights of reply handled fairly on controversial public issues?"
    ],
    limitations: "Only covers digital platforms operated by registered South African broadcasting houses."
  },
  {
    sourceKey: "press_code_sa",
    sourceName: "Code of Ethics and Conduct for South African Print and Online Media",
    sourceType: "Press Council Regulatory Statute",
    shortLabel: "Press Code SA",
    whyIncluded: "Codified Press Council standard governing print and online journalism in South Africa, including accuracy, fairness, corrections, discrimination, hate speech, and protected comment.",
    url: "https://presscouncil.org.za/",
    notes: "Useful both for formal code obligations such as accuracy, context, right of reply, and corrections, and for understanding the code's explicit protection of robust comment on matters of public interest.",
    role: "Self-regulatory ethical model for the South African print and digital press.",
    summary: "Use for print and online journalism in South Africa, especially accuracy, balance, fact-versus-comment, right of reply, corrections, discriminatory references, hate speech, and protected comment.",
    keyCriteria: [
      "Is news reported truthfully, accurately, and fairly in its balanced context?",
      "Are opinions, allegations, and rumors clearly separated from statements of fact?",
      "Was the subject of critical reportage given a reasonable opportunity to respond where practicable?",
      "Does the piece cross from robust comment into hate speech or discriminatory reference?",
      "Is comment clearly presented as comment and grounded in material facts?"
    ],
    limitations: "Lacks statutory penal authority; functions as a professional Ombudsman-driven dispute resolution venue."
  },
  {
    sourceKey: "cope",
    sourceName: "COPE Core Practices for Journal Publishing",
    sourceType: "Scholastic Ethical Standard",
    shortLabel: "COPE Core Practices",
    whyIncluded: "Drafted by the Committee on Publication Ethics to guide scholarly editors and protect research from political animus, bias, or unverified claims.",
    url: "https://publicationethics.org/core-practices",
    notes: "Demands reproducibility, peer review integrity, and transparent dispute/retraction mechanisms when published manuscripts present biased narratives.",
    role: "International publishing ethics standard for scientific and academic publications.",
    summary: "A global framework of core practices enabling journal editors, publishers, and peer reviewers to preserve research integrity.",
    keyCriteria: [
      "Are academic critiques or disputes handled via transparent, respectful correspondence?",
      "Is the peer review process insulated from ideological tests or national discrimination?"
    ],
    limitations: "Excludes direct, specific legal or political criteria on ethnic minority discrimination."
  },
  {
    sourceKey: "textlens_framework",
    sourceName: "TextLens Rhetorical Analysis Framework",
    sourceType: "Cognitive Rhetorical Guidelines",
    shortLabel: "TextLens Framework",
    whyIncluded: "Linguistic and rhetorical ruleset designed to identify evidence handling problems, asymmetrical framing, category conflation, precondition-setting, immunity moves, and authority laundering.",
    url: "https://ai.studio/build",
    notes: "Useful for locating argumentative structures that distort interpretation even when the text stops short of direct antisemitic content.",
    role: "Layer 3 rhetorical and evidentiary taxonomy for evidence handling, framing, agency, conflation, counter-attack, and authority effects.",
    summary: "A structured Layer 3 taxonomy identifying rhetorical and evidentiary patterns that can distort interpretation on contested political and humanitarian questions.",
    keyCriteria: [
      "Are key claims verified, attributed, and contextualised rather than stated as moral certainty or settled fact?",
      "Do language, agency, and framing choices steer the reader toward a verdict without showing the evidentiary bridge?",
      "Are Jews, Israelis, Zionists, institutions, governments, and populations kept distinct rather than conflated?"
    ],
    limitations: "Represents an analytical research framework, not a legally binding statute."
  },
  {
    sourceKey: "icmje_recommendations_2026",
    sourceName: "ICMJE Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals",
    sourceType: "Scholastic Ethical Standard",
    shortLabel: "ICMJE Recommendations",
    whyIncluded: "The central framework defining author responsibilities, conflicts of interest, editorial independence, and scientific dispute mechanisms in medical scholarship.",
    url: "https://www.icmje.org/icmje-recommendations.pdf",
    notes: "Critical for evaluating scientific rigor, accountability, and the separation of opinion or activism from evidence in biomedical literature.",
    role: "Medical-journal ethics and editorial standards.",
    summary: "Use for medical-journal conduct, reporting, editing and publication standards, including authorship, contributor responsibility, conflicts of interest, peer review, editorial freedom, corrections, scientific misconduct, correspondence, supplements/theme issues, sponsorship, journals and the media, clinical trials and AI use in publishing.",
    keyCriteria: [
      "Is the publication type clear?",
      "Are author roles and accountability clear?",
      "Are financial and non-financial conflicts disclosed?",
      "Is editorial independence protected?",
      "Are corrections, correspondence or right-of-reply mechanisms relevant?",
      "Are sponsorship, partnership, supplement or theme-issue issues relevant?",
      "Is media/public communication of medical claims handled responsibly?",
      "Is advocacy or opinion clearly distinguished from research or evidence?"
    ],
    limitations: "Do not treat ICMJE as an antisemitism standard or as a legal standard."
  },
  {
    sourceKey: "wame_geopolitical_intrusion_editorial_decisions",
    sourceName: "WAME Geopolitical Intrusion on Editorial Decisions",
    sourceType: "Scholastic Ethical Policy",
    shortLabel: "WAME Geopolitical Intrusion",
    whyIncluded: "Guidelines preventing peer-review procedures, editing choices, and global healthcare politics from being compromised by geopolitical campaigns or selective bias.",
    url: "https://wame.org/policies",
    notes: "Helps audit medical journal issues for selective treatment, geopolitical pressures, or activism masquerading as editorial decisions.",
    role: "Medical-editorial independence and protection from geopolitical pressure or selective editorial treatment.",
    summary: "Use to assess whether geopolitical considerations, pressure, selective institutional commitments or political campaigns may be intruding on medical-editorial decision-making.",
    keyCriteria: [
      "Is the journal or editor applying editorial standards consistently?",
      "Is there evidence of political or geopolitical pressure affecting editorial decisions?",
      "Is advocacy being presented as editorial or scientific judgement?",
      "Are opposing or affected parties given fair opportunity for reply where appropriate?",
      "Is editorial independence preserved?",
      "Is global-health language being used as a substitute for evidence or editorial reasoning?"
    ],
    limitations: "Use as an editorial-integrity source, not as proof of motive."
  },
  {
    sourceKey: "wame_publication_ethics_policies",
    sourceName: "WAME Publication Ethics Policies for Medical Journals",
    sourceType: "Scholastic Ethical Policy",
    shortLabel: "WAME Publication Ethics",
    whyIncluded: "Comprehensive policy code covering medical editor conduct, transparency in peer review, and accountability of authorship inputs.",
    url: "https://wame.org/policies",
    notes: "Guarantees accountability of publications and outlines editor duties for correcting biased, flawed, or redundant studies.",
    role: "Medical-journal publication ethics, professionalism, conflict of interest and editorial conduct.",
    summary: "Use for medical-editor conduct, conflicts of interest, publication ethics, peer-review integrity, editorial independence, professionalism and journal accountability.",
    keyCriteria: [
      "Are conflicts of interest disclosed?",
      "Is peer review or editorial status clear?",
      "Is there a publication-ethics concern rather than mere disagreement?",
      "Are journal processes transparent?",
      "Are authors and editors accountable for claims made?",
      "Are corrections or post-publication review mechanisms relevant?"
    ],
    limitations: "Do not use WAME to suppress legitimate political or academic disagreement."
  },
  {
    sourceKey: "jama_race_ethnicity_guidance_2021",
    sourceName: "Updated guidance on the reporting of race and ethnicity in medical and science journals",
    sourceType: "Scholastic Reporting Guidelines",
    shortLabel: "JAMA Race/Ethnicity Guidance",
    whyIncluded: "Mandatory standard for ensuring precise, context-justified, and non-essentialist language when using racial or ethnic group descriptors.",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2783090",
    doi: "https://doi.org/10.1001/jama.2021.13304",
    notes: "Essential for detecting broad generalizations, essentialist categorizations, or political demographics being cited without scientific grounding.",
    role: "Identity-language precision in medical and scientific writing.",
    summary: "Use for assessing whether race, ethnicity, ancestry, population identity or group descriptors are defined, justified, specific and non-essentialist.",
    keyCriteria: [
      "Are identity categories clearly defined?",
      "Is the reason for using the category explained?",
      "Are categories self-reported or assigned?",
      "Is language precise rather than essentialist?",
      "Are broad categories used in a way that obscures diversity?",
      "Are identity labels relevant to the claim being made?",
      "Is group identity used in a way that may stigmatise or imply biological/social determinism without evidence?"
    ],
    limitations: "This source is about identity-language precision, not antisemitism classification by itself."
  },
  {
    sourceKey: "schwitzer_health_journalism_500_stories_2008",
    sourceName: "How Do US Journalists Cover Treatments, Tests, Products, and Procedures? An Evaluation of 500 Stories",
    sourceType: "Media Ethics Research Paper",
    shortLabel: "Schwitzer PLOS Med 2008",
    whyIncluded: "Pioneering evaluation establishing rigorous quality metrics for health and medical journalism published for the public audience.",
    url: "https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0050095",
    notes: "Requires stories to quantify benefits and harms, avoid commercial/political exaggeration, and use independent credentialed sources.",
    role: "Health-journalism quality and completeness.",
    summary: "Use for public-facing health journalism or medical news quality, especially whether stories quantify benefits and harms, discuss costs, alternatives, evidence quality and source conflicts, and avoid exaggeration.",
    keyCriteria: [
      "Are benefits quantified?",
      "Are harms quantified?",
      "Are costs discussed where relevant?",
      "Are alternatives discussed?",
      "Is the quality of evidence explained?",
      "Are independent sources used?",
      "Are source conflicts disclosed?",
      "Is disease-mongering or exaggeration present?",
      "Are absolute and relative risks handled responsibly?"
    ],
    limitations: "Primarily applies to public-facing health journalism, not all scholarly articles."
  },
  {
    sourceKey: "ahcj_health_journalism_principles",
    sourceName: "Statement of Principles of the Association of Health Care Journalists",
    sourceType: "Journalistic Ethics Charter",
    shortLabel: "AHCJ Principles",
    whyIncluded: "Voluntary code framing accuracy, transparency of sources, independence, and avoiding sensationalism in consumer health reporting.",
    url: "https://healthjournalism.org/about-us/principles/",
    notes: "Serves as an extra standard evaluating accuracy, contextual truthfulness, and avoidence of political or commercial conflicts.",
    role: "Health-journalism standards for independence, accuracy, context and public accountability.",
    summary: "Use for public-facing health journalism, including accuracy, independence, source transparency, conflicts of interest, context, avoidance of sensationalism and public-service responsibilities.",
    keyCriteria: [
      "Are sources credible and transparent?",
      "Are conflicts disclosed?",
      "Is the reporting independent?",
      "Is context provided?",
      "Are claims presented accurately and proportionately?",
      "Is uncertainty acknowledged?",
      "Is the public likely to be misled by framing or omission?"
    ],
    limitations: "Use as journalism guidance, not as a binding medical-journal publication ethics standard."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_1",
    sourceName: "ICRC Customary IHL Rule 1 — Distinction between Civilians and Combatants",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 1 (Civilians)",
    whyIncluded: "Foundational distinction rule in armed conflict. Included to test whether reporting keeps civilian status, combatant status, and attack attribution analytically distinct.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule1",
    notes: "Focus on whether the article preserves the source's core distinction rule instead of collapsing civilians, armed actors, and collective identities into one frame.",
    role: "Conflict-law terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether references to civilians, combatants, direct attack, and protected status are terminologically careful and responsibly attributed.",
    keyCriteria: [
      "Does the article distinguish civilians from combatants?",
      "Does it avoid collapsing civilians, fighters, supporters, and broader populations into one category?",
      "Does it separate civilian harm from legal conclusions about unlawful attack?",
      "Does it signal when civilian status is alleged, contested, or qualified?",
      "Does it explain whether a claim is factual, legal, moral or rhetorical?",
      "Are allegations distinguished from findings?"
    ],
    limitations: "TextLens does not decide whether attacks were lawful or unlawful. It may only assess whether the article distinguishes civilian status, combatant status, allegations, and asserted legal conclusions with sufficient care."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_7",
    sourceName: "ICRC Customary IHL Rule 7 — Distinction between Civilian Objects and Military Objectives",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 7 (Civilian Objects)",
    whyIncluded: "Rule governing distinction between civilian objects and military objectives. Included to test whether damage to infrastructure, hospitals, or public buildings is described with status precision rather than rhetorical assumption.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule7",
    notes: "Useful for distinguishing direct attack claims from collateral-damage claims and for checking whether the basis for describing an object as civilian or military is actually supplied.",
    role: "Conflict-law terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether references to civilian objects, military objectives, hospitals, infrastructure, and alleged dual-use status are precise and appropriately qualified.",
    keyCriteria: [
      "Does the article distinguish civilian objects from military objectives?",
      "Does it explain the basis for calling an object civilian, military, or dual-use?",
      "Does it distinguish direct attack on an object from incidental damage flowing from an attack on a military objective?",
      "Does it acknowledge uncertainty where the status of an object is contested?",
      "Does it avoid treating object damage alone as proof of illegality?"
    ],
    limitations: "TextLens does not decide whether a structure was a lawful target. It may only assess whether the article explains or assumes object status, attribution, contested facts, and the distinction between direct attack and incidental damage."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_14",
    sourceName: "ICRC Customary IHL Rule 14 — Proportionality in Attack",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 14 (Proportionality)",
    whyIncluded: "Rule prohibiting attacks expected to cause excessive incidental civilian harm relative to the concrete and direct military advantage anticipated. Included to stop proportionality language from being used as a loose synonym for casualty imbalance alone.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule14",
    notes: "Useful for checking whether the article preserves the rule's ex ante structure and avoids turning a legal standard into a purely retrospective moral shorthand.",
    role: "Conflict-law terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether proportionality is used as a legal term tied to expected incidental civilian harm and anticipated concrete and direct military advantage, rather than to casualty counts alone.",
    keyCriteria: [
      "Does the article define proportionality or use it loosely?",
      "Does it distinguish civilian harm from legal disproportionality?",
      "Does it avoid inferring disproportionality from casualty numbers alone?",
      "Does it reflect that the rule is framed around expected harm and anticipated advantage at the time of attack?",
      "Does it distinguish allegation, expert opinion and legal finding?",
      "Does it recognise that proportionality usually turns on expected civilian harm in relation to anticipated concrete and direct military advantage, assessed in context?"
    ],
    limitations: "TextLens does not decide whether an attack was proportionate or disproportionate. It may only assess whether the article uses the term precisely, identifies the relevant criteria, and avoids overstating what the available facts can prove."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_15",
    sourceName: "ICRC Customary IHL Rule 15 — Precautions in Attack",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 15 (Precautions)",
    whyIncluded: "Rule requiring constant care and all feasible precautions to avoid or minimize incidental civilian harm. Included to test whether reporting on warnings, evacuation, intelligence, and mitigation is careful rather than result-driven.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule15",
    notes: "Helps separate outcome-based criticism from claims about what precautions were practically possible and what information was available at the time.",
    role: "Conflict-law terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether claims about constant care, feasible precautions, warnings, evacuation, target verification, and failure to protect civilians are framed carefully.",
    keyCriteria: [
      "Does the article discuss precautions separately from outcomes?",
      "Does it distinguish failure of outcome from failure to take precautions?",
      "Does it indicate what precautions were allegedly feasible at the time?",
      "Does it indicate what information or intelligence was available, missing, or disputed?",
      "Does it identify evidence for or against precautions?",
      "Does it distinguish allegation from finding?"
    ],
    limitations: "TextLens does not decide whether legally sufficient precautions were or were not taken. It may only assess whether the article identifies, omits, assumes, or overstates information relevant to precaution analysis."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_25",
    sourceName: "ICRC Customary IHL Rule 25 — Medical Personnel",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 25 (Medical Personnel)",
    whyIncluded: "Rule protecting medical personnel exclusively assigned to medical duties. Included to test whether clinicians, medics, aid staff, and other health workers are described with proper protected-status precision.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule25",
    notes: "Useful for checking exclusive medical assignment, allegations of hostile conduct, and whether reporting overstates the conditions under which protection is lost.",
    role: "Healthcare-in-conflict terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether references to medical personnel in conflict are precise, whether protected status is described carefully, and whether allegations of attacks, obstruction, or loss of protection are properly attributed.",
    keyCriteria: [
      "Does the article distinguish healthcare personnel from combatants or political actors?",
      "Does it indicate whether the personnel are described as exclusively assigned to medical duties?",
      "Does it accurately describe protected medical status and its limits?",
      "Are claims of attack, obstruction or targeting attributed and evidenced?",
      "Does it avoid treating ordinary medical work, treatment of enemy wounded, or defensive light arms as hostile conduct?",
      "Are exceptions or contested facts acknowledged where relevant?"
    ],
    limitations: "TextLens does not decide whether particular personnel retained or lost protected status. It may only assess whether the article describes medical assignment, alleged hostile acts, attribution, and contested facts with sufficient precision."
  },
  {
    sourceKey: "icrc_customary_ihl_rule_28",
    sourceName: "ICRC Customary IHL Rule 28 — Medical Units",
    sourceType: "Customary IHL Rule",
    shortLabel: "IHL Rule 28 (Medical Units)",
    whyIncluded: "Rule protecting medical units exclusively assigned to medical purposes. Included to test whether hospitals, clinics, ambulances, depots, and similar facilities are described with protected-status precision.",
    url: "https://ihl-databases.icrc.org/en/customary-ihl/v1/rule28",
    notes: "Useful for checking alleged misuse, shielding, military use, warning requirements, and the distinction between medical units and other civilian infrastructure.",
    role: "Healthcare-in-conflict terminology and criteria-mapping guardrail only.",
    summary: "Use only to assess whether references to hospitals, clinics, ambulances, depots, and other medical units are precise, and whether their protected status and any alleged loss of protection are appropriately qualified.",
    keyCriteria: [
      "Does the article distinguish medical units from other civilian infrastructure?",
      "Does it describe protected medical status and humanitarian function carefully?",
      "Are claims of attack, misuse, loss of protection or military use attributed and evidenced?",
      "Does it acknowledge that some facts, such as arms held for defense or the presence of wounded combatants, do not by themselves remove protection?",
      "Does it note warning or reasonable time-limit requirements where relevant?",
      "Are contested facts or uncertainty acknowledged?"
    ],
    limitations: "TextLens does not decide whether a particular attack on a medical unit was lawful or unlawful. It may only assess whether the article distinguishes protected status, alleged misuse, warning requirements, military-objective claims, and contested facts with sufficient precision."
  },
  {
    sourceKey: "icrc_health_care_in_danger_making_case",
    sourceName: "ICRC Health Care in Danger: Making the Case",
    sourceType: "Humanitarian Advocacy Report",
    shortLabel: "ICRC Health Care in Danger",
    whyIncluded: "ICRC report documenting violence against health care, attacks on facilities and ambulances, impediments to access, and the wider humanitarian consequences of disruption to care.",
    url: "https://www.icrc.org/en/publication/4072-health-care-danger-making-case",
    notes: "Useful for understanding both direct attacks on health care and the secondary effects of insecurity, displacement, shortages, and interrupted access.",
    role: "Healthcare-in-conflict framing and terminology.",
    summary: "Use for violence against health care, including attacks on facilities, ambulances, personnel and patients, obstruction of access, and the disruption of health-care delivery during conflict or unrest.",
    keyCriteria: [
      "Are attacks or obstruction of healthcare clearly described?",
      "Are affected groups identified precisely?",
      "Is healthcare access discussed with adequate context?",
      "Are claims attributed and evidenced?",
      "Are the secondary effects on communities, staffing, supplies, or continuity of care acknowledged?",
      "Is healthcare suffering used rhetorically without adequate factual grounding?"
    ],
    limitations: "Use for healthcare-in-conflict framing and criteria mapping; do not make legal findings."
  },
  {
    sourceKey: "icrc_healthcare_personnel_responsibilities_conflict",
    sourceName: "ICRC Responsibilities of Health-Care Personnel Working in Armed Conflicts and Other Emergencies",
    sourceType: "Humanitarian Ethical Code",
    shortLabel: "ICRC Staff Responsibilities",
    whyIncluded: "Defines the responsibilities and rights of health-care personnel in armed conflicts and other emergencies, including ethics, neutrality, confidentiality, records, media, and witnessing violations.",
    url: "https://www.icrc.org/en/publication/4073-responsibilities-health-care-personnel-working-armed-conflicts-and-other-emergencies",
    notes: "Useful for separating legal, ethical, and professional duties from rhetorical claims about what health-care personnel must do or may refuse to do.",
    role: "Healthcare personnel responsibilities, medical neutrality and conflict settings.",
    summary: "Use for the duties and rights of health-care personnel in conflict and emergencies, including impartial care, medical neutrality, protection, confidentiality, records, disclosure dilemmas, media contact, and witnessing violations.",
    keyCriteria: [
      "Are healthcare personnel duties described accurately?",
      "Is medical neutrality used precisely?",
      "Are professional responsibilities separated from political claims?",
      "Are patient-care duties and security constraints distinguished?",
      "Are confidentiality, record-keeping, and disclosure dilemmas handled accurately?",
      "Are claims about what medical personnel may be compelled to do, refuse to do, or report described carefully?",
      "Is the article clear about whether it is making ethical, professional, factual or legal claims?"
    ],
    limitations: "Use as professional and humanitarian guidance, not as a legal adjudication source."
  },
  {
    sourceKey: "cse_publication_ethics_white_paper",
    sourceName: "Council of Science Editors White Paper on Promoting Integrity in Scientific Journal Publications",
    sourceType: "Scholastic Ethical Standard",
    shortLabel: "CSE Publication Ethics White Paper",
    whyIncluded: "Provides exhaustive requirements for correcting or retracting scientific medical articles exhibiting methodological flaws or biased reviewer loops.",
    url: "https://www.councilscienceeditors.org/resource-library/editorial-policies/white-paper-on-publication-ethics/",
    notes: "Promotes accountability of the scientific record and appropriate handling of redundant or unverified submissions.",
    role: "Scientific editorial integrity.",
    summary: "Use for scientific editorial responsibility, corrections, expressions of concern, retractions, conflicts of interest, authorship, peer review integrity, redundant publication and responsibility for the scientific record.",
    keyCriteria: [
      "Is the scientific record being handled responsibly?",
      "Are corrections or expressions of concern relevant?",
      "Are conflicts disclosed?",
      "Are authorship and accountability clear?",
      "Is peer review or editorial process transparent?",
      "Is there redundant, misleading or unreliable publication conduct?",
      "Is post-publication critique or correction warranted?"
    ],
    limitations: "Use for scientific publication integrity; do not use as an antisemitism standard by itself."
  }
];
