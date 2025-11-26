import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";
import type { NextQuestionResponse } from "@/types/CaseTypes";

export function useGetNextFollowupQuestion(caseId?: string | null) {
  return useQuery<NextQuestionResponse, Error>({
    queryKey: casesQK.nextQuestion(caseId ?? null),
    enabled: !!caseId,
    queryFn: async () => {
      const res = await axiosCustomized.get<NextQuestionResponse>(
        `/cases/${caseId}/next-question/`
      );
      return res.data;
    },
  });
}
