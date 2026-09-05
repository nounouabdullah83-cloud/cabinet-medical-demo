import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  isAuthenticated,
  getCurrentUser,
} from '../api/AuthService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore the session once on app startup. If a valid token already exists
  // in localStorage, silently validate it (auto-refreshing if needed) so the
  // user stays logged in even after closing and reopening the browser.
  useEffect(() => {
    let active = true
    const restore = async () => {
      if (!isAuthenticated()) {
        if (active) setLoading(false)
        return
      }
      try {
        const currentUser = await getCurrentUser()
        if (active) setUser(currentUser)
      } catch {
        if (active) setUser(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    restore()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}