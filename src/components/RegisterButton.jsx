import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import {
  cancelRegistration,
  registerForEvent,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { isPastEvent } from '../utils/format'
import ConfirmDialog from './ConfirmDialog'
import './RegisterButton.css'

function RegisterButton({ event }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isRegistered = useSelector((state) => selectIsRegistered(state, event.id))
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isPast = isPastEvent(event)
  const isCancelled = event.status === 'canceled' || event.status === 'cancelled'

  if (!isAuthenticated) {
    return (
      <Link to="/login" state={{ from: location }} className="btn btn-primary btn-block">
        Log in to register
      </Link>
    )
  }

  if (isRegistered) {
    return (
      <div className="register-status">
        <div className="register-confirmed">✓ You&apos;re registered</div>
        {!isPast && (
          <button type="button" className="btn btn-danger btn-block" onClick={() => setConfirmOpen(true)}>
            Cancel registration
          </button>
        )}
        <ConfirmDialog
          open={confirmOpen}
          title="Cancel registration?"
          message={`You will lose your spot at ${event.name}. You can register again later if it's still available.`}
          confirmLabel="Yes, cancel"
          onConfirm={() => {
            dispatch(cancelRegistration(event))
            setConfirmOpen(false)
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    )
  }

  if (isPast || isCancelled) {
    return (
      <button type="button" className="btn btn-primary btn-block" disabled>
        {isCancelled ? 'Event cancelled' : 'Event has ended'}
      </button>
    )
  }

  return (
    <button type="button" className="btn btn-primary btn-block" onClick={() => dispatch(registerForEvent(event))}>
      Register for this event
    </button>
  )
}

export default RegisterButton
