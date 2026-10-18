import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import DetailItem from '../components/DetailItem'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import ShareButton from '../components/ShareButton'
import StatusBadge from '../components/StatusBadge'
import { fetchEventDetails, selectEventDetails } from '../features/events/eventsSlice'
import {
  formatAddress,
  formatDateTime,
  formatEventDate,
  formatEventTime,
  formatPrice,
} from '../utils/format'
import './EventDetails.css'

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { item: event, status, error } = useSelector(selectEventDetails)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const request = dispatch(fetchEventDetails(id))
    return () => request.abort()
  }, [dispatch, id, reloadKey])

  useEffect(() => {
    if (event?.name) document.title = `${event.name} · EventHub`
    return () => {
      document.title = 'EventHub'
    }
  }, [event?.name])

  // Go back to the filtered list if we came from inside the app.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/events'))

  if (status === 'failed') {
    return (
      <section className="container details-page">
        <ErrorMessage
          title="Couldn't load this event"
          message={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />
        <p className="details-fallback">
          <Link to="/events">← Back to all events</Link>
        </p>
      </section>
    )
  }

  if (!event || event.id !== id) {
    return <Loader message="Loading event details…" />
  }

  const price = formatPrice(event.priceRange)
  const address = formatAddress(event.venue)
  const mapUrl =
    event.venue?.latitude && event.venue?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${event.venue.latitude},${event.venue.longitude}`
      : null
  const tags = [event.segment, event.genre, event.subGenre].filter(
    (tag, i, all) => tag && all.indexOf(tag) === i,
  )

  return (
    <article className="details-page">
      <header
        className="details-hero"
        style={event.imageLarge ? { backgroundImage: `url(${event.imageLarge})` } : undefined}
      >
        <div className="details-hero-overlay">
          <div className="container">
            <button type="button" className="details-back" onClick={goBack}>
              ← Back
            </button>
            <div className="details-tags">
              <StatusBadge status={event.status} />
              {tags.map((tag) => (
                <span key={tag} className="details-tag">
                  {tag}
                </span>
              ))}
              {event.ageRestricted && <span className="details-tag">18+</span>}
            </div>
            <h1>{event.name}</h1>
            <p className="details-hero-meta">
              {formatEventDate(event, { weekday: 'long', month: 'long' })} · {formatEventTime(event)}
              {event.venue && ` · ${event.venue.name}`}
            </p>
          </div>
        </div>
      </header>

      <div className="container details-layout">
        <div className="details-main">
          <section className="details-card details-grid">
            <DetailItem icon="📅" label="Date">
              {formatEventDate(event, { weekday: 'long', month: 'long' })}
            </DetailItem>
            <DetailItem icon="⏰" label="Time">
              {formatEventTime(event)}
              {event.timezone && <small>{event.timezone.replace('_', ' ')}</small>}
            </DetailItem>
            <DetailItem icon="🏟️" label="Venue">
              {event.venue?.url ? (
                <a href={event.venue.url} target="_blank" rel="noreferrer">
                  {event.venue.name}
                </a>
              ) : (
                (event.venue?.name ?? 'To be announced')
              )}
            </DetailItem>
            <DetailItem icon="📍" label="Location">
              {address ?? 'To be announced'}
              {mapUrl && (
                <small>
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    Open in Google Maps ↗
                  </a>
                </small>
              )}
            </DetailItem>
            <DetailItem icon="🎭" label="Category">
              {tags.length ? tags.join(' / ') : 'Not specified'}
            </DetailItem>
            <DetailItem icon="💳" label="Price range">
              {price ?? 'See Ticketmaster for prices'}
            </DetailItem>
            {event.sales?.start && (
              <DetailItem icon="🛒" label="Public sale">
                {formatDateTime(event.sales.start)}
                {event.sales.end && <small>until {formatDateTime(event.sales.end)}</small>}
              </DetailItem>
            )}
          </section>

          {(event.info || event.pleaseNote) && (
            <section className="details-card">
              <h2>About this event</h2>
              {event.info && <p className="details-text">{event.info}</p>}
              {event.pleaseNote && (
                <div className="details-note">
                  <strong>Please note:</strong> {event.pleaseNote}
                </div>
              )}
            </section>
          )}

          {event.attractions.length > 0 && (
            <section className="details-card">
              <h2>Lineup</h2>
              <ul className="details-lineup">
                {event.attractions.map((a) => (
                  <li key={a.id}>
                    {a.image ? (
                      <img src={a.image} alt="" loading="lazy" />
                    ) : (
                      <span className="details-lineup-placeholder">🎤</span>
                    )}
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        {a.name}
                      </a>
                    ) : (
                      <span>{a.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {event.seatmap && (
            <section className="details-card">
              <h2>Seat map</h2>
              <img className="details-seatmap" src={event.seatmap} alt={`Seat map for ${event.venue?.name ?? 'the venue'}`} loading="lazy" />
            </section>
          )}
        </div>

        <aside className="details-sidebar">
          <div className="details-card details-cta">
            <span className="details-cta-label">Price</span>
            <strong className="details-cta-price">{price ?? 'Varies'}</strong>
            <p className="details-cta-date">
              {formatEventDate(event)} · {formatEventTime(event)}
            </p>
            {event.url && (
              <a href={event.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-block">
                Buy tickets on Ticketmaster ↗
              </a>
            )}
            <ShareButton title={event.name} />
          </div>
        </aside>
      </div>
    </article>
  )
}

export default EventDetails
