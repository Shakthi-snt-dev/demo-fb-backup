import React, { createContext, useCallback, useContext, useState } from 'react'
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfo } from 'react-icons/fa'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  type: ToastType
  title: string
  message: string
  withBorder?: boolean
}

type ShowToastOptions = {
  message: string
  title?: string
  type?: ToastType
  duration?: number
  withBorder?: boolean
}

const ToastContext = createContext<{ showToast: (opts: ShowToastOptions) => void } | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const showToast = useCallback((opts: ShowToastOptions) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2)
    const defaultTitles = {
      success: 'Your success message',
      error: 'Your error message',
      info: 'Your information message',
      warning: 'Your warning message',
    }
    const toastType = opts.type ?? 'info'
    const toast: Toast = {
      id,
      type: toastType,
      title: opts.title ?? defaultTitles[toastType],
      message: opts.message,
      withBorder: opts.withBorder ?? false,
    }
    setToasts((t) => [...t, toast])
    const duration = opts.duration ?? 4000
    setTimeout(() => remove(id), duration)
  }, [remove])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 16,
          top: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => {
          const colors = {
            success: { bg: '#d1fae5', icon: '#10b981', text: '#059669' },
            error: { bg: '#fee2e2', icon: '#ef4444', text: '#dc2626' },
            warning: { bg: '#fef3c7', icon: '#f59e0b', text: '#d97706' },
            info: { bg: '#dbeafe', icon: '#3b82f6', text: '#2563eb' },
          }
          const color = colors[t.type]
          const IconComponent =
            t.type === 'success'
              ? FaCheck
              : t.type === 'error'
              ? FaTimes
              : t.type === 'warning'
              ? FaExclamationTriangle
              : FaInfo

          return (
            <div
              key={t.id}
              role="status"
              style={{
                minWidth: 320,
                maxWidth: 400,
                padding: '16px',
                borderRadius: 8,
                background: color.bg,
                boxShadow: '0 6px 18px rgba(2,6,23,0.08)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                position: 'relative',
                borderLeft: t.withBorder ? `4px solid ${color.icon}` : 'none',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: t.type === 'warning' ? '2px' : '50%',
                  backgroundColor: color.icon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  clipPath: t.type === 'warning' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                }}
              >
                <IconComponent
                  size={t.type === 'warning' ? 12 : 14}
                  color={t.type === 'warning' ? '#000' : '#fff'}
                  style={{ display: 'block' }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    color: '#6b7280',
                    lineHeight: 1.5,
                    marginBottom: 4,
                  }}
                >
                  {t.message}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: color.text,
                  }}
                >
                  {t.title}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => remove(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  color: '#1f2937',
                  marginTop: 2,
                }}
                aria-label="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
 