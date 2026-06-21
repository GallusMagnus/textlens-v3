import React, { useState } from 'react';
import { Play, FileText, CheckCircle2, RotateCcw, AlertCircle, Info, FileUp, Trash2, Paperclip, Loader2, Check, Film, Heart, Sliders, Sparkles } from 'lucide-react';
import { TextLensMetadata, AnalysisReport } from '../types';
import { mockReports } from '../mockReportsData';
import { communicationTypes, rhetoricalFunctions } from '../communicationContext';

interface AnalyseTabProps {
  originalText: string;
  setOriginalText: (text: string) => void;
  metadata: TextLensMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<TextLensMetadata>>;
  activeReport: AnalysisReport | null;
  setActiveReport: (report: AnalysisReport | null) => void;
  onAnalysisStart: () => void;
  isAnalyzing: boolean;
  onNavigateToMetadata: () => void;
  analysisError?: string | null;
  clearAnalysisError?: () => void;
  savedReports?: AnalysisReport[];
}

export default function AnalyseTab({
  originalText,
  setOriginalText,
  metadata,
  setMetadata,
  activeReport,
  setActiveReport,
  onAnalysisStart,
  isAnalyzing,
  onNavigateToMetadata,
  analysisError,
  clearAnalysisError,
  savedReports
}: AnalyseTabProps) {
  interface UploadedFile {
    id: string;
    name: string;
    size: string;
    type: string;
    status: 'parsing' | 'extracting' | 'ready' | 'error';
    extractedText: string;
    errorMsg?: string;
    role: 'contested' | 'supporting' | 'reference';
    title: string;
    author: string;
    platform: string;
    date: string;
    textType: string;
  }

  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const getMissingFields = () => {
    const missing: string[] = [];
    
    // Core parameters (always title, author, platform)
    if (!metadata.title || !metadata.title.trim() || metadata.title === 'Untitled Document') {
      missing.push('Document / Article Title');
    }
    if (!metadata.author || !metadata.author.trim() || metadata.author === 'Unknown Author') {
      missing.push('Author / Speaker / Source');
    }
    if (!metadata.platform || !metadata.platform.trim() || metadata.platform === 'Self-Submitted Text') {
      missing.push('Publishing Platform / Network');
    }

    if (metadata.analysisMode === 'bccsa') {
      if (!metadata.broadcaster || !metadata.broadcaster.trim()) {
        missing.push('Broadcaster');
      }
      if (!metadata.channel || !metadata.channel.trim()) {
        missing.push('Channel');
      }
      if (!metadata.programmeName || !metadata.programmeName.trim()) {
        missing.push('Programme Name');
      }
      if (!metadata.allegedHarm || !metadata.allegedHarm.trim()) {
        missing.push('Alleged Harm or Breach');
      }
    } else if (metadata.analysisMode === 'healthcare') {
      if (!metadata.journalOrPublication || !metadata.journalOrPublication.trim()) {
        missing.push('Journal or Publication');
      }
      if (!metadata.articleType || !metadata.articleType.trim()) {
        missing.push('Article Type');
      }
    }
    
    return missing;
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setMetadata(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Automatically combine multiple 'contested' files into originalText and general metadata
  const updateMergedMetadataAndText = (updatedFiles: UploadedFile[]) => {
    const contestedFiles = updatedFiles.filter(f => f.status === 'ready' && f.role === 'contested');

    if (contestedFiles.length === 0) {
      // If no files are marked contested, we don't automatically override
      return;
    }

    if (contestedFiles.length === 1) {
      const target = contestedFiles[0];
      setOriginalText(target.extractedText);
      setMetadata(prev => ({
        ...prev,
        title: target.title,
        author: target.author,
        platform: target.platform,
        textType: target.textType,
        date: target.date
      }));
    } else {
      const mergedText = contestedFiles.map(f => {
        const headerInfo = [
          f.title ? `Title: ${f.title}` : null,
          f.author ? `By: ${f.author}` : null,
          f.platform ? `Source: ${f.platform}` : null,
          f.date ? `Date: ${f.date}` : null
        ].filter(Boolean).join(' | ');
        return `=== CONTESTED DOCUMENT: ${f.name} (${headerInfo}) ===\n\n${f.extractedText}\n\n`;
      }).join('\n');

      setOriginalText(mergedText);

      // Aggregate metadata fields
      const titles = contestedFiles.map(f => f.title).filter(Boolean).join(' & ');
      const authors = Array.from(new Set(contestedFiles.map(f => f.author).filter(Boolean))).join(', ');
      const platforms = Array.from(new Set(contestedFiles.map(f => f.platform).filter(Boolean))).join(', ');

      setMetadata(prev => ({
        ...prev,
        title: titles.length > 80 ? titles.substring(0, 80) + '...' : titles || 'Combined Dossier',
        author: authors || 'Multiple Authors',
        platform: platforms || 'Multiple Outlets',
        textType: 'Combined Dossier',
        date: contestedFiles[0]?.date || new Date().toISOString().split('T')[0]
      }));
    }
  };

  const handleSetFileRole = (id: string, role: 'contested' | 'supporting' | 'reference') => {
    const updated = uploadedFiles.map(f => {
      if (f.id === id) {
        return { ...f, role };
      }
      return f;
    });
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);
  };

  const handleToggleFileContested = (id: string, isContested: boolean) => {
    const updated = uploadedFiles.map(f => {
      if (f.id === id) {
        return { ...f, role: isContested ? 'contested' as const : 'supporting' as const };
      }
      return f;
    });
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);
  };

  const handleUpdateFileMeta = (id: string, field: string, value: string) => {
    const updated = uploadedFiles.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);
  };

  // Core file processing handler
  const processFiles = async (filesArray: File[]) => {
    setUploadError(null);
    
    // Support up to 5 files
    const newTotal = uploadedFiles.length + filesArray.length;
    if (newTotal > 5) {
      setUploadError(`Workspace limit exceeded: You can upload up to 5 documents. Currently you have ${uploadedFiles.length}, and you tried to add ${filesArray.length}.`);
      return;
    }

    // Filter valid extensions (.pdf and .docx)
    const validFiles = filesArray.filter(file => {
      const lowerName = file.name.toLowerCase();
      return lowerName.endsWith('.pdf') || lowerName.endsWith('.docx');
    });

    if (validFiles.length < filesArray.length) {
      setUploadError("Only standard .pdf and .docx (Word) documents are supported.");
      if (validFiles.length === 0) return;
    }

    setIsUploading(true);

    const promises = validFiles.map(async (file) => {
      const fileId = Math.random().toString(36).substring(2, 9);
      const newFileObj: UploadedFile = {
        id: fileId,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        status: 'parsing',
        extractedText: '',
        role: 'contested',
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: 'Unknown Author',
        platform: 'Uploaded Document',
        date: new Date().toISOString().split('T')[0],
        textType: 'Uploaded Source Document'
      };

      // Add to state immediately to show progress loader
      setUploadedFiles(prev => [...prev, newFileObj]);

      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const resultStr = event.target?.result as string;
            if (!resultStr) {
               throw new Error("Failed to read file buffer");
            }
            const base64 = resultStr.split(',')[1];

            const response = await fetch('/api/parse-document', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                fileBase64: base64
              })
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              throw new Error(errData.error || 'Extraction failed');
            }

            const data = await response.json();
            const extractedText = data.text || '';

            // Set state to extracting metadata
            setUploadedFiles(prev => prev.map(f => {
              if (f.id === fileId) {
                return { ...f, status: 'extracting', extractedText };
              }
              return f;
            }));

            // Call backend AI auto-metadata extractor
            let extractedMeta = {
              title: file.name.replace(/\.[^/.]+$/, ""),
              author: 'Unknown Author',
              platform: 'Uploaded Document',
              date: new Date().toISOString().split('T')[0],
              textType: 'Uploaded Source Document',
              suggestedRole: 'contested' as const
            };

            try {
              const metaResp = await fetch('/api/extract-metadata', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  text: extractedText,
                  fileName: file.name
                })
              });
              if (metaResp.ok) {
                const metaData = await metaResp.json();
                extractedMeta = {
                  title: metaData.title || extractedMeta.title,
                  author: metaData.author || extractedMeta.author,
                  platform: metaData.platform || extractedMeta.platform,
                  date: metaData.date || extractedMeta.date,
                  textType: metaData.textType || extractedMeta.textType,
                  suggestedRole: metaData.suggestedRole || extractedMeta.suggestedRole
                };
              }
            } catch (metaErr) {
              console.error("AI metadata extraction failure, falling back:", metaErr);
            }

            setUploadedFiles(prev => {
              const updated = prev.map(f => {
                if (f.id === fileId) {
                  const updatedFile: UploadedFile = {
                    ...f,
                    status: 'ready',
                    extractedText,
                    role: extractedMeta.suggestedRole,
                    title: extractedMeta.title,
                    author: extractedMeta.author,
                    platform: extractedMeta.platform,
                    date: extractedMeta.date,
                    textType: extractedMeta.textType
                  };
                  return updatedFile;
                }
                return f;
              });

              setTimeout(() => {
                updateMergedMetadataAndText(updated);
              }, 0);
              
              return updated;
            });

          } catch (err: any) {
            console.error("File processing failed for:", file.name, err);
            setUploadedFiles(prev => prev.map(f => {
              if (f.id === fileId) {
                return {
                  ...f,
                  status: 'error',
                  errorMsg: err.message || 'Parsing failed.'
                };
              }
              return f;
            }));
          } finally {
            resolve();
          }
        };

        reader.onerror = () => {
          setUploadedFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return {
                ...f,
                status: 'error',
                errorMsg: 'File read error.'
              };
            }
            return f;
          }));
          resolve();
        };

        reader.readAsDataURL(file);
      });
    });

    await Promise.all(promises);
    setIsUploading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    await processFiles(Array.from(list));
    // clear input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleLoadFileText = (fileObj: UploadedFile) => {
    if (fileObj.status !== 'ready') return;
    
    const updated = uploadedFiles.map(f => {
      if (f.id === fileObj.id) {
        return { ...f, role: 'contested' as const };
      } else if (f.role === 'contested') {
        return { ...f, role: 'supporting' as const };
      }
      return f;
    });
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);

    if (selectedSampleId) setSelectedSampleId('');
    setShowValidation(false);
  };

  const handleMergeAllFiles = () => {
    const updated = uploadedFiles.map(f => {
      if (f.status === 'ready') {
        return { ...f, role: 'contested' as const };
      }
      return f;
    });
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);

    if (selectedSampleId) setSelectedSampleId('');
    setShowValidation(false);
  };

  const handleDeleteFile = (idToDelete: string) => {
    const updated = uploadedFiles.filter(f => f.id !== idToDelete);
    setUploadedFiles(updated);
    updateMergedMetadataAndText(updated);
  };

  const wordCount = originalText ? originalText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = originalText ? originalText.length : 0;

  const handleLoadSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    setShowValidation(false);
    if (!sampleId) return;
    
    let sample: AnalysisReport | undefined;
    if (sampleId.startsWith('saved-')) {
      const realId = sampleId.replace('saved-', '');
      sample = savedReports?.find(r => r.id === realId);
    } else {
      sample = mockReports.find(r => r.id === sampleId);
    }

    if (sample) {
      setOriginalText(sample.originalText);
      setMetadata({ ...sample.metadata });
      // Clear current report to let them "Analyze" it, or load it immediately
      setActiveReport(sample);
    }
  };

  const handleClear = () => {
    setOriginalText('');
    setSelectedSampleId('');
    setActiveReport(null);
    setShowValidation(false);
    setMetadata({
      title: 'Untitled Document',
      author: 'Unknown Author',
      platform: 'Self-Submitted Text',
      date: new Date().toISOString().split('T')[0],
      url: '',
      textType: 'Unspecified Text',
      jurisdiction: 'Generic / Global',
      analysisMode: 'consumer'
    });
  };

  const handleAnalyseSample = () => {
    // If no preset is chosen yet, select 'academic-1' as the default sample text to analyze
    const sampleId = selectedSampleId || 'academic-1';
    setSelectedSampleId(sampleId);
    const sample = mockReports.find(r => r.id === sampleId);
    if (sample) {
      setOriginalText(sample.originalText);
      setMetadata({ ...sample.metadata });
      setActiveReport(sample);
      onAnalysisStart();
    }
  };

  const handleModeChange = (mode: TextLensMetadata['analysisMode']) => {
    setMetadata(prev => ({
      ...prev,
      analysisMode: mode
    }));
  };

  const isTitleMissing = showValidation && (!metadata.title || !metadata.title.trim() || metadata.title === 'Untitled Document');
  const isAuthorMissing = showValidation && (!metadata.author || !metadata.author.trim() || metadata.author === 'Unknown Author');
  const isPlatformMissing = showValidation && (!metadata.platform || !metadata.platform.trim() || metadata.platform === 'Self-Submitted Text');

  const isBroadcasterMissing = showValidation && metadata.analysisMode === 'bccsa' && (!metadata.broadcaster || !metadata.broadcaster.trim());
  const isChannelMissing = showValidation && metadata.analysisMode === 'bccsa' && (!metadata.channel || !metadata.channel.trim());
  const isProgrammeNameMissing = showValidation && metadata.analysisMode === 'bccsa' && (!metadata.programmeName || !metadata.programmeName.trim());
  const isAllegedHarmMissing = showValidation && metadata.analysisMode === 'bccsa' && (!metadata.allegedHarm || !metadata.allegedHarm.trim());

  const isJournalOrPublicationMissing = showValidation && metadata.analysisMode === 'healthcare' && (!metadata.journalOrPublication || !metadata.journalOrPublication.trim());
  const isArticleTypeMissing = showValidation && metadata.analysisMode === 'healthcare' && (!metadata.articleType || !metadata.articleType.trim());

  const handleRunAnalysis = (e: React.MouseEvent) => {
    e.preventDefault();
    const missing = getMissingFields();
    if (missing.length > 0) {
      setShowValidation(true);
      const step3Element = document.getElementById('step-3-section');
      if (step3Element) {
        step3Element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setShowValidation(false);
    onAnalysisStart();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-205 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">TextLens Analysis Workspace</h1>
        </div>
      </div>

      {/* Instruction Banner */}
      <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-xl p-4 flex items-start space-x-3.5 shadow-3xs">
        <Info className="w-5 h-5 text-indigo-650 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed font-sans font-medium">
          Step 1: Select the Analysis Mode. Step 2: Paste or upload the text. Step 3: Provide text and source information. Step 4: Run it
        </div>
      </div>

      {analysisError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start space-x-3 text-xs leading-relaxed animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5 text-red-950">AI Analysis Failed</span>
            <span>{analysisError}</span>
          </div>
          {clearAnalysisError && (
            <button
              type="button"
              onClick={clearAnalysisError}
              className="text-red-500 hover:text-red-800 font-mono font-bold text-sm leading-none ml-2 cursor-pointer pb-0.5"
              title="Clear error"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* ── STEP 1: SELECT COGNITIVE ANALYSIS MODE ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4 hover:border-slate-300/80 transition-all duration-300">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">1</div>
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">Step 1: Select the Analysis Mode</h2>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed">
          TextLens has two mode families. <strong className="text-slate-800">Consumer Mode</strong> is for community monitoring and response triage. <strong className="text-slate-800">Professional Modes</strong> are for standards-based review using more specific frameworks, codes and source boundaries.
        </p>

        {([
          {
            id: 'consumer-family',
            title: 'Consumer Mode',
            summary: 'For community monitoring, public-facing review and response-worthiness.',
            modes: ['consumer'] as const
          },
          {
            id: 'professional-family',
            title: 'Professional Modes',
            summary: 'For standards-based review in specialist, institutional, media and regulatory contexts.',
            modes: ['general', 'healthcare', 'academic', 'bccsa', 'press_code'] as const
          }
        ] as const).map((family) => (
          <div key={family.id} className="space-y-3">
            <div className="px-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  {family.title}
                </h3>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {family.modes.length} mode{family.modes.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {family.summary}
              </p>
            </div>

            <div className={`grid gap-3 ${
              family.id === 'consumer-family'
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {family.modes.map((mode) => {
            const isActive = metadata.analysisMode === mode;
            let modeDetails = {
              title: '',
              desc: '',
              badgeColor: '',
              activeBorderClass: '',
              activeTextClass: '',
            };

            if (mode === 'consumer') {
              modeDetails = {
                title: 'Community / General Review Mode',
                desc: 'Community monitoring, practical scoring and response triage',
                badgeColor: 'bg-violet-50 text-violet-850',
                activeBorderClass: 'border-violet-305 bg-violet-50/10 shadow-[inset_4px_0_0_0_#7c3aed]',
                activeTextClass: 'text-violet-950 text-xs block font-mono font-bold font-semibold'
              };
            } else if (mode === 'general') {
              modeDetails = {
                title: 'Consensus Standards Mode',
                desc: 'Core antisemitism frameworks with stronger guardrails',
                badgeColor: 'bg-slate-100 text-slate-850',
                activeBorderClass: 'border-slate-350 bg-slate-50/40 shadow-[inset_4px_0_0_0_#475569]',
                activeTextClass: 'text-slate-950 text-xs block font-mono font-bold'
              };
            } else if (mode === 'healthcare') {
              modeDetails = {
                title: 'Healthcare Publishing Mode',
                desc: 'Healthcare publication ethics, rhetoric and conflict terminology',
                badgeColor: 'bg-emerald-50 text-emerald-800',
                activeBorderClass: 'border-emerald-350 bg-emerald-50/10 shadow-[inset_4px_0_0_0_#059669]',
                activeTextClass: 'text-emerald-950 text-xs block font-mono font-bold'
              };
            } else if (mode === 'academic') {
              modeDetails = {
                title: 'Academic/University Mode',
                desc: 'Academic freedom, institutional standards and evidence handling',
                badgeColor: 'bg-blue-50 text-blue-800',
                activeBorderClass: 'border-blue-350 bg-blue-50/10 shadow-[inset_4px_0_0_0_#2563eb]',
                activeTextClass: 'text-blue-950 text-xs block font-mono font-bold'
              };
            } else if (mode === 'bccsa') {
              modeDetails = {
                title: 'BCCSA Mode',
                desc: 'South African broadcast standards and complaint support',
                badgeColor: 'bg-indigo-50 text-indigo-850',
                activeBorderClass: 'border-indigo-350 bg-indigo-50/10 shadow-[inset_4px_0_0_0_#4f46e5]',
                activeTextClass: 'text-indigo-950 text-xs block font-mono font-bold'
              };
            } else if (mode === 'press_code') {
              modeDetails = {
                title: 'Press Code Mode',
                desc: 'South African press standards for news and comment',
                badgeColor: 'bg-amber-50 text-amber-850',
                activeBorderClass: 'border-amber-305 bg-amber-50/10 shadow-[inset_4px_0_0_0_#d97706]',
                activeTextClass: 'text-amber-955 text-xs block font-mono font-bold'
              };
            }

            return (
              <label
                key={mode}
                className={`flex items-start p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? `${modeDetails.activeBorderClass} font-semibold ring-1 ring-offset-0 ring-indigo-50`
                    : 'border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="analysisMode"
                  value={mode}
                  checked={isActive}
                  onChange={() => handleModeChange(mode)}
                  className="text-slate-900 focus:ring-slate-950 h-3.5 w-3.5 mr-3 mt-1 accent-indigo-600"
                  disabled={isAnalyzing}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={isActive ? modeDetails.activeTextClass : 'text-xs text-slate-900 block font-mono font-semibold'}>
                      {modeDetails.title}
                    </span>
                    {isActive && (
                      <span className="text-[8px] uppercase tracking-wider font-mono font-bold bg-slate-950 text-white px-1.5 py-0.5 rounded scale-90">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight mt-1">
                    {modeDetails.desc}
                  </span>
                </div>
              </label>
            );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── STEP 2: PASTE OR UPLOAD THE TEXT ── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4 hover:border-slate-300/80 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">2</div>
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">Step 2: Paste or Upload the Text</h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 font-mono shrink-0">Preset Case Study:</span>
            <select
              id="preset-sample-selector"
              value={selectedSampleId}
              onChange={(e) => handleLoadSample(e.target.value)}
              className="bg-indigo-50/40 border border-indigo-200 hover:border-indigo-300 text-indigo-950 text-[11px] font-medium rounded px-2.5 py-1 focus:outline-hidden focus:bg-white cursor-pointer transition-all shadow-3xs max-w-[200px]"
              disabled={isAnalyzing}
            >
              <option value="">-- Start with Empty Canvas --</option>
              
              {savedReports && savedReports.length > 0 && (
                <optgroup label="My Saved Workspace History">
                  {savedReports.map((r) => (
                    <option key={r.id} value={`saved-${r.id}`}>
                      📁 {r.name}
                    </option>
                  ))}
                </optgroup>
              )}

              <optgroup label="Standard Audit Case Studies">
                <option value="healthcare-1">Healthcare: Global Health Editorial</option>
                <option value="academic-1">Academic: Student Resolution</option>
                <option value="broadcast-1">Broadcast: BCCSA Television Interview</option>
                <option value="presscode-1">Press Code: Investigative Sentinel</option>
              </optgroup>
            </select>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Paste the editorial, media release, or transcript to analyze below. You can also upload PDF/Word files in the controller box below to extract text directly.
        </p>

        <div className="relative border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-150 transition-all">
          <textarea
            id="raw-text-textarea"
            value={originalText}
            onChange={(e) => {
              setOriginalText(e.target.value);
              if (selectedSampleId) setSelectedSampleId('');
            }}
            placeholder="Place your source text here"
            className="w-full min-h-[280px] p-4 text-slate-850 text-xs font-sans focus:outline-hidden resize-y leading-relaxed bg-slate-50/10 focus:bg-white rounded-t-lg border-b border-slate-100"
            disabled={isAnalyzing}
          />

          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 bg-slate-50 p-2.5 rounded-b-lg">
            <div className="flex space-x-3">
              <span>{charCount} characters</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
            {originalText.trim() && (
              <button
                type="button"
                onClick={() => setOriginalText('')}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                Clear Input
              </button>
            )}
          </div>
        </div>

        {/* Upload Workspace Embedded in Step 2 */}
        <div className="bg-slate-50/40 border border-slate-150 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileUp className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider">Document Upload Workspace (PDF / DOCX)</span>
            </div>
          </div>

          {uploadError && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 text-[11px] text-amber-900 leading-normal flex items-start space-x-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="flex-1">{uploadError}</span>
              <button type="button" onClick={() => setUploadError(null)} className="text-amber-500 font-bold hover:text-amber-900 cursor-pointer">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="md:col-span-2">
              <label 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`h-full min-h-[110px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-inner' 
                    : 'border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/10'
                }`}
              >
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.docx" 
                  onChange={handleFileChange}
                  className="hidden" 
                  disabled={isAnalyzing}
                />
                <FileUp className="w-6 h-6 text-indigo-400 mb-1" />
                <span className="text-[11px] font-bold text-slate-800">Drag & drop files</span>
                <span className="text-[9px] text-indigo-600 mt-0.5">or click to browse (.pdf, .docx)</span>
              </label>
            </div>

            <div className="md:col-span-3 border border-slate-200 rounded-lg bg-white p-3 flex flex-col justify-between min-h-[110px]">
              {uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-slate-400 font-mono text-[10px]">
                  <Paperclip className="w-5 h-5 text-slate-300 mb-1" />
                  <span>No uploaded documents linked</span>
                </div>
              ) : (
                <div className="space-y-1.5 flex-1 max-h-[100px] overflow-y-auto pr-1">
                  {uploadedFiles.map((f) => (
                    <div key={f.id} className="flex items-center justify-between p-1.5 rounded border border-slate-100 bg-slate-50/40 text-[11px]">
                      <span className="font-medium text-slate-800 truncate max-w-[150px]" title={f.name}>{f.name}</span>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {f.status === 'ready' && (
                          <button
                            type="button"
                            onClick={() => handleLoadFileText(f)}
                            className="px-2 py-0.5 text-[9px] font-mono text-indigo-600 hover:text-indigo-900 border border-indigo-100 rounded bg-indigo-50/30 cursor-pointer"
                          >
                            Load Text
                          </button>
                        )}
                        <button type="button" onClick={() => handleDeleteFile(f.id)} className="text-slate-400 hover:text-red-500 cursor-pointer">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 italic">Click "Load Text" to insert</span>
                  {uploadedFiles.filter(f => f.status === 'ready').length > 1 && (
                    <button
                      type="button"
                      onClick={handleMergeAllFiles}
                      className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-mono text-[10px] flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Merge all files</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── STEP 3: PROVIDE DATA ABOUT THE TEXT AND SOURCE (METADATA) ── */}
      <div id="step-3-section" className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4 hover:border-slate-300/80 transition-all duration-300 animate-in fade-in duration-300">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold">3</div>
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">STEP 3: PROVIDE INFORMATION ABOUT THE TEXT AND ITS SOURCE</h2>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          This information helps fine-tune the analysis and outputs.
        </p>

        {uploadedFiles.length > 0 && (
          <div className="bg-slate-50/50 border border-slate-150 rounded-lg p-4 space-y-3.5 mb-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <Sliders className="w-3 h-3" />
                </div>
                <h3 className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Uploaded Document Matrix & Intents
                </h3>
              </div>
              <span className="text-[8px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded-full font-mono flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 animate-pulse text-indigo-500" />
                <span>AI Auto-Extraction Active</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              AI has scanned each uploaded document to auto-extract core metadata and suggest a fitting intent role. Select one or more files as <strong>Contested Material</strong> to set them as the audit target.
            </p>

            <div className="space-y-3">
              {uploadedFiles.map((file) => {
                const isContested = file.role === 'contested';
                const isParsing = file.status === 'parsing';
                const isExtracting = file.status === 'extracting';
                const isReady = file.status === 'ready';

                return (
                  <div 
                    key={file.id} 
                    className={`border rounded-lg transition-all ${
                      isContested 
                        ? 'border-indigo-200 bg-indigo-50/15 ring-1 ring-indigo-100' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isContested}
                          disabled={!isReady || isAnalyzing}
                          onChange={(e) => handleToggleFileContested(file.id, e.target.checked)}
                          className="mt-0.5 h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-sans font-bold text-slate-800 truncate" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">({file.size})</span>
                            
                            {isParsing && (
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono flex items-center space-x-1">
                                <Loader2 className="w-2.5 h-2.5 animate-spin text-slate-400" />
                                <span>Parsing...</span>
                              </span>
                            )}
                            {isExtracting && (
                              <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono flex items-center space-x-1">
                                <Loader2 className="w-2.5 h-2.5 animate-spin text-indigo-400" />
                                <span>Scanning with AI...</span>
                              </span>
                            )}
                            {isReady && (
                              <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.2 py-0.2 rounded font-mono">
                                READY
                              </span>
                            )}
                          </div>
                          
                          <div className="text-[10px] text-slate-500 mt-0.5 font-sans flex items-center space-x-2">
                            <span>Type: {file.textType || 'Pending'}</span>
                            <span>•</span>
                            <span className="text-slate-400 italic font-mono font-medium">
                              Intent Role: <strong className="text-indigo-600 not-italic uppercase tracking-tight text-[9px]">{file.role}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Role selection dropdown */}
                      <div className="flex items-center space-x-2 self-start sm:self-center">
                        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          Intent Role:
                        </span>
                        <select
                          value={file.role}
                          disabled={!isReady || isAnalyzing}
                          onChange={(e) => handleSetFileRole(file.id, e.target.value as any)}
                          className="border border-slate-200 rounded px-2 py-1 text-xs font-sans bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="contested">⚠️ Contested Material (Target)</option>
                          <option value="supporting">ℹ️ Context / Supporting File</option>
                          <option value="reference">🎓 Reference / Guidelines</option>
                        </select>
                      </div>
                    </div>

                    {/* Metadata Detail Editor (Expandable details block) */}
                    {isReady && (
                      <div className="px-3 pb-3 border-t border-slate-100/80 pt-2 bg-slate-50/20">
                        <details className="group">
                          <summary className="text-[10px] font-mono font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer list-none flex items-center space-x-1 mb-1">
                            <span>▶ View / Edit Extracted Document Info</span>
                            <span className="text-[9px] text-slate-400 font-normal italic ml-2">
                              (Touch or click to review/customize auto-extracted metadata)
                            </span>
                          </summary>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2.5 animate-in fade-in duration-200">
                            <div>
                              <label className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Title</label>
                              <input
                                type="text"
                                value={file.title}
                                disabled={isAnalyzing}
                                onChange={(e) => handleUpdateFileMeta(file.id, 'title', e.target.value)}
                                className="w-full border border-slate-200 p-1.5 text-xs rounded font-sans text-slate-800 bg-white focus:ring-1 focus:ring-indigo-250 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Author / Source</label>
                              <input
                                type="text"
                                value={file.author}
                                disabled={isAnalyzing}
                                onChange={(e) => handleUpdateFileMeta(file.id, 'author', e.target.value)}
                                className="w-full border border-slate-200 p-1.5 text-xs rounded font-sans text-slate-800 bg-white focus:ring-1 focus:ring-indigo-250 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Platform / Outlet</label>
                              <input
                                type="text"
                                value={file.platform}
                                disabled={isAnalyzing}
                                onChange={(e) => handleUpdateFileMeta(file.id, 'platform', e.target.value)}
                                className="w-full border border-slate-200 p-1.5 text-xs rounded font-sans text-slate-800 bg-white focus:ring-1 focus:ring-indigo-250 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Publish Date</label>
                              <input
                                type="date"
                                value={file.date}
                                disabled={isAnalyzing}
                                onChange={(e) => handleUpdateFileMeta(file.id, 'date', e.target.value)}
                                className="w-full border border-slate-200 p-1.5 text-xs rounded font-sans text-slate-800 bg-white focus:ring-1 focus:ring-indigo-250 focus:border-indigo-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Content Type</label>
                              <input
                                type="text"
                                value={file.textType}
                                disabled={isAnalyzing}
                                onChange={(e) => handleUpdateFileMeta(file.id, 'textType', e.target.value)}
                                className="w-full border border-slate-200 p-1.5 text-xs rounded font-sans text-slate-800 bg-white focus:ring-1 focus:ring-indigo-250 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-slate-400 font-sans italic">
              * Checking a document automatically compiles and formats its contents inside Step 2 as Contested Material targets.
            </div>
          </div>
        )}

        {/* Core parameters in a beautiful grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-[11px]">
          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-title">
              Document / Article Title <span className="text-red-500 ml-0.5 font-sans">*</span>
            </label>
            <input
              id="inp-meta-title"
              type="text"
              name="title"
              value={metadata.title}
              onChange={handleMetaChange}
              placeholder="e.g., Editorial: Public Health and Human Rights in Contested Territories"
              className={`w-full border p-2 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:not-italic ${
                isTitleMissing
                  ? "border-red-500 bg-red-50/20 ring-1 ring-red-400"
                  : "border-slate-200 bg-slate-50/55 hover:bg-white focus:bg-white focus:ring-1 focus:ring-indigo-100"
              }`}
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-author">
              Author / Speaker / Source <span className="text-red-500 ml-0.5 font-sans">*</span>
            </label>
            <input
              id="inp-meta-author"
              type="text"
              name="author"
              value={metadata.author}
              onChange={handleMetaChange}
              placeholder="e.g., Commentator, Speaker, or Author"
              className={`w-full border p-2 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:not-italic ${
                isAuthorMissing
                  ? "border-red-500 bg-red-50/20 ring-1 ring-red-400"
                  : "border-slate-200 bg-slate-50/55 hover:bg-white focus:bg-white focus:ring-1 focus:ring-indigo-100"
              }`}
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-platform">
              Publishing Platform / Network <span className="text-red-500 ml-0.5 font-sans">*</span>
            </label>
            <input
              id="inp-meta-platform"
              type="text"
              name="platform"
              value={metadata.platform}
              onChange={handleMetaChange}
              placeholder="e.g., Journal title, Newspaper name, Station name"
              className={`w-full border p-2 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:not-italic ${
                isPlatformMissing
                  ? "border-red-500 bg-red-50/20 ring-1 ring-red-400"
                  : "border-slate-200 bg-slate-50/55 hover:bg-white focus:bg-white focus:ring-1 focus:ring-indigo-100"
              }`}
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-date">
              Publication / Broadcast Date
            </label>
            <input
              id="inp-meta-date"
              type="date"
              name="date"
              value={metadata.date}
              onChange={handleMetaChange}
              className="w-full border border-slate-200 p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all cursor-pointer"
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-url">
              Source Document URL
            </label>
            <input
              id="inp-meta-url"
              type="url"
              name="url"
              value={metadata.url || ''}
              onChange={handleMetaChange}
              placeholder="e.g., https://example.com/editorial-source"
              className="w-full border border-slate-200 p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all"
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-textType">
              Content / Text Type
            </label>
            <input
              id="inp-meta-textType"
              type="text"
              name="textType"
              value={metadata.textType}
              onChange={handleMetaChange}
              placeholder="e.g. Open Letter, Editorial, Broadcast Transcript, Academic Article"
              className="w-full border border-slate-200 p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-indigo-500 rounded font-sans transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:not-italic focus:ring-1 focus:ring-indigo-100"
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-jurisdiction">
              Jurisdiction / Legal Territory
            </label>
            <select
              id="inp-meta-jurisdiction"
              name="jurisdiction"
              value={metadata.jurisdiction}
              onChange={handleMetaChange}
              className="w-full border border-slate-200 p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-indigo-500 rounded font-sans cursor-pointer transition-all"
              disabled={isAnalyzing}
            >
              <option value="Global / Multi-Jurisdiction">Global / Multi-Jurisdiction</option>
              <option value="South Africa (ZA)">South Africa (ZA)</option>
              <option value="USA / North America">USA / North America</option>
              <option value="United Kingdom (UK)">United Kingdom (UK)</option>
              <option value="European Union (EU)">European Union (EU)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 uppercase tracking-wider font-bold mb-1" htmlFor="inp-meta-comm-type">
              Communication Type
            </label>
            <select
              id="inp-meta-comm-type"
              name="communicationType"
              value={metadata.communicationType || ''}
              onChange={handleMetaChange}
              className="w-full border border-slate-200 p-2 text-xs text-slate-900 bg-slate-50/55 hover:bg-white focus:bg-white focus:outline-hidden focus:border-indigo-500 rounded font-sans cursor-pointer transition-all"
              disabled={isAnalyzing}
            >
              <option value="">-- Choose Communication Type --</option>
              {communicationTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Context Interpretive Guidance Panel */}
        {metadata.communicationType && metadata.communicationType !== 'unspecified' && (
          <div className="p-3.5 bg-indigo-50/40 border border-indigo-150 rounded-lg space-y-2.5 animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-center space-x-1.5 text-indigo-900 font-bold uppercase tracking-wider text-[9px] font-mono">
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
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ct.description}</p>
                    <p className="text-slate-705 bg-white/70 p-2 rounded border border-slate-150 text-[11px] leading-relaxed">
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
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── MODE-SPECIFIC CONDITIONAL DIAGNOSTICS SECTION ── */}

        {/* A. BCCSA Diagnostics block */}
        {metadata.analysisMode === 'bccsa' && (
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/60 rounded-lg animate-in slide-in-from-top-1 duration-250">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-150">
              <Film className="w-4 h-4 text-slate-700" />
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest font-mono">BCCSA / Broadcast Complaint Regulatory Diagnostics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Broadcaster <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="broadcaster"
                  value={metadata.broadcaster || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. SABC, eNCA"
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isBroadcasterMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Channel <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="channel"
                  value={metadata.channel || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. Channel 403"
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isChannelMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Programme Name <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="programmeName"
                  value={metadata.programmeName || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. Sunday Night Live"
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isProgrammeNameMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Date/Time of Broadcast
                </label>
                <input
                  type="text"
                  name="broadcastDateTime"
                  value={metadata.broadcastDateTime || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. 2026-05-28 20:30 UTC"
                  className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans"
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Watershed Context
                </label>
                <input
                  type="text"
                  name="watershedContext"
                  value={metadata.watershedContext || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. Adult viewing advisory"
                  className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="inp-met-transcript"
                  name="transcriptAvailable"
                  checked={!!metadata.transcriptAvailable}
                  onChange={handleMetaChange}
                  className="text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 accent-indigo-650 rounded cursor-pointer"
                  disabled={isAnalyzing}
                />
                <label htmlFor="inp-met-transcript" className="text-slate-700 font-semibold uppercase tracking-wider select-none cursor-pointer">
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
                  onChange={handleMetaChange}
                  rows={2}
                  placeholder="Summary profiling the complainants..."
                  className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans"
                  disabled={isAnalyzing}
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Alleged Harm or Breach <span className="text-red-500 ml-0.5">*</span>
                </label>
                <textarea
                  name="allegedHarm"
                  value={metadata.allegedHarm || ''}
                  onChange={handleMetaChange}
                  rows={2}
                  placeholder="Describe specific claims, misrepresentations, pathologizing metaphors, or hostile omissions causing regulatory harm..."
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isAllegedHarmMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
                />
              </div>
            </div>
          </div>
        )}

        {/* B. Healthcare/Bio-clinical diagnostics block */}
        {metadata.analysisMode === 'healthcare' && (
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/60 rounded-lg animate-in slide-in-from-top-1 duration-250">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-150">
              <Heart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest font-mono">Healthcare / Bio-Clinical Publication Parameters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Journal or Publication <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="journalOrPublication"
                  value={metadata.journalOrPublication || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. Lancet, NEJM"
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isJournalOrPublicationMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
                />
              </div>

              <div>
                <label className="block text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Article Type <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  name="articleType"
                  value={metadata.articleType || ''}
                  onChange={handleMetaChange}
                  placeholder="e.g. Peer-Reviewed, Case Study"
                  className={`w-full border rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans ${
                    isArticleTypeMissing ? 'border-red-500 bg-red-50/20 ring-1 ring-red-400' : 'border-slate-200'
                  }`}
                  disabled={isAnalyzing}
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
                  onChange={handleMetaChange}
                  placeholder="e.g. doi:10.1056/..."
                  className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans"
                  disabled={isAnalyzing}
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
                  onChange={handleMetaChange}
                  placeholder="e.g. Division of Social Medicine, Harvard"
                  className="w-full border border-slate-200 rounded p-1.5 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500 transition-all font-sans"
                  disabled={isAnalyzing}
                />
              </div>
            </div>
          </div>
        )}

        {/* C. Community / General Review Mode specific diagnostics - Publication Prominence Tier scales */}
        {metadata.analysisMode === 'consumer' && (
          <div className="p-4 bg-violet-50/50 border border-violet-200 rounded-lg space-y-3 animate-in slide-in-from-top-1 duration-250">
            <div className="flex items-center space-x-2 pb-2 border-b border-violet-100">
              <Sliders className="w-4 h-4 text-violet-705" />
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">PUBLICATION PROMINENCE TIER</h3>
            </div>
            <p className="text-[11px] text-violet-900 leading-relaxed font-sans">
              Please select the publication tier. This is used in the "Worthy of Response" calculation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
              {([
                [1, 'Independent / Blog', 'Substack, personal diary'],
                [2, 'Social / Online', 'Large tweet / public page'],
                [3, 'Specialist / Niche', 'Professional / trade journal'],
                [4, 'Regional Outlet', 'Regional paper / TV station'],
                [5, 'Major National/Intl', 'BBC, NYT, Guardian']
              ] as const).map(([tier, title, example]) => {
                const isSelected = (metadata.publicationProminenceTier ?? 3) === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setMetadata(prev => ({ ...prev, publicationProminenceTier: tier as any }))}
                    className={`p-2.5 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-50/40 text-violet-950 border-2 border-violet-600 font-semibold shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:bg-violet-50/40'
                    }`}
                    disabled={isAnalyzing}
                  >
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-violet-600' : 'text-slate-400'}`}>Tier {tier}</span>
                    <span className={`text-[9px] font-sans font-bold tracking-tight mt-0.5 whitespace-nowrap ${isSelected ? 'text-violet-900' : 'text-slate-700'}`}>{title}</span>
                    <span className={`text-[8px] font-sans mt-0.5 truncate max-w-full ${isSelected ? 'text-violet-600/75' : 'text-slate-400/80'}`}>{example}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── ACTION FOOTER & SIMULATED RUNNING STATE ── */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        {showValidation && getMissingFields().length > 0 && (
          <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-lg flex items-start space-x-3 text-red-100 font-sans">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <span className="font-bold text-xs block text-red-200">Required Details Missing in Step 3</span>
              <p className="text-[11px] text-red-300 leading-normal">
                To perform an accurate {metadata.analysisMode === 'bccsa' ? 'BCCSA broadcast regulatory audit' : metadata.analysisMode === 'healthcare' ? 'healthcare publishing audit' : 'contextual analysis'}, please provide the following required parameters in Step 3:
              </p>
              <ul className="list-disc pl-4 text-[10px] text-red-350 font-mono space-y-0.5">
                {getMissingFields().map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {isAnalyzing ? (
          <div className="space-y-3 font-mono text-[11px] animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>TextLens Parsing Core Loading...</span>
              </span>
              <span className="text-emerald-400 font-black">RUNNING ANALYSIS</span>
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-ping"></span>
                <span>Calibrating core engine match schema for mode: 「{metadata.analysisMode}」...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-ping"></span>
                <span>Parsing lexical constructs & linguistic layers...</span>
              </div>
            </div>
            <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full transition-all"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Workspace Ready</span>
              </div>
              <p className="text-xs text-slate-400">
                {originalText.trim() ? "Analysis prepared. Hit run to analyze original document and details." : "Input text or select standard case template above to activate analysis."}
              </p>
            </div>

            <div className="flex items-center space-x-3.5">
              <button
                id="workspace-clear-btn"
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 font-mono rounded transition-all cursor-pointer disabled:opacity-55 disabled:pointer-events-none active:scale-[0.985]"
                disabled={isAnalyzing}
              >
                Reset
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs" title="Step 4">4</div>
                <button
                  id="workspace-analyze-btn"
                  type="button"
                  onClick={handleRunAnalysis}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 border border-white font-mono rounded flex items-center space-x-2 transition-all shadow-md cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-755 disabled:pointer-events-none hover:shadow-lg active:scale-[0.985]"
                  disabled={isAnalyzing || !originalText.trim()}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run TextLens Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeReport && !isAnalyzing && (
        <div className="bg-emerald-50/50 border border-emerald-150 rounded-lg p-5 flex items-start space-x-3 shadow-3xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 opacity-80" />
          <div className="flex-1">
            <span className="font-bold text-xs text-emerald-950 block">Evaluation Report Generated Successfully!</span>
            <p className="text-xs text-emerald-850 mt-1 leading-relaxed">
              Our AI completed scanning your document according to your configured parameters. Run over to the <strong className="font-semibold text-indigo-900 cursor-pointer underline" onClick={onNavigateToMetadata}>Report tab</strong> to inspect findings!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
