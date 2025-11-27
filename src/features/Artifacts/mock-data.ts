import type { CaseDetailTypes } from "@/types/CaseTypes";

export type ArtifactGenerationStatus = "accepted" | "rejected" | "pending";

export interface GeneratedArtifact {
  id: string;
  title: string;
  typeCode: string;
  status: ArtifactGenerationStatus;
  content: string;
}

export const MOCK_CASE: CaseDetailTypes = {
  id: "case-1",
  title: "Анализ кредитного риска для МСБ",
  status: "documents_generated",
  requester_name: "Клиент",
  initial_answers: null,
  selected_document_types: ["brd", "uml_use_case_diagram", "user_stories"],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  followup_questions: [],
};

export const MOCK_GENERATED_ARTIFACTS: GeneratedArtifact[] = [
  {
    id: "doc-1",
    title: "Бизнес Требования Документ",
    typeCode: "brd",
    status: "accepted",
    content: `Бизнес-требования к модулю анализа кредитного риска для МСБ

1. Цель и обоснование
Цель инициативы — внедрить модуль анализа кредитного риска для сегмента МСБ...

2. Область применения (Scope)
2.1 В рамках проекта
- Расчёт риск-оценки (score) по заявке МСБ...
- Присвоение класса риска...
- Формирование рекомендации по решению...

2.2 Вне рамок (Out of Scope)
- Полная автоматизация кредитного решения без участия сотрудника банка...
`,
  },
  {
    id: "doc-2",
    title: "UML Use Case Диаграмма",
    typeCode: "uml_use_case_diagram",
    status: "rejected",
    content:
      "Текстовое описание для UML Use Case диаграммы. Здесь может быть ссылка или расшифровка диаграммы.",
  },
  {
    id: "doc-3",
    title: "User Stories + Acceptance Criteria",
    typeCode: "user_stories",
    status: "pending",
    content:
      "Список user stories с критериями приёмки, сформированный на основе ответов на вопросы.",
  },
];
