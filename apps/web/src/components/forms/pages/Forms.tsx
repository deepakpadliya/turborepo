import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
import { Alert, Button } from "@repo/ui";
import { CreateFormModal, FormsTable } from "../components";
import { deleteFormById, listForms } from "../api";
import type { StoredForm } from "../model";

import "./Forms.scss";

const Forms = () => {
  const navigate = useNavigate();
  const [savedForms, setSavedForms] = useState<StoredForm[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const [formsError, setFormsError] = useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchForms = async () => {
    setFormsLoading(true);
    setFormsError(null);

    try {
      const forms = await listForms();
      setSavedForms(forms);
    } catch (error) {
      setFormsError(error instanceof Error ? error.message : "Unable to load forms");
    } finally {
      setFormsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDeleteForm = async (formId: string) => {
    const selected = savedForms.find((form) => form._id === formId);
    const formName = selected?.title ?? "this form";
    const confirmed = window.confirm(`Delete ${formName}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingFormId(formId);
    setFormsError(null);

    try {
      await deleteFormById(formId);
      await fetchForms();
    } catch (deleteError) {
      setFormsError(deleteError instanceof Error ? deleteError.message : "Unable to delete form");
    } finally {
      setDeletingFormId(null);
    }
  };

  return (
    <div className="forms-container">
      <div className="forms-header">
        <h1>Forms</h1>
        <div className="header-actions">
          <Button icon={<FaPlus />} onClick={() => setIsCreateModalOpen(true)}>
            Create New Form
          </Button>
          <Button onClick={fetchForms} disabled={formsLoading}>
            {formsLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {formsError && <Alert variant="error" className="forms-error">{formsError}</Alert>}

      <FormsTable
        forms={savedForms}
        loading={formsLoading}
        deletingFormId={deletingFormId}
        onEdit={(formId) => navigate(`/forms/builder/${formId}`)}
        onViewData={(formId) => navigate(`/forms/data?formId=${formId}`)}
        onDelete={handleDeleteForm}
      />

      <CreateFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(createdForm) => {
          setIsCreateModalOpen(false);
          navigate(`/forms/builder/${createdForm._id}`);
        }}
      />
    </div>
  );
};

export default Forms;