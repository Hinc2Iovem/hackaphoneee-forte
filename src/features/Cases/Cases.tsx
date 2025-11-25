import type { CaseDetailTypes } from "@/types/CaseTypes";
import { CaseListTable } from "./components/CaseListTable";

const mockCases: CaseDetailTypes[] = [
  {
    id: "mock-1",
    title: "Анализ оттока клиентов по кредитным картам",
    requester_name: "Иванов Иван",
    status: "documents_generated",
    initial_answers: null,
    selected_document_types: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    followup_questions: [],
  },
];

export function CasesPage() {
  return <CaseListTable cases={mockCases} />;
}
