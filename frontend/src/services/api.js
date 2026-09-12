const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function token() {
  try { return localStorage.getItem('icytales-token') || '' } catch { return '' }
}
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const t=token(); if(t) headers.Authorization=`Bearer ${t}`
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const text=await response.text(); let data=null
  try { data=text ? JSON.parse(text) : null } catch { data=text }
  if(!response.ok) throw new Error(data?.message || 'Something went wrong. Please try again.')
  return data
}
export function createOrder(payload){ return request('/orders',{method:'POST',body:JSON.stringify(payload)}) }
export function getMyOrders(){ return request('/orders/mine') }
export function getMyOrder(orderNumber){ return request(`/orders/mine/${encodeURIComponent(orderNumber)}`) }
export function getAdminStats(){ return request('/admin/stats') }
export function getAdminOrders(){ return request('/orders') }
export function updateOrderStatus(orderNumber,status){ return request(`/orders/${encodeURIComponent(orderNumber)}/status`,{method:'PUT',body:JSON.stringify({status})}) }
export function getAdminProducts(){ return request('/admin/products') }
export function createAdminProduct(payload){ return request('/admin/products',{method:'POST',body:JSON.stringify(payload)}) }
export function updateAdminProduct(id,payload){ return request(`/admin/products/${encodeURIComponent(id)}`,{method:'PUT',body:JSON.stringify(payload)}) }
export function deleteAdminProduct(id){ return request(`/admin/products/${encodeURIComponent(id)}`,{method:'DELETE'}) }
export function getAdminUsers(){ return request('/admin/users') }
export function subscribeToNewsletter(email){ return request('/newsletter/subscribe',{method:'POST',body:JSON.stringify({email})}) }
export function getProducts(category=''){ return request(`/products${category?`?category=${encodeURIComponent(category)}`:''}`) }
export function getProduct(id){ return request(`/products/${encodeURIComponent(id)}`) }
export { API_BASE_URL }
export function registerUser(payload){ return request('/auth/register',{method:'POST',body:JSON.stringify(payload)}) }
export function loginUser(payload){ return request('/auth/login',{method:'POST',body:JSON.stringify(payload)}) }
