import { axiosCustomized } from "@/api/axios";
import type { DocumentStatusVariation } from "@/features/Artifacts/mock-data";
import { useMutation } from "@tanstack/react-query";

export interface CaseDocument {
  id: string;
  title: string;
  status: DocumentStatusVariation | null;
}

export interface CaseDocumentsResponse {
  documents: CaseDocument[];
  errors: string[];
  did_generate_any: boolean;
}

export function useGenerateCaseDocuments(caseId?: string | null) {
  return useMutation<CaseDocumentsResponse, Error>({
    mutationKey: ["cases", caseId, "documents", "generate"],
    mutationFn: async () => {
      if (!caseId) throw new Error("caseId is required");
      const res = await axiosCustomized.post<CaseDocumentsResponse>(
        `/cases/${caseId}/documents/`
      );
      return res.data;
    },
  });
}
