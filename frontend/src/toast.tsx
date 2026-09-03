import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { ToastContext, type ToastApi } from './toast-context'
import type { ToastType } from './types'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  leaving?: boolean
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 200)
  }, [])

  const show = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 3000) => {
      const id = newId()
      setItems((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => remove(id), durationMs)
    },
    [remove],
  )

  const api = useMemo<ToastApi>(() => {
    return {
      show,
      info: (m, d) => show(m, 'info', d),
      success: (m, d) => show(m, 'success', d),
      error: (m, d) => show(m, 'error', d),
    }
  }, [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed top-5 right-5 z-[100] space-y-2 pointer-events-none max-w-sm w-full"
        role="region"
        aria-label="通知"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role="alert"
            aria-live="polite"
            className={`pointer-events-auto flex items-center w-full p-3.5 gap-3 bg-white/95 backdrop-blur-xl text-slate-800 rounded-2xl shadow-[0_12px_32px_rgba(15,23,42,0.1)] border border-slate-200/90 transition-all ${t.leaving ? 'animate-fade-out' : 'msg-appear'}`}
          >
            <div className="flex-shrink-0">
              {t.type === 'success' ? (
                <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : t.type === 'error' ? (
                <span className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              ) : (
                <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="text-xs font-semibold flex-1 leading-relaxed text-slate-800">{t.message}</div>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              onClick={() => remove(t.id)}
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

