import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navebar.css'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { isAuthenticated, loading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastY && y > 60) {
        setHidden(true)
      } else if (y < lastY) {
        setHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className={`navbar${hidden ? ' navbar--hidden' : ''}`}>
      <a href="/" className="navbar__brand">
        <span className="navbar__mark">+</span>
        <span className="navbar__name">Cabinet<span>Medical</span></span>
      </a>

      <nav className={`navbar__links${open ? ' is-open' : ''}`}>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#book">Book now</a>
        {!loading &&
          (isAuthenticated ? (
            <>
              <a href="/admin" className="navbar__login">Dashboard</a>
              <button type="button" className="navbar__logout" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <a href="/login" className="navbar__login">Login</a>
          ))}
      </nav>

      <button
        className="navbar__toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}

export default Navbar
