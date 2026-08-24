import { useState } from 'react'
import { IdCard, KeyRound, LogIn, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { api } from '../src/services/api.js'
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
  const [tab, setTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    id: '',
    password: '',
    name: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isSignIn = tab === 'signin'
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

    if (!isSignIn) {
      if (!form.name.trim()) {
        setError('Full name is required to register.')
        return
      }
      if (form.password !== form.confirm) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)
    try {
      if (isSignIn) {
        await api.auth.login(investigatorId, form.password)
        setSuccessMsg('✓ Clearance Level 4 Verified. Redirecting to Dashboard...')
      } else {
        await api.auth.register(investigatorId, form.name.trim(), form.password)
        setSuccessMsg('✓ Account registered successfully. Redirecting to Dashboard...')
      }

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

  function switchTab(next) {
    setTab(next)
    setError('')
    setSuccessMsg('')
  }

  return (
    <div className="auth">
      <header className="auth-bar">
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size={25} />
        </div>
        <span className="auth-status">
          <i className="dot" />
          System Online
        </span>
      </header>

      <main className="auth-main">
        <h1 className="auth-title">{isSignIn ? 'Secure Login' : 'Register Operator'}</h1>
        <p className="auth-warn">Unauthorized access strictly prohibited</p>

        <div className="auth-card panel">
          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isSignIn}
              className={`tab ${isSignIn ? 'active' : ''}`}
              onClick={() => switchTab('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isSignIn}
              className={`tab ${!isSignIn ? 'active' : ''}`}
              onClick={() => switchTab('create')}
            >
              Create Account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isSignIn && (
              <Field
                label="Full Name"
                icon={<User size={16} strokeWidth={2} />}
                placeholder="Agent Jane Doe"
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
                required
              />
            )}

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
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={set('password')}
              required
              right={
                isSignIn && (
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
                )
              }
            />

            {!isSignIn && (
              <Field
                label="Confirm Password"
                icon={<KeyRound size={16} strokeWidth={2} />}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set('confirm')}
                required
              />
            )}

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
              {loading ? 'Authenticating Clearance...' : (isSignIn ? 'Access System' : 'Create & Access System')}
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
