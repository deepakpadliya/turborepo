import type { FormUpsertPayload, StoredForm, StoredSubmission } from "../model";

const API_BASE_URL =
  (import.meta.env.VITE_API_SERVICE_URL as string | undefined)?.replace(/\/+$/, "") ??
  "http://localhost:3002";

const parseError = async (response: Response): Promise<string> => {
  let errorMessage = `Request failed (${response.status})`;
  try {
    const apiError = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(apiError.message) && apiError.message.length > 0) {
      errorMessage = apiError.message.join(", ");
    } else if (typeof apiError.message === "string" && apiError.message) {
      errorMessage = apiError.message;
    } else if (typeof apiError.error === "string" && apiError.error) {
      errorMessage = apiError.error;
    }
  } catch {
    // fallback kept
  }

  return errorMessage;
};

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return (await response.json()) as T;
};

export const listForms = async (): Promise<StoredForm[]> => {
  return request<StoredForm[]>(`${API_BASE_URL}/forms`);
};

export const getFormById = async (formId: string): Promise<StoredForm> => {
  return request<StoredForm>(`${API_BASE_URL}/forms/${formId}`);
};

export const createForm = async (payload: FormUpsertPayload): Promise<StoredForm> => {
  return request<StoredForm>(`${API_BASE_URL}/forms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const updateForm = async (formId: string, payload: FormUpsertPayload): Promise<StoredForm> => {
  return request<StoredForm>(`${API_BASE_URL}/forms/${formId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const updateFormTemplate = async (formId: string, templateId: string): Promise<StoredForm> => {
  return request<StoredForm>(`${API_BASE_URL}/forms/${formId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId }),
  });
};

export const deleteFormById = async (formId: string): Promise<void> => {
  await request<{ message: string }>(`${API_BASE_URL}/forms/${formId}`, {
    method: "DELETE",
  });
};

export interface PublishFormResponse {
  formId: string;
  publicId: string;
  sharePath: string;
  isPublished: boolean;
}

export interface PublicFormResponse {
  publicId: string;
  title: string;
  description?: string;
  templateId?: string;
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: Array<{ id: string; label: string; type: string; options?: string[] }> }>;
}

export const publishForm = async (formId: string): Promise<PublishFormResponse> => {
  return request<PublishFormResponse>(`${API_BASE_URL}/forms/${formId}/publish`, {
    method: "POST",
  });
};

export const getPublicForm = async (publicId: string): Promise<PublicFormResponse> => {
  return request<PublicFormResponse>(`${API_BASE_URL}/forms/public/${publicId}`);
};

export const submitPublicForm = async (
  publicId: string,
  data: Record<string, unknown>,
  submittedBy?: string,
): Promise<void> => {
  await request(`${API_BASE_URL}/forms/public/${publicId}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, submittedBy }),
  });
};

export const submitFormById = async (
  formId: string,
  data: Record<string, unknown>,
  submittedBy?: string,
): Promise<void> => {
  await request(`${API_BASE_URL}/forms/${formId}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, submittedBy }),
  });
};

export const listSubmissionsByForm = async (formId: string): Promise<StoredSubmission[]> => {
  return request<StoredSubmission[]>(`${API_BASE_URL}/forms/${formId}/submissions`);
};

export const updateSubmissionById = async (
  submissionId: string,
  payload: { data: Record<string, unknown>; submittedBy?: string },
): Promise<StoredSubmission> => {
  return request<StoredSubmission>(`${API_BASE_URL}/forms/submissions/${submissionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

export const deleteSubmissionById = async (submissionId: string): Promise<void> => {
  await request<{ message: string }>(`${API_BASE_URL}/forms/submissions/${submissionId}`, {
    method: "DELETE",
  });
};
