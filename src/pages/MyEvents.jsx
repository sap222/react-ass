import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'

function MyEvents() {
  const user = useSelector(selectCurrentUser)

  return (
    <section className="container" style={{ padding: '3rem 1rem' }}>
      <h1>My Events</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Hi {user.name}, events you register for will appear here.
      </p>
    </section>
  )
}

export default MyEvents
