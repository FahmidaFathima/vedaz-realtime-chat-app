import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        setTimeout(() => remove(id), duration)
      }
      return id
    },
    [remove]
  )

  const toast = useMemo(
    () => ({
      info: (m, d) => addToast(m, "info", d),
      success: (m, d) => addToast(m, "success", d),
      error: (m, d) => addToast(m, "error", d),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => remove(t.id)}
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}
