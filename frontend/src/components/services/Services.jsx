import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopServices } from '../../api/ServicesService'
import ServiceCard from '../servicecard/ServiceCard'
import './Services.css'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const root = useRef(null)

  useEffect(() => {
    getTopServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || error) return undefined

    const el = root.current
    const cards = el.querySelectorAll('.service-card')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-in'))
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.setProperty(
              '--d',
              `${Number(entry.target.dataset.index) * 0.12}s`,
            )
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.15 },
    )

    cards.forEach((card) => io.observe(card))
    return () => io.disconnect()
  }, [services, loading, error])

  return (
    <section id="services" className="services" ref={root}>
      <div className="services__head">
        <h2>Our services</h2>
        <p>Comprehensive care under one roof</p>
      </div>

      {loading && <p>Loading services…</p>}
      {error && <p className="services__error">{error}</p>}
      {!loading && !error && (
        <div className="services__grid">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}

      <div className="services__more">
        <Link to="/services" className="btn btn--secondary">
          See more services
        </Link>
      </div>
    </section>
  )
}

export default Services