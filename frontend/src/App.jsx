import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import About from './pages/About.jsx'
import Wishlist from './pages/Wishlist.jsx'
import NotFound from './pages/NotFound.jsx'
import Orders from './pages/Orders.jsx'
import OrderTracking from './pages/OrderTracking.jsx'
import Admin from './pages/Admin.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import { useAuth } from './context/AuthContext.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppLayout() {
  const { user } = useAuth()
  return (
    <div className="app-shell">
      <ScrollToTop />
      {user && <Header />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderNumber" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
    </div>
  )
}

export default function App() {
  return <AppLayout />
}
