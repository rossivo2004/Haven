import React, { useState, ReactNode } from 'react'; // Import ReactNode
import styles from './Tooltip.module.css';

interface TooltipCuProps {
  title: React.ReactNode; // Change title type to ReactNode to accept JSX
  position?: 'left' | 'right'; 
  children: React.ReactNode; 
}

const TooltipCu: React.FC<TooltipCuProps> = ({ title, position = 'left', children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showDropdown = () => {
    setIsOpen(true);
  };

  const hideDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className={styles.navItem} 
      onMouseEnter={showDropdown} 
      onMouseLeave={hideDropdown}
    >
      <span className={styles.navTitle}>{title}</span>
      {isOpen && (
        <div 
          className={styles.dropdown} 
          style={{ left: position === 'left' ? '0' : 'auto', right: position === 'right' ? '0' : 'auto' }}
        >
          {children} {/* Render custom content */}
        </div>
      )}
    </div>
  );
};

export default TooltipCu;
