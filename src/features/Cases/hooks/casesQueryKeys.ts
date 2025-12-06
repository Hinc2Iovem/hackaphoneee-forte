export const casesQK = {
  all: ["cases"] as const,
  detail: (id: string | null) => ["cases", "detail", id] as const,
  nextQuestion: (id: string | null) => ["cases", "next-question", id] as const,
  documents: (id: string | null) => ["cases", "documents", id] as const,

  documentVersions: (documentId: string | null) =>
    ["documents", documentId, "versions"] as const,
  document: (documentId: string | null) =>
    ["documents", documentId, "detail"] as const,
};
