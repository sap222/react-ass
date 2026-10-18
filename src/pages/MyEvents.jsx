import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import RegisteredEventItem from '../components/RegisteredEventItem'
import { selectCurrentUser } from '../features/auth/authSlice'
import {
  cancelRegistration,
  selectUserRegistrations,
} from '../features/registrations/registrationsSlice'
import { getEventTimestamp, isPastEvent } from '../utils/format'
import './MyEvents.css'

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
]

function MyEvents() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const registrations = useSelector(selectUserRegistrations)
  const [searchParams, setSearchParams] = useSearchParams()
  const [eventToCancel, setEventToCancel] = useState(null)

  const activeTab = searchParams.get('tab') === 'completed' ? 'completed' : 'upcoming'

  // Upcoming: soonest first. Completed: most recent first.
  const { upcoming, completed } = useMemo(() => {
    const byDate = (a, b) => getEventTimestamp(a.event) - getEventTimestamp(b.event)
    const past = registrations.filter((r) => isPastEvent(r.event))
    const future = registrations.filter((r) => !isPastEvent(r.event))
    return { upcoming: future.sort(byDate), completed: past.sort((a, b) => byDate(b, a)) }
  }, [registrations])

  const lists = { upcoming, completed }
  const visible = lists[activeTab]
  const nextEvent = upcoming[0]?.event

  const confirmCancel = () => {
    dispatch(cancelRegistration(eventToCancel))
    setEventToCancel(null)
  }

  return (
    <section className="container my-events">
      <header className="my-events-header">
        <div>
          <h1>My Events</h1>
          <p>
            Hi {user.name.split(' ')[0]}
            {nextEvent ? (
              <>
                , your next event is <Link to={`/events/${nextEvent.id}`}>{nextEvent.name}</Link>.
              </>
            ) : (
              ', manage all the events you have registered for.'
            )}
          </p>
        </div>
        <Link to="/events" className="btn btn-primary">
          + Find more events
        </Link>
      </header>

      <div className="my-events-stats">
        <div className="stat-card">
          <span>Total registrations</span>
          <strong>{registrations.length}</strong>
        </div>
        <div className="stat-card">
          <span>Upcoming</span>
          <strong>{upcoming.length}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{completed.length}</strong>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Registered events">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setSearchParams(tab.id === 'upcoming' ? {} : { tab: tab.id })}
          >
            {tab.label}
            <span className="tab-count">{lists[tab.id].length}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {visible.length === 0 ? (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : '🏁'}
            title={activeTab === 'upcoming' ? 'No upcoming events' : 'No completed events yet'}
            message={
              activeTab === 'upcoming'
                ? 'Browse events and register to see them here.'
                : 'Events you attended will show up here once they have taken place.'
            }
            action={
              activeTab === 'upcoming' && (
                <Link to="/events" className="btn btn-primary">
                  Browse events
                </Link>
              )
            }
          />
        ) : (
          <div className="my-events-list">
            {visible.map((registration) => (
              <RegisteredEventItem
                key={registration.eventId}
                registration={registration}
                completed={activeTab === 'completed'}
                onCancel={setEventToCancel}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(eventToCancel)}
        title="Cancel registration?"
        message={eventToCancel && `You will lose your spot at ${eventToCancel.name}.`}
        confirmLabel="Yes, cancel"
        onConfirm={confirmCancel}
        onCancel={() => setEventToCancel(null)}
      />
    </section>
  )
}

export default MyEvents
