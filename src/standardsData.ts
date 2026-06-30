import { StandardDoc } from './types';

export const standardsList: StandardDoc[] = [
  {
    id: 'ihra',
    name: 'IHRA Working Definition of Antisemitism',
    shortName: 'IHRA Working Definition',
    category: 'Antisemitism Definitions',
    description: 'Widely used working definition with contextual examples.',
    fullTextUrl: 'https://www.holocaustremembrance.com/resources/working-definitions-charters/working-definition-antisemitism',
    clauses: [
      {
        id: 'IHRA-CORE',
        title: 'Core Definition',
        text: 'Antisemitism is a certain perception of Jews, which may be expressed as hatred toward Jews. Rhetorical and physical manifestations of antisemitism are directed toward Jewish or non-Jewish individuals and/or their property, toward Jewish community institutions and religious facilities.'
      },
      {
        id: 'IHRA-CONTEXT',
        title: 'Context and Comparable State Criticism',
        text: 'Manifestations might include the targeting of the State of Israel, conceived as a Jewish collectivity. However, criticism of Israel similar to that leveled against any other country cannot be regarded as antisemitic.'
      },
      {
        id: 'IHRA-EX1',
        title: 'Calling for or Justifying Harm',
        text: 'Calling for, aiding, or justifying the killing or harming of Jews in the name of a radical ideology or an extremist view of religion.'
      },
      {
        id: 'IHRA-EX2',
        title: 'Dehumanizing or Conspiratorial Allegations',
        text: 'Making mendacious, dehumanizing, demonizing, or stereotypical allegations about Jews as such or the power of Jews as collective, such as the myth about a world Jewish conspiracy or of Jews controlling the media, economy, government, or other societal institutions.'
      },
      {
        id: 'IHRA-EX3',
        title: 'Collective Responsibility or Guilt',
        text: 'Accusing Jews as a people of being responsible for real or imagined wrongdoing committed by a single Jewish person or group, or even for acts committed by non-Jews.'
      },
      {
        id: 'IHRA-EX4',
        title: 'Holocaust Denial',
        text: 'Denying the fact, scope, mechanisms, or intentionality of the genocide of the Jewish people at the hands of National Socialist Germany and its supporters and accomplices during World War II.'
      },
      {
        id: 'IHRA-EX10',
        title: 'Holocaust Exaggeration Accusations',
        text: 'Accusing the Jews as a people, or Israel as a state, of inventing or exaggerating the Holocaust.'
      },
      {
        id: 'IHRA-EX11',
        title: 'Dual Loyalty Accusations',
        text: 'Accusing Jewish citizens of being more loyal to Israel, or to the alleged priorities of Jews worldwide, than to the interests of their own nations.'
      },
      {
        id: 'IHRA-EX5',
        title: 'Denying Jewish Self-Determination',
        text: 'Denying the Jewish people their right to self-determination, for example by claiming that the existence of a State of Israel is a racist endeavor.'
      },
      {
        id: 'IHRA-EX6',
        title: 'Discriminatory Double Standards',
        text: 'Applying double standards by requiring of Israel a behavior not expected or demanded of any other democratic nation.'
      },
      {
        id: 'IHRA-EX7',
        title: 'Classic Antisemitic Symbols and Images',
        text: 'Using the symbols and images associated with classic antisemitism, such as claims of Jews killing Jesus or blood libel, to characterize Israel or Israelis.'
      },
      {
        id: 'IHRA-EX8',
        title: 'Nazi Comparisons',
        text: 'Drawing comparisons of contemporary Israeli policy to that of the Nazis.'
      },
      {
        id: 'IHRA-EX9',
        title: 'Collective Jewish Accountability for Israel',
        text: 'Holding Jews collectively responsible for actions of the State of Israel.'
      }
    ]
  },
  {
    id: 'jda',
    name: 'Jerusalem Declaration on Antisemitism',
    shortName: 'Jerusalem Declaration (JDA)',
    category: 'Antisemitism Definitions',
    description: 'Scholarly declaration clarifying antisemitism while protecting open debate.',
    fullTextUrl: 'https://jerusalemdeclaration.org/',
    clauses: [
      {
        id: 'JDA-CORE',
        title: 'Core Definition',
        text: 'Antisemitism is discrimination, prejudice, hostility or violence against Jews as Jews, or Jewish institutions as Jewish.'
      },
      {
        id: 'JDA-GEN1',
        title: 'Essentializing, Conspiracy, and Evil Tropes',
        text: 'JDA treats it as antisemitic to essentialize Jews or to depict Jews as linked to hidden power, conspiratorial control, or the forces of evil.'
      },
      {
        id: 'JDA-GEN2',
        title: 'Coded Speech and Holocaust Denial',
        text: 'JDA treats direct, indirect, explicit, or coded anti-Jewish speech as relevant, including Holocaust denial or minimization and coded claims that racialize or stigmatize Jews through Israel.'
      },
      {
        id: 'JDA-ISR1',
        title: 'Antisemitic Tropes Applied to Israel',
        text: 'Applying the symbols, images, and negative stereotypes of classical antisemitism to the State of Israel is, on the face of it, antisemitic.'
      },
      {
        id: 'JDA-ISR2',
        title: 'Collective Responsibility and Assumed Agency',
        text: 'Holding Jews collectively responsible for Israel\'s conduct, or treating Jews simply because they are Jewish as agents of Israel, is, on the face of it, antisemitic.'
      },
      {
        id: 'JDA-ISR3',
        title: 'Compelled Denunciation and Loyalty Suspicion',
        text: 'Requiring Jews publicly to condemn Israel or Zionism, or assuming non-Israeli Jews are necessarily more loyal to Israel than to their own countries, is, on the face of it, antisemitic.'
      },
      {
        id: 'JDA-ISR4',
        title: 'Denying Equal Jewish Collective Existence',
        text: 'Denying the right of Jews in the State of Israel to exist and flourish, collectively and individually, as Jews, in accordance with the principle of equality, is, on the face of it, antisemitic.'
      },
      {
        id: 'JDA-GUARD1',
        title: 'Protected Political Positions and Nonviolent Action',
        text: 'Supporting Palestinian rights, criticizing or opposing Zionism as a form of nationalism, advocating different constitutional arrangements, comparing Israel with other historical cases, and supporting boycotts, divestment, or sanctions are not, in and of themselves, antisemitic.'
      },
      {
        id: 'JDA-GUARD2',
        title: 'Harsh or Excessive Speech Is Not Automatically Antisemitic',
        text: 'Political speech does not have to be measured, proportional, tempered, or reasonable to fall outside antisemitism. Under JDA, even contentious or excessive criticism, including allegations of double standards, is not in itself antisemitic.'
      }
    ]
  },
  {
    id: 'nexus',
    name: 'The Nexus Document: Understanding Antisemitism at its Nexus with Israel and Zionism',
    shortName: 'Nexus Document',
    category: 'Antisemitism Definitions',
    description: 'Policy guidance on antisemitism at the Israel/Zionism boundary.',
    fullTextUrl: 'https://www.israelantisemitismnexus.org/',
    clauses: [
      {
        id: 'NEXUS-1',
        title: 'Myths, Tropes, and Collective Culpability',
        text: 'It is antisemitic to promote myths, stereotypes, or attitudes about Zionism or Israel that derive from or reinforce antisemitic accusations, including world-conspiracy claims, hidden Jewish control, collective culpability, or assumed dual loyalty.'
      },
      {
        id: 'NEXUS-2',
        title: 'Collective Guilt, Violence, and Provoked Harm',
        text: 'It is antisemitic to use symbols and images that present all Jews as collectively guilty for the actions of Israel, to attack Jews because of their relationship to Israel, or to direct hostility at Jews connected to Israel in ways that intentionally or irresponsibly provoke violence.'
      },
      {
        id: 'NEXUS-3',
        title: 'Self-Determination and Discriminatory Standards',
        text: 'It is antisemitic to deny Jews alone the right to define themselves as a people or exercise self-determination, or to treat Israel differently solely because it is a Jewish state using standards not applied to other countries.'
      },
      {
        id: 'NEXUS-4',
        title: 'Protected Criticism, Opposition, and Nonviolent Action',
        text: 'As a general rule, criticism of Zionism or Israel, opposition to Israeli policy, harsh criticism, or nonviolent political action directed at Israel should not, as such, be deemed antisemitic. Using accusations of antisemitism to suppress criticism of Israel is itself identified by Nexus as dangerous.'
      },
      {
        id: 'NEXUS-5',
        title: 'Disproportionate Attention Is Not Prima Facie Proof',
        text: 'Paying disproportionate attention to Israel, or treating Israel differently, is not by itself proof of antisemitism. Under Nexus, additional evidence of anti-Jewish animus or antisemitic stereotyping is required.'
      }
    ]
  },
  {
    id: 'bccsa_fta',
    name: 'BCCSA Free-to-Air Code of Conduct for Broadcasting Service Licensees',
    shortName: 'BCCSA FTA',
    category: 'Media & Broadcasting Codes',
    description: 'South African free-to-air broadcast code.',
    jurisdictionContext: 'South Africa (Free-to-air broadcasting)',
    clauses: [
      {
        id: 'BCCSA-FTA-4.2',
        title: 'Propaganda for war, incitement of violence, and advocacy of hatred',
        text: 'Broadcasters must not broadcast material which, judged within context, amounts to propaganda for war, incitement of imminent violence, or advocacy of hatred based on race, ethnicity, religion, or gender that constitutes incitement to cause harm.'
      },
      {
        id: 'BCCSA-FTA-11.2',
        title: 'News in correct context and fair manner',
        text: 'News must be presented in the correct context and in a fair manner, without intentional or negligent departure from the facts, whether by distortion, exaggeration, misrepresentation, material omission, or summarisation.'
      },
      {
        id: 'BCCSA-FTA-11.6',
        title: 'Rectification of materially incorrect reports',
        text: 'Where a broadcast report is materially incorrect, it must be rectified forthwith, without reservation or delay, with adequate prominence and timing so as to readily attract attention.'
      },
      {
        id: 'BCCSA-FTA-12.2',
        title: 'Comment clearly distinguished from fact',
        text: 'Comment must be an honest expression of opinion, clearly presented as comment, and made on facts truly stated or fairly indicated and referred to.'
      },
      {
        id: 'BCCSA-FTA-13.1',
        title: 'Opposing views on controversial issues of public importance',
        text: 'Where a controversial issue of public importance is discussed, the broadcaster must make reasonable efforts to fairly present opposing points of view either in the same programme or within a reasonable period in substantially the same time slot.'
      },
      {
        id: 'BCCSA-FTA-13.2',
        title: 'Right of reply on controversial issues',
        text: 'A person whose views are criticised on a controversial issue of public importance must be given the right to reply on the same programme or, where impracticable, a reasonable opportunity to respond in an appropriate related format.'
      }
    ]
  },
  {
    id: 'bccsa_sub',
    name: 'BCCSA Code of Conduct for Subscription Broadcasting Service Licensees',
    shortName: 'BCCSA Subscription',
    category: 'Media & Broadcasting Codes',
    description: 'South African subscription broadcast code.',
    jurisdictionContext: 'South Africa (Subscription Services)',
    clauses: [
      {
        id: 'BCCSA-SUB-10',
        title: 'Propaganda for war, incitement of violence, and advocacy of hatred',
        text: 'A subscription broadcasting service licensee may not knowingly broadcast material which, judged within context, amounts to propaganda for war, incites imminent violence, or advocates hatred based on race, ethnicity, gender, or religion and which constitutes incitement to cause harm.'
      },
      {
        id: 'BCCSA-SUB-28.1',
        title: 'Truthful, accurate, and fair news',
        text: 'If the service includes news or comment on matters of public importance that it has produced or commissioned, the licensee must report news truthfully, accurately, and fairly, and distinguish fact from opinion, supposition, rumours, or allegations.'
      },
      {
        id: 'BCCSA-SUB-28.1.5',
        title: 'Rectification of materially incorrect reports',
        text: 'If a broadcast report is materially incorrect, it must be rectified immediately and without reservation, with adequate prominence and timing.'
      },
      {
        id: 'BCCSA-SUB-28.2',
        title: 'Comment clearly distinguished from fact',
        text: 'Comment on actions or events of public importance must be an honest expression of opinion, clearly presented as comment, and made on facts truly stated or fairly indicated.'
      },
      {
        id: 'BCCSA-SUB-28.3',
        title: 'Controversial issues and right of reply',
        text: 'Where controversial issues of public importance are discussed, the licensee must make reasonable efforts to fairly present opposing points of view, and a person criticised on such an issue must be given a right of reply or a reasonable opportunity to respond.'
      }
    ]
  },
  {
    id: 'bccsa_on',
    name: 'BCCSA Code of Conduct for Online Content Services for Licensed Broadcasters',
    shortName: 'BCCSA Online',
    category: 'Media & Broadcasting Codes',
    description: 'South African online content code for licensed broadcasters.',
    jurisdictionContext: 'South Africa (Digital & Streaming)',
    clauses: [
      {
        id: 'BCCSA-ON-2.2',
        title: 'Propaganda for war, incitement of violence, and advocacy of hatred',
        text: 'A signatory must not make available online content which, judged within context, amounts to propaganda for war, incitement of imminent violence, or advocacy of hatred based on race, ethnicity, religion, or gender that constitutes incitement to cause harm.'
      },
      {
        id: 'BCCSA-ON-9.1',
        title: 'Truthful, accurate, and fair news',
        text: 'News must be reported truthfully, accurately, and fairly, and presented in the correct context and in a fair manner, without intentional or negligent departure from the facts.'
      },
      {
        id: 'BCCSA-ON-9.6',
        title: 'Rectification of materially incorrect reports',
        text: 'Where it subsequently appears that a report was incorrect in a material respect, it must be rectified forthwith, without reservation or delay, with adequate prominence and timing.'
      },
      {
        id: 'BCCSA-ON-10.1',
        title: 'Comment clearly distinguished from fact',
        text: 'Comment on and criticism of actions or events of public importance must be an honest expression of opinion, clearly presented as comment, and made on facts truly stated or fairly indicated and referred to.'
      },
      {
        id: 'BCCSA-ON-11',
        title: 'Controversial issues and right of reply',
        text: 'Where online content discusses a controversial issue of public importance, the signatory must make reasonable efforts to fairly present opposing points of view, and a person criticised on such an issue must be given the right to reply in the same or related content.'
      }
    ]
  },
  {
    id: 'press_code_sa',
    name: 'Code of Ethics and Conduct for South African Print and Online Media',
    shortName: 'Press Code SA',
    category: 'Media & Broadcasting Codes',
    description: 'South African print and online press code.',
    jurisdictionContext: 'South Africa (Print and online press)',
    clauses: [
      {
        id: 'PRESS-1.1',
        title: 'Accuracy, balance and context',
        text: 'The press shall take care to report news truthfully, accurately and fairly. News must be presented in context and in a balanced manner, without any intentional or negligent departure from the facts.'
      },
      {
        id: 'PRESS-1.3',
        title: 'Fact, opinion, allegation, rumor and supposition',
        text: 'The media shall present only what may reasonably be true as fact; opinions, allegations, rumours or suppositions shall be presented clearly as such.'
      },
      {
        id: 'PRESS-1.8',
        title: 'Views of the subject of critical reportage',
        text: 'The media shall seek, if practicable, the views of the subject of critical reportage in advance of publication, and such a subject should be afforded reasonable time to respond; if unable to obtain comment, this shall be stated.'
      },
      {
        id: 'PRESS-1.10',
        title: 'Corrections, retractions, explanations and apologies',
        text: 'The media shall make amends for presenting inaccurate information or comment by publishing promptly and with appropriate prominence a retraction, correction, explanation or an apology on every platform where the original content was published.'
      },
      {
        id: 'PRESS-5.1',
        title: 'Discriminatory or denigratory references',
        text: 'The media shall avoid discriminatory or denigratory references to people’s protected characteristics, and shall refer to such status only where it is strictly relevant to the matter reported, and if it is in the public interest.'
      },
      {
        id: 'PRESS-5.2',
        title: 'Hate speech and incitement to cause harm',
        text: 'The media shall balance their right and duty to report and comment on matters of legitimate public interest against the obligation not to publish material that amounts to propaganda for war, incitement of imminent violence, or advocacy of hatred based on race, ethnicity, gender or religion that constitutes incitement to cause harm.'
      },
      {
        id: 'PRESS-7.2',
        title: 'Protected comment',
        text: 'Comment or criticism is protected even if it is extreme, unjust, unbalanced, exaggerated, or prejudiced, as long as it is without malice, on a matter of public interest, takes fair account of material facts that are true or reasonably true, and is clearly presented as comment.'
      }
    ]
  },
  {
    id: 'cope',
    name: 'COPE Core Practices for Journal Publishing',
    shortName: 'COPE Core Practices',
    category: 'Academic & Publishing Standards',
    description: 'Publication-ethics framework for journals and editors.',
    fullTextUrl: 'https://publicationethics.org/core-practices',
    clauses: [
      {
        id: 'COPE-INTEGRITY',
        title: 'Research Integrity and Transparency',
        text: 'Use COPE to assess whether journals support transparent methods, reproducibility, data integrity, and fair handling of concerns about unreliable or selective evidence.'
      },
      {
        id: 'COPE-REVIEW',
        title: 'Fair and Objective Peer Review',
        text: 'Use COPE to assess whether peer review and editorial decisions are objective, respectful, and insulated from political pressure, ideological tests, or discrimination against authors.'
      },
      {
        id: 'COPE-CORRESPONDENCE',
        title: 'Disputes, Complaints, and Scholarly Correspondence',
        text: 'Use COPE to assess whether journals provide credible mechanisms for correspondence, complaints, critique, and responses when a publication is alleged to be misleading, biased, or ethically compromised.'
      },
      {
        id: 'COPE-CORRECT',
        title: 'Corrections, Expressions of Concern, and Retractions',
        text: 'Use COPE to assess whether editors have appropriate processes for correction, retraction, or expressions of concern when the published record may be unreliable or distorted.'
      }
    ]
  },
  {
    id: 'textlens_framework',
    name: 'TextLens Rhetorical Analysis Framework',
    shortName: 'TextLens Framework',
    category: 'Rhetorical Frameworks',
    description: 'Internal TextLens Layer 3 taxonomy for rhetorical and evidentiary patterns.',
    clauses: [
      {
        id: 'TEXTLENS-1',
        title: 'Layer 3 Family 1: Evidence handling',
        text: 'Use this family to assess verification bypass, selective evidence, background omission, trigger omission, contested claims stated as fact, and source inflation.'
      },
      {
        id: 'TEXTLENS-2',
        title: 'Layer 3 Family 2: Language and emphasis',
        text: 'Use this family to assess emotional loading, unequal humanisation, asymmetric certainty, loaded labels, and scale distortion.'
      },
      {
        id: 'TEXTLENS-3',
        title: 'Layer 3 Family 3: Agency and responsibility',
        text: 'Use this family to assess passive responsibility, agency imbalance, intention inflation, and responsibility transfer.'
      },
      {
        id: 'TEXTLENS-4',
        title: 'Layer 3 Family 4: Conflation and substitution',
        text: 'Use this family to assess group conflation, government-state-people conflation, policy-to-existence shifts, and analogy treated as proof.'
      },
      {
        id: 'TEXTLENS-5',
        title: 'Layer 3 Family 5: Frame-shifting and preconditions',
        text: 'Use this family to assess scope expansion, subject change, silence disqualification, preconditions on discussing antisemitism, and context substitution.'
      },
      {
        id: 'TEXTLENS-6',
        title: 'Layer 3 Family 6: Immunity and counter-attack',
        text: 'Use this family to assess credentialed immunity, definition immunity, smear dismissal, motive attack, victim reversal, and counter-accusation.'
      },
      {
        id: 'TEXTLENS-7',
        title: 'Layer 3 Family 7: Authority and amplification',
        text: 'Use this family to assess expertise laundering, institutional amplification, and moral inheritance. Cumulative framing across multiple publications is reserved for a later multi-document build.'
      }
    ]
  },
  {
    id: 'icmje_recommendations_2026',
    name: 'ICMJE Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals',
    shortName: 'ICMJE Recommendations',
    category: 'Academic & Publishing Standards',
    description: 'Medical-journal recommendations on authorship, conflicts, and editorial standards.',
    fullTextUrl: 'https://www.icmje.org/icmje-recommendations.pdf',
    clauses: [
      {
        id: 'ICMJE-AUTHOR',
        title: 'Authorship and Accountability',
        text: 'Use ICMJE to assess whether author roles, accountability, and responsibility for the accuracy and integrity of the work are made clear.'
      },
      {
        id: 'ICMJE-COI',
        title: 'Conflict of Interest Disclosure',
        text: 'Use ICMJE to assess whether relevant financial and non-financial conflicts are disclosed and whether sponsorship or institutional interests may affect credibility.'
      },
      {
        id: 'ICMJE-MEDIA',
        title: 'Editorial Independence and Responsible Public Communication',
        text: 'Use ICMJE to assess whether editorial freedom is protected and whether medical claims are communicated to the public with appropriate distinction between evidence, opinion, advocacy, and prepublication publicity.'
      },
      {
        id: 'ICMJE-AI',
        title: 'Responsible Use of Artificial Intelligence in Publishing',
        text: 'Use ICMJE to assess whether AI-assisted tools are disclosed appropriately and whether human authors remain accountable for accuracy, integrity, attribution, and review of AI-generated content.'
      }
    ]
  },
  {
    id: 'wame_geopolitical_intrusion_editorial_decisions',
    name: 'WAME Geopolitical Intrusion Policy',
    shortName: 'WAME Geopolitical Policy',
    category: 'Academic & Publishing Standards',
    description: 'Guidance on editorial independence under geopolitical pressure.',
    fullTextUrl: 'https://wame.org/policies',
    clauses: [
      {
        id: 'WAME-GEO-INDEPENDENCE',
        title: 'Editorial Independence from Geopolitical Campaigns',
        text: 'Use WAME to assess whether editorial choices appear to be driven by political, geopolitical, or institutional pressure rather than consistent editorial standards.'
      },
      {
        id: 'WAME-GEO-CONSISTENCY',
        title: 'Consistent Standard Application',
        text: 'Use WAME to assess whether similar submissions, authors, or geopolitical contexts are being handled by consistent editorial criteria rather than selective scrutiny.'
      },
      {
        id: 'WAME-GEO-ADVOCACY',
        title: 'Activism versus Editorial Judgement',
        text: 'Use WAME to assess whether advocacy or institutional positioning is being presented as if it were neutral editorial or scientific judgement.'
      }
    ]
  },
  {
    id: 'wame_publication_ethics_policies',
    name: 'WAME Core Publication Ethics Policies',
    shortName: 'WAME Publishing Ethics',
    category: 'Academic & Publishing Standards',
    description: 'Publication-ethics guidance for editors and peer review.',
    fullTextUrl: 'https://wame.org/policies',
    clauses: [
      {
        id: 'WAME-ETH-COI',
        title: 'Conflicts of Interest and Professionalism',
        text: 'Use WAME to assess whether authors, editors, and reviewers disclose conflicts and maintain professional, transparent journal processes.'
      },
      {
        id: 'WAME-ETH-PEER_REVIEW',
        title: 'Peer-Review Objectivity',
        text: 'Use WAME to assess whether peer review is focused on scientific merit and is insulated from personal, political, or geopolitical bias.'
      },
      {
        id: 'WAME-ETH-CORRECTIONS',
        title: 'Mandate to Correct the Record',
        text: 'Use WAME to assess whether a journal has appropriate mechanisms for correction, retraction, expressions of concern, and post-publication accountability.'
      }
    ]
  },
  {
    id: 'jama_race_ethnicity_guidance_2021',
    name: 'JAMA Guidance on Race and Ethnicity Reporting',
    shortName: 'JAMA Identity Guidance',
    category: 'Academic & Publishing Standards',
    description: 'Guidance on precise, non-essentialist identity language.',
    fullTextUrl: 'https://jamanetwork.com/journals/jama/fullarticle/2783090',
    clauses: [
      {
        id: 'JAMA-RACE-JUSTIFICATION',
        title: 'Justified Identity Cataloging',
        text: 'Use JAMA guidance to assess whether identity categories are clearly defined and whether their use is justified by the claims being made.'
      },
      {
        id: 'JAMA-RACE-DATA',
        title: 'Definition, Source, and Reporting of Categories',
        text: 'Use JAMA guidance to assess whether authors explain how categories were determined, whether they were self-reported or assigned, and whether broad labels obscure important differences.'
      },
      {
        id: 'JAMA-RACE-NON_ESSENTIALIST',
        title: 'Non-essentialist Representation',
        text: 'Use JAMA guidance to assess whether identity language avoids stigma, essentialism, and unsupported implications of biological or social determinism.'
      }
    ]
  },
  {
    id: 'schwitzer_health_journalism_500_stories_2008',
    name: 'Schwitzer Health Journalism Evaluation Framework',
    shortName: 'Schwitzer Framework',
    category: 'Media & Broadcasting Codes',
    description: 'Framework for evaluating public-facing health journalism.',
    fullTextUrl: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0050095',
    clauses: [
      {
        id: 'SCHWITZER-QUANTIFY',
        title: 'Quantitative Coverage of Benefits and Harms',
        text: 'Use the Schwitzer framework to assess whether stories quantify benefits and harms responsibly rather than relying on vague or sensational claims.'
      },
      {
        id: 'SCHWITZER-CONTEXT',
        title: 'Costs, Alternatives, and Evidence Quality',
        text: 'Use the Schwitzer framework to assess whether stories discuss costs, alternatives, limits of the evidence, and the quality of the underlying research.'
      },
      {
        id: 'SCHWITZER-INDEP-SOURCES',
        title: 'Independent Sourcing and Conflicts',
        text: 'Use the Schwitzer framework to assess whether stories rely on independent sources and disclose conflicts or incentives that may distort coverage.'
      }
    ]
  },
  {
    id: 'ahcj_health_journalism_principles',
    name: 'Association of Health Care Journalists Statement of Principles',
    shortName: 'AHCJ Principles',
    category: 'Media & Broadcasting Codes',
    description: 'Principles for accurate, independent health reporting.',
    fullTextUrl: 'https://healthjournalism.org/about-us/principles/',
    clauses: [
      {
        id: 'AHCJ-ACCURACY',
        title: 'Accuracy, Context, and Proportion',
        text: 'Use AHCJ principles to assess whether reporting is accurate, appropriately contextualized, and proportionate for a public audience.'
      },
      {
        id: 'AHCJ-INDEPENDENCE',
        title: 'Independence and Conflict Awareness',
        text: 'Use AHCJ principles to assess whether reporting is independent and whether conflicts, incentives, or affiliations are transparent.'
      },
      {
        id: 'AHCJ-TRANSPARENCY',
        title: 'Source Transparency and Public Service',
        text: 'Use AHCJ principles to assess whether sources are credible and transparent, and whether the story serves the public rather than sensationalism or agenda-driven framing.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_1',
    name: 'ICRC Customary IHL Rule 1: The Principle of Distinction between Civilians and Combatants',
    shortName: 'IHL Rule 1 (Civilians)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on distinction between civilians and combatants.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule1',
    clauses: [
      {
        id: 'IHL-RULE1-DISTINCTION',
        title: 'Civilian and Combatant Distinction',
        text: 'Use Rule 1 to assess whether the article clearly distinguishes civilians from combatants rather than collapsing protected civilians, armed actors, and political constituencies into a single category.'
      },
      {
        id: 'IHL-RULE1-ATTACK-DIRECTION',
        title: 'Attacks Directed against Civilians',
        text: 'Use Rule 1 to assess whether claims about attacks on civilians are carefully attributed, whether relevant status qualifiers are acknowledged, and whether allegations are kept distinct from settled legal findings.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_7',
    name: 'ICRC Customary IHL Rule 7: The Principle of Distinction between Civilian Objects and Military Objectives',
    shortName: 'IHL Rule 7 (Civilian Objects)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on civilian objects and military objectives.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule7',
    clauses: [
      {
        id: 'IHL-RULE7-OBJECTS',
        title: 'Civilian Objects and Military Objectives',
        text: 'Use Rule 7 to assess whether the article explains why an object is being described as civilian, military, or dual-use, rather than assuming status from rhetoric alone.'
      },
      {
        id: 'IHL-RULE7-DIRECT-ATTACKS',
        title: 'Direct Attack versus Incidental Damage',
        text: 'Use Rule 7 to assess whether the article distinguishes a claim of direct attack on a civilian object from collateral damage, and avoids treating damage alone as proof of illegality.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_14',
    name: 'ICRC Customary IHL Rule 14: Proportionality in Attack',
    shortName: 'IHL Rule 14 (Proportionality)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on proportionality in attack.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule14',
    clauses: [
      {
        id: 'IHL-RULE14-PROPORTIONALITY',
        title: 'Excessive Incidental Harm Standard',
        text: 'Use Rule 14 to assess whether proportionality is described as a test about expected incidental civilian harm in relation to anticipated concrete and direct military advantage, rather than as a synonym for tragedy or outrage.'
      },
      {
        id: 'IHL-RULE14-EX-ANTE',
        title: 'Context and Ex Ante Assessment',
        text: 'Use Rule 14 to assess whether the article distinguishes outcome-based casualty totals from the ex ante legal assessment described in the source, and whether it separates allegation, expert view, and adjudicated finding.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_15',
    name: 'ICRC Customary IHL Rule 15: Precautions in Attack',
    shortName: 'IHL Rule 15 (Precautions)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on precautions in attack.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule15',
    clauses: [
      {
        id: 'IHL-RULE15-PRECAUTIONS',
        title: 'Constant Care and Feasible Precautions',
        text: 'Use Rule 15 to assess whether the article discusses constant care, feasible precautions, warnings, and mitigation steps separately from the eventual outcome of an operation.'
      },
      {
        id: 'IHL-RULE15-FEASIBILITY',
        title: 'Feasibility and Available Information',
        text: 'Use Rule 15 to assess whether the article identifies what precautions were allegedly available at the time, what information was known or disputed, and whether failure of outcome is being conflated with failure to take precautions.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_25',
    name: 'ICRC Customary IHL Rule 25: Medical Personnel',
    shortName: 'IHL Rule 25 (Medical Personnel)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on protected medical personnel.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule25',
    clauses: [
      {
        id: 'IHL-RULE25-MEDICAL-PERSONNEL',
        title: 'Protected Medical Personnel',
        text: 'Use Rule 25 to assess whether the article distinguishes medical personnel from combatants or political actors, and whether it describes exclusive medical assignment and protected status with care.'
      },
      {
        id: 'IHL-RULE25-LOSS-OF-PROTECTION',
        title: 'Loss of Protection and Defensive Arming',
        text: 'Use Rule 25 to assess whether the article explains any alleged loss of protection precisely, avoids treating ordinary medical work or defensive small arms as hostile conduct, and attributes claims of targeting or obstruction to evidence.'
      }
    ]
  },
  {
    id: 'icrc_customary_ihl_rule_28',
    name: 'ICRC Customary IHL Rule 28: Medical Units',
    shortName: 'IHL Rule 28 (Medical Units)',
    category: 'Academic & Publishing Standards',
    description: 'Customary IHL rule on protected medical units.',
    fullTextUrl: 'https://ihl-databases.icrc.org/en/customary-ihl/v1/rule28',
    clauses: [
      {
        id: 'IHL-RULE28-MEDICAL-UNITS',
        title: 'Protected Medical Units',
        text: 'Use Rule 28 to assess whether the article distinguishes medical units from other civilian infrastructure and whether it describes their protected status, humanitarian function, and unimpeded operation carefully.'
      },
      {
        id: 'IHL-RULE28-WARNING-LOSS',
        title: 'Loss of Protection, Misuse, and Warning',
        text: 'Use Rule 28 to assess whether allegations of misuse, shielding, military use, or loss of protection are precisely described, and whether any warning requirement or reasonable time-limit is acknowledged where relevant.'
      }
    ]
  },
  {
    id: 'icrc_health_care_in_danger_making_case',
    name: 'ICRC Health Care in Danger: Making the Case',
    shortName: 'ICRC Care in Danger',
    category: 'Academic & Publishing Standards',
    description: 'ICRC report on violence against health care.',
    fullTextUrl: 'https://www.icrc.org/en/publication/4072-health-care-danger-making-case',
    clauses: [
      {
        id: 'ICRC-HCID-VIOLENCE',
        title: 'Violence Against Healthcare',
        text: 'Use this report to assess whether attacks on healthcare personnel, facilities, ambulances, or patients are described precisely and attributed responsibly.'
      },
      {
        id: 'ICRC-HCID-ACCESS',
        title: 'Obstruction, Access, and Care Disruption',
        text: 'Use this report to assess whether active fighting, checkpoints, displacement, shortages, or insecurity are disrupting access to health care and whether those knock-on effects are explained with adequate context.'
      },
      {
        id: 'ICRC-HCID-FACILITIES',
        title: 'Attacks on Facilities, Ambulances, and Staff',
        text: 'Use this report to assess whether attacks on hospitals, clinics, ambulances, and health-care personnel are described with precision, attribution, and attention to the resulting humanitarian consequences.'
      },
      {
        id: 'ICRC-HCID-EXPLOITATION',
        title: 'Healthcare Suffering and Rhetorical Exploitation',
        text: 'Use this report to assess whether medical suffering is being instrumentalized rhetorically without sufficient factual grounding or attribution.'
      }
    ]
  },
  {
    id: 'icrc_healthcare_personnel_responsibilities_conflict',
    name: 'ICRC Responsibilities of Health-Care Personnel Working in Armed Conflicts and Other Emergencies',
    shortName: 'ICRC Responsibilities Code',
    category: 'Academic & Publishing Standards',
    description: 'ICRC guidance on health-care duties and rights in conflict.',
    fullTextUrl: 'https://www.icrc.org/en/publication/4073-responsibilities-health-care-personnel-working-armed-conflicts-and-other-emergencies',
    clauses: [
      {
        id: 'ICRC-RESP-DUTIES',
        title: 'Professional Duties and Patient Care',
        text: 'Use this guidance to assess whether healthcare personnel responsibilities, patient-care duties, and emergency constraints are described accurately.'
      },
      {
        id: 'ICRC-RESP-NEUTRALITY',
        title: 'Medical Neutrality and Conflict Settings',
        text: 'Use this guidance to assess whether medical neutrality is used precisely and whether professional healthcare roles are separated from partisan or rhetorical claims.'
      },
      {
        id: 'ICRC-RESP-RIGHTS',
        title: 'Rights and Protection of Health-Care Personnel',
        text: 'Use this guidance to assess whether the rights of health-care personnel, including protection when they carry out impartial medical duties or refuse unlawful orders, are described carefully and in context.'
      },
      {
        id: 'ICRC-RESP-RECORDS',
        title: 'Records, Confidentiality, and Sensitive Information',
        text: 'Use this guidance to assess whether health-care records, confidentiality, disclosure of information, and handling of sensitive data are discussed responsibly in conflict settings.'
      },
      {
        id: 'ICRC-RESP-WITNESSING',
        title: 'Witnessing Violations, Media, and Professional Judgment',
        text: 'Use this guidance to assess whether articles accurately handle the dilemmas of witnessing violations, speaking to the media, and balancing ethical duties with security and legal constraints.'
      }
    ]
  },
  {
    id: 'cse_publication_ethics_white_paper',
    name: 'Council of Science Editors White Paper on Scientific Publication Integrity',
    shortName: 'CSE Publication Ethics',
    category: 'Academic & Publishing Standards',
    description: 'White paper on scientific publication integrity.',
    fullTextUrl: 'https://www.councilscienceeditors.org/resource-library/editorial-policies/white-paper-on-publication-ethics/',
    clauses: [
      {
        id: 'CSE-ETH-INTEGRITY',
        title: 'Integrity of the Scientific Record',
        text: 'Use the CSE white paper to assess whether journals and editors are preserving the integrity of the published record responsibly.'
      },
      {
        id: 'CSE-ETH-CORRECTION',
        title: 'Corrections, Retractions, and Expressions of Concern',
        text: 'Use the CSE white paper to assess whether flaws, unreliable claims, or misleading publications warrant correction, retraction, or formal concern.'
      },
      {
        id: 'CSE-ETH-ACCOUNTABILITY',
        title: 'Authorship, Conflicts, and Editorial Accountability',
        text: 'Use the CSE white paper to assess whether authorship, conflicts of interest, and peer-review or editorial responsibilities are handled transparently.'
      }
    ]
  }
];
