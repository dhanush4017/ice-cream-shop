import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
export default function AdminRoute(){
 const {user}=useAuth(); const loc=useLocation()
 if(!user) return <Navigate to="/login" state={{from:loc.pathname}} replace/>
 if(user.role!=='ADMIN') return <Navigate to="/" replace/>
 return <Outlet/>
}
