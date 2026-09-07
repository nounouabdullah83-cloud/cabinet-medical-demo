import { useEffect, useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../../../api/ServicesService'
import './ServicesManagerPage.css'

const EMPTY_FORM = { title: '', description: '', price: '', image: null }

function ServicesManagerPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [query, setQuery] = useState('')

  const loadServices = () => {
    setLoading(true)
    setError('')
    getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadServices()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (service) => {
    setEditing(service)
    setForm({
      title: service.title || '',
      description: service.description || '',
      price: service.price != null ? String(service.price) : '',
      image: null,
    })
    setFormError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditing(null)
    setFormError('')
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    const title = form.title.trim()
    const description = form.description.trim()
    const price = Number(form.price)
    if (!title) return setFormError('Title is required')
    if (!description) return setFormError('Description is required')
    if (form.price === '' || Number.isNaN(price) || price < 0) {
      return setFormError('Enter a valid price')
    }

    const payload = {
      title,
      description,
      price,
      image: form.image instanceof File ? form.image : undefined,
    }

    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        const updated = await updateService(editing.id, payload)
        setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      } else {
        const created = await createService(payload)
        setServices((prev) => [created, ...prev])
      }
      setModalOpen(false)
      setEditing(null)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const requestDelete = (service) => {
    setConfirmId(service.id)
  }

  const handleDelete = async () => {
    if (!confirmId) return
    try {
      await deleteService(confirmId)
      setServices((prev) => prev.filter((s) => s.id !== confirmId))
      setConfirmId(null)
    } catch (err) {
      setError(err.message)
      setConfirmId(null)
    }
  }

  const currency = (value) => {
    const num = Number(value)
    if (Number.isNaN(num)) return value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
    }).format(num)
  }

  const term = query.trim().toLowerCase()
  const filtered = term
    ? services.filter(
        (s) =>
          (s.title || '').toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term)
      )
    : services

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="sm__top">
          <h1 className="admin-title">Services Manager</h1>
          <div className="sm__toolbar">
            <div className="sm__search">
              <svg className="sm__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="sm__search-input"
                placeholder="Search services…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search services"
              />
              {query && (
                <button type="button" className="sm__search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button type="button" className="sm__add" onClick={openAdd}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add service
            </button>
          </div>
        </div>

        <div className="sm">
          {error && <p className="sm__error">{error}</p>}

          {loading ? (
            <div className="sm__list">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="sm__row sm__row--skeleton">
                  <div className="sm__skel sm__skel--thumb" />
                  <div className="sm__skel sm__skel--title" />
                  <div className="sm__skel sm__skel--desc" />
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            filtered.length > 0 ? (
              <div className="sm__list">
                {filtered.map((service) => (
                  <div key={service.id} className="sm__row">
                    <div className="sm__thumb">
                      {service.image ? (
                        <img src={service.image} alt={service.title} loading="lazy" />
                      ) : (
                        <span className="sm__thumb-fallback">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </span>
                      )}
                    </div>

                    <div className="sm__body">
                      <h3 className="sm__title">{service.title}</h3>
                      <p className="sm__desc">{service.description}</p>
                    </div>

                    <div className="sm__price">{currency(service.price)}</div>

                    <div className="sm__actions">
                      <button
                        type="button"
                        className="sm__action sm__action--edit"
                        onClick={() => openEdit(service)}
                        aria-label={`Edit ${service.title}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="sm__action sm__action--delete"
                        onClick={() => requestDelete(service)}
                        aria-label={`Delete ${service.title}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sm__empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span>No services match “{query.trim()}”</span>
              </div>
            )
          ) : (
            <div className="sm__empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>No services yet</span>
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <div className="sm__overlay" onClick={closeModal}>
          <div className="sm__modal" onClick={(e) => e.stopPropagation()}>
            <button className="sm__modal-close" onClick={closeModal} disabled={saving} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <form
              className="sm__form"
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              <h2 className="sm__form-title">{editing ? 'Edit service' : 'Add service'}</h2>

              {formError && <p className="sm__form-error">{formError}</p>}

              <div className="sm__field">
                <label className="sm__label" htmlFor="sm-title">Title <em>*</em></label>
                <input
                  id="sm-title"
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  placeholder="e.g. Cardiology"
                />
              </div>

              <div className="sm__field">
                <label className="sm__label" htmlFor="sm-desc">Description <em>*</em></label>
                <textarea
                  id="sm-desc"
                  rows="4"
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Describe the service…"
                />
              </div>

              <div className="sm__grid">
                <div className="sm__field">
                  <label className="sm__label" htmlFor="sm-price">Price (MAD) <em>*</em></label>
                  <input
                    id="sm-price"
                    type="number"
                    min="0"
                    step="any"
                    value={form.price}
                    onChange={handleChange('price')}
                    placeholder="0"
                  />
                </div>
                <div className="sm__field">
                  <label className="sm__label" htmlFor="sm-image">Image <span className="sm__opt">(optional)</span></label>
                  <input
                    id="sm-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      setForm((prev) => ({ ...prev, image: file || null }))
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="sm__submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="sm__overlay" onClick={() => setConfirmId(null)}>
          <div className="sm__confirm" onClick={(e) => e.stopPropagation()}>
            <div className="sm__confirm-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="sm__confirm-title">Delete service?</h3>
            <p className="sm__confirm-text">
              This will permanently delete “{services.find((s) => s.id === confirmId)?.title}”. This action cannot be undone.
            </p>
            <div className="sm__confirm-actions">
              <button type="button" className="sm__btn sm__btn--ghost" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button type="button" className="sm__btn sm__btn--danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesManagerPage
