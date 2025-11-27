export const CASE_INITIAL_QUESTIONS: {
  key: string;
  label: string;
  description?: string;
}[] = [
  {
    key: "idea",
    label: "1. Идея / цель проекта",
    description: "Что вы хотите запустить и какую бизнес-задачу решить.",
  },
  {
    key: "target_users",
    label: "2. Целевая аудитория",
    description:
      "Кто основные пользователи/клиенты: сегменты, портрет, потребности.",
  },
  {
    key: "problem",
    label: "3. Основные проблемы, которые решает проект",
    description: "Боли клиентов и бизнеса, которые закрывает решение.",
  },
  {
    key: "ideal_flow",
    label: "4. Идеальный процесс (как должно быть в идеале)",
    description:
      "Как выглядит целевой процесс «как должно быть» без ограничений.",
  },
  {
    key: "user_actions",
    label: "5. Действия пользователя в системе",
    description: "Что именно делает пользователь шаг за шагом в продукте.",
  },
  {
    key: "mvp",
    label: "6. MVP — что обязательно в первой версии",
    description:
      "Минимально необходимый функционал, без которого запуск не имеет смысла.",
  },
  {
    key: "constraints",
    label: "7. Ограничения и риски",
    description: "Сроки, бюджеты, технологии, зависимости и ключевые риски.",
  },
  {
    key: "success_criteria",
    label: "8. Критерии успеха / ключевые метрики",
    description: "Как поймём, что проект успешен: метрики и целевые значения.",
  },
];

export type ArtifactGroup = "document" | "diagram";
export const ARTIFACTS = [
  {
    code: "vision",
    label: "Vision / Problem Statement",
    icon: "lightbulb",
    group: "document" as const,
    description:
      "Краткое описание текущей проблемы и целевого видения решения.",
  },
  {
    code: "scope",
    label: "Scope (In/Out)",
    icon: "center_focus_strong",
    group: "document" as const,
    description:
      "Границы проекта: что входит в реализацию, а что остаётся за рамками.",
  },
  {
    code: "brd",
    label: "Business Requirements (BRD)",
    icon: "description",
    group: "document" as const,
    description:
      "Формализованные бизнес-требования и цели проекта с точки зрения бизнеса.",
  },
  {
    code: "user_stories",
    label: "User Stories + Acceptance Criteria",
    icon: "menu_book",
    group: "document" as const,
    description:
      "User stories с критериями приёмки для разработки и тестирования.",
  },
  {
    code: "use_cases",
    label: "Use Cases",
    icon: "group",
    group: "document" as const,
    description: "Сценарии использования системы пользователями шаг за шагом.",
  },
  {
    code: "nfr",
    label: "NFR (Non-Functional Requirements)",
    icon: "tune",
    group: "document" as const,
    description:
      "Нефункциональные требования: производительность, безопасность, надёжность и т.п.",
  },
  {
    code: "data_dictionary",
    label: "Data Dictionary",
    icon: "storage",
    group: "document" as const,
    description:
      "Справочник основных сущностей и полей данных, их значения и связи.",
  },
  {
    code: "integration_api_spec",
    label: "Integration / API Spec",
    icon: "hub",
    group: "document" as const,
    description:
      "Описание интеграций и API: точки, форматы, протоколы и ответы.",
  },
  {
    code: "uat_scenarios",
    label: "UAT / Test Scenarios",
    icon: "task_alt",
    group: "document" as const,
    description:
      "Сценарии пользовательского приёмочного тестирования и критерии успеха.",
  },

  {
    code: "bpmn",
    label: "BPMN (AS-IS / TO-BE)",
    icon: "account_tree",
    group: "diagram" as const,
    description:
      "Бизнес-процесс в нотации BPMN: текущее и целевое состояние (AS-IS / TO-BE).",
  },
  {
    code: "context_diagram",
    label: "Context Diagram (C4 Context)",
    icon: "public",
    group: "diagram" as const,
    description:
      "Контекстная диаграмма уровня системы: пользователи и внешние системы.",
  },
  {
    code: "sequence_diagram",
    label: "Sequence Diagram",
    icon: "timeline",
    group: "diagram" as const,
    description:
      "Диаграмма последовательности взаимодействий между участниками/системами.",
  },
  {
    code: "uml_use_case_diagram",
    label: "UML Use Case Diagram",
    icon: "groups_2",
    group: "diagram" as const,
    description: "UML-диаграмма вариантов использования и акторов системы.",
  },
  {
    code: "erd",
    label: "ERD",
    icon: "schema",
    group: "diagram" as const,
    description:
      "Диаграмма сущность-связь (ERD) с основными таблицами/сущностями и связями.",
  },
  {
    code: "state_diagram",
    label: "State Diagram",
    icon: "change_circle",
    group: "diagram" as const,
    description:
      "Диаграмма состояний: как объект/заказ/заявка переходит между состояниями.",
  },
] as const;

export type Artifact = (typeof ARTIFACTS)[number];

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

export const ARTIFACT_META: Record<
  Artifact["code"],
  { icon: string; label: string }
> = {
  vision: { icon: "lightbulb", label: "Vision / Problem Statement" },
  scope: { icon: "center_focus_strong", label: "Scope (In/Out)" },
  brd: { icon: "description", label: "Business Requirements (BRD)" },
  user_stories: {
    icon: "menu_book",
    label: "User Stories + Acceptance Criteria",
  },
  use_cases: { icon: "group", label: "Use Cases" },
  nfr: { icon: "tune", label: "NFR" },
  data_dictionary: { icon: "storage", label: "Data Dictionary" },
  integration_api_spec: { icon: "hub", label: "Integration / API Spec" },
  uat_scenarios: { icon: "task_alt", label: "UAT / Test Scenarios" },

  bpmn: { icon: "account_tree", label: "BPMN (AS-IS / TO-BE)" },
  context_diagram: { icon: "public", label: "Context Diagram" },
  sequence_diagram: { icon: "timeline", label: "Sequence Diagram" },
  uml_use_case_diagram: { icon: "groups_2", label: "UML Use Case Diagram" },
  erd: { icon: "schema", label: "ERD" },
  state_diagram: { icon: "change_circle", label: "State Diagram" },
};
