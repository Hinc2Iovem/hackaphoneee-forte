import { axiosCustomized } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import type { GeneratedDocumentFile } from "./useGetCaseDocuments";

export default function useUploadDocx(documentId?: string) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosCustomized.post(
        `/documents/${documentId}/upload-docx/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data as GeneratedDocumentFile;
    },
  });
}
