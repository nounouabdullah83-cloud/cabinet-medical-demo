import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getService } from '../../api/ServicesService'
import './ServiceDetailPage.css'

function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getService(id)
      .then(setService)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <main className="article">
      <Link to="/services" className="article__back">
        ← All services
      </Link>

      {loading && <p className="article__status">Loading…</p>}
      {error && <p className="article__error">{error}</p>}

      {service && (
        <article>
          <header className="article__head">
            <p className="article__eyebrow">Clinic services</p>
            <h1 className="article__title">{service.title}</h1>
            <div className="article__meta">
              <span className="article__tag">From {service.price} DH</span>
              <span>{service.created_at_date}</span>
            </div>
          </header>

          {service.image && (
            <figure className="article__figure">
              <img
                className="article__image"
                src={service.image}
                alt={service.title}
              />
            </figure>
          )}

          <div className="article__body">
            <p className="article__lede">{service.description}</p>
            <p className="article__text">
              At Cabinet Medical, every {service.title} visit starts with a
              thorough consultation so the plan we build matches your lifestyle
              and goals. Our specialists use modern diagnostic tools and
              explain each step in plain language — no jargon, no surprises.
            </p>
            <p className="article__text">
              From the first appointment to follow-up care, your records stay
              secure and our team coordinates across specialties under one
              roof. That means faster answers, fewer referrals and a single
              point of contact for your care.
            </p>
          </div>
        </article>
      )}
    </main>
  )
}

export default ServiceDetailPage