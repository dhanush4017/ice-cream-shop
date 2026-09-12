import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/shop', label: 'Shop', icon: '✦' },
  { to: '/about', label: 'About Us', icon: '♡' },
  { to: '/wishlist', label: 'Wishlist', icon: '♥' },
  { to: '/orders', label: 'My Orders', icon: '◷' },
]

export default function Header() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const [menuOpen,setMenuOpen]=useState(false)
  const [searchOpen,setSearchOpen]=useState(false)
  const [query,setQuery]=useState('')
  const navigate=useNavigate()

  useEffect(()=>{
    document.body.classList.toggle('nav-drawer-open',menuOpen)
    return ()=>document.body.classList.remove('nav-drawer-open')
  },[menuOpen])

  function submit(e){ e.preventDefault(); navigate(`/shop?search=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery('') }
  function close(){ setMenuOpen(false) }

  return <header className="site-header">
    <div className="container header-bar">
      <NavLink to="/" className="logo" onClick={close}>🍦 Icy<span>Tales</span></NavLink>

      <nav className={`main-nav ${menuOpen?'open':''}`} aria-label="Primary navigation">
        <div className="mobile-drawer-head">
          <div><strong>Sweet menu</strong><span>Welcome to IcyTales ✨</span></div>
          <button className="drawer-close" onClick={close} aria-label="Close menu">×</button>
        </div>
        {NAV_LINKS.map(link=><NavLink key={link.to} to={link.to} end={link.to==='/'}
          className={({isActive})=>isActive?'active':''} onClick={close}>
          <span className="drawer-icon">{link.icon}</span>{link.label}
        </NavLink>)}
        {user?.role === 'ADMIN' && <NavLink to="/admin" className={({isActive})=>`admin-nav-link ${isActive?'active':''}`} onClick={close}>
          <span className="drawer-icon">⚡</span>Admin Panel
        </NavLink>}
        <button className="drawer-logout" onClick={()=>{close();logout()}}>Logout <span>↗</span></button>
      </nav>

      {menuOpen && <button className="drawer-backdrop" onClick={close} aria-label="Close navigation" />}

      <div className="header-actions">
        <button className="icon-btn" aria-label="Search" onClick={()=>setSearchOpen(v=>!v)}>⌕</button>
        <NavLink to="/cart" className="cart-icon-wrap"><span className="icon-btn" aria-label="Cart">🛍️</span>{itemCount>0&&<span className="cart-badge">{itemCount}</span>}</NavLink>
        <NavLink to="/shop" className="btn btn-primary btn-sm desktop-shop">Shop Now →</NavLink>
        <button className={`mobile-nav-toggle ${menuOpen?'is-open':''}`} onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    {searchOpen&&<div className="header-search"><form onSubmit={submit}><input autoFocus placeholder="Search for ice cream, gelato, sundaes..." value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit" className="btn btn-primary btn-sm">Search</button></form></div>}
  </header>
}
