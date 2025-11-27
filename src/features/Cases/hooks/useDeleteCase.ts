import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";
import { casesQK } from "./casesQueryKeys";

export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosCustomized.delete(`/cases/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casesQK.all });
    },
  });
}
