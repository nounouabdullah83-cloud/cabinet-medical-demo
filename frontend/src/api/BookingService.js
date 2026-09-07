import { fetchWithAuth } from './AuthService'

const API_URL = ''

export async function getBookings(page = 1, query = '') {
  const params = new URLSearchParams({ page: String(page) })
  if (query && query.trim()) {
    params.set('q', query.trim())
  }
  const response = await fetchWithAuth(`${API_URL}/api/bookings/?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch bookings: ${response.status}`)
  }
  return response.json()
}

export async function createBooking(payload) {
  const response = await fetch(`${API_URL}/api/bookings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail[0]
      : data.detail || Object.values(data).flat().join(' ') || 'Booking failed'
    throw new Error(message)
  }
  return data
}

export async function getBooking(id) {
  const response = await fetchWithAuth(`${API_URL}/api/bookings/${id}/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch booking: ${response.status}`)
  }
  return response.json()
}

export async function updateBooking(id, payload) {
  const response = await fetchWithAuth(`${API_URL}/api/bookings/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail[0]
      : data.detail || Object.values(data).flat().join(' ') || 'Update failed'
    throw new Error(message)
  }
  return data
}

export async function deleteBooking(id) {
  const response = await fetchWithAuth(`${API_URL}/api/bookings/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete booking: ${response.status}`)
  }
}

export async function getBookingPrice(id) {
  const response = await fetchWithAuth(`${API_URL}/api/states/price/${id}/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch booking price: ${response.status}`)
  }
  return response.json()
}

export async function getStates(period = 'month') {
  const params = new URLSearchParams({ period })
  const response = await fetchWithAuth(`${API_URL}/api/states/?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.status}`)
  }
  return response.json()
}

export async function updateStats(payload) {
  const response = await fetchWithAuth(`${API_URL}/api/states/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail[0]
      : data.detail || Object.values(data).flat().join(' ') || 'Stats update failed'
    throw new Error(message)
  }
  return data
}