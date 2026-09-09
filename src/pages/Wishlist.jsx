import PageBanner from '../components/PageBanner.jsx'
import ProductCard from '../components/ProductCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { PRODUCTS } from '../data/products.js'

export default function Wishlist() {
  const { wishlist } = useWishlist()
  const products = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <>
      <PageBanner title="Wishlist" crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <section className="section">
        <div className="container">
          {products.length === 0 ? (
            <EmptyState
              emoji="💗"
              title="Your wishlist is empty"
              message="Tap the heart icon on any product to save it here for later."
              actionTo="/shop"
              actionLabel="Explore the Shop"
            />
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
