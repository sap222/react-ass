import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentUser } from '../features/auth/authSlice'
import './Home.css'

function Home() {
  const user = useSelector(selectCurrentUser)

  return (
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
          {user ? (
            <Link to="/my-events" className="btn btn-primary">
              View my events
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get started
              </Link>
              <Link to="/login" className="btn btn-outline">
                I already have an account
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home
