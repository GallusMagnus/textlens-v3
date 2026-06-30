import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  Search, 
  Info,
  Sliders
} from 'lucide-react';
import { textLensTaxonomy, TaxonomyItem } from '../taxonomyData';

export default function MethodsTab() {
  const [selectedTaxonomyLayer, setSelectedTaxonomyLayer] = useState<1 | 2 | 3 | 0>(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [taxonomySearch, setTaxonomySearch] = useState('');

  // Filtering taxonomy categories
  const filteredTaxonomy = textLensTaxonomy.filter(item => {
    let matchesLayer = false;
    if (selectedTaxonomyLayer === 1) {
      matchesLayer = item.section.includes("Layer 1");
    } else if (selectedTaxonomyLayer === 2) {
      matchesLayer = item.section.includes("Layer 2");
    } else if (selectedTaxonomyLayer === 3) {
      matchesLayer = item.section.includes("Layer 3");
    } else if (selectedTaxonomyLayer === 0) {
      matchesLayer = item.section.includes("Layer 0") || item.family === "Protected non-trigger";
    }

    const matchesSearch = !taxonomySearch || 
      item.categoryTitle.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      item.family.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      item.quoteLabel.toLowerCase().includes(taxonomySearch.toLowerCase());

    return matchesLayer && matchesSearch;
  });

  const layerMetaData = {
    1: {
      name: "Layer 1: Direct Antisemitic Content",
      description: "Traditional and overt anti-Jewish tropes, slurs, conspiracy claims, and guilt projections that operate independently of contemporary geopolitical events or state criticism."
    },
    2: {
      name: "Layer 2: Contemporary Israel/Zionism-linked Antisemitism",
      description: "Evaluates contexts where geopolitical conflicts, opposition to Zionism, or criticisms of Israeli state policies cross the boundary into systemic hostility targeting Jewish people, institutions, or identity markers."
    },
    3: {
      name: "Layer 3: Rhetorical and Evidentiary Taxonomy",
      description: "Evaluates evidence handling, language and emphasis, agency, conflation, frame-shifting, immunity moves, and authority effects that can distort interpretation without by themselves proving antisemitism."
    },
    0: {
      name: "Layer 0: Protected Guardrails & Exemptions",
      description: "Protected non-trigger categories representing ordinary political expression, criticism, other standard political theories, and non-discriminatory advocacy exempt from bias flags to protect free speech."
    }
  };

  const currentLayerMeta = layerMetaData[selectedTaxonomyLayer];

  return (
    <div id="methods-tab-container" className="space-y-8 font-sans pb-10">
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs flex flex-col lg:flex-row gap-6 items-start">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 shrink-0">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">How TextLens Works</h2>
          <p className="text-slate-650 text-xs leading-relaxed max-w-4xl">
            TextLens is a <strong className="font-semibold text-slate-900">structured review tool</strong>. It does not make legal findings or replace human judgement. Instead, it helps users review a text against selected standards, identify exact passages, apply guardrails for protected speech, and organise possible concerns in a transparent way.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-violet-50/50 border border-violet-200 rounded-lg p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-violet-900">
            <Info className="w-4 h-4 text-violet-700 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-violet-950">Consumer Mode</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Community / General Review Mode</strong> is the lighter, more public-facing mode. It is designed for community monitoring, response triage and practical review. It gives a score-based output and a broad reading of intensity, distortion and response-worthiness.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-slate-900">
            <Scale className="w-4 h-4 text-slate-700 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">Professional Modes</h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            The other modes are <strong className="text-slate-900">standards-based professional modes</strong>. They use more specific frameworks, codes and source boundaries for specialist review, such as consensus antisemitism definitions, healthcare publication standards, academic norms, broadcast codes and the South African Press Code.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-indigo-850">
            <Info className="w-4 h-4 text-indigo-650 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">Mode, Taxonomy and Sources</h4>
          </div>
          <p className="text-slate-705 text-xs leading-relaxed">
            TextLens separates the <strong className="text-slate-900">mode of review</strong> from the <strong className="text-slate-900">taxonomy used for classification</strong>. The selected mode determines which standards, frameworks and source rules are active. The taxonomy is the shared structure used to organise findings.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-slate-900">
            <Sliders className="w-4 h-4 text-indigo-600 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">Communication Context</h4>
          </div>
          <p className="text-slate-705 text-xs leading-relaxed">
            Communication type and rhetorical function are used as <strong className="text-slate-900">interpretive context</strong>. They help TextLens assess whether a text behaves like news, an editorial, an open letter, a petition, a broadcast segment or a formal complaint. They do not by themselves decide the result.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-2.5">
          <div className="flex items-center space-x-2 text-slate-900">
            <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-900">Human Review</h4>
          </div>
          <p className="text-slate-705 text-xs leading-relaxed">
            TextLens is a <strong className="text-slate-900">review aid</strong>, not a court, regulator or censorship tool. Outputs should be treated as structured review material that still needs human checking, especially where texts are incomplete, ambiguous or legally sensitive.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55">
          <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest">
            What Happens During Analysis
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-3xl">
            The live TextLens engine follows a staged review process. It is structured enough to reduce hallucination and overreach, but still relies on human judgement at the end.
          </p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[
            {
              step: '1',
              title: 'Select the mode',
              text: 'The chosen mode activates the relevant standards, frameworks and review boundaries.'
            },
            {
              step: '2',
              title: 'Find candidate passages',
              text: 'TextLens scans the submitted text for exact passages that may need closer review.'
            },
            {
              step: '3',
              title: 'Apply guardrails first',
              text: 'Protected political speech, BDS and boycott advocacy, and alternative constitutional views are checked before a concern is accepted.'
            },
            {
              step: '4',
              title: 'Classify surviving passages',
              text: 'Only passages that remain in scope are matched against the TextLens taxonomy and relevant sources.'
            },
            {
              step: '5',
              title: 'Summarise and report',
              text: 'TextLens groups the findings, records limitations, and produces a structured report for human review.'
            }
          ].map((item) => (
            <div key={item.step} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">
                {item.step}
              </div>
              <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Structured TextLens Taxonomy Explorer */}
      <div id="textlens-taxonomy-explorer" className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-655" />
              <span>TextLens Taxonomy Reference</span>
            </h3>
            <p className="text-slate-500 text-[10px] font-mono">
              A reference view of the working taxonomy used to organise findings, boundaries and mode-specific relevance.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={taxonomySearch}
                onChange={(e) => setTaxonomySearch(e.target.value)}
                placeholder="Search taxonomy..."
                className="pl-8 pr-3 py-1 text-xs font-mono border border-slate-200 bg-white rounded-md w-full sm:w-48 text-slate-800 focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            {/* Layer Selector */}
            <div className="flex bg-slate-100 p-1 rounded-md border border-slate-205/85 whitespace-nowrap overflow-x-auto shadow-3xs">
              {([1, 2, 3, 0] as const).map((lvl) => {
                const isActive = selectedTaxonomyLayer === lvl;
                let activeBtnClass = 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/55';
                if (isActive) {
                  if (lvl === 1) {
                    activeBtnClass = 'bg-red-650 text-white font-bold shadow-3xs border border-red-700/20';
                  } else if (lvl === 2) {
                    activeBtnClass = 'bg-amber-600 text-white font-bold shadow-3xs border border-amber-700/20';
                  } else if (lvl === 3) {
                    activeBtnClass = 'bg-indigo-650 text-white font-bold shadow-3xs border border-indigo-750/20';
                  } else if (lvl === 0) {
                    activeBtnClass = 'bg-emerald-600 text-white font-bold shadow-3xs border border-emerald-700/20';
                  }
                }
                return (
                  <button
                    key={lvl}
                    onClick={() => { setSelectedTaxonomyLayer(lvl); setExpandedCategory(null); }}
                    className={`px-3 py-1.5 text-[9.5px] font-mono leading-none tracking-wider uppercase rounded-md transition-all cursor-pointer ${activeBtnClass}`}
                  >
                    {lvl === 0 ? 'Exemptions' : `Layer ${lvl}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Layer Overview */}
        <div className="p-5 space-y-5">
          <div className={`p-4 border rounded-md flex gap-4 items-start ${
            selectedTaxonomyLayer === 0 
              ? 'bg-emerald-50/40 border-emerald-250' 
              : 'bg-slate-50/70 border-slate-150'
          }`}>
            <div className={`p-2 bg-white border rounded shrink-0 flex items-center justify-center h-10 w-10 shadow-3xs ${
              selectedTaxonomyLayer === 0 ? 'border-emerald-200' : 'border-slate-200'
            }`}>
              {selectedTaxonomyLayer === 0 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-650" />
              ) : (
                <span className={`text-[12px] font-mono font-bold leading-none ${
                  selectedTaxonomyLayer === 1 ? 'text-red-700' :
                  selectedTaxonomyLayer === 2 ? 'text-amber-700' : 'text-indigo-700'
                }`}>
                  L{selectedTaxonomyLayer}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-905 uppercase tracking-wide font-mono flex items-center gap-2">
                <span>{currentLayerMeta.name}</span>
                {selectedTaxonomyLayer === 0 && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    Guardrail
                  </span>
                )}
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">{currentLayerMeta.description}</p>
            </div>
          </div>

          {/* Warning notice safeguards for Layer 3 */}
          {selectedTaxonomyLayer === 3 && (
            <div className="p-4 bg-blue-50/50 border border-blue-200 text-slate-800 rounded-lg text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-blue-900 block uppercase tracking-wider text-[10px] mb-1">Methodological Safeguard Notice</span>
                <p className="text-slate-750 font-sans">
                  <strong className="font-semibold text-slate-900">Layer 3 rhetorical and evidentiary findings</strong> trigger analytical review regarding objectivity and consistency, but <span className="font-bold text-indigo-700 underline">do not by themselves prove antisemitism</span>. They identify problems in evidence handling, framing, agency, conflation, preconditions, counter-attack moves, or authority laundering that may require cross-reference with Layer 1 or Layer 2 before a stronger conclusion is justified.
                </p>
              </div>
            </div>
          )}

          {/* Categories Grid with Accordions */}
          {filteredTaxonomy.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-500 text-xs font-mono">
              No categories found matching "{taxonomySearch}" inside this classification layer.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTaxonomy.map((item) => {
                const isExpanded = expandedCategory === item.id;
                const isGuardrail = item.family === 'Protected non-trigger';

                return (
                  <div 
                    key={item.id} 
                    id={`taxonomy-category-${item.id}`}
                    className={`border rounded-lg transition-all ${
                      isExpanded 
                        ? isGuardrail 
                          ? 'border-emerald-400 bg-emerald-50/10 shadow-3xs'
                          : 'border-indigo-300 bg-indigo-50/10 shadow-3xs' 
                        : isGuardrail
                          ? 'border-emerald-200 hover:border-emerald-300 bg-emerald-50/15'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Accordion Trigger */}
                    <div 
                      onClick={() => setExpandedCategory(isExpanded ? null : item.id)}
                      className="p-3.5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight shrink-0">
                            {item.id}
                          </span>
                          <span className="text-xs font-bold text-slate-950 font-sans truncate" title={item.categoryTitle}>
                            {item.categoryTitle}
                          </span>
                          {isGuardrail ? (
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded leading-tight border bg-emerald-100 text-emerald-800 border-emerald-200 uppercase tracking-wider shrink-0">
                              Guardrail
                            </span>
                          ) : (
                            <span className={`text-[8px] font-mono font-semibold px-2 py-0.5 rounded leading-tight border shrink-0 ${
                              item.severity === 'Severe / Direct' ? 'bg-red-50 text-red-700 border-red-150' :
                              item.severity === 'Moderate / Distorted' ? 'bg-amber-50 text-amber-700 border-amber-150' :
                              item.severity === 'Minor Bias' ? 'bg-amber-50/40 text-amber-655 border-amber-100' :
                              'bg-slate-50 text-slate-650 border-slate-150'
                            }`}>
                              {item.severity}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {item.definition}
                        </p>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {isExpanded ? (
                          <ChevronDown className={`w-4 h-4 ${isGuardrail ? 'text-emerald-650' : 'text-indigo-500'}`} />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Detail Drawer */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1.5 border-t border-slate-100 text-xs space-y-4 bg-slate-50/40">
                        
                        {/* Section name info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                          <div>
                            Section: <strong className="text-slate-700 font-bold">{item.section}</strong>
                          </div>
                          <div>
                            Family: <strong className="text-slate-700 font-bold">{item.family}</strong>
                          </div>
                        </div>

                        {/* Standard Definition */}
                        <div>
                          <span className="block text-[8.5px] uppercase font-mono font-bold text-slate-400 tracking-wider mb-1">Standard Definition</span>
                          <p className="text-slate-700 leading-relaxed font-sans">{item.definition}</p>
                        </div>

                        {/* Flaw / Why It Matters */}
                        <div>
                          <span className="block text-[8.5px] uppercase font-mono font-bold text-slate-400 tracking-wider mb-1">Why It Matters</span>
                          <p className="text-slate-650 leading-relaxed font-sans">{item.flawOrWhyItMatters}</p>
                        </div>

                        {/* Boundary Note */}
                        <div className="p-3 bg-indigo-50/30 border border-indigo-100/50 rounded-md">
                          <span className="block text-[8.5px] uppercase font-mono font-bold text-indigo-700 tracking-wider mb-1">Guardrail / Boundary Note</span>
                          <p className="text-slate-700 font-sans leading-relaxed">{item.boundaryNote}</p>
                        </div>

                        {/* Interactive Examples */}
                        <div className="space-y-3">
                          {/* Realistic Trigger Examples */}
                          {item.examples && item.examples.length > 0 && (
                            <div className="space-y-1.5 bg-red-50/20 border border-red-100/40 p-3 rounded">
                              <span className="block text-[8.5px] uppercase font-mono font-bold text-red-700 tracking-wider">Audit Trigger Examples</span>
                              {item.examples.map((ex, i) => (
                                <blockquote key={i} className="text-[11px] text-red-950 font-serif italic leading-relaxed pl-2 border-l border-red-200">
                                  "{ex}"
                                </blockquote>
                              ))}
                            </div>
                          )}

                          {/* Safe Non-Examples */}
                          {item.nonExamples && item.nonExamples.length > 0 && (
                            <div className="space-y-1.5 bg-emerald-50/15 border border-emerald-100/30 p-3 rounded">
                              <span className="block text-[8.5px] uppercase font-mono font-bold text-emerald-700 tracking-wider font-mono">Protected / Expression Exemptions</span>
                              {item.nonExamples.map((nex, i) => (
                                <p key={i} className="text-[11px] text-slate-700 font-sans leading-relaxed pl-2 border-l border-emerald-250">
                                  {nex}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Mode Relevance Weighting Matrix Grid */}
                        <div className="bg-slate-100/60 p-3.5 border border-slate-200 rounded-md space-y-2">
                          <span className="block text-[8.5px] uppercase font-mono font-bold text-slate-500 tracking-wider">
                            How TextLens Uses This Item By Mode
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                            {(Object.keys(item.modeWeighting) as Array<keyof typeof item.modeWeighting>).map((mode) => {
                              const weight = item.modeWeighting[mode];
                              return (
                                <div key={mode} className="bg-white border border-slate-200 rounded p-1.5 flex flex-col items-center text-center shadow-3xs">
                                  <span className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-tight">
                                    {mode === 'general' ? 'Consensus Stds' :
                                     mode === 'healthcare' ? 'Health Pub' :
                                     mode === 'academic' ? 'Acad/University' :
                                     mode === 'bccsa' ? 'BCCSA Broadcast' : 'SA Press Code'}
                                  </span>
                                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded mt-1.5 border uppercase ${
                                    weight === 'primary' 
                                      ? 'bg-red-50 text-red-700 border-red-100' 
                                      : weight === 'supporting'
                                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                                        : weight === 'advisory'
                                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  }`}>
                                    {weight}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Footer details row */}
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-[9px] font-mono text-slate-500 pt-2.5 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 mr-1 uppercase">Primary Score Impact:</span>
                            <span className={`font-bold ${
                              item.primaryScoreImpact === 'High' ? 'text-red-700' :
                              item.primaryScoreImpact === 'Moderate' ? 'text-amber-700' :
                              item.primaryScoreImpact === 'Low' ? 'text-indigo-700' : 'text-slate-500'
                            }`}>{item.primaryScoreImpact}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 mr-1 uppercase">Ref Key:</span>
                            <span className="text-indigo-650 font-bold">{item.referenceKeys.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 mr-1 uppercase">References:</span>
                            <span className="text-slate-700 font-semibold">{item.referenceNote}</span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-100/50 border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
          <Scale className="w-5 h-5 text-slate-800" />
          <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest">
            Important Limits and Safeguards
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed font-sans">
          {/* Pillar 1 */}
          <div className="bg-white p-4 border border-slate-200 rounded-md shadow-3xs space-y-2">
            <span className="block font-bold text-slate-950 uppercase tracking-wider text-[10px] font-mono">
              Not a Censorship Tool
            </span>
            <p className="text-slate-650">
              TextLens is an analytical review tool. It does not automatically decide complaints, remove content, or replace expert editorial, legal, academic or community judgement.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-4 border border-slate-200 rounded-md shadow-3xs space-y-2">
            <span className="block font-bold text-slate-950 uppercase tracking-wider text-[10px] font-mono">
              Protected Criticism
            </span>
            <p className="text-slate-650">
              Criticism of Israel, Zionism or state policy is <strong className="font-semibold text-slate-900">not</strong> automatically antisemitic. Guardrails are built in to protect ordinary political speech and legitimate advocacy.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-4 border border-slate-200 rounded-md shadow-3xs space-y-2">
            <span className="block font-bold text-slate-950 uppercase tracking-wider text-[10px] font-mono">
              Evidence First
            </span>
            <p className="text-slate-655">
              TextLens should rely on exact quoted passages, mode-specific sources, alternative benign interpretations, and clear limitations. A keyword by itself is never enough.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
