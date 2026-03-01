import React from 'react';
import styles from './Alert.module.scss';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'success' | 'info' | 'warning';
}

const Alert = ({ variant = 'info', className = '', children, ...restProps }: AlertProps): React.ReactElement => {
  return (
    <div
      className={`${styles.alert} ${styles[variant]} ${className}`.trim()}
      role="status"
      {...restProps}
    >
      {children}
    </div>
  );
};

export default Alert;
