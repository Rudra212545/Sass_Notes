import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Convenience methods
  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);
  
  // Confirmation toast with actions
  const confirm = (message, onConfirm, onCancel) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { 
      id, 
      message, 
      type: 'confirm', 
      onConfirm: () => {
        onConfirm();
        removeToast(id);
      },
      onCancel: () => {
        if (onCancel) onCancel();
        removeToast(id);
      }
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    confirm
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
