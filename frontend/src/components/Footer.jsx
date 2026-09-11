import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo">
              🍦 Icy<span>Tales</span>
            </Link>
            <p>
              Handcrafted ice cream and gelato made with the finest natural ingredients,
              serving sweet moments since day one.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="Instagram">ig</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/shop">Products</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in Touch</h4>
            <div className="contact-line">
              <span>📍</span>
              <span>
                <strong>Address</strong>
                121 King Street Melbourne, 3000, Australia
              </span>
            </div>
            <div className="contact-line">
              <span>✉️</span>
              <span>
                <strong>Email</strong>
                info@example.com
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Call Us</h4>
            <div className="contact-line">
              <span>📞</span>
              <span>
                <strong>+123 456 780 123</strong>
                Got questions? Call us 24/7
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          Copyright © {new Date().getFullYear()} IcyTales. All rights reserved.
        </div>
      </footer>

      {showScrollTop && (
        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  )
}
