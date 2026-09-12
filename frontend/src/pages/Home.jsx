import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PRODUCTS, CATEGORIES } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import Newsletter from '../components/Newsletter.jsx'

const CATEGORY_IMAGES = {
  'ice-cream-cones': '/product-images/product-01.jpg',
  sundaes: '/product-images/product-12.jpg',
  milkshakes: '/product-images/product-18.jpg',
  gelato: '/product-images/product-21.jpg',
  'ice-cream-cakes': '/product-images/product-24.jpg',
}


const TESTIMONIALS = [
  { name: 'Kevin Andrew', role: 'Happy Client', quote: 'The classic vanilla cone tastes exactly like the ice cream truck treats I loved as a kid. Absolutely delightful every single time.', avatar: '/product-images/product-03.jpg' },
  { name: 'Peri James', role: 'Happy Client', quote: 'Their gelato is unbelievably smooth and rich. The pistachio flavor has become a weekly must-have for our whole family.', avatar: '/product-images/product-14.jpg' },
  { name: 'Naurth Reough', role: 'Happy Client', quote: 'Fast delivery, beautiful packaging, and the sundaes are as good as the photos. IcyTales is now our go-to dessert spot.', avatar: '/product-images/product-20.jpg' },
]

const INSTAGRAM_IMAGES = [
  '/product-images/product-04.jpg', '/product-images/product-09.jpg', '/product-images/product-13.jpg',
  '/product-images/product-19.jpg', '/product-images/product-25.jpg',
]

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const favorites = PRODUCTS.slice(0, 4)
  const bestSellers = PRODUCTS.filter((p) => p.badge === 'Best Seller' || p.badge === 'Sale').slice(0, 4)

  function handleHeroSearch(e) {
    e.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {/* Hero */}
      <section className="hero"><div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
        <div className="container">
          <div>
            <h1>
              Discover <span className="accent">Sweet</span> Delights!
            </h1>
            <p>
              Relive the sweet memories of classic ice creams. From rich chocolate fudge to creamy
              vanilla sundaes, discover our stories of passion and creation.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Explore the Menu →
            </Link>
          <form className="hero-search" onSubmit={handleHeroSearch}>
  <div className="search-icon">⌕</div>

  <input
    type="text"
    placeholder="Search flavors, sundaes, gelato..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />

  <button type="submit">
    Search <span>→</span>
  </button>
</form>
          </div>
          <div className="hero-image"> 
  <img 
    src="/product-images/product-27.png" 
    alt="Ice cream" 
  />
</div>
        </div>
      </section>

      {/* Our Classic Favorites */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>
              Our Classic <span className="accent">Favorites</span>
            </h2>
            <p>Check our exciting products that our customers love.</p>
          </div>
          <div className="product-grid">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>
              Explore Our <span className="accent">Categories</span>
            </h2>
            <p>Browse through our different categories to find your favorite ice cream treats.</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link key={cat.slug} to={`/shop?category=${cat.slug}`} className="category-card">
                <img src={CATEGORY_IMAGES[cat.slug] || CATEGORY_IMAGES['ice-cream-cones']} alt={cat.label} />
                <div className="category-label">
                  <span>{cat.label}</span>
                  <span className="arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Summer Special Promo */}
      <section className="section">
        <div className="promo-banner">
          <div className="promo-text">
            <h2>Summer Special!</h2>
            <p>Buy One Sundae, Get One 50% Off! Use code: SUMMER50 at checkout.</p>
            <Link to="/shop" className="btn btn-primary">
              Get This Deal →
            </Link>
          </div>
          <div className="promo-image">
            <img
              src="/product-images/product-12.jpg"
              alt="Bowl of chocolate and vanilla ice cream scoops"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>
              Our Best <span className="accent">Sellers</span>
            </h2>
            <p>Discover the favorites that keep our customers coming back for more.</p>
          </div>
          <div className="product-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>
              Hear from Our Happy <span className="accent">Ice Cream Lovers</span>
            </h2>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p className="body">{t.quote}</p>
                <div className="testimonial-person">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="stars">★★★★★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Instagram */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>
              Follow Us on <span className="accent">Instagram</span>
            </h2>
          </div>
          <div className="instagram-grid">
            {INSTAGRAM_IMAGES.map((src, i) => (
              <img key={i} src={src} alt="IcyTales on Instagram" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
