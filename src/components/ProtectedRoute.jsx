import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, hasRegisteredOnThisBrowser } = useAuth()
  const location = useLocation()

  if (user) return <Outlet />

  if (!hasRegisteredOnThisBrowser() && location.pathname !== '/register') {
    return <Navigate to="/register" replace />
  }

  return <Navigate to="/login" state={{ from: location.pathname }} replace />
}
