import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Clipboard,
  Check,
  HelpCircle,
  ShieldAlert,
  Archive,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  Layers2
} from 'lucide-react';
import { AnalysisReport, FlaggedPassage } from '../types';
import { standardsList } from '../standardsData';
import { getAnalysisModeLabel } from '../utils/modeLabels';

// ---- Consumer Mode Spider Chart ----
interface SpiderScores { antisemitism: number; antiZionist: number; rhetorical: number; worthy: number; }

function ConsumerSpiderChart({ scores }: { scores: SpiderScores }) {
  const cx = 140, cy = 138, r = 82;
  const a = scores.antisemitism / 100, az = scores.antiZionist / 100;
  const rd = scores.rhetorical / 100, wo = scores.worthy / 100;
  const top    = { x: cx,           y: cy - r * a  };
  const right  = { x: cx + r * az, y: cy           };
  const bottom = { x: cx,           y: cy + r * rd  };
  const left   = { x: cx - r * wo, y: cy           };
  const poly = `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`;
  const avg = (scores.antisemitism + scores.antiZionist + scores.rhetorical + scores.worthy) / 4;
  const fill = avg <= 15 ? '#22c55e' : avg <= 35 ? '#eab308' : avg <= 60 ? '#f97316' : '#ef4444';
  const grids = [25, 50, 75, 100];
  return (
    <svg viewBox="0 0 280 280" className="w-full max-w-[260px] mx-auto select-none">
      <polygon points={poly} fill={fill} fillOpacity="0.12" stroke="none" />
      {grids.map(g => { const d = r * g / 100; return (
        <polygon key={g} points={`${cx},${cy-d} ${cx+d},${cy} ${cx},${cy+d} ${cx-d},${cy}`}
          fill="none" stroke="#e2e8f0" strokeWidth={g === 100 ? 1.5 : 1} />
      ); })}
      {[25, 50, 75].map(g => (
        <text key={g} x={cx + 3} y={cy - r * g / 100 + 4} fontSize="7" fill="#94a3b8" fontFamily="Arial">{g}</text>
      ))}
      <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#ef4444" strokeWidth="1.5" />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#d97706" strokeWidth="1.5" strokeDasharray="5 3" />
      <line x1={cx} y1={cy} x2={cx} y2={cy + r} stroke="#3b82f6" strokeWidth="1.5" />
      <line x1={cx} y1={cy} x2={cx - r} y2={cy} stroke="#7c3aed" strokeWidth="1.5" />
      <polygon points={poly} fill="none" stroke={fill} strokeWidth="2.5" strokeOpacity="0.85" />
      <circle cx={top.x}    cy={top.y}    r="4.5" fill="#ef4444" />
      <circle cx={right.x}  cy={right.y}  r="4.5" fill="#d97706" />
      <circle cx={bottom.x} cy={bottom.y} r="4.5" fill="#3b82f6" />
      <circle cx={left.x}   cy={left.y}   r="4.5" fill="#7c3aed" />
      <circle cx={cx} cy={cy} r="3" fill="#cbd5e1" />
      <text x={cx} y={cy - r - 12} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#ef4444" fontFamily="Arial">Antisemitism</text>
      <text x={cx + r + 12} y={cy - 3} textAnchor="start" fontSize="8.5" fontWeight="bold" fill="#d97706" fontFamily="Arial">Anti-Zionist</text>
      <text x={cx + r + 12} y={cy + 10} textAnchor="start" fontSize="8.5" fontWeight="bold" fill="#d97706" fontFamily="Arial">Intensity ⊹</text>
      <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#3b82f6" fontFamily="Arial">Rhetorical</text>
      <text x={cx - r - 12} y={cy - 3} textAnchor="end" fontSize="8.5" fontWeight="bold" fill="#7c3aed" fontFamily="Arial">Response</text>
      <text x={cx - r - 12} y={cy + 10} textAnchor="end" fontSize="8.5" fontWeight="bold" fill="#7c3aed" fontFamily="Arial">Value</text>
    </svg>
  );
}

function getConsumerLabel(score: number): { label: string; color: string } {
  if (score <= 15) return { label: 'Minimal',  color: 'text-emerald-600' };
  if (score <= 35) return { label: 'Notable',   color: 'text-yellow-600' };
  if (score <= 60) return { label: 'Sustained', color: 'text-amber-600'  };
  if (score <= 80) return { label: 'Intense',   color: 'text-orange-600' };
  return                   { label: 'Extreme',  color: 'text-red-600'    };
}

interface ReportTabProps {
  activeReport: AnalysisReport | null;
  onNavigateToAnalyse: () => void;
  onSaveReport?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export default function ReportTab({ 
  activeReport, 
  onNavigateToAnalyse,
  onSaveReport,
  isSaving,
  isSaved
}: ReportTabProps) {
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const [activeComplaintTab, setActiveComplaintTab] = useState<'formal' | 'press' | 'public'>('formal');
  const [expandedPassageId, setExpandedPassageId] = useState<string>('');
  const [reviewedPassages, setReviewedPassages] = useState<Record<string, boolean>>({});

  if (!activeReport) {
    return (
      <div id="empty-report-cta" className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-2xl mx-auto my-8 space-y-4">
        <Layers2 className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-950">No Analysis Conducted Yet</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Please select a preset case study or enter a text in the <strong>Analyse Text</strong> tab to run the multi-layer diagnostic engine and compile a compliant report with regulatory response drafts.
        </p>
        <button
          id="navigate-to-analyse-btn"
          type="button"
          onClick={onNavigateToAnalyse}
          className="px-4 py-2 text-xs font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-all shadow-xs"
        >
          Go to Analyse Workspace
        </button>
      </div>
    );
  }

  const formatAnalysisTimestamp = (value?: string) => {
    if (!value) return 'Not recorded';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ── Consumer Mode View ───────────────────────────────────────────────────────
  if (activeReport.metadata.analysisMode === 'consumer' && activeReport.consumerScores) {
    const cs = activeReport.consumerScores;
    const spiderScores: SpiderScores = {
      antisemitism: cs.antisemitismScore,
      antiZionist: cs.antiZionistIntensityScore,
      rhetorical: cs.rhetoricalDistortionScore,
      worthy: cs.worthyOfResponseScore,
    };
    const dimensions = [
      { key: 'antisemitism', label: 'Antisemitism Content',     score: cs.antisemitismScore,        narrative: cs.antisemitismNarrative,    dot: 'bg-red-500',    text: 'text-red-700',    border: 'border-red-200',    bg: 'bg-red-50'    },
      { key: 'antizionist',  label: 'Anti-Zionist Intensity ⊹', score: cs.antiZionistIntensityScore, narrative: cs.antiZionistNarrative,     dot: 'bg-amber-500',  text: 'text-amber-700',  border: 'border-amber-200',  bg: 'bg-amber-50'  },
      { key: 'rhetorical',   label: 'Rhetorical Distortion',    score: cs.rhetoricalDistortionScore, narrative: cs.rhetoricalNarrative,      dot: 'bg-blue-500',   text: 'text-blue-700',   border: 'border-blue-200',   bg: 'bg-blue-50'   },
      { key: 'worthy',       label: 'Worthy of Response',       score: cs.worthyOfResponseScore,     narrative: cs.worthinessNarrative,      dot: 'bg-violet-500', text: 'text-violet-700', border: 'border-violet-200', bg: 'bg-violet-50' },
    ];
    return (
      <div className="space-y-6 font-sans">
        <div className="bg-violet-50 border border-violet-200 text-violet-800 text-xs py-3 px-4 rounded-lg flex items-start space-x-2">
          <Info className="w-4.5 h-4.5 text-violet-500 shrink-0 mt-0.5" />
          <span><strong>Community / General Review Mode:</strong> This analysis applies an extended lens to anti-Zionist content. The Anti-Zionist Intensity score (⊹) measures political positioning — not a formal violation. All scores are analytical indicators, not legal determinations.</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-violet-50 border border-violet-200 text-violet-700">Community / General Review Mode</span>
          <h2 className="text-xl font-bold text-gray-950 mt-1.5">{activeReport.metadata.title}</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">{activeReport.metadata.author} — {activeReport.metadata.platform} ({activeReport.metadata.date})</p>
          {activeReport.analysisTrace && (
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Analysis date: <strong className="text-slate-700">{formatAnalysisTimestamp(activeReport.analysisTrace.analyzedAt)}</strong>
              {" · "}
              Model: <strong className="text-slate-700">{activeReport.analysisTrace.model}</strong>
            </p>
          )}
          {onSaveReport && (
            <button type="button" onClick={onSaveReport} disabled={isSaving || isSaved}
              className={`mt-3 px-3 py-1.5 text-[11px] font-semibold rounded border font-mono flex items-center space-x-1.5 transition-all shadow-3xs cursor-pointer ${isSaved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
              <FileText className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span>{isSaving ? 'Saving...' : isSaved ? 'Saved to Workspace' : 'Save Report'}</span>
            </button>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 mb-4">TextLens General Score — Four-Dimension Overview</h3>
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <ConsumerSpiderChart scores={spiderScores} />
              <p className="text-[9px] text-slate-400 text-center mt-1 font-mono">⊹ Anti-Zionist Intensity measures political positioning, not violation</p>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1 w-full">
              {dimensions.map(d => {
                const { label: lvlLabel } = getConsumerLabel(d.score);
                return (
                  <div key={d.key} className={`p-3.5 rounded-lg border ${d.bg} ${d.border} space-y-2`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${d.dot} shrink-0`}></span>
                        <span className={`text-[10px] font-mono font-bold ${d.text}`}>{d.label}</span>
                      </div>
                      <span className={`text-2xl font-black tabular-nums leading-none ${d.text}`}>{d.score}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${d.dot}`} style={{ width: `${d.score}%` }} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${d.text}`}>{lvlLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-violet-50/60 to-slate-50 border border-violet-200 rounded-xl p-5 space-y-2">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-violet-700 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" /><span>Overall Assessment</span>
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">{cs.overallConsumerNarrative}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map(d => (
            <div key={d.key} className={`bg-white border ${d.border} rounded-lg p-4 space-y-1.5`}>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${d.dot}`}></span>
                <h4 className={`text-xs font-bold font-mono ${d.text}`}>{d.label}: {d.score}/100</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{d.narrative}</p>
            </div>
          ))}
        </div>
        {cs.doubleStandardAssessment && (
          <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 space-y-1.5">
            <h4 className="text-xs font-bold font-mono text-amber-800 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" /><span>Double-Standard Assessment</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{cs.doubleStandardAssessment}</p>
          </div>
        )}
        {activeReport.flaggedPassages.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500">Clear Standards Violations ({activeReport.flaggedPassages.length})</h3>
            {activeReport.flaggedPassages.map(p => (
              <div key={p.id} className={`bg-white border-l-4 rounded-lg p-4 border border-gray-200 space-y-2 ${p.layer === 1 ? 'border-l-red-500' : p.layer === 2 ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
                <p className="text-sm font-serif italic text-slate-800">"{p.textSnippet}"</p>
                <p className="text-xs text-slate-600 leading-relaxed">{p.explanation}</p>
                {p.standardsApplied[0]?.clauseId && p.standardsApplied[0].clauseId !== 'CONSUMER' && (
                  <span className="inline-block text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{p.standardsApplied[0].clauseId}</span>
                )}
              </div>
            ))}
          </div>
        )}
        {activeReport.humanReviewPrompts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-gray-950 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-gray-700" /><span>Community Review Questions</span>
            </h3>
            <div className="space-y-2">
              {activeReport.humanReviewPrompts.map(p => (
                <div key={p.id} className="bg-gray-50 border border-gray-200 p-3 rounded text-xs flex items-start space-x-3">
                  <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0">{p.id}.</span>
                  <span className="text-gray-800 leading-relaxed">{p.question}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-950 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-700" /><span>Draft response</span>
            </h3>
            {activeReport.suggestedComplaintOrResponse && (
              <button
                type="button"
                onClick={() => handleCopyToClipboard(activeReport.suggestedComplaintOrResponse || "", "consumer-draft")}
                className="px-3 py-1 text-xs font-semibold rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-mono flex items-center space-x-1.5 transition-all shadow-3xs cursor-pointer"
              >
                {copyState["consumer-draft"] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            )}
          </div>
          {activeReport.suggestedComplaintOrResponse ? (
            <div className="bg-slate-50 border border-gray-200 rounded p-4 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
              {activeReport.suggestedComplaintOrResponse}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No draft response was generated for this Community / General Review Mode report.</p>
          )}
        </div>
        {activeReport.limitations && activeReport.limitations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-950 flex items-center space-x-2">
              <Info className="w-4 h-4 text-indigo-500" /><span>Analysis Limitations</span>
            </h3>
            <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1 leading-relaxed">
              {activeReport.limitations.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  }
  // ── End Consumer Mode View ────────────────────────────────────────────────────

  const {
    metadata,
    summaryJudgement,
    flaggedPassages,
    evidentiaryIssues,
    humanReviewPrompts,
    suggestedComplaintLanguage
  } = activeReport;

  const handleCopyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopyState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const getSeverityBadgeClass = (severity: FlaggedPassage['severity']) => {
    switch (severity) {
      case 'Severe / Direct':
        return 'bg-red-50 text-red-700 border-red-250';
      case 'Moderate / Distorted':
        return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'Minor Bias':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getUncertaintyBadgeClass = (label: FlaggedPassage['uncertaintyLabel']) => {
    switch (label) {
      case 'Confident':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Probable':
        return 'bg-blue-550/10 text-indigo-700 border-indigo-150';
      case 'Borderline / Ambiguous':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const getLayerColor = (layer: number) => {
    switch (layer) {
      case 1: return 'border-l-red-500';
      case 2: return 'border-l-amber-500';
      case 3: return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const triggeredStandards = standardsList.filter(s =>
    flaggedPassages.some(f => f.standardsApplied.some(sa => sa.standardId === s.id))
  );

  return (
    <div id="textlens-audit-report-container" className="space-y-8 font-sans">
      
      {/* 0. CORE ANALYTICAL FLAGS DISCLAIMER & TAXONOMY STATUS NOTE */}
      <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs py-3.5 px-4 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 font-medium">
          <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
          <span><strong>Notice:</strong> TextLens findings are analytical flags for human review, not automated determinations.</span>
        </div>
        <p className="text-[11px] text-slate-500 pl-6 border-l border-slate-200 mt-1 leading-relaxed">
          <strong>Taxonomy Status Note:</strong> The TextLens taxonomy is a working analytical framework used underneath these analysis modes, not a legally authoritative or independently validated diagnostic instrument. Critics, editors, and reviewers must exercise independent ethical oversight.
        </p>
      </div>

      {/* 1. Header Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
              Audit Report Status: Compiled
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {activeReport.id}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-950 mt-1.5">{metadata.title}</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            Source: <strong className="text-gray-700">{metadata.author}</strong> on <strong className="text-gray-700">{metadata.platform}</strong> ({metadata.date})
          </p>
          {onSaveReport && (
            <div className="mt-3.5">
              <button
                id="save-report-firestore-btn"
                type="button"
                onClick={onSaveReport}
                disabled={isSaving || isSaved}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded border font-mono flex items-center space-x-1.5 transition-all select-none shadow-3xs cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white border-slate-205 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${isSaved ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{isSaving ? 'Filing Analysis...' : isSaved ? 'Saved to Workspace History' : 'Save Report to Workspace'}</span>
              </button>
            </div>
          )}
        </div>
        <div className="text-xs font-mono space-y-1 bg-gray-50 border border-gray-200 p-3 rounded shrink-0">
          <div><span className="text-gray-400">Analysis Mode:</span> <strong className="text-gray-750 font-semibold">{getAnalysisModeLabel(metadata.analysisMode)}</strong></div>
          {activeReport.analysisTrace && (
            <>
              <div><span className="text-gray-400">Analysis Date:</span> <strong className="text-gray-750 font-semibold">{formatAnalysisTimestamp(activeReport.analysisTrace.analyzedAt)}</strong></div>
              <div><span className="text-gray-400">Model:</span> <strong className="text-gray-750 font-semibold">{activeReport.analysisTrace.model}</strong></div>
            </>
          )}
        </div>
      </div>

      {/* 1.5 Concise Meta Status Boxes if available */}
      {(activeReport.overallConcernLevel || activeReport.confidence) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeReport.overallConcernLevel && (() => {
            const level = activeReport.overallConcernLevel.toLowerCase();
            const isHigh = level === 'severe' || level === 'high';
            const isMod = level === 'moderate';
            return (
              <div className={`p-4 rounded-lg border shadow-3xs transition-all ${
                isHigh ? 'bg-red-50/25 border-red-200' :
                isMod ? 'bg-amber-50/25 border-amber-205' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">Overall Concern Level</span>
                <span className={`text-sm font-bold uppercase ${
                  isHigh ? 'text-red-700' :
                  isMod ? 'text-amber-700' : 'text-slate-600'
                }`}>
                  ● {activeReport.overallConcernLevel}
                </span>
              </div>
            );
          })()}
          
          {activeReport.confidence && (() => {
            const conf = activeReport.confidence.toLowerCase();
            const isHigh = conf === 'high';
            const isMod = conf === 'moderate';
            return (
              <div className={`p-4 rounded-lg border shadow-3xs transition-all ${
                isHigh ? 'bg-emerald-50/20 border-emerald-200' :
                isMod ? 'bg-blue-50/20 border-blue-200' : 'bg-slate-50/50 border-slate-200'
              }`}>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">AI Audit Confidence</span>
                <span className={`text-sm font-bold uppercase ${
                  isHigh ? 'text-emerald-700' :
                  isMod ? 'text-blue-700' : 'text-slate-600'
                }`}>
                  {activeReport.confidence}
                </span>
              </div>
            );
          })()}

          {activeReport.taxonomyItemsConsidered && (
            <div className="bg-slate-50/30 border border-slate-200 p-4 rounded-lg shadow-3xs sm:col-span-1 lg:col-span-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">Taxonomy Checked For Mode</span>
              <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto pr-1">
                {activeReport.taxonomyItemsConsidered.map((tid, idx) => (
                  <span key={idx} className="bg-white text-[10px] font-mono font-semibold text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 shadow-3xs">
                    {tid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Summary Judgement */}
      <div id="report-summary-judgement" className="relative overflow-hidden bg-gradient-to-r from-indigo-50/50 via-indigo-50/25 to-slate-50/10 text-slate-800 rounded-xl p-6 border border-indigo-150/70 shadow-3xs hover:shadow-2xs transition-all duration-300 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-indigo-650 space-y-4 pl-8">
        <div className="flex items-start space-x-3.5">
          <ShieldAlert className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-mono font-bold text-indigo-850 tracking-widest">Executive Summary Judgement</h3>
            <p className="text-sm font-sans leading-relaxed text-slate-700 font-medium">
              {summaryJudgement}
            </p>
          </div>
        </div>
        <div className="border-t border-indigo-150/55 pt-3.5 flex flex-wrap items-center gap-2 text-[10px] font-mono text-indigo-800">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Standards Implicated:</span>
          {triggeredStandards.map(s => (
            <span key={s.id} className="bg-white text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-150/60 font-bold uppercase shadow-3xs">
              {s.shortName}
            </span>
          ))}
        </div>
      </div>

      {/* 2.5 Active Guardrail Findings Section */}
      {activeReport.guardrailFindings && activeReport.guardrailFindings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Guardrail Boundary Reviews</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeReport.guardrailFindings.map((finding, idx) => {
              const isProtected = finding.reviewStatus === 'blocked';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg space-y-3 border ${
                    isProtected
                      ? 'bg-emerald-50/35 border-emerald-150/80'
                      : 'bg-amber-50/30 border-amber-150/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      {isProtected ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-slate-950 truncate">
                        {finding.reviewLabel || (isProtected ? 'Protected-Speech Guardrail Applied' : 'Boundary Tested: Review Continued')}
                      </h4>
                    </div>
                    <span
                      className={`shrink-0 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        isProtected
                          ? 'text-emerald-700 bg-white border-emerald-200'
                          : 'text-amber-800 bg-white border-amber-200'
                      }`}
                    >
                      {isProtected ? 'Protected' : 'Not Exempted'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono">
                    <strong>Guardrail tested:</strong> {finding.protectedCategory}
                  </div>

                  {finding.quoteExcerpt && (
                    <div className="bg-white/80 border border-slate-200 rounded p-3">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Passage Reviewed
                      </span>
                      <p className="text-[11px] text-slate-800 leading-relaxed italic">
                        "{finding.quoteExcerpt}"
                      </p>
                    </div>
                  )}

                  <div className="text-[11px] text-gray-700 leading-relaxed font-sans">
                    <strong>Why this guardrail was considered:</strong> {finding.whyRelevant}
                  </div>
                  <div className="text-[10px] text-slate-600 font-sans pt-2 border-t border-slate-200/70">
                    <strong>Outcome:</strong> {finding.effectOnInterpretation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CENTER OF THE REPORT: Overhauled Master Evidence Table */}
      <div id="report-master-evidence" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-500 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Core Evidence Table</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Flagged passages, linked standards, and explanation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono text-gray-500">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> <span>L1 Direct</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> <span>L2 Contemporary</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <span>L3 Rhetorical</span></span>
          </div>
        </div>

        <div className="space-y-4">
          {flaggedPassages.map((passage) => {
            const isReviewed = !!reviewedPassages[passage.id];

            let rowBgClass = 'transition-all duration-150 text-gray-800 border-l-4 ';
            if (passage.layer === 1) {
              rowBgClass += 'bg-red-50/20 hover:bg-red-50/30 border-l-red-500/80';
            } else if (passage.layer === 2) {
              rowBgClass += 'bg-amber-50/15 hover:bg-amber-50/25 border-l-amber-500/75';
            } else {
              rowBgClass += 'bg-indigo-50/15 hover:bg-indigo-50/25 border-l-indigo-400/70';
            }

            return (
              <div
                key={passage.id}
                className={`${rowBgClass} border border-gray-200 rounded-lg shadow-xs overflow-hidden`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-3 p-4 border-b lg:border-b-0 lg:border-r border-gray-150/80">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 block mb-2">
                      Quoted Passage
                    </span>
                    <p className="font-serif italic text-gray-905 leading-relaxed text-[13px]">
                      "{passage.textSnippet}"
                    </p>
                  </div>

                  <div className="lg:col-span-6 p-4 border-b lg:border-b-0 lg:border-r border-gray-150/80">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 block mb-2">
                      Explanation
                    </span>
                    <div className="text-gray-655 leading-relaxed font-sans text-xs whitespace-pre-line">
                      {passage.explanation}
                    </div>
                  </div>

                  <div className="lg:col-span-3 p-4 bg-white/65">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gray-400 block mb-2">
                      Review Details
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded border border-gray-150 bg-white p-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Issue
                        </span>
                        <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border leading-tight ${getSeverityBadgeClass(passage.severity)}`}>
                          {passage.severity}
                        </span>
                      </div>

                      <div className="rounded border border-gray-150 bg-white p-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Confidence
                        </span>
                        <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border leading-tight ${getUncertaintyBadgeClass(passage.uncertaintyLabel)}`}>
                          {passage.uncertaintyLabel}
                        </span>
                      </div>

                      <div className="rounded border border-gray-150 bg-white p-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          TextLens Layer
                        </span>
                        <span className={`inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded ${
                          passage.layer === 1 ? 'text-red-700 bg-red-50 border border-red-100' :
                          passage.layer === 2 ? 'text-amber-700 bg-amber-50 border border-amber-100' :
                          'text-indigo-700 bg-indigo-50 border border-indigo-105'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            passage.layer === 1 ? 'bg-red-500' :
                            passage.layer === 2 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}></span>
                          <span>Layer {passage.layer}</span>
                        </span>
                      </div>

                      <div className="rounded border border-gray-150 bg-white p-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Human Review
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="checkbox"
                            checked={isReviewed}
                            onChange={() => setReviewedPassages(prev => ({ ...prev, [passage.id]: !prev[passage.id] }))}
                            className="h-3.5 w-3.5 text-slate-950 focus:ring-slate-900 border-gray-200 rounded cursor-pointer accent-slate-950"
                          />
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider text-right ${
                            isReviewed ? 'text-emerald-600' : 'text-amber-600 animate-pulse'
                          }`}>
                            {isReviewed ? 'Audited ✓' : 'Review ⚠'}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2 rounded border border-gray-150 bg-white p-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 block mb-1">
                          Relevant Standard
                        </span>
                        <div className="flex flex-col gap-1">
                          {passage.standardsApplied.map((sa, idx) => (
                            <div key={idx} className="bg-gray-50 border border-gray-150 rounded p-1 text-[10px]">
                              <span className="font-bold text-indigo-650 block text-[9.5px]">{sa.clauseId}</span>
                              <span className="text-gray-500 block text-[9px] font-sans leading-tight" title={sa.clauseTitle}>
                                {sa.clauseTitle}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Secondary Evidentiary Metaphors (Unreliable Patterns matching layer 3) */}
      {evidentiaryIssues.length > 0 && (
        <div id="report-evidence-table" className="space-y-3">
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-gray-500 flex items-center space-x-2">
            <Archive className="w-4 h-4 text-gray-400" />
            <span>Evidentiary & Methodological Rhetorical Auditing (Supplemental)</span>
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-mono text-gray-400 uppercase tracking-wider bg-gray-50/50">
                    <th className="py-3 px-4 w-1/4">Claim Snippet</th>
                    <th className="py-3 px-4 w-1/4">Linguistic Distortion Pattern</th>
                    <th className="py-3 px-4 w-1/4">Evidentiary Critical Analysis</th>
                    <th className="py-3 px-4">Suggested Editorial Remedy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-xs text-gray-800">
                  {evidentiaryIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50/10 text-gray-850">
                      <td className="py-3.5 px-4 font-sans italic text-gray-900 font-medium">
                        "{issue.claimSnippet}"
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {issue.unreliablePattern}
                      </td>
                      <td className="py-3.5 px-4 text-gray-655 leading-relaxed font-sans">
                        {issue.reasoning}
                      </td>
                      <td className="py-3.5 px-4 text-gray-655 font-sans border-l border-gray-105">
                        <span className="block font-semibold text-gray-900 mb-1">Remedy Action:</span>
                        {issue.suggestedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Human Review Prompts */}
      <div id="report-human-prompts" className="space-y-3 bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-semibold text-gray-950 flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-gray-700" />
          <span>Human Review Prompts</span>
        </h3>
        <p className="text-xs text-gray-650 leading-relaxed">
          Use these prompts to review the report and check any areas that need closer inspection and judgment.
        </p>
        <div className="space-y-2 pt-2">
          {humanReviewPrompts.map((prompt) => (
            <div key={prompt.id} className="bg-gray-50 border border-gray-200 p-3 rounded flex items-start space-x-3 text-xs">
              <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 mt-0.5 uppercase">Prompt {prompt.id}:</span>
              <div>
                <strong className="block text-gray-900 leading-normal">{prompt.question}</strong>
                <span className="block text-gray-500 text-[11px] mt-1 font-sans">{prompt.contextNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5.5 Limitations section for live model output */}
      {activeReport.limitations && activeReport.limitations.length > 0 && (
        <div id="report-limitations" className="space-y-3 bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-950 flex items-center space-x-2">
            <Info className="w-5 h-5 text-indigo-650" />
            <span>AI Model Audit Constraints & Limitations</span>
          </h3>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5 leading-relaxed">
            {activeReport.limitations.map((lim, idx) => (
              <li key={idx} className="font-sans">{lim}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Legal / Public Complaint language constructor */}
      <div id="report-complaint-section" className="bg-white border border-gray-250 p-6 rounded-lg shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-950">Suggested Complaint & Response Drafts</h3>
          <p className="text-xs text-gray-500 mt-1">
            Standard complaint templates or editorial correction responses derived from the active analysis code violations.
          </p>
        </div>

        {activeReport.suggestedComplaintOrResponse ? (
          /* Directly render the rich AI-generated response plain draft */
          <div className="relative">
            <div className="absolute right-3 top-3 z-10">
              <button
                id="copy-complaint-draft-btn-direct"
                type="button"
                onClick={() => handleCopyToClipboard(activeReport.suggestedComplaintOrResponse || "", "direct-response")}
                className="p-1 px-3 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 rounded text-[11px] font-mono flex items-center space-x-1.5 transition-all shadow-2xs hover:bg-gray-50"
              >
                {copyState["direct-response"] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-gray-500" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={activeReport.suggestedComplaintOrResponse}
              className="w-full h-96 bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-850 font-mono focus:outline-hidden leading-relaxed select-text"
            />
          </div>
        ) : (
          /* Fallback tabbed interfaces for pre-coded local static reviews */
          <>
            {/* Tab Controls for Complaint Text */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveComplaintTab('formal')}
                className={`py-2 px-4 text-xs font-mono font-bold border-b-2 -mb-px transition-all cursor-pointer ${
                  activeComplaintTab === 'formal'
                    ? 'border-slate-900 text-slate-950 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Formal Letter (COPE/OMBUD)
              </button>
              <button
                type="button"
                onClick={() => setActiveComplaintTab('press')}
                className={`py-2 px-4 text-xs font-mono font-bold border-b-2 -mb-px transition-all cursor-pointer ${
                  activeComplaintTab === 'press'
                    ? 'border-slate-900 text-slate-950 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Press Statement Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveComplaintTab('public')}
                className={`py-2 px-4 text-xs font-mono font-bold border-b-2 -mb-px transition-all cursor-pointer ${
                  activeComplaintTab === 'public'
                    ? 'border-slate-900 text-slate-950 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Public Correction Request
              </button>
            </div>

            {/* Tab Content Box */}
            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  id="copy-complaint-draft-btn"
                  type="button"
                  onClick={() => {
                    const targetText =
                      activeComplaintTab === 'formal' ? suggestedComplaintLanguage.formalLetter :
                      activeComplaintTab === 'press' ? suggestedComplaintLanguage.pressReleaseSummary :
                      suggestedComplaintLanguage.publicCorrectionRequest;
                    handleCopyToClipboard(targetText, activeComplaintTab);
                  }}
                  className="p-1 px-3 bg-white text-gray-700 hover:text-indigo-600 border border-gray-200 rounded text-[11px] font-mono flex items-center space-x-1.5 transition-all shadow-2xs hover:bg-gray-50px"
                >
                  {copyState[activeComplaintTab] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy Clean Draft</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                readOnly
                value={
                  activeComplaintTab === 'formal' ? suggestedComplaintLanguage.formalLetter :
                  activeComplaintTab === 'press' ? suggestedComplaintLanguage.pressReleaseSummary :
                  suggestedComplaintLanguage.publicCorrectionRequest
                }
                className="w-full h-80 bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-800 font-mono focus:outline-hidden leading-relaxed select-text"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
