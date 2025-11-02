// ToastNotification.jsx
// Simple toast notification component

import React, { useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ 
  isVisible, 
  message, 
  type = 'success', 
  duration = 3000,
  onClose 
}) => {
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon(type)}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;




