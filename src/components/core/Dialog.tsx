import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Typography from './Typography';
import Button from './Button';

interface DialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog should close */
  onClose: () => void;
  /** Dialog title */
  title?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Optional maximum width class */
  maxWidth?: string;
}

/**
 * A reusable dialog component that provides a modal interface
 * with a backdrop, close button, and focus trap
 */
const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

      {/* Dialog positioning */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Dialog panel */}
        <div
          ref={dialogRef}
          className={`relative bg-white rounded-lg shadow-xl ${maxWidth} w-full p-6`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          {/* Title */}
          {title && (
            <div className="mb-4">
              <Typography variant="h3">{title}</Typography>
            </div>
          )}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;