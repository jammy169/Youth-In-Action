// NotificationContext.jsx
// Context for managing notifications throughout the app

import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../components/ToastNotification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const showSuccess = (message, duration = 3000) => {
    return showNotification(message, 'success', duration);
  };

  const showError = (message, duration = 5000) => {
    return showNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 4000) => {
    return showNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 3000) => {
    return showNotification(message, 'info', duration);
  };

  const value = {
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render all notifications */}
      {notifications.map(notification => (
        <ToastNotification
          key={notification.id}
          isVisible={true}
          message={notification.message}
          type={notification.type}
          duration={0} // We handle duration manually
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};


