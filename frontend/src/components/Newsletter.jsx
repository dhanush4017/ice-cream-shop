import { useState } from 'react'
import { subscribeToNewsletter } from '../services/api.js'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    try {
      const result = await subscribeToNewsletter(email)
      setStatus('success')
      setMessage(result.alreadySubscribed ? 'You are already subscribed — sweet!' : 'Thanks for subscribing! Your 10% offer is on the way.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Could not subscribe right now. Please try again.')
    }
  }

  return (
    <section className="section newsletter">
      <h2>
        Sign up For <span className="accent">Exclusive Deals</span> and Updates
      </h2>
      <p>Get 10% off your next order and stay updated with our latest offers.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setStatus(null)
          }}
        />
        <button type="submit" className="btn btn-primary">
          Subscribe →
        </button>
      </form>
      {status === 'success' && (
        <p className="fine-print" style={{ color: 'var(--color-success)' }}>
          {message}
        </p>
      )}
      {status === 'error' && (
        <p className="fine-print" style={{ color: '#d9534f' }}>
          {message}
        </p>
      )}
      {!status && <p className="fine-print">I agree to the Privacy Policy.</p>}
    </section>
  )
}
