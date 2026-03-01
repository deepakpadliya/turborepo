interface FormField {
  id: string;
  label: string;
  type: string;
}

interface FormData {
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: FormField[] }>;
}

export type TemplateType = 'modern' | 'minimal' | 'classic';

const PREVIEW_DATA_KEY = 'form_preview_data';

export const storePreviewData = (data: FormData): void => {
  sessionStorage.setItem(PREVIEW_DATA_KEY, JSON.stringify(data));
};

export const getPreviewData = (): FormData | null => {
  const data = sessionStorage.getItem(PREVIEW_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const openFormPreview = (data: FormData): void => {
  // Store the form data in sessionStorage
  storePreviewData(data);
};
