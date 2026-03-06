import { createContext, useContext } from 'react'

import type { ToastType } from './types'

export interface ToastApi {
  show: (message: string, type?: ToastType, durationMs?: number) => void
  info: (message: string, durationMs?: number) => void
  success: (message: string, durationMs?: number) => void
  error: (message: string, durationMs?: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
