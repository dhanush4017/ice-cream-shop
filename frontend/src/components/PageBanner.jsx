import { Link } from 'react-router-dom'

export default function PageBanner({ title, crumbs = [] }) {
  return (
    <section className="page-banner">
      <h1>{title}</h1>
      <div className="breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span>/</span>}
            {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
          </span>
        ))}
      </div>
    </section>
  )
}
