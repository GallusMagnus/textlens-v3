import React, { useState } from 'react';
import {
  Download,
  Clipboard,
  FileCheck,
  CheckCircle,
  FolderSync,
  Info,
  Loader,
  Settings,
  HelpCircle,
  FileText,
  Sparkles,
  Sliders
} from 'lucide-react';
import { AnalysisReport } from '../types';
import { jsPDF } from 'jspdf';
import { getSourceContextFields } from '../utils/sourceContextFields';

interface ExportTabProps {
  activeReport: AnalysisReport | null;
  onNavigateToAnalyse: () => void;
}

export default function ExportTab({ activeReport, onNavigateToAnalyse }: ExportTabProps) {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<Record<string, boolean>>({});
  const [includeOriginalText, setIncludeOriginalText] = useState(true);
  const [includeEvidenceTable, setIncludeEvidenceTable] = useState(true);
  const [includeDraftComplaints, setIncludeDraftComplaints] = useState(true);

  const getConsumerTextLabel = (score: number) => {
    if (score <= 15) return 'Minimal';
    if (score <= 35) return 'Notable';
    if (score <= 60) return 'Sustained';
    if (score <= 80) return 'Intense';
    return 'Extreme';
  };

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

  if (!activeReport) {
    return (
      <div id="export-no-report-cta" className="bg-white border border-gray-200 rounded-lg p-12 text-center max-w-2xl mx-auto my-8 space-y-4">
        <FolderSync className="w-12 h-12 text-gray-400 mx-auto" />
        <h3 className="text-lg font-semibold text-gray-950">No Document Available to Export</h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Please select a preset case study or analyze a custom text in the <strong>Analyse Text</strong> tab to unlock export features.
        </p>
        <button
          id="export-navigate-analyse-btn"
          type="button"
          onClick={onNavigateToAnalyse}
          className="px-4 py-2 text-xs font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-all shadow-xs"
        >
          Go to Analyse Workspace
        </button>
      </div>
    );
  }

  const { metadata, flaggedPassages, evidentiaryIssues } = activeReport;
  const analysisDateText = formatAnalysisTimestamp(activeReport.analysisTrace?.analyzedAt);
  const analysisModelText = activeReport.analysisTrace?.model || 'Not recorded';
  const sourceContextFields = getSourceContextFields(metadata);

  const generatePlainTextReport = () => {
    let report = "";
    report += "================================================================================\n";
    report += "                        TEXTLENS COMPLIANCE AUDIT PLATFORM\n";
    report += "                     Official Case Docket & Compliance Brief\n";
    report += "================================================================================\n";
    report += `Case Reference ID: #${activeReport.id.toUpperCase()}\n`;
    report += `Analysis Date:     ${analysisDateText}\n`;
    report += `Model:             ${analysisModelText}\n\n`;
    
    report += "I. DOCUMENT METADATA\n";
    report += "--------------------------------------------------------------------------------\n";
    report += `Title:                 ${metadata.title}\n`;
    report += `Author/Creator:        ${metadata.author || "Unknown Author"}\n`;
    report += `Broadcaster/Platform:  ${metadata.platform || "Uploaded Document"}\n`;
    report += `Broadcast/Pub Date:    ${metadata.date || "Unknown Date"}\n`;
    report += `Standard Doc Type:     ${metadata.textType}\n`;
    report += `Analysis Model:        ${analysisModelText}\n`;
    report += `Overall Concern Level: ${(activeReport.overallConcernLevel || 'High').toUpperCase()}\n`;
    report += `Confidence Level:      ${(activeReport.confidence || 'High').toUpperCase()}\n\n`;

    report += "II. EXECUTIVE SUMMATION & ANALYSIS JUDGEMENT\n";
    report += "--------------------------------------------------------------------------------\n";
    report += `${activeReport.summaryJudgement}\n\n`;

    if (metadata.analysisMode === 'consumer' && activeReport.consumerScores) {
      const cs = activeReport.consumerScores;
      report += "II.B. COMMUNITY / GENERAL REVIEW RADAR SCORING METRICS\n";
      report += "--------------------------------------------------------------------------------\n";
      report += `- Antisemitism Content Score:    [Score: ${cs.antisemitismScore}/100 - ${getConsumerTextLabel(cs.antisemitismScore)}]\n`;
      report += `  Assessment: ${cs.antisemitismNarrative}\n\n`;
      report += `- Anti-Zionist Intensity Score:  [Score: ${cs.antiZionistIntensityScore}/100 - ${getConsumerTextLabel(cs.antiZionistIntensityScore)}]\n`;
      report += `  Assessment: ${cs.antiZionistNarrative}\n\n`;
      report += `- Rhetorical Distortion Score:   [Score: ${cs.rhetoricalDistortionScore}/100 - ${getConsumerTextLabel(cs.rhetoricalDistortionScore)}]\n`;
      report += `  Assessment: ${cs.rhetoricalNarrative}\n\n`;
      report += `- Worthy of Response Value:       [Score: ${cs.worthyOfResponseScore}/100 - ${getConsumerTextLabel(cs.worthyOfResponseScore)}]\n`;
      report += `  Assessment: ${cs.worthinessNarrative}\n\n`;
    }

    if (includeEvidenceTable) {
      report += "III. SYSTEMATIC LEXICAL & RHETORICAL EXAMINED PASSAGES\n";
      report += "--------------------------------------------------------------------------------\n";
      if (!flaggedPassages || flaggedPassages.length === 0) {
        report += "No severe rhetorical bias or lexical triggers identified by the standard engine.\n\n";
      } else {
        flaggedPassages.forEach((p, idx) => {
          report += `[FLAG 0${idx + 1}] — Layer ${p.layer}\n`;
          report += `  - Text Snippet: "${p.textSnippet}"\n`;
          report += `  - Severity:     ${p.severity}\n`;
          report += `  - Uncertainty:  ${p.uncertaintyLabel}\n`;
          const appliedStr = p.standardsApplied?.map(s => `${s.standardName} (${s.clauseTitle})`).join(', ') || "General Rule";
          report += `  - Applied Codes: ${appliedStr}\n`;
          report += `  - Audit Explanation: ${p.explanation}\n\n`;
        });
      }

      report += "IV. EVIDENTIARY OMISSIONS & LOGICAL ASSESSMENT\n";
      report += "--------------------------------------------------------------------------------\n";
      if (!evidentiaryIssues || evidentiaryIssues.length === 0) {
        report += "No major evidentiary omissions or missing contextual background items noted.\n\n";
      } else {
        evidentiaryIssues.forEach((issue, idx) => {
          report += `[OMISSION 0${idx + 1}]\n`;
          report += `  - Core Claim:    "${issue.claimSnippet}"\n`;
          report += `  - Unreliable Pattern: ${issue.unreliablePattern}\n`;
          report += `  - Reasoning Assessment: ${issue.reasoning}\n`;
          report += `  - Remedy Action: ${issue.suggestedAction}\n\n`;
        });
      }
    }

    if (includeOriginalText && activeReport.originalText) {
      report += "V. APPENDIX: AUDITED BROADCAST / PRESS ORIGINAL TEXT\n";
      report += "--------------------------------------------------------------------------------\n";
      report += `${activeReport.originalText}\n\n`;
    }

    if (includeDraftComplaints && activeReport.suggestedComplaintLanguage) {
      report += "VI. SUGGESTED COMPLAINT CORRESPONDENCE & LETTERS\n";
      report += "--------------------------------------------------------------------------------\n";
      report += "A. FORMAL COMPLAINT RESPONSE LETTER:\n";
      report += "................................................................................\n";
      report += `${activeReport.suggestedComplaintLanguage.formalLetter}\n\n`;
      report += "B. PUBLIC RESPONSE & CORRECTION REQUEST:\n";
      report += "................................................................................\n";
      report += `${activeReport.suggestedComplaintLanguage.publicCorrectionRequest}\n\n`;
    }

    report += "SOURCE & CONTEXT RECORD\n";
    report += "--------------------------------------------------------------------------------\n";
    sourceContextFields.forEach((field) => {
      report += `${field.label}: ${field.value}\n`;
    });
    report += "\n";

    report += "--------------------------------------------------------------------------------\n";
    report += "End of official compliance brief.\n";
    report += "================================================================================\n";
    return report;
  };

  const generateCsvReport = () => {
    const escapeCsvCell = (str: string) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${clean}"`;
    };

    const rows = [
      ["Audit Item Type", "Document Clause/Ref", "Text Snippet or Flawed Claim", "Detected Category / Pattern", "Severity / Confident Metric", "Assessment & Reasoning Analysis"]
    ];

    // Add metadata row
    rows.push([
      "METADATA",
      "Case ID: " + activeReport.id,
      activeReport.metadata.title,
      activeReport.metadata.platform,
      "Concern: " + (activeReport.overallConcernLevel || 'High'),
      "Author: " + (activeReport.metadata.author || 'Unknown')
    ]);

    if (metadata.analysisMode === 'consumer' && activeReport.consumerScores) {
      const cs = activeReport.consumerScores;
      rows.push(["RADAR SCORE", "Antisemitism Content Score", "Score: " + cs.antisemitismScore, getConsumerTextLabel(cs.antisemitismScore), "Scale 0-100", cs.antisemitismNarrative]);
      rows.push(["RADAR SCORE", "Anti-Zionist Intensity Score ⊹", "Score: " + cs.antiZionistIntensityScore, getConsumerTextLabel(cs.antiZionistIntensityScore), "Scale 0-100", cs.antiZionistNarrative]);
      rows.push(["RADAR SCORE", "Rhetorical Distortion Score", "Score: " + cs.rhetoricalDistortionScore, getConsumerTextLabel(cs.rhetoricalDistortionScore), "Scale 0-100", cs.rhetoricalNarrative]);
      rows.push(["RADAR SCORE", "Response Value / Worthiness Score", "Score: " + cs.worthyOfResponseScore, getConsumerTextLabel(cs.worthyOfResponseScore), "Scale 0-100", cs.worthinessNarrative]);
    }

    // Flagged passages
    flaggedPassages.forEach((p) => {
      const parentStandard = p.standardsApplied?.[0]?.standardName || "General Code";
      const clauseTitle = p.standardsApplied?.[0]?.clauseTitle || "";
      rows.push([
        `Layer ${p.layer} Flag`,
        `${parentStandard} - ${clauseTitle}`,
        p.textSnippet,
        p.severity,
        p.uncertaintyLabel,
        p.explanation
      ]);
    });

    // Evidentiary Issues
    evidentiaryIssues.forEach((issue) => {
      rows.push([
        "Evidentiary Issue",
        "Omission Assessment",
        issue.claimSnippet,
        issue.unreliablePattern,
        "Severity: Critical Context",
        `${issue.reasoning} | Remedy: ${issue.suggestedAction}`
      ]);
    });

    return rows.map(r => r.map(escapeCsvCell).join(',')).join('\n');
  };

  const handleExportTextFile = () => {
    setExportingType('docx');
    setExportSuccess(prev => ({ ...prev, docx: false }));
    setTimeout(() => {
      try {
        const docText = generatePlainTextReport();
        const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const normalizedTitle = metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 40);
        link.download = `textlens_legal_dossier_${normalizedTitle || 'brief'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setExportSuccess(prev => ({ ...prev, docx: true }));
      } catch (err) {
        console.error("Txt Export Error:", err);
      } finally {
        setExportingType(null);
      }
    }, 1200);
  };

  const handleExportCsvFile = () => {
    setExportingType('csv');
    setExportSuccess(prev => ({ ...prev, csv: false }));
    setTimeout(() => {
      try {
        const csvText = generateCsvReport();
        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const normalizedTitle = metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 40);
        link.download = `textlens_audit_grid_${normalizedTitle || 'grid'}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setExportSuccess(prev => ({ ...prev, csv: true }));
      } catch (err) {
        console.error("CSV Export Error:", err);
      } finally {
        setExportingType(null);
      }
    }, 1000);
  };

  const handleCopyClipboard = () => {
    setExportingType('copy');
    setExportSuccess(prev => ({ ...prev, copy: false }));
    setTimeout(() => {
      try {
        const docText = generatePlainTextReport();
        navigator.clipboard.writeText(docText);
        setExportSuccess(prev => ({ ...prev, copy: true }));
      } catch (err) {
        console.error("Clipboard Error:", err);
      } finally {
        setExportingType(null);
      }
    }, 800);
  };

  const handleExportPdf = () => {
    setExportingType('pdf');
    setExportSuccess(prev => ({ ...prev, pdf: false }));
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const marginX = 15;
        const widthMax = pageWidth - (marginX * 2); // 180mm

        let currentY = 20;

        const checkPageOverflow = (neededHeight: number) => {
          if (currentY + neededHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
            drawHeader();
          }
        };

        const drawHeader = () => {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139); // slate-500
          doc.text("TEXTLENS ANALYSIS DOSSIER", marginX, 10);
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.setLineWidth(0.2);
          doc.line(marginX, 12, pageWidth - marginX, 12);
        };

        const drawFooter = () => {
          const totalPages = doc.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184); // slate-400
            // Footer separator
            doc.setDrawColor(241, 245, 249); // slate-100
            doc.setLineWidth(0.2);
            doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

            doc.text(`Case Ref: #${activeReport.id.toUpperCase().substring(0, 8)}`, marginX, pageHeight - 8);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX - 15, pageHeight - 8);
          }
        };

        // Draw header on original first page
        drawHeader();

        // 1. Doc Title Banner
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(30, 41, 59); // slate-800
        const titleLines = doc.splitTextToSize(metadata.title || "Compliance Brief", widthMax);
        doc.text(titleLines, marginX, currentY);
        currentY += (titleLines.length * 8) + 5;

        // Metadata block (Sub-table / key-value list)
        checkPageOverflow(52);
        doc.setFillColor(248, 250, 252); // slate-50
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.rect(marginX, currentY, widthMax, 44, 'FD');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600

        doc.text("Title:", marginX + 4, currentY + 6);
        doc.text("Author/Creator:", marginX + 4, currentY + 12);
        doc.text("Platform/Broadcaster:", marginX + 4, currentY + 18);
        doc.text("Original Pub Date:", marginX + 4, currentY + 24);
        doc.text("Analysis Date:", marginX + 4, currentY + 30);
        doc.text("Model:", marginX + 4, currentY + 36);

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(30, 41, 59);

        // Right side metadata values block
        const titleVal = metadata.title.length > 55 ? metadata.title.substring(0, 52) + '...' : metadata.title;
        doc.text(titleVal, marginX + 40, currentY + 6);
        doc.text(metadata.author || "Unknown", marginX + 40, currentY + 12);
        doc.text(metadata.platform || "Platform", marginX + 40, currentY + 18);
        doc.text(metadata.date || 'N/A', marginX + 40, currentY + 24);
        doc.text(analysisDateText, marginX + 40, currentY + 30);
        doc.text(analysisModelText, marginX + 40, currentY + 36);

        // Add overall concern level badge right inside the rect
        doc.setFillColor(254, 242, 242); // red-50
        doc.setDrawColor(254, 202, 202); // red-200
        doc.rect(pageWidth - marginX - 45, currentY + 4, 40, 36, 'FD');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(153, 27, 27); // red-800
        doc.text("CONCERN LEVEL", pageWidth - marginX - 41, currentY + 10);
        doc.setFontSize(11);
        doc.text((activeReport.overallConcernLevel || 'High').toUpperCase(), pageWidth - marginX - 41, currentY + 18);

        currentY += 50;

        // 2. Executive summary
        checkPageOverflow(30);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("I. Executive Summary & Audit Judgement", marginX, currentY);
        currentY += 6;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85); // slate-700
        const summaryLines = doc.splitTextToSize(activeReport.summaryJudgement || "No summary provided.", widthMax);
        for (const line of summaryLines) {
          checkPageOverflow(5);
          doc.text(line, marginX, currentY);
          currentY += 5.2;
        }
        currentY += 8;

        // 2.B. Consumer Radar Chart & Scores representation if active
        if (metadata.analysisMode === 'consumer' && activeReport.consumerScores) {
          checkPageOverflow(85); // We need space for the chart
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("I.B. Community / General Review Scoring & Radar Graph", marginX, currentY);
          currentY += 8;

          const startY = currentY;

          // Drawing radar geometric diagram:
          const cX = marginX + 30;
          const cY = startY + 32;
          const rSize = 22; // radius in mm

          const cs = activeReport.consumerScores;
          const a = cs.antisemitismScore / 100;
          const az = cs.antiZionistIntensityScore / 100;
          const rd = cs.rhetoricalDistortionScore / 100;
          const wo = cs.worthyOfResponseScore / 100;

          // Concentric diamonds at 25%, 50%, 75%, 100%
          doc.setLineWidth(0.15);
          doc.setDrawColor(203, 213, 225); // slate-300
          for (const gridPercent of [25, 50, 75, 100]) {
            const d = rSize * gridPercent / 100;
            doc.line(cX, cY - d, cX + d, cY);
            doc.line(cX + d, cY, cX, cY + d);
            doc.line(cX, cY + d, cX - d, cY);
            doc.line(cX - d, cY, cX, cY - d);
          }

          // Principal Axes lines
          doc.setLineWidth(0.3);
          doc.setDrawColor(148, 163, 184); // slate-400
          doc.line(cX, cY, cX, cY - rSize); // Top (Antisemitism)
          doc.line(cX, cY, cX + rSize, cY); // Right (Anti-Zionist Intensity)
          doc.line(cX, cY, cX, cY + rSize); // Bottom (Rhetorical Distortion)
          doc.line(cX, cY, cX - rSize, cY); // Left (Worthy of Response)

          // Vertices
          const ptTop    = { x: cX,               y: cY - rSize * a  };
          const ptRight  = { x: cX + rSize * az,  y: cY              };
          const ptBottom = { x: cX,               y: cY + rSize * rd };
          const ptLeft   = { x: cX - rSize * wo,  y: cY              };

          // Determine fill color
          const avgScore = (cs.antisemitismScore + cs.antiZionistIntensityScore + cs.rhetoricalDistortionScore + cs.worthyOfResponseScore) / 4;
          let fillRGB = [34, 197, 94]; // Green
          if (avgScore > 15 && avgScore <= 35) fillRGB = [234, 179, 8]; // Yellow
          else if (avgScore > 35 && avgScore <= 60) fillRGB = [249, 115, 22]; // Orange
          else if (avgScore > 60) fillRGB = [239, 68, 68]; // Red

          // Draw filled dual-triangle polygon representing the scores
          doc.setFillColor(fillRGB[0], fillRGB[1], fillRGB[2]);
          doc.setDrawColor(fillRGB[0], fillRGB[1], fillRGB[2]);
          doc.setLineWidth(0.4);
          doc.triangle(ptTop.x, ptTop.y, ptRight.x, ptRight.y, ptBottom.x, ptBottom.y, 'FD');
          doc.triangle(ptTop.x, ptTop.y, ptBottom.x, ptBottom.y, ptLeft.x, ptLeft.y, 'FD');

          // Draw vertex dots
          doc.setFillColor(239, 68, 68); // Red
          doc.circle(ptTop.x, ptTop.y, 1.0, 'F');
          doc.setFillColor(217, 119, 6); // Amber
          doc.circle(ptRight.x, ptRight.y, 1.0, 'F');
          doc.setFillColor(59, 130, 246); // Blue
          doc.circle(ptBottom.x, ptBottom.y, 1.0, 'F');
          doc.setFillColor(124, 58, 237); // Violet
          doc.circle(ptLeft.x, ptLeft.y, 1.0, 'F');

          // Axis Text Labels around the chart
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(239, 68, 68);
          doc.text("Antisemitism", cX, cY - rSize - 2, { align: 'center' });

          doc.setTextColor(217, 119, 6);
          doc.text("Anti-Zionist", cX + rSize + 2, cY - 1);
          doc.setFontSize(6);
          doc.setTextColor(146, 64, 14);
          doc.text("Intensity", cX + rSize + 2, cY + 2);

          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(59, 130, 246);
          doc.text("Rhetorical", cX, cY + rSize + 3, { align: 'center' });

          doc.setTextColor(124, 58, 237);
          doc.text("Response Worthy", cX - rSize - 2, cY + 1.5, { align: 'right' });

          // Right side detailed textual representations
          const rightX = marginX + 75;
          let textY = startY + 3;

          const dims = [
            { label: 'Antisemitism Content', score: cs.antisemitismScore, narrative: cs.antisemitismNarrative, colorRGB: [239, 68, 68] },
            { label: 'Anti-Zionist Intensity ⊹', score: cs.antiZionistIntensityScore, narrative: cs.antiZionistNarrative, colorRGB: [217, 119, 6] },
            { label: 'Rhetorical Distortion', score: cs.rhetoricalDistortionScore, narrative: cs.rhetoricalNarrative, colorRGB: [59, 130, 246] },
            { label: 'Response Worthiness', score: cs.worthyOfResponseScore, narrative: cs.worthinessNarrative, colorRGB: [124, 58, 237] }
          ];

          dims.forEach(dim => {
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(dim.colorRGB[0], dim.colorRGB[1], dim.colorRGB[2]);
            doc.text(`${dim.label}: ${dim.score} / 100 (${getConsumerTextLabel(dim.score)})`, rightX, textY);
            textY += 3.5;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            const narrativeLines = doc.splitTextToSize(dim.narrative || "No detail provided.", widthMax - 75);
            for (const line of narrativeLines) {
              doc.text(line, rightX, textY);
              textY += 3.2;
            }
            textY += 2;
          });

          currentY = Math.max(cY + rSize + 12, textY + 4);
        }

        // 3. Flagged passages (Evidence Table)
        if (includeEvidenceTable && flaggedPassages && flaggedPassages.length > 0) {
          checkPageOverflow(25);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("II. Systematic Lexical & Rhetorical Flagged Evidence", marginX, currentY);
          currentY += 6;

          flaggedPassages.forEach((p, idx) => {
            // Estimate needed height: Snippet, Uncertainty, Rules violation, Analysis explanation
            const snippetTextLines = doc.splitTextToSize(`"${p.textSnippet}"`, widthMax - 10);
            const explanationTextLines = doc.splitTextToSize(p.explanation || "", widthMax - 10);
            const standardString = p.standardsApplied?.map(s => `${s.standardName} (${s.clauseTitle})`).join(', ') || "General Rule";
            const standardTextLines = doc.splitTextToSize(standardString, widthMax - 15);

            const flagCardHeight = 15 + (snippetTextLines.length * 4.5) + (explanationTextLines.length * 4.5) + (standardTextLines.length * 4.5) + 12;

            checkPageOverflow(flagCardHeight);

            // Draw Flag background box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(203, 213, 225); // slate-300
            doc.rect(marginX, currentY, widthMax, flagCardHeight, 'FD');

            // Flag top bar badge background
            doc.setFillColor(248, 250, 252); // slate-50
            doc.rect(marginX + 0.1, currentY + 0.1, widthMax - 0.2, 7, 'F');
            
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(67, 56, 202); // indigo-700
            doc.text(`FLAG [0${idx + 1}] • LAYER ${p.layer}`, marginX + 4, currentY + 5);

            // Flag Severity badge
            doc.setFillColor(254, 242, 242);
            doc.rect(pageWidth - marginX - 25, currentY + 1.5, 20, 4, 'F');
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(153, 27, 27);
            doc.text(p.severity.toUpperCase(), pageWidth - marginX - 15, currentY + 4.5, { align: 'center' });

            let innerY = currentY + 12;

            // Content snippet text block
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("CONTESTED SOURCE TEXT SNIPPET:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'italic');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42); // slate-900
            for (const line of snippetTextLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }
            innerY += 3;

            // Compliance Rule applied
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("APPLIED REGULATORY CLAUSE:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(67, 56, 202); // indigo-700
            for (const line of standardTextLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }
            innerY += 3;

            // Explanation audit
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("LENS AUDIT EXPLANATION & ASSESSMENTS:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            for (const line of explanationTextLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }

            currentY += flagCardHeight + 6;
          });
          currentY += 4;
        }

        // 4. Evidentiary Omissions and logical blunders
        if (includeEvidenceTable && evidentiaryIssues && evidentiaryIssues.length > 0) {
          checkPageOverflow(25);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("III. Critical Evidentiary & Contextual Omissions", marginX, currentY);
          currentY += 6;

          evidentiaryIssues.forEach((issue, idx) => {
            const claimLines = doc.splitTextToSize(`"${issue.claimSnippet}"`, widthMax - 10);
            const reasoningLines = doc.splitTextToSize(issue.reasoning || "", widthMax - 10);
            const remedyLines = doc.splitTextToSize(issue.suggestedAction || "", widthMax - 10);

            const omissionCardHeight = 15 + (claimLines.length * 4.5) + (reasoningLines.length * 4.5) + (remedyLines.length * 4.5) + 12;

            checkPageOverflow(omissionCardHeight);

            // Draw Omission Box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(245, 158, 11); // amber-500 yellow border
            doc.rect(marginX, currentY, widthMax, omissionCardHeight, 'FD');

            // Top Bar
            doc.setFillColor(254, 243, 199); // amber-100
            doc.rect(marginX + 0.1, currentY + 0.1, widthMax - 0.2, 7, 'F');

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(146, 64, 14); // amber-800
            doc.text(`OMISSION [0${idx + 1}] • ${issue.unreliablePattern.toUpperCase()}`, marginX + 4, currentY + 5);

            let innerY = currentY + 12;

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(180, 83, 9); // amber-700
            doc.text("UNSUPPORTED SOURCE CLAIM:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            for (const line of claimLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }
            innerY += 3;

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("OMISSION CRITIQUE & RATIONALE:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(51, 65, 85);
            for (const line of reasoningLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }
            innerY += 3;

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(6, 95, 70); // emerald-800
            doc.text("REQUIRED AUDIT REMEDY / ACTION ADVICE:", marginX + 4, innerY);
            innerY += 4;

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(4, 120, 87); // emerald-700
            for (const line of remedyLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.5;
            }

            currentY += omissionCardHeight + 6;
          });
          currentY += 4;
        }

        // 5. Appended Legal Responses & Draft Correspondence
        if (includeDraftComplaints && activeReport.suggestedComplaintLanguage) {
          checkPageOverflow(25);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(15, 23, 42);
          doc.text("IV. Suggested Remedial Correspondence & Draft Letters", marginX, currentY);
          currentY += 6;

          // Frame A: Formal cover letter
          if (activeReport.suggestedComplaintLanguage.formalLetter) {
            const formalLines = doc.splitTextToSize(activeReport.suggestedComplaintLanguage.formalLetter, widthMax - 10);
            const formalBoxHeight = (formalLines.length * 4.2) + 12;

            checkPageOverflow(formalBoxHeight + 15);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(67, 56, 202);
            doc.text("A. Formal Complaint Cover Letter Request", marginX, currentY);
            currentY += 5;

            doc.setFillColor(253, 253, 254);
            doc.setDrawColor(218, 223, 230);
            doc.rect(marginX, currentY, widthMax, formalBoxHeight, 'FD');

            let innerY = currentY + 6;
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);
            for (const line of formalLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.2;
            }
            currentY += formalBoxHeight + 8;
          }

          // Frame B: Public correction request
          if (activeReport.suggestedComplaintLanguage.publicCorrectionRequest) {
            const publicLines = doc.splitTextToSize(activeReport.suggestedComplaintLanguage.publicCorrectionRequest, widthMax - 10);
            const publicBoxHeight = (publicLines.length * 4.2) + 12;

            checkPageOverflow(publicBoxHeight + 15);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(67, 56, 202);
            doc.text("B. Public Correction & Clarification Post", marginX, currentY);
            currentY += 5;

            doc.setFillColor(253, 253, 254);
            doc.setDrawColor(218, 223, 230);
            doc.rect(marginX, currentY, widthMax, publicBoxHeight, 'FD');

            let innerY = currentY + 6;
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);
            for (const line of publicLines) {
              doc.text(line, marginX + 5, innerY);
              innerY += 4.2;
            }
            currentY += publicBoxHeight + 8;
          }
        }

        // 6. Source & Context record
        checkPageOverflow(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("Source & Context Record", marginX, currentY);
        currentY += 6;

        const sourceContextLineHeight = 5;
        sourceContextFields.forEach((field) => {
          const wrappedValue = doc.splitTextToSize(field.value, widthMax - 55);
          const blockHeight = 4 + wrappedValue.length * sourceContextLineHeight;
          checkPageOverflow(blockHeight + 2);

          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(`${field.label}:`, marginX, currentY);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          let valueY = currentY;
          wrappedValue.forEach((line: string) => {
            doc.text(line, marginX + 45, valueY);
            valueY += sourceContextLineHeight;
          });

          currentY = valueY + 1;
        });

        // Apply headers & footer page numbers across pages
        drawFooter();

        // Build and save the actual binary blobs to local systems
        const normalizedTitle = metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 40);
        doc.save(`textlens_compliance_dossier_${normalizedTitle || 'brief'}.pdf`);

        setExportSuccess(prev => ({ ...prev, pdf: true }));
      } catch (err) {
        console.error("PDF Export Generate Error:", err);
      } finally {
        setExportingType(null);
      }
    }, 1400);
  };

  return (
    <div id="export-tab-container" className="space-y-6 font-sans">
      
      {/* Dynamic PRINT layout styling rules for high quality physical vector and PDF prints */}
      <style>{`
        @media print {
          /* Hide all outer components like Sidebar, Tab bar, headers on print */
          body {
            background: white !important;
            color: black !important;
            font-family: Georgia, Cambria, "Times New Roman", Times, serif !important;
          }
          #root, header, nav, footer, sidebar, .no-print, button, select, input, label, hr {
            display: none !important;
          }
          #textlens-printable-report {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            color: black;
          }
          .page-break {
            page-break-before: always;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
        @media screen {
          #textlens-printable-report {
            display: none !important;
          }
        }
      `}</style>

      {/* Actual PDF page-break structured layout markup */}
      <div id="textlens-printable-report" className="p-8 max-w-4xl mx-auto bg-white text-slate-900 leading-relaxed">
        {/* COVER SHEET */}
        <div className="text-center py-12 border-b-4 border-double border-slate-350">
          <div className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold">TextLens Compliance Audit Platform</div>
          <h1 className="text-3xl font-serif font-semibold text-slate-900 mt-3 uppercase tracking-tight">Official Media Bias & Compliance Brief</h1>
          <div className="text-sm font-mono text-indigo-600 mt-2 font-bold">[Case Reference: #{activeReport.id.substring(0, 8).toUpperCase()}]</div>
          
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto text-left mt-8 p-4 bg-slate-50 border border-slate-205 text-xs font-mono">
            <div><strong>Document Title:</strong> {metadata.title}</div>
            <div><strong>Author/Speaker:</strong> {metadata.author || 'Unknown Author'}</div>
            <div><strong>Platform/Outlet:</strong> {metadata.platform || 'General Upload'}</div>
            <div><strong>Original Pub Date:</strong> {metadata.date || 'Undated'}</div>
            <div><strong>Content Standard:</strong> {metadata.textType}</div>
            <div><strong>Concern Level:</strong> <span className="uppercase font-bold text-red-650 font-sans">{(activeReport.overallConcernLevel || 'High').toUpperCase()}</span></div>
            <div><strong>Analysis Date:</strong> {analysisDateText}</div>
            <div><strong>Model:</strong> {analysisModelText}</div>
          </div>
        </div>

        {/* SECTION 1: EXEC SUMMARY */}
        <div className="mt-8">
          <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">1. Executive Summary & Audit Judgement</h2>
          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-serif">
            {activeReport.summaryJudgement}
          </p>
        </div>

        {/* SECTION 1.B: COMMUNITY / GENERAL REVIEW MODE RADAR SCORING METRICS */}
        {metadata.analysisMode === 'consumer' && activeReport.consumerScores && (
          <div className="mt-8 break-inside-avoid">
            <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">1.B. Community &amp; General Review 4D Scoring Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-4 bg-slate-50 border border-slate-200 rounded">
              
              {/* Radar Diagram Graphic in print PDF */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-2">FOUR-DIMENSION RADAR PLOT</div>
                {/* Responsive printable SVG mimicking the radar chart */}
                <svg viewBox="0 0 280 280" className="w-56 h-56 select-none bg-white p-2 rounded border border-slate-100 mx-auto">
                  {/* Concentric grids */}
                  {[25, 50, 75, 100].map(g => {
                    const cx = 140, cy = 140, r = 95;
                    const d = r * g / 100;
                    return (
                      <polygon key={g} points={`${cx},${cy-d} ${cx+d},${cy} ${cx},${cy+d} ${cx-d},${cy}`}
                        fill="none" stroke="#cbd5e1" strokeWidth={g === 100 ? 1.5 : 0.8} />
                    );
                  })}
                  {/* Grid background numbers */}
                  {[25, 50, 75].map(g => (
                    <text key={g} x={143} y={140 - 95 * g / 100 + 3} fontSize="7" fill="#94a3b8" fontFamily="Arial">{g}</text>
                  ))}
                  {/* Score axes */}
                  <line x1={140} y1={140} x2={140} y2={45} stroke="#ef4444" strokeWidth="1" />
                  <line x1={140} y1={140} x2={235} y2={140} stroke="#d97706" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1={140} y1={140} x2={140} y2={235} stroke="#3b82f6" strokeWidth="1" />
                  <line x1={140} y1={140} x2={45} y2={140} stroke="#7c3aed" strokeWidth="1" />
                  
                  {/* Render the quadrilateral polygon matching the score percentages */}
                  {(() => {
                    const cs = activeReport.consumerScores;
                    if (!cs) return null;
                    const cx = 140, cy = 140, r = 95;
                    const a = cs.antisemitismScore / 100;
                    const az = cs.antiZionistIntensityScore / 100;
                    const rd = cs.rhetoricalDistortionScore / 100;
                    const wo = cs.worthyOfResponseScore / 100;
                    
                    const top    = { x: cx,           y: cy - r * a  };
                    const right  = { x: cx + r * az, y: cy           };
                    const bottom = { x: cx,           y: cy + r * rd  };
                    const left   = { x: cx - r * wo, y: cy           };
                    const poly = `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`;
                    
                    const avg = (cs.antisemitismScore + cs.antiZionistIntensityScore + cs.rhetoricalDistortionScore + cs.worthyOfResponseScore) / 4;
                    const fill = avg <= 15 ? '#22c55e' : avg <= 35 ? '#eab308' : avg <= 60 ? '#f97316' : '#ef4444';
                    
                    return (
                      <>
                        <polygon points={poly} fill={fill} fillOpacity="0.1" stroke="none" />
                        <polygon points={poly} fill="none" stroke={fill} strokeWidth="2" />
                        <circle cx={top.x}    cy={top.y}    r="3.5" fill="#ef4444" />
                        <circle cx={right.x}  cy={right.y}  r="3.5" fill="#d97706" />
                        <circle cx={bottom.x} cy={bottom.y} r="3.5" fill="#3b82f6" />
                        <circle cx={left.x}   cy={left.y}   r="3.5" fill="#7c3aed" />
                      </>
                    );
                  })()}
                  <text x={140} y={32} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ef4444" fontFamily="Arial">Antisemitism</text>
                  <text x={240} y={138} textAnchor="start" fontSize="9" fontWeight="bold" fill="#d97706" fontFamily="Arial">Anti-Zionist</text>
                  <text x={240} y={148} textAnchor="start" fontSize="7" fill="#92400e" fontFamily="Arial">Intensity ⊹</text>
                  <text x={140} y={252} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3b82f6" fontFamily="Arial">Rhetorical</text>
                  <text x={40} y={138} textAnchor="end" fontSize="9" fontWeight="bold" fill="#7c3aed" fontFamily="Arial">Response</text>
                  <text x={40} y={148} textAnchor="end" fontSize="8" fill="#7c3aed" fontFamily="Arial">Value</text>
                </svg>
              </div>

              {/* Narratives lists */}
              <div className="space-y-3">
                {[
                  { label: "Antisemitism Content", score: activeReport.consumerScores.antisemitismScore, narrative: activeReport.consumerScores.antisemitismNarrative, color: "text-red-700" },
                  { label: "Anti-Zionist Intensity ⊹", score: activeReport.consumerScores.antiZionistIntensityScore, narrative: activeReport.consumerScores.antiZionistNarrative, color: "text-amber-700" },
                  { label: "Rhetorical Distortion", score: activeReport.consumerScores.rhetoricalDistortionScore, narrative: activeReport.consumerScores.rhetoricalNarrative, color: "text-blue-700" },
                  { label: "Response Value", score: activeReport.consumerScores.worthyOfResponseScore, narrative: activeReport.consumerScores.worthinessNarrative, color: "text-violet-700" }
                ].map(dim => (
                  <div key={dim.label} className="text-xs">
                    <div className="flex justify-between font-bold border-b pb-0.5 mb-1 bg-slate-100 px-1.5 py-0.5 rounded">
                      <span className={dim.color}>{dim.label}</span>
                      <span className={dim.color}>{dim.score} / 100 ({getConsumerTextLabel(dim.score)})</span>
                    </div>
                    <p className="text-[11px] text-slate-650 font-sans italic pl-1 leading-relaxed">
                      {dim.narrative || "No detail assessment available."}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: SYSTEMATIC EXAMINED TEXT EVIDENCE */}
        {includeEvidenceTable && flaggedPassages && flaggedPassages.length > 0 && (
          <div className="mt-8 page-break">
            <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">2. Systemic Flagged Lexical & Rhetorical Bias</h2>
            <div className="space-y-6">
              {flaggedPassages.map((p, idx) => (
                <div key={p.id} className="border border-slate-200 p-4 rounded bg-slate-50/50 break-inside-avoid">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b pb-1.5 mb-2">
                    <span className="font-bold uppercase text-indigo-700">FLAG [0{idx + 1}] • LAYER {p.layer}</span>
                    <span className="bg-red-50 text-red-800 px-1.5 py-0.5 rounded font-bold uppercase">{p.severity}</span>
                  </div>
                  
                  <div className="mb-2.5">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Contested Snippet:</span>
                    <p className="text-xs font-serif italic text-slate-900 border-l-2 border-indigo-400 pl-3">
                      "{p.textSnippet}"
                    </p>
                  </div>

                  <div className="mb-2.5 grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Uncertainty Metric:</span>
                      <span className="font-medium text-slate-700">{p.uncertaintyLabel}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Applied Compliance Clause:</span>
                      <span className="font-mono text-[9px] text-indigo-700">
                        {p.standardsApplied?.map(s => `${s.standardName} (${s.clauseTitle})`).join(', ') || 'General Bias Definition'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">Compliance Audit & Reasoning:</span>
                    <p className="text-xs text-slate-700 leading-normal font-sans">{p.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: EVIDENTIARY OMISSIONS */}
        {includeEvidenceTable && evidentiaryIssues && evidentiaryIssues.length > 0 && (
          <div className="mt-8 page-break">
            <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">3. Actionable Evidentiary Blunders & Contextual Omissions</h2>
            <div className="space-y-4">
              {evidentiaryIssues.map((issue, idx) => (
                <div key={issue.id} className="border border-slate-200 p-4 rounded bg-slate-50/20 break-inside-avoid">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-b pb-1.5 mb-2">
                    <span className="font-bold">OMISSION [0{idx + 1}]</span>
                    <span className="bg-amber-50 text-amber-850 px-1.5 py-0.5 rounded font-bold uppercase">Critical Context</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Challenged Claim Snippet:</span>
                    <p className="text-xs font-semibold text-slate-800">"{issue.claimSnippet}"</p>
                  </div>

                  <div className="mb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Identified Flaw Pattern:</span>
                    <span className="text-[10px] uppercase font-mono text-amber-700 font-bold">{issue.unreliablePattern}</span>
                  </div>

                  <div className="mb-2">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Analytical Assessment:</span>
                    <p className="text-xs text-slate-600 leading-normal">{issue.reasoning}</p>
                  </div>

                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Remedial Compliance Action Advice:</span>
                    <p className="text-xs text-emerald-800 bg-emerald-50/40 p-2 rounded border border-emerald-100 font-sans leading-normal">{issue.suggestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: INCLUDED ORIGINAL TEXT */}
        {includeOriginalText && activeReport.originalText && (
          <div className="mt-8 page-break">
            <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">4. Appended Audited Source Plaintext</h2>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-[500px]">
              {activeReport.originalText}
            </div>
          </div>
        )}

        {/* SECTION 5: SUGGESTED CORRESPONDENCE */}
        {includeDraftComplaints && activeReport.suggestedComplaintLanguage && (
          <div className="mt-8 page-break">
            <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">5. Appended Legal Responses & Draft Correspondence</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-2">A. Formal Complaint Cover Letter</h3>
                <div className="border border-slate-200 bg-white p-4 rounded text-xs font-serif leading-relaxed whitespace-pre-wrap">
                  {activeReport.suggestedComplaintLanguage.formalLetter}
                </div>
              </div>
              
              <div className="page-break">
                <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-2 animate-none">B. Public Response & Correction Request</h3>
                <div className="border border-slate-200 bg-white p-4 rounded text-xs font-serif leading-relaxed whitespace-pre-wrap">
                  {activeReport.suggestedComplaintLanguage.publicCorrectionRequest}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 page-break">
          <h2 className="text-base font-sans font-bold text-slate-900 uppercase border-b pb-1 mb-3">Source &amp; Context Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {sourceContextFields.map((field) => (
              <div key={field.label} className="border border-slate-200 bg-slate-50/40 rounded p-3 break-inside-avoid">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {field.label}
                </div>
                <div className="text-slate-800 break-words">{field.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRINT FOOTER */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-center text-[10px] font-mono text-slate-400">
          <div>This compliance report dossier conforms to institutional media audit practices.</div>
          <div>Report generated via TextLens workspace platform on {new Date().toISOString().split('T')[0]}. Case reference: #{activeReport.id}</div>
        </div>
      </div>
      
      {/* Overview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
        <h2 className="text-lg font-semibold text-gray-950">Compilation & Share Registry</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select target file formats to compile and download active document case files, compliance audit tables, and suggested complaint response letters instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Export Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">Available Compilation Formats</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Export Word */}
              <div className="border border-gray-200 hover:border-gray-300 rounded p-4 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Standard Text Filename</span>
                  <h4 className="text-sm font-semibold text-gray-900">Compile Legal Brief File</h4>
                  <p className="text-xs text-gray-500 font-sans leading-normal">
                    Generates a formal text-dossier document containing active metadata, comprehensive flagged bias excerpts, and administrative complaint letter models.
                  </p>
                </div>
                <button
                  id="export-docx-btn"
                  type="button"
                  onClick={handleExportTextFile}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-gray-200 rounded text-xs font-mono font-semibold transition-all hover:bg-gray-50 bg-white"
                  disabled={exportingType !== null}
                >
                  {exportingType === 'docx' ? (
                    <>
                      <Loader className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span>Compiling Word Brief...</span>
                    </>
                  ) : exportSuccess['docx'] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold font-mono">Dossier File Saved</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>Download .TXT Brief</span>
                    </>
                  )}
                </button>
              </div>

              {/* Export PDF */}
              <div className="border border-gray-200 hover:border-gray-300 rounded p-4 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-bold">Adobe PDF Vectors</span>
                  <h4 className="text-sm font-semibold text-gray-900">Render PDF Compliance Report</h4>
                  <p className="text-xs text-gray-500 font-sans leading-normal">
                    Generates an unmodifiable, professionally styled PDF with system metadata cover sheet, evidentiary audit matrix, and responsive correction requests.
                  </p>
                </div>
                <button
                  id="export-pdf-btn"
                  type="button"
                  onClick={handleExportPdf}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-gray-200 rounded text-xs font-mono font-semibold transition-all hover:bg-gray-50 bg-white"
                  disabled={exportingType !== null}
                >
                  {exportingType === 'pdf' ? (
                    <>
                      <Loader className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span>Rendering layout engine...</span>
                    </>
                  ) : exportSuccess['pdf'] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold font-mono">PDF Export Opened</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>Print / Save PDF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Export CSV */}
              <div className="border border-gray-200 hover:border-gray-300 rounded p-4 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">Structured Table</span>
                  <h4 className="text-sm font-semibold text-gray-900">Export CSV Evidence Data</h4>
                  <p className="text-xs text-gray-500 font-sans leading-normal">
                    Maps each structural passage flag, category, severity rating, and system assessment explanation into standard CSV spreadsheet indexes.
                  </p>
                </div>
                <button
                  id="export-csv-btn"
                  type="button"
                  onClick={handleExportCsvFile}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-gray-200 rounded text-xs font-mono font-semibold transition-all hover:bg-gray-50 bg-white"
                  disabled={exportingType !== null}
                >
                  {exportingType === 'csv' ? (
                    <>
                      <Loader className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span>Compiling spreadsheet...</span>
                    </>
                  ) : exportSuccess['csv'] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold font-mono">CSV File Saved</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                      <span>Download .CSV Spreadsheet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Full clipboard dump */}
              <div className="border border-gray-200 hover:border-gray-300 rounded p-4 flex flex-col justify-between space-y-3 transition-all">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase font-semibold">System Dump</span>
                  <h4 className="text-sm font-semibold text-gray-900">Copy Entire Analytical File</h4>
                  <p className="text-xs text-gray-500 font-sans leading-normal">
                    Copies complete case diagnostics, executive evaluations, examined triggers list, and proposed administrative letters to your layout deck.
                  </p>
                </div>
                <button
                  id="export-copy-all-btn"
                  type="button"
                  onClick={handleCopyClipboard}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-gray-200 rounded text-xs font-mono font-semibold transition-all hover:bg-gray-50 bg-white"
                  disabled={exportingType !== null}
                >
                  {exportingType === 'copy' ? (
                    <>
                      <Loader className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span>Formatting plain text...</span>
                    </>
                  ) : exportSuccess['copy'] ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold font-mono font-medium">Copied File to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5 text-gray-500" />
                      <span>Copy Full Brief Text</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Export simulation feedback block */}
          {exportingType && (
            <div className="bg-indigo-950 text-indigo-200 border border-indigo-900 p-4 rounded-lg font-mono text-[11px] animate-pulse space-y-2">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider block">Local Compiler Logging</span>
              <code>
                System generating file assets...
                <br />
                Reading metadata registry title:「{metadata.title}」
                <br />
                Iterating {flaggedPassages?.length || 0} flagged lexical layers
                <br />
                Evaluating {evidentiaryIssues?.length || 0} evidence omissions
                <br />
                Output file format set: [.{exportingType.toUpperCase()}]
                <br />
                Compiles fully conforming to standard regulatory compliance structures.
              </code>
            </div>
          )}

        </div>

        {/* Export Parameter options */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Compilation Settings</span>
            </h3>

            <div className="space-y-3 pt-1">
              <label className="flex items-start cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeOriginalText}
                  onChange={(e) => setIncludeOriginalText(e.target.checked)}
                  className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 h-3.5 w-3.5 mt-0.5 shrink-0"
                />
                <div className="ml-3 font-sans text-xs">
                  <span className="font-semibold text-gray-950 block">Include Original Plaintext</span>
                  <span className="text-gray-500 block text-[11px]">Includes the complete submitted original text inside the legal dossier.</span>
                </div>
              </label>

              <label className="flex items-start cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeEvidenceTable}
                  onChange={(e) => setIncludeEvidenceTable(e.target.checked)}
                  className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 h-3.5 w-3.5 mt-0.5 shrink-0"
                />
                <div className="ml-3 font-sans text-xs">
                  <span className="font-semibold text-gray-950 block">Include Evidentiary Audit Grid</span>
                  <span className="text-gray-500 block text-[11px]">Includes systematic Layer evaluations, logical errors and action advice.</span>
                </div>
              </label>

              <label className="flex items-start cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeDraftComplaints}
                  onChange={(e) => setIncludeDraftComplaints(e.target.checked)}
                  className="rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 h-3.5 w-3.5 mt-0.5 shrink-0"
                />
                <div className="ml-3 font-sans text-xs">
                  <span className="font-semibold text-gray-950 block">Include suggested response letters</span>
                  <span className="text-gray-500 block text-[11px]">Appends formatted administrative drafts ready for review.</span>
                </div>
              </label>
            </div>
            
            <hr className="border-gray-150" />
            
            <div className="bg-gray-50 p-3 rounded text-[11px] font-mono text-gray-500 flex items-start space-x-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span>
                Export downloads run client-side. The PDF option will automatically open your system print dialog where you can save as a high-fidelity vector PDF.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
