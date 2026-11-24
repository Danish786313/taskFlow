import React, { useEffect } from 'react';
import { IconAlertTriangle, IconClose } from '../Icons/Icons';
import './ConfirmDialog.css';

export const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary'
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close-btn" onClick={onCancel} aria-label="Close dialog">
          <IconClose size={18} />
        </button>

        <div className="confirm-header">
          <div className={`confirm-icon-wrap icon-${confirmVariant}`}>
            <IconAlertTriangle size={24} />
          </div>
          <div>
            <h3 className="confirm-title">{title}</h3>
            <p className="confirm-message">{message}</p>
          </div>
        </div>

        <div className="confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
