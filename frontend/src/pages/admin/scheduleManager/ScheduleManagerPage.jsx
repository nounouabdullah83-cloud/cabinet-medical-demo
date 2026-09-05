import { useEffect, useState, useCallback } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import { getSchedule, patchSchedule } from '../../../api/ScheduleService'
import './ScheduleManagerPage.css'

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

function ScheduleManagerPage() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [rowErrors, setRowErrors] = useState({})

  const loadSchedule = useCallback(() => {
    setLoading(true)
    setError('')
    getSchedule()
      .then(setSchedules)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadSchedule()
  }, [loadSchedule])

  const handleToggle = (id) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              is_open: !s.is_open,
              opening_time: !s.is_open ? (s.opening_time || '08:00') : s.opening_time,
              closing_time: !s.is_open ? (s.closing_time || '17:00') : s.closing_time,
            }
          : s
      )
    )
    setRowErrors((prev) => ({ ...prev, [id]: '' }))
  }

  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
    setRowErrors((prev) => ({ ...prev, [id]: '' }))
  }

  const handleSave = async (schedule) => {
    setSavingId(schedule.id)
    setRowErrors((prev) => ({ ...prev, [schedule.id]: '' }))
    setSuccessId(null)

    const payload = {
      day: schedule.day,
      is_open: schedule.is_open,
      opening_time: schedule.is_open ? schedule.opening_time : null,
      closing_time: schedule.is_open ? schedule.closing_time : null,
    }

    try {
      const updated = await patchSchedule(schedule.id, payload)
      setSchedules((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      )
      setSuccessId(schedule.id)
      setTimeout(() => setSuccessId(null), 2000)
    } catch (err) {
      setRowErrors((prev) => ({ ...prev, [schedule.id]: err.message }))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="schm__top">
          <h1 className="admin-title">Schedule Manager</h1>
          <p className="schm__subtitle">Set your weekly availability for patients</p>
        </div>

        {error && <p className="schm__error">{error}</p>}

        {loading ? (
          <div className="schm__list">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="schm__row schm__row--skeleton">
                <div className="schm__skel schm__skel--day" />
                <div className="schm__skel schm__skel--toggle" />
                <div className="schm__skel schm__skel--time" />
                <div className="schm__skel schm__skel--time" />
              </div>
            ))}
          </div>
        ) : (
          <div className="schm__list">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`schm__row ${!schedule.is_open ? 'schm__row--closed' : ''} ${savingId === schedule.id ? 'schm__row--saving' : ''}`}
              >
                <div className="schm__day-info">
                  <span className="schm__day-name">{DAY_LABELS[schedule.day]}</span>
                  <span className={`schm__status-badge ${schedule.is_open ? 'schm__status-badge--open' : 'schm__status-badge--closed'}`}>
                    {schedule.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>

                <div className="schm__controls">
                  <label className="schm__toggle" aria-label={`Toggle ${DAY_LABELS[schedule.day]}`}>
                    <input
                      type="checkbox"
                      checked={schedule.is_open}
                      onChange={() => handleToggle(schedule.id)}
                      disabled={savingId === schedule.id}
                    />
                    <span className="schm__toggle-track">
                      <span className="schm__toggle-thumb" />
                    </span>
                    <span className="schm__toggle-label">{schedule.is_open ? 'Open' : 'Closed'}</span>
                  </label>

                  <div className="schm__times">
                    <div className="schm__time-field">
                      <label className="schm__time-label">Opening</label>
                      <input
                        type="time"
                        className="schm__time-input"
                        value={schedule.opening_time || ''}
                        onChange={(e) => handleTimeChange(schedule.id, 'opening_time', e.target.value)}
                        disabled={!schedule.is_open || savingId === schedule.id}
                      />
                    </div>
                    <span className="schm__time-sep">to</span>
                    <div className="schm__time-field">
                      <label className="schm__time-label">Closing</label>
                      <input
                        type="time"
                        className="schm__time-input"
                        value={schedule.closing_time || ''}
                        onChange={(e) => handleTimeChange(schedule.id, 'closing_time', e.target.value)}
                        disabled={!schedule.is_open || savingId === schedule.id}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="schm__save"
                    onClick={() => handleSave(schedule)}
                    disabled={savingId === schedule.id}
                  >
                    {savingId === schedule.id ? (
                      <>
                        <span className="schm__spinner" />
                        Saving…
                      </>
                    ) : successId === schedule.id ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Saved
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>

                {rowErrors[schedule.id] && (
                  <p className="schm__row-error">{rowErrors[schedule.id]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default ScheduleManagerPage
