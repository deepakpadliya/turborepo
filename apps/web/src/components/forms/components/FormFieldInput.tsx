import { Checkbox, Dropdown, Input, RadioGroup, Textarea } from '@repo/ui';
import type { ChangeEventHandler, ReactElement } from 'react';

export interface FormFieldOption {
  label: string;
  value: string;
}

interface FormFieldInputProps {
  fieldType: string;
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  options?: FormFieldOption[] | string[];
  className?: string;
  style?: any;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
}

const normalizeOptions = (options?: FormFieldOption[] | string[]): FormFieldOption[] => {
  if (!options) return [];
  return options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }

    return option;
  });
};

const FormFieldInput = ({
  fieldType,
  id,
  name,
  label,
  value,
  placeholder,
  rows = 4,
  options,
  className,
  style,
  onChange,
}: FormFieldInputProps): ReactElement => {
  const normalizedOptions = normalizeOptions(options);
  const hasDirectStyling = !!style || !!className;

  if (fieldType === 'radio') {
    return (
      <RadioGroup
        name={name || id}
        value={value}
        onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined}
        options={
          normalizedOptions.length > 0
            ? normalizedOptions
            : [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
              ]
        }
      />
    );
  }

  if (fieldType === 'checkbox') {
    if (hasDirectStyling) {
      return <input id={id} name={name} type="checkbox" className={className} style={style} onChange={onChange} />;
    }

    return <Checkbox id={id} name={name} label={label} onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined} />;
  }

  if (fieldType === 'textarea') {
    if (hasDirectStyling) {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange as ChangeEventHandler<HTMLTextAreaElement> | undefined}
          placeholder={placeholder}
          rows={rows}
          className={className}
          style={style}
        />
      );
    }

    return (
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange as ChangeEventHandler<HTMLTextAreaElement> | undefined}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  if (fieldType === 'dropdown' || fieldType === 'select') {
    if (hasDirectStyling) {
      return (
        <select
          id={id}
          name={name}
          value={value ?? ''}
          onChange={onChange as ChangeEventHandler<HTMLSelectElement> | undefined}
          className={className}
          style={style}
        >
          <option value="">Select {label ?? 'option'}</option>
          {normalizedOptions.map((option) => (
            <option key={`${option.value}-${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <Dropdown
        id={id}
        name={name}
        value={value ?? ''}
        onChange={onChange as ChangeEventHandler<HTMLSelectElement> | undefined}
        options={
          normalizedOptions.length > 0
            ? [{ label: `Select ${label ?? 'option'}`, value: '' }, ...normalizedOptions]
            : [{ label: `Select ${label ?? 'option'}`, value: '' }]
        }
      />
    );
  }

  const htmlInputType = fieldType === 'email' || fieldType === 'number' || fieldType === 'date'
    ? fieldType
    : 'text';

  if (hasDirectStyling) {
    return (
      <input
        type={htmlInputType}
        id={id}
        name={name}
        value={value}
        onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined}
        placeholder={placeholder}
        className={className}
        style={style}
      />
    );
  }

  return (
    <Input
      type={htmlInputType}
      id={id}
      name={name}
      value={value}
      onChange={onChange as ChangeEventHandler<HTMLInputElement> | undefined}
      placeholder={placeholder}
    />
  );
};

export default FormFieldInput;
