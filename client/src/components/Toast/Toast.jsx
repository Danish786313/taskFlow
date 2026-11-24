import React from 'react';
import { IconCheck, IconAlertTriangle, IconClose } from '../Icons/Icons';
import './Toast.css';

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <IconCheck size={18} color="#059669" />}
            {toast.type === 'error' && <IconAlertTriangle size={18} color="#dc2626" />}
            {toast.type === 'info' && <IconCheck size={18} color="#2563eb" />}
          </div>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            type="button"
            className="toast-dismiss-btn"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <IconClose size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
