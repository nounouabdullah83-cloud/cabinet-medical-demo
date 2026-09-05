import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { getCurrentUser } from '../api/AuthService'

function ProtectedRoute() {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const user = await getCurrentUser()
        if (active) setAuthed(Boolean(user))
      } catch {
        if (active) setAuthed(false)
      } finally {
        if (active) setChecking(false)
      }
    }
    check()
    return () => {
      active = false
    }
  }, [])

  if (checking) {
    return <div className="auth-pending">Loading…</div>
  }

  return authed ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute