import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONFIG = "config/literature-monitors.example.json";
const DEFAULT_OUT = "data/literature-corpus/corpus.json";
const TOOL = "TextLensLiteratureMonitor";
const EMAIL = process.env.NCBI_EMAIL || "";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg.startsWith("--")) {
    const next = process.argv[index + 1];
    if (!next || next.startsWith("--")) {
      args.set(arg, true);
    } else {
      args.set(arg, next);
      index += 1;
    }
  }
}

const configPath = path.resolve(String(args.get("--config") || DEFAULT_CONFIG));
const outPath = path.resolve(String(args.get("--out") || DEFAULT_OUT));
const dryRun = args.has("--dry-run");
const selectedMonitorIds = String(args.get("--monitor") || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

function isoDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function todayIso() {
  return isoDate(new Date());
}

function addDays(date, days) {
  const next = new Date(`${date}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return isoDate(next);
}

function normalizePubMedDate(value) {
  if (!value) return "";
  const clean = String(value).replace(/\//g, "-");
  const match = clean.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  if (!match) return "";
  const year = match[1];
  const month = match[2] ? match[2].padStart(2, "0") : "01";
  const day = match[3] ? match[3].padStart(2, "0") : "01";
  return `${year}-${month}-${day}`;
}

function pubmedDate(value) {
  return value.replace(/-/g, "/");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function makeTermMatcher(terms) {
  const patterns = terms.map((term) => ({
    term,
    pattern: new RegExp(`\\b${escapeRegex(term).replace(/\s+/g, "\\s+")}\\b`, "i"),
  }));
  return (text) =>
    patterns
      .filter(({ pattern }) => pattern.test(text))
      .map(({ term }) => term);
}

function fieldMatches(article, terms) {
  const matcher = makeTermMatcher(terms);
  const titleMatches = matcher(article.title || "");
  const abstractMatches = matcher(article.abstract || "");
  const fields = [];
  if (titleMatches.length) fields.push("title");
  if (abstractMatches.length) fields.push("abstract");
  return {
    terms: Array.from(new Set([...titleMatches, ...abstractMatches])),
    fields,
  };
}

function classifyCandidate(article, config, monitor) {
  const evidence = [];
  for (const lensId of monitor.lensIds) {
    const lens = config.lenses.find((item) => item.id === lensId);
    if (!lens) continue;
    for (const tierConfig of lens.candidateTiers) {
      const matches = fieldMatches(article, tierConfig.terms);
      if (matches.terms.length) {
        evidence.push({
          lensId,
          candidateTier: tierConfig.tier,
          matchedTerms: matches.terms,
          matchedFields: matches.fields,
        });
      }
    }
  }

  if (evidence.length) return evidence;

  const fallback = fieldMatches(article, monitor.searchTerms);
  if (!fallback.terms.length) return [];
  return [
    {
      lensId: monitor.lensIds[0],
      candidateTier: "contextual",
      matchedTerms: fallback.terms,
      matchedFields: fallback.fields,
    },
  ];
}

function bestTier(tiers) {
  const rank = { direct: 3, contextual: 2, comparison: 1 };
  return tiers.reduce((best, tier) => (rank[tier] > rank[best] ? tier : best), "comparison");
}

function pubmedJournalQuery(journal) {
  return `(${journal.queryNames.map((name) => `"${name}"[Journal]`).join(" OR ")})`;
}

function pubmedTermsQuery(terms) {
  return `(${terms.map((term) => `"${term}"[Title/Abstract]`).join(" OR ")})`;
}

function monitorWindow(monitor, existingCorpus) {
  const explicitSince = args.get("--since");
  const explicitUntil = args.get("--until");
  const until = explicitUntil ? isoDate(explicitUntil) : monitor.dateTo || todayIso();
  if (explicitSince) {
    return { since: isoDate(explicitSince), until };
  }

  const previousMatches = existingCorpus.items
    .filter((item) => item.matchedMonitors?.includes(monitor.id))
    .map((item) => item.lastSeenAt)
    .filter(Boolean)
    .sort()
    .reverse();

  if (previousMatches[0] && monitor.lookbackDays) {
    return { since: addDays(isoDate(previousMatches[0]), -monitor.lookbackDays), until };
  }

  return { since: monitor.dateFrom, until };
}

async function getText(url, attempt = 1) {
  const response = await fetch(url);
  if (!response.ok) {
    if ((response.status === 429 || response.status >= 500) && attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      return getText(url, attempt + 1);
    }
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }
  return response.text();
}

async function getJson(url) {
  return JSON.parse(await getText(url));
}

async function pubmedSearch(monitor, journal, window) {
  const term = `${pubmedTermsQuery(monitor.searchTerms)} AND ${pubmedJournalQuery(journal)} AND ${pubmedDate(window.since)}:${pubmedDate(window.until)}[dp]`;
  const params = new URLSearchParams({
    db: "pubmed",
    term,
    retmode: "json",
    retmax: "10000",
    sort: "pub_date",
    tool: TOOL,
  });
  if (EMAIL) params.set("email", EMAIL);
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params}`;
  const json = await getJson(url);
  return {
    term,
    url,
    pmids: json.esearchresult?.idlist || [],
    count: Number(json.esearchresult?.count || 0),
  };
}

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/\s+/g, " ")
    .trim();
}

function first(xml, pattern) {
  return decodeXml(xml.match(pattern)?.[1] || "");
}

function all(xml, pattern) {
  return [...xml.matchAll(pattern)].map((match) => decodeXml(match[1])).filter(Boolean);
}

const monthMap = new Map([
  ["jan", "01"],
  ["january", "01"],
  ["feb", "02"],
  ["february", "02"],
  ["mar", "03"],
  ["march", "03"],
  ["apr", "04"],
  ["april", "04"],
  ["may", "05"],
  ["jun", "06"],
  ["june", "06"],
  ["jul", "07"],
  ["july", "07"],
  ["aug", "08"],
  ["august", "08"],
  ["sep", "09"],
  ["sept", "09"],
  ["september", "09"],
  ["oct", "10"],
  ["october", "10"],
  ["nov", "11"],
  ["november", "11"],
  ["dec", "12"],
  ["december", "12"],
]);

function normalizeMonth(value) {
  const clean = String(value || "").trim().toLowerCase();
  if (!clean) return "";
  const numeric = clean.match(/\d{1,2}/)?.[0];
  if (numeric) {
    const month = Number(numeric);
    return month >= 1 && month <= 12 ? String(month).padStart(2, "0") : "";
  }
  const firstWord = clean.split(/[^a-z]+/).filter(Boolean)[0] || "";
  return monthMap.get(firstWord) || monthMap.get(firstWord.slice(0, 3)) || "";
}

function normalizeDay(value) {
  const clean = String(value || "").trim();
  const numeric = clean.match(/\d{1,2}/)?.[0];
  if (!numeric) return "";
  const day = Number(numeric);
  return day >= 1 && day <= 31 ? String(day).padStart(2, "0") : "";
}

function dateParts(block) {
  const year = first(block, /<Year>([\s\S]*?)<\/Year>/);
  const month = normalizeMonth(first(block, /<Month>([\s\S]*?)<\/Month>/));
  const day = normalizeDay(first(block, /<Day>([\s\S]*?)<\/Day>/));
  if (!year) return { year: "", date: "" };
  return { year, date: month ? `${year}-${month}-${day || "01"}` : year };
}

function parseArticle(xml) {
  const pmid = first(xml, /<PMID[^>]*>([\s\S]*?)<\/PMID>/);
  const doi = first(xml, /<ArticleId[^>]*IdType="doi"[^>]*>([\s\S]*?)<\/ArticleId>/i);
  const title = first(xml, /<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
  const abstract = all(xml, /<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g).join(" ");
  const journal = first(xml, /<Journal>[\s\S]*?<Title>([\s\S]*?)<\/Title>[\s\S]*?<\/Journal>/);
  const articleDateBlock =
    xml.match(/<ArticleDate[^>]*DateType="Electronic"[^>]*>([\s\S]*?)<\/ArticleDate>/)?.[1] ||
    xml.match(/<ArticleDate[^>]*>([\s\S]*?)<\/ArticleDate>/)?.[1] ||
    "";
  const pubDateBlock = xml.match(/<PubDate>([\s\S]*?)<\/PubDate>/)?.[1] || "";
  let parts = dateParts(articleDateBlock);
  if (!parts.year) parts = dateParts(pubDateBlock);
  const authorBlocks = [...xml.matchAll(/<Author\b[\s\S]*?<\/Author>/g)].map((match) => match[0]);
  const authors = authorBlocks
    .map((block) => {
      const collective = first(block, /<CollectiveName>([\s\S]*?)<\/CollectiveName>/);
      if (collective) return collective;
      const last = first(block, /<LastName>([\s\S]*?)<\/LastName>/);
      const fore = first(block, /<ForeName>([\s\S]*?)<\/ForeName>/);
      return [fore, last].filter(Boolean).join(" ");
    })
    .filter(Boolean);

  return {
    provider: "pubmed",
    pmid,
    doi,
    title,
    abstract,
    journal,
    publicationDate: normalizePubMedDate(parts.date),
    year: parts.year,
    authors,
    articleTypes: all(xml, /<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g),
    url: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "",
    canonicalUrl: doi ? `https://doi.org/${doi}` : pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "",
  };
}

async function pubmedFetch(pmids) {
  if (!pmids.length) return [];
  const batches = [];
  for (let index = 0; index < pmids.length; index += 200) {
    batches.push(pmids.slice(index, index + 200));
  }

  const articles = [];
  for (const batch of batches) {
    const params = new URLSearchParams({
      db: "pubmed",
      id: batch.join(","),
      retmode: "xml",
      rettype: "abstract",
      tool: TOOL,
    });
    if (EMAIL) params.set("email", EMAIL);
    const xml = await getText(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?${params}`);
    articles.push(
      ...[...xml.matchAll(/<PubmedArticle\b[\s\S]*?<\/PubmedArticle>/g)].map((match) =>
        parseArticle(match[0])
      )
    );
  }
  return articles;
}

function corpusKey(article) {
  if (article.pmid) return `pubmed:${article.pmid}`;
  if (article.doi) return `doi:${article.doi.toLowerCase()}`;
  return `title:${article.title.toLowerCase().replace(/\s+/g, " ").trim()}`;
}

function mergeItem(existing, article, evidence, now) {
  const tiers = evidence.map((item) => item.candidateTier);
  const matchedLenses = Array.from(new Set([
    ...(existing?.matchedLenses || []),
    ...evidence.flatMap((item) => item.lensIds),
  ]));
  const matchedMonitors = Array.from(new Set([
    ...(existing?.matchedMonitors || []),
    ...evidence.map((item) => item.monitorId),
  ]));

  return {
    ...(existing || {}),
    id: corpusKey(article),
    provider: "pubmed",
    pmid: article.pmid || existing?.pmid,
    doi: article.doi || existing?.doi,
    title: article.title || existing?.title || "",
    abstract: article.abstract || existing?.abstract || "",
    journal: article.journal || existing?.journal || "",
    journalKey: evidence[0]?.journalKey || existing?.journalKey,
    journalTier: evidence[0]?.journalTier || existing?.journalTier,
    publicationDate: article.publicationDate || existing?.publicationDate || "",
    year: article.year || existing?.year || "",
    authors: article.authors?.length ? article.authors : existing?.authors || [],
    articleTypes: article.articleTypes?.length ? article.articleTypes : existing?.articleTypes || [],
    url: article.url || existing?.url || "",
    canonicalUrl: article.canonicalUrl || existing?.canonicalUrl || article.url || "",
    status: existing?.status || "new",
    firstSeenAt: existing?.firstSeenAt || now,
    lastSeenAt: now,
    matchedMonitors,
    matchedLenses,
    bestCandidateTier: bestTier([...(existing ? [existing.bestCandidateTier] : []), ...tiers]),
    matchEvidence: [...(existing?.matchEvidence || []), ...evidence],
    analysisReportIds: existing?.analysisReportIds || [],
  };
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function main() {
  const now = new Date().toISOString();
  const config = await readJson(configPath);
  const existingCorpus = await readJson(outPath, {
    version: "1",
    generatedAt: new Date(0).toISOString(),
    items: [],
    runs: [],
  });
  const monitorIds = selectedMonitorIds.length
    ? selectedMonitorIds
    : config.monitors.filter((monitor) => monitor.enabled).map((monitor) => monitor.id);
  const monitorSet = new Set(monitorIds);
  const monitors = config.monitors.filter((monitor) => monitor.enabled && monitorSet.has(monitor.id));
  const existingByKey = new Map(existingCorpus.items.map((item) => [item.id, item]));
  const errors = [];
  let foundCount = 0;
  let newCount = 0;
  let updatedCount = 0;

  for (const monitor of monitors) {
    const window = monitorWindow(monitor, existingCorpus);
    for (const journal of monitor.journals) {
      try {
        const search = await pubmedSearch(monitor, journal, window);
        if (!search.pmids.length) continue;
        const articles = await pubmedFetch(search.pmids);
        foundCount += articles.length;

        for (const article of articles) {
          const classified = classifyCandidate(article, config, monitor);
          if (!classified.length) continue;
          const evidence = classified.map((match) => ({
            monitorId: monitor.id,
            monitorLabel: monitor.label,
            lensIds: Array.from(new Set([match.lensId].filter(Boolean))),
            candidateTier: match.candidateTier,
            matchedTerms: match.matchedTerms,
            matchedFields: match.matchedFields,
            journalKey: journal.key,
            journalTier: journal.tier,
            retrievedAt: now,
            query: search.term,
          }));
          const key = corpusKey(article);
          const existing = existingByKey.get(key);
          const merged = mergeItem(existing, article, evidence, now);
          existingByKey.set(key, merged);
          if (existing) updatedCount += 1;
          else newCount += 1;
        }
      } catch (error) {
        errors.push(`${monitor.id}/${journal.key}: ${error.message}`);
      }
    }
  }

  const run = {
    id: `run-${Date.now()}`,
    startedAt: now,
    completedAt: new Date().toISOString(),
    configVersion: config.version,
    monitorIds,
    provider: "pubmed",
    foundCount,
    newCount,
    updatedCount,
    errors,
  };

  const nextCorpus = {
    version: "1",
    generatedAt: run.completedAt,
    items: Array.from(existingByKey.values()).sort((a, b) =>
      String(b.publicationDate || "").localeCompare(String(a.publicationDate || ""))
    ),
    runs: [run, ...(existingCorpus.runs || [])].slice(0, 50),
  };

  console.log(JSON.stringify(run, null, 2));
  if (errors.length && foundCount === 0) {
    process.exitCode = 1;
  }

  if (dryRun) {
    console.log(`Dry run only. ${nextCorpus.items.length} corpus items would be stored at ${outPath}.`);
    return;
  }

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(nextCorpus, null, 2)}\n`);
  console.log(`Wrote ${nextCorpus.items.length} corpus items to ${outPath}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
