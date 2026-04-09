'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { activateFocusTrap, deactivateFocusTrap, announceModalOpen, announceModalClosed } from '@/lib/accessibility';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Accessible Modal component with proper ARIA attributes, focus trap, and keyboard support
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (!isOpen) return;

    // Announce modal open
    announceModalOpen(title);

    // Trap focus within modal
    if (modalRef.current) {
      activateFocusTrap({
        container: modalRef.current,
        initialFocus: titleRef.current,
        onEscape: onClose,
        onDeactivate: () => {
          announceModalClosed();
        },
      });
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      deactivateFocusTrap();
      document.body.style.overflow = '';
      announceModalClosed();
    };
  }, [isOpen, title, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              ref={titleRef}
              id="modal-title"
              className="text-2xl font-bold text-stone-900"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
