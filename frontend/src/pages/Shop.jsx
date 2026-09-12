import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import PageBanner from '../components/PageBanner.jsx'
import StarRating from '../components/StarRating.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProducts } from '../services/api.js'

const PAGE_SIZE = 6

const SORT_OPTIONS = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeCategories, setActiveCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )

  const [maxPrice, setMaxPrice] = useState(0)
  const [sort, setSort] = useState('default')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  // Fetch products from backend API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const data = await getProducts()

        const formattedProducts = (Array.isArray(data) ? data : []).map((product) => ({
          ...product,
          price: Number(product.price || 0),
          oldPrice:
            product.oldPrice !== null && product.oldPrice !== undefined
              ? Number(product.oldPrice)
              : null,
          rating: Number(product.rating || 0),
          reviews: Number(product.reviews || 0),
          images:
            Array.isArray(product.images) && product.images.length > 0
              ? product.images
              : product.image
                ? [product.image]
                : [],
        }))

        setProducts(formattedProducts)

        const highestPrice = formattedProducts.length
          ? Math.ceil(Math.max(...formattedProducts.map((p) => p.price)))
          : 0

        setMaxPrice(highestPrice)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('Failed to load products. Please try again.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Keep the URL in sync
  useEffect(() => {
    const params = {}

    if (search) {
      params.search = search
    }

    if (activeCategories.length === 1) {
      params.category = activeCategories[0]
    }

    setSearchParams(params, { replace: true })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategories])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [search, activeCategories, maxPrice, sort])

  function toggleCategory(slug) {
    setActiveCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    )
  }

  const featuredProducts = products
    .filter((p) => p.oldPrice)
    .slice(0, 4)

  const filtered = useMemo(() => {
    let list = [...products]

    if (search.trim()) {
      const q = search.trim().toLowerCase()

      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }

    if (activeCategories.length > 0) {
      list = list.filter((p) =>
        activeCategories.includes(p.category)
      )
    }

    list = list.filter((p) => p.price <= maxPrice)

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break

      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break

      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating)
        break

      case 'name-asc':
        list.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '')
        )
        break

      default:
        break
    }

    return list
  }, [products, search, activeCategories, maxPrice, sort])

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  function categoryCount(slug) {
    return products.filter((p) => p.category === slug).length
  }

  return (
    <>
      <PageBanner
        title="Shop"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shop' },
        ]}
      />

      <section className="section">
        <div className="container">

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>Loading products...</h3>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h3>{error}</h3>
              <p>Please check whether the backend is running.</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="shop-toolbar">

                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <span>🔍</span>
                </div>

                <div className="toolbar-right">

                  <div className="view-toggle">
                    <button
                      className={view === 'grid' ? 'active' : ''}
                      onClick={() => setView('grid')}
                      aria-label="Grid view"
                    >
                      ▦
                    </button>

                    <button
                      className={view === 'list' ? 'active' : ''}
                      onClick={() => setView('list')}
                      aria-label="List view"
                    >
                      ☰
                    </button>
                  </div>

                  <span>
                    Showing{' '}
                    {filtered.length === 0
                      ? 0
                      : (page - 1) * PAGE_SIZE + 1}
                    -
                    {Math.min(
                      page * PAGE_SIZE,
                      filtered.length
                    )}{' '}
                    of {filtered.length} results
                  </span>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>

                </div>
              </div>

              <div className="shop-layout">

                <aside className="shop-sidebar">

                  <div className="filter-block">
                    <h4>Categories</h4>

                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.slug}
                        className={`category-option ${
                          activeCategories.includes(cat.slug)
                            ? 'active'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={activeCategories.includes(cat.slug)}
                          onChange={() =>
                            toggleCategory(cat.slug)
                          }
                        />

                        {cat.label} ({categoryCount(cat.slug)})
                      </label>
                    ))}
                  </div>

                  <div className="filter-block">
                    <h4>Filter By Price</h4>

                    <div className="price-range-value">
                      ₹0 - ₹{maxPrice}
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(Number(e.target.value))
                      }
                      style={{
                        width: '100%',
                        accentColor: 'var(--color-pink)',
                      }}
                    />
                  </div>

                  <div className="filter-block">
                    <h4>Featured Products</h4>

                    {featuredProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="featured-mini-product"
                      >
                        {p.images?.length > 0 && (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                          />
                        )}

                        <div>
                          <div className="name">
                            {p.name}
                          </div>

                          <div className="price">
                            {p.oldPrice && (
                              <span className="old-price">
                                ₹{p.oldPrice.toFixed(2)}
                              </span>
                            )}

                            <span className="new-price">
                              ₹{p.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {(search ||
                    activeCategories.length > 0 ||
                    maxPrice < (
                      products.length
                        ? Math.ceil(
                            Math.max(
                              ...products.map((p) => p.price)
                            )
                          )
                        : 0
                    )) && (
                    <button
                      className="btn btn-outline btn-sm btn-block"
                      onClick={() => {
                        setSearch('')
                        setActiveCategories([])

                        const highestPrice = products.length
                          ? Math.ceil(
                              Math.max(
                                ...products.map((p) => p.price)
                              )
                            )
                          : 0

                        setMaxPrice(highestPrice)
                      }}
                    >
                      Clear Filters
                    </button>
                  )}

                </aside>

                <div>

                  {filtered.length === 0 ? (
                    <EmptyState
                      emoji="🔍"
                      title="No products found"
                      message="Try adjusting your search or filters to find what you're craving."
                      actionTo="/shop"
                      actionLabel="Reset Filters"
                    />
                  ) : view === 'grid' ? (
                    <div className="product-grid cols-3">
                      {paginated.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>

                      {paginated.map((product) => (
                        <div
                          key={product.id}
                          className="product-list-row"
                        >

                          <Link to={`/product/${product.id}`}>
                            {product.images?.length > 0 && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                              />
                            )}
                          </Link>

                          <div className="info">

                            <StarRating
                              rating={product.rating}
                              reviews={product.reviews}
                            />

                            <h3 className="product-name">
                              <Link
                                to={`/product/${product.id}`}
                              >
                                {product.name}
                              </Link>
                            </h3>

                            <p className="product-desc">
                              {product.description}
                            </p>

                            <div className="product-price-row">

                              <span className="product-price">
                                ₹{product.price.toFixed(2)}
                              </span>

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  addToCart(product, {
                                    quantity: 1,
                                  })
                                }
                              >
                                Add to Cart →
                              </button>

                            </div>

                          </div>
                        </div>
                      ))}

                    </div>
                  )}

                  {filtered.length > 0 &&
                    totalPages > 1 && (
                      <div className="pagination">

                        <button
                          onClick={() =>
                            setPage((p) =>
                              Math.max(1, p - 1)
                            )
                          }
                          disabled={page === 1}
                          aria-label="Previous page"
                        >
                          ‹
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((n) => (
                          <button
                            key={n}
                            className={
                              page === n ? 'active' : ''
                            }
                            onClick={() => setPage(n)}
                          >
                            {n}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setPage((p) =>
                              Math.min(
                                totalPages,
                                p + 1
                              )
                            )
                          }
                          disabled={
                            page === totalPages
                          }
                          aria-label="Next page"
                        >
                          ›
                        </button>

                      </div>
                    )}

                </div>
              </div>
            </>
          )}

        </div>
      </section>
    </>
  )
}