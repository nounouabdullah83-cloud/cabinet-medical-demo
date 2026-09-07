import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { logout } from '../../api/AuthService'
import './Sidebar.css'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    to: '/admin/bookings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M9.5 15.5l2 2 3.5-3.5" />
      </svg>
    ),
  },
  {
    label: 'Services',
    to: '/admin/services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.8 1.8 2.4-.6.6 2.4L19 8.2 18.6 10H21v2h-2.4l.4 1.8-2.4.6-.6 2.2-2.5-1.4" />
        <path d="M14.5 11.5l-2.1-2a2.5 2.5 0 00-3.4.3L4 15a2 2 0 002.9 2.9l5.2-5.6a2.5 2.5 0 00-3.4.3" />
        <circle cx="18" cy="17" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Schedule',
    to: '/admin/schedule',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
]

function Sidebar() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const handleLogout = () => {
    close()
    logout()
    window.location.href = '/'
  }

  return (
    <>
      <button type="button" className="sidebar__hamburger" aria-label="Open menu" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={`sidebar__backdrop${open ? ' is-open' : ''}`} onClick={close} />

      <aside className={`sidebar${open ? ' is-open' : ''}`}>
        <a href="/" className="sidebar__brand">
          <span className="sidebar__mark">+</span>
          <span className="sidebar__name">
            Cabinet<span>Medical</span>
          </span>
        </a>

        <button type="button" className="sidebar__close" aria-label="Close menu" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <nav className="sidebar__nav" aria-label="Admin">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={close}
              className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Log out</span>
        </button>
      </aside>
    </>
  )
}

export default Sidebar
