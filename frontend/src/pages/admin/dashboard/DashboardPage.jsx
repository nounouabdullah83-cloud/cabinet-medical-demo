import { useEffect, useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import { getStates } from '../../../api/BookingService'
import './DashboardPage.css'

const formatMAD = (value) =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value || 0)

function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let active = true
    getStates()
      .then((s) => {
        if (active) setStats(s)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="admin-title">Dashboard</h1>

        <section className="db__card db__card--stats">
          <h2 className="db__card-title">Statistics</h2>
          {stats ? (
            <div className="db__stats-grid">
              <div className="db__stat">
                <span className="db__stat-label">Bookings Done</span>
                <span className="db__stat-value db__stat-value--done">{stats.bookings_done}</span>
              </div>
              <div className="db__stat">
                <span className="db__stat-label">Bookings Cancelled</span>
                <span className="db__stat-value db__stat-value--cancelled">{stats.bookings_cancled}</span>
              </div>
              <div className="db__stat db__stat--earned">
                <span className="db__stat-label">Total Revenue</span>
                <span className="db__stat-value db__stat-value--earned">{formatMAD(stats.total_revenue)}</span>
              </div>
            </div>
          ) : (
            <div className="db__loading">
              <div className="db__spinner" />
              <span>Loading statistics…</span>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
