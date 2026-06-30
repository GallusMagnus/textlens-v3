export interface MethodLayer {
  level: number;
  name: string;
  focus: string;
  description: string;
  indicators: string[];
  examples: {
    biasedSnippet: string;
    analysisExplain: string;
  }[];
}

export const methodsLayers: MethodLayer[] = [
  {
    level: 1,
    name: 'Direct Antisemitic Content & Collective Bias',
    focus: 'Classic Stereotypes, Slurs, and Direct Identity Discrimination',
    description: 'This foundational layer addresses overt and traditional manifestations of anti-Jewish prejudice that are independent of contemporary geopolitical conflicts. It evaluates the text for standard historical tropes, slurs, assertions of collective guilt, and structural exclusion targeting Jewish individuals as a group.',
    indicators: [
      'Statements attributing collective guilt or responsibility to all Jewish people for specific real or imagined crimes.',
      'Classic conspiracy theories claiming global dominance, media monopoly, financial manipulation, or dual loyalty.',
      'Dehumanizing, demonizing, or cartoonish depictions of Jewish traits, rituals, or institutions.',
      'Exclusionary demands or institutional filters that strip Jewish individuals of rights, associations, or professional participation.'
    ],
    examples: [
      {
        biasedSnippet: '"...complicity of individual clinical professionals who consistently prioritize tribal-national supremacy, demonstrating a collective genetic predisposition to exclude others..."',
        analysisExplain: 'This represents a direct Layer 1 violation. It attributes a genetic, hereditary moral deficiency to all individuals belonging to a specific national/religious group, reinforcing traditional pseudoscientific racial theories.'
      }
    ]
  },
  {
    level: 2,
    name: 'Contemporary Geopolitical & Israel-Linked Bias',
    focus: 'Sovereign Exceptionalism, Historical Inversions, and Associative Hostility',
    description: 'This layer assesses bias where contemporary Middle East conflicts and references to Zionism are used as vectors for anti-Jewish prejudice. It systematically evaluates whether criticism of Israel crosses the boundary from legitimate political debate into discriminatory targeting of Jewish identity.',
    indicators: [
      'Drawing analogies or comparisons between contemporary Israeli defense actions and the actions or ideology of National Socialist Germany (the Holocaust Inversion).',
      'Holding Jewish individuals, academics, or community organizations in the diaspora responsible for the policies or decisions of the State of Israel (Associative Hostility).',
      'Demanding that Jewish individuals or institutions publicly issue disavows of Israel as a condition for entry into professional, social, or academic spaces (Identity Screening).',
      'Denying the Jewish people’s historical roots, ethnic indigeneity, or connection to the territory while granting those historical rights to all other global national groups.'
    ],
    examples: [
      {
        biasedSnippet: '"...collaborators in a project that mirrors the crimes of National Socialist Germany during World War II..."',
        analysisExplain: 'This represents a Layer 2 historical inversion. It weaponizes the specific, highly documented historical genocide perpetrated against the Jewish people to characterize contemporary defensive actions, aiming to maximize psychological trauma rather than formulate a objective critique.'
      }
    ]
  },
  {
    level: 3,
    name: 'Rhetorical and Evidentiary Taxonomy',
    focus: 'Evidence Handling, Framing, Agency, Conflation, Preconditions, and Authority Effects',
    description: 'This layer focuses on the linguistic, structural, and evidentiary techniques that can distort interpretation under a veneer of academic, legal, journalistic, or medical objectivity. It identifies specific analytical structures without treating them as self-sufficient proof of antisemitism.',
    indicators: [
      'Using biological, medical, or clinical terminology (e.g., "cancer", "fungus", "parasite") to define a national population (Pathological Metaphors).',
      'Systematic erasure of preceding hostilities, historic peace initiatives, or internationally recognized defense treaties to present one party as acting with unprovoked, absolute malice (Selective Citation).',
      'Presenting unverified, highly partisan reports or social media allegations as established, peer-reviewed clinical or legal fact (Distorted Evidentiary Sourcing).',
      'Applying hyper-scrutinized double standards to sovereign military activity, rules of engagement, or civil liberties that are never applied to any other state in equivalent geopolitical situations.'
    ],
    examples: [
      {
        biasedSnippet: '"...the state acts as a cancerous force, a parasitic cell cluster demanding immediate surgical excision..."',
        analysisExplain: 'This is a Layer 3 violation using epidemiological pathologizing language. It strips human subjects of their human status, defining their national community as a biological disease or parasite to bypass legal constraints and make extreme exclusion appear scientifically necessary.'
      }
    ]
  }
];
