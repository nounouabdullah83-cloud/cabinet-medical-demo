import { fetchWithAuth } from './AuthService'

const API_URL = ''

export async function getSchedule() {
  const response = await fetch(`${API_URL}/api/schedule/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch schedule: ${response.status}`)
  }
  return response.json()
}

export async function updateSchedule(id, data) {
  const response = await fetchWithAuth(`${API_URL}/api/schedule/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (!response.ok) {
    const message = result.detail || Object.values(result).flat().join(' ') || 'Failed to update schedule'
    throw new Error(message)
  }
  return result
}

export async function patchSchedule(id, data) {
  const response = await fetchWithAuth(`${API_URL}/api/schedule/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  if (!response.ok) {
    const message = result.detail || Object.values(result).flat().join(' ') || 'Failed to update schedule'
    throw new Error(message)
  }
  return result
}
