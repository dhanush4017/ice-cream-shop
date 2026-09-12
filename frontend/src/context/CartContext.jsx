import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CartContext = createContext(null)

const SHIPPING_FLAT_RATE = 20 // matches the flat $20 shipping shown in the reference design

// A cart line is uniquely identified by product id + color + size,
// since the same ice cream in a different size/color is a separate line.
function lineKey({ productId, color, size }) {
  return `${productId}__${color || 'default'}__${size || 'default'}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('icytales_cart', [])

  function addToCart(product, { color, size, quantity = 1 } = {}) {
    const key = lineKey({ productId: product.id, color, size })
    setItems((prev) => {
      const existing = prev.find((line) => line.key === key)
      if (existing) {
        return prev.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + quantity } : line
        )
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          color: color || product.colors?.[0] || null,
          size: size || product.sizes?.[0] || null,
          quantity,
        },
      ]
    })
  }

  function removeFromCart(key) {
    setItems((prev) => prev.filter((line) => line.key !== key))
  }

  function updateQuantity(key, quantity) {
    if (quantity < 1) return
    setItems((prev) => prev.map((line) => (line.key === key ? { ...line, quantity } : line)))
  }

  function increaseQuantity(key) {
    setItems((prev) =>
      prev.map((line) => (line.key === key ? { ...line, quantity: line.quantity + 1 } : line))
    )
  }

  function decreaseQuantity(key) {
    setItems((prev) =>
      prev
        .map((line) => (line.key === key ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [items]
  )
  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items])
  const shipping = items.length > 0 ? SHIPPING_FLAT_RATE : 0
  const grandTotal = subtotal + shipping

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    subtotal,
    shipping,
    grandTotal,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
