import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct, getProducts } from '../services/api.js'
import PageBanner from '../components/PageBanner.jsx'
import StarRating from '../components/StarRating.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(undefined)
  const [related, setRelated] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const [toast, setToast] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      try {
        setProduct(undefined)

        const found = await getProduct(id)

        if (!found) {
          setProduct(null)
          return
        }

        const formattedProduct = {
          ...found,
          price: Number(found.price || 0),
          oldPrice:
            found.oldPrice !== null && found.oldPrice !== undefined
              ? Number(found.oldPrice)
              : null,
          rating: Number(found.rating || 0),
          reviews: Number(found.reviews || 0),
          images:
            Array.isArray(found.images) && found.images.length > 0
              ? found.images
              : found.image
                ? [found.image]
                : [],
        }

        setProduct(formattedProduct)

        setActiveImage(0)
        setSelectedColor(formattedProduct.colors?.[0] || null)
        setSelectedSize(formattedProduct.sizes?.[0] || null)
        setQuantity(1)
        setTab('description')

        try {
          const allProducts = await getProducts()

          const relatedProducts = (Array.isArray(allProducts) ? allProducts : [])
            .filter(
              (p) =>
                p.id !== formattedProduct.id &&
                p.category === formattedProduct.category
            )
            .slice(0, 4)
            .map((p) => ({
              ...p,
              price: Number(p.price || 0),
              oldPrice:
                p.oldPrice !== null && p.oldPrice !== undefined
                  ? Number(p.oldPrice)
                  : null,
              rating: Number(p.rating || 0),
              reviews: Number(p.reviews || 0),
              images:
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images
                  : p.image
                    ? [p.image]
                    : [],
            }))

          setRelated(relatedProducts)
        } catch (error) {
          console.error('Failed to load related products:', error)
          setRelated([])
        }
      } catch (error) {
        console.error('Failed to load product:', error)
        setProduct(null)
        setRelated([])
      }
    }

    loadProduct()
  }, [id])

  useEffect(() => {
    if (!toast) return

    const t = setTimeout(() => setToast(false), 2200)

    return () => clearTimeout(t)
  }, [toast])

  if (product === undefined) {
    return (
      <section className="section">
        <div className="container">
          <div className="product-detail">
            <div
              className="skeleton"
              style={{
                aspectRatio: '1/1',
                borderRadius: 24,
              }}
            />

            <div>
              <div
                className="skeleton"
                style={{
                  height: 28,
                  width: '70%',
                  marginBottom: 16,
                }}
              />

              <div
                className="skeleton"
                style={{
                  height: 20,
                  width: '30%',
                  marginBottom: 24,
                }}
              />

              <div
                className="skeleton"
                style={{
                  height: 80,
                  width: '100%',
                  marginBottom: 24,
                }}
              />

              <div
                className="skeleton"
                style={{
                  height: 44,
                  width: '60%',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (product === null) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            emoji="🍦"
            title="Product not found"
            message="We couldn't find the flavor you're looking for. It may have melted away."
            actionTo="/shop"
            actionLabel="Back to Shop"
          />
        </div>
      </section>
    )
  }

  const wished = isWishlisted(product.id)

  function handleAddToCart() {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      quantity,
    })

    setToast(true)
  }

  return (
    <>
      <PageBanner
        title={product.name}
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          { label: 'Product Detail' },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="product-detail">

            {/* PRODUCT IMAGE GALLERY */}
            <div className="product-gallery">
              <div className="main-image">

                {product.images.length > 1 && (
                  <button
                    className="gallery-nav-btn prev"
                    onClick={() =>
                      setActiveImage(
                        (i) =>
                          (i - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                )}

                {product.images.length > 0 ? (
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                  />
                ) : (
                  <div className="empty-image">
                    No image available
                  </div>
                )}

                {product.images.length > 1 && (
                  <button
                    className="gallery-nav-btn next"
                    onClick={() =>
                      setActiveImage(
                        (i) => (i + 1) % product.images.length
                      )
                    }
                    aria-label="Next image"
                  >
                    ›
                  </button>
                )}

              </div>

              {product.images.length > 1 && (
                <div className="thumb-row">
                  {product.images.map((src, i) => (
                    <button
                      key={`${product.id}-image-${i}`}
                      type="button"
                      className={i === activeImage ? 'active' : ''}
                      onClick={() => setActiveImage(i)}
                    >
                      <img
                        src={src}
                        alt={`${product.name} thumbnail ${i + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT DETAILS */}
            <div className="product-info-panel">

              <StarRating
                rating={product.rating}
                reviews={product.reviews}
              />

              <h1>{product.name}</h1>

              <div className="price-row">
                <span className="price">
                  ₹{product.price.toFixed(2)}
                </span>

                {product.oldPrice && (
                  <span className="old-price">
                    ₹{product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="desc">
                {product.description}
              </p>

              {product.colors?.length > 0 && (
                <div className="option-block">
                  <span className="label">
                    Color:
                  </span>

                  <div className="color-swatches">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-swatch ${
                          selectedColor === color
                            ? 'active'
                            : ''
                        }`}
                        style={{ background: color }}
                        onClick={() =>
                          setSelectedColor(color)
                        }
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="option-block">
                  <span className="label">
                    Size:
                  </span>

                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={
                          selectedSize === size
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setSelectedSize(size)
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="add-to-cart-row">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() =>
                    setQuantity((q) => q + 1)
                  }
                  onDecrease={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                />

                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart →
                </button>
              </div>

              <div className="secondary-actions">
                <button
                  className={wished ? 'active' : ''}
                  onClick={() =>
                    toggleWishlist(product.id)
                  }
                >
                  {wished
                    ? '♥ Added to wishlist'
                    : '♡ Add to wishlist'}
                </button>

                <button
                  onClick={() => navigate('/shop')}
                >
                  ⇄ Compare
                </button>
              </div>

            </div>
          </div>

          {/* PRODUCT TABS */}
          <div className="product-tabs">
            <div className="tab-headers">

              <button
                className={
                  tab === 'description'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setTab('description')
                }
              >
                Description
              </button>

              <button
                className={
                  tab === 'additional'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setTab('additional')
                }
              >
                Additional Information
              </button>

              <button
                className={
                  tab === 'reviews'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setTab('reviews')
                }
              >
                Reviews
              </button>

            </div>

            {tab === 'description' && (
              <div>
                <p style={{ marginBottom: 14 }}>
                  {product.description}
                </p>

                <p>
                  Made fresh in small batches with premium
                  ingredients. Store frozen and enjoy within
                  a few scoops of opening for the best texture
                  and flavor.
                </p>
              </div>
            )}

            {tab === 'additional' && (
              <div>
                <p style={{ marginBottom: 8 }}>
                  <strong>Category:</strong>{' '}
                  {product.category
                    ? product.category.replace(/-/g, ' ')
                    : 'Not available'}
                </p>

                <p style={{ marginBottom: 8 }}>
                  <strong>Available sizes:</strong>{' '}
                  {product.sizes?.join(', ') ||
                    'One size'}
                </p>

                <p>
                  <strong>Storage:</strong> Keep frozen
                  at -18°C or below.
                </p>
              </div>
            )}

            {tab === 'reviews' && (
              <div>
                <p>
                  {product.reviews || 0} customers rated
                  this product{' '}
                  {product.rating.toFixed(1)} out of 5
                  stars.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <section className="section related-products-section">
          <div className="container">

            <div className="section-heading">
              <h2>
                Related{' '}
                <span className="accent">
                  Products
                </span>
              </h2>

              <p>
                Choose from some of related products
              </p>
            </div>

            <div className="product-grid">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>

          </div>
        </section>
      )}

      {/* CART TOAST */}
      {toast && (
        <div className="added-toast">
          <span>✔</span>

          <span>
            {product.name} added to cart.
          </span>

          <Link
            to="/cart"
            style={{
              textDecoration: 'underline',
              color: '#fff',
            }}
          >
            View Cart
          </Link>
        </div>
      )}
    </>
  )
}