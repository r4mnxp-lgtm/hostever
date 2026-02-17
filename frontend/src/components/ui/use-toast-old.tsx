import * as React from "react"

import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"

const ToastContext = React.createContext({})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback(({ title, description, variant, duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            <div className="grid gap-1">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
            <ToastClose onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))} />
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
