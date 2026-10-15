import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '../features/auth/authSlice'

// Keeps logged-in users away from the login/register pages.
function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? '/'

  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />
}

export default GuestRoute
