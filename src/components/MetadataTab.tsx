import React from 'react';
import { Save, Info, AlertTriangle, Radio, Film, Heart, Sliders, HelpCircle, Users } from 'lucide-react';
import { TextLensMetadata } from '../types';
import { communicationTypes, rhetoricalFunctions } from '../communicationContext';

interface MetadataTabProps {
  metadata: TextLensMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<TextLensMetadata>>;
}

export default function MetadataTab({ metadata, setMetadata }: MetadataTabProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setMetadata(prev => ({
      ...prev,
      [name]: val
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/60 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] space-y-5">
        <div className="flex items-start space-x-3 pb-3 border-b border-slate-100">
          <Info className="w-5 h-5 text-slate-800 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-950 font-display uppercase tracking-wider">Document Data & Source Registry (Metadata)</h2>
            <p className="text-slate-600 text-xs font-sans mt-0.5">
              Establishing rigorous, legalistic context is prerequisite for academic and media complaints. Accurate bibliographic properties are referenced in suggested response letters.
            </p>
          </div>
        </div>

        <form className="space-y-6 font-mono text-[11px]">
          {/* Section 1: Core Fields (Compact Grid) */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1. General Bibliographic Context</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-title">
                  Document / Article Title *
                </label>
                <input
                  id="meta-title"
                  type="text"
                  name="title"
                  value={metadata.title}
                  onChange={handleChange}
                  placeholder="Enter document title"
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-author">
                  Author / Speaker / Source *
                </label>
                <input
                  id="meta-author"
                  type="text"
                  name="author"
                  value={metadata.author}
                  onChange={handleChange}
                  placeholder="Name of authors, commentators, or hosts"
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-platform">
                  Publishing Platform / Network *
                </label>
                <input
                  id="meta-platform"
                  type="text"
                  name="platform"
                  value={metadata.platform}
                  onChange={handleChange}
                  placeholder="Journal name, TV station, or website domain"
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-date">
                  Publication / Broadcast Date *
                </label>
                <input
                  id="meta-date"
                  type="date"
                  name="date"
                  value={metadata.date}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-url">
                  Source Document URL
                </label>
                <input
                  id="meta-url"
                  type="url"
                  name="url"
                  value={metadata.url}
                  onChange={handleChange}
                  placeholder="https://example.com/editorial-source"
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-type">
                  Content / Text Type *
                </label>
                <input
                  id="meta-type"
                  type="text"
                  name="textType"
                  value={metadata.textType}
                  onChange={handleChange}
                  placeholder="e.g. Open Letter, Peer-Reviewed Article, Editorial, Broadcast Transcript"
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-jurisdiction">
                  Jurisdiction / Legal Territory *
                </label>
                <select
                  id="meta-jurisdiction"
                  name="jurisdiction"
                  value={metadata.jurisdiction}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans cursor-pointer transition-all"
                >
                  <option value="Global / Multi-Jurisdiction">Global / Multi-Jurisdiction</option>
                  <option value="South Africa (ZA)">South Africa (ZA)</option>
                  <option value="USA / North America">USA / North America</option>
                  <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                  <option value="European Union (EU)">European Union (EU)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-mode">
                  Active Analysis Mode *
                </label>
                <select
                  id="meta-mode"
                  name="analysisMode"
                  value={metadata.analysisMode}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans cursor-pointer transition-all"
                >
                  <option value="consumer">Community / General Review Mode</option>
                  <option value="general">Consensus Standards Mode</option>
                  <option value="healthcare">Healthcare Publishing Mode</option>
                  <option value="academic">Academic/University Mode</option>
                  <option value="bccsa">BCCSA Mode</option>
                  <option value="press_code">Press Code Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1" htmlFor="meta-comm-type">
                  Communication Type *
                </label>
                <select
                  id="meta-comm-type"
                  name="communicationType"
                  value={metadata.communicationType || ''}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-slate-950 focus:ring-1 focus:ring-slate-950 font-sans cursor-pointer transition-all"
                >
                  <option value="">-- Choose Communication Type --</option>
                  {communicationTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contextual interpretive guidance block */}
            {metadata.communicationType && (
              <div className="mt-4 p-3.5 bg-indigo-50/40 border border-indigo-150 rounded-md space-y-2.5 animate-[fadeIn_0.15s_ease-out]">
                <div className="flex items-center space-x-1.5 text-indigo-900 font-bold uppercase tracking-wider text-[9px]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Interpretive Context Diagnostics</span>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-slate-700 leading-normal text-[11px] font-sans">
                  {(() => {
                    const ct = communicationTypes.find(c => c.id === metadata.communicationType);
                    if (!ct) return null;
                    const isUrgentAppealsType = ['open_letter', 'public_petition', 'institutional_statement'].includes(ct.id);
                    return (
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Communication Type Focus: "{ct.label}"</span>
                        <p className="text-slate-600 text-xs">{ct.description}</p>
                        <p className="text-slate-650 bg-white/70 p-2 rounded border border-slate-150 text-[11px]">
                          <strong>Interpretation:</strong> {ct.interpretiveRisks}
                        </p>
                        
                        {isUrgentAppealsType && (
                          <div className="bg-amber-50/60 text-amber-900 border border-amber-200 p-2.5 rounded text-[11px] space-y-1">
                            <span className="font-mono font-bold uppercase tracking-wide text-[9px] block">Scholarly Appeals Guidance:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                              <li>May function as moral appeals/mobilisation documents rather than neutral reports</li>
                              <li>May compress complex events into urgent moral binaries</li>
                              <li>May use signatures, professional identity or institutional authority as credibility signals</li>
                              <li>May omit context, victims, chronology, or baseline uncertainty</li>
                              <li className="italic text-slate-500 font-mono text-[9px] list-none mt-1">Note: These features are not automatically antisemitic, but are relevant to rhetorical and evidentiary analysis.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Conditional BCCSA Form */}
          {metadata.analysisMode === 'bccsa' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/60 rounded-lg animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200/60">
                <Film className="w-4 h-4 text-slate-700" />
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">2. BCCSA / Broadcast Complaint Regulatory Diagnostics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Broadcaster *
                  </label>
                  <input
                    type="text"
                    name="broadcaster"
                    value={metadata.broadcaster || ''}
                    onChange={handleChange}
                    placeholder="e.g. SABC, eNCA, Newzroom Afrika"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Channel *
                  </label>
                  <input
                    type="text"
                    name="channel"
                    value={metadata.channel || ''}
                    onChange={handleChange}
                    placeholder="e.g. Channel 403, SABC 3"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Programme Name *
                  </label>
                  <input
                    type="text"
                    name="programmeName"
                    value={metadata.programmeName || ''}
                    onChange={handleChange}
                    placeholder="e.g. Sunday Night Live"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Date & Time of Broadcast
                  </label>
                  <input
                    type="text"
                    name="broadcastDateTime"
                    value={metadata.broadcastDateTime || ''}
                    onChange={handleChange}
                    placeholder="e.g. 2026-05-28 20:30 UTC"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Watershed / Audience Context
                  </label>
                  <input
                    type="text"
                    name="watershedContext"
                    value={metadata.watershedContext || ''}
                    onChange={handleChange}
                    placeholder="e.g. Family viewing time, adult audience advisory"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="transcriptAvailable"
                    name="transcriptAvailable"
                    checked={!!metadata.transcriptAvailable}
                    onChange={handleChange}
                    className="text-slate-950 focus:ring-slate-950 h-3.5 w-3.5 accent-slate-900 rounded cursor-pointer"
                  />
                  <label htmlFor="transcriptAvailable" className="text-slate-700 font-semibold uppercase tracking-wider select-none cursor-pointer">
                    Transcript Available
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Complainant Summary
                  </label>
                  <textarea
                    name="complainantSummary"
                    value={metadata.complainantSummary || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Summary profiles of complainants submitting the ombud filing..."
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Alleged Harm or Breach
                  </label>
                  <textarea
                    name="allegedHarm"
                    value={metadata.allegedHarm || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Describe specific claims, misrepresentations, pathologizing metaphors, or hostile omissions causing regulatory harm..."
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Conditional Medical/Healthcare Code Form */}
          {metadata.analysisMode === 'healthcare' && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/60 rounded-lg animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200/60">
                <Heart className="w-4 h-4 text-slate-700" />
                <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">2. Healthcare / Bio-Clinical Publication Parameters</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Journal or Publication *
                  </label>
                  <input
                    type="text"
                    name="journalOrPublication"
                    value={metadata.journalOrPublication || ''}
                    onChange={handleChange}
                    placeholder="e.g. The New England Journal of Medicine, Lancet"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Article Type *
                  </label>
                  <input
                    type="text"
                    name="articleType"
                    value={metadata.articleType || ''}
                    onChange={handleChange}
                    placeholder="e.g. Peer-Reviewed Original, Clinical Case Study, Editorial Comment"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    DOI or PMID Descriptor
                  </label>
                  <input
                    type="text"
                    name="doiOrPmid"
                    value={metadata.doiOrPmid || ''}
                    onChange={handleChange}
                    placeholder="e.g. doi:10.1056/NEJMoa21000"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                    Author Affiliation Overview
                  </label>
                  <input
                    type="text"
                    name="authorAffiliation"
                    value={metadata.authorAffiliation || ''}
                    onChange={handleChange}
                    placeholder="e.g. Division of Social Medicine, Harvard Public Health"
                    className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-slate-950 transition-all font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Community / General Review Mode — Publication Prominence */}
          {metadata.analysisMode === 'consumer' && (
            <div className="space-y-3 p-4 bg-violet-50/50 border border-violet-200/60 rounded-lg animate-[fadeIn_0.2s_ease-out]">
               <div className="flex items-center space-x-2 pb-2 border-b border-violet-200/60">
                <Users className="w-4 h-4 text-violet-700" />
                <h3 className="text-[10px] font-bold text-violet-900 uppercase tracking-widest">2. Community / General Review Mode — Publication Prominence</h3>
              </div>
              <p className="text-[11px] text-violet-800 font-sans leading-relaxed">
                Select the prominence tier of the publication or platform. This is used to calculate the <strong>Worthy of Response</strong> score — higher-reach outlets amplify the urgency of any findings.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {([
                  [5, 'Major international or national outlet', 'e.g. BBC, CNN, New York Times, Al Jazeera, Guardian, major national broadcaster'],
                  [4, 'Regional outlet', 'e.g. Regional newspaper, regional TV/radio station, large community publication'],
                  [3, 'Specialist or niche publication', 'e.g. Professional journal, specialist magazine, industry newsletter'],
                  [2, 'Social media / online platform', 'e.g. Twitter/X account, Facebook page, YouTube channel, online-only outlet'],
                  [1, 'Blog, independent, or minor outlet', 'e.g. Personal blog, Substack, small independent website, minor community publication'],
                ] as [number, string, string][]).map(([tier, label, example]) => (
                  <label
                    key={tier}
                    className={`flex items-start space-x-3 p-2.5 rounded border cursor-pointer transition-all ${
                      (metadata.publicationProminenceTier ?? 3) === tier
                        ? 'bg-violet-100 border-violet-400 text-violet-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="publicationProminenceTier"
                      value={tier}
                      checked={(metadata.publicationProminenceTier ?? 3) === tier}
                      onChange={() => setMetadata(prev => ({ ...prev, publicationProminenceTier: tier as 1|2|3|4|5 }))}
                      className="mt-0.5 accent-violet-600 shrink-0"
                    />
                    <div>
                      <span className="text-[11px] font-bold font-mono block">Tier {tier}: {label}</span>
                      <span className="text-[10px] text-slate-500 font-sans">{example}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-5 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold block mb-1 text-slate-900 font-sans">Administrative Transparency Notice</span>
          Changes made in this metadata console will propagate directly to the <strong className="font-semibold text-slate-900">Report</strong> and <strong className="font-semibold text-slate-900">Export</strong> modules. Setting precise publication details ensures that regulatory complaint letters target relevant statutes and oversight committees without errors.
        </div>
      </div>
    </div>
  );
}
