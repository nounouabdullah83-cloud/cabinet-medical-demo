const API_URL = ''

let refreshPromise = null

function decodeExp(token) {
  try {
    const payload = token.split('.')[1]
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(atob(padded))
    return Number(json.exp) || 0
  } catch {
    return 0
  }
}

function isTokenExpired(token) {
  if (!token) return true
  const exp = decodeExp(token)
  if (!exp) return false
  return Date.now() / 1000 >= exp
}

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

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/api/auth/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Unable to send reset link')
  }

  return data
}

export async function confirmResetCode(email, code) {
  const response = await fetch(`${API_URL}/api/auth/confirm-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Invalid verification code')
  }

  return data
}

export async function setNewPassword(email, code, newPassword) {
  const response = await fetch(`${API_URL}/api/auth/set-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, new_password: newPassword }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Unable to update password')
  }

  return data
}

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise
  }

  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    logout()
    return null
  }

  refreshPromise = (async () => {
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
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
    }
    return data.access
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
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

  if (!token || isTokenExpired(token)) {
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
