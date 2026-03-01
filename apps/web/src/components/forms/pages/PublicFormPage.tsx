import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router";
import { Alert, Button, StateMessage } from "@repo/ui";
import { getPublicForm, submitPublicForm, type PublicFormResponse } from "../api";
import { FormFieldInput } from "../components";
import "./PublicFormPage.scss";

const PublicFormPage = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [form, setForm] = useState<PublicFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!publicId) {
        setError("Invalid public form link.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const response = await getPublicForm(publicId);
        setForm(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load public form");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [publicId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicId) return;

    const formElement = event.currentTarget;
    const rawData = new FormData(formElement);
    const data: Record<string, unknown> = {};

    rawData.forEach((value, key) => {
      if (data[key] !== undefined) {
        const currentValue = data[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(value);
          data[key] = currentValue;
        } else {
          data[key] = [currentValue, value];
        }
      } else {
        data[key] = value;
      }
    });

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await submitPublicForm(publicId, data);
      setSuccessMessage("Form submitted successfully.");
      formElement.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <StateMessage className="public-form-state">Loading form...</StateMessage>;
  }

  if (error && !form) {
    return <StateMessage tone="error" className="public-form-state error">{error}</StateMessage>;
  }

  if (!form) {
    return <StateMessage tone="error" className="public-form-state error">Form not found.</StateMessage>;
  }

  const resolvedTemplate = form.templateId === "minimal" || form.templateId === "classic" ? form.templateId : "modern";

  return (
    <div className={`public-form-page template-${resolvedTemplate}`}>
      <div className="public-form-card">
        <h1>{form.title}</h1>
        {form.description && <p>{form.description}</p>}

        {error && <Alert variant="error" className="public-form-alert error">{error}</Alert>}
        {successMessage && <Alert variant="success" className="public-form-alert success">{successMessage}</Alert>}

        <form onSubmit={onSubmit}>
          {form.groupOrder.map((groupId) => {
            const group = form.groupData[groupId];
            if (!group) return null;

            return (
              <section key={groupId} className="public-group">
                <h2>{group.label}</h2>
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
              </section>
            );
          })}

          <div className="submit-row">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicFormPage;
