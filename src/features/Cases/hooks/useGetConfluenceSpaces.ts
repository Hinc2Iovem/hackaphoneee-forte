import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "@/api/axios";

export interface ConfluenceSpace {
  key: string;
  name: string;
}

interface Confluence {
  spaces: ConfluenceSpace[];
}

export function useGetConfluenceSpaces() {
  return useQuery({
    queryKey: ["confluence-spaces"],
    queryFn: async () => {
      const res = await axiosCustomized.get<Confluence>("/confluence/spaces/");
      return res.data.spaces;
    },
    staleTime: 5 * 60 * 1000,
  });
}
