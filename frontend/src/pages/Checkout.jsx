import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { createOrder } from '../services/api.js'

const LOCATION_DATA = {
  'Tamil Nadu': {
    Kanyakumari: [
      'Nagercoil',
      'Colachel',
      'Marthandam',
      'Kuzhithurai',
      'Thuckalay',
      'Kulasekaram',
      'Eraniel',
    ],
    Tirunelveli: [
      'Tirunelveli',
      'Palayamkottai',
      'Ambasamudram',
      'Nanguneri',
      'Valliyur',
      'Kalakkad',
      'Cheranmahadevi',
    ],
    Madurai: [
      'Madurai',
      'Anna Nagar',
      'KK Nagar',
      'Thirumangalam',
      'Melur',
      'Usilampatti',
      'Avaniyapuram',
    ],
    Chennai: [
      'T. Nagar',
      'Anna Nagar',
      'Adyar',
      'Velachery',
      'Tambaram',
      'Porur',
      'Ambattur',
    ],
    Coimbatore: [
      'Gandhipuram',
      'RS Puram',
      'Saibaba Colony',
      'Peelamedu',
      'Singanallur',
      'Ramanathapuram',
      'Kuniyamuthur',
    ],
    Salem: [
      'Salem',
      'Hasthampatti',
      'Fairlands',
      'Ammapet',
      'Suramangalam',
      'Kondalampatti',
      'Seelanaickenpatti',
    ],
  },

  Kerala: {
    Thiruvananthapuram: [
      'Thiruvananthapuram',
      'Neyyattinkara',
      'Attingal',
      'Varkala',
      'Kazhakkoottam',
      'Kovalam',
      'Nedumangad',
    ],
    Kollam: [
      'Kollam',
      'Karunagappally',
      'Kottarakkara',
      'Punalur',
      'Paravur',
      'Kundara',
      'Chathannoor',
    ],
    Pathanamthitta: [
      'Pathanamthitta',
      'Adoor',
      'Thiruvalla',
      'Ranni',
      'Konni',
      'Pandalam',
      'Aranmula',
    ],
    Alappuzha: [
      'Alappuzha',
      'Cherthala',
      'Kayamkulam',
      'Haripad',
      'Chengannur',
      'Ambalappuzha',
      'Mavelikkara',
    ],
    Ernakulam: [
      'Kochi',
      'Aluva',
      'Kalamassery',
      'Kakkanad',
      'Perumbavoor',
      'Angamaly',
      'Tripunithura',
    ],
    Kozhikode: [
      'Kozhikode',
      'Vadakara',
      'Koyilandy',
      'Feroke',
      'Ramanattukara',
      'Beypore',
      'Nadapuram',
    ],
  },
}

const STATES = Object.keys(LOCATION_DATA)

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  state: '',
  district: '',
  city: '',
  zip: '',
  cardNumber: '',
  expMonth: '',
  expYear: '',
  cvv: '',
}

export default function Checkout() {
  const { items, subtotal, shipping, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const couponCode = (() => {
    try {
      return (window.localStorage.getItem('icytales_coupon') || '').trim().toUpperCase()
    } catch {
      return ''
    }
  })()

  const discountRate =
    couponCode === 'SUMMER50' || couponCode === 'SWEET10' ? 0.10 : 0

  const discountAmount = subtotal * discountRate
  const checkoutTotal = Math.max(0, subtotal - discountAmount + shipping)

  const districts = form.state
    ? Object.keys(LOCATION_DATA[form.state])
    : []

  const areas =
    form.state && form.district
      ? LOCATION_DATA[form.state][form.district]
      : []

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleStateChange(value) {
    setForm((prev) => ({
      ...prev,
      state: value,
      district: '',
      city: '',
    }))

    setErrors((prev) => ({
      ...prev,
      state: undefined,
      district: undefined,
      city: undefined,
    }))
  }

  function handleDistrictChange(value) {
    setForm((prev) => ({
      ...prev,
      district: value,
      city: '',
    }))

    setErrors((prev) => ({
      ...prev,
      district: undefined,
      city: undefined,
    }))
  }

  function validate() {
    const next = {}

    if (!form.firstName.trim()) {
      next.firstName = 'First name is required.'
    }

    if (!form.lastName.trim()) {
      next.lastName = 'Last name is required.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }

    if (!form.state) {
      next.state = 'Select a state.'
    }

    if (!form.district) {
      next.district = 'Select a district.'
    }

    if (!form.city) {
      next.city = 'Select an area.'
    }

    if (!form.zip.trim()) {
      next.zip = 'Zip / postal code is required.'
    }

    if (paymentMethod === 'card') {
      if (!/^\d{12,19}$/.test(form.cardNumber.replace(/\s/g, ''))) {
        next.cardNumber = 'Enter a valid card number.'
      }

      if (!form.expMonth) {
        next.expMonth = 'Required'
      }

      if (!form.expYear) {
        next.expYear = 'Required'
      }

      if (!/^\d{3,4}$/.test(form.cvv)) {
        next.cvv = 'Enter a valid security code.'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handlePlaceOrder(e) {
    e.preventDefault()

    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const order = await createOrder({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        state: form.state,

        // Existing backend city field stores the selected Area.
        city: form.city,

        zip: form.zip,
        paymentMethod,
        couponCode,
        items: items.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          size: line.size,
          color: line.color,
        })),
      })

      const successOrder = {
        orderNumber: order.orderNumber,
        items,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        discount: Number(order.discount || 0),
        grandTotal: Number(order.grandTotal),
        customer: {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
        },
        paymentMethod: order.paymentMethod,
        placedAt: order.createdAt,
        status: order.status,
      }

      try {
        window.localStorage.setItem(
          'icytales_last_order',
          JSON.stringify(successOrder)
        )
        window.localStorage.removeItem('icytales_coupon')
      } catch (err) {
        console.warn('Could not persist order:', err)
      }

      clearCart()
      navigate('/order-success', { state: successOrder })
    } catch (error) {
      setSubmitError(
        error.message ||
          'Unable to place the order. Make sure the Spring Boot backend is running.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <PageBanner
          title="Checkout"
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Cart', to: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <section className="section">
          <div className="container">
            <EmptyState
              emoji="🧾"
              title="Nothing to check out yet"
              message="Add a few sweet treats to your cart before heading to checkout."
              actionTo="/shop"
              actionLabel="Browse the Shop"
            />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageBanner
        title="Checkout"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Cart', to: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <section className="section">
        <div className="container">
          <form
            className="checkout-layout"
            onSubmit={handlePlaceOrder}
            noValidate
          >
            <div className="form-section">
              <h3>Billing Address</h3>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) =>
                      updateField('firstName', e.target.value)
                    }
                  />
                  {errors.firstName && (
                    <span className="field-error">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) =>
                      updateField('lastName', e.target.value)
                    }
                  />
                  {errors.lastName && (
                    <span className="field-error">
                      {errors.lastName}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField('email', e.target.value)
                    }
                  />
                  {errors.email && (
                    <span className="field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="state">State</label>

                  <select
                    id="state"
                    value={form.state}
                    onChange={(e) =>
                      handleStateChange(e.target.value)
                    }
                  >
                    <option value="">Select State</option>

                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <span className="field-error">
                      {errors.state}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="district">District</label>

                  <select
                    id="district"
                    value={form.district}
                    onChange={(e) =>
                      handleDistrictChange(e.target.value)
                    }
                    disabled={!form.state}
                  >
                    <option value="">Select District</option>

                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>

                  {errors.district && (
                    <span className="field-error">
                      {errors.district}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="city">Area</label>

                  <select
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      updateField('city', e.target.value)
                    }
                    disabled={!form.district}
                  >
                    <option value="">Select Area</option>

                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>

                  {errors.city && (
                    <span className="field-error">
                      {errors.city}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="zip">Zip / postal code</label>

                  <input
                    id="zip"
                    value={form.zip}
                    onChange={(e) =>
                      updateField('zip', e.target.value)
                    }
                  />

                  {errors.zip && (
                    <span className="field-error">
                      {errors.zip}
                    </span>
                  )}
                </div>
              </div>

              <h3>Payment Method</h3>

              <div className="payment-methods">
                <div className="payment-option">
                  <label className="payment-option-header">
                    <span className="left">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() =>
                          setPaymentMethod('card')
                        }
                      />
                      Credit Card
                    </span>

                    <span>💳</span>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="payment-option-body">
                      <div className="form-grid">
                        <div className="form-field full">
                          <label htmlFor="cardNumber">
                            Card number
                          </label>

                          <input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={form.cardNumber}
                            onChange={(e) =>
                              updateField(
                                'cardNumber',
                                e.target.value
                              )
                            }
                          />

                          {errors.cardNumber && (
                            <span className="field-error">
                              {errors.cardNumber}
                            </span>
                          )}
                        </div>

                        <div className="form-field">
                          <label htmlFor="expMonth">
                            Expiration date
                          </label>

                          <select
                            id="expMonth"
                            value={form.expMonth}
                            onChange={(e) =>
                              updateField(
                                'expMonth',
                                e.target.value
                              )
                            }
                          >
                            <option value="">Month</option>

                            {Array.from(
                              { length: 12 },
                              (_, i) => i + 1
                            ).map((m) => (
                              <option key={m} value={m}>
                                {String(m).padStart(2, '0')}
                              </option>
                            ))}
                          </select>

                          {errors.expMonth && (
                            <span className="field-error">
                              {errors.expMonth}
                            </span>
                          )}
                        </div>

                        <div className="form-field">
                          <label htmlFor="expYear">
                            &nbsp;
                          </label>

                          <select
                            id="expYear"
                            value={form.expYear}
                            onChange={(e) =>
                              updateField(
                                'expYear',
                                e.target.value
                              )
                            }
                          >
                            <option value="">Year</option>

                            {Array.from(
                              { length: 8 },
                              (_, i) => 2025 + i
                            ).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>

                          {errors.expYear && (
                            <span className="field-error">
                              {errors.expYear}
                            </span>
                          )}
                        </div>

                        <div className="form-field">
                          <label htmlFor="cvv">
                            Security code
                          </label>

                          <input
                            id="cvv"
                            placeholder="CVV"
                            value={form.cvv}
                            onChange={(e) =>
                              updateField(
                                'cvv',
                                e.target.value
                              )
                            }
                          />

                          {errors.cvv && (
                            <span className="field-error">
                              {errors.cvv}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="payment-option">
                  <label className="payment-option-header">
                    <span className="left">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() =>
                          setPaymentMethod('cod')
                        }
                      />
                      Cash on Delivery
                    </span>

                    <span>💵</span>
                  </label>
                </div>
              </div>

              <p className="terms-note">
                By clicking the button, you agree to the Terms and Conditions
              </p>

              {submitError && (
                <p
                  className="field-error"
                  style={{ marginBottom: 14 }}
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting
                  ? 'Placing Order…'
                  : 'Place Order Now →'}
              </button>
            </div>

            <aside className="checkout-summary-card">
              <h3>Order Summary</h3>

              {items.map((line) => (
                <div
                  key={line.key}
                  className="checkout-line-item"
                >
                  <div className="info">
                    <div className="qty-name">
                      {line.quantity} x {line.name}
                    </div>
<div className="desc">
  {line.size
    ? `Size: ${line.size}`
    : ''}
</div>
</div>

<div className="price">
  ₹{(line.price * line.quantity).toFixed(2)}
</div>
</div>
))}

<div
  className="summary-line"
  style={{ marginTop: 14 }}
>
  <span>Sub Total</span>
  <span>₹{subtotal.toFixed(2)}</span>
</div>

<div className="summary-line">
  <span>Shipping</span>
  <span>₹{shipping.toFixed(2)}</span>
</div>

{discountRate > 0 && (
  <div className="summary-line">
    <span>Discount</span>
    <span>
      −₹{discountAmount.toFixed(2)}
    </span>
  </div>
)}

<div
  className="checkout-grand-total"
>
  <span>Grand Total</span>

  <span className="value">
    ₹{checkoutTotal.toFixed(2)}
  </span>
</div>
</aside>
</form>
</div>
</section>
</>
)
}