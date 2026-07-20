import React from 'react';
import {
  BarChart3,
  ExternalLink,
  FlaskConical,
  Globe2,
  Newspaper,
} from 'lucide-react';

const HUMANITARIAN_DASHBOARD_PATH = '/research/humanitarian-attention/index.html';

export default function ResearchLabTab() {
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
              Corpus-level evidence audits and empirical attention dashboards, kept separate from the main text-analysis workflow.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <Newspaper className="w-3.5 h-3.5 text-slate-500" />
              PubMed snapshot
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              2023-01-01 to 2026-07-19
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-bold text-slate-650">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              Core 4 / Expanded journals
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-150 bg-slate-50/55 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-655" />
              <span>Humanitarian Attention Dashboard</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-3xl">
              PubMed journal coverage compared with a transparent suffering-denominator model.
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
    </div>
  );
}
