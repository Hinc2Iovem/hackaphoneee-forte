import type {
  DocumentStatusVariation,
  DocumetGenerationVariation,
} from "@/features/Artifacts/mock-data";

export interface DocumentVersion {
  id: string;
  version: number;
  title: string;
  created_at: string;
  reason: string | null;
}

export interface GeneratedDocument {
  id: string;
  case: string;
  doc_type: string;
  title: string;
  content: string;
  structured_data: unknown;
  status: DocumentStatusVariation;
  generation_status: DocumetGenerationVariation;
  llm_model: string | null;
  prompt_version: string | null;
  prompt_hash: string | null;
  source_snapshot_hash: string | null;
  error_message: string | null;
  docx_file: string | null;
  docx_url: string | null;
  docx_generated_at: string | null;
  diagram_url: string | null;
  created_at: string;
  updated_at: string;
}
