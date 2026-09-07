import { useNavigate } from 'react-router-dom'
import ResetPasswordForm from '../../../components/admin/resetPassword/ResetPasswordForm'
import './ResetPasswordPage.css'

function ResetPasswordPage() {
  const navigate = useNavigate()

  return (
    <div className="reset-pw-page">
      <div className="reset-pw-page__blob reset-pw-page__blob--one" />
      <div className="reset-pw-page__blob reset-pw-page__blob--two" />

      <div className="reset-pw-page__card">
        <a href="/" className="reset-pw-page__brand">
          <span className="reset-pw-page__mark">+</span>
          <span className="reset-pw-page__name">
            Cabinet<span>Medical</span>
          </span>
        </a>

        <ResetPasswordForm onSuccess={() => navigate('/login')} />

        <button
          type="button"
          className="reset-pw-page__back"
          onClick={() => navigate('/login')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to login
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordPage