import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('icytales_wishlist', [])

  function isWishlisted(productId) {
    return wishlist.includes(productId)
  }

  function toggleWishlist(productId) {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const value = { wishlist, isWishlisted, toggleWishlist }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
