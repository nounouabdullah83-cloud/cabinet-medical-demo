const API_URL = 'http://localhost:8000'

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Login failed')
  }

  localStorage.setItem('access_token', data.access)
  localStorage.setItem('refresh_token', data.refresh)
  return data
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null

  const response = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  const data = await response.json()
  if (!response.ok) {
    logout()
    return null
  }

  localStorage.setItem('access_token', data.access)
  return data.access
}

export function getAccessToken() {
  return localStorage.getItem('access_token')
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('access_token'))
}

export async function getCurrentUser() {
  const response = await fetchWithAuth(`${API_URL}/api/auth/me/`)
  if (!response.ok) return null
  return response.json()
}

export async function fetchWithAuth(url, options = {}) {
  const headers = new Headers(options.headers || {})
  let token = getAccessToken()

  if (!token) {
    token = await refreshAccessToken()
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { ...options, headers })
  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed}`)
      return fetch(url, { ...options, headers })
    }
  }
  return response
}