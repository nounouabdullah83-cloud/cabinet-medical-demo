import { useEffect, useRef } from 'react'
import './Location.css'

const MAP_EMBED =
  'https://www.google.com/maps?q=35.1742349,1.5043973&z=17&hl=en&output=embed'
const MAP_LINK =
  'https://www.google.com/maps/place/cabinet+l%27espoir/@35.174158,1.5035174,18.11z/data=!4m6!3m5!1s0x1287215a5c6d18c3:0x9131dd0f81f93447!8m2!3d35.1742349!4d1.5043973!16s%2Fg%2F11nvkr55sj?entry=ttu'

function Location() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const target = el.querySelector('.location__reveal')
    if (!target) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      target.classList.add('is-in')
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.15 },
    )

    io.observe(target)
    return () => io.disconnect()
  }, [])

  return (
    <section className="location" id="location" ref={root}>
      <div className="location__inner">
        <header className="location__head">
          <p className="location__eyebrow">Visit us</p>
          <h2 className="location__title">Find the clinic</h2>
          <p className="location__lede">
            We are located at Cabinet L&apos;Espoir — easy to reach, with parking
            right outside the door.
          </p>
        </header>

        <div className="location__grid location__reveal">
          <div className="location__card location__card--info">
            <div className="location__row">
              <span className="location__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <strong>Cabinet L&apos;Espoir</strong>
                <p>Rue de la Liberté, Tiaret, Algeria</p>
              </div>
            </div>

            <div className="location__row">
              <span className="location__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
              </span>
              <div>
                <strong>Call us</strong>
                <p>+213 (0) 46 00 00 00</p>
              </div>
            </div>

            <div className="location__row">
              <span className="location__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <div>
                <strong>Opening hours</strong>
                <p>Mon – Sat · 8:30 AM – 6:00 PM</p>
              </div>
            </div>

            <a className="location__link" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
              Get directions
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>

          <div className="location__map-wrap">
            <iframe
              className="location__map"
              src={MAP_EMBED}
              title="Cabinet L'Espoir on Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location