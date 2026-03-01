import React from 'react';
import styles from './RadioGroup.module.scss';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[];
  direction?: 'row' | 'column';
}

const RadioGroup = ({ options, name, value, onChange, direction = 'row', ...restProps }: RadioGroupProps): React.ReactElement => {
  return (
    <div className={`${styles.group} ${direction === 'column' ? styles.column : styles.row}`}>
      {options.map((option) => (
        <label key={`${name}-${option.value}`} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            {...restProps}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
