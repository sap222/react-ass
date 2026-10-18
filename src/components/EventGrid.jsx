import EventCard from './EventCard'
import './EventGrid.css'

function EventGrid({ events, loading = false, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className="event-grid" aria-busy="true" aria-label="Loading events">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="event-skeleton">
            <div className="event-skeleton-media" />
            <div className="event-skeleton-line" />
            <div className="event-skeleton-line short" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventGrid
