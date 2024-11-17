// components/Popup.js
import React, { useState } from 'react';
import styles from './Popup.module.css'; // Định nghĩa các style riêng cho popup
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
  onClose: () => void; // Define the type for onClose
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  // Function to handle clicks on the overlay
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is on the overlay (not on the popup)
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}><CloseIcon className='text-white'/></button>
      </div>
    </div>
  );
};

export default Popup;
