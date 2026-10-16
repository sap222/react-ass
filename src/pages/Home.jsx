import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import EventGrid from '../components/EventGrid'
import { selectCurrentUser } from '../features/auth/authSlice'
import { fetchUpcomingEvents, selectUpcomingEvents } from '../features/events/eventsSlice'
import './Home.css'

function Home() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const upcoming = useSelector(selectUpcomingEvents)

  useEffect(() => {
    dispatch(fetchUpcomingEvents())
  }, [dispatch])

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-eyebrow">Concerts · Sports · Theatre · Family</span>
          <h1>
            {user ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Find your next live experience.'}
          </h1>
          <p className="hero-text">
            Explore thousands of upcoming events, save your spot in one click and keep all your
            plans in one place.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary">
              Browse events
            </Link>
            {user ? (
              <Link to="/my-events" className="btn btn-outline">
                View my events
              </Link>
            ) : (
              <Link to="/register" className="btn btn-outline">
                Create an account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="container home-section">
        <div className="section-header">
          <h2>Upcoming events</h2>
          <Link to="/events">See all →</Link>
        </div>

        {upcoming.status === 'failed' ? (
          <ErrorMessage
            title="Couldn't load upcoming events"
            message={upcoming.error}
            onRetry={() => dispatch(fetchUpcomingEvents())}
          />
        ) : (
          <EventGrid events={upcoming.items} loading={upcoming.status !== 'succeeded'} />
        )}
      </section>
    </>
  )
}

export default Home
