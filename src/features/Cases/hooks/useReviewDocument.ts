import type { DocumentStatusVariation } from "@/features/Artifacts/mock-data";
import type { GeneratedDocumentFile } from "./useGetCaseDocuments";
import { axiosCustomized } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

export default function useReviewDocument(documentId?: string) {
  return useMutation({
    mutationFn: async (status: DocumentStatusVariation) => {
      const res = await axiosCustomized.patch(
        `/documents/${documentId}/review/`,
        {
          status,
        }
      );
      return res.data as GeneratedDocumentFile;
    },
  });
}
