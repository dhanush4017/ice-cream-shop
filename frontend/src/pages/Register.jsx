import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { markRegistered } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', userId: '', password: '' })
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
      await registerUser(form)
      markRegistered()
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page register-page">
      <div className="auth-decoration auth-decoration-one">🍒</div>
      <div className="auth-decoration auth-decoration-two">🍓</div>
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-icecream">🍧</div>
          <p className="auth-kicker">Join the sweet side</p>
          <h1>Create your account!</h1>
          <p>Save your details and enjoy the full IcyTales experience.</p>
        </div>

        <div className="auth-form-area">
          <Link to="/" className="auth-brand">🍦 Icy<span>Tales</span></Link>
          <h2>Register</h2>
          <p className="auth-subtitle">Create your IcyTales account first.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />

            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />

            <label>User ID</label>
            <input name="userId" value={form.userId} onChange={handleChange} placeholder="Choose a user ID" autoComplete="username" required />

            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters" autoComplete="new-password" minLength="6" required />

            {error && <div className="auth-error">{error}</div>}

            <button className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">Already registered? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  )
}
