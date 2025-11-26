import { axiosCustomized } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { casesQK } from "./casesQueryKeys";
import type { CaseDetailTypes } from "@/types/CaseTypes";

type UpdateCasePayload = {
  id: string;
  data: Partial<Pick<CaseDetailTypes, "title">>;
};

export function useUpdateCase() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCasePayload) => {
      const res = await axiosCustomized.patch<CaseDetailTypes>(
        `/cases/${id}/`,
        data
      );
      return res.data;
    },
    onSuccess: (updated) => {
      qc.setQueryData(casesQK.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: casesQK.all });
    },
  });
}
