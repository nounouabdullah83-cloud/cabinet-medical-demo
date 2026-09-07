import { fetchWithAuth } from './AuthService'

const API_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function getTopServices() {
  const response = await fetch(`${API_URL}/api/services/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`)
  }
  return response.json()
}

export async function getServices() {
  const response = await fetch(`${API_URL}/api/services/all/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status}`)
  }
  return response.json()
}

export async function getService(id) {
  const response = await fetch(`${API_URL}/api/services/${id}/`)
  if (!response.ok) {
    throw new Error(`Failed to fetch service: ${response.status}`)
  }
  return response.json()
}

function buildBody(payload) {
  const isFile = payload.image instanceof File
  if (isFile) {
    const fd = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value != null) fd.append(key, value)
    })
    return { body: fd, useForm: true }
  }
  const cleanPayload = { ...payload }
  delete cleanPayload.image
  return { body: JSON.stringify(cleanPayload), useForm: false }
}

export async function createService(payload) {
  const { body, useForm } = buildBody(payload)
  const response = await fetchWithAuth(`${API_URL}/api/services/all/`, {
    method: 'POST',
    headers: useForm ? {} : { 'Content-Type': 'application/json' },
    body,
  })

  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail[0]
      : data.detail || Object.values(data).flat().join(' ') || 'Failed to create service'
    throw new Error(message)
  }
  return data
}

export async function updateService(id, payload) {
  const { body, useForm } = buildBody(payload)
  const response = await fetchWithAuth(`${API_URL}/api/services/${id}/`, {
    method: 'PUT',
    headers: useForm ? {} : { 'Content-Type': 'application/json' },
    body,
  })

  const data = await response.json()
  if (!response.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail[0]
      : data.detail || Object.values(data).flat().join(' ') || 'Failed to update service'
    throw new Error(message)
  }
  return data
}

export async function deleteService(id) {
  const response = await fetchWithAuth(`${API_URL}/api/services/${id}/`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete service: ${response.status}`)
  }
}