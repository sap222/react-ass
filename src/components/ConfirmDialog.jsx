import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

// Wraps the native <dialog> element: focus trapping and Esc-to-close come for free.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Keep it',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      onClose={onCancel}
      onClick={(e) => e.target === dialogRef.current && onCancel()}
    >
      <div className="confirm-dialog-body">
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <div className="confirm-dialog-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
