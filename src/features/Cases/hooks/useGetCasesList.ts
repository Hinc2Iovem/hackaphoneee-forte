import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import type { CaseDetailTypes } from "@/types/CaseTypes";

export function useGetCasesList() {
  return useQuery<CaseDetailTypes[], Error>({
    queryKey: ["cases", "list"],
    queryFn: async () => {
      const res = await axiosCustomized.get<CaseDetailTypes[]>("/cases/");
      return res.data;
    },
  });
}
