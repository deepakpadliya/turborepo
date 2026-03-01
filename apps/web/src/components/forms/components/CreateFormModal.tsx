import { useEffect, useState } from "react";
import { Alert, Button, Input, Modal } from "@repo/ui";
import { createForm } from "../api";
import type { StoredForm } from "../model";

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (form: StoredForm) => void;
}

const CreateFormModal = ({ isOpen, onClose, onCreated }: CreateFormModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setError(null);
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Form title and description are required.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const created = await createForm({
        title: title.trim(),
        description: description.trim(),
        templateId: "modern",
        groupOrder: [],
        groupData: {},
      });

      onCreated(created);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create form");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Form"
      footer={(
        <div className="create-form-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </div>
      )}
    >
      <div className="create-form-modal-content">
        {error && <Alert variant="error" className="create-form-error">{error}</Alert>}
        <Input
          label="Form Title"
          type="text"
          value={title}
          onChange={(event) => {
            setError(null);
            setTitle(event.target.value);
          }}
          placeholder="e.g., Employee Onboarding"
          autoFocus
        />
        <div className="description-field">
          <label htmlFor="new-form-description">Form Description</label>
          <textarea
            id="new-form-description"
            value={description}
            onChange={(event) => {
              setError(null);
              setDescription(event.target.value);
            }}
            placeholder="Why are end users creating this form?"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateFormModal;
