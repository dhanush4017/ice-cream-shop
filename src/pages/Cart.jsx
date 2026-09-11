import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'

const VALID_COUPONS = { SUMMER50: 0.1, SWEET10: 0.1 }

export default function Cart() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, subtotal, shipping, grandTotal } =
    useCart()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState(() => {
    try { return window.localStorage.getItem('icytales_coupon') || '' } catch { return '' }
  })
  const [discount, setDiscount] = useState(() => {
    try { return window.localStorage.getItem('icytales_coupon') ? 0.1 : 0 } catch { return 0 }
  })
  const [couponMessage, setCouponMessage] = useState(null)

  function handleApplyCoupon() {
    const code = coupon.trim().toUpperCase()
    if (!code) {
      setCouponMessage({ type: 'error', text: 'Enter a coupon code first.' })
      return
    }
    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code])
      try { window.localStorage.setItem('icytales_coupon', code) } catch {}
      setCouponMessage({ type: 'success', text: `Coupon applied! ${VALID_COUPONS[code] * 100}% off.` })
    } else {
      setDiscount(0)
      try { window.localStorage.removeItem('icytales_coupon') } catch {}
      setCouponMessage({ type: 'error', text: 'Invalid or expired coupon code.' })
    }
  }

  const discountAmount = subtotal * discount
  const total = Math.max(0, subtotal - discountAmount + shipping)

  return (
    <>
      <PageBanner title="Shopping Cart" crumbs={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />

      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <EmptyState
              emoji="🛒"
              title="Your cart is empty"
              message="Looks like you haven't added any sweet treats yet."
              actionTo="/shop"
              actionLabel="Continue Shopping"
            />
          ) : (
            <div className="cart-layout">
              <div>
                <div className="cart-table-header">
                  <span>Product Details</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {items.map((line) => (
                  <div key={line.key} className="cart-row">
                    <div className="cart-product-cell">
                      <img src={line.image} alt={line.name} />
                      <div>
                        <div className="name">{line.name}</div>
                        {line.color && (
                          <div className="variant">
                            Color: <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: line.color, verticalAlign: 'middle' }} />
                          </div>
                        )}
                        {line.size && <div className="variant">Size: {line.size}</div>}
                      </div>
                    </div>
                    <div className="cart-price">
                      <span className="cell-label">Price:</span>₹{line.price.toFixed(2)}
                    </div>
                    <div>
                      <span className="cell-label">Quantity:</span>
                      <QuantitySelector
                        quantity={line.quantity}
                        onIncrease={() => increaseQuantity(line.key)}
                        onDecrease={() => decreaseQuantity(line.key)}
                      />
                    </div>
                    <div className="cart-total-cell">
                      <span className="cell-label">Total:</span>₹{(line.price * line.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(line.key)}
                      aria-label={`Remove ${line.name} from cart`}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <Link to="/shop" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>

              <div className="order-summary-card">
                <h3>Order Summary</h3>

                <div className="coupon-row">
                  <input
                    type="text"
                    placeholder="Apply Coupons"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button className="btn btn-purple btn-sm" onClick={handleApplyCoupon}>
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      marginBottom: 16,
                      color: couponMessage.type === 'success' ? 'var(--color-success)' : '#d9534f',
                    }}
                  >
                    {couponMessage.text}
                  </p>
                )}

                <div className="summary-line">
                  <span>Sub Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-line">
                    <span>Discount</span>
                    <span>−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Grand Total</span>
                  <span className="value">₹{total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout →
                </button>

                <div className="summary-trust">
                  <span>🔒</span>
                  <span>Safe and Secure Payments, Easy Returns, 100% Authentic Products</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
