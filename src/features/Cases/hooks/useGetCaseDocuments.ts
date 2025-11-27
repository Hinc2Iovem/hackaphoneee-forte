import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";
import type {
  DocumentStatusVariation,
  DocumetGenerationVariation,
} from "@/features/Artifacts/mock-data";

export type ArtifactGenerationStatus = "accepted" | "rejected" | "pending";

export interface GeneratedArtifact {
  id: string;
  title: string;
  status: DocumentStatusVariation;
}

export interface GeneratedDocumentFile {
  id: string;
  doc_type: string;
  title: string;

  status: DocumentStatusVariation;

  generation_status: DocumetGenerationVariation;

  docx_url: string | null;
  docx_path: string | null;

  diagram_url: string | null;
  diagram_path: string | null;
}

export interface EnsureDocumentsResponse {
  case_id: string;
  case_title: string;
  did_generate_any: boolean;
  errors: Record<string, unknown>;
  files: GeneratedDocumentFile[];
}

type ExtraOptions = {
  enabled?: boolean;
};

export function useEnsureCaseDocuments(
  caseId?: string | null,
  options?: ExtraOptions
) {
  const enabled = !!caseId && (options?.enabled ?? true);

  return useQuery<EnsureDocumentsResponse, Error>({
    queryKey: casesQK.documents(caseId ?? null),
    enabled,
    queryFn: async () => {
      const res = await axiosCustomized.get<EnsureDocumentsResponse>(
        `/cases/${caseId}/documents/`
      );
      return res.data;
    },
  });
}
