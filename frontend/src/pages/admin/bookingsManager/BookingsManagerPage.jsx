import { useEffect, useRef, useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import BookingBar from '../../../components/admin/bookingBar/BookingBar'
import BookingForm from '../../../components/booking/BookingForm'
import { getBookings } from '../../../api/BookingService'
import './BookingsManagerPage.css'

const PER_PAGE = 10

function BookingsManagerPage() {
  const [bookings, setBookings] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [query, setQuery] = useState('')
  const queryRef = useRef('')

  const totalPages = Math.max(1, Math.ceil(count / PER_PAGE))

  const loadBookings = (targetPage = 1, search = queryRef.current) => {
    setLoading(true)
    setError('')
    getBookings(targetPage, search)
      .then((data) => {
        setBookings(data.results || [])
        setCount(data.count || 0)
        setPage(targetPage)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadBookings(1)
  }, [])

  useEffect(() => {
    queryRef.current = query.trim()
    const timer = setTimeout(() => {
      loadBookings(1, query.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleRemove = (id) => {
    loadBookings(page)
  }

  const handleCreated = () => {
    setAdding(false)
    loadBookings(1)
  }

  const goToPage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) return
    loadBookings(targetPage)
  }

  const windowSize = 3
  let start = Math.min(Math.max(page - Math.floor(windowSize / 2), 1), Math.max(totalPages - windowSize + 1, 1))
  const end = Math.min(start + windowSize - 1, totalPages)
  const pageNumbers = []
  for (let i = start; i <= end; i++) pageNumbers.push(i)

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="bm__top">
          <h1 className="admin-title">Bookings Manager</h1>
          <div className="bm__actions">
            <div className="bm__search">
              <svg className="bm__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="bm__search-input"
                placeholder="Search bookings…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search bookings"
              />
              {query && (
                <button type="button" className="bm__search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button type="button" className="bm__add" onClick={() => setAdding(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add booking
            </button>
          </div>
        </div>

        <div className="bm">
          <div className="bm__header">
            <span className="bm__count">{count} booking{count !== 1 && 's'}</span>
            {query && (
              <span className="bm__search-hint">
                {count} result{count !== 1 && 's'} for “{query.trim()}”
              </span>
            )}
          </div>

          {error && <p className="bm__error">{error}</p>}

          {loading ? (
            <div className="bm__table-wrap">
              <table className="bm__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="bm__skeleton-row">
                      <td><span className="bm__skel bm__skel--wide" /></td>
                      <td><span className="bm__skel" /></td>
                      <td><span className="bm__skel" /></td>
                      <td><span className="bm__skel bm__skel--short" /></td>
                      <td><span className="bm__skel bm__skel--xs" /></td>
                      <td><span className="bm__skel bm__skel--wide" /></td>
                      <td><span className="bm__skel" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : bookings.length > 0 ? (
            <>
              <div className="bm__table-wrap">
                <table className="bm__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Age</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="bm__row">
                        <td className="bm__cell bm__cell--bar" colSpan="7">
                          <BookingBar booking={booking} onRemove={handleRemove} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav className="bm__pagination" aria-label="Bookings pagination">
                  <button
                    type="button"
                    className="bm__pagination-btn bm__pagination-btn--arrow"
                    onClick={() => goToPage(1)}
                    disabled={page <= 1}
                    aria-label="First page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="11 17 6 12 11 7" />
                      <polyline points="18 17 13 12 18 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="bm__pagination-btn bm__pagination-btn--arrow"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`bm__pagination-btn${num === page ? ' is-active' : ''}`}
                      onClick={() => goToPage(num)}
                      aria-current={num === page ? 'page' : undefined}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="bm__pagination-btn bm__pagination-btn--arrow"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="bm__pagination-btn bm__pagination-btn--arrow"
                    onClick={() => goToPage(totalPages)}
                    disabled={page >= totalPages}
                    aria-label="Last page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="13 17 18 12 13 7" />
                      <polyline points="6 17 11 12 6 7" />
                    </svg>
                  </button>

                  <span className="bm__pagination-info">Page {page} of {totalPages}</span>
                </nav>
              )}
            </>
          ) : (
            <div className="bm__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
              <span>No bookings yet</span>
            </div>
          )}
        </div>
      </main>

      {adding && (
        <div className="bm__overlay" onClick={() => setAdding(false)}>
          <div className="bm__modal" onClick={(e) => e.stopPropagation()}>
            <button className="bm__modal-close" onClick={() => setAdding(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <BookingForm onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingsManagerPage
