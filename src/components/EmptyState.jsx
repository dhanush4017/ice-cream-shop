import { Link } from 'react-router-dom'

export default function EmptyState({ emoji = '🍨', title, message, actionTo, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="emoji">{emoji}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
