import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'
import { getMyOrders } from '../services/api.js'

const steps=['PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED']
const labels={PLACED:'Order Placed',CONFIRMED:'Confirmed',PREPARING:'Preparing',OUT_FOR_DELIVERY:'Out for Delivery',DELIVERED:'Delivered',CANCELLED:'Cancelled'}
function progress(status){return status==='CANCELLED'?-1:Math.max(0,steps.indexOf(status))}
export default function Orders(){
 const [orders,setOrders]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('')
 useEffect(()=>{getMyOrders().then(setOrders).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[])
 return <><PageBanner title="My Orders" crumbs={[{label:'Home',to:'/'},{label:'My Orders'}]}/><section className="section"><div className="container orders-page">
  <div className="orders-heading"><div><span className="eyebrow">YOUR SWEET JOURNEY</span><h2>My Orders</h2><p>Follow every treat from our kitchen to your doorstep.</p></div><Link className="btn btn-primary btn-sm" to="/shop">Continue Shopping →</Link></div>
  {loading?<div className="orders-empty">Loading your orders…</div>:error?<div className="orders-empty error">{error}</div>:orders.length===0?<div className="orders-empty"><div>🍨</div><h3>No orders yet</h3><p>Your next delicious order will appear here.</p><Link className="btn btn-primary" to="/shop">Explore IcyTales</Link></div>:
   <div className="orders-list">{orders.map(o=><article className="order-card" key={o.orderNumber}>
    <div className="order-card-top"><div><span className="order-label">ORDER</span><strong>{o.orderNumber}</strong><small>{o.createdAt?new Date(o.createdAt).toLocaleString():''}</small></div><span className={`status-pill ${o.status.toLowerCase()}`}>{labels[o.status]||o.status}</span></div>
    <div className="order-items">{o.items?.map((i,idx)=><div className="order-item" key={idx}><span>{i.productName}</span><span>× {i.quantity}</span><b>₹{Number(i.unitPrice*i.quantity).toFixed(2)}</b></div>)}</div>
    <div className="tracking-mini">{o.status==='CANCELLED'?<div className="cancelled-track">✕ <span>This order was cancelled.</span></div>:steps.map((s,i)=><div className={`track-dot ${i<=progress(o.status)?'done':''} ${i===progress(o.status)?'current':''}`} key={s}><span>{i<progress(o.status)?'✓':i+1}</span><small>{labels[s]}</small></div>)}</div>
    <div className="order-card-bottom"><b>Total ₹{Number(o.grandTotal).toFixed(2)}</b><Link to={`/orders/${o.orderNumber}`} className="btn btn-outline btn-sm">Track Order →</Link></div>
   </article>)}</div>}
 </div></section></>
}
