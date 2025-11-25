export type CaseStatusVariation =
  | "draft"
  | "in_progress"
  | "ready_for_documents"
  | "documents_generated";

export interface FollowupQuestionTypes {
  id: string;
  order_index: number;
  code: string | null;
  text: string;
  target_document_types: string[] | null;
  status: "pending" | "answered" | "skipped";
  answer_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseDetailTypes {
  id: string;
  title: string;
  status: CaseStatusVariation;
  requester_name: string | null;
  initial_answers: Record<string, string> | null;
  selected_document_types: string[] | null;
  created_at: string;
  updated_at: string;
  followup_questions: FollowupQuestionTypes[];
}

export interface CaseSessionTypes {
  id: string;
  title: string;
  requester_name: string | null;
  status: CaseStatusVariation;
  created_at: string;
  updated_at: string;
}

export interface NextQuestionResponseTypes {
  question_id: string | null;
  order_index: number | null;
  total_questions: number;
  text: string | null;
  target_document_types: string[];
  is_finished: boolean;
}
