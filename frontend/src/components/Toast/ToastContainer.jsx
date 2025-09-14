import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
