import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";
import type { CaseDetailTypes } from "@/types/CaseTypes";

type ExtraOptions = {
  enabled?: boolean;
};

export function useGetCaseDetail(
  caseId?: string | null,
  options?: ExtraOptions
) {
  const enabled = !!caseId && (options?.enabled ?? true);

  return useQuery<CaseDetailTypes, Error>({
    queryKey: casesQK.detail(caseId ?? null),
    enabled,
    queryFn: async () => {
      const res = await axiosCustomized.get<CaseDetailTypes>(
        `/cases/${caseId}/`
      );
      return res.data;
    },
  });
}
