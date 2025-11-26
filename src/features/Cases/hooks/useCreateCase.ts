import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import type {
  CaseSessionCreateRequest,
  CaseSessionCreateResponse,
} from "@/types/CaseTypes";

export function useCreateCase() {
  return useMutation({
    mutationFn: async (payload: CaseSessionCreateRequest) => {
      const res = await axiosCustomized.post<CaseSessionCreateResponse>(
        "/cases/",
        payload
      );
      return res.data;
    },
  });
}
