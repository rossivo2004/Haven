import React, { useState, ReactNode } from 'react';
import styles from './Tooltip.module.css';

interface TooltipCuProps {
  title: React.ReactNode; // Accept JSX for the title
  position?: 'left' | 'right'; 
  children: React.ReactNode; 
}

const TooltipCu: React.FC<TooltipCuProps> = ({ title, position = 'left', children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null); // Store timeout ID

  const showDropdown = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout); // Clear timeout if it exists
    }
    setIsOpen(true);
  };

  const hideDropdown = () => {
    const timeoutId = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Thay đổi thời gian này nếu cần
    setHideTimeout(timeoutId); // Store the timeout ID
  };

  return (
    <div 
      className={styles.navItem} 
      onMouseEnter={showDropdown} 
      onMouseLeave={hideDropdown}
    >
      <span className={styles.navTitle}>{title}</span>
      <div 
        className={`${styles.dropdown} ${isOpen ? styles.show : styles.hide}`} 
        style={{ left: position === 'left' ? '0' : 'auto', right: position === 'right' ? '0' : 'auto' }}
      >
        {children} {/* Render custom content */}
      </div>
    </div>
  );
};

export default TooltipCu;
