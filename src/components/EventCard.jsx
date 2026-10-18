import { Link } from 'react-router-dom'
import { formatEventTime, formatLocation, getDateBadge } from '../utils/format'
import './EventCard.css'

function EventCard({ event }) {
  const badge = getDateBadge(event)

  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-link">
        <div className="event-card-media">
          {event.image ? (
            <img src={event.image} alt="" loading="lazy" />
          ) : (
            <div className="event-card-placeholder" aria-hidden="true">🎟️</div>
          )}
          <div className="event-card-date">
            <span>{badge.month}</span>
            <strong>{badge.day}</strong>
          </div>
          {event.segment && <span className="event-card-chip">{event.segment}</span>}
        </div>

        <div className="event-card-body">
          <h3 className="event-card-title">{event.name}</h3>
          <p className="event-card-meta">
            <span>{event.venue?.name ?? 'Venue TBA'}</span>
            <span>
              {formatLocation(event.venue)} · {formatEventTime(event)}
            </span>
          </p>
        </div>
      </Link>
    </article>
  )
}

export default EventCard
