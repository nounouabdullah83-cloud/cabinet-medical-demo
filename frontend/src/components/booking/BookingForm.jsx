import { useEffect, useState } from 'react'
import { getServices } from '../../api/ServicesService'
import { createBooking } from '../../api/BookingService'
import './BookingForm.css'

const EMPTY = {
  full_name: '',
  age: '',
  service: '',
  preferred_date: '',
  preferred_time: '',
  email: '',
  phone_number: '',
}

function BookingForm({ onCreated }) {
  const [services, setServices] = useState([])
  const [sections, setSections] = useState({ more: false })
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setStatus((s) => ({ ...s, error: err.message })))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })
    try {
      const created = await createBooking(form)
      if (onCreated) {
        onCreated(created)
        return
      }
      setForm(EMPTY)
      setStatus({
        loading: false,
        error: '',
        success: `Thank you, ${form.full_name.split(' ')[0]}! Your booking has been received.`,
      })
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: '' })
    }
  }

  return (
    <form className="booking" onSubmit={handleSubmit}>
      <fieldset className="booking__group">
        <legend className="booking__legend">Appointment details</legend>

        <label className="booking__field">
          <span className="booking__label">Full name <em>*</em></span>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="John Smith"
            required
          />
        </label>

        <label className="booking__field">
          <span className="booking__label">Age <em>*</em></span>
          <input
            type="number"
            name="age"
            min="0"
            max="130"
            value={form.age}
            onChange={handleChange}
            placeholder="30"
            required
          />
        </label>

        <label className="booking__field">
          <span className="booking__label">Service <em>*</em></span>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="" disabled>Select a service…</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>

        <label className="booking__field">
          <span className="booking__label">Preferred date <em>*</em></span>
          <input
            type="date"
            name="preferred_date"
            min={today}
            value={form.preferred_date}
            onChange={handleChange}
            required
          />
        </label>

        <label className="booking__field">
          <span className="booking__label">Preferred time <em>*</em></span>
          <input
            type="time"
            name="preferred_time"
            value={form.preferred_time}
            onChange={handleChange}
            required
          />
        </label>
      </fieldset>

      <div className={`booking__more${sections.more ? ' is-open' : ''}`}>
        <p className="booking__more-label">Contact infos</p>

        <label className="booking__field">
          <span className="booking__label">Email <em className="booking__opt">(optional)</em></span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@email.com"
          />
        </label>

        <label className="booking__field">
          <span className="booking__label">Phone number <em className="booking__opt">(optional)</em></span>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="+213 000 00 00 00"
          />
        </label>
      </div>

      <button
        type="button"
        className="booking__toggle"
        aria-expanded={sections.more}
        onClick={() => setSections((s) => ({ more: !s.more }))}
      >
        {sections.more ? 'Less infos' : 'More infos'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {status.error && <p className="booking__error" role="alert">{status.error}</p>}
      {status.success && <p className="booking__success" role="status">{status.success}</p>}

      <button type="submit" className="booking__submit" disabled={status.loading || services.length === 0}>
        {status.loading ? 'Booking…' : 'Confirm booking'}
      </button>
    </form>
  )
}

export default BookingForm