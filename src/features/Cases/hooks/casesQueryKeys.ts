export const casesQK = {
  all: ["cases"] as const,
  detail: (id: string | null) => ["cases", "detail", id] as const,
  nextQuestion: (id: string | null) => ["cases", "next-question", id] as const,
};
