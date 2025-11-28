import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import type { EnsureDocumentsResponse } from "./useGetCaseDocuments";

type GeneratedDocumentFile = EnsureDocumentsResponse["files"][number];

type LlmEditPayload = {
  documentId: string;
  instructions: string;
};

export default function useLlmEditDocument() {
  return useMutation<GeneratedDocumentFile, Error, LlmEditPayload>({
    mutationFn: ({ documentId, instructions }) =>
      axiosCustomized
        .post<GeneratedDocumentFile>(`/documents/${documentId}/llm-edit/`, {
          instructions,
        })
        .then((res) => res.data),
  });
}
