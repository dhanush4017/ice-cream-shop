const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.')
  }
  return data
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function subscribeToNewsletter(email) {
  return request('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function getProducts(category = '') {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/products${query}`)
}

export function getProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`)
}

export { API_BASE_URL }

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
