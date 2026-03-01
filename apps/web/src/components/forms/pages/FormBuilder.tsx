import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { FaArrowLeft, FaSave, FaPlus, FaEye, FaLink } from "react-icons/fa";
import { Alert, Button, Input, Modal, Popover, StateMessage } from "@repo/ui";
import { Field, Group } from "../components";
import { getFormById, publishForm, updateForm } from "../api";
import { openFormPreview, type TemplateType } from "../utils";
import type { FormField, FormTemplate } from "../model";
import "./FormBuilder.scss";

const EMPTY_TEMPLATE: FormTemplate = {
  groupOrder: [],
  groupData: {},
};

const isFormTemplate = (value: unknown): value is FormTemplate => {
  if (!value || typeof value !== "object") return false;
  const template = value as Record<string, unknown>;
  return Array.isArray(template.groupOrder) && !!template.groupData && typeof template.groupData === "object";
};

const isTemplateType = (value: unknown): value is TemplateType => {
  return value === "modern" || value === "minimal" || value === "classic";
};

const FormBuilder = () => {
  const navigate = useNavigate();
  const { formId } = useParams<{ formId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishLink, setPublishLink] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  const [groupOrder, setGroupOrder] = useState<string[]>([]);
  const [groupData, setGroupData] = useState<Record<string, { label: string; fields: FormField[] }>>({});

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupKey, setNewGroupKey] = useState("");

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        setError("Form id is missing.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const form = await getFormById(formId);
        setTitle(form.title);
        setDescription(form.description ?? "");
        setSelectedTemplate(isTemplateType(form.templateId) ? form.templateId : "modern");
        setIsPublished(Boolean(form.isPublished));

        if (form.isPublished && form.publicId) {
          setPublishLink(`${window.location.origin}/forms/public/${form.publicId}`);
        } else {
          setPublishLink(null);
        }

        if (Array.isArray(form.groupOrder) && form.groupData && typeof form.groupData === "object") {
          setGroupOrder(form.groupOrder);
          setGroupData(form.groupData);
        } else if (isFormTemplate(form.template)) {
          setGroupOrder(form.template.groupOrder);
          setGroupData(form.template.groupData);
        } else {
          setGroupOrder(EMPTY_TEMPLATE.groupOrder);
          setGroupData(EMPTY_TEMPLATE.groupData);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load form");
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const saveForm = async () => {
    if (!formId) return;
    if (!title.trim() || !description.trim()) {
      setError("Form title and description are required.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateForm(formId, {
        title: title.trim(),
        description: description.trim(),
        groupOrder,
        groupData,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formId) return;
    if (isPublished) return;

    setIsPublishing(true);

    try {
      const result = await publishForm(formId);
      const link = `${window.location.origin}${result.sharePath}`;
      setPublishLink(link);
      setIsPublished(true);
      setIsPublishModalOpen(true);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Unable to publish form");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyPublishLink = async () => {
    if (!publishLink) return;
    try {
      await navigator.clipboard.writeText(publishLink);
      setError(null);
    } catch {
      setError("Unable to copy link. Please copy manually.");
    }
  };

  const openPublishLink = () => {
    if (!publishLink) return;
    window.open(publishLink, "_blank", "noopener,noreferrer");
  };

  const generateKeyFromLabel = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const handleLabelChange = (value: string) => {
    setNewGroupName(value);
    if (newGroupKey === "" || newGroupKey === generateKeyFromLabel(newGroupName)) {
      setNewGroupKey(generateKeyFromLabel(value));
    }
  };

  const handleKeyChange = (value: string) => {
    const sanitized = value.replace(/[^a-z0-9_]/g, "");
    setNewGroupKey(sanitized);
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim() || !newGroupKey.trim()) return;
    if (groupData[newGroupKey]) {
      alert("Group key already exists. Please use a different key.");
      return;
    }

    setGroupData((prev) => ({
      ...prev,
      [newGroupKey]: { label: newGroupName.trim(), fields: [] },
    }));
    setGroupOrder((prev) => [...prev, newGroupKey]);
    setNewGroupName("");
    setNewGroupKey("");
    return true;
  };

  if (isLoading) {
    return <StateMessage className="form-builder-loading">Loading form...</StateMessage>;
  }

  if (error && !title) {
    return <Alert variant="error" className="form-builder-error">{error}</Alert>;
  }

  return (
    <div className="form-builder-container">
      <div className="form-builder-header">
        <h1>Form Builder</h1>
        <div className="header-actions">
          <Button icon={<FaArrowLeft />} onClick={() => navigate("/forms")}>Back</Button>
          <Popover trigger={<Button icon={<FaPlus />}>Add Group</Button>} position="bottom">
            {(close) => (
              <div className="group-popover-content">
                <Input
                  label="Group Label"
                  type="text"
                  value={newGroupName}
                  onChange={(event) => handleLabelChange(event.target.value)}
                  placeholder="e.g., Personal Details"
                  autoFocus
                />
                <Input
                  label="Group Key"
                  type="text"
                  value={newGroupKey}
                  onChange={(event) => handleKeyChange(event.target.value)}
                  placeholder="e.g., personal_details"
                />
                <Button
                  onClick={() => {
                    if (handleAddGroup()) {
                      close();
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            )}
          </Popover>
          <Button
            icon={<FaEye />}
            onClick={() => {
              openFormPreview({ groupOrder, groupData });
              const previewParams = new URLSearchParams({
                template: selectedTemplate,
                ...(formId ? { formId } : {}),
              });
              navigate(`/forms/preview?${previewParams.toString()}`);
            }}
          >
            Preview
          </Button>
          <Button icon={<FaSave />} onClick={saveForm} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {isPublished && publishLink ? (
            <Button icon={<FaLink />} onClick={openPublishLink}>
              Published Link
            </Button>
          ) : (
            <Button icon={<FaLink />} onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </div>

      {error && <Alert variant="error" className="form-builder-error">{error}</Alert>}

      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Form Published"
        footer={(
          <div className="publish-modal-footer">
            <Button onClick={() => setIsPublishModalOpen(false)}>Close</Button>
            <Button onClick={openPublishLink} disabled={!publishLink}>Open Link</Button>
          </div>
        )}
      >
        <div className="publish-modal-content">
          <p>Your form is published. Share this link:</p>
          <div className="publish-link-row">
            <input value={publishLink ?? ""} readOnly />
            <Button onClick={copyPublishLink} disabled={!publishLink}>Copy</Button>
          </div>
        </div>
      </Modal>

      <div className="form-metadata-card">
        <Input
          label="Form Title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g., Employee Onboarding"
        />
        <div className="description-field">
          <label htmlFor="builder-form-description">Form Description</label>
          <textarea
            id="builder-form-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Why are end users filling this form?"
            rows={3}
          />
        </div>
      </div>

      <div className="forms-list">
        <DragDropProvider
          onDragOver={(event) => {
            const active = event.operation.source;

            if (active?.type === "item") {
              setGroupData((prev) => {
                const fieldsByGroup = Object.fromEntries(
                  Object.entries(prev).map(([groupId, data]) => [groupId, data.fields]),
                );

                const moved = move(fieldsByGroup, event);

                return Object.fromEntries(
                  Object.entries(prev).map(([groupId, data]) => [
                    groupId,
                    {
                      ...data,
                      fields: moved[groupId] ?? [],
                    },
                  ]),
                );
              });
            }
          }}
          onDragEnd={(event) => {
            const active = event.operation.source;
            const over = event.operation.target;
            if (!active || !over) return;

            if (active.type === "group") {
              const activeId = String(active.id);
              const overIdRaw = String(over.id);
              const overId = overIdRaw.startsWith("group-drop-")
                ? overIdRaw.replace("group-drop-", "")
                : overIdRaw;

              if (activeId === overId) return;

              setGroupOrder((prev) => {
                const oldIndex = prev.indexOf(activeId);
                const newIndex = prev.indexOf(overId);

                if (oldIndex === -1 || newIndex === -1) return prev;

                const updated = [...prev];
                const [removed] = updated.splice(oldIndex, 1);
                if (!removed) return prev;
                updated.splice(newIndex, 0, removed);

                return updated;
              });
            }
          }}
        >
          <div className="drag-drop-container">
            {groupOrder.map((groupId) => (
              <Group
                key={groupId}
                id={groupId}
                label={groupData[groupId]?.label ?? groupId}
                onDelete={() => {
                  setGroupOrder((prev) => prev.filter((id) => id !== groupId));
                  setGroupData((prev) => {
                    const next = { ...prev };
                    delete next[groupId];
                    return next;
                  });
                }}
                onUpdateLabel={(newLabel) => {
                  setGroupData((prev) => ({
                    ...prev,
                    [groupId]: {
                      label: newLabel,
                      fields: prev[groupId]?.fields ?? [],
                    },
                  }));
                }}
                onAddField={(fieldType, fieldLabel) => {
                  const currentFields = groupData[groupId]?.fields ?? [];
                  const sanitizedLabel = fieldLabel
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "_")
                    .replace(/^_+|_+$/g, "");

                  const newField: FormField = {
                    id: `${sanitizedLabel}-${fieldType}-${currentFields.length}`,
                    label: fieldLabel,
                    type: fieldType,
                  };

                  setGroupData((prev) => ({
                    ...prev,
                    [groupId]: {
                      label: prev[groupId]?.label ?? groupId,
                      fields: [...(prev[groupId]?.fields ?? []), newField],
                    },
                  }));
                }}
              >
                {(groupData[groupId]?.fields ?? []).map((field, index) => (
                  <Field
                    key={field.id}
                    field={field}
                    index={index}
                    column={groupId}
                    onUpdateField={(updatedField) => {
                      setGroupData((prev) => {
                        const currentFields = prev[groupId]?.fields ?? [];
                        const updatedFields = currentFields.map((currentField) =>
                          currentField.id === field.id ? updatedField : currentField,
                        );

                        return {
                          ...prev,
                          [groupId]: {
                            label: prev[groupId]?.label ?? groupId,
                            fields: updatedFields,
                          },
                        };
                      });
                    }}
                    onDeleteField={() => {
                      setGroupData((prev) => {
                        const currentFields = prev[groupId]?.fields ?? [];
                        const updatedFields = currentFields.filter((currentField) => currentField.id !== field.id);

                        return {
                          ...prev,
                          [groupId]: {
                            label: prev[groupId]?.label ?? groupId,
                            fields: updatedFields,
                          },
                        };
                      });
                    }}
                  />
                ))}
              </Group>
            ))}
          </div>
        </DragDropProvider>
      </div>
    </div>
  );
};

export default FormBuilder;
