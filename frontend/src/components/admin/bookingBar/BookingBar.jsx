import { useState } from 'react'
import { deleteBooking, getBookingPrice, updateStats } from '../../../api/BookingService'
import {
  setBookingStatus,
  BOOKING_STATUS,
} from '../../../utils/bookingStatus'
import './BookingBar.css'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

function BookingBar({ booking, onRemove }) {
  const [open, setOpen] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleRemove = async (status) => {
    setRemoving(true)
    try {
      if (status === BOOKING_STATUS.DONE) {
        const { service_price } = await getBookingPrice(booking.id)
        await updateStats({ action: 'done', price: service_price })
      } else if (status === BOOKING_STATUS.CANCELLED) {
        await updateStats({ action: 'cancel' })
      }
      if (status) {
        setBookingStatus(booking.id, status)
      }
      await deleteBooking(booking.id)
      onRemove(booking.id)
    } catch {
      setRemoving(false)
    }
  }

  return (
    <>
      <button className="bbar" onClick={() => setOpen(true)}>
        <span className="bbar__accent" />
        <span className="bbar__cell bbar__cell--name" data-label="Name">
          <span className="bbar__avatar">{booking.full_name.charAt(0)}</span>
          <span className="bbar__name">{booking.full_name}</span>
        </span>
        <span className="bbar__cell bbar__cell--service" data-label="Service">{booking.service_title}</span>
        <span className="bbar__cell bbar__cell--date" data-label="Date">{formatDate(booking.preferred_date)}</span>
        <span className="bbar__cell bbar__cell--time" data-label="Time">{formatTime(booking.preferred_time)}</span>
        <span className="bbar__cell bbar__cell--age" data-label="Age">{booking.age}</span>
        <span className="bbar__cell bbar__cell--muted" data-label="Email">{booking.email || '—'}</span>
        <span className="bbar__cell bbar__cell--muted" data-label="Phone">{booking.phone_number || '—'}</span>
      </button>

      {open && (
        <div className="bbar__overlay" onClick={() => setOpen(false)}>
          <div className="bbar__modal" onClick={(e) => e.stopPropagation()}>
            <button className="bbar__modal-close" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="bbar__modal-header">
              <span className="bbar__modal-avatar">{booking.full_name.charAt(0)}</span>
              <h3 className="bbar__modal-name">{booking.full_name}</h3>
              <span className="bbar__modal-service">{booking.service_title}</span>
            </div>

            <div className="bbar__modal-grid">
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Age</span>
                <span className="bbar__modal-value">{booking.age}</span>
              </div>
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Date</span>
                <span className="bbar__modal-value">{formatDate(booking.preferred_date)}</span>
              </div>
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Time</span>
                <span className="bbar__modal-value">{formatTime(booking.preferred_time)}</span>
              </div>
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Email</span>
                <span className="bbar__modal-value">{booking.email || '—'}</span>
              </div>
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Phone</span>
                <span className="bbar__modal-value">{booking.phone_number || '—'}</span>
              </div>
              <div className="bbar__modal-field">
                <span className="bbar__modal-label">Booked on</span>
                <span className="bbar__modal-value">
                  {new Date(booking.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="bbar__modal-actions">
              <button className="bbar__modal-btn bbar__modal-btn--cancel" onClick={() => handleRemove(BOOKING_STATUS.CANCELLED)} disabled={removing}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                {removing ? 'Cancelling…' : 'Cancel booking'}
              </button>
              <button className="bbar__modal-btn bbar__modal-btn--done" onClick={() => handleRemove(BOOKING_STATUS.DONE)} disabled={removing}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {removing ? 'Marking done…' : 'Mark done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BookingBar
