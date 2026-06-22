import React, { useState, useEffect } from 'react';
import {
  FileText,
  Tag,
  Scale,
  Clipboard,
  Layers,
  FolderUp,
  Fingerprint,
  Cpu,
  Lock,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  Download,
  ChevronDown,
  Eye
} from 'lucide-react';

import { downloadUserGuide } from './utils/userGuide';

import { TextLensMetadata, AnalysisReport } from './types';
import { mockReports } from './mockReportsData';
import { standardsList } from './standardsData';
import { textLensTaxonomy } from './taxonomyData';

import AnalyseTab from './components/AnalyseTab';
import MetadataTab from './components/MetadataTab';
import StandardsTab from './components/StandardsTab';
import ReportTab from './components/ReportTab';
import MethodsTab from './components/MethodsTab';
import ExportTab from './components/ExportTab';

import { saveUserReport, listUserReports } from './lib/reportsService';

type TabId = 'analyse' | 'metadata' | 'standards' | 'report' | 'methods' | 'export';

// Stabilize mock user representation outside the component to prevent referential-trigger re-renders
const DEFAULT_USER = { uid: 'workspace-auditor-local' };

export default function App() {
  const user = DEFAULT_USER;
  const [savedReports, setSavedReports] = useState<AnalysisReport[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Passcode gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('textlens_unlocked') === 'true';
  });
  const [passcodeVal, setPasscodeVal] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeVal.trim()) {
      setAuthError('Please enter a passcode.');
      return;
    }
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const response = await fetch('/api/auth/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeVal })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsUnlocked(true);
          sessionStorage.setItem('textlens_unlocked', 'true');
        } else {
          setAuthError('Incorrect passcode.');
        }
      } else {
        const errData = await response.json().catch(() => ({ error: 'Access Denied: Incorrect workspace passcode.' }));
        setAuthError(errData.error || 'Access Denied: Incorrect passcode.');
      }
    } catch (err) {
      console.warn("Server auth failed, trying client fallback...", err);
      // Fallback for offline or local preview where API might be unreachable initially
      // @ts-ignore
      const expected = (import.meta.env.VITE_WORKSPACE_PASSCODE || "").trim().toLowerCase();
      if (expected && passcodeVal.trim().toLowerCase() === expected) {
        setIsUnlocked(true);
        sessionStorage.setItem('textlens_unlocked', 'true');
      } else {
        setAuthError('Access Denied: Incorrect passcode.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [activeTab, setActiveTab] = useState<TabId>('analyse');
  const [showGuideDropdown, setShowGuideDropdown] = useState<boolean>(false);

  const [originalText, setOriginalText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);

  // Sync saved reports when user changes - using stable primitive dependency
  useEffect(() => {
    if (user?.uid) {
      loadSavedReports();
    } else {
      setSavedReports([]);
    }
  }, [user?.uid]);

  // Reset saved status when report changes
  useEffect(() => {
    setIsSaved(false);
  }, [activeReport]);

  const loadSavedReports = async () => {
    if (!user) return;
    try {
      const reports = await listUserReports(user.uid);
      setSavedReports(reports);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const handleSaveReport = async () => {
    if (!user || !activeReport) return;
    setIsSaving(true);
    try {
      const idStr = activeReport.id.startsWith('ai-') ? activeReport.id : `ai-${Date.now()}`;
      const titleName = activeReport.metadata.title || `Audit Report ${new Date().toLocaleDateString()}`;
      await saveUserReport(user.uid, idStr, titleName, originalText, {
        ...activeReport,
        id: idStr,
        name: titleName
      });
      setIsSaved(true);
      await loadSavedReports();
    } catch (err) {
      console.error("Failed to save report:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize unified metadata state with neutral defaults
  const [metadata, setMetadata] = useState<TextLensMetadata>({
    title: '',
    author: '',
    platform: '',
    date: new Date().toISOString().split('T')[0],
    url: '',
    textType: '',
    jurisdiction: 'Generic / Global',
    analysisMode: 'consumer',
    communicationType: 'unspecified',
    rhetoricalFunction: 'unspecified'
  });

  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Helper to map and enrich structured API response into AnalysisReport shape
  const mapAiResponseToReport = (
    data: any,
    origText: string,
    meta: TextLensMetadata
  ): AnalysisReport => {
    const mapConfidence = (conf: string): 'Confident' | 'Probable' | 'Borderline / Ambiguous' | 'System Low Confidence' => {
      const c = conf?.toLowerCase() || '';
      if (c === 'high' || c.includes('confident')) return 'Confident';
      if (c === 'moderate' || c.includes('probable') || c.includes('likely')) return 'Probable';
      if (c === 'low' || c.includes('borderline') || c.includes('ambiguous') || c.includes('uncertain')) return 'Borderline / Ambiguous';
      return 'System Low Confidence';
    };

    const mapSeverity = (sev: string): 'Informational' | 'Minor Bias' | 'Moderate / Distorted' | 'Severe / Direct' => {
      const s = sev?.toLowerCase() || '';
      if (s === 'severe' || s.includes('severe') || s.includes('direct')) return 'Severe / Direct';
      if (s === 'high' || s === 'moderate' || s.includes('moderate') || s.includes('distorted')) return 'Moderate / Distorted';
      if (s === 'low' || s.includes('minor') || s.includes('bias')) return 'Minor Bias';
      return 'Informational';
    };

    const mappedFlaggedPassages = (data.flaggedPassages || []).map((p: any, index: number) => {
      // Find the matching taxonomy item to determine layer and detailed standard
      const taxItem = textLensTaxonomy.find(t => t.id === p.taxonomyItemId);
      let calculatedLayer: 1 | 2 | 3 = 3;
      if (taxItem) {
        if (taxItem.section.toLowerCase().includes("layer 1") || taxItem.id.startsWith("L1")) calculatedLayer = 1;
        else if (taxItem.section.toLowerCase().includes("layer 2") || taxItem.id.startsWith("L2")) calculatedLayer = 2;
      } else if (p.taxonomySection) {
        if (p.taxonomySection.toLowerCase().includes("layer 1") || p.taxonomyItemId?.startsWith("L1")) calculatedLayer = 1;
        else if (p.taxonomySection.toLowerCase().includes("layer 2") || p.taxonomyItemId?.startsWith("L2")) calculatedLayer = 2;
      }

      const standardsAppliedList = [];
      if (taxItem && taxItem.referenceKeys && taxItem.referenceKeys.length > 0) {
        const matchedStdKey = taxItem.referenceKeys[0];
        const matchedStd = standardsList.find(s => s.id === matchedStdKey);
        standardsAppliedList.push({
          standardId: matchedStdKey,
          clauseId: p.relevantStandardOrSource || taxItem.likelyStandards?.[0] || matchedStdKey.toUpperCase(),
          standardName: matchedStd?.name || "Standard Source",
          clauseTitle: taxItem.categoryTitle
        });
      } else {
        standardsAppliedList.push({
          standardId: "general",
          clauseId: p.relevantStandardOrSource || "GENERAL",
          standardName: p.relevantStandardOrSource || "General Standard",
          clauseTitle: p.taxonomyCategoryTitle || "Standard Clause Violation"
        });
      }

      const humanReviewNote = p.humanReviewNeeded ? "Yes, active ambiguity detected. Human review required." : "Standard review recommended.";

      return {
        id: p.id || `ai-f-${index}`,
        textSnippet: p.exactQuote || p.textSnippet || "",
        layer: calculatedLayer,
        standardsApplied: standardsAppliedList,
        explanation: `${p.explanation || ""}\n\n**Taxonomy Category**: ${p.taxonomyCategoryTitle || "Uncategorized"} (${p.taxonomyItemId || "N/A"})\n**Benign/Alternative Interpretation**: ${p.alternativeBenignInterpretation || "None provided"}\n**Why Human Review Is Needed**: ${humanReviewNote}`,
        uncertaintyLabel: mapConfidence(p.confidence || 'Confident'),
        severity: mapSeverity(p.severity || 'Moderate / Distorted')
      };
    });

    const mappedPrompts = (data.humanReviewPrompts || []).map((q: string, index: number) => ({
      id: `${index + 1}`,
      question: q || "",
      contextNote: "Investigatory probe recommended during evaluation hearings."
    }));

    // Consumer mode: map the four-score structure into AnalysisReport
    if (data._mode === "consumer") {
      return {
        id: `ai-${Date.now()}`,
        name: meta.title || 'General Report',
        metadata: { ...meta },
        originalText: origText,
        summaryJudgement: data.overallConsumerNarrative || "No summary provided.",
        flaggedPassages: (data.flaggedPassages || []).map((p: any, i: number) => ({
          id: `c-f-${i}`,
          textSnippet: p.exactQuote || "",
          layer: (p.taxonomyItemId?.startsWith("L1") ? 1 : p.taxonomyItemId?.startsWith("L2") ? 2 : 3) as 1 | 2 | 3,
          standardsApplied: [{
            standardId: "consumer",
            clauseId: p.standardCited || "CONSUMER",
            standardName: p.standardCited || "General Assessment",
            clauseTitle: p.plainLanguageIssue || "",
          }],
          explanation: p.plainLanguageIssue || "",
          uncertaintyLabel: "Confident" as const,
          severity: p.severity === "severe" ? "Severe / Direct" as const : "Moderate / Distorted" as const,
        })),
        evidentiaryIssues: [],
        standardsMentioned: [],
        humanReviewPrompts: (data.humanReviewPrompts || []).map((q: string, i: number) => ({
          id: `${i + 1}`,
          question: q,
          contextNote: "Community review prompt.",
        })),
        suggestedComplaintLanguage: {
          formalLetter: data.suggestedComplaintOrResponse || "",
          pressReleaseSummary: "Please reference the Suggested Complaint Or Response Draft text.",
          publicCorrectionRequest: "Please reference the Suggested Complaint Or Response Draft text."
        },
        suggestedComplaintOrResponse: data.suggestedComplaintOrResponse || "",
        analysisTrace: data.analysisTrace,
        limitations: data.limitations || [],
        consumerScores: {
          antisemitismScore: data.antisemitismScore || 0,
          antisemitismNarrative: data.antisemitismNarrative || "",
          antiZionistIntensityScore: data.antiZionistIntensityScore || 0,
          antiZionistNarrative: data.antiZionistNarrative || "",
          rhetoricalDistortionScore: data.rhetoricalDistortionScore || 0,
          rhetoricalNarrative: data.rhetoricalNarrative || "",
          worthyOfResponseScore: data.worthyOfResponseScore || 0,
          worthinessNarrative: data.worthinessNarrative || "",
          doubleStandardAssessment: data.doubleStandardAssessment || "",
          overallConsumerNarrative: data.overallConsumerNarrative || "",
        },
      };
    }

    const formalText = data.suggestedComplaintOrResponse || "";

    return {
      id: data.id || `ai-${Date.now()}`,
      name: meta.title || 'AI Audit Report',
      metadata: { ...meta },
      originalText: origText,
      summaryJudgement: data.summaryJudgement || "No summary provided.",
      flaggedPassages: mappedFlaggedPassages,
      evidentiaryIssues: [],
      standardsMentioned: data.standardsApplied || [],
      humanReviewPrompts: mappedPrompts,
      suggestedComplaintLanguage: {
        formalLetter: formalText,
        pressReleaseSummary: "Please reference the Suggested Complaint Or Response Draft text.",
        publicCorrectionRequest: "Please reference the Suggested Complaint Or Response Draft text."
      },
      
      // Pass through the structured model fields
      overallConcernLevel: data.overallConcernLevel,
      confidence: data.confidence,
      analysisMode: data.analysisMode,
      communicationType: data.communicationType,
      rhetoricalFunction: data.rhetoricalFunction,
      shortSummary: data.shortSummary,
      taxonomyItemsConsidered: data.taxonomyItemsConsidered,
      protectedNonTriggersConsidered: data.protectedNonTriggersConsidered,
      guardrailFindings: data.guardrailFindings,
      limitations: data.limitations,
      suggestedComplaintOrResponse: formalText,
      analysisTrace: data.analysisTrace
    };
  };

  // Action: Trigger Real API or Simulated preset Audit sequence
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setActiveTab('analyse'); // Stay here to view loading log / status

    // If the text perfectly matches one of our local expert pre-coded preset reports,
    // load it directly to guarantee perfect instant analysis for the expert samples!
    const matchingPreset = mockReports.find(
      r => r.originalText.trim().substring(0, 40) === originalText.trim().substring(0, 40)
    );

    if (matchingPreset) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveReport({
          ...matchingPreset,
          analysisTrace: matchingPreset.analysisTrace || {
            analyzedAt: new Date().toISOString(),
            model: 'preset-case-study'
          },
          metadata: { ...metadata } // Preserve metadata overrides
        });
        setActiveTab('report');
      }, 1000);
      return;
    }

    // Otherwise, perform the live multi-layer legal + media AI audit!
    try {
      console.log("Initiating live TextLens AI analysis...");
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          metadata,
          selectedStandards: standardsList,
          taxonomy: textLensTaxonomy
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${response.status}`);
      }

      const reportData = await response.json();
      const enrichedReport = mapAiResponseToReport(reportData, originalText, metadata);
      setActiveReport(enrichedReport);
      
      // Advance user to report tab to review results
      setActiveTab('report');
    } catch (err: any) {
      console.error("AI Analysis failed:", err);
      if (err.message && (err.message.includes('API key') || err.message.includes('OPENAI_API_KEY'))) {
        setAnalysisError("OPENAI_API_KEY is not configured. Add it to .env.local before running TextLens.");
      } else {
        setAnalysisError(err.message || "An unexpected error occurred during analysis. Please check your network and try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyse':
        return (
          <AnalyseTab
            originalText={originalText}
            setOriginalText={setOriginalText}
            metadata={metadata}
            setMetadata={setMetadata}
            activeReport={activeReport}
            setActiveReport={setActiveReport}
            onAnalysisStart={handleStartAnalysis}
            isAnalyzing={isAnalyzing}
            onNavigateToMetadata={() => setActiveTab('metadata')}
            analysisError={analysisError}
            clearAnalysisError={() => setAnalysisError(null)}
            savedReports={savedReports}
          />
        );
      case 'metadata':
        return (
          <MetadataTab
            metadata={metadata}
            setMetadata={setMetadata}
          />
        );
      case 'standards':
        return <StandardsTab />;
      case 'report':
        return (
          <ReportTab
            activeReport={activeReport}
            onNavigateToAnalyse={() => setActiveTab('analyse')}
            onSaveReport={handleSaveReport}
            isSaving={isSaving}
            isSaved={isSaved}
          />
        );
      case 'methods':
        return <MethodsTab />;
      case 'export':
        return (
          <ExportTab
            activeReport={activeReport}
            onNavigateToAnalyse={() => setActiveTab('analyse')}
          />
        );
      default:
        return null;
    }
  };

  const getTabClass = (tab: TabId) => {
    const base = 'px-4 py-3 text-xs font-mono font-semibold transition-all border-b-2 flex items-center space-x-1.5 focus:outline-hidden cursor-pointer';
    if (activeTab === tab) {
      return `${base} border-indigo-650 text-indigo-950 bg-indigo-50/25 font-bold`;
    }
    return `${base} border-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-200/50`;
  };

  if (!isUnlocked) {
    return (
      <div id="textlens-lock-screen" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-950">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_-10px_rgba(79,70,229,0.08),0_1px_3px_rgba(0,0,0,0.01)] p-8 space-y-6 transition-all duration-300">
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Logo Graphic in Lock screen */}
            <div className="relative p-4 bg-indigo-50/50 rounded-full border border-indigo-100/60 shadow-3xs">
              <Lock className="w-8 h-8 text-indigo-600 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950 font-display">TextLens Workspace Locked</h1>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="workspace-passcode" className="text-[11px] font-bold font-mono text-indigo-850 uppercase tracking-wider block">
                Workspace Passcode
              </label>
              <div className="relative rounded-lg shadow-3xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Fingerprint className="h-4.5 w-4.5 text-indigo-400" />
                </div>
                <input
                  id="workspace-passcode"
                  type="password"
                  value={passcodeVal}
                  onChange={(e) => {
                    setPasscodeVal(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-3 text-slate-800 placeholder-slate-350 text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/40 transition-all font-mono"
                  disabled={isAuthenticating}
                  autoFocus
                />
              </div>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-150 rounded-lg p-3 flex items-start space-x-2.5 shadow-3xs">
                <AlertCircle className="w-4 h-4 text-rose-650 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-800 font-medium leading-normal">
                  {authError}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold font-mono text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-700 shadow-sm active:scale-[0.985] transition-all duration-150 flex items-center justify-center space-x-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:pointer-events-none cursor-pointer"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating Node...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Decrypt Workspace</span>
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Secure Shell API v1</span>
            </span>
            <span>Ref: {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="textlens-app-scaffold" className="min-h-screen bg-[#fafafa] flex flex-col text-slate-900 leading-normal selection:bg-indigo-100 selection:text-indigo-950">
      
      {/* 1. Header Navigation System */}
      <header className="border-b border-slate-200/60 bg-white sticky top-0 z-30 shadow-3xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Title Block */}
            <div className="flex items-center space-x-3">
              {/* TextLens Logo Vector Graphic */}
              <svg viewBox="0 0 100 100" className="w-9 h-9 shrink-0 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-fade-left" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#adbdd6" stopOpacity="0" />
                    <stop offset="100%" stopColor="#4b6285" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="logo-fade-right" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4b6285" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#adbdd6" stopOpacity="0" />
                  </linearGradient>
                  <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Left Scanning Trails */}
                <g filter="url(#logo-glow)">
                  <line x1="4" y1="36" x2="16" y2="36" stroke="url(#logo-fade-left)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="2" y1="43" x2="16" y2="43" stroke="url(#logo-fade-left)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="0" y1="50" x2="16" y2="50" stroke="url(#logo-fade-left)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="2" y1="57" x2="16" y2="57" stroke="url(#logo-fade-left)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="4" y1="64" x2="16" y2="64" stroke="url(#logo-fade-left)" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Right Scanning Trails */}
                <g filter="url(#logo-glow)">
                  <line x1="84" y1="36" x2="96" y2="36" stroke="url(#logo-fade-right)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="84" y1="43" x2="98" y2="43" stroke="url(#logo-fade-right)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="84" y1="50" x2="100" y2="50" stroke="url(#logo-fade-right)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="84" y1="57" x2="98" y2="57" stroke="url(#logo-fade-right)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="84" y1="64" x2="96" y2="64" stroke="url(#logo-fade-right)" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* Main Lens Circle */}
                <circle cx="50" cy="50" r="30" stroke="#3b4d6b" strokeWidth="6.5" fill="white" />

                {/* Inside Text Lines inside the Lens */}
                <g>
                  <line x1="38" y1="36" x2="62" y2="36" stroke="#2b3a51" strokeWidth="4" strokeLinecap="round" />
                  <line x1="32" y1="43" x2="68" y2="43" stroke="#2b3a51" strokeWidth="4" strokeLinecap="round" />
                  <line x1="30" y1="50" x2="70" y2="50" stroke="#2b3a51" strokeWidth="4" strokeLinecap="round" />
                  <line x1="32" y1="57" x2="68" y2="57" stroke="#2b3a51" strokeWidth="4" strokeLinecap="round" />
                  <line x1="38" y1="64" x2="62" y2="64" stroke="#2b3a51" strokeWidth="4" strokeLinecap="round" />
                </g>
              </svg>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm font-bold tracking-tight text-slate-950 font-display">TextLens</h1>
                  <span className="text-[9px] bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 text-slate-500 font-mono font-medium">
                    v3-beta
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block font-sans">
                  Standards-based text and media analysis
                </span>
              </div>
            </div>

            {/* Active Workspace Status Badge & User Guide Download */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  id="btn-download-user-guide-header"
                  type="button"
                  onClick={() => setShowGuideDropdown(!showGuideDropdown)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-205 border border-slate-200/80 rounded text-[11px] font-mono font-bold text-slate-700 transition-all cursor-pointer active:scale-[0.97]"
                  title="View or download printable HTML User Guide & Reference Manual"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">User Guide</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showGuideDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowGuideDropdown(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-52 rounded-md bg-white border border-slate-200 shadow-md z-50 py-1 origin-top-right text-[11px] font-mono font-bold">
                      <button
                        type="button"
                        onClick={() => {
                          setShowGuideDropdown(false);
                          downloadUserGuide('view');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>View Guide</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowGuideDropdown(false);
                          downloadUserGuide('download');
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 border-t border-slate-100 flex items-center space-x-2"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Download HTML Guide</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* 2. Structured Tabs bar */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <nav className="flex -mb-px space-x-1" aria-label="Tabs">
              <button
                id="tab-btn-analyse"
                type="button"
                className={getTabClass('analyse')}
                onClick={() => setActiveTab('analyse')}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Analysis</span>
              </button>

              <button
                id="tab-btn-metadata"
                type="button"
                className={getTabClass('metadata')}
                onClick={() => setActiveTab('metadata')}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Data & Source (Metadata)</span>
              </button>

              <button
                id="tab-btn-report"
                type="button"
                className={getTabClass('report')}
                onClick={() => setActiveTab('report')}
              >
                <Layers className="w-3.5 h-3.5" />
                {activeReport && (
                  <span className="w-1.5 h-1.5 bg-indigo-650 rounded-full animate-ping shrink-0 mr-1 inline-block"></span>
                )}
                <span>Report</span>
              </button>

              <button
                id="tab-btn-export"
                type="button"
                className={getTabClass('export')}
                onClick={() => setActiveTab('export')}
              >
                <FolderUp className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <div
                aria-hidden="true"
                className="my-3 h-6 w-px shrink-0 bg-slate-200"
              />

              <button
                id="tab-btn-methods"
                type="button"
                className={getTabClass('methods')}
                onClick={() => setActiveTab('methods')}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Methods</span>
              </button>

              <button
                id="tab-btn-standards"
                type="button"
                className={getTabClass('standards')}
                onClick={() => setActiveTab('standards')}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Standards</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 3. Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </main>

      {/* 4. Footer Panel */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-12 font-mono text-[10px] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>TextLens Platform — Secure Audit Registry</span>
          <div className="flex space-x-4">
            <span>Jurisdictional Compliance Matrix 2026.1</span>
            <span>•</span>
            <span>Ref: {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
