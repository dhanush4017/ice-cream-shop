import {useEffect,useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import PageBanner from '../components/PageBanner.jsx'
import {getMyOrder} from '../services/api.js'
const steps=['PLACED','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED']
const labels={PLACED:'Order Placed',CONFIRMED:'Confirmed',PREPARING:'Preparing',OUT_FOR_DELIVERY:'Out for Delivery',DELIVERED:'Delivered',CANCELLED:'Cancelled'}
export default function OrderTracking(){
 const {orderNumber}=useParams(); const [o,setO]=useState(null),[error,setError]=useState('')
 useEffect(()=>{let alive=true; const load=()=>getMyOrder(orderNumber).then(v=>{if(alive)setO(v)}).catch(e=>{if(alive)setError(e.message)}); load(); const timer=setInterval(load,15000); return ()=>{alive=false;clearInterval(timer)}},[orderNumber])
 if(error)return <><PageBanner title="Order Tracking" crumbs={[{label:'Home',to:'/'},{label:'My Orders',to:'/orders'},{label:'Tracking'}]}/><div className="section"><div className="container orders-empty error">{error}</div></div></>
 if(!o)return <div className="section"><div className="container orders-empty">Loading order…</div></div>
 const current=steps.indexOf(o.status)
 return <><PageBanner title="Track Your Order" crumbs={[{label:'Home',to:'/'},{label:'My Orders',to:'/orders'},{label:orderNumber}]}/><section className="section"><div className="container tracking-page">
  <div className="tracking-hero"><div><span className="eyebrow">ICyTALES DELIVERY</span><h2>{o.status==='DELIVERED'?'Your sweet order has arrived!':o.status==='CANCELLED'?'Order cancelled':'We are preparing your sweetness.'}</h2><p>Order <strong>{o.orderNumber}</strong> · {o.createdAt?new Date(o.createdAt).toLocaleString():''}</p></div><span className={`status-pill ${o.status.toLowerCase()}`}>{labels[o.status]||o.status}</span></div>
  {o.status==='CANCELLED'?<div className="cancelled-panel">✕ <div><strong>This order was cancelled.</strong><p>If you think this is a mistake, please contact IcyTales support.</p></div></div>:
  <div className="tracking-timeline">{steps.map((s,i)=><div className={`timeline-step ${i<=current?'complete':''} ${i===current?'current':''}`} key={s}><div className="timeline-node">{i<current?'✓':i+1}</div><div><h3>{labels[s]}</h3><p>{i<current?'Completed':i===current?'Current status':'Coming next'}</p></div></div>)}</div>}
  <div className="tracking-grid"><div className="tracking-panel"><h3>Items in this order</h3>{o.items?.map((i,n)=><div className="tracking-item" key={n}><div><b>{i.productName}</b><span>Quantity {i.quantity}{i.size?` · ${i.size}`:''}</span></div><strong>₹{Number(i.unitPrice*i.quantity).toFixed(2)}</strong></div>)}</div>
  <div className="tracking-panel"><h3>Order total</h3><div className="total-row"><span>Subtotal</span><b>₹{Number(o.subtotal).toFixed(2)}</b></div><div className="total-row"><span>Shipping</span><b>₹{Number(o.shipping).toFixed(2)}</b></div><div className="total-row grand"><span>Total</span><b>₹{Number(o.grandTotal).toFixed(2)}</b></div><Link className="btn btn-outline btn-block" to="/orders">← Back to My Orders</Link></div></div>
 </div></section></>
}
