import React from 'react';
import styles from './IconButton.module.scss';

type IconButtonVariant = 'default' | 'danger';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
}

const IconButton = ({ icon, variant = 'default', className = '', ...restProps }: IconButtonProps): React.ReactElement => {
  const variantClass = variant === 'danger' ? styles.danger : '';

  return (
    <button className={[styles.iconButton, variantClass, className].filter(Boolean).join(' ')} {...restProps}>
      <span className={styles.icon}>{icon}</span>
    </button>
  );
};

export default IconButton;