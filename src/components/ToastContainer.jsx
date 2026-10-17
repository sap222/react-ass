import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dismissToast, selectToasts } from '../features/ui/uiSlice'
import './ToastContainer.css'

const ICONS = { success: '✓', error: '!', info: 'i' }
const DURATION = 4000

function Toast({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), DURATION)
    return () => clearTimeout(timer)
  }, [dispatch, toast.id])

  return (
    <div className={`toast toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <span className="toast-icon" aria-hidden="true">
        {ICONS[toast.type]}
      </span>
      <p>{toast.message}</p>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => dispatch(dismissToast(toast.id))}
      >
        ×
      </button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useSelector(selectToasts)

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
