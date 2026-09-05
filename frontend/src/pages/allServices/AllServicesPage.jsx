import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../../api/ServicesService'
import ServiceCard from '../../components/servicecard/ServiceCard'
import './AllServicesPage.css'

function AllServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const grid = useRef(null)

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || error) return undefined

    const el = grid.current
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
              `${Number(entry.target.dataset.index) * 0.1}s`,
            )
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 },
    )

    cards.forEach((card) => io.observe(card))
    return () => io.disconnect()
  }, [services, loading, error])

  return (
    <div className="all-services">
      <Link to="/" className="all-services__home">
        ← Back to home
      </Link>

      <header className="all-services__head">
        <p className="all-services__eyebrow">Full catalogue</p>
        <h1 className="all-services__title">All services</h1>
        <p className="all-services__lede">
          Explore every treatment and specialty our clinic offers.
        </p>
      </header>

      {loading && <p className="all-services__status">Loading services…</p>}
      {error && <p className="all-services__error">{error}</p>}
      {!loading && !error && (
        <div className="all-services__grid" ref={grid}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AllServicesPage