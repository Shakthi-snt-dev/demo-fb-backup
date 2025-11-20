import React, { useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Light sky background tint */}
      <div className="absolute inset-0 bg-[#F5F8FF]/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl border border-[#E0E7F1] w-full ${sizeClasses[size]} transform transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bird-theme header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E0E7F1] bg-[#F5F8FF]">
          <h2 className="text-xl font-semibold text-[#1A1F36]">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 text-[#4A5568] hover:text-[#1A1F36] hover:bg-white rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;

