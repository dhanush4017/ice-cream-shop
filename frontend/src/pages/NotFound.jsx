import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="not-found">
          <div className="code">404</div>
          <h2>Oops! This scoop melted away.</h2>
          <p>The page you're looking for doesn't exist or may have been moved.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home →
          </Link>
        </div>
      </div>
    </section>
  )
}
