import { useEffect, useRef, useState } from 'react'
import { getSchedule } from '../../api/ScheduleService'
import './Schedule.css'

const DAY_ORDER = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
}

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const FALLBACK_SCHEDULE = [
  { day: 'monday', opening_time: '08:30', closing_time: '18:00', is_open: true },
  { day: 'tuesday', opening_time: '08:30', closing_time: '18:00', is_open: true },
  { day: 'wednesday', opening_time: '08:30', closing_time: '18:00', is_open: true },
  { day: 'thursday', opening_time: '08:30', closing_time: '18:00', is_open: true },
  { day: 'friday', opening_time: '08:30', closing_time: '18:00', is_open: true },
  { day: 'saturday', opening_time: '09:00', closing_time: '16:00', is_open: true },
  { day: 'sunday', opening_time: null, closing_time: null, is_open: false },
]

const WEEKDAY_INDEX = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
}

function formatTime(timeStr) {
  if (!timeStr) return '—'
  const [h, m] = timeStr.slice(0, 5).split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

function Schedule() {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const root = useRef(null)
  const today = new Date().getDay()

  useEffect(() => {
    let active = true
    getSchedule()
      .then((data) => {
        if (!active) return
        const sorted = [...data].sort(
          (a, b) => DAY_ORDER[a.day] - DAY_ORDER[b.day],
        )
        setDays(sorted)
      })
      .catch(() => {
        if (active) setDays(FALLBACK_SCHEDULE)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const el = root.current
    const head = el.querySelector('.schedule__head')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window) || !head) {
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.15 },
    )

    io.observe(head)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const el = root.current
    const cards = el.querySelectorAll('.schedule__day:not(.schedule__day--skeleton)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (loading) return undefined
    if (reduced || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-in'))
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            entry.target.style.setProperty('--d', `${idx * 0.08}s`)
            entry.target.style.setProperty('--x', `${idx % 2 ? 22 : -22}px`)
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        }),
      { threshold: 0.15 },
    )

    cards.forEach((card) => io.observe(card))
    return () => io.disconnect()
  }, [loading])

  return (
    <section className="schedule" id="schedule" ref={root}>
      <header className="schedule__head">
        <p className="schedule__eyebrow">Opening hours</p>
        <h2 className="schedule__title">This week at the clinic</h2>
        <p className="schedule__lede">
          Walk-ins are welcome during opening hours. Book ahead online to skip
          the wait.
        </p>
      </header>

      <div className="schedule__grid">
        {loading
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="schedule__day schedule__day--skeleton" />
            ))
          : days.map((day, i) => {
              const isToday = WEEKDAY_INDEX[day.day] === today
              return (
                <div
                  key={day.day}
                  className={`schedule__day${day.is_open ? '' : ' schedule__day--closed'}${isToday ? ' schedule__day--today' : ''}`}
                  data-index={i}
                >
                  <div className="schedule__day-head">
                    <span className="schedule__day-name">{DAY_LABELS[day.day]}</span>
                    {isToday && <span className="schedule__today">Today</span>}
                  </div>

                  {day.is_open ? (
                    <p className="schedule__hours">
                      <span>{formatTime(day.opening_time)}</span>
                      <i className="schedule__dash" aria-hidden="true" />
                      <span>{formatTime(day.closing_time)}</span>
                    </p>
                  ) : (
                    <p className="schedule__hours schedule__hours--closed">Closed</p>
                  )}

                  <span className={`schedule__badge${day.is_open ? ' schedule__badge--open' : ' schedule__badge--closed'}`}>
                    <span className="schedule__dot" />
                    {day.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
              )
            })}
      </div>
    </section>
  )
}

export default Schedule