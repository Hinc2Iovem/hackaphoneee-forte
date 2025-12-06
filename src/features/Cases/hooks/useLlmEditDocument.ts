import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import type { EnsureDocumentsResponse } from "./useGetCaseDocuments";
import { casesQK } from "./casesQueryKeys";

type GeneratedDocumentFile = EnsureDocumentsResponse["files"][number];

type LlmEditPayload = {
  documentId: string;
  instructions: string;
};

export default function useLlmEditDocument() {
  const queryClient = useQueryClient();

  return useMutation<GeneratedDocumentFile, Error, LlmEditPayload>({
    mutationFn: ({ documentId, instructions }) =>
      axiosCustomized
        .post<GeneratedDocumentFile>(`/documents/${documentId}/llm-edit/`, {
          instructions,
        })
        .then((res) => res.data),
    onSuccess: (doc, variables) => {
      queryClient.invalidateQueries({
        queryKey: casesQK.documents(doc.id || null),
      });

      queryClient.invalidateQueries({
        queryKey: casesQK.documentVersions(variables.documentId),
      });
    },
  });
}
