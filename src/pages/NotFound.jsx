import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <section className="container not-found">
      <span className="not-found-code">404</span>
      <h1>This page has left the building</h1>
      <p>The page you are looking for doesn&apos;t exist or may have been moved.</p>
      <div className="not-found-actions">
        <Link to="/" className="btn btn-outline">
          Back to home
        </Link>
        <Link to="/events" className="btn btn-primary">
          Browse events
        </Link>
      </div>
    </section>
  )
}

export default NotFound
