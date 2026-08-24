import { useState, useEffect } from 'react'
import { IdCard, KeyRound, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { api } from '../src/services/api.js'
import { getInitialTheme, toggleTheme } from '../src/utils/theme.js'
import './Login.css'

const FOOTER_LINKS = [
  'Privacy Policy',
  'System Status',
  'API Docs',
  'Contact Support',
]

function Field({ label, icon, right, ...props }) {
  return (
    <label className="field">
      <span className="field-head">
        <span className="label">{label}</span>
        {right}
      </span>
      <span className="field-input">
        {icon}
        <input {...props} />
      </span>
    </label>
  )
}

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [form, setForm] = useState({
    id: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const handleTheme = (e) => setTheme(e.detail || getInitialTheme());
    window.addEventListener('crimelens-theme-change', handleTheme);
    return () => window.removeEventListener('crimelens-theme-change', handleTheme);
  }, []);

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setError('')
    setSuccessMsg('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMsg('')

    const investigatorId = form.id.trim()
    if (!investigatorId || !form.password) {
      setError('Investigator ID and password are required.')
      return
    }

    setLoading(true)
    try {
      await api.auth.login(investigatorId, form.password)
      setSuccessMsg('✓ Clearance Level 4 Verified. Redirecting to Dashboard...')

      setTimeout(() => {
        navigate('/dashboard')
      }, 400)
    } catch (err) {
      setError(err.message || 'Authentication error. Please verify credentials.')
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 600)
    }
  }

  return (
    <div className="auth">
      <main className="auth-main">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <Logo size={25} />
        </div>
        <button
          type="button"
          onClick={() => setTheme(toggleTheme())}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="auth-theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <h1 className="auth-title">Secure Login</h1>
        <p className="auth-warn">Unauthorized access strictly prohibited</p>

        <div className="auth-card panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <Field
              label="Investigator ID"
              icon={<IdCard size={16} strokeWidth={2} />}
              placeholder="e.g. OP_01 or ID-8921"
              autoComplete="username"
              value={form.id}
              onChange={set('id')}
              required
            />

            <Field
              label="Password"
              icon={<KeyRound size={16} strokeWidth={2} />}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={set('password')}
              required
              right={
                <span
                  className="forgot"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setForm(prev => ({ ...prev, id: 'OP_01', password: 'password123' }))
                    setError('')
                    setSuccessMsg('Sample investigator credentials filled (OP_01)')
                  }}
                >
                  Quick Demo ID?
                </span>
              }
            />

            {error && (
              <p className="auth-error" role="alert" style={{ color: '#FF5555', fontSize: '13px', fontWeight: 600 }}>
                ⚠️ {error}
              </p>
            )}

            {successMsg && (
              <p className="auth-success" role="status" style={{ color: '#00E676', fontSize: '13px', fontWeight: 600 }}>
                {successMsg}
              </p>
            )}

            <button type="submit" className="auth-submit" disabled={loading} style={{ cursor: loading ? 'wait' : 'pointer' }}>
              <LogIn size={17} strokeWidth={2.4} />
              {loading ? 'Authenticating Clearance...' : 'Access System'}
            </button>
          </form>
        </div>

        <p className="auth-note">
          System Access Required &middot; Activity is Monitored
        </p>
      </main>

      <footer className="auth-foot">
        <span>&copy; 2024 CrimeLens - Intelligence Beyond Connections</span>
        <nav className="auth-foot-links">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#/">
              {link}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}

export default Login
