import { useDroppable, useDraggable } from '@dnd-kit/react';
import { Button, Input, Popover } from '@repo/ui';
import { FaTrash, FaPen, FaCheck, FaPlus, FaFont, FaEnvelope, FaHashtag, FaList, FaDotCircle, FaCheckSquare, FaCalendar, FaFileAlt } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { useState } from 'react';
import './Group.scss';

interface GroupProps {
  children: React.ReactNode;
  id: string;
  label: string;
  onDelete: () => void;
  onUpdateLabel: (newLabel: string) => void;
  onAddField: (fieldType: string, fieldLabel: string) => void;
}

function Group({ children, id, label, onDelete, onUpdateLabel, onAddField }: GroupProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [selectedFieldType, setSelectedFieldType] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState('');

  const fieldTypes: Array<{ name: string; type: string; icon: IconType; color: string }> = [
    { name: 'Text Field', type: 'text', icon: FaFont, color: '#667eea' },
    { name: 'Email', type: 'email', icon: FaEnvelope, color: '#764ba2' },
    { name: 'Number', type: 'number', icon: FaHashtag, color: '#f093fb' },
    { name: 'Dropdown', type: 'dropdown', icon: FaList, color: '#4facfe' },
    { name: 'Radio', type: 'radio', icon: FaDotCircle, color: '#43e97b' },
    { name: 'Checkbox', type: 'checkbox', icon: FaCheckSquare, color: '#fa709a' },
    { name: 'Date', type: 'date', icon: FaCalendar, color: '#30cfd0' },
    { name: 'Textarea', type: 'textarea', icon: FaFileAlt, color: '#a8edea' },
  ];

  const handleSaveLabel = () => {
    if (editValue.trim()) {
      onUpdateLabel(editValue);
      setIsEditing(false);
    } else {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(label);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveLabel();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCreateFieldWithLabel = (close: () => void) => {
    if (fieldLabel.trim() && selectedFieldType) {
      onAddField(selectedFieldType, fieldLabel.trim());
      setSelectedFieldType(null);
      setFieldLabel('');
      close();
    }
  };

  const handleFieldLabelKeyDown = (e: React.KeyboardEvent, close: () => void) => {
    if (e.key === 'Enter') {
      handleCreateFieldWithLabel(close);
    } else if (e.key === 'Escape') {
      setSelectedFieldType(null);
      setFieldLabel('');
    }
  };

  const getFieldTypeName = (typeKey: string): string => {
    return fieldTypes.find((f) => f.type === typeKey)?.name || typeKey;
  };

  const { ref: groupDropRef } = useDroppable({
    id: `group-drop-${id}`,
    type: 'group',
    accept: ['group'],
  });

  // 🔵 Field drop zone (ONLY for fields)
  const { ref: fieldDropRef } = useDroppable({
    id,
    type: 'column',
    accept: ['item'],
  });

  // 🟢 Group draggable
  const {
    ref: dragRef,
    handleRef,
    isDragging,
  } = useDraggable({
    id,
    type: 'group',
  });

  return (
    <div
      ref={(node) => {
        dragRef(node);
        groupDropRef(node);
      }}
      className={`group-container ${isDragging ? 'dragging' : ''}`}
    >
      <div className="group-header">
        <div className="group-label-container">
          <div ref={handleRef} className="drag-handle" />
          {isEditing ? (
            <Input
              type="text"
              variant="inline"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveLabel}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Enter group name"
            />
          ) : (
            <div className="group-label">{label}</div>
          )}
        </div>
        <div className="group-actions" onClick={(e) => e.stopPropagation()}>
          <Button
            icon={isEditing ? <FaCheck /> : <FaPen />}
            onClick={() => {
              if (isEditing) {
                handleSaveLabel();
              } else {
                setIsEditing(true);
                setEditValue(label);
              }
            }}
          />
          <Popover
            trigger={<Button icon={<FaPlus />} />}
            position="bottom"
          >
            {(close) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', padding: '8px' }}>
                {selectedFieldType ? (
                  // Step 2: Show label input
                  <>
                    <div style={{ paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', marginBottom: '8px' }}>
                      <button
                        onClick={() => setSelectedFieldType(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#667eea',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          padding: '4px 0',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        ← Back
                      </button>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {getFieldTypeName(selectedFieldType)}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., First Name"
                      value={fieldLabel}
                      onChange={(e) => setFieldLabel(e.target.value)}
                      onKeyDown={(e) => handleFieldLabelKeyDown(e, close)}
                      autoFocus
                      style={{
                        padding: '8px 12px',
                        border: '2px solid #667eea',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '8px',
                      }}
                    />
                    <button
                      onClick={() => handleCreateFieldWithLabel(close)}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        background: '#667eea',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5568d3';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Add Field
                    </button>
                  </>
                ) : (
                  // Step 1: Show field types
                  <>
                    {fieldTypes.map((field) => {
                      const IconComponent = field.icon;
                      return (
                        <button
                          key={field.type}
                          onClick={() => setSelectedFieldType(field.type)}
                          style={{
                            padding: '10px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#f5f7fa',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#2c3e50',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = field.color;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f5f7fa';
                            e.currentTarget.style.color = '#2c3e50';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <IconComponent style={{ fontSize: '16px' }} />
                          <span>{field.name}</span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </Popover>
          <Button icon={<FaTrash />} onClick={onDelete} />
        </div>
      </div>

      <div className="fields-container" ref={fieldDropRef}>
        {children}
      </div>
    </div>
  );
}

export default Group;