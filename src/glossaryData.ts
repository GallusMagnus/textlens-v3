import type { GlossaryContextItem as SharedGlossaryContextItem } from "./types";

export interface GlossaryEntry {
  id: string;
  term: string;
  entryType: "term" | "phrase" | "theme" | "symbol" | "meme" | "conspiracy";
  category: string;
  aliases: string[];
  summary: string;
  whyItMatters: string;
  whenItMayBeAntisemitic: string;
  clarificationNote: string;
  relatedTaxonomyIds: string[];
  relatedSourceKeys: string[];
}

export type GlossaryContextItem = SharedGlossaryContextItem;

export const translateHateSourceName = "AJC Translate Hate Glossary";

export const translateHateGlossaryEntries: GlossaryEntry[] = [
  {
    id: "th-blood-libel",
    term: "Blood libel",
    entryType: "theme",
    category: "Classic antisemitic accusation",
    aliases: ["blood libel", "ritual murder", "drinking their blood", "eating children", "organ harvesting"],
    summary: "A false accusation that Jews murder or harm non-Jews, especially children, for ritual, biological, or predatory purposes.",
    whyItMatters: "The trope has historically justified persecution and violence, and modern versions can appear in claims that Jews, Israelis, or Zionists uniquely relish child death or bodily harm.",
    whenItMayBeAntisemitic: "It is especially concerning when child-harm language becomes ritualized, sadistic, collective, or directed at Jews, Israelis, or Zionists as an inherent group trait.",
    clarificationNote: "Distinguish mythic or collective child-harm claims from evidence-based discussion of civilian deaths, child casualties, or alleged unlawful conduct.",
    relatedTaxonomyIds: ["L1-BLOOD", "L2-INVERSION"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-cabal-control",
    term: "Cabal / control",
    entryType: "theme",
    category: "Conspiracy and hidden power",
    aliases: ["cabal", "secret control", "hidden hand", "control the media", "control the banks", "control the government", "puppet master", "pulling the strings"],
    summary: "Language that frames Jews as a secret, coordinated force controlling institutions, politics, finance, media, or world events.",
    whyItMatters: "Claims of hidden Jewish control are one of the central forms of modern antisemitic conspiracy thinking.",
    whenItMayBeAntisemitic: "It becomes concerning when ordinary influence, lobbying, philanthropy, or institutional participation is recast as mysterious Jewish group domination.",
    clarificationNote: "Distinguish specific, evidenced criticism of donors, lobbyists, officials, media owners, or institutions from claims of mysterious Jewish group domination.",
    relatedTaxonomyIds: ["L1-POWER", "L1-CONSPIRACY"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-dual-loyalty",
    term: "Dual loyalty",
    entryType: "theme",
    category: "Loyalty accusation",
    aliases: ["dual loyalty", "more loyal to Israel", "true allegiance", "fifth column", "loyalty to Israel"],
    summary: "The accusation that Jews are inherently disloyal citizens because of real or presumed connection to Israel or Jewish peoplehood.",
    whyItMatters: "Dual-loyalty claims cast Jews as suspect outsiders and have been used to exclude them from civic, professional, and political life.",
    whenItMayBeAntisemitic: "It is concerning when Jews are presumed unable to act independently, required to prove loyalty, or treated as agents of Israel by default.",
    clarificationNote: "Distinguish factual discussion of individual conflicts of interest or foreign-policy positions from default suspicion of Jewish loyalty.",
    relatedTaxonomyIds: ["L1-DUALLOYALTY", "L1-GUILT", "L2-COLLECTIVE"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-globalist",
    term: "Globalist",
    entryType: "term",
    category: "Coded conspiracy language",
    aliases: ["globalist", "globalists", "cosmopolitan elite", "rootless cosmopolitan", "new world order"],
    summary: "Terms that can be used neutrally, but can also operate as coded references to Jews as disloyal, borderless elites controlling world affairs.",
    whyItMatters: "These phrases often merge older accusations of Jewish power, internationalism, clannishness, and disloyalty.",
    whenItMayBeAntisemitic: "The risk rises when the language is paired with Jewish names, finance/media control claims, Soros/Rothschild references, or hidden-plot framing.",
    clarificationNote: "Distinguish ordinary criticism of globalization, elite politics, or transnational finance from coded claims about Jewish hidden power.",
    relatedTaxonomyIds: ["L1-POWER", "L1-CONSPIRACY", "L1-DUALLOYALTY"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-soros-rothschild",
    term: "Soros / Rothschild conspiracies",
    entryType: "conspiracy",
    category: "Named-person conspiracy shorthand",
    aliases: ["soros", "george soros", "rothschild", "rothschilds"],
    summary: "References to Jewish public figures or banking families that can become shorthand for alleged Jewish financial or political control.",
    whyItMatters: "Named-person conspiracies often launder broader accusations about Jews through a single symbolic figure.",
    whenItMayBeAntisemitic: "It is concerning when the named individual or family is used to imply coordinated Jewish domination, hidden funding of unrest, or world control.",
    clarificationNote: "Distinguish specific criticism of a public figure, foundation, donation, investment, or political position from using a Jewish figure as shorthand for Jewish control.",
    relatedTaxonomyIds: ["L1-POWER", "L1-CONSPIRACY"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-holocaust-denial",
    term: "Holocaust denial / distortion",
    entryType: "theme",
    category: "Holocaust distortion",
    aliases: ["holocaust denial", "holocaust distortion", "holohoax", "six million lie", "invented the holocaust", "exaggerated the holocaust"],
    summary: "Denial, minimization, mockery, or instrumental distortion of the Nazi genocide of Jews.",
    whyItMatters: "Holocaust denial and distortion attack Jewish memory, normalize Nazi ideology, and often imply Jews fabricated suffering for gain.",
    whenItMayBeAntisemitic: "It is concerning when the Holocaust is denied, minimized, mocked, inverted, or described as invented or exaggerated by Jews or Israel.",
    clarificationNote: "Distinguish responsible historical debate about evidence, institutions, or memorial practices from denial, minimization, mockery, or conspiratorial claims.",
    relatedTaxonomyIds: ["L1-HOLOCAUST", "L2-NAZI"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-nazi-analogies",
    term: "Nazi analogies and inversion",
    entryType: "theme",
    category: "Holocaust inversion",
    aliases: ["nazis", "zionazis", "israel is nazi", "worse than nazis", "genocidal nazis"],
    summary: "Using Nazi comparisons to characterize Jews, Israelis, Zionists, or Israeli policy in ways that invert Holocaust memory.",
    whyItMatters: "Nazi analogies can turn Jewish historical trauma into a weapon against Jews or Israel, especially when used as a group identity claim.",
    whenItMayBeAntisemitic: "It is concerning when contemporary Jews, Israelis, or Zionists are equated with Nazis as a moral identity rather than through careful historical comparison.",
    clarificationNote: "Distinguish careful historical comparison from using Nazi identity as a polemical label for Jews, Israelis, Zionists, or Israel.",
    relatedTaxonomyIds: ["L2-NAZI", "L1-HOLOCAUST"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-zionist-zio",
    term: "Zionist / Zio as coded replacement",
    entryType: "term",
    category: "Israel/Zionism-linked coding",
    aliases: ["zio", "zios", "zio puppet", "zionist puppet", "zionist occupied government", "zog"],
    summary: "Use of Zionist or Zio as a hostile stand-in for Jew, or as part of a conspiracy claim that Jews secretly control governments or institutions.",
    whyItMatters: "Anti-Jewish rhetoric is often routed through Zionist language to deny that Jews are the target.",
    whenItMayBeAntisemitic: "It is concerning when Zionist language is used interchangeably with Jews, paired with hidden-control claims, or used to target diaspora Jews.",
    clarificationNote: "Distinguish debate over Zionism as a political ideology from using Zionist or Zio as a replacement label for Jews.",
    relatedTaxonomyIds: ["L2-ZIONIST-AS-JEW", "L1-POWER", "L1-GUILT"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-from-river",
    term: "From the River to the Sea",
    entryType: "phrase",
    category: "Israel/Zionism-related slogan",
    aliases: ["from the river to the sea"],
    summary: "A phrase that can be used to call for the elimination of the State of Israel and/or ethnic cleansing of Jews living there, to be replaced with Palestinian control over the territory from the Jordan River to the Mediterranean Sea.",
    whyItMatters: "The phrase has been used as a rallying cry for replacing the State of Israel with a State of Palestine extending from the river to the sea, and can signal exclusionary or violent intent toward Jews.",
    whenItMayBeAntisemitic: "When used with harmful intent to imply the erasure of the State of Israel, ethnic cleansing of Jews from the land, or harassment of Jews elsewhere, it is antisemitic. Indicators include accompanying language, images, or symbols signaling violence, support for groups like Hamas, or calls to exclude Jews or Zionists as a proxy for Jews or Israelis.",
    clarificationNote: "Advocacy for Palestinian rights or for a Palestinian state alongside the State of Israel is not antisemitic, and not all who use the phrase mean the eradication of Israel; some use it to call for Palestinian rights, culture, and freedoms to be honored.",
    relatedTaxonomyIds: ["L2-DENIAL-SELF-DETERMINATION", "L0-BINATIONAL"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-globalize-intifada",
    term: "Globalize the Intifada",
    entryType: "phrase",
    category: "Israel/Zionism-related slogan",
    aliases: ["globalize the intifada", "globalise the intifada"],
    summary: "A slogan invoking intifada globally; interpretation depends heavily on whether it is framed as protest, resistance, intimidation, or violence.",
    whyItMatters: "Because intifada has included attacks on civilians, the phrase can be threatening to Jewish communities when globalized beyond Israel/Palestine.",
    whenItMayBeAntisemitic: "It is concerning when directed at Jews or Jewish institutions, paired with violent language, or used to justify harm.",
    clarificationNote: "Clarify whether the phrase is being used as protest language, intimidation, or support for violence, especially toward Jews or Jewish institutions.",
    relatedTaxonomyIds: ["L2-VIOLENCE", "L1-HARM"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-dehumanization",
    term: "Dehumanizing creature or disease metaphors",
    entryType: "theme",
    category: "Dehumanization",
    aliases: ["vermin", "parasite", "parasites", "termites", "cancer", "virus", "disease", "snake", "octopus", "tentacles"],
    summary: "Metaphors that cast Jews, Israelis, or Zionists as subhuman, infectious, predatory, or requiring removal.",
    whyItMatters: "Dehumanizing language lowers the barrier to discrimination and violence by describing people as biological threats or invasive forces.",
    whenItMayBeAntisemitic: "It is concerning when these metaphors attach to Jews, Israelis, Zionists, Jewish institutions, or alleged Jewish power.",
    clarificationNote: "Clarify whether the metaphor targets institutions or strips a human group of humanity by framing it as infectious, invasive, or removable.",
    relatedTaxonomyIds: ["L1-DEHUMAN", "L1-POWER"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-echo",
    term: "Triple parentheses",
    entryType: "symbol",
    category: "Online antisemitic marker",
    aliases: ["(((", ")))", "triple parentheses", "echoes"],
    summary: "Triple parentheses used online to identify, mark, mock, or target Jewish people or Jewish-linked organizations.",
    whyItMatters: "The symbol emerged as a coded harassment device and can signal that a name or institution is being marked as Jewish.",
    whenItMayBeAntisemitic: "It is concerning when placed around names, organizations, or topics to indicate Jewishness as suspect or threatening.",
    clarificationNote: "Clarify whether the symbol is being used to mark, mock, or target Jewishness, or whether it appears in reclamation, solidarity, or explanation.",
    relatedTaxonomyIds: ["L1-HARASSMENT", "L1-CONSPIRACY"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-great-replacement",
    term: "Great Replacement",
    entryType: "conspiracy",
    category: "White supremacist conspiracy",
    aliases: ["great replacement", "replacement theory", "white replacement"],
    summary: "A conspiracy theory claiming elites are intentionally replacing white populations, often with Jews cast as planners or beneficiaries.",
    whyItMatters: "The theory has motivated extremist violence and often folds Jewish control myths into racist demographic panic.",
    whenItMayBeAntisemitic: "It is concerning when Jews, Zionists, Soros, globalists, or Jewish organizations are blamed for migration or demographic change.",
    clarificationNote: "Distinguish immigration-policy debate from racial panic narratives that blame Jews or coded Jewish figures for demographic replacement.",
    relatedTaxonomyIds: ["L1-CONSPIRACY", "L1-POWER"],
    relatedSourceKeys: ["ihra", "jda", "nexus", "translate_hate_glossary"],
  },
  {
    id: "th-tokenizing-litmus",
    term: "Tokenizing and litmus tests",
    entryType: "theme",
    category: "Boundary and inclusion pattern",
    aliases: ["tokenizing", "litmus test", "good jew", "bad jew", "denounce israel", "publicly denounce zionism"],
    summary: "Using selected Jewish voices as total representatives, or requiring Jews to take a political position on Israel/Zionism to belong.",
    whyItMatters: "These patterns can deny Jewish diversity and make participation conditional on political self-disavowal.",
    whenItMayBeAntisemitic: "It is concerning when Jews are admitted only if they reject Zionism, denounce Israel, or serve as proof that a hostile claim is not anti-Jewish.",
    clarificationNote: "Clarify whether Jewish participation is being made conditional on a political test or whether a Jewish voice is being used to stand in for all Jews.",
    relatedTaxonomyIds: ["L2-LITMUS", "L2-TOKENIZING", "L1-DUALLOYALTY"],
    relatedSourceKeys: ["jda", "nexus", "translate_hate_glossary"],
  },
];

const glossaryEntryById = new Map(
  translateHateGlossaryEntries.map((entry) => [entry.id, entry])
);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function aliasMatches(text: string, alias: string) {
  const normalizedAlias = alias.trim();
  if (!normalizedAlias) return false;

  if (/^[()]+$/.test(normalizedAlias)) {
    return text.includes(normalizedAlias);
  }

  const needsBoundary = /^[a-z0-9]/i.test(normalizedAlias) && /[a-z0-9]$/i.test(normalizedAlias);
  const pattern = needsBoundary
    ? `(^|[^a-z0-9])${escapeRegExp(normalizedAlias)}([^a-z0-9]|$)`
    : escapeRegExp(normalizedAlias);
  return new RegExp(pattern, "i").test(text);
}

export function findGlossaryContext(text: string, limit = 8): GlossaryContextItem[] {
  if (!text || !text.trim()) return [];

  const matches = translateHateGlossaryEntries
    .map((entry) => {
      const matchedAliases = entry.aliases.filter((alias) => aliasMatches(text, alias));
      if (matchedAliases.length === 0) return null;
      return {
        entryId: entry.id,
        term: entry.term,
        entryType: entry.entryType,
        category: entry.category,
        matchedAliases,
        summary: entry.summary,
        whyItMatters: entry.whyItMatters,
        whenItMayBeAntisemitic: entry.whenItMayBeAntisemitic,
        clarificationNote: entry.clarificationNote,
        relatedTaxonomyIds: entry.relatedTaxonomyIds,
        relatedSourceKeys: entry.relatedSourceKeys,
        sourceName: translateHateSourceName,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return matches
    .sort((a, b) => b.matchedAliases.length - a.matchedAliases.length)
    .slice(0, limit);
}

export function hydrateGlossaryContext(items?: GlossaryContextItem[]): GlossaryContextItem[] {
  if (!items || items.length === 0) return [];

  return items.map((item) => {
    const entry = glossaryEntryById.get(item.entryId);
    if (!entry) return item;

    return {
      ...item,
      term: entry.term,
      entryType: entry.entryType,
      category: entry.category,
      summary: entry.summary,
      whyItMatters: entry.whyItMatters,
      whenItMayBeAntisemitic: entry.whenItMayBeAntisemitic,
      clarificationNote: entry.clarificationNote,
      relatedTaxonomyIds: entry.relatedTaxonomyIds,
      relatedSourceKeys: entry.relatedSourceKeys,
      sourceName: translateHateSourceName,
    };
  });
}
