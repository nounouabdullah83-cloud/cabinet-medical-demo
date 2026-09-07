import { useState } from 'react'
import {
  requestPasswordReset,
  confirmResetCode,
  setNewPassword,
} from '../../../api/AuthService'
import './ResetPasswordForm.css'

const STEPS = { EMAIL: 'email', CODE: 'code', PASSWORD: 'password' }

function ResetPasswordForm({ onSuccess }) {
  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword2] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await requestPasswordReset(email)
      setStep(STEPS.CODE)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await confirmResetCode(email, code)
      setStep(STEPS.PASSWORD)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await setNewPassword(email, code, newPassword)
      setStep(STEPS.EMAIL)
      setCode('')
      setNewPassword2('')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (step === STEPS.EMAIL) {
    return (
      <form className="reset-pw" onSubmit={handleEmailSubmit}>
        <header className="reset-pw__header">
          <h1 className="reset-pw__title">Reset password</h1>
          <p className="reset-pw__subtitle">
            Enter your account email and we’ll email you a 5-digit code to confirm
            the request.
          </p>
        </header>

        <label className="reset-pw__field">
          <span className="reset-pw__label">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@clinic.com"
            required
          />
        </label>

        {error && <p className="reset-pw__error" role="alert">{error}</p>}

        <button type="submit" className="reset-pw__submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send code'}
        </button>
      </form>
    )
  }

  if (step === STEPS.CODE) {
    return (
      <form className="reset-pw" onSubmit={handleCodeSubmit}>
        <header className="reset-pw__header">
          <h1 className="reset-pw__title">Check your inbox</h1>
          <p className="reset-pw__subtitle">
            We sent a 5-digit code to <strong>{email}</strong>. Enter it below to
            confirm your request.
          </p>
        </header>

        <label className="reset-pw__field">
          <span className="reset-pw__label">Verification code</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="•••••"
            autoComplete="one-time-code"
            required
          />
        </label>

        {error && <p className="reset-pw__error" role="alert">{error}</p>}

        <button type="submit" className="reset-pw__submit" disabled={submitting}>
          {submitting ? 'Checking…' : 'Verify code'}
        </button>
      </form>
    )
  }

  return (
    <form className="reset-pw" onSubmit={handlePasswordSubmit}>
      <header className="reset-pw__header">
        <h1 className="reset-pw__title">Choose a new password</h1>
        <p className="reset-pw__subtitle">
          For <strong>{email}</strong>. Use at least 8 characters.
        </p>
      </header>

      <label className="reset-pw__field">
        <span className="reset-pw__label">New password</span>
        <div className="reset-pw__password">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword2(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
          <button
            type="button"
            className="reset-pw__toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
                <path d="M1 1l22 22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>

      {error && <p className="reset-pw__error" role="alert">{error}</p>}

      <button type="submit" className="reset-pw__submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Update password'}
      </button>

      <p className="reset-pw__hint">
        After saving, you’ll be taken to the login page.
      </p>
    </form>
  )
}

export default ResetPasswordForm