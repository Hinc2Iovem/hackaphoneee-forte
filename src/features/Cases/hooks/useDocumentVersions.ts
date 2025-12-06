import type { DocumentVersion } from "@/types/ArtifactTypes";
import { useQuery } from "@tanstack/react-query";
import { casesQK } from "./casesQueryKeys";
import { axiosCustomized } from "@/api/axios";

type ExtraOptions = {
  enabled?: boolean;
};

export function useDocumentVersions(
  documentId?: string | null,
  options?: ExtraOptions
) {
  const enabled = !!documentId && (options?.enabled ?? true);

  return useQuery<DocumentVersion[], Error>({
    queryKey: casesQK.documentVersions(documentId ?? null),
    enabled,
    queryFn: async () => {
      const res = await axiosCustomized.get<DocumentVersion[]>(
        `/documents/${documentId}/versions/`
      );
      return res.data;
    },
  });
}
