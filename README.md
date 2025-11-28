# Talap AI – Frontend

Talap AI is a web-frontend for an **AI Business Analyst assistant** used inside a bank.

The system helps internal teams (product owners, business customers, analysts) to:

- Conduct a structured dialog about a business task.
- Collect and formalize business requirements.
- Automatically generate business documents and analytical artifacts.

> Backend is a separate service that exposes REST APIs for cases, follow-up questions and generated documents (scope / vision docs, BPMN diagrams, etc.).

---

## Problem & Idea

**Задача (кратко на русском):**

> Разработать AI-агента, выполняющего функции бизнес-аналитика.  
> Агент ведёт диалог с сотрудниками в формате чат-бота, уточняет контекст, собирает и структурирует бизнес-требования, автоматически формирует документы (цели, описание, scope, бизнес-правила, KPI) и генерирует аналитические артефакты: Use Case, диаграммы процессов, user stories, лидирующие индикаторы.

Веб-интерфейс Talap AI даёт удобный фронт для этого агента: пошаговое создание кейса, уточняющий диалог и просмотр / согласование артефактов.

---

## Roles & Permissions

The app currently supports **three roles**:

### 1. Authority

- Main purpose: **user management** (creation / administration of users).
- All business features (case creation, chat, artifact review) are **blocked**.
- Typically used by administrators or “authority” representatives.

### 2. Client

- Anyone who **needs help from a Business Analyst**.
- Main capabilities:
  - Create a new **case** (describe business situation / problem).
  - Go through initial questionnaire (step 1–2 wizard).
  - Participate in the **follow-up chat** with the AI Assistant.
  - Review generated documents and diagrams.
  - **Accept / decline** generated documents (e.g. scope, vision, BPMN).
- Routes are generally under `/client/...` (see `HK_ROUTES`).

### 3. Business Analyst (BA)

- Internal **Business Analyst** or expert user.
- Main capabilities:
  - View client’s initial answers and follow-up dialog in a read-only mode.
  - Review generated artifacts and **approve / reject** each document.
  - Upload a **manual version of the document** (DOCX/PDF) instead of the generated one.
  - Use AI chat (in future) to refine / regenerate parts of the document.
- Routes are generally under `/analytic/...` (see `HK_ROUTES`).

---

## Tech Stack

This is a **React + Vite + TypeScript** single-page application.

- **Core**

  - [React 19](https://react.dev/)
  - [React DOM](https://react.dev/reference/react-dom)
  - [React Router DOM 7](https://reactrouter.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite (rolldown-vite)](https://vitejs.dev/) as a dev server & bundler

- **Styling & UI**

  - [Tailwind CSS v4](https://tailwindcss.com/)
  - `tw-animate-css` for simple animations
  - Radix UI primitives:
    - `@radix-ui/react-dialog`
    - `@radix-ui/react-tooltip`
    - `@radix-ui/react-alert-dialog`
    - `@radix-ui/react-dropdown-menu`
    - `@radix-ui/react-select`
  - [lucide-react](https://lucide.dev/) icons
  - [next-themes](https://github.com/pacocoursey/next-themes) for dark/light theme handling
  - `tailwind-merge` & `class-variance-authority` for class composition

- **State, Data & Validation**

  - [Zustand](https://github.com/pmndrs/zustand) for local/global app state
  - [@tanstack/react-query](https://tanstack.com/query/latest) for server state & caching
  - [Axios](https://axios-http.com/) for HTTP requests
  - [Zod](https://zod.dev/) for runtime validation & schemas

- **UX Utilities**

  - [sonner](https://sonner.emilkowal.ski/) for toasts / notifications
  - `env-var` for environment variable handling

- **Tooling / DX**
  - ESLint 9 + `@typescript-eslint` + `eslint-plugin-react`, `eslint-plugin-react-hooks`
  - Vite ESLint plugin (`vite-plugin-eslint`)

---

## Getting Started

### Prerequisites

- **Bun** ≥ 1.x (recommended)
- Backend API running and accessible (see `VITE_API_BASE_URL`)

### 1. Install dependencies

```bash
bun install
```
