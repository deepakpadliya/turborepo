import React from 'react';
import styles from './StateMessage.module.scss';

export interface StateMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'error';
}

const StateMessage = ({ tone = 'default', className = '', children, ...restProps }: StateMessageProps): React.ReactElement => {
  return (
    <div className={`${styles.stateMessage} ${styles[tone]} ${className}`.trim()} {...restProps}>
      {children}
    </div>
  );
};

export default StateMessage;
