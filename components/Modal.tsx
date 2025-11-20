
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md' }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className={`relative w-full ${sizeClasses[size]} my-auto z-50 animate-in zoom-in-95 duration-200`}>
        <div className="relative rounded-2xl bg-white dark:bg-[#1c2431] shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
             {title ? (
               <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
             ) : <div></div>}
            <button
              onClick={onClose}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm p-2 inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          {/* Body */}
          <div className="overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
