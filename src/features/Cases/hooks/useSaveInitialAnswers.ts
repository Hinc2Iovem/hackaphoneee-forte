import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";
import type {
  CaseDetailTypes,
  CaseInitialAnswersPayload,
} from "@/types/CaseTypes";

export function useSaveInitialAnswers(caseId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CaseInitialAnswersPayload) => {
      if (!caseId) {
        throw new Error("caseId is required");
      }
      const res = await axiosCustomized.put<CaseDetailTypes>(
        `/cases/${caseId}/initial-answers/`,
        payload
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(casesQK.detail(data.id), data);
    },
  });
}
