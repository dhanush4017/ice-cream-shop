import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/wishlist', label: 'Wishlist' },
]

export default function Header() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearchSubmit(e) {
    e.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="site-header">
      <div className="container">
        <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
          🍦 Icy<span>Tales</span>
        </NavLink>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            🔍
          </button>
          <NavLink to="/cart" className="cart-icon-wrap">
            <span className="icon-btn" aria-label="Cart">
              🛍️
            </span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
          <NavLink to="/shop" className="btn btn-primary btn-sm">
            Shop Now →
          </NavLink>
          <button
            className="mobile-nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header-search">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              autoFocus
              placeholder="Search for ice cream, gelato, sundaes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
