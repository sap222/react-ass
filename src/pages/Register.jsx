import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import {
  clearAuthError,
  registerUser,
  selectAuthError,
  selectAuthStatus,
} from '../features/auth/authSlice'
import { validateRegister } from '../utils/validation'
import './AuthPage.css'

const EMPTY_FORM = { name: '', email: '', password: '', confirmPassword: '' }

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const authError = useSelector(selectAuthError)

  const [form, setForm] = useState(EMPTY_FORM)
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
    const validationErrors = validateRegister(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length) return

    const { name, email, password } = form
    const result = await dispatch(registerUser({ name, email, password }))
    if (registerUser.fulfilled.match(result)) {
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="auth-subtitle">Join EventHub to save your spot at events you love.</p>

        {authError && <div className="auth-alert" role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Full name"
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />
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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          <FormInput
            label="Confirm password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </div>
    </section>
  )
}

export default Register
