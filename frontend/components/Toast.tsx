'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert, IconButton } from '@mui/material'
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: 'success' | 'error' | 'info', message: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, type === 'error' ? 5000 : 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  const currentToast = toasts[0]

  if (!currentToast) return null

  return (
    <Snackbar
      open={!!currentToast}
      autoHideDuration={currentToast.type === 'error' ? 5000 : 4000}
      onClose={() => removeToast(currentToast.id)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ maxWidth: 500, width: '100%' }}
    >
      <Alert
        severity={currentToast.type === 'error' ? 'error' : currentToast.type === 'success' ? 'success' : 'info'}
        onClose={() => removeToast(currentToast.id)}
        sx={{ width: '100%' }}
      >
        {currentToast.message}
      </Alert>
    </Snackbar>
  )
}
