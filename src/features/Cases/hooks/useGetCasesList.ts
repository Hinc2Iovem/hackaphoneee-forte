import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import type { CaseDetailTypes } from "@/types/CaseTypes";
import { casesQK } from "./casesQueryKeys";

export function useGetCasesList() {
  return useQuery<CaseDetailTypes[], Error>({
    queryKey: casesQK.all,
    queryFn: async () => {
      const res = await axiosCustomized.get<CaseDetailTypes[]>("/cases/");
      return res.data;
    },
  });
}
