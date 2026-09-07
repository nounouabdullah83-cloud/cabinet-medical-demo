import { useEffect, useRef } from 'react'
import aboutImg1 from '../../assets/landingpage/SIRAJ photos, images, assets.jpg'
import aboutImg2 from '../../assets/landingpage/1046101819718256577.jpg'
import aboutImg3 from '../../assets/landingpage/⊂╭🍋⊃⊂╭🍎⊃⊂╭🍓⊃⊂╭🍇⊃⊂╭🍍⊃⊂╭🍒⊃_ 🌽معلومات صحية….jpg'
import './aboutus.css'

const ITEMS = [
  {
    tag: '01 · Our mission',
    title: 'Compassionate care, built around you',
    text: 'From routine check-ups to long-term care, we put prevention first. Every visit starts with a conversation — we listen, explain your options in plain language, and build a plan that fits your life, not a schedule.',
    points: [
      'Preventive check-ups and health monitoring',
      'Appointments that respect your time',
      'Care plans explained in plain language',
    ],
    img: aboutImg1,
    alt: 'Doctor reviewing a care plan with a patient',
  },
  {
    tag: '02 · Our specialists',
    title: 'Every specialty under one roof',
    text: 'Our team brings together general practitioners, cardiologists and pediatricians in a single clinic — so families find every specialist they need without running across the city.',
    points: [
      'General practice for the whole family',
      'Cardiology and heart-health management',
      'Gentle, specialist care for children',
    ],
    img: aboutImg2,
    alt: 'Medical team working together during care',
  },
  {
    tag: '03 · Our technology',
    title: 'Modern diagnostics, fast answers',
    text: 'On-site laboratory testing, secure digital records and modern diagnostic equipment mean fewer delays. More answers in the same visit, and less waiting for results.',
    points: [
      'Fast, reliable on-site laboratory',
      'Secure digital health records',
      'Modern diagnostic equipment',
    ],
    img: aboutImg3,
    alt: 'Laboratory sample being examined in the clinic lab',
  },
]

function AboutUs() {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const rows = el.querySelectorAll('.about-us__row')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      rows.forEach((row) => row.classList.add('is-in'))
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
      { threshold: 0.18 },
    )

    rows.forEach((row) => io.observe(row))
    return () => io.disconnect()
  }, [])

  return (
    <section className="about-us" id="about" ref={root}>
      <header className="about-us__head">
        <p className="about-us__eyebrow">About the clinic</p>
        <h2 className="about-us__title">
          Care that goes beyond the consultation room
        </h2>
        <p className="about-us__lede">
          We built Cabinet Medical on three simple ideas — listen first, treat
          precisely, and make every visit feel human.
        </p>
      </header>

      <div className="about-us__rows">
        {ITEMS.map((item, i) => (
          <article
            className={`about-us__row${i % 2 ? ' is-reversed' : ''}`}
            key={item.tag}
            data-index={i}
          >
            <div className="about-us__media">
              <img src={item.img} alt={item.alt} loading="lazy" decoding="async" />
              <span className="about-us__tag">{item.tag}</span>
            </div>
            <div className="about-us__copy">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul className="about-us__points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AboutUs