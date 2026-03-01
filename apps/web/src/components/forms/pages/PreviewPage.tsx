import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';
import { Alert, Button } from '@repo/ui';
import { updateFormTemplate } from '../api';
import { getPreviewData, type TemplateType } from '../utils';
import { FormPreviewComponent } from '../components';
import './PreviewPage.scss';

interface FormField {
  id: string;
  label: string;
  type: string;
}

interface FormData {
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: FormField[] }>;
}

const PreviewPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [loading, setLoading] = useState(true);
  const [formId, setFormId] = useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveError, setTemplateSaveError] = useState<string | null>(null);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Get template from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const template = searchParams.get('template') as TemplateType;
    if (template) {
      setSelectedTemplate(template);
    }

    const previewFormId = searchParams.get('formId');
    setFormId(previewFormId);

    // Get form data from sessionStorage
    const data = getPreviewData();
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  }, []);

  const handleSaveTemplate = async () => {
    if (!formId) return;

    setIsSavingTemplate(true);
    setTemplateSaveError(null);
    setTemplateSaveSuccess(null);

    try {
      await updateFormTemplate(formId, selectedTemplate);
      setTemplateSaveSuccess('Template saved successfully.');
    } catch (saveError) {
      setTemplateSaveError(saveError instanceof Error ? saveError.message : 'Unable to save template');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  if (loading) {
    return <div className="preview-loading">Loading...</div>;
  }

  if (!formData) {
    return (
      <div className="preview-error">
        <h1>No Form Data</h1>
        <p>Form data not found. Please open preview from the Forms page.</p>
      </div>
    );
  }

  return (
    <div className="preview-page-wrapper">
      <div className="template-selector">
        <button
          className="back-btn"
          onClick={() => navigate('/forms')}
          aria-label="Go back to forms"
        >
          <FaArrowLeft /> Back
        </button>
        <label>Select Template:</label>
        <div className="template-buttons">
          <button
            className={`template-btn ${selectedTemplate === 'modern' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTemplate('modern');
              setTemplateSaveError(null);
              setTemplateSaveSuccess(null);
            }}
          >
            Modern
          </button>
          <button
            className={`template-btn ${selectedTemplate === 'minimal' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTemplate('minimal');
              setTemplateSaveError(null);
              setTemplateSaveSuccess(null);
            }}
          >
            Minimal
          </button>
          <button
            className={`template-btn ${selectedTemplate === 'classic' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTemplate('classic');
              setTemplateSaveError(null);
              setTemplateSaveSuccess(null);
            }}
          >
            Classic
          </button>
        </div>
        {formId ? (
          <Button onClick={handleSaveTemplate} disabled={isSavingTemplate}>
            {isSavingTemplate ? 'Saving...' : 'Save'}
          </Button>
        ) : null}
        {templateSaveError ? <Alert variant="error">{templateSaveError}</Alert> : null}
        {templateSaveSuccess ? <Alert variant="success">{templateSaveSuccess}</Alert> : null}
      </div>

      <div className="preview-content">
        <FormPreviewComponent
          groupOrder={formData.groupOrder}
          groupData={formData.groupData}
          template={selectedTemplate}
          onSubmit={(e: React.FormEvent) => {
            const formElement = e.currentTarget as HTMLFormElement;
            const formDataEntries = new FormData(formElement);
            const data = Object.fromEntries(formDataEntries);
            alert('Form Data (check console):\n' + JSON.stringify(data, null, 2));
            console.log('Form submitted:', data);
          }}
        />
      </div>
    </div>
  );
};

export default PreviewPage;
