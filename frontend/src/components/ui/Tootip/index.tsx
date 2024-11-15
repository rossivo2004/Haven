import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipCuProps {
  title: React.ReactNode; // Accept JSX for the title
  position?: 'left' | 'right'; 
  children: React.ReactNode; 
  className?: string; // Add className to the props interface
}

const TooltipCu: React.FC<TooltipCuProps> = ({ title, position = 'left', children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const showDropdown = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout); // Clear timeout if it exists
    }
    setIsOpen(true);
  };

  const hideDropdown = () => {
    const timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Adjust delay as needed
    setHideTimeout(timeoutId);
  };

  return (
    <div 
      className={`${styles.navItem} ${className}`} // Apply className prop
      onMouseEnter={showDropdown} 
      onMouseLeave={hideDropdown}
    >
      <span className={styles.navTitle}>{title}</span>
      <div 
        className={`${styles.dropdown} ${isOpen ? styles.show : styles.hide}`} 
        style={{ left: position === 'left' ? '-200px' : 'auto', right: position === 'right' ? '0' : 'auto' }}
      >
        {children} {/* Render custom content */}
      </div>
    </div>
  );
};

export default TooltipCu;
