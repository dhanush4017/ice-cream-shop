import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import StarRating from './StarRating.jsx'

export default function ProductCard({ product, onAdded }) {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const wished = isWishlisted(product.id)

  function handleAdd(e) {
    e.preventDefault()
    addToCart(product, { quantity: 1 })
    onAdded?.(product)
  }

  function handleWishlist(e) {
    e.preventDefault()
    toggleWishlist(product.id)
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-thumb">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <button
        type="button"
        className={`wishlist-toggle ${wished ? 'active' : ''}`}
        onClick={handleWishlist}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wished ? '♥' : '♡'}
      </button>
      <div className="product-info">
        <StarRating rating={product.rating} />
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-price-row">
          <span className="product-price">
            {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
            ${product.price.toFixed(2)}
          </span>
          <button
            type="button"
            className="add-cart-icon-btn"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            title="Add to Cart"
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  )
}
