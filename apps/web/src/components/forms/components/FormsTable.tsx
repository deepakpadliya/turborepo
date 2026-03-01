import { useMemo, useState } from "react";
import { FaDatabase, FaLink, FaPen, FaTrash } from "react-icons/fa";
import { Dropdown, Input, IconButton, StateMessage, Table } from "@repo/ui";
import type { StoredForm } from "../model";

interface FormsTableProps {
  forms: StoredForm[];
  loading: boolean;
  deletingFormId: string | null;
  onEdit: (formId: string) => void;
  onViewData: (formId: string) => void;
  onDelete: (formId: string) => void;
}

const FormsTable = ({ forms, loading, deletingFormId, onEdit, onViewData, onDelete }: FormsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const handleOpenPublishedForm = (publicId: string) => {
    window.open(`/forms/public/${publicId}`, "_blank", "noopener,noreferrer");
  };

  const filteredForms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return forms.filter((form) => {
      const statusMatches =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
            ? !!form.isPublished
            : !form.isPublished;

      if (!statusMatches) return false;
      if (!normalizedSearch) return true;

      const title = form.title?.toLowerCase() ?? "";
      const description = form.description?.toLowerCase() ?? "";
      return title.includes(normalizedSearch) || description.includes(normalizedSearch);
    });
  }, [forms, searchTerm, statusFilter]);

  if (loading) {
    return <StateMessage className="forms-empty-state">Loading forms...</StateMessage>;
  }

  if (forms.length === 0) {
    return <StateMessage className="forms-empty-state">No forms found. Create your first form.</StateMessage>;
  }

  return (
    <div className="forms-table-wrapper">
      <div className="forms-table-controls">
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title or description"
          aria-label="Search forms"
        />
        <Dropdown
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "published" | "draft")}
          aria-label="Filter forms by status"
          options={[
            { label: "All", value: "all" },
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
          ]}
        />
      </div>

      {filteredForms.length === 0 ? (
        <StateMessage className="forms-empty-state">No forms match your current search/filter.</StateMessage>
      ) : null}

      <Table className="forms-table">
        <Table.Head>
          <Table.Row>
            <Table.HeadCell className="actions-head">Actions</Table.HeadCell>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Updated</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {filteredForms.map((form) => (
            <Table.Row key={form._id}>
              <Table.Cell className="actions-cell">
                <div className="table-actions">
                  <IconButton
                    icon={<FaDatabase />}
                    onClick={() => onViewData(form._id)}
                    aria-label={`View submitted data for ${form.title}`}
                    title="View data"
                  />
                  <IconButton
                    icon={<FaPen />}
                    onClick={() => onEdit(form._id)}
                    aria-label={`Edit ${form.title}`}
                    title="Edit"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    variant="danger"
                    onClick={() => onDelete(form._id)}
                    disabled={deletingFormId === form._id}
                    aria-label={`Delete ${form.title}`}
                    title="Delete"
                  />
                  {form.isPublished && form.publicId ? (
                    <IconButton
                      icon={<FaLink />}
                      onClick={() => handleOpenPublishedForm(form.publicId as string)}
                      aria-label={`Open published form for ${form.title}`}
                      title="Open published link"
                    />
                  ) : null}
                </div>
              </Table.Cell>
              <Table.Cell>{form.title}</Table.Cell>
              <Table.Cell>{form.description || "-"}</Table.Cell>
              <Table.Cell>{form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "-"}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default FormsTable;
