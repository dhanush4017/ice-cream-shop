export default function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1 }) {
  return (
    <div className="qty-selector">
      <button type="button" onClick={onDecrease} disabled={quantity <= min} aria-label="Decrease quantity">
        −
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}
