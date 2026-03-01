import React from 'react';
import styles from './Buttons.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

const Button = (props: ButtonProps) : React.ReactElement => {
  const { icon, children, ...restProps } = props;
  
  return (
    <button className={styles.button} {...restProps}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children && <span className={styles.text}>{children}</span>}
    </button>
  )
}

export default Button