export const CASE_INITIAL_QUESTIONS: {
  key: string;
  label: string;
  description?: string;
}[] = [
  { key: "idea", label: "1. Идея / цель проекта" },
  { key: "target_users", label: "2. Целевая аудитория" },
  {
    key: "problem",
    label: "3. Основные проблемы, которые решает проект",
  },
  {
    key: "ideal_flow",
    label: "4. Идеальный процесс (как должно быть в идеале)",
  },
  {
    key: "user_actions",
    label: "5. Действия пользователя в системе",
  },
  {
    key: "mvp",
    label: "6. MVP — что обязательно в первой версии",
  },
  {
    key: "constraints",
    label: "7. Ограничения и риски",
  },
  {
    key: "success_criteria",
    label: "8. Критерии успеха / ключевые метрики",
  },
];

export const ARTIFACTS = [
  { code: "brd", label: "BRD", icon: "description" },
  { code: "frd", label: "FRD", icon: "list_alt" },
  { code: "user_stories", label: "User Stories", icon: "style" },
  { code: "bpmn", label: "BPMN Diagram", icon: "account_tree" },
  { code: "use_case", label: "Use Case Diagram", icon: "group_add" },
  { code: "sequence", label: "Sequence Diagram", icon: "waterfall_chart" },
  { code: "kpi", label: "KPI List", icon: "monitoring" },
] as const;
