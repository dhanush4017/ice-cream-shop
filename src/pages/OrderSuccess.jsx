import { useEffect, useState } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'

export default function OrderSuccess() {
  const location = useLocation()
  const [order, setOrder] = useState(location.state || null)

  useEffect(() => {
    if (!order) {
      try {
        const stored = window.localStorage.getItem('icytales_last_order')
        if (stored) setOrder(JSON.parse(stored))
      } catch (err) {
        console.warn('Could not read last order:', err)
      }
    }
  }, [order])

  if (!order) {
    // No order in state or storage — nothing to confirm, so send them shopping.
    return <Navigate to="/shop" replace />
  }

  return (
    <section className="section">
      <div className="container">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>
            Thank you, {order.customer?.firstName || 'friend'}! Your sweet treats are being prepared
            for delivery.
          </p>
          <p>A confirmation email has been sent to {order.customer?.email || 'your inbox'}.</p>
          <div className="order-number">Order #{order.orderNumber}</div>
          <p style={{ marginBottom: 30 }}>
            Grand Total: <strong style={{ color: 'var(--color-pink)' }}>${order.grandTotal?.toFixed(2)}</strong>
          </p>
          <div className="success-actions">
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping →
            </Link>
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
