export interface FormField {
  id: string;
  label: string;
  type: string;
}

export interface FormTemplate {
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: FormField[] }>;
}

export interface StoredForm {
  _id: string;
  title: string;
  description?: string;
  templateId?: string;
  isPublished?: boolean;
  publicId?: string;
  groupOrder?: string[];
  groupData?: Record<string, { label: string; fields: FormField[] }>;
  template?: unknown;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormUpsertPayload {
  title: string;
  description?: string;
  templateId?: string;
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: FormField[] }>;
}

export interface StoredSubmission {
  _id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
