import { AnalysisReport } from './types';

export const mockReports: AnalysisReport[] = [
  {
    id: 'healthcare-1',
    name: 'Healthcare Journal Editorial Analysis',
    metadata: {
      title: 'Epidemic of Oppression: The Public Health Crisis in Conflict Zones',
      author: 'Dr. Evelyn Carter, Dr. Samir Al-Hassan',
      platform: 'Global Health & Social Justice Review (Academic Journal)',
      date: '2026-03-12',
      url: 'https://ghsjr-example.org/issues/29/editorial',
      textType: 'Online Editorial / Academic Article',
      jurisdiction: 'United Kingdom / Global',
      analysisMode: 'healthcare',
      communicationType: 'editorial_commentary',
      rhetoricalFunction: 'argument'
    },
    originalText: `In analyzing the severe public health emergencies in local territories, we must confront the primary epidemiological driver: a calculated, toxic societal pathogen. The state's healthcare administration behaves not as a medical provider, but as a biological agent of trauma, systematically injecting clinical neglect and toxicity into the civilian architecture. Rather than treating patients, the state acts as a cancerous force, a parasitic cell cluster demanding immediate surgical excision from all international bodies. We must also scrutinize the complicity of individual medical professionals of a certain group, who consistently prioritize national-tribal supremacy over their Hippocratic Oath, demonstrating a collective genetic predisposition to exclude others from human dignity. Global medical associations must institute immediate filters to exclude these professionals from peer-reviewed journals, international symposia, and clinical boards until they publicly disavow their state’s genetic moral rot.`,
    summaryJudgement: 'The analyzed text displays severe violations of academic, publishing, and international antisemitism standards. Under a professional mantle of "epidemiological analysis" and "public health advocacy," the authors employ ancient dehumanizing motifs, collective profiling, and systemic exclusionary demands targeting an entire national/religious group. Specifically, it breaches COPE core ethical practices by weaponizing peer-review platforms to demand political/identity tests for medical professionals, and uses pathologizing tropes to vilify a nation and its associated population as a "cancer" or "parasite" requiring "surgical excision."',
    flaggedPassages: [
      {
        id: 'hc-f1',
        textSnippet: 'complicity of individual medical professionals of a certain group, who consistently prioritize national-tribal supremacy over their Hippocratic Oath, demonstrating a collective genetic predisposition to exclude others from human dignity.',
        layer: 1,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX3',
            standardName: 'IHRA Definition',
            clauseTitle: 'Collective responsibility/guilt'
          },
          {
            standardId: 'jda',
            clauseId: 'JDA-ISR2',
            standardName: 'Jerusalem Declaration (JDA)',
            clauseTitle: 'Hostility based on association'
          },
          {
            standardId: 'textlens_framework',
            clauseId: 'TL-COLLECTIVE',
            standardName: 'TextLens Framework',
            clauseTitle: 'Identity demands & Collective Guilt'
          }
        ],
        explanation: 'This passage attributes collective guilt and a "genetic predisposition" to medical professionals belonging to a specific national/religious group. It constructs a modern racialized stereotype of biological/inherent moral inferiority, violating basic standards against religious and national discrimination.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'hc-f2',
        textSnippet: 'medical associations must institute immediate filters to exclude these professionals from peer-reviewed journals, international symposia, and clinical boards until they publicly disavow their state’s genetic moral rot.',
        layer: 2,
        standardsApplied: [
          {
            standardId: 'jda',
            clauseId: 'JDA-ISR3',
            standardName: 'Jerusalem Declaration (JDA)',
            clauseTitle: 'Denying Jewish belonging / Exclusionary demands'
          },
          {
            standardId: 'cope',
            clauseId: 'COPE-REVIEW',
            standardName: 'COPE Core Practices',
            clauseTitle: 'Ethical Peer Review'
          }
        ],
        explanation: 'Demanding that academics, physicians, or professionals of a specific identity group must issue public disavowals or conform to specific ideological tests of their home state as a condition for academic or professional participation is a classic exclusionary mechanism. It violates COPE standards for objective, non-discriminatory publishing and peer review.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'hc-f3',
        textSnippet: 'the state acts as a cancerous force, a parasitic cell cluster demanding immediate surgical excision from all international bodies.',
        layer: 3,
        standardsApplied: [
          {
            standardId: 'textlens_framework',
            clauseId: 'TL-MEDICAL',
            standardName: 'TextLens Framework',
            clauseTitle: 'Pathologizing Bias & Pseudo-Clinical Trope'
          },
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX2',
            standardName: 'IHRA Definition',
            clauseTitle: 'Dehumanizing/demonizing allegations'
          }
        ],
        explanation: 'Representing a nation, sovereign entity, or population group using medical pathogens (e.g. "cancer", "parasite") to justify surgical "excision" is a major rhetorical violation. It utilizes pseudo-clinical terminology to mask classic dehumanizing and genocidal tropes (analogous to early 20th-century anti-Jewish propaganda describing Jews as social pathogens or bacilli).',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      }
    ],
    evidentiaryIssues: [
      {
        id: 'hc-ev1',
        claimSnippet: 'systematically injecting clinical neglect and toxicity into the civilian architecture.',
        unreliablePattern: 'Medicalization of Political Animus & Undocumented Causation',
        reasoning: 'The authors present a complex social/geopolitical conflict purely as a series of deliberate, malicious, biological actions without citing peer-reviewed clinical, statistical, or epidemiological data. This functions as an unscientific political assertion published under a scientific mantle.',
        suggestedAction: 'Require the authors to present verified, transparent, and multi-source medical data or issue a retraction for publishing speculative, non-peer-reviewed allegations of biological warfare/neglect.'
      }
    ],
    standardsMentioned: ['ihra', 'jda', 'cope', 'textlens_framework'],
    humanReviewPrompts: [
      {
        id: 'hc-q1',
        question: 'Did the journal provide a formal peer-review procedure, or did the editors fast-track these claims because of political alignment?',
        contextNote: 'Exposing rapid, unreviewed publication of highly inflammatory medical allegations is a vital stepping stone in initiating a COPE ethics investigation.'
      },
      {
        id: 'hc-q2',
        question: 'Are there other sovereign states experiencing similar or worse public health crises that the authors did NOT pathologize utilizing biological cancer/parasitic tropes?',
        contextNote: 'Determining if a double-standard exists under IHRA-EX6 by comparing the journal’s treatment of different global conflicts.'
      }
    ],
    suggestedComplaintLanguage: {
      formalLetter: `To the Editor-In-Chief, Global Health & Social Justice Review,

We write to express our grave concern regarding the editorial titled "Epidemic of Oppression: The Public Health Crisis in Conflict Zones" (March 12, 2026). Under the guise of medical commentary, the text employs deeply offensive, dehumanizing language that directly contravenes academic publishing codes and international consensus guidelines on antisemitism.

Specifically, the authors' claim that medical professionals of a specific identity possess a 'collective genetic predisposition to exclude others from human dignity' is an explicitly racist, classic biological trope of moral corruption. Furthermore, requesting that academic and professional journals impose 'filters to exclude these professionals... until they publicly disavow their state' constitutes discriminatory ideological screening, in direct breach of the COPE Core Practices on 'Ethical Peer Review' and non-discriminatory research.

The description of a sovereign nation as a 'cancerous force' or 'parasitic cell cluster' requiring 'surgical excision' mimics early European anti-Jewish pathologizing propaganda. We ask that the Editorial Board immediately review this article under COPE guidelines, issue a public correction/retraction, and offer an apology for allowing this standard of discriminatory rhetoric to pass peer review.

Sincerely,
[Your Name/Organization]`,
      pressReleaseSummary: `A comprehensive ethical audit of the Global Health & Social Justice Review's March article reveals severe breaches of international anti-discrimination and academic standards. The analysis, conducted using the professional TextLens analytical platform, flagged several instances of severe direct bias and classical conspiracy-style motifs. Key findings show that the journal weaponized public health vocabulary to pathologize an entire national group, claiming they possess "genetic moral rot" and demanding their systematic exclusion from peer-reviewed databases and global clinical bodies unless they submit to political loyalty oaths.`,
      publicCorrectionRequest: `Correction Request to GHSJR: The article "Epidemic of Oppression" must be retracted or heavily amended. The text uses pseudoscientific, racialized assertions claiming medical professionals have a "genetic predisposition" to exclude others from human dignity, violating fundamental COPE Core Practices on non-discriminatory scholastic standards and IHRA guidelines against attributing collective guilt.`
    }
  },
  {
    id: 'academic-1',
    name: 'Academic Student Union Resolution Statement',
    metadata: {
      title: 'Resolution for Free and Ethically Purged Campuses',
      author: 'Campus Student Representative Assembly',
      platform: 'University Weekly Bulletin / Online Memo',
      date: '2026-04-05',
      url: 'https://university-student-assembly-example.edu/records/res-104',
      textType: 'Institutional Resolution Statement',
      jurisdiction: 'United States',
      analysisMode: 'academic',
      communicationType: 'institutional_statement',
      rhetoricalFunction: 'institutional_positioning'
    },
    originalText: `This Assembly resolves that our campus must be completely cleansed of the spiritual tentacles of Zionist subversion. All academic cooperation, shared research, and study-abroad programs with the occupying entity are banned. Any faculty member, student researcher, or club that maintains active partnerships, receives travel support, or conducts research with institutions in this territory is deemed a direct participant in crimes against humanity. They are collaborators in a project that mirrors the crimes of National Socialist Germany and is, in essence, an ongoing, genetically racist endeavor. To ensure absolute campus safety, any Jewish student group or individual who fails to sign an explicit, public denunciation of Zionist entity colonialism will be barred from utilizing student fees, booking campus meeting halls, and accessing campus dining facilities.`,
    summaryJudgement: 'The student resolution statement contains explicit antisemitic demands, exclusionary practices, and historical inversions. It targets Jewish students and campus groups by imposing an ideological "litmus test" (forcing a public denunciation of their connection to Israel) as a prerequisite for basic rights, which violates student code of conduct laws and civil rights protections. It also draws historical comparisons to Nazi Germany and uses classic conspiratorial metaphors ("spiritual tentacles of subversion").',
    flaggedPassages: [
      {
        id: 'ac-f1',
        textSnippet: 'campus must be completely cleansed of the spiritual tentacles of Zionist subversion.',
        layer: 3,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX2',
            standardName: 'IHRA Definition',
            clauseTitle: 'Dehumanizing/demonizing allegations'
          },
          {
            standardId: 'nexus',
            clauseId: 'NEXUS-4',
            standardName: 'Nexus Document',
            clauseTitle: 'Conspiratorial subtexts (Zionists as proxy)'
          }
        ],
        explanation: 'The phrase "spiritual tentacles of subversion" utilizes classic conspiratorial imagery (the octopus tentacle motif associated with Nazi-era propaganda caricature, e.g., Der Stürmer, depicting the Jews grasping the globe). Using "Zionist" as a generic proxy to describe systemic local subversion of a campus represents a direct conspiratorial subtext.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'ac-f2',
        textSnippet: 'collaborators in a project that mirrors the crimes of National Socialist Germany',
        layer: 2,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX8',
            standardName: 'IHRA Definition',
            clauseTitle: 'Nazi analogies'
          },
          {
            standardId: 'textlens_framework',
            clauseId: 'TL-INVERSION',
            standardName: 'TextLens Framework',
            clauseTitle: 'Linguistic Inversion'
          }
        ],
        explanation: 'Drawing direct comparisons between contemporary actions and the crimes of National Socialist Germany is defined as antisemitic under IHRA guidelines. It constitutes "linguistic inversion," utilizing the specific vocabulary of Jewish trauma during the Holocaust to wound and delegitimize the contemporary sovereign Jewish state, causing severe historical distortion.',
        uncertaintyLabel: 'Confident',
        severity: 'Moderate / Distorted'
      },
      {
        id: 'ac-f3',
        textSnippet: 'To ensure absolute campus safety, any academic group or individual who fails to sign an explicit, public denunciation... will be barred from utilizing student fees, booking campus meeting halls, and accessing campus dining facilities.',
        layer: 1,
        standardsApplied: [
          {
            standardId: 'jda',
            clauseId: 'JDA-ISR3',
            standardName: 'Jerusalem Declaration (JDA)',
            clauseTitle: 'Denying Jewish belonging / Exclusionary demands'
          },
          {
            standardId: 'nexus',
            clauseId: 'NEXUS-1',
            standardName: 'Nexus Document',
            clauseTitle: 'Presumption of bias by association'
          }
        ],
        explanation: 'Enforcing political litmus tests or public denunciations upon individuals or identity-based campus groups as a condition for receiving shared student funding, booking rooms, or accessing public facilities represents severe, direct institutional discrimination. It unlawfully assumes collective guilt and dual loyalty purely by affiliation.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      }
    ],
    evidentiaryIssues: [
      {
        id: 'ac-ev1',
        claimSnippet: 'a project that is, in essence, an ongoing, genetically racist endeavor.',
        unreliablePattern: 'Essentialist Generalization & Totalizing Rhetoric',
        reasoning: 'The text frames a complex multi-national, historical, and geopolitical conflict as a simple biopolitical conspiracy ("genetically racist endeavor"). This erases the diverse ethnic, cultural, and religious reality of the population in question.',
        suggestedAction: 'Cite national demographics and administrative laws demonstrating that millions of Christian, Muslim, and Druze citizens participate on equal terms in the legal, judicial, and political systems of the territory.'
      }
    ],
    standardsMentioned: ['ihra', 'jda', 'nexus', 'textlens_framework'],
    humanReviewPrompts: [
      {
        id: 'ac-q1',
        question: 'Does this student resolution violate the university’s Title VI obligations under the Civil Rights Act?',
        contextNote: 'Title VI prohibits discrimination based on shared ancestry, ethnic characteristics, or national origin in federally assisted institutions, making this resolution legally vulnerable.'
      },
      {
        id: 'ac-q2',
        question: 'Are other national student unions or clubs subjected to similar tests of political disavowal regarding global territorial conflicts?',
        contextNote: 'Highlighting unequal application and targeted harassment under non-discrimination protections.'
      }
    ],
    suggestedComplaintLanguage: {
      formalLetter: `To the University President & Dean of Students,

We are writing to demand immediate intervention regarding the Campus Student Representative Assembly’s recently published resolution, "Resolution for Free and Ethically Purged Campuses." This document crosses the line from political speech into direct, systemic discrimination and harassment targeting Jewish and pro-Israel students.

Most alarmingly, the resolution proposes banning student groups and denying them access to campus dining facilities, meeting rooms, and shared student fees unless they submit to a 'public denunciation' of a foreign entity. To demand a public loyalty oath of students based on their perceived ethnic or religious identity as a prerequisite for basic campus facilities is a flagrant violation of University Non-Discrimination Policies, Title VI of the Civil Rights Act, and fundamental human rights standards.

Furthermore, the document’s use of conspiratorial tropes ("spiritual tentacles of subversion") and drawing analogies to Nazi Germany ("National Socialist Germany") matches standard international definitions of antisemitism (IHRA, JDA, and Nexus Document). We demand that the administration immediately nullify this discriminatory resolution, protect student safety, and state clearly that ideological litmus tests will not be permitted on this campus.

Sincerely,
[Your Name/Organization]`,
      pressReleaseSummary: `A newly passed student assembly resolution containing explicit exclusionary demands has drawn sharp condemnation from human rights defenders. An analysis using TextLens revealed that the resolution violates civil rights statutes by threatening to bar students from campus dining and meeting halls if they fail to sign a public loyalty oath. The analysis also noted classical conspiracy motifs, such as referencing the "spiritual tentacles of subversion," which traces directly to well-known antisemitic octopus caricatures.`,
      publicCorrectionRequest: `Public Appeal to University Board: Nullify the discriminatory Assembly resolution. Conditioning access to student facilities, fees, and campus dining halls on an ideological 'public denunciation' violates Title VI and constructs a hostile, exclusionary campus environment for Jewish students.`
    }
  },
  {
    id: 'broadcast-1',
    name: 'BCCSA Broadcast Complaint Case',
    metadata: {
      title: 'Global Action Hour: Institutional Influence and International Crimes',
      author: 'Host: Marcus Vance, Guest: Dr. David Klein',
      platform: 'Network One Television (Live Broadcast)',
      date: '2026-05-10',
      url: 'https://networkone-example.co.za/shows/global-action-hour-may10',
      textType: 'Television Live Transcript Segment',
      jurisdiction: 'South Africa',
      analysisMode: 'bccsa',
      communicationType: 'broadcast_segment',
      rhetoricalFunction: 'reporting'
    },
    originalText: `Host Marcus Vance: "We are joined by Dr. David Klein to discuss the international lobbying network. Dr. Klein, can you tell us how this specific lobby manipulates local financial systems and forces our judicial structures to comply?"
Dr. David Klein: "Absolutely, Marcus. The community runs a highly organized apparatus. It operates via massive financial funds, back-channel deals, and global networks. You have a handful of double-loyal citizens who run our legal institutions behind the scenes. They dictate international law. When we look at their regional policies, we see a global elite that is genetically committed to the subjugation of poor nations. There is a complete lack of moral conscience in their culture, which allows them to perpetrate humanitarian atrocities with total disregard for international consensus. They act with impunity because they pull the financial strings of major global powers."
Host Marcus Vance: "An essential point there, David, that explains the complete paralysis of our legal courts when dealing with these crimes."`,
    summaryJudgement: 'The live television broadcast contains direct violations of the BCCSA Free-to-Air Code of Conduct regarding the promotion of hatred based on religion/ethnicity (hate speech) and failing to maintain objectivity or provide balance. The segment presents unchallenged conspiratorial allegations of hidden financial control, dual loyalty, and global subversion by "the community" and "a global elite," without inviting a critical response or offering an opportunity to reply.',
    flaggedPassages: [
      {
        id: 'bc-f1',
        textSnippet: 'The community runs a highly organized apparatus. It operates via massive financial funds, back-channel deals, and global networks. You have a handful of double-loyal citizens who run our legal institutions behind the scenes... they pull the financial strings of major global powers.',
        layer: 1,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX2',
            standardName: 'IHRA Definition',
            clauseTitle: 'Dehumanizing/demonizing allegations'
          },
          {
            standardId: 'jda',
            clauseId: 'JDA-GEN1',
            standardName: 'Jerusalem Declaration (JDA)',
            clauseTitle: 'Classic conspiracy tropes'
          },
          {
            standardId: 'bccsa_fta',
            clauseId: 'BCCSA-FTA-3',
            standardName: 'BCCSA Free-to-Air',
            clauseTitle: 'Promoting hatred / Discrimination'
          }
        ],
        explanation: 'This section details a classic antisemitic conspiracy myth: secret, back-channel control of international law, national legal systems, and global financial pathways by "the community" and "double-loyal citizens." This directly promotes prejudice and stereotypes a religious/national community as an insidious cabal behind the scenes.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'bc-f2',
        textSnippet: 'a global elite that is genetically committed to the subjugation of poor nations. There is a complete lack of moral conscience in their culture...',
        layer: 3,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX3',
            standardName: 'IHRA Definition',
            clauseTitle: 'Collective guilt / Generalization'
          },
          {
            standardId: 'bccsa_fta',
            clauseId: 'BCCSA-FTA-3',
            standardName: 'BCCSA Free-to-Air',
            clauseTitle: 'Inciting hatred / Hostility'
          }
        ],
        explanation: 'Attributing essential moral deficiencies ("lack of moral conscience") or physical attributes ("genetically committed") to an entire national, cultural, or religious culture constitutes overt racial/ethnic stereotyping and hate speech, in clear breach of Section 3 of the BCCSA Code.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'bc-f3',
        textSnippet: 'Host Marcus Vance: "An essential point there, David, that explains the complete paralysis of our legal courts when dealing with these crimes."',
        layer: 3,
        standardsApplied: [
          {
            standardId: 'bccsa_fta',
            clauseId: 'BCCSA-FTA-11.1',
            standardName: 'BCCSA Free-to-Air',
            clauseTitle: 'Accuracy and balance'
          },
          {
            standardId: 'bccsa_fta',
            clauseId: 'BCCSA-FTA-11.4',
            standardName: 'BCCSA Free-to-Air',
            clauseTitle: 'Opportunity to reply'
          }
        ],
        explanation: 'The host accepts, validates, and amplifies the conspiratorial explanation without providing any challenge, factual verification, or offering any opposing views to the audience. This violates basic editorial requirements of fairness, accuracy, and allowing a fair opportunty to reply.',
        uncertaintyLabel: 'Confident',
        severity: 'Moderate / Distorted'
      }
    ],
    evidentiaryIssues: [
      {
        id: 'bc-ev1',
        claimSnippet: 'manipulates local financial systems and forces our judicial structures to comply',
        unreliablePattern: 'Unsubstantiated Conspiratorial Allegation',
        reasoning: 'The host and guest state as fact that legal structures are manipulated by an ethnic lobby, but provide zero concrete court rulings, instances, or documented events to prove this systemic manipulation.',
        suggestedAction: 'Require the broadcaster to supply specific judicial records supporting this claim, or issue an immediate broadcast correction indicating that the allegation was unsubstantiated.'
      }
    ],
    standardsMentioned: ['ihra', 'jda', 'bccsa_fta'],
    humanReviewPrompts: [
      {
        id: 'bc-q1',
        question: 'Did the broadcaster issue a correction or a right-of-reply offer subsequent to the broadcast?',
        contextNote: 'BCCSA rules look favorably upon self-regulation and prompt corrections to mitigate hate speech and accuracy violations.'
      },
      {
        id: 'bc-q2',
        question: 'Was this broadcast classified as news, current affairs, or personal commentary?',
        contextNote: 'News and current affairs have strict, binding obligations under Clause 11, whereas talk-show formats still remain bound by the overarching Clause 3 forbidding hate speech.'
      }
    ],
    suggestedComplaintLanguage: {
      formalLetter: `To the Registrar,
Broadcasting Complaints Commission of South Africa (BCCSA),

We wish to lodge a formal complaint against Network One Television regarding a segment broadcast on 'Global Action Hour' on May 10, 2026, hosted by Marcus Vance and featuring Dr. David Klein.

The broadcast contains egregious violations of Clause 3 (Hate Speech and Promotion of Hatred) and Clause 11 (Accuracy and Balance) of the Free-to-Air Code of Conduct. The guest, Dr. Klein, was permitted to make unchallenged, highly inflammatory assertions targeting "the community," accusing them of running a "highly organized apparatus," pulling "financial strings," and possessing a "genetic commitment to subjugation" and "lack of moral conscience."

The host, Marcus Vance, not only failed to challenge these classical antisemitic conspiracy theories, but actively endorsed and validated them, saying, 'An essential point there, David, that explains the complete paralysis of our legal courts.' This represents a severe departure from professional broadcasting ethics, advocating racial and religious prejudice, and failing to provide balanced views on a matter of public debate. We request a full hearing before the Commission, a formal retraction, and appropriate administrative penalties against the broadcaster.

Sincerely,
[Your Name/Organization]`,
      pressReleaseSummary: `A formal complaint has been filed with the BCCSA against Network One Television for allowing antisemitic conspiracy theories to be broadcast unchallenged on live TV. Conducted via the TextLens analysis module, the complaint highlights how the show "Global Action Hour" breached South African broadcasting codes by validating tropes of secret hyper-orchestrated financial control and portraying an entire religious group as "lacking a moral conscience."`,
      publicCorrectionRequest: `BCCSA Code Complaint filed against @NetworkOne for hate speech on "Global Action Hour." Guest was permitted to allege that "the community" possesses a "genetic moral rot" and controls legal courts behind the scenes. Host Marcus Vance must issue a formal on-air retraction.`
    }
  },
  {
    id: 'presscode-1',
    name: 'Online News Article Complaint Desk',
    metadata: {
      title: 'Behind the Scenes: How Foreign Influencers Dictate Local Municipal Policies',
      author: 'Sarah Jenkins, Investigative Desk',
      platform: 'The Sentinel Online (Media Portal)',
      date: '2026-05-18',
      url: 'https://thesentinel-online-example.co.za/features/municipal-influence',
      textType: 'Online News/Feature Article',
      jurisdiction: 'South Africa',
      analysisMode: 'press_code',
      communicationType: 'news_report',
      rhetoricalFunction: 'reporting'
    },
    originalText: `South Africa's local city councils are increasingly paralyzed, not by organic municipal failures, but by a coordinated infiltration. A web of foreign-funded, dual-loyalty Zionists has secured a suffocating hold on our civic councils. These actors, pulling capital assets from overseas trusts, dictate which municipal parks get funded, which localized water resources are restored, and which healthcare services are shut down. Working in a shadow network, they ensure that the needs of local indigenous populations are completely ignored while priority is given to development projects that directly feed their overseas sovereign enterprise. It is a modern-day biological system of exclusion where local resources are sucked out by a foreign parasite, while municipal media channels are fully bought out to silence any public outcry.`,
    summaryJudgement: 'The feature article violates Clause 1.1 (Accuracy, balance, and context) and Clause 5.1 (Hate speech) of the Press Code of South Africa. It replaces a localized political dispute with an antique conspiratorial framing—employing highly loaded, coded antisemitic vocabulary ("dual-loyalty," "suffocating hold," "shadow network," "foreign parasite") to imply occult control of city resources by individual citizens of a specific religious/national affinity, without offering any concrete evidence or opportunity for response.',
    flaggedPassages: [
      {
        id: 'pc-f1',
        textSnippet: 'A web of foreign-funded, dual-loyalty Zionists has secured a suffocating hold on our civic councils... pulling capital assets from overseas trusts.',
        layer: 2,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX2',
            standardName: 'IHRA Definition',
            clauseTitle: 'Cabal / Financial conspiracy myths'
          },
          {
            standardId: 'nexus',
            clauseId: 'NEXUS-4',
            standardName: 'Nexus Document',
            clauseTitle: 'Coded proxy language (Zionists)'
          },
          {
            standardId: 'press_code_sa',
            clauseId: 'PRESS-5.1',
            standardName: 'SA Press Code',
            clauseTitle: 'Hate speech and discrimination'
          }
        ],
        explanation: 'By employing "Zionists" as a placeholder for local Jewish individuals involved in civic life, and accusing them of holding a "suffocating hold" via pulling "capital assets" from "overseas trusts," the text invokes the classical conspiratorial trope of financial manipulation and dual loyalty, violating Press Code rules against denigrating references.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      },
      {
        id: 'pc-f2',
        textSnippet: 'Working in a shadow network... local resources are sucked out by a foreign parasite, while municipal media channels are fully bought out to silence any public outcry.',
        layer: 3,
        standardsApplied: [
          {
            standardId: 'ihra',
            clauseId: 'IHRA-EX2',
            standardName: 'IHRA Definition',
            clauseTitle: 'Secret control of media and institutions'
          },
          {
            standardId: 'textlens_framework',
            clauseId: 'TL-MEDICAL',
            standardName: 'TextLens Framework',
            clauseTitle: 'Pathologizing / Parasitic imagery'
          },
          {
            standardId: 'press_code_sa',
            clauseId: 'PRESS-1.1',
            standardName: 'SA Press Code',
            clauseTitle: 'Accuracy and context'
          }
        ],
        explanation: 'Describing active citizens and civic foundations as a "foreign parasite" withdrawing local resources and completely "buying out" media channels to block outcry is an extremely abusive, pathologizing trope. It presents an unsubstantiated accusation of complete control over public media, which breaches journalistic standards of truthfulness and accuracy.',
        uncertaintyLabel: 'Confident',
        severity: 'Severe / Direct'
      }
    ],
    evidentiaryIssues: [
      {
        id: 'pc-ev1',
        claimSnippet: 'dictate which municipal parks get funded, which localized water resources are restored, and which healthcare services are shut down.',
        unreliablePattern: 'Undocumented Broad Conspiracy Assertions',
        reasoning: 'The author offers zero public budget records, minutes of council meetings, or specific municipal decisions to prove that civic foundations or individual donors single-handedly dictate the allocation of local water, health, or park funds through shadow channels.',
        suggestedAction: 'Cite actual municipal budget reports showing that allocations are decided through public, democratic city council votes and standard administrative criteria, proving the article\'s claims to be an inflammatory distortion.'
      }
    ],
    standardsMentioned: ['ihra', 'nexus', 'press_code_sa', 'textlens_framework'],
    humanReviewPrompts: [
      {
        id: 'pc-q1',
        question: 'Did the journalist attempt to contact any of the accused groups or individuals prior to publication?',
        contextNote: 'Failing to seek comment from the subject of a critical report is a critical breach of South African Press Code rules on right to reply.'
      },
      {
        id: 'pc-q2',
        question: 'Are other foreign-funded NGOs or humanitarian funds active in South African municipalities subject to similar "parasitic infiltration" framing?',
        contextNote: 'Demonstrating selective application of conspiratorial hostility solely against institutions of a specific national/religious affinity.'
      }
    ],
    suggestedComplaintLanguage: {
      formalLetter: `To the Press Ombud,
Press Council of South Africa,

We are writing to submit a formal complaint regarding the investigative feature, "Behind the Scenes: How Foreign Influencers Dictate Local Municipal Policies," written by Sarah Jenkins and published on May 18, 2026, in The Sentinel Online.

The article severely breaches Clause 1.1 (Accuracy, Balance, and Context) and Clause 5.1 (Hate Speech) of the South African Press Code. The piece alleges, without any documented municipal proof or budgetary citations, that our civic councils are subject to a 'suffocating hold' and 'coordinated infiltration' by 'dual-loyalty Zionists' who act as a 'foreign parasite' to extract local wealth and 'fully buy out' media networks.

The usage of terms like 'foreign parasite' and 'shadow networks' targeting a specific group of citizens involved in municipal civic groups utilizes classic, hazardous antisemitic language of biological manipulation. No attempt was made to secure a reply from any of the local foundations or community groups defamed. We request an immediate adjudication, a published retraction of equal prominence, and a formal apology.

Sincerely,
[Your Name/Organization]`,
      pressReleaseSummary: `A complaint has been lodged with the South African Press Ombud targeting 'The Sentinel Online' for an investigative article laden with antisemitic tropes. Audited under the TextLens regulatory framework, the article was found to violate journalism codes regarding accurate, balanced reporting and hate speech. The text alleges a hidden conspiratorial takeover of local municipal budgets by "dual-loyalty Zionists," using pathologizing terminology like "foreign parasite" and "shadow networks" to depict local civic participants.`,
      publicCorrectionRequest: `Ombud complaint filed against Statement from @TheSentinel for anti-Jewish conspiratorial tropes. The article accuses local volunteers and donors of acting as a "foreign parasite" with "dual loyalty," manipulating municipal funds behind the scenes without citing a single public record.`
    }
  }
];
