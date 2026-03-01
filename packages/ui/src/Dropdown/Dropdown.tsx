import React from 'react';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: DropdownOption[];
  error?: string;
  helperText?: string;
}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options = [], error, helperText, className, children, ...restProps }, ref) => {
    return (
      <div className={styles.dropdownWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={`${styles.dropdown} ${error ? styles.error : ''} ${className || ''}`}
          {...restProps}
        >
          {options.map((option) => (
            <option key={`${option.value}-${option.label}`} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
        {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;
