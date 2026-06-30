import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Scale, ExternalLink, Bookmark, Info, Layers, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { standardsList } from '../standardsData';
import { StandardDoc } from '../types';
import { textLensTaxonomy, TaxonomyItem } from '../taxonomyData';
import { sourceCatalogList } from '../sourceCatalog';

type TaxonomySummaryLayerId = 1 | 2 | 3 | 0;

const taxonomyLayerConfigs: Record<TaxonomySummaryLayerId, {
  title: string;
  summary: string;
  accentClass: string;
  badgeClass: string;
}> = {
  1: {
    title: 'Layer 1: Direct Antisemitic Content',
    summary: 'Overt stereotypes, dehumanization, conspiracy claims, and direct collective accusations.',
    accentClass: 'border-red-200 bg-red-50/60',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
  2: {
    title: 'Layer 2: Israel/Zionism-linked Patterns',
    summary: 'Boundary cases where geopolitical criticism crosses into identity-based hostility, exclusion, or double standards.',
    accentClass: 'border-amber-200 bg-amber-50/60',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  3: {
    title: 'Layer 3: Rhetorical and Evidentiary Taxonomy',
    summary: 'Evidence handling, language and emphasis, agency, conflation, frame-shifting, immunity moves, and authority effects.',
    accentClass: 'border-indigo-200 bg-indigo-50/60',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  0: {
    title: 'Layer 0: Guardrails and Exemptions',
    summary: 'Protected non-trigger categories that prevent ordinary political speech, including BDS advocacy without aggravating features, from being misclassified.',
    accentClass: 'border-emerald-200 bg-emerald-50/60',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
};

const STANDARD_DISPLAY_ORDER = [
  'ihra',
  'jda',
  'nexus',
  'bccsa_fta',
  'bccsa_sub',
  'bccsa_on',
  'press_code_sa',
  'cope',
  'icmje_recommendations_2026',
  'wame_geopolitical_intrusion_editorial_decisions',
  'wame_publication_ethics_policies',
  'jama_race_ethnicity_guidance_2021',
  'cse_publication_ethics_white_paper',
  'schwitzer_health_journalism_500_stories_2008',
  'ahcj_health_journalism_principles',
  'icrc_customary_ihl_rule_1',
  'icrc_customary_ihl_rule_7',
  'icrc_customary_ihl_rule_14',
  'icrc_customary_ihl_rule_15',
  'icrc_customary_ihl_rule_25',
  'icrc_customary_ihl_rule_28',
  'icrc_health_care_in_danger_making_case',
  'icrc_healthcare_personnel_responsibilities_conflict',
  'textlens_framework',
] as const;

const standardDisplayRank = new Map<string, number>(
  STANDARD_DISPLAY_ORDER.map((id, index) => [id, index])
);

const STANDARD_SECTIONS: Array<{
  id: string;
  title: string;
  summary: string;
  docIds: string[];
}> = [
  {
    id: 'core-frameworks',
    title: 'Core Antisemitism Frameworks',
    summary: 'Foundational definitions and interpretive frameworks used to distinguish antisemitism from protected political speech.',
    docIds: ['ihra', 'jda', 'nexus'],
  },
  {
    id: 'media-codes',
    title: 'Media & Regulatory Codes',
    summary: 'Broadcasting and press standards used for newsroom, publishing, and complaint-oriented review.',
    docIds: ['bccsa_fta', 'bccsa_sub', 'bccsa_on', 'press_code_sa'],
  },
  {
    id: 'publication-standards',
    title: 'Academic & Publication Standards',
    summary: 'Editorial, peer-review, authorship, and publication-integrity sources for academic and journal analysis.',
    docIds: [
      'cope',
      'icmje_recommendations_2026',
      'wame_geopolitical_intrusion_editorial_decisions',
      'wame_publication_ethics_policies',
      'jama_race_ethnicity_guidance_2021',
      'cse_publication_ethics_white_paper',
    ],
  },
  {
    id: 'health-media',
    title: 'Health Media Standards',
    summary: 'Sources used to assess public-facing health journalism, sourcing quality, and explanatory balance.',
    docIds: ['schwitzer_health_journalism_500_stories_2008', 'ahcj_health_journalism_principles'],
  },
  {
    id: 'healthcare-ihl',
    title: 'Healthcare & International Humanitarian Law Sources',
    summary: 'Healthcare-in-conflict and humanitarian-law sources used as precision guardrails, not legal adjudication tools.',
    docIds: [
      'icrc_customary_ihl_rule_1',
      'icrc_customary_ihl_rule_7',
      'icrc_customary_ihl_rule_14',
      'icrc_customary_ihl_rule_15',
      'icrc_customary_ihl_rule_25',
      'icrc_customary_ihl_rule_28',
      'icrc_health_care_in_danger_making_case',
      'icrc_healthcare_personnel_responsibilities_conflict',
    ],
  },
  {
    id: 'textlens-framework',
    title: 'TextLens Working Framework',
    summary: 'The app’s internal taxonomy and guardrail framework, shown here as a summary rather than the full registry.',
    docIds: ['textlens_framework'],
  },
];

function getTaxonomyItemsForLayer(layerId: TaxonomySummaryLayerId): TaxonomyItem[] {
  if (layerId === 0) {
    return textLensTaxonomy.filter(item => item.section.includes('Layer 0') || item.family === 'Protected non-trigger');
  }
  return textLensTaxonomy.filter(item => item.section.includes(`Layer ${layerId}`));
}

function getDisplayUsageSummary(doc: StandardDoc, summary?: string, role?: string) {
  return role || summary || doc.description;
}

function getDisplayBoundary(limitations?: string) {
  if (!limitations) return '';
  const match = limitations.match(/^.*?[.!?](?:\s|$)/);
  return (match?.[0] || limitations).trim();
}

export default function StandardsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (docId: string) => {
    setExpandedDocs(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const categories = ['All', 'Antisemitism Definitions', 'Media & Broadcasting Codes', 'Academic & Publishing Standards', 'Rhetorical Frameworks'];

  const filteredDocs = standardsList
    .filter((doc) => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.clauses.some(
          c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aRank = standardDisplayRank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bRank = standardDisplayRank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      if (aRank !== bRank) return aRank - bRank;
      return a.name.localeCompare(b.name);
    });

  const groupedDocs = STANDARD_SECTIONS
    .map((section) => ({
      ...section,
      docs: filteredDocs.filter((doc) => section.docIds.includes(doc.id)),
    }))
    .filter((section) => section.docs.length > 0);

  const totalTaxonomyItems = textLensTaxonomy.length;
  const taxonomySummaryLayers = ([1, 2, 3, 0] as const).map((layerId) => {
    const items = getTaxonomyItemsForLayer(layerId);
    return {
      ...taxonomyLayerConfigs[layerId],
      layerId,
      count: items.length,
      examples: items.slice(0, 3),
    };
  });

  const renderTaxonomyFrameworkSummary = () => (
    <div className="space-y-5">
      <div className="rounded-lg border border-indigo-200 bg-linear-to-r from-indigo-50 via-white to-slate-50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-700 shrink-0" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-950 font-mono">
                TextLens Taxonomy Snapshot
              </h4>
              <span className="rounded border border-indigo-200 bg-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-800">
                Summary Only
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700 font-sans max-w-3xl">
              This tab shows a condensed overview of the TextLens taxonomy rather than the full registry. It summarizes the four analytical layers, the current item count, and representative diagnostics so readers can understand the framework without scrolling through all {totalTaxonomyItems} taxonomy elements.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 shrink-0">
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Items</div>
              <div className="text-lg font-bold text-slate-950">{totalTaxonomyItems}</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Layers</div>
              <div className="text-lg font-bold text-slate-950">4</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Use</div>
              <div className="text-sm font-bold text-slate-950">Audit Map</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {taxonomySummaryLayers.map((layer) => (
          <div key={layer.layerId} className={`rounded-lg border p-4 ${layer.accentClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-semibold text-slate-950">{layer.title}</h5>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${layer.badgeClass}`}>
                    {layer.count} items
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700 font-sans">
                  {layer.summary}
                </p>
              </div>
              {layer.layerId === 0 ? (
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : layer.layerId === 1 ? (
                <ShieldAlert className="h-5 w-5 text-red-700 shrink-0 mt-0.5" />
              ) : layer.layerId === 2 ? (
                <Scale className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-indigo-700 shrink-0 mt-0.5" />
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Representative Diagnostics
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.examples.map((item) => (
                  <div key={item.id} className="rounded-md border border-white/80 bg-white/85 px-2.5 py-2 text-[11px] leading-snug text-slate-800 shadow-[0_1px_1px_rgba(0,0,0,0.02)]">
                    <div className="font-mono font-bold text-slate-500">{item.id}</div>
                    <div className="font-semibold text-slate-900">{item.categoryTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-700 font-sans">
        <strong className="text-slate-950">Reading note:</strong> the <em>Standards</em> tab is meant to orient the reader. For the full item-by-item taxonomy explorer, including boundaries, examples, and mode-sensitive weighting, use the <strong>Methods</strong> tab.
      </div>
    </div>
  );

  const renderStandardCard = (doc: StandardDoc) => {
    const isExpanded = expandedDocs[doc.id];
    const sourceMeta = sourceCatalogList.find((item) => item.sourceKey === doc.id);

    return (
      <div
        key={doc.id}
        id={`standard-card-${doc.id}`}
        className="bg-white border border-slate-200/80 rounded-lg shadow-3xs overflow-hidden transition-all duration-200 hover:border-slate-300"
      >
        <div
          onClick={() => toggleDoc(doc.id)}
          className="px-5 py-4 bg-slate-50/50 hover:bg-slate-50/90 border-b border-slate-100/85 flex items-start justify-between cursor-pointer select-none transition-all duration-150"
        >
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600 shrink-0" />
              <h3 className="text-sm font-semibold text-slate-900 font-sans">{doc.name}</h3>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-55/10 text-indigo-805 border border-indigo-200/50">
                {doc.shortName}
              </span>
              {sourceMeta?.sourceType && (
                <span className="text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {sourceMeta.sourceType}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 line-clamp-1">{doc.description}</p>
            {doc.jurisdictionContext && (
              <span className="inline-block text-[10px] font-mono text-slate-400">
                Regulatory Context: <strong className="text-slate-600 font-medium">{doc.jurisdictionContext}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            {doc.fullTextUrl && (
              <a
                href={doc.fullTextUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                title="View Full Source Text"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button type="button" className="text-slate-500 hover:bg-slate-100 p-1 rounded-md transition-all">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-slate-50/25 p-5 border-t border-slate-100">
            {sourceMeta && (
              <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 leading-relaxed font-sans">
                <strong className="text-slate-900">Use:</strong> {getDisplayUsageSummary(doc, sourceMeta.summary, sourceMeta.role)}
                {sourceMeta.limitations && (
                  <div className="mt-2 text-slate-500">
                    <strong className="text-slate-700">Boundary:</strong> {getDisplayBoundary(sourceMeta.limitations)}
                  </div>
                )}
              </div>
            )}
            {doc.id === 'textlens_framework' ? (
              renderTaxonomyFrameworkSummary()
            ) : (
              <div className="overflow-x-auto rounded-md border border-slate-200/60 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-4 w-28">Ref ID</th>
                      <th className="py-3 px-4 w-44">Focus Area</th>
                      <th className="py-3 px-4">Registry Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {doc.clauses.map((clause) => (
                      <tr
                        key={clause.id}
                        id={`clause-row-${clause.id}`}
                        className="hover:bg-indigo-50/15 transition-all text-slate-800"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-indigo-705 align-top">
                          <span className="bg-indigo-50/60 border border-indigo-100/60 rounded px-1.5 py-0.5 leading-none">
                            {clause.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 align-top">
                          {clause.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600 leading-relaxed font-sans max-w-[500px]">
                          {clause.text}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-slate-200/60 p-4 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)] border-b-2">
        <div>
          <h2 className="text-base font-semibold text-slate-950 flex items-center space-x-2 font-display">
            <Scale className="w-5 h-5 text-slate-800" />
            <span>Standards, Frameworks and Codes of Conduct</span>
          </h2>
        </div>

        {/* Search & Filter controls */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="standards-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clauses or terms..."
              className="pl-9 pr-4 py-1.5 w-full sm:w-64 text-xs font-mono border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 bg-slate-50/50 hover:bg-white focus:bg-white transition-all text-slate-800"
            />
          </div>

          <select
            id="standards-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-md text-slate-700 bg-slate-50/50 hover:bg-white focus:bg-white cursor-pointer transition-all focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Registry System Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 space-y-2.5 leading-relaxed font-sans shadow-3xs">
        <h3 className="font-semibold text-slate-950 flex items-center gap-1.5 font-sans">
          <Info className="w-4 h-4 text-slate-800 shrink-0" />
          <span>How TextLens Uses These Sources</span>
        </h3>
        <p>
          This registry includes both <strong>codified clauses</strong> and <strong>practical review checkpoints</strong>. Some entries quote source language directly, while others summarize how TextLens applies that source.
        </p>
        <p>
          Broad consensus definitions such as the <strong>Jerusalem Declaration (JDA)</strong> and the <strong>Nexus Document</strong> are used as interpretive frameworks. Their guidance is mapped through the core <strong>TextLens taxonomy of {totalTaxonomyItems} diagnostic elements</strong>. The entry under <em>Rhetorical Frameworks</em> below is a summary of that taxonomy, not the full registry.
        </p>
      </div>

      <div className="space-y-6">
        {filteredDocs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500 text-sm font-mono">
            No standards or clauses found matching current search criteria.
          </div>
        ) : (
          groupedDocs.map((section) => (
            <section key={section.id} className="space-y-3">
              <div className="px-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-slate-950 font-sans">{section.title}</h3>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {section.docs.length} source{section.docs.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 font-sans max-w-3xl">
                  {section.summary}
                </p>
              </div>
              <div className="space-y-4">
                {section.docs.map(renderStandardCard)}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
