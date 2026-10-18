import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'
import { isPastEvent } from '../utils/format'
import './Navbar.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const registrations = useSelector(selectUserRegistrations)
  const upcomingCount = registrations.filter((r) => !isPastEvent(r.event)).length
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    dispatch(logout())
    closeMenu()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src="/ticket.svg" alt="" width="28" height="28" />
          EventHub
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-menu ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/events" onClick={closeMenu}>
            Events
          </NavLink>
          {user && (
            <NavLink to="/my-events" onClick={closeMenu}>
              My Events
              {upcomingCount > 0 && (
                <span className="navbar-badge" aria-label={`${upcomingCount} upcoming`}>
                  {upcomingCount}
                </span>
              )}
            </NavLink>
          )}

          <div className="navbar-auth">
            {user ? (
              <>
                <span className="navbar-user" title={user.email}>
                  <span className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(' ')[0]}
                </span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMenu}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
