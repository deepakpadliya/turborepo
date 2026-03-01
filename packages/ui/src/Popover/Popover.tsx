import React, { useState, useRef, useEffect } from 'react';
import styles from './Popover.module.scss';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Popover = ({ trigger, children, position = 'bottom', className = '' }: PopoverProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const togglePopover = () => {
    setIsOpen((prev) => !prev);
  };

  const closePopover = () => {
    setIsOpen(false);
  };

  return (
    <div className={`${styles.popoverContainer} ${className}`} ref={popoverRef}>
      <div className={styles.trigger} onClick={togglePopover}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`${styles.popoverContent} ${styles[position]}`}>
          {typeof children === 'function' ? children(closePopover) : children}
        </div>
      )}
    </div>
  );
};

export default Popover;
