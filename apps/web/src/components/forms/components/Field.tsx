import { useSortable } from '@dnd-kit/react/sortable';
import { FaGripVertical, FaPen, FaCheck, FaTimes, FaTrash, FaFont, FaEnvelope, FaHashtag, FaList, FaDotCircle, FaCheckSquare, FaCalendar, FaFileAlt } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useState } from 'react';
import './Field.scss';

interface FormField {
  id: string;
  label: string;
  type: string;
}

interface FieldProps {
  field: FormField;
  column: string;
  index: number;
  onUpdateField?: (updatedField: FormField) => void;
  onDeleteField?: () => void;
}

interface FieldTypeConfig {
  icon: IconType;
  label: string;
  color: string;
}

const fieldTypeConfig: Record<string, FieldTypeConfig> = {
  text: { icon: FaFont, label: 'Text Field', color: '#667eea' },
  email: { icon: FaEnvelope, label: 'Email', color: '#764ba2' },
  number: { icon: FaHashtag, label: 'Number', color: '#f093fb' },
  dropdown: { icon: FaList, label: 'Dropdown', color: '#4facfe' },
  radio: { icon: FaDotCircle, label: 'Radio', color: '#43e97b' },
  checkbox: { icon: FaCheckSquare, label: 'Checkbox', color: '#fa709a' },
  date: { icon: FaCalendar, label: 'Date', color: '#30cfd0' },
  textarea: { icon: FaFileAlt, label: 'Textarea', color: '#a8edea' },
};

function Field({ field, column, index, onUpdateField, onDeleteField }: FieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.label);

  const { ref, isDragging } = useSortable({
    id: field.id,
    index,
    group: column,
    type: 'item',
    accept: ['item'],
  });

  const handleSave = () => {
    if (editValue.trim() && editValue !== field.label) {
      const updatedField: FormField = {
        ...field,
        label: editValue,
      };
      onUpdateField?.(updatedField);
    }
    setIsEditing(false);
    setEditValue(field.label);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(field.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div ref={ref} className={`field-item ${isDragging ? 'dragging' : ''}`}>
      <div className="field-content">
        {isEditing ? (
          <>
            <input
              type="text"
              className="field-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Enter field name"
            />
            <div className="field-actions">
              <button
                className="field-action-btn save-btn"
                onClick={handleSave}
                title="Save"
              >
                <FaCheck />
              </button>
              <button
                className="field-action-btn cancel-btn"
                onClick={handleCancel}
                title="Cancel"
              >
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="field-label-wrapper">
              {(() => {
                const config = fieldTypeConfig[field.type];
                const IconComponent = config?.icon || FaFont;
                return (
                  <div className="field-type-badge" style={{ background: config?.color || '#667eea' }}>
                    <IconComponent style={{ fontSize: '12px' }} />
                  </div>
                );
              })()}
              <span className="field-label">{field.label}</span>
            </div>
            <div className="field-actions">
              <button
                className="field-action-btn edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setEditValue(field.label);
                }}
                title="Edit field"
              >
                <FaPen />
              </button>
              <button
                className="field-action-btn delete-btn"
                onClick={onDeleteField}
                title="Delete field"
              >
                <FaTrash />
              </button>
              <FaGripVertical className="field-icon drag-handle" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Field;