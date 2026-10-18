import { Link } from 'react-router-dom'
import {
  formatDateTime,
  formatEventDate,
  formatEventTime,
  formatLocation,
  getRelativeDayLabel,
} from '../utils/format'
import StatusBadge from './StatusBadge'
import './RegisteredEventItem.css'

function RegisteredEventItem({ registration, completed, onCancel }) {
  const { event, registeredAt } = registration
  const relative = getRelativeDayLabel(event)

  return (
    <article className={`registered-item ${completed ? 'is-completed' : ''}`}>
      <Link to={`/events/${event.id}`} className="registered-item-media">
        {event.image ? <img src={event.image} alt="" loading="lazy" /> : <span aria-hidden="true">🎟️</span>}
      </Link>

      <div className="registered-item-body">
        <div className="registered-item-tags">
          {completed ? (
            <span className="registered-item-pill is-done">✓ Completed</span>
          ) : (
            relative && <span className="registered-item-pill">{relative}</span>
          )}
          {!completed && event.status !== 'onsale' && <StatusBadge status={event.status} />}
          {event.segment && <span className="registered-item-segment">{event.segment}</span>}
        </div>

        <h3>
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        <p className="registered-item-meta">
          📅 {formatEventDate(event)} · {formatEventTime(event)}
        </p>
        <p className="registered-item-meta">
          📍 {event.venue?.name ?? 'Venue TBA'} · {formatLocation(event.venue)}
        </p>
        <p className="registered-item-registered">Registered {formatDateTime(registeredAt)}</p>
      </div>

      <div className="registered-item-actions">
        <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
          View details
        </Link>
        {!completed && (
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onCancel(event)}>
            Cancel
          </button>
        )}
      </div>
    </article>
  )
}

export default RegisteredEventItem
