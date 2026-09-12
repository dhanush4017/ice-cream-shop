export default function StarRating({ rating = 0, reviews }) {
  const full = Math.round(rating)
  const stars = '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full)
  return (
    <div className="product-rating">
      <span className="stars">{stars}</span>
      <span>({rating.toFixed(1)}/5{typeof reviews === 'number' ? `, ${reviews}` : ''})</span>
    </div>
  )
}
