import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";
import type { AnswerQuestionPayload } from "@/types/CaseTypes";

export function useGetAnswerFollowupQuestion(caseId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AnswerQuestionPayload) => {
      if (!caseId) {
        throw new Error("caseId is required");
      }
      await axiosCustomized.post(`/cases/${caseId}/answer-question/`, payload);
    },
    onSuccess: () => {
      if (!caseId) return;
      queryClient.invalidateQueries({ queryKey: casesQK.nextQuestion(caseId) });
      queryClient.invalidateQueries({ queryKey: casesQK.detail(caseId) });
    },
  });
}
