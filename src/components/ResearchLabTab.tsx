import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  FileText,
  FileUp,
  Filter,
  FlaskConical,
  Globe2,
  Loader2,
  Newspaper,
  Play,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import type {
  LiteratureCandidateTier,
  LiteratureCorpusItem,
  LiteratureCorpusStatus,
  LiteratureMonitorConfig,
  LiteratureCorpusStore,
  LiteratureCorpusSummary,
} from '../research/literatureCorpus';

const HUMANITARIAN_DASHBOARD_PATH = '/research/humanitarian-attention/index.html';
const DASHBOARD_MONITOR_ID = 'humanitarian-dashboard-corpus';
const PAGE_SIZE = 50;

type ExplorerTab = 'overview' | 'crisis' | 'journal' | 'queue' | 'all';

const explorerTabs: Array<{ id: ExplorerTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'crisis', label: 'By Crisis' },
  { id: 'journal', label: 'By Journal' },
  { id: 'queue', label: 'By Review Priority' },
  { id: 'all', label: 'All Articles' },
];

const humanitarianCrises = [
  { name: 'Gaza / oPt / Israel', terms: ['Gaza', 'Palestine', 'Palestinian', 'Israel', 'Israeli'] },
  { name: 'Sudan', terms: ['Sudan', 'Darfur'] },
  { name: 'DRC / Congo', terms: ['Democratic Republic of Congo', 'Democratic Republic of the Congo', 'DRC', 'Congo', 'Kivu'] },
  { name: 'Yemen', terms: ['Yemen', 'Yemeni'] },
  { name: 'Ukraine', terms: ['Ukraine', 'Ukrainian'] },
  { name: 'Syria', terms: ['Syria', 'Syrian'] },
  { name: 'Myanmar', terms: ['Myanmar', 'Burma', 'Rohingya'] },
  { name: 'Haiti', terms: ['Haiti', 'Haitian'] },
  { name: 'Afghanistan', terms: ['Afghanistan', 'Afghan'] },
  { name: 'Sahel', terms: ['Sahel', 'Mali', 'Niger', 'Burkina Faso', 'Chad'] },
  { name: 'Venezuela', terms: ['Venezuela', 'Venezuelan'] },
];

interface ResearchLabTabProps {
  onLoadCorpusItemForAnalysis: (preparation: {
    item: LiteratureCorpusItem;
    fullText?: string;
    fullTextFileName?: string;
    useAbstractOnly?: boolean;
  }) => void;
}

interface CorpusApiResponse {
  config: LiteratureMonitorConfig;
  corpus: LiteratureCorpusStore;
  summary: LiteratureCorpusSummary;
}

const statusOptions: Array<{ value: 'all' | LiteratureCorpusStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'queued', label: 'Queued' },
  { value: 'analysed', label: 'Analysed' },
  { value: 'needs_review', label: 'Needs review' },
  { value: 'ignored', label: 'Ignored' },
];

const legalRecentDevelopments = [
  {
    date: '2023-02-06',
    title: 'ABA Resolution 514 adopted',
    status: 'Encoded source',
    summary: 'ABA policy condemning antisemitism and calling for ABA leadership now anchors the legal-profession mode as a bar-awareness and non-bystander response source.',
    href: 'https://www.americanbar.org/groups/leadership/office_of_the_president/antisemitism/',
  },
  {
    date: '2023-05-30',
    title: 'U.S. National Strategy to Counter Antisemitism',
    status: 'Encoded source',
    summary: 'Whole-of-society framework organized around awareness, safety, countering discrimination and cross-community solidarity.',
    href: 'https://www.justice.gov/hatecrimes/resource/us-national-strategy-counter-antisemitism',
  },
  {
    date: '2024-07-17',
    title: 'Global Guidelines for Countering Antisemitism',
    status: 'Encoded source',
    summary: 'Nonbinding best-practices guidance for practical institutional action, reporting, education, protocols and coalition work.',
    href: 'https://2021-2025.state.gov/office-of-the-special-envoy-to-monitor-and-combat-antisemitism/global-action-to-combat-antisemitism-under-ambassador-deborah-e-lipstadt-ph-d/',
  },
  {
    date: '2025-08-12',
    title: 'ABA 2025 Resolutions 611, 612 and 613',
    status: 'Encoded source',
    summary: 'Recent ABA antisemitism policy extensions covering K-12 incident protocols, higher-education discrimination education including Title VI, and support for the Global Guidelines.',
    href: 'https://www.americanbar.org/groups/leadership/office_of_the_president/antisemitism/',
  },
  {
    date: '2026-01-12',
    title: 'OCR shared ancestry guidance page reviewed',
    status: 'Encoded source',
    summary: 'Education civil-rights context for Jewish, Israeli, Muslim, Arab, Sikh, Hindu and other shared-ancestry or ethnic-characteristics discrimination concerns.',
    href: 'https://www.ed.gov/laws-and-policy/civil-rights-laws/title-vi/title-vi-key-issues/discrimination-based-shared-ancestry-or-ethnic-characteristics',
  },
  {
    date: '2026-05-19',
    title: 'DOJ Anti-Semitism Advisory Committee announced',
    status: 'Watch item',
    summary: 'Recent federal development relevant to future legal-mode source review. Not currently encoded as an active source rule.',
    href: 'https://www.justice.gov/opa/pr/justice-department-announces-formation-advisory-committee-anti-semitism',
  },
];

function formatDate(value?: string) {
  if (!value) return 'Not run yet';
  return value.slice(0, 10);
}

function getTierClass(tier: LiteratureCandidateTier) {
  if (tier === 'direct') return 'border-rose-200 bg-rose-50 text-rose-800';
  if (tier === 'contextual') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-slate-200 bg-slate-50 text-slate-650';
}

function uniqueEvidenceTerms(item: LiteratureCorpusItem) {
  return Array.from(new Set(item.matchEvidence.flatMap(evidence => evidence.matchedTerms))).slice(0, 8);
}

function allEvidenceTerms(item: LiteratureCorpusItem) {
  return Array.from(new Set(item.matchEvidence.flatMap(evidence => evidence.matchedTerms)));
}

function matchedCrises(item: LiteratureCorpusItem) {
  const evidenceTerms = allEvidenceTerms(item).map(term => term.toLowerCase());
  const text = `${item.title}\n${item.abstract}`.toLowerCase();
  return humanitarianCrises
    .filter(crisis =>
      crisis.terms.some(term =>
        evidenceTerms.includes(term.toLowerCase()) || text.includes(term.toLowerCase())
      )
    )
    .map(crisis => crisis.name);
}

function reviewPriorityScore(item: LiteratureCorpusItem) {
  const majorJournalBoost = ['Lancet', 'BMJ', 'JAMA', 'NEJM'].includes(item.journalKey || '') ? 4 : 0;
  const abstractBoost = item.abstract ? 3 : 0;
  const crisisBoost = matchedCrises(item).length * 2;
  const termBoost = Math.min(allEvidenceTerms(item).length, 4);
  const statusBoost = item.status === 'new' ? 2 : item.status === 'needs_review' ? 3 : 0;
  return majorJournalBoost + abstractBoost + crisisBoost + termBoost + statusBoost;
}

function pubmedDate(value?: string) {
  return value ? value.replace(/-/g, '/') : '';
}

function pubmedTermsQuery(terms: string[]) {
  return `(${terms.map(term => `"${term}"[Title/Abstract]`).join(' OR ')})`;
}

function pubmedJournalQuery(journal?: { queryNames: string[] }) {
  if (!journal) return '("[Journal]" placeholder)';
  return `(${journal.queryNames.map(name => `"${name}"[Journal]`).join(' OR ')})`;
}

export default function ResearchLabTab({ onLoadCorpusItemForAnalysis }: ResearchLabTabProps) {
  const [data, setData] = useState<CorpusApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LiteratureCorpusStatus>('all');
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>('overview');
  const [articlePage, setArticlePage] = useState(1);
  const [selectedCrisis, setSelectedCrisis] = useState<string | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null);
  const [isRunningSearch, setIsRunningSearch] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<string | null>(null);
  const [preparationItem, setPreparationItem] = useState<LiteratureCorpusItem | null>(null);
  const [fullTextFileName, setFullTextFileName] = useState('');
  const [fullText, setFullText] = useState('');
  const [isParsingFullText, setIsParsingFullText] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);

  const loadCorpus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/research/literature-corpus');
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Corpus request failed with ${response.status}`);
      }
      setData(await response.json());
    } catch (err: any) {
      setError(err.message || 'Failed to load the literature corpus.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCorpus();
  }, []);

  const dashboardMonitor = useMemo(() => {
    return data?.config.monitors.find(monitor => monitor.id === DASHBOARD_MONITOR_ID);
  }, [data]);

  const queryPreview = useMemo(() => {
    if (!dashboardMonitor) return null;
    const terms = pubmedTermsQuery(dashboardMonitor.searchTerms);
    const firstJournal = dashboardMonitor.journals[0];
    const until = dashboardMonitor.dateTo ? pubmedDate(dashboardMonitor.dateTo) : 'today';
    return {
      terms,
      example: `${terms} AND ${pubmedJournalQuery(firstJournal)} AND ${pubmedDate(dashboardMonitor.dateFrom)}:${until}[dp]`,
    };
  }, [dashboardMonitor]);

  const corpusItems = useMemo(() => {
    return (data?.corpus.items || []).filter(item =>
      item.matchedMonitors.includes(DASHBOARD_MONITOR_ID)
    );
  }, [data]);

  const filteredItems = useMemo(() => {
    const items = corpusItems;
    const term = searchTerm.trim().toLowerCase();
    return items.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!term) return true;
      const haystack = [
        item.title,
        item.abstract,
        item.journal,
        item.authors.join(' '),
        uniqueEvidenceTerms(item).join(' '),
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [corpusItems, searchTerm, statusFilter]);

  useEffect(() => {
    setArticlePage(1);
  }, [explorerTab, searchTerm, statusFilter]);

  const overviewStats = useMemo(() => {
    const journals = new Set(corpusItems.map(item => item.journalKey || item.journal).filter(Boolean));
    const newest = corpusItems.map(item => item.publicationDate).filter(Boolean).sort().reverse()[0];
    return {
      items: corpusItems.length,
      journals: journals.size,
      newest,
      unreviewed: corpusItems.filter(item => item.status === 'new' || item.status === 'needs_review').length,
      withAbstracts: corpusItems.filter(item => Boolean(item.abstract)).length,
    };
  }, [corpusItems]);

  const crisisGroups = useMemo(() => {
    return humanitarianCrises
      .map(crisis => {
        const items = filteredItems.filter(item => matchedCrises(item).includes(crisis.name));
        return { ...crisis, items };
      })
      .filter(group => group.items.length > 0)
      .sort((a, b) => b.items.length - a.items.length);
  }, [filteredItems]);

  const journalGroups = useMemo(() => {
    const groups = new Map<string, LiteratureCorpusItem[]>();
    filteredItems.forEach(item => {
      const key = item.journalKey || item.journal || 'Unknown journal';
      const label = dashboardMonitor?.journals.find(journal => journal.key === key)?.name || item.journal || key;
      groups.set(label, [...(groups.get(label) || []), item]);
    });
    return Array.from(groups.entries())
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [dashboardMonitor, filteredItems]);

  const reviewQueueItems = useMemo(() => {
    return filteredItems
      .filter(item => item.status !== 'analysed' && item.status !== 'ignored')
      .sort((a, b) => reviewPriorityScore(b) - reviewPriorityScore(a))
      .slice(0, 50);
  }, [filteredItems]);

  const paginatedItems = useMemo(() => {
    const start = (articlePage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [articlePage, filteredItems]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const activeCrisisGroup = crisisGroups.find(group => group.name === selectedCrisis) || crisisGroups[0];
  const activeJournalGroup = journalGroups.find(group => group.name === selectedJournal) || journalGroups[0];

  const handleStatusChange = async (item: LiteratureCorpusItem, status: LiteratureCorpusStatus) => {
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        corpus: {
          ...prev.corpus,
          items: prev.corpus.items.map(candidate =>
            candidate.id === item.id ? { ...candidate, status } : candidate
          ),
        },
      };
    });

    try {
      await fetch('/api/research/literature-corpus/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, status }),
      });
    } catch (err) {
      console.warn('Failed to persist corpus status', err);
    }
  };

  const handleRunSearch = async () => {
    setIsRunningSearch(true);
    setRunError(null);
    setRunResult(null);
    try {
      const response = await fetch('/api/research/literature-corpus/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monitorId: DASHBOARD_MONITOR_ID,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Search failed with ${response.status}`);
      }

      const match = String(payload.output || '').match(/\{\s*"id"[\s\S]*?\n\}/);
      const runSummary = match ? JSON.parse(match[0]) : null;
      setRunResult(
        runSummary
          ? `${runSummary.newCount} new / ${runSummary.updatedCount} updated from ${runSummary.foundCount} PubMed records.`
          : 'Search completed and the corpus was refreshed.'
      );
      await loadCorpus();
    } catch (err: any) {
      setRunError(err.message || 'The PubMed search could not be completed.');
    } finally {
      setIsRunningSearch(false);
    }
  };

  const resetPreparation = () => {
    setPreparationItem(null);
    setFullTextFileName('');
    setFullText('');
    setIsParsingFullText(false);
    setPreparationError(null);
  };

  const openPreparation = (item: LiteratureCorpusItem) => {
    setPreparationItem(item);
    setFullTextFileName('');
    setFullText('');
    setPreparationError(null);
  };

  const handleFullTextFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx')) {
      setPreparationError('Upload a PDF or Word document for full-text extraction.');
      return;
    }

    setIsParsingFullText(true);
    setPreparationError(null);
    setFullText('');
    setFullTextFileName(file.name);

    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result || '');
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('The file could not be read.'));
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileBase64,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Full-text extraction failed with ${response.status}`);
      }

      const extractedText = String(payload.text || '').trim();
      if (!extractedText) {
        throw new Error('No readable text was extracted from that document.');
      }

      setFullText(extractedText);
    } catch (err: any) {
      setPreparationError(err.message || 'The full text could not be extracted.');
      setFullTextFileName('');
      setFullText('');
    } finally {
      setIsParsingFullText(false);
    }
  };

  const sendPreparedItemToAnalysis = async (options: { useAbstractOnly?: boolean }) => {
    if (!preparationItem) return;
    if (!options.useAbstractOnly && !fullText.trim()) {
      setPreparationError('Upload full text or continue with the abstract only.');
      return;
    }

    onLoadCorpusItemForAnalysis({
      item: preparationItem,
      fullText: options.useAbstractOnly ? undefined : fullText,
      fullTextFileName: options.useAbstractOnly ? undefined : fullTextFileName,
      useAbstractOnly: Boolean(options.useAbstractOnly),
    });
    await handleStatusChange(preparationItem, preparationItem.status === 'analysed' ? 'analysed' : 'queued');
    resetPreparation();
  };

  const renderArticleTable = (items: LiteratureCorpusItem[], emptyLabel: string) => (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="max-h-[520px] overflow-auto bg-white">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading corpus
          </div>
        ) : items.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center px-6">
            <FileText className="w-6 h-6 text-slate-300" />
            <p className="mt-2 text-xs font-bold text-slate-700">{emptyLabel}</p>
            <p className="mt-1 text-[11px] text-slate-500">Adjust the corpus filters or update the literature monitor.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                <th className="px-3 py-2 w-[44%]">Article</th>
                <th className="px-3 py-2">Evidence</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => {
                const terms = uniqueEvidenceTerms(item);
                return (
                  <tr key={item.id} className="align-top hover:bg-slate-50/60">
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-bold ${getTierClass(item.bestCandidateTier)}`}>
                            {item.bestCandidateTier}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{formatDate(item.publicationDate)}</span>
                          {item.abstract && (
                            <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                              abstract
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold leading-snug text-slate-900">{item.title || 'Untitled article'}</p>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {item.journal}
                          {item.authors.length ? ` · ${item.authors.slice(0, 3).join(', ')}${item.authors.length > 3 ? ' et al.' : ''}` : ''}
                        </p>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-700 hover:text-indigo-900"
                          >
                            <ExternalLink className="w-3 h-3" />
                            PubMed
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {terms.length ? terms.map(term => (
                          <span key={term} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-650">
                            {term}
                          </span>
                        )) : (
                          <span className="text-[11px] text-slate-400">No term evidence recorded</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={item.status}
                        onChange={(event) => handleStatusChange(item, event.target.value as LiteratureCorpusStatus)}
                        className="w-full min-w-[128px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                      >
                        {statusOptions.filter(option => option.value !== 'all').map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openPreparation(item)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[11px] font-mono font-bold text-indigo-800 hover:bg-indigo-100 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Prepare Analysis
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div id="research-lab-tab-container" className="space-y-6 font-sans pb-10">
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs flex flex-col lg:flex-row gap-5 items-start">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 shrink-0">
          <FlaskConical className="w-8 h-8" />
        </div>
        <div className="space-y-3 min-w-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-display">Research Lab</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-4xl">
              Evidence audits and dashboards.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
              Research workspaces
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              Dashboards
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <Newspaper className="w-3.5 h-3.5 text-slate-500" />
              Literature corpora
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55 flex flex-col lg:flex-row lg:items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-655" />
              <span>U.S. Legal (ABA) Recent Developments</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-4xl">
              Static research notes for the legal-profession mode. Encoded sources are available to the analysis engine as compact source summaries and rule signals; watch items are tracked for future source review.
            </p>
          </div>
          <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-600">
            Checked July 27, 2026
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {legalRecentDevelopments.map(item => (
            <a
              key={`${item.date}-${item.title}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-md border border-slate-200 bg-slate-50/55 p-4 hover:border-indigo-200 hover:bg-indigo-50/35 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="block text-[10px] font-mono font-bold text-slate-500">{item.date}</span>
                  <h4 className="text-xs font-bold leading-snug text-slate-950 group-hover:text-indigo-900">{item.title}</h4>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </div>
              <span className={`mt-3 inline-flex rounded border px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                item.status === 'Encoded source'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-750'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}>
                {item.status}
              </span>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{item.summary}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="space-y-3 px-1">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            Research Areas
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950 font-display">
            Humanitarian Attention
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
            <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            Topic: humanitarian attention
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            Dashboard
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
            <Newspaper className="w-3.5 h-3.5 text-slate-500" />
            Literature corpus
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
            <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            2023-01-01 onward
          </span>
          <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            Core 4 / expanded journals
          </span>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-655" />
              <span>Dashboard</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-3xl">
              Humanitarian attention across the defined health-sciences journal set.
            </p>
          </div>

          <a
            href={HUMANITARIAN_DASHBOARD_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-mono font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Full Page</span>
          </a>
        </div>

        <div className="bg-slate-100/80 p-3">
          <iframe
            title="Humanitarian Attention Dashboard"
            src={HUMANITARIAN_DASHBOARD_PATH}
            loading="lazy"
            className="block w-full h-[78vh] min-h-[680px] rounded-md border border-slate-200 bg-white"
          />
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55">
          <div className="space-y-1">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-655" />
              <span>Literature Monitor</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-3xl">
              Defined PubMed search, stored corpus, and on-demand updates for this research area.
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="border border-slate-200 rounded-md bg-slate-50/45 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
              <h4 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-655" />
                <span>Humanitarian Dashboard PubMed Search</span>
              </h4>
              {isRunningSearch && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-700">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running
                </span>
              )}
            </div>

            <div className="p-4 grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-4">
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  This runs the same PubMed title/abstract query used by the Humanitarian Attention Dashboard, against the same journal set. It stores the fetched metadata and abstracts as the dashboard corpus for later slicing, review, and TextLens analysis.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Journals</p>
                    <p className="mt-1 text-lg font-bold text-slate-950">{dashboardMonitor?.journals.length || 0}</p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Window</p>
                    <p className="mt-1 text-sm font-mono font-bold text-slate-950">
                      {dashboardMonitor?.dateFrom || '2023-01-01'} onward
                    </p>
                  </div>
                </div>

                <details className="rounded-md border border-slate-200 bg-white">
                  <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">
                    View PubMed Search Terms
                  </summary>
                  <div className="border-t border-slate-100 p-3 space-y-3">
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Title / Abstract Block</p>
                      <pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-100">{queryPreview?.terms || ''}</pre>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Journal Set</p>
                      <div className="mt-1 max-h-28 overflow-auto rounded border border-slate-200 bg-slate-50 p-2 text-[10px] font-mono text-slate-700">
                        {(dashboardMonitor?.journals || []).map(journal => journal.name).join(', ')}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Example Per-Journal Query</p>
                      <pre className="mt-1 max-h-36 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-3 text-[10px] leading-relaxed text-slate-100">{queryPreview?.example || ''}</pre>
                    </div>
                  </div>
                </details>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleRunSearch}
                  disabled={isRunningSearch}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-indigo-700 bg-indigo-600 px-3 py-2.5 text-[11px] font-mono font-bold text-white hover:bg-indigo-700 transition-colors disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  {isRunningSearch ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Run / Update</span>
                </button>

                {runResult && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800">
                    {runResult}
                  </div>
                )}

                {runError && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-800">
                    {runError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-md bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/65 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-655" />
                  <span>Literature Explorer</span>
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {filteredItems.length === corpusItems.length
                      ? `${corpusItems.length} articles stored`
                      : `${filteredItems.length} visible of ${corpusItems.length} articles`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={loadCorpus}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-mono font-bold text-slate-650 hover:bg-slate-50 hover:text-indigo-700 transition-colors"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Reload Stored Literature</span>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Articles</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{overviewStats.items}</p>
                </div>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Journals</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{overviewStats.journals}</p>
                </div>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Unreviewed</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{overviewStats.unreviewed}</p>
                </div>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Abstracts</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{overviewStats.withAbstracts}</p>
                </div>
                <div className="border border-slate-200 rounded-md p-3 bg-slate-50/70">
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Last run</p>
                  <p className="mt-2 text-xs font-mono font-bold text-slate-800">{formatDate(data?.summary.lastRunAt)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                    Filter Collected Articles
                  </p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Search within the stored articles. This does not change or rerun the PubMed search.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,1fr)_180px] gap-2">
                <label className="relative block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search title, abstract, journal, terms"
                    className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  />
                </label>

                <label className="relative block">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as 'all' | LiteratureCorpusStatus)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-1 border-b border-slate-200">
                {explorerTabs.map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setExplorerTab(tab.id)}
                    className={`px-3 py-2 text-[11px] font-mono font-bold border-b-2 transition-colors ${
                      explorerTab === tab.id
                        ? 'border-indigo-600 text-indigo-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {explorerTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-md border border-slate-200 bg-slate-50/45 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">Top Crisis Signals</h5>
                        <span className="text-[10px] font-mono text-slate-500">{crisisGroups.length} groups</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {crisisGroups.slice(0, 6).map(group => (
                          <button
                            key={group.name}
                            type="button"
                            onClick={() => {
                              setSelectedCrisis(group.name);
                              setExplorerTab('crisis');
                            }}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left hover:border-indigo-200 hover:bg-indigo-50/35 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-slate-900">{group.name}</span>
                              <span className="text-[11px] font-mono font-bold text-slate-600">{group.items.length}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-500">{group.terms.join(', ')}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-slate-50/45 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">Top Journals</h5>
                        <span className="text-[10px] font-mono text-slate-500">{journalGroups.length} journals</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {journalGroups.slice(0, 6).map(group => (
                          <button
                            key={group.name}
                            type="button"
                            onClick={() => {
                              setSelectedJournal(group.name);
                              setExplorerTab('journal');
                            }}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left hover:border-indigo-200 hover:bg-indigo-50/35 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-bold text-slate-900">{group.name}</span>
                              <span className="text-[11px] font-mono font-bold text-slate-600">{group.items.length}</span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {group.items.filter(item => item.abstract).length} with abstracts
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">Review for TextLens Analysis</h5>
                      <button
                        type="button"
                        onClick={() => setExplorerTab('queue')}
                        className="text-[10px] font-mono font-bold text-indigo-700 hover:text-indigo-900"
                      >
                        Open review list
                      </button>
                    </div>
                    {renderArticleTable(reviewQueueItems.slice(0, 12), 'No review queue items match the current filters.')}
                  </div>
                </div>
              )}

              {explorerTab === 'crisis' && (
                <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
                  <div className="space-y-2">
                    {crisisGroups.map(group => (
                      <button
                        key={group.name}
                        type="button"
                        onClick={() => setSelectedCrisis(group.name)}
                        className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                          activeCrisisGroup?.name === group.name
                            ? 'border-indigo-300 bg-indigo-50 text-indigo-950'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold">{group.name}</span>
                          <span className="text-[11px] font-mono font-bold">{group.items.length}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{group.terms.join(', ')}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">
                        {activeCrisisGroup?.name || 'No crisis signal selected'}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500">
                        {activeCrisisGroup?.items.length || 0} matching articles
                      </span>
                    </div>
                    {renderArticleTable((activeCrisisGroup?.items || []).slice(0, PAGE_SIZE), 'No crisis groups match the current filters.')}
                  </div>
                </div>
              )}

              {explorerTab === 'journal' && (
                <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
                  <div className="space-y-2">
                    {journalGroups.map(group => (
                      <button
                        key={group.name}
                        type="button"
                        onClick={() => setSelectedJournal(group.name)}
                        className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                          activeJournalGroup?.name === group.name
                            ? 'border-indigo-300 bg-indigo-50 text-indigo-950'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold leading-snug">{group.name}</span>
                          <span className="text-[11px] font-mono font-bold">{group.items.length}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {group.items.filter(item => item.abstract).length} abstracts
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">
                        {activeJournalGroup?.name || 'No journal selected'}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-500">
                        {activeJournalGroup?.items.length || 0} matching articles
                      </span>
                    </div>
                    {renderArticleTable((activeJournalGroup?.items || []).slice(0, PAGE_SIZE), 'No journals match the current filters.')}
                  </div>
                </div>
              )}

              {explorerTab === 'queue' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h5 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">Review for TextLens Analysis</h5>
                    <span className="text-[10px] font-mono text-slate-500">Top {reviewQueueItems.length} articles to screen</span>
                  </div>
                  {renderArticleTable(reviewQueueItems, 'No review queue items match the current filters.')}
                </div>
              )}

              {explorerTab === 'all' && (
                <div className="space-y-3">
                  {renderArticleTable(paginatedItems, 'No articles match the current filters.')}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>
                      Page {articlePage} of {totalPages}, showing up to {PAGE_SIZE} articles at a time.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setArticlePage(page => Math.max(1, page - 1))}
                        disabled={articlePage <= 1}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setArticlePage(page => Math.min(totalPages, page + 1))}
                        disabled={articlePage >= totalPages}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 font-mono font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {preparationItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/35 px-4 py-6 flex items-start justify-center overflow-y-auto">
          <div className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-950">
                  Prepare Analysis
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose whether TextLens receives full text or an abstract-only screening package.
                </p>
              </div>
              <button
                type="button"
                onClick={resetPreparation}
                className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                aria-label="Close preparation panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-md border border-slate-200 bg-slate-50/65 p-4 space-y-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-bold ${getTierClass(preparationItem.bestCandidateTier)}`}>
                    {preparationItem.bestCandidateTier}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{formatDate(preparationItem.publicationDate)}</span>
                  {preparationItem.abstract && (
                    <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                      abstract available
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold leading-snug text-slate-950">
                  {preparationItem.title || 'Untitled article'}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {preparationItem.journal}
                  {preparationItem.authors.length ? ` · ${preparationItem.authors.slice(0, 5).join(', ')}${preparationItem.authors.length > 5 ? ' et al.' : ''}` : ''}
                </p>
                {preparationItem.url && (
                  <a
                    href={preparationItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-700 hover:text-indigo-900"
                  >
                    <ExternalLink className="w-3 h-3" />
                    PubMed
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-md border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-indigo-650" />
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-800">
                      Full Text
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload a PDF or Word file before sending the article to Analysis.
                  </p>
                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-[11px] font-mono font-bold text-indigo-800 hover:bg-indigo-100 transition-colors">
                    {isParsingFullText ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                    <span>{isParsingFullText ? 'Extracting Text' : 'Upload Full Text'}</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFullTextFileChange}
                      disabled={isParsingFullText}
                      className="sr-only"
                    />
                  </label>
                  {fullTextFileName && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-mono font-bold text-slate-700">{fullTextFileName}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {fullText ? `${fullText.length.toLocaleString()} characters extracted` : 'Waiting for extracted text'}
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => sendPreparedItemToAnalysis({ useAbstractOnly: false })}
                    disabled={!fullText.trim() || isParsingFullText}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-indigo-700 bg-indigo-600 px-3 py-2.5 text-[11px] font-mono font-bold text-white hover:bg-indigo-700 transition-colors disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Send Full Text to Analysis</span>
                  </button>
                </div>

                <div className="rounded-md border border-amber-200 bg-amber-50/45 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-950">
                      Abstract Only
                    </h4>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Use this only for screening. Full-text article review is still required for complete Healthcare Mode analysis.
                  </p>
                  <div className="rounded-md border border-amber-200 bg-white/80 px-3 py-2">
                    <p className="text-[10px] font-mono font-bold text-amber-950">
                      {preparationItem.abstract ? 'Abstract available' : 'No abstract available'}
                    </p>
                    <p className="mt-1 text-[11px] text-amber-800">
                      {preparationItem.abstract
                        ? `${preparationItem.abstract.length.toLocaleString()} abstract characters will be sent.`
                        : 'This item has no abstract text to send.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendPreparedItemToAnalysis({ useAbstractOnly: true })}
                    disabled={!preparationItem.abstract || isParsingFullText}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-amber-300 bg-white px-3 py-2.5 text-[11px] font-mono font-bold text-amber-900 hover:bg-amber-100 transition-colors disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Continue with Abstract Only</span>
                  </button>
                </div>
              </div>

              {preparationError && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {preparationError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
