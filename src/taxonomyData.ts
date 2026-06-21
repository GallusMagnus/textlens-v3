export interface TaxonomyItem {
  id: string;
  section: string;
  family: 'Classic Stereotypes' | 'Modern anti-Zionist ideological forms' | 'Moral distortions' | 'Rhetorical tactics' | 'Institutional judgement' | 'Protected non-trigger';
  categoryTitle: string;
  quoteLabel: string;
  definition: string;
  flawOrWhyItMatters: string;
  modelResponseGuidance: string;
  boundaryNote: string;
  primaryScoreImpact: 'High' | 'Moderate' | 'Low' | 'None';
  referenceKeys: string[];
  referenceNote: string;
  relevantModes: ('general' | 'healthcare' | 'academic' | 'bccsa' | 'press_code')[];
  modeWeighting: Record<'general' | 'healthcare' | 'academic' | 'bccsa' | 'press_code', 'primary' | 'supporting' | 'guardrail'>;
  
  // Backward compatibility with generic rendering code
  name: string; // matches categoryTitle
  examples: string[];
  nonExamples: string[];
  severity: 'Severe / Direct' | 'Moderate / Distorted' | 'Minor Bias' | 'Rhetorical / Methodological' | 'Informational';
  confidence: 'High' | 'Moderate' | 'Expert Context Required';
  likelyStandards: string[];
}

export const textLensTaxonomy: TaxonomyItem[] = [
  // LAYER 1: DIRECT ANTISEMITIC CONTENT
  {
    id: "L1-POWER",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Jewish power or control",
    quoteLabel: "Demonic Power/Control",
    definition: "Claims about Jewish people collectively controlling or manipulating global finance, politics, international organizations, academic bodies, or media channels for sectarian purposes.",
    flawOrWhyItMatters: "Attributes a coordinated, occult level of dominance to an entire ethnic/religious minority, converting ordinary civic lobbying or professional achievements into a sinister global cabal plot.",
    modelResponseGuidance: "Flag immediately. Isolate structural accusations of secret/absolute control and explain the historic lineage to older conspiratorial antisemitica.",
    boundaryNote: "Highlighting standard legal donor contributions, ordinary diplomatic efforts, or lobbying activities by registered advocacy organizations (which occur in any democracy) is protected, provided it does not attribute mysterious group power.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 2, JDA Clause 1, Nexus Clause 4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "Jewish power or control",
    examples: [
      "The international editorial apparatus is governed by tight cabals of sympathetic families who dictate what enters peer-reviewed studies.",
      "Decisions of the global scientific panel were heavily distorted by clandestine funding structures tied strictly to sectarian identity interests."
    ],
    nonExamples: [
      "The university board of trustees received a major endowment donation from a high-profile Jewish philanthropist, which was fully disclosed in public records.",
      "Various lobbying groups, including pro-Israel donors, contribute legally to congressional political action committees."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX2", "JDA-GEN1", "NEXUS-4"]
  },
  {
    id: "L1-CONSPIRACY",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Conspiracy Theories",
    quoteLabel: "Clandestine Conspiracy",
    definition: "Accusations of a hidden, coordinated global conspiracy or secret plan by Jewish individuals to undermine, corrupt, or exploit sovereign nations, institutions, or non-Jewish populations.",
    flawOrWhyItMatters: "Reactivates ancient conspiratorial myths that frame Jews as an unseen, plotting group orchestrating international crises or public health calamities for hidden dominance.",
    modelResponseGuidance: "Flag as a core threat. Assess the text for language depicting undercover operations, hidden strings, and secret coordination.",
    boundaryNote: "Scholarly evaluation of state security partnerships, geopolitical alliances, or corporate strategic collaborations is fully protected, provided it relies on empirical activities rather than cabal assumptions.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 2, JDA Clause 1, Nexus Clause 4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "conspiracy",
    examples: [
      "This global initiative is actually a front for a dark, ethnically-coordinated conspiracy to suppress public health across the continent.",
      "These supposedly independent journal articles are part of a coordinated, undercover effort to manipulate world opinions for globalist dominance."
    ],
    nonExamples: [
      "Several prominent scientists of Jewish heritage joined a global research consortium to study coronavirus mutations and publish genetic sequences.",
      "Local community leaders collaborated to coordinate public safety programs in heavily populated urban neighborhoods."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX2", "JDA-GEN1", "NEXUS-4"]
  },
  {
    id: "L1-BLOOD",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Blood Libels or Child-Killing Motifs",
    quoteLabel: "Blood Libel Motif",
    definition: "Imputing blood lust, ritual murder, or unique, sadistic eagerness to kill children to Jewish individuals, communities, or institutions, drawing on medieval religious myths.",
    flawOrWhyItMatters: "Directly invokes the medieval European 'blood libel' (the myth that Jews murdered Christian infants for ritualistic requirements), modernizing it into modern secular reporting or public health discussions.",
    modelResponseGuidance: "Flag immediately. Highlight the specific use of ritualistic, visceral pediatric harm adjectives that exceed standard civilian casualty critique.",
    boundaryNote: "Documenting high civilian casualty rates or critical evaluations of military tactics that result in child fatalities during urban skirmishes is fully protected, provided it is expressed in neutral, investigative language.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 9, JDA Clause 1, Nexus Clause 1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "blood libel or child-killing motifs",
    examples: [
      "These medical researchers display an inherited, almost ritualistic thirst for the blood of children, experimenting upon them without a shred of clinical humanity.",
      "It is a systematic ritual where innocent infants are harvested to satisfy their ideological and physiological requirements."
    ],
    nonExamples: [
      "The report documents the high casualty rates of civilians, including children, caused by indiscriminate artillery bombardment of dense urban zones.",
      "Non-state armed groups as well as sovereign combatants must be strictly audited under international standards for civilian harm and trauma in war zones."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX7", "JDA-ISR1"]
  },
  {
    id: "L1-GUILT",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Collective Jewish Guilt",
    quoteLabel: "Collective Guilt",
    definition: "Holding all Jewish people collectively responsible for real or imagined misdeeds, historical events, actions of individuals, or the activities of specific organizations.",
    flawOrWhyItMatters: "Breaches fundamental tenets of individual legal accountability and human rights by projecting the actions of a sub-group or a state onto an entire, worldwide demographic category.",
    modelResponseGuidance: "Flag clearly. Distinguish individual action from ethnic-religious categories. Require that responsibility be explicitly isolated to active decision-makers.",
    boundaryNote: "Critiquing the collective institutional decisions of an administrative board, a specific political cabinet, or combat commanders who signed off on a policy is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 3, JDA Clause 2, Nexus Clause 1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "collective Jewish guilt",
    examples: [
      "All Jewish clinical professionals around the world must be held directly complicit in the historic abuses and modern actions of their peers.",
      "They bear collective guilt as a tribe for corrupting the moral integrity of western academia over the last several decades."
    ],
    nonExamples: [
      "We hold the active members of the medical committee, who explicitly signed off on the discriminatory policy, directly accountable for their administrative signatures.",
      "Individuals who commit breaches of professional guidelines should face individual review by the licensing board regardless of demographic background."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX3", "JDA-ISR2"]
  },
  {
    id: "L1-DEHUMAN",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Dehumanisation",
    quoteLabel: "Biological Dehumanization",
    definition: "Using subhuman comparisons, biological parasites, cancers, disease pathogens, venomous animals, or mechanical objects to strip Jewish individuals of basic human attributes.",
    flawOrWhyItMatters: "Lowers the moral barrier to physical violence and institutional discrimination by framing a human minority as a toxic biological contagion that must be surgically excised.",
    modelResponseGuidance: "Flag immediately. Highlight any metaphors comparing human cohorts to tumors, cancers, pathogens, viruses, or invasive pests.",
    boundaryNote: "Harshly criticizing the functional efficacy, administrative bloat, or institutional dysfunction of an editorial department is protected, provided it remains focused on structures.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus", "bccsa_fta", "press_code_sa"],
    referenceNote: "IHRA Clause 1, JDA Clause 1, BCCSA Code Part 3, Press Code Clause 5.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "dehumanisation",
    examples: [
      "The individuals operating this clinic must be seen not as human physicians, but as venomous parasites who infect the pristine national stream.",
      "This cohort is a malignant biological tumor on our campus, acting as a cancer that must be completely excised to heal the body politic."
    ],
    nonExamples: [
      "The administrative procedures used by the current editorial department are highly inefficient and require complete structural restructuring.",
      "The university board of directors described the systemic discrimination as a severe threat to academic freedom on the local campus."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX2", "JDA-GEN1", "PRESS-5.1"]
  },
  {
    id: "L1-LOYALTY",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Dual Loyalty",
    quoteLabel: "Dual Loyalty Accusation",
    definition: "Accusing Jewish citizens of host nations of being more loyal to Israel, or to the alleged global priorities of Jews, than to the interests of their own nations or professional obligations.",
    flawOrWhyItMatters: "Casts Jewish professionals, public servants, and students as continuous national threats and untrustworthy 'fifth columnists' who prioritize foreign ethnocracies.",
    modelResponseGuidance: "Flag and evaluate. Highlight phrases alleging primary devotion to foreign symbols or ancestral ties that undermine local licensure duties.",
    boundaryNote: "Discussing standard foreign agent registrations, official diplomatic channels, or analyzing the dual passport status of specific political actors is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 6, JDA Clause 2, Nexus Clause 1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "dual loyalty",
    examples: [
      "Local staff members have absolute allegiance to a foreign ethnocracy, and cannot be trusted to uphold the ethical duties of public servants inside this country.",
      "These diasporic researchers are dual-citizens in spirit, consistently acting as undercover agents of a foreign power while collecting our domestic grants."
    ],
    nonExamples: [
      "The academic held dual-citizenship with South Africa and France and possessed professional affiliations in both sovereign territories.",
      "The editorial board noted potential foreign conflict of interest disclosures, requiring authors to report overseas research funding sources."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX3", "JDA-ISR2"]
  },
  {
    id: "L1-HOLOCAUST",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Holocaust Denial or Minimization",
    quoteLabel: "Holocaust Minimisation",
    definition: "Denying the execution, scale, systematic nature, or intent of the genocide of European Jews during World War II, or distorting/minimizing its historic reality and unique features.",
    flawOrWhyItMatters: "Assaults the central historical trauma of the Jewish experience to cleanse historical antisemitism and claim Jews fake or blow up atrocities for leverage.",
    modelResponseGuidance: "Flag immediately. Analyze if the text reduces casualty figures, suggests forensic fabrications, or claims systematic gas chambers are a myth.",
    boundaryNote: "Historiographical debates over Allied strategic priorities, regional logistics of concentration camps, or comparing policies of other historical regimes is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda"],
    referenceNote: "IHRA Clause 5, JDA Clause 2",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "Holocaust denial, distortion or minimisation",
    examples: [
      "The claims of six million victims are highly exaggerated and fabricated by researchers to extract historic reparations for their own modern gain.",
      "The scale of the so-called industrial genocide has been grossly inflated and does not match the empirical archaeological records of the period."
    ],
    nonExamples: [
      "The historical record shows that several other national, ethnic, and political minority groups were also heavily targeted and murdered by the Nazi regime.",
      "A critical academic historiography evaluated the timeline of various Allied responses to reports of concentration camps during the mid-forties."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX4", "JDA-GEN2"]
  },
  {
    id: "L1-NAZI-DIRECT",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Nazi Comparison Directed at Jews as Jews",
    quoteLabel: "Direct Nazi Inversion",
    definition: "Making assertions or comparisons that equate the core character, beliefs, or behaviors of Jewish people (as an ethnic/religious group, distinct from state policies) to Nazis.",
    flawOrWhyItMatters: "Weaponizes the specific historical agents of their genocide against the Jewish demographic identity itself, aiming to inflict acute psychological trauma.",
    modelResponseGuidance: "Flag. Identify phrases characterizing Jewish religious codes or traditions as expressing a Master Race ideology.",
    boundaryNote: "General comparative analyses of extreme far-right nationalist groups, racial supremacist doctrines, or European fascist ideologies is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 1, JDA Clause 1, Nexus Clause 1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "Nazi comparison directed at Jews as Jews",
    examples: [
      "In their biological exclusivity, the local Jewish community leaders behave exactly like the architects of Nazi racial purity laws.",
      "The traditional theological traditions of these practitioners carry an inherent master-race ideology identical to National Socialist doctrines."
    ],
    nonExamples: [
      "The authoritarian policies of several extreme far-right nationalist groups in Eastern Europe draw inspiration from fascist symbols and racial supremacist models.",
      "The historical paper evaluated the impact of 1930s European racial theories on modern discriminatory legal philosophies."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX8", "NEXUS-1"]
  },
  {
    id: "L1-HOSTILITY",
    section: "Layer 1: Direct Antisemitic Content",
    family: "Classic Stereotypes",
    categoryTitle: "Ethnic, Racial, or Religious Hostility",
    quoteLabel: "Identity Hostility / Slurs",
    definition: "Direct slurs, expressions of contempt, physical threats, harassment, or explicit hostility directed at Jews based solely on their ethnic background, racial profile, or religious practice.",
    flawOrWhyItMatters: "Represents foundational identity harassment or hate speech that destroys standard workplace, broadcast, or publishing safety.",
    modelResponseGuidance: "Flag and document immediately. Isolate vulgar insults, threats of violence, or demands to expel Jewish professionals.",
    boundaryNote: "Theological critiques of Orthodox contracting rules, the political status of comparative religious laws, or advocating for strict secular separation are protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "bccsa_fta", "press_code_sa"],
    referenceNote: "IHRA Clause 1, JDA Clause 1, BCCSA Code Part 3, Press Code Clause 5.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "religious, racial or ethnic hostility toward Jews",
    examples: [
      "We must expel these global swindlers from our institutions, as they are a disease that has historically corrupted every society they enter.",
      "Their religious rituals are barbaric, archaic, and present an active threat to civilised, modern secular standards."
    ],
    nonExamples: [
      "A critical review of standard Orthodox Jewish legal contracts regarding dietary certification was published in a comparative sociology journal.",
      "The secular student union called for a strict separation of all religious organizations from direct campus administrative funding."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-CORE", "JDA-CORE", "BCCSA-FTA-3", "PRESS-5.1"]
  },

  // LAYER 2: CONTEMPORARY ISRAEL/ZIONISM-LINKED ANTISEMITISM
  {
    id: "L2-PEOPLEHOOD",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Denial of Jewish Peoplehood or Self-Determination",
    quoteLabel: "Self-Determination Denial",
    definition: "Claiming that Jews are not an ethnic-national group or denying their basic human right to self-determination while supporting that right for all other nations.",
    flawOrWhyItMatters: "Exempts the Jewish people from the universal principle of national self-determination, reducing their multi-ethnic history to a mere theological construct.",
    modelResponseGuidance: "Evaluate boundaries carefully. Flag assertions claiming the Jewish continuous bond to the territory is uniquely illegitimate.",
    boundaryNote: "Advocating for a binational, equal-voting state containing equal rights for all citizens rather than a nation-state is protected political theory, not bias.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 7, JDA Clause 4, Nexus Clause 2",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "denial of Jewish peoplehood or self-determination",
    examples: [
      "Jews are strictly a religious construct with absolutely no ethnic connection or continuous bond to that territory.",
      "The self-determination of this particular population is uniquely illegitimate and must be completely dismantled under international law."
    ],
    nonExamples: [
      "A political scientist argues for a single, fully democratic binational state containing equal individual and voting rights for all residents.",
      "The historical lecture analyzed the nineteenth-century emergence of modern nationalism among diverse European and Middle Eastern minorities."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX5", "JDA-ISR3", "NEXUS-2"]
  },
  {
    id: "L2-EXCEPT-DELEGIT",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Exceptional Delegitimisation of Israel",
    quoteLabel: "Sovereign Exclusion",
    definition: "Denying Israel's right to exist as a sovereign nation-state, presenting its very foundation as inherently evil or illegal, beyond standard critical state evaluations.",
    flawOrWhyItMatters: "Singles out a sole sovereign nation for complete destruction and delegitimization, raising concerns of targeting its ancestral inhabitants.",
    modelResponseGuidance: "Flag when state critique transitions from policy opposition to claiming the state has zero right to legal existence.",
    boundaryNote: "Analyzing legal parameters regarding the initial 1947 UN division boundaries or critique of administrative legal declarations is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 7, JDA Clause 4, Nexus Clause 3",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "exceptional delegitimisation of Israel",
    examples: [
      "The state is a cosmic mistake—an absolute historical crime that has no right to draw breath on the global stage.",
      "It is a fabricated entity whose sovereign status is totally null and void, requiring complete liquidation."
    ],
    nonExamples: [
      "A legal scholar kritiques the lack of a formal constitution in Israel and its reliance on basic laws regarding civil liberties.",
      "Many political theorists critique the concept of nation-states in general, advocating instead for anarchist or borderless federal systems."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX5", "JDA-ISR4", "NEXUS-3"]
  },
  {
    id: "L2-UNIQUE-ILLEGIT",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Applying Unique Double Standards",
    quoteLabel: "Extreme Double Standard",
    definition: "Demanding sovereign standards of behaviors, civilian restraint, or moral perfection from Israel that are never expected or demanded of any other democracy/nation-state in equivalent defensive conflicts.",
    flawOrWhyItMatters: "Functions as an exclusionary filter that systematically holding a sole state to impossible behavior, indicating latent hostile bias.",
    modelResponseGuidance: "Assess for asymmetrical requirements of combat or complete capitulation that are never leveled at comparable coalitions.",
    boundaryNote: "Requiring compliance with the Geneva Conventions or urging specific restraint on civilian housing areas is protected, provided it applies universally.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 8, JDA Clause 5, Nexus Clause 3",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "treating Israel as uniquely illegitimate among all states",
    examples: [
      "Unlike all other recognized states under attack, this state must immediately suspend all self-defense actions and submit to its rivals without reservation.",
      "They are the single most criminal regime to ever exist in modern history, and must be completely barred from all global scientific forums."
    ],
    nonExamples: [
      "The non-governmental organization called on Israel, alongside Syria, Sudan, and Russia, to immediately sign the international treaty banning specific cluster munitions.",
      "An editorial audited the compliance of coalition forces in Iraq and the Israeli military in Gaza against standard Geneva Conventions."
    ],
    severity: "Moderate / Distorted",
    confidence: "Moderate",
    likelyStandards: ["IHRA-EX6", "JDA-ISR4", "NEXUS-3"]
  },
  {
    id: "L2-UNSUPPORTED-FRAMING",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Unsupported Extreme Crimes Framing",
    quoteLabel: "Totalizing Crime Labeling",
    definition: "Applying highly inflammatory, absolute, and totalizing international crimes framing (such as apartheid or genocide) as rhetorical weapons without supporting legal evidence or empirical definitions, specifically to delegitimize.",
    flawOrWhyItMatters: "Bypasses clinical or legal parameters to transform state conflicts into demonic terms, aiming to eliminate legal rights through extreme rhetoric.",
    modelResponseGuidance: "Evaluate support carefully. Demand empirical definitions or independent legal reviews rather than unbacked, emotional labeling.",
    boundaryNote: "Providing rigorous academic comparative analyses of legal codes (e.g. comparing specific housing permits or zoning in the West Bank to international statutes) is protected.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["jda", "nexus", "bccsa_fta"],
    referenceNote: "JDA Clause 3, Nexus Clause 3, BCCSA Clause 11.4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "unsupported or disproportionate apartheid, genocide, settler-colonial or racial-supremacy framing",
    examples: [
      "The actions of the public health agency are a deliberate, systematic genetic genocide designed to exterminate every single infant in the territory.",
      "This local clinic operates an apartheid system of diagnostic absolute supremacy, exhibiting racial evil in every prescription."
    ],
    nonExamples: [
      "A report by a legal clinic compared the administrative zoning differences in Area C of the West Bank to the definitions in the International Convention on the Suppression and Punishment of the Crime of Apartheid.",
      "The human rights report criticized the military blockade of the territory, arguing it caused disproportionate economic damage to the civilian population."
    ],
    severity: "Moderate / Distorted",
    confidence: "Expert Context Required",
    likelyStandards: ["JDA-ISR1", "PRESS-1.1"]
  },
  {
    id: "L2-NAZI-INVERSION",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Moral distortions",
    categoryTitle: "Nazi Inversions",
    quoteLabel: "Nazi Inversion",
    definition: "Drawing comparisons between contemporary Israeli government/military actions and the historical actions and systematic genocide of the German National Socialist regime.",
    flawOrWhyItMatters: "Directly weaponizes the historical events of the Holocaust against the descendants of its victims, utilizing extreme historical trauma to inflict maximal distress.",
    modelResponseGuidance: "Flag as highly severe. Check for statements equating modern operations to Auschwitz, Treblinka, or systematic industrial gassings.",
    boundaryNote: "General structural critiques of military blockade severity, border security barriers, or comparing political statements to standard nationalistic rhetoric is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 10, JDA Clause 5, Nexus Clause 4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "Nazi inversion",
    examples: [
      "These military movements mirror exactly the systematic gas chambers and death camps of Treblinka and Auschwitz during World War II.",
      "They are the new master-race, repeating the industrial Holocaust against their neighbors with identical ideological aims."
    ],
    nonExamples: [
      "The textbook compared the extreme nationalist rhetoric of certain fringe political figures in Israel to early 20th-century nationalistic movements in Europe.",
      "The investigative piece criticised the harsh treatment and confinement of civilians in military stockades during the conflict."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX8", "JDA-ISR4"]
  },
  {
    id: "L2-RACISM-RACIAL",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Zionism Defined Exclusively as Colonial Evil",
    quoteLabel: "Totalizing Zionism Demonization",
    definition: "Characterizing Zionism (the movement for Jewish self-determination) as inherently and exclusively a fascist, racist, white-supremacist, or colonial evil enterprise, while ignoring its multi-ethnic, historic context.",
    flawOrWhyItMatters: "Fails to recognize the diverse historical streams of Jewish self-determination, transforming identity affiliations into simple colonial crimes.",
    modelResponseGuidance: "Flag when 'Zionist' or 'Zionism' is used as an absolute slur meaning structural evil, ignoring legitimate national context.",
    boundaryNote: "Scholarly evaluations of settler agrarian histories, critical analyses of state land laws, or comparing national systems in academic journals is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["jda", "nexus"],
    referenceNote: "JDA Clause 4, Nexus Clause 4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "Zionism equated with racism, fascism or colonial evil as a totalising claim",
    examples: [
      "Zionism is a pure fascist disease, an absolute synonym for racism and white-supremacy that corrupts every academic who validates it.",
      "To hold a Zionist identity is to participate in an active, colonial criminal conspiracy that must be scrubbed from polite society."
    ],
    nonExamples: [
      "A history paper analyzed the diverse historical branches of early Zionism, including Marxist, Cultural, and Nationalistic movements.",
      "A sociological study explored the ongoing legal debate within South African academies regarding definitions of settler-colonialism in Africa."
    ],
    severity: "Severe / Direct",
    confidence: "Moderate",
    likelyStandards: ["IHRA-EX5", "JDA-ISR3"]
  },
  {
    id: "L2-ELIMINATION",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Modern anti-Zionist ideological forms",
    categoryTitle: "Demands for Physical Elimination of the State",
    quoteLabel: "State Elimination Demand",
    definition: "Calling for the absolute destruction, liquidation, or complete dismantlement of the state of Israel as a political home, rather than critiquing its policies, borders, or governing party.",
    flawOrWhyItMatters: "Advocates the complete dismantling of a sovereign home for millions, which carries severe real-world threat of mass violence or complete displacement.",
    modelResponseGuidance: "Flag immediately. Isolate structural expressions calling to wipe the state off the map or liquidate its sovereign structure.",
    boundaryNote: "Demanding a replacement of the current political prime minister or protesting for an ending of specific military operations is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 7, JDA Clause 4, Nexus Clause 3",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "demands for elimination rather than policy change",
    examples: [
      "This cancerous entity must be completely wiped off the face of the earth; there is no peace possible until it is erased.",
      "We do not seek a change in their military strategy or cabinet; we seek the absolute elimination of this state from global map."
    ],
    nonExamples: [
      "The opposition party advocated for immediate national elections to replace the current prime minister and shift foreign policy towards negotiations.",
      "The protest organizers demanded a permanent ceasefire and the immediate end of the military occupation of Arab territories."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX5", "JDA-ISR4"]
  },
  {
    id: "L2-COLLECTIVE-RESP",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Classic Stereotypes",
    categoryTitle: "Holding Diaspora Jews Responsible for Israel",
    quoteLabel: "Diaspora Associative Accountability",
    definition: "demanding that Jewish individuals, local community groups, synagogue memberships, or local academics answer for, apologize for, or disavow the actions or policies of the State of Israel.",
    flawOrWhyItMatters: "Treats diasporic citizens of other countries as organic geopolitical agents of a foreign army, breaching standard demographical separation.",
    modelResponseGuidance: "Flag as highly suspect. Require that actions of a foreign state never be visited upon local religious or educational associations.",
    boundaryNote: "Requesting that an official Israeli Consul or Ambassador (who legally represents the state) address local committees is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 10, JDA Clause 3, Nexus Clause 1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "holding Jews collectively responsible for Israel",
    examples: [
      "Every single local Jewish academic must issue a written disavowal of the state of Israel before they are allowed to peer-review our medical manuscripts.",
      "The local synagogue must issue a formal apology for the defense forces' air strikes, or we will picket their family services on Saturday."
    ],
    nonExamples: [
      "The student body petitioned the university to divest endowments from international companies supplying munitions specifically to the Israeli military.",
      "We ask the Israeli Ambassador, as the official envoy of the state, to address the student senate regarding his government's foreign policy decisions."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX9", "JDA-ISR2", "NEXUS-1"]
  },
  {
    id: "L2-VEHICLE-OLD-TROPES",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Classic Stereotypes",
    categoryTitle: "Using State Criticism for Ancient Tropes",
    quoteLabel: "Coded Classical Trope",
    definition: "Substituting 'Israel', 'Zionists', or 'the Israeli state' into ready-made classical pre-20th century antisemitic plots of global finance manipulation, media controls, or blood ritualism.",
    flawOrWhyItMatters: "Smuggles traditional, severe anti-Jewish motifs into modern secular debate by using geopolitical placeholders to bypass standard screening.",
    modelResponseGuidance: "Flag. Identify when public reports use terminology like 'Zionist control' or 'cabal lobby' to imply mysterious, backstage domination.",
    boundaryNote: "Analyzing standard corporate lobbying, public relations budgets, or military aid allocations by sovereign states is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 2, JDA Clause 3, Nexus Clause 5",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "using Israel as the vehicle for older anti-Jewish tropes",
    examples: [
      "The Zionist lobby has purchased the hearts and minds of every medical journal editor, establishing a total control over academic freedom.",
      "The state’s defense operations are driven by an archaic, religious blood lust, actively seeking out innocent children to butcher in secret rituals."
    ],
    nonExamples: [
      "Public relations firms hired by multiple governments, including Israel and Saudi Arabia, actively lobby media editors to present their national perspectives favorably.",
      "The independent defense analyst criticized the high rates of civilian deaths, attributing them to systemic flaws in urban combat rules of engagement."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["IHRA-EX2", "JDA-ISR1", "NEXUS-4"]
  },
  {
    id: "L2-PROT-EXCLUSION",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Classic Stereotypes",
    categoryTitle: "Denying Standard Protections to identity",
    quoteLabel: "Identity Protection Exclusion",
    definition: "Systematically denying Jewish individuals, organizations, or student associations the same rights, safe spaces, anti-harassment protections, or cultural affiliations guaranteed to all other ethnic or religious groups.",
    flawOrWhyItMatters: "Establishes a discriminatory, segregated tier of campus or professional safety that exposes a single identity to unchecked harassment.",
    modelResponseGuidance: "Flag. Isolate codes that explicitly state certain anti-bias or safe-space declarations do not cover Zionist or Jewish cultural symbols.",
    boundaryNote: "Placing uniform restrictions on foreign political spending or sound levels that apply equally to all campus advocacy groups is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["jda", "nexus", "bccsa_fta", "press_code_sa"],
    referenceNote: "JDA Clause 2, Nexus Clause 3, BCCSA Part 3, Press Code Clause 5.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "excluding Jewish or Zionist identity from normal protections afforded to other identities",
    examples: [
      "Our anti-bias guidelines protect every religious minority on campus with the explicit exclusion of Zionists, who are ineligible for safe spaces.",
      "While all other cultural associations receive automatic campus listing, the Jewish student union is denied affiliation due to their ancestral links to the state."
    ],
    nonExamples: [
      "All political advocacy groups on campus, including pro-Israel and pro-Palestinian organizations, are prohibited from using student senate funds for foreign political ads.",
      "The administration issued equal guidelines stating that all campus assemblies must comply with basic local sound-level ordinances."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["JDA-ISR3", "PRESS-5.3"]
  },
  {
    id: "L2-VICTIM-MINIMISE",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Moral distortions",
    categoryTitle: "Denying or Minimising Jewish Victimhood",
    quoteLabel: "Victimhood Erasure / Mockery",
    definition: "Refusing to acknowledge, actively mocking, or minimizing verified, documented atrocities, war crimes, sexual violences, or hostagings committed against Jewish or Israeli civilians.",
    flawOrWhyItMatters: "Dehumanizes civilian casualties based on demographic parameters, framing their massacres as fabricated propaganda.",
    modelResponseGuidance: "Flag immediately. Isolate instances where documented atrocities are dismissed as high-production conspiracies to justify military movements.",
    boundaryNote: "Analyzing official logistical corrections or minor adjustments made to casualty numbers by verified independent audit divisions is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["jda", "nexus", "bccsa_fta", "press_code_sa"],
    referenceNote: "JDA Clause 3, Nexus Clause 5, BCCSA Clause 11, Press Code Clause 1 text",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "denying or minimising Israeli or Jewish victimhood where relevant",
    examples: [
      "The reported massacres of civilians and taking of hostages are completely fabricated, high-production Hollywood propaganda to justify military expansion.",
      "There were no innocent civilians killed; their deaths are a fully justified consequence of their state residence status."
    ],
    nonExamples: [
      "The investigation noted that early media reports of specific casualty figures were later adjusted downward by official medical authorities.",
      "An academic analyst evaluated the tactical communications and operational goals of the armed raid without employing emotional or graphic descriptions."
    ],
    severity: "Severe / Direct",
    confidence: "High",
    likelyStandards: ["JDA-GEN2", "PRESS-1.1"]
  },
  {
    id: "L2-DOUBLE-CONFLICTS",
    section: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
    family: "Moral distortions",
    categoryTitle: "Comparing Conflicts Selective Standards",
    quoteLabel: "Asymmetric Global Standards",
    definition: "Consistently applying extreme, hyper-scrutinized moral criteria to Israel's defenses while remaining entirely silent, indifferent, or supportive of massive, state-sponsored atrocities, ethnic cleansings, or war crimes in comparable global conflicts.",
    flawOrWhyItMatters: "Indicates that the source is motivated by an underlying animus toward the demographic group rather than a universal standard of international human rights.",
    modelResponseGuidance: "Evaluate the broader context. Check if identical military tactics by other states are ignored or defended by the same source.",
    boundaryNote: "A localized scholarly focus on Middle Eastern frameworks due to direct regional funding mandates or localized academic specialties is protected.",
    primaryScoreImpact: "Low",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Clause 8, JDA Clause 5, Nexus Clause 4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "selective moral standards where comparable or worse conflicts are ignored",
    examples: [
      "We are completely silent on the hundreds of thousands of deaths in Yemen and Syria, but this state's actions must be met with immediate total economic destruction.",
      "The academic forum will host panels exclusively focusing on the evils of Israel, while refusing to register any discussion about modern internment camps in East Asia."
    ],
    nonExamples: [
      "An academic journal dedicates a special issue to evaluating Middle Eastern conflicts, featuring articles analyzing humanitarian crises in Israel, Palestine, Syria, and Yemen.",
      "A South African legal clinic focuses its domestic research priorities on regional issues in Africa and Middle Eastern conflicts due to localized donor mandates."
    ],
    severity: "Minor Bias",
    confidence: "Expert Context Required",
    likelyStandards: ["IHRA-EX6", "JDA-ISR4"]
  },

  // LAYER 3: RHETORICAL AND EVIDENTIARY DISTORTION
  {
    id: "L3-MORAL-APPEAL",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Urgent Moral Appeals Replacing Proof",
    quoteLabel: "Emotional Evidentiary Bypass",
    definition: "Using passionate, moralistic proclamations or demands for solidarity to bypass standard evidentiary requirements, empirical citations, or logical proofs.",
    flawOrWhyItMatters: "Substitutes logical or historical fact with extreme emotional pressure, treating requests for empirical evidence as active moral complicity.",
    modelResponseGuidance: "Identify statements demanding immediate condemnation while calling standard fact-finding efforts offensive or unnecessary.",
    boundaryNote: "Upholding general consistency, calling for human safety, or demanding civic protections on moral grounds is protected.",
    primaryScoreImpact: "Low",
    referenceKeys: ["press_code_sa", "cope", "textlens_framework"],
    referenceNote: "Press Code Clause 1.2, COPE Data Integrity, TextLens L3-1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "urgent moral appeal replacing evidence",
    examples: [
      "We do not need to wait for forensic investigations; our immediate moral solidarity requires us to condemn this unspeakable medical massacre now.",
      "To request empirical proof of these humanitarian claims is to be an active, unethical participant in the ongoing genocide."
    ],
    nonExamples: [
      "We call on the university administration, out of basic moral consistency, to uphold safety and equal protection guidelines on campus.",
      "The human rights group argued that immediate humanitarian aid should be expanded under international law to save civilian lives."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.2", "COPE-DATA"]
  },
  {
    id: "L3-SELECTIVE-CONTEXT",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Cherry-Picking and Context Omission",
    quoteLabel: "Selective Historical Context",
    definition: "Cherry-picking historical facts, sovereign statements, or data points while systematically ignoring critical, surrounding context to create a highly distorted narrative of absolute malice.",
    flawOrWhyItMatters: "Violates core journalistic balance codes by hiding host hostilities to present defensive actions as unprovoked aggression.",
    modelResponseGuidance: "Flag omissions of underlying causes, prior treaties, or host rocket launches that explain state security actions.",
    boundaryNote: "An editorial focused on analyzing a specific military event, provided it does not actively hide relevant chronological triggers.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.1, BCCSA FTA Clause 11.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "selective context",
    examples: [
      "The military launched an unprovoked air assault on the facility on May 10th (omitting that the facility was actively being used as a rocket launchpad for several days).",
      "The state has unilaterally blockaded the coastal territory for years (omitting the ongoing, armed incursions and internationally-monitored imports of military grade rockets by the ruling cartel)."
    ],
    nonExamples: [
      "The comprehensive briefing outlined the military operational history of the territory from 1948 to the modern period, incorporating key treaties and blockades.",
      "The independent audit evaluated state actions alongside the violent activities of sovereign and non-state actors alike."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-ASYM-EMPATHY",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Asymmetrical Empathic Formatting",
    quoteLabel: "Asymmetric Linguistic Humanization",
    definition: "Linguistic structures that personalize and deeply humanize the suffering, lives, and families of one group of victims, while describing the identical suffering of another group in cold, dry statistics or collective terms.",
    flawOrWhyItMatters: "Manipulates audience empathy through structural adjectives, presenting one group as precious individuals and the other as faceless statistics.",
    modelResponseGuidance: "Highlight contrasts where side-A uses names and tears, and side-B is reported as generic population numbers.",
    boundaryNote: "A personal memoir or witness interview presenting their direct experience is expected and protected, as long as it isn't masked as objective reporting.",
    primaryScoreImpact: "Low",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.1, BCCSA FTA Clause 11.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "asymmetrical empathy",
    examples: [
      "Grief-stricken mothers, promising young children, and heroic physicians were targeted in a heart-wrenching, brutal raid (while on the other side) 14 demographic units were eliminated during a counter-operation.",
      "We mourn the beautiful, bright lives of these scholars cut short, while the opposing victims are described simply as an inevitable consequence of residential density."
    ],
    nonExamples: [
      "We deeply mourn the tragic loss of all civilian lives—Israeli and Palestinian—and call for immediate, equal pathways to safety and dignity for both peoples.",
      "The casualties included 1,200 individuals on one side and over 20,000 on the other, each representing a profound human tragedy for their communities."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-OMISSION-VICTIMS",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Systemic Omission of Strategic Causes",
    quoteLabel: "Trigger Event Erasure",
    definition: "Systematically omitting and hiding casualties, hostage events, or historical chronology that explains or triggered the current event, making the response appear entirely irrational and unprovoked.",
    flawOrWhyItMatters: "Generates a false narrative where state defense operations look like unprovoked, systemic crimes, omitting defensive triggers.",
    modelResponseGuidance: "Isolate news reports that delete underlying rocket fire or massacres occurring directly before a retaliation.",
    boundaryNote: "Focusing on the tactical errors of a retaliation, provided nearby firing triggers are not completely excised, is protected.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.1, BCCSA FTA Clause 11.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "omission of relevant victims, causes or chronology",
    examples: [
      "The national university suspended the research project today, demonstrating a total censorship of ideas (completely omitting that the project's principal funded agent had been indicted for money laundering).",
      "The airforce launched a devastating strike on the civic center today (completely omitting that two hundred rockets had been fired from that exact location into city suburbs five minutes prior)."
    ],
    nonExamples: [
      "The military report stated that the strike targeted an active missile site, noting with concern that many civilian homes were directly adjacent to the target.",
      "The article reported on the new economic restrictions, noting they were implemented in immediate response to a series of suicide bombings inside border towns."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-EMO-AMPLIFICATION",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Emotional Amplification and Trailing Adjectives",
    quoteLabel: "Loaded Emotional Adjectives",
    definition: "Overloading descriptions with intense, highly charged adjectives (e.g., 'blood-soaked', 'fiendish', 'sadistic', 'exterminatory') rather than objective, neutral reporting, specifically to force a specific emotional outcome.",
    flawOrWhyItMatters: "Abandons professional neutral reporting guidelines to trigger raw emotional hysteria in the reader, leading to non-factual bias.",
    modelResponseGuidance: "Flag when standard professional text is replaced by dramatic, accusatory vocabulary.",
    boundaryNote: "An opinion or comment piece explicitly marked as such can utilize colorful, rhetorical styling inside standard Press Council rules.",
    primaryScoreImpact: "Low",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.1, BCCSA FTA Clause 11.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "emotional amplification",
    examples: [
      "The fiendish state actors unleashed a blood-soaked, sadistic assault upon helpless, starving souls in a display of ultimate evil.",
      "These sinister editors are pursuing a monstrous campaign of ultimate academic violence to crush the voices of progress."
    ],
    nonExamples: [
      "The independent observer described the military airstrikes as highly destructive, resulting in massive damage to civilian apartments and localized infrastructure.",
      "The committee rejected the manuscript, stating its conclusions were unsupported by the empirical clinical trial results provided."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-ACCUS-CERTAINTY",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Accusatory Certainty Without Proof",
    quoteLabel: "Unverified Absolute Certainty",
    definition: "Presenting highly contentious, contested, or unverified claims as absolute, unquestioned facts, without attributing them to their partisan sources or indicating uncertainty.",
    flawOrWhyItMatters: "Circulates uncorroborated, dramatic battlefield narratives as proven historical truth, avoiding necessary skepticism.",
    modelResponseGuidance: "Audit the source of claims. Flag statements that presents one-sided political statements as verified clinical or legal fact.",
    boundaryNote: "Clearly state and attribute claims to each side (e.g., 'according to local health officials...') while noting lack of forensical proof is protected.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.3, BCCSA FTA Clause 11.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "accusatory certainty despite weak evidence",
    examples: [
      "We know with absolute scientific certainty that this hospital was deliberately targeted for systemic execution by the defense forces.",
      "It is an undeniable, proven fact that the medical school is operating an ethnically-segregated admission tier to exclude poor populations."
    ],
    nonExamples: [
      "While one side claims the facility was struck by an misfired rocket from an armed group, the other side asserts it was a targeted state airstrike; independent forensic analysis is ongoing.",
      "Initial reports of a major explosion carry high uncertainty, with both military authorities and local medical crews offering conflicting accounts."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.2", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-ONE-SIDED-AGENCY",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "One-Sided Attribution of Agency",
    quoteLabel: "Asymmetric Agency Assignment",
    definition: "Depicting one actor as having absolute free will, calculated planning, and total control over all outcomes, while treating other actors as completely passive victims with no choices or inputs.",
    flawOrWhyItMatters: "Constructs a skewed narrative where all negative outcomes are calculated by one side, excusing armed host entities from standard codes.",
    modelResponseGuidance: "Highlight where the text systematically excuses actions of armed cartels as automatic, moral-free reactions.",
    boundaryNote: "Evaluating asymmetric power balance configurations between an occupying state army and stateless populaces is protected.",
    primaryScoreImpact: "Low",
    referenceKeys: ["press_code_sa", "textlens_framework"],
    referenceNote: "Press Code Clause 1.1, TextLens L3-2",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "one-sided attribution of agency",
    examples: [
      "The state possesses 100% of the agency in this conflict; the actions, rocket launches, or choices of the armed groups are merely unavoidable reactions with no moral value.",
      "The university board holds absolute power, and the student groups who occupied the dean's office and destroyed historical files are merely reacting to systemic pressure."
    ],
    nonExamples: [
      "Both the municipal safety board and the local organizers share responsibility for coordinating emergency exit routes for the assembly.",
      "Peace in the region depends on complex compromises from the Israeli government, the Palestinian Authority, and regional non-state organizations alike."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Expert Context Required",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.1"]
  },
  {
    id: "L3-PASSIVE-ACTIVE-BLAME",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Passive Action Voice Shifting",
    quoteLabel: "Linguistic Voice Distortions",
    definition: "Using active, aggressive verbs when describing actions of one group, while shifting to silent, passive verbs ('were killed', 'died') when reporting matching actions or deaths on the opposing side.",
    flawOrWhyItMatters: "Subtly masks the perpetrators of violent acts on one side, while emphasizing blame on the target state, generating structural bias.",
    modelResponseGuidance: "Extract contrasting syntactic frames: Active verbs for side-A aggression, and passive verb states for side-B victims.",
    boundaryNote: "Relying on standard passive phrasing where the perpetrator has not been officially identified is protected.",
    primaryScoreImpact: "Low",
    referenceKeys: ["press_code_sa"],
    referenceNote: "Press Code Clause 1.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "supporting",
      academic: "supporting",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "passive voice for one side and active blame for the other",
    examples: [
      "Israeli soldiers executed 12 Palestinian youths (while in a separate incident) 5 Israelis died in a bus explosion today.",
      "Sectarian actors slaughtered local infants, while children in the neighboring village were tragically lost during military movements last night."
    ],
    nonExamples: [
      "Rocket attacks by militant groups killed 3 Israelis in Sderot, while Israeli retaliatory airstrikes killed 15 Palestinians in Gaza City.",
      "Three civilians were killed by sniper fire from a local building, while two guards were shot and killed during the perimeter breach."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Moderate",
    likelyStandards: ["PRESS-1.1"]
  },
  {
    id: "L3-LAUNDERING-CLAIMS",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Institutional judgement",
    categoryTitle: "Laundering Political Attacks Through Jargon",
    quoteLabel: "Jargon Data Laundering",
    definition: "Using medical, clinical, sociological, or legal jargon and institutional credentials specifically to disguise a raw partisan or political ideological attack as a neutral professional consensus.",
    flawOrWhyItMatters: "Manipulates institutional credibility to advance identity exclusion, making political hostility appear as expert scientific fact.",
    modelResponseGuidance: "Flag when epidemiological labels (e.g. diagnosing national characters as pathological) are used in peer-reviewed scientific journals.",
    boundaryNote: "Using standard established psychiatric terminology to analyze general post-traumatic rates across civilian cohorts is protected.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["cope", "textlens_framework"],
    referenceNote: "COPE Ethical Regulations, TextLens TL-MEDICAL",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "laundering political claims through professional or academic authority",
    examples: [
      "From a clinical diagnostic perspective, the state is suffering from a collective psychopathology of settler-colonial entitlement requiring clinical isolation.",
      "A peer-reviewed sociological analysis confirms that any student holding a Zionist self-conception is displaying a severe, pathologized moral deficit."
    ],
    nonExamples: [
      "The journal of mental health examined the psychological impact of exposure to repetitive rocket sirens on children living in border towns.",
      "An academic treatise on international humanitarian law evaluated the legal definition of military distinction regarding dual-use civilian infrastructure."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Expert Context Required",
    likelyStandards: ["COPE-REVIEW", "PRESS-1.1"]
  },
  {
    id: "L3-FAILURE-DISTINGUISH",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Rhetorical tactics",
    categoryTitle: "Failing to Distinguish Diverse Categories",
    quoteLabel: "Category Conflation",
    definition: "Conflating distinct groups (e.g. treating 'the Israeli army', 'Zionists', 'Israelis', and 'Jews' as a single, homogenous entity), leading to collective projections of hostility.",
    flawOrWhyItMatters: "Collapses separate political, ancestral, and religious categories, ensuring that anger at a state policy visits diaspora residents directly.",
    modelResponseGuidance: "Flag when 'Zionists' is used interchangeably with local Jewish citizens to justify professional exclusion.",
    boundaryNote: "Reviewing direct relationships between specific military generals and state political leaders with clear distinction labels is protected.",
    primaryScoreImpact: "High",
    referenceKeys: ["ihra", "jda", "nexus", "press_code_sa"],
    referenceNote: "IHRA Clause 10, JDA Clause 3, Nexus Clause 1, Press Code Clause 1.1",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "primary",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "failure to distinguish civilians, governments, armies, Jews, Israelis and Zionists",
    examples: [
      "The Zionist threat must be removed from our local clinic; these Israelis cannot be trusted to handle public health here.",
      "The actions of the current Israeli cabinet are the direct responsibility of all Jews, who must apologize on their behalf."
    ],
    nonExamples: [
      "The human rights critic explicitly targeted the specific tactical policies of the current Likud-led coalition, distinguishing them from the Israeli public as a whole.",
      "Diaspora Jewish community organizations hold a vast array of political and cultural perspectives regarding the current Israeli-Palestinian negotiations."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "High",
    likelyStandards: ["IHRA-EX9", "JDA-ISR2", "PRESS-1.1"]
  },
  {
    id: "L3-CUMULATIVE-PATTERN",
    section: "Layer 3: Rhetorical and Evidentiary Distortion",
    family: "Institutional judgement",
    categoryTitle: "Cumulative Patterning of Minor Biases",
    quoteLabel: "Systemic Out-of-Balance Compilation",
    definition: "A systematic, repetitive compilation of minor biases, rhetorical tactics, and omissions across multiple articles or segments, which collectively form a hostile and exclusionary environment.",
    flawOrWhyItMatters: "Bypasses standard singular regulatory complaints by organizing an ongoing stream of minor distortions that establish totalizing bias.",
    modelResponseGuidance: "Analyze if the source consistently refuses to host representatives of a specific national/religious group across numerous segments.",
    boundaryNote: "Evaluating a single, highly specialized commentary piece containing a localized argument is protected.",
    primaryScoreImpact: "Moderate",
    referenceKeys: ["press_code_sa", "bccsa_fta"],
    referenceNote: "Press Code Clause 1.1, BCCSA FTA Clause 11.4",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "supporting",
      healthcare: "primary",
      academic: "primary",
      bccsa: "supporting",
      press_code: "supporting"
    },
    name: "cumulative patterning across multiple texts",
    examples: [
      "Over twelve separate editorial commentaries, the journal consistently omitted all Israeli victims while utilizing biological disease metaphors for state actions, establishing a clear professional bias.",
      "The broadcast program repeatedly hosted extreme critics unchallenged, while systematically denying spokespeople representing mainstream Jewish associations equal opportunity to speak."
    ],
    nonExamples: [
      "The newspaper published three separate guest editorial columns over several weeks, displaying a balance of pro-peace, pro-Israel, and pro-Palestinian viewpoints.",
      "The university hosted a dynamic lecture series highlighting diverse sociological debates surrounding migration, nationality, and borders in the modern world."
    ],
    severity: "Rhetorical / Methodological",
    confidence: "Expert Context Required",
    likelyStandards: ["PRESS-1.1", "BCCSA-FTA-11.4"]
  },

  // LAYER 0: GUARDRAILS AND EXEMPTIONS (Protected non-trigger categories)
  {
    id: "L0-POLITI-CRIT",
    section: "Layer 0: Guardrails & Exemptions",
    family: "Protected non-trigger",
    categoryTitle: "Ordinary Political Criticism",
    quoteLabel: "Standard Protected Criticism",
    definition: "Standard, harsh, or robust political criticism of the State of Israel, its governing coalition, military activities, or political policies that does not employ anti-Jewish tropes or slurs.",
    flawOrWhyItMatters: "Does not represent a bias flaw. This category represents a mandatory analytical guardrail to ensure that ordinary democratic scrutiny remains fully protected.",
    modelResponseGuidance: "Ensure that standard political debates are NEVER flagged or classified as bias. Provide analytical context separating state policy critiques from identity hostility.",
    boundaryNote: "Criticism remains protected as long as it does not employ biological pathologizing language, classic power stereotypes, blood libels, or dual-loyalty accusations targeting diasporic citizens.",
    primaryScoreImpact: "None",
    referenceKeys: ["ihra", "jda", "nexus"],
    referenceNote: "IHRA Introduction, JDA Preamble, Nexus Introduction",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "guardrail",
      healthcare: "guardrail",
      academic: "guardrail",
      bccsa: "guardrail",
      press_code: "guardrail"
    },
    name: "ordinary criticism of Israel or Zionism",
    examples: [
      "The government's expansion of civilian housing blocks in Area C goes directly against prior sovereign agreements and must be condemned under international law.",
      "We strongly critique the current prime minister's coalition cabinets and demand a immediate ceasefire and negotiated territorial partition to ensure regional safety."
    ],
    nonExamples: [
      "The state behaves like a cancerous pathogen that has no right to draw breath on the global stage, executing ritual child-killings.",
      "All diasporic academics must disavow their ancestral links to this globalist entity before receiving licenses."
    ],
    severity: "Informational",
    confidence: "High",
    likelyStandards: ["JDA-CORE"]
  },
  {
    id: "L0-BOYCOTT-BDS",
    section: "Layer 0: Guardrails & Exemptions",
    family: "Protected non-trigger",
    categoryTitle: "Divestment and Boycott Advocacy",
    quoteLabel: "BDS Protest Advocacy",
    definition: "Advocating for Boycotts, Divestment, and Sanctions (BDS) as a peaceful, political protest tool against Israeli state occupation or policies.",
    flawOrWhyItMatters: "BDS advocacy, when formatted as standard economic or institutional protest regarding state actions, is a recognized form of political speech under standard guidelines.",
    modelResponseGuidance: "Do not classify standard, peaceful economic or academic boycott campaigns as antisemitic unless they cross the line into excluding individual local professionals solely due to their Jewish demographic origin.",
    boundaryNote: "Boycotts cross the boundary of protection if they involve active harassment of individual local Jewish students, direct professional exclusion, or dual-loyalty screening examinations.",
    primaryScoreImpact: "None",
    referenceKeys: ["jda", "nexus"],
    referenceNote: "JDA Clause 14, Nexus Page 5",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "guardrail",
      healthcare: "guardrail",
      academic: "guardrail",
      bccsa: "guardrail",
      press_code: "guardrail"
    },
    name: "boycott and divestment advocacy",
    examples: [
      "The student senate voted to petition the board to divest investment allocations from international heavy manufacturing corporations that supply defensive fencing materials.",
      "I advocate for a voluntary consumer boycott of goods cultivated in foreign military-controlled agrarian territories."
    ],
    nonExamples: [
      "We refuse to allow any Jewish student to join our local biology club unless they issue a signed disavowal of their Zionist identity.",
      "Zionists must be completely excluded from campus housing blocks as they are dual-loyalty threats to our safety."
    ],
    severity: "Informational",
    confidence: "High",
    likelyStandards: ["JDA-CORE"]
  },
  {
    id: "L0-BINATIONAL",
    section: "Layer 0: Guardrails & Exemptions",
    family: "Protected non-trigger",
    categoryTitle: "Alternative State Model Advocacy",
    quoteLabel: "One-State Model Advocacy",
    definition: "Advocating for constitutional states, single binational frameworks, or borderless federations containing equal individual voting rights for all regional inhabitants.",
    flawOrWhyItMatters: "Represents standard constitutional political theory and debate, which lies outside the definition of identity bias or discrimination.",
    modelResponseGuidance: "Do not classify advocacy for single-state, equal-voting frameworks as antisemitic, provided it does not call for physical violence, ethnic cleansings, or mass displacement of current inhabitants.",
    boundaryNote: "Advocacy crosses into bias if it calls for the active expulsion, physical elimination, or denial of equal human protections for Jewish inhabitants of the zone.",
    primaryScoreImpact: "None",
    referenceKeys: ["jda", "nexus"],
    referenceNote: "JDA Clause 12, Nexus Page 5",
    relevantModes: ["general", "healthcare", "academic", "bccsa", "press_code"],
    modeWeighting: {
      general: "guardrail",
      healthcare: "guardrail",
      academic: "guardrail",
      bccsa: "guardrail",
      press_code: "guardrail"
    },
    name: "advocacy for binational or federal state models",
    examples: [
      "We argue that the primary path to peace is a single democratic framework where Hebrew-speaking and Arabic-speaking residents possess single, equal-voting shares.",
      "The history lecture analyzed are constitutional structures of multi-ethnic federations in early European and Middle East debates."
    ],
    nonExamples: [
      "The Jewish inhabitants must be completely wiped off the face of the Earth and expelled back to European capitals, as they are a disease.",
      "The sovereign state is a historical mistake that must be forcibly liquidated and its inhabitants displaced."
    ],
    severity: "Informational",
    confidence: "High",
    likelyStandards: ["JDA-CORE"]
  }
];
