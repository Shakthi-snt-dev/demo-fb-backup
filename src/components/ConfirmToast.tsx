import React, { createContext, useCallback, useContext, useState } from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

type ConfirmToast = {
  id: string;
  message: string;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ShowConfirmOptions = {
  message: string;
  title?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

const ConfirmToastContext = createContext<{ 
  showConfirm: (opts: ShowConfirmOptions) => void 
} | undefined>(undefined);

export const ConfirmToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirms, setConfirms] = useState<ConfirmToast[]>([]);

  const remove = useCallback((id: string) => {
    setConfirms((c) => c.filter((x) => x.id !== id));
  }, []);

  const showConfirm = useCallback((opts: ShowConfirmOptions) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const confirm: ConfirmToast = {
      id,
      title: opts.title || 'Confirm Action',
      message: opts.message,
      onConfirm: () => {
        opts.onConfirm();
        remove(id);
      },
      onCancel: () => {
        opts.onCancel?.();
        remove(id);
      },
    };
    setConfirms((c) => [...c, confirm]);
  }, [remove]);

  return (
    <ConfirmToastContext.Provider value={{ showConfirm }}>
      {children}

      {/* Confirm Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 10000,
        }}
      >
        {confirms.map((c) => (
          <div
            key={c.id}
            role="alertdialog"
            style={{
              minWidth: 360,
              maxWidth: 420,
              padding: '20px',
              borderRadius: 12,
              background: '#ffffff',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FaExclamationTriangle size={20} color="#f59e0b" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: 4,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.5,
                  }}
                >
                  {c.message}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={c.onCancel}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  color: '#374151',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                Cancel
              </button>
              <button
                onClick={c.onConfirm}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                }}
              >
                <FaCheck size={14} />
                Confirm
              </button>
            </div>
          </div>
        ))}
      </div>
    </ConfirmToastContext.Provider>
  );
};

export const useConfirmToast = () => {
  const ctx = useContext(ConfirmToastContext);
  if (!ctx) throw new Error('useConfirmToast must be used within a ConfirmToastProvider');
  return ctx;
};

export default ConfirmToastProvider;

