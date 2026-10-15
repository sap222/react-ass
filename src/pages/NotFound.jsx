import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)' }}>404</h1>
      <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
