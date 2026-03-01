import type { FormEvent } from "react";
import { Button } from "@repo/ui";
import FormFieldInput from "./FormFieldInput";
import "../pages/PublicFormPage.scss";

interface FormField {
  id: string;
  label: string;
  type: string;
  options?: string[];
}

interface FormPreviewProps {
  groupOrder: string[];
  groupData: Record<string, { label: string; fields: FormField[] }>;
  template?: "modern" | "minimal" | "classic";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export const FormPreviewComponent = ({
  groupOrder,
  groupData,
  template = "modern",
  onSubmit,
}: FormPreviewProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <div className={`public-form-page template-${template}`}>
      <div className="public-form-card">
        <h1>Form Preview</h1>
        <p>This preview matches the published template style.</p>

        <form onSubmit={handleSubmit}>
          {groupOrder.length === 0 ? (
            <div className="public-form-state">No form groups created yet.</div>
          ) : (
            groupOrder.map((groupId) => {
              const group = groupData[groupId];
              if (!group) return null;

              return (
                <section key={groupId} className="public-group">
                  <h2>{group.label}</h2>

                  {(group.fields ?? []).length === 0 ? (
                    <div className="public-form-state">No fields in this group.</div>
                  ) : (
                    <div className="public-fields">
                      {(group.fields ?? []).map((field) => {
                        const fieldName = field.id || `${groupId}_${field.label}`;

                        return (
                          <label key={fieldName} className="public-field">
                            <span>{field.label}</span>
                            <FormFieldInput
                              fieldType={field.type}
                              name={fieldName}
                              label={field.label}
                              rows={4}
                              options={field.options}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })
          )}

          <div className="submit-row">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreviewComponent;
