import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About Us' },
  { to: '/wishlist', label: 'Wishlist' },
]

export default function Header() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()

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

  function handleLogout() {
    logout()
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container">

        {/* LOGO */}
        <NavLink
          to="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          🍦 Icy<span>Tales</span>
        </NavLink>

        {/* NAVIGATION */}
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>

          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'active' : ''
              }
              onClick={() => setMenuOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}

          {/* SAME ONE LOGOUT BUTTON */}
          {user && (
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              title={`Logout ${user?.name || ''}`}
            >
              <span className="logout-icon">↪</span>
              <span>Logout</span>
            </button>
          )}

        </nav>

        {/* HEADER ACTIONS */}
        <div className="header-actions">

          {/* SEARCH */}
          <button
            type="button"
            className="icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            🔍
          </button>

          {/* CART */}
          <NavLink
            to="/cart"
            className="cart-icon-wrap"
          >
            <span
              className="icon-btn"
              aria-label="Cart"
            >
              🛍️
            </span>

            {itemCount > 0 && (
              <span className="cart-badge">
                {itemCount}
              </span>
            )}
          </NavLink>

          {/* SHOP NOW */}
          <NavLink
            to="/shop"
            className="btn btn-primary btn-sm"
          >
            Shop Now →
          </NavLink>

          {/* MOBILE MENU */}
          <button
            type="button"
            className={`mobile-nav-toggle ${
              menuOpen ? 'menu-active' : ''
            }`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>
      </div>

      {/* SEARCH */}
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

            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Search
            </button>

          </form>
        </div>
      )}
    </header>
  )
}