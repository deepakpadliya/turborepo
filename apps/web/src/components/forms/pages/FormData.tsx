import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { FaPen, FaTrash } from 'react-icons/fa';
import { Alert, Button, Dropdown, IconButton, Input, StateMessage, Table } from '@repo/ui';
import { deleteSubmissionById, getFormById, listSubmissionsByForm, submitFormById, updateSubmissionById } from '../api';
import { FormFieldInput } from '../components';
import type { FormTemplate, StoredForm, StoredSubmission } from '../model';
import './FormData.scss';

const EMPTY_TEMPLATE: FormTemplate = {
  groupOrder: [],
  groupData: {},
};

const isFormTemplate = (value: unknown): value is FormTemplate => {
  if (!value || typeof value !== 'object') return false;
  const template = value as Record<string, unknown>;
  return Array.isArray(template.groupOrder) && !!template.groupData && typeof template.groupData === 'object';
};

const normalizeFieldValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map((item) => String(item)).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const normalizeDateValue = (value: string): string => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return '';
  return parsedDate.toISOString().slice(0, 10);
};

const getBlankValues = (
  groupOrder: string[],
  groupData: Record<string, { label: string; fields: Array<{ id: string; label: string; type: string }> }>,
): Record<string, string> => {
  const blankValues: Record<string, string> = {};

  groupOrder.forEach((groupId) => {
    const group = groupData[groupId];
    (group?.fields ?? []).forEach((field) => {
      const fieldName = field.id || `${groupId}_${field.label}`;
      blankValues[fieldName] = '';
    });
  });

  return blankValues;
};

const FormData = () => {
  const [searchParams] = useSearchParams();
  const formId = searchParams.get('formId');

  const [form, setForm] = useState<StoredForm | null>(null);
  const [groupOrder, setGroupOrder] = useState<string[]>([]);
  const [groupData, setGroupData] = useState<Record<string, { label: string; fields: Array<{ id: string; label: string; type: string }> }>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [submittedBy, setSubmittedBy] = useState('');
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedByFilter, setSubmittedByFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tableFields = useMemo(() => {
    return groupOrder.flatMap((groupId) => {
      const group = groupData[groupId];
      if (!group) return [] as Array<{ key: string; label: string }>;

      return (group.fields ?? []).map((field) => {
        const key = field.id || `${groupId}_${field.label}`;
        return {
          key,
          label: `${group.label}: ${field.label}`,
        };
      });
    });
  }, [groupOrder, groupData]);

  const submittedByOptions = useMemo(() => {
    const values = new Set<string>();

    submissions.forEach((submission) => {
      const submittedByValue = (submission.submittedBy ?? '').trim();
      values.add(submittedByValue || '-');
    });

    return [
      { label: 'All submitters', value: 'all' },
      ...Array.from(values)
        .sort((left, right) => left.localeCompare(right))
        .map((value) => ({ label: value, value })),
    ];
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return submissions.filter((submission) => {
      const submittedByValue = (submission.submittedBy ?? '').trim() || '-';
      if (submittedByFilter !== 'all' && submittedByValue !== submittedByFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableValues = [
        submittedByValue,
        submission.createdAt ? new Date(submission.createdAt).toLocaleString() : '',
        ...tableFields.map((field) => normalizeFieldValue(submission.data?.[field.key])),
      ];

      return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [submissions, submittedByFilter, searchTerm, tableFields]);

  useEffect(() => {
    const loadData = async () => {
      if (!formId) {
        setError('Select a form first to view submissions.');
        setForm(null);
        setGroupOrder([]);
        setGroupData({});
        setFormValues({});
        setSubmissions([]);
        setSelectedSubmissionId('');
        setIsEditorOpen(false);
        setSubmittedBy('');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const [loadedForm, existingSubmissions] = await Promise.all([
          getFormById(formId),
          listSubmissionsByForm(formId),
        ]);

        setForm(loadedForm);
        setSubmissions(existingSubmissions);

        if (Array.isArray(loadedForm.groupOrder) && loadedForm.groupData && typeof loadedForm.groupData === 'object') {
          setGroupOrder(loadedForm.groupOrder);
          setGroupData(loadedForm.groupData);

          setFormValues(getBlankValues(loadedForm.groupOrder, loadedForm.groupData));
        } else if (isFormTemplate(loadedForm.template)) {
          const template = loadedForm.template;
          setGroupOrder(template.groupOrder);
          setGroupData(template.groupData);

          setFormValues(getBlankValues(template.groupOrder, template.groupData));
        } else {
          setGroupOrder(EMPTY_TEMPLATE.groupOrder);
          setGroupData(EMPTY_TEMPLATE.groupData);
          setFormValues({});
        }

        setSelectedSubmissionId('');
        setSubmittedBy('');
        setIsEditorOpen(false);
        setSearchTerm('');
        setSubmittedByFilter('all');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load form');
        setForm(null);
        setGroupOrder([]);
        setGroupData({});
        setFormValues({});
        setSubmissions([]);
        setSelectedSubmissionId('');
        setIsEditorOpen(false);
        setSubmittedBy('');
        setSearchTerm('');
        setSubmittedByFilter('all');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [formId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formId) return;

    const data: Record<string, unknown> = {};
    Object.entries(formValues).forEach(([key, value]) => {
      data[key] = value;
    });

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (selectedSubmissionId) {
        await updateSubmissionById(selectedSubmissionId, {
          data,
          submittedBy: submittedBy.trim() || undefined,
        });
        setSuccessMessage('Submission updated successfully.');
      } else {
        await submitFormById(formId, data, submittedBy.trim() || undefined);
        setSuccessMessage('Form data saved successfully.');
      }

      const refreshedSubmissions = await listSubmissionsByForm(formId);
      setSubmissions(refreshedSubmissions);
      setIsEditorOpen(false);
      setSelectedSubmissionId('');

      const blankValues = getBlankValues(groupOrder, groupData);
      setFormValues(blankValues);
      setSubmittedBy('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save form data');
    } finally {
      setSubmitting(false);
    }
  };

  const openNewEntry = () => {
    const blankValues = getBlankValues(groupOrder, groupData);
    setSelectedSubmissionId('');
    setFormValues(blankValues);
    setSubmittedBy('');
    setIsEditorOpen(true);
    setSuccessMessage(null);
    setError(null);
  };

  const openEditorForSubmission = (submission: StoredSubmission) => {
    const selectedSubmission = submissions.find((item) => item._id === submission._id);
    if (!selectedSubmission) return;

    const nextValues = getBlankValues(groupOrder, groupData);
    Object.entries(selectedSubmission.data ?? {}).forEach(([key, value]) => {
      nextValues[key] = normalizeFieldValue(value);
    });

    setSelectedSubmissionId(selectedSubmission._id);
    setFormValues(nextValues);
    setSubmittedBy(selectedSubmission.submittedBy ?? '');
    setIsEditorOpen(true);
    setSuccessMessage(null);
    setError(null);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedSubmissionId('');
  };

  const handleDeleteSubmission = async (submission: StoredSubmission) => {
    if (!formId) return;

    const confirmed = window.confirm('Delete this submission? This cannot be undone.');
    if (!confirmed) return;

    setDeletingSubmissionId(submission._id);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteSubmissionById(submission._id);
      const refreshedSubmissions = await listSubmissionsByForm(formId);
      setSubmissions(refreshedSubmissions);
      setSuccessMessage('Submission deleted successfully.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete submission');
    } finally {
      setDeletingSubmissionId(null);
    }
  };

  return (
    <div className="form-data-container">
      <h1>Form Data</h1>
      <p>{form?.title ? `Submissions for: ${form.title}` : 'Select a form first to view submissions.'}</p>
      {error ? <Alert variant="error" className="form-data-error">{error}</Alert> : null}

      {successMessage ? <Alert variant="success" className="form-data-success">{successMessage}</Alert> : null}

      {loading ? (
        <StateMessage className="form-data-state">Loading form...</StateMessage>
      ) : !form ? (
        <StateMessage className="form-data-state">Form not found.</StateMessage>
      ) : !isEditorOpen ? (
        <div className="form-data-card">
          <div className="submissions-header">
            <h2>Submitted Entries</h2>
            <Button onClick={openNewEntry}>New Entry</Button>
          </div>

          {submissions.length === 0 ? (
            <StateMessage className="form-data-state">No submissions yet.</StateMessage>
          ) : (
            <div className="submissions-table-wrapper">
              <div className="submissions-table-controls">
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search submissions"
                  aria-label="Search submissions"
                />
                <Dropdown
                  value={submittedByFilter}
                  onChange={(event) => setSubmittedByFilter(event.target.value)}
                  aria-label="Filter submissions by submitter"
                  options={submittedByOptions}
                />
              </div>

              {filteredSubmissions.length === 0 ? (
                <StateMessage className="form-data-state">No submissions match your current search/filter.</StateMessage>
              ) : null}

              <Table className="submissions-table">
                <Table.Head>
                  <Table.Row>
                    <Table.HeadCell className="actions-head">Actions</Table.HeadCell>
                    <Table.HeadCell>Submitted By</Table.HeadCell>
                    <Table.HeadCell>Submitted At</Table.HeadCell>
                    {tableFields.map((field) => (
                      <Table.HeadCell key={field.key}>{field.label}</Table.HeadCell>
                    ))}
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {filteredSubmissions.map((submission) => (
                    <Table.Row key={submission._id}>
                      <Table.Cell className="actions-cell">
                        <div className="table-actions">
                          <IconButton
                            icon={<FaPen />}
                            onClick={() => openEditorForSubmission(submission)}
                            aria-label="Edit submission"
                            title="Edit"
                          />
                          <IconButton
                            icon={<FaTrash />}
                            variant="danger"
                            onClick={() => handleDeleteSubmission(submission)}
                            disabled={deletingSubmissionId === submission._id}
                            aria-label="Delete submission"
                            title={deletingSubmissionId === submission._id ? 'Deleting...' : 'Delete'}
                          />
                        </div>
                      </Table.Cell>
                      <Table.Cell>{submission.submittedBy || '-'}</Table.Cell>
                      <Table.Cell>{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : '-'}</Table.Cell>
                      {tableFields.map((field) => {
                        const fieldValue = submission.data?.[field.key];
                        return (
                          <Table.Cell key={field.key} className="submission-cell">
                            {normalizeFieldValue(fieldValue) || '-'}
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      ) : (
        <div className="form-data-card">
          <form onSubmit={onSubmit}>
            <h2>{selectedSubmissionId ? 'Edit Submission' : 'New Submission'}</h2>

            <label className="backend-field">
              <span>Submitted By (optional)</span>
              <input
                type="text"
                name="__submittedBy"
                value={submittedBy}
                onChange={(event) => setSubmittedBy(event.target.value)}
              />
            </label>

            {groupOrder.map((groupId) => {
              const group = groupData[groupId];
              if (!group) return null;

              return (
                <section key={groupId} className="backend-group">
                  <h2>{group.label}</h2>
                  <div className="backend-fields">
                    {(group.fields ?? []).map((field) => {
                      const fieldName = field.id || `${groupId}_${field.label}`;

                      return (
                        <label key={fieldName} className="backend-field">
                          <span>{field.label}</span>
                          <FormFieldInput
                            fieldType={field.type}
                            name={fieldName}
                            label={field.label}
                            value={field.type === 'date' ? normalizeDateValue(formValues[fieldName] ?? '') : formValues[fieldName] ?? ''}
                            rows={4}
                            onChange={(event) =>
                              setFormValues((prev) => ({
                                ...prev,
                                [fieldName]: event.target.value,
                              }))
                            }
                            options={(field as { options?: string[] }).options}
                          />
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <div className="form-data-submit-row">
              <Button type="button" onClick={closeEditor} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : selectedSubmissionId ? 'Update Data' : 'Save Data'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormData;
