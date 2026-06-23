import { communicationTypes } from "../communicationContext";
import type { TextLensMetadata } from "../types";
import { getAnalysisModeLabel } from "./modeLabels";

export interface SourceContextField {
  label: string;
  value: string;
}

function pushField(fields: SourceContextField[], label: string, value?: string | null) {
  if (!value) return;
  const normalized = value.toString().trim();
  if (!normalized) return;
  fields.push({ label, value: normalized });
}

export function getSourceContextFields(metadata: TextLensMetadata): SourceContextField[] {
  const fields: SourceContextField[] = [];
  const communicationTypeLabel = communicationTypes.find(
    (item) => item.id === metadata.communicationType
  )?.label;

  pushField(fields, "Analysis Mode", getAnalysisModeLabel(metadata.analysisMode));
  pushField(fields, "Document Title", metadata.title);
  pushField(fields, "Author / Speaker / Source", metadata.author);
  pushField(fields, "Platform / Network", metadata.platform);
  pushField(fields, "Publication / Broadcast Date", metadata.date);
  pushField(fields, "Source URL", metadata.url);
  pushField(fields, "Content / Text Type", metadata.textType);
  pushField(fields, "Jurisdiction", metadata.jurisdiction);
  pushField(fields, "Communication Type", communicationTypeLabel);

  if (metadata.analysisMode === "consumer" && metadata.publicationProminenceTier) {
    pushField(
      fields,
      "Publication Prominence",
      `Tier ${metadata.publicationProminenceTier}`
    );
  }

  if (metadata.analysisMode === "bccsa") {
    pushField(fields, "Broadcaster", metadata.broadcaster);
    pushField(fields, "Channel", metadata.channel);
    pushField(fields, "Programme Name", metadata.programmeName);
    pushField(fields, "Broadcast Date / Time", metadata.broadcastDateTime);
    pushField(fields, "Watershed Context", metadata.watershedContext);
    if (typeof metadata.transcriptAvailable === "boolean") {
      pushField(
        fields,
        "Transcript Available",
        metadata.transcriptAvailable ? "Yes" : "No"
      );
    }
    pushField(fields, "Alleged Harm / Breach", metadata.allegedHarm);
  }

  if (metadata.analysisMode === "healthcare") {
    pushField(fields, "Journal / Publication", metadata.journalOrPublication);
    pushField(fields, "Article Type", metadata.articleType);
    pushField(fields, "DOI / PMID", metadata.doiOrPmid);
    pushField(fields, "Author Affiliation", metadata.authorAffiliation);
  }

  return fields;
}
