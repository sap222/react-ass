import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthStatus,
} from '../features/auth/authSlice'
import { validateLogin } from '../utils/validation'
import './AuthPage.css'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const redirectTo = location.state?.from?.pathname ?? '/'

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateLogin(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to register for events and manage your bookings.</p>

        {authError && <div className="auth-alert" role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register" state={location.state}>Create one</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
