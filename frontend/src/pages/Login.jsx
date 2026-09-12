import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, hasRegisteredOnThisBrowser } = useAuth()
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser(form)
      login(data.user, data.token)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one">🍓</div>
      <div className="auth-decoration auth-decoration-two">🍨</div>
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-icecream">🍦</div>
          <p className="auth-kicker">Welcome back</p>
          <h1>Sweetness is waiting!</h1>
          <p>Sign in to continue your delicious IcyTales journey.</p>
        </div>

        <div className="auth-form-area">
          <Link to="/" className="auth-brand">🍦 Icy<span>Tales</span></Link>
          <h2>Login</h2>
          <p className="auth-subtitle">Enter your account details to continue.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email or User ID</label>
            <input
              name="login"
              value={form.login}
              onChange={handleChange}
              placeholder="Enter email or user ID"
              autoComplete="username"
              required
            />

            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {error && <div className="auth-error">{error}</div>}

            <button className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to IcyTales →'}
            </button>
          </form>

          <p className="auth-switch">
            {hasRegisteredOnThisBrowser() ? "Don't have an account?" : 'New to IcyTales?'}{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
