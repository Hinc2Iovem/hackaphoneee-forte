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

export const INITIAL_ANSWER_LABELS: Record<string, string> = {
  idea: "Идея / цель проекта",
  target_users: "Целевая аудитория",
  problem: "Основные проблемы, которые решает проект",
  ideal_flow: "Идеальный процесс (как должно быть в идеале)",
  user_actions: "Действия пользователя в системе",
  mvp: "MVP — что обязательно в первой версии",
  constraints: "Ограничения и риски",
  success_criteria: "Критерии успеха / ключевые метрики",
};

export const ARTIFACT_META: Record<string, { icon: string; label: string }> = {
  brd: {
    icon: "description",
    label: "BRD — бизнес-требования",
  },
  bpmn: {
    icon: "device_hub",
    label: "BPMN-диаграмма процесса",
  },
  kpi: {
    icon: "monitoring",
    label: "KPI / метрики",
  },
  use_case: {
    icon: "account_tree",
    label: "Use-case сценарии",
  },
  frd: {
    icon: "dataset",
    label: "FRD — функциональные требования",
  },
  user_stories: {
    icon: "menu_book",
    label: "User stories",
  },
  sequence: {
    icon: "timeline",
    label: "Диаграмма последовательности",
  },
};
