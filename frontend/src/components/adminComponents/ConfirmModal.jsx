import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

/**
 * Reusable Confirmation Modal for Critical Admin Actions
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Triggers when canceled
 * @param {function} onConfirm - Triggers when user confirms
 * @param {string} title - Header text
 * @param {string} message - Body text/description
 * @param {string} confirmText - Label for confirm button (e.g. "Release Payout", "Block Seller")
 * @param {string} variant - Preset theme: 'danger' | 'warning' | 'primary' | 'success'
 * @param {boolean} isLoading - Shows spinner when submitting API request
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  // Render variant icons and button themes
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertTriangle className="text-warning" size={28} />,
          btnClass: 'btn-warning text-dark',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="text-success" size={28} />,
          btnClass: 'btn-success',
        };
      case 'primary':
        return {
          icon: <Info className="text-primary" size={28} />,
          btnClass: 'btn-primary',
        };
      case 'danger':
      default:
        return {
          icon: <AlertTriangle className="text-danger" size={28} />,
          btnClass: 'btn-danger',
        };
    }
  };

  const { icon, btnClass } = getVariantStyles();

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-bottom-0 pb-0">
            <div className="d-flex align-items-center gap-2">
              {icon}
              <h5 className="modal-title fw-bold text-dark">{title}</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              disabled={isLoading}
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body py-3">
            <p className="text-secondary mb-0">{message}</p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-top-0 pt-0">
            <button
              type="button"
              className="btn btn-light border"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn ${btnClass} d-inline-flex align-items-center gap-2`}
              disabled={isLoading}
              onClick={onConfirm}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;