import React from 'react';
import styles from './Checkbox.module.scss';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ label, className, ...restProps }, ref) => {
  return (
    <label className={`${styles.checkboxLabel} ${className || ''}`.trim()}>
      <input ref={ref} type="checkbox" className={styles.checkboxInput} {...restProps} />
      {label && <span className={styles.text}>{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
