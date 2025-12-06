import { axiosCustomized } from "@/api/axios";
import type { GeneratedDocument } from "@/types/ArtifactTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { casesQK } from "./casesQueryKeys";

export interface UseVersionPayload {
  versionId?: string;
  version?: number;
}

export function useUseDocumentVersion(documentId: string) {
  const queryClient = useQueryClient();

  return useMutation<GeneratedDocument, Error, UseVersionPayload>({
    mutationFn: async (payload) => {
      const body: any = {};
      if (payload.versionId) body.version_id = payload.versionId;
      if (payload.version) body.version = payload.version;

      const res = await axiosCustomized.post<GeneratedDocument>(
        `/documents/${documentId}/use-version/`,
        body
      );
      return res.data;
    },
    onSuccess: (updatedDoc) => {
      queryClient.invalidateQueries({
        queryKey: casesQK.documents(updatedDoc.case),
      });

      queryClient.invalidateQueries({
        queryKey: casesQK.document(updatedDoc.id),
      });

      queryClient.invalidateQueries({
        queryKey: casesQK.documentVersions(documentId),
      });
    },
    onSettled: (updatedDoc) => {
      queryClient.invalidateQueries({
        queryKey: casesQK.documents(updatedDoc?.case || null),
      });

      queryClient.invalidateQueries({
        queryKey: casesQK.document(updatedDoc?.id || null),
      });

      queryClient.invalidateQueries({
        queryKey: casesQK.documentVersions(documentId),
      });
    },
  });
}
