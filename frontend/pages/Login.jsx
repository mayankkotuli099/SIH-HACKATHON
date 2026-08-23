import { useState } from 'react'
import { IdCard, KeyRound, LogIn, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
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
  const [form, setForm] = useState({
    id: '',
    password: '',
    name: '',
    confirm: '',
  })
  const [error, setError] = useState('')

  const isSignIn = tab === 'signin'
  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    // NOTE: no backend yet — this validates locally and grants access.
    if (!form.id.trim() || !form.password) {
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
    navigate('/reports')
  }

  function switchTab(next) {
    setTab(next)
    setError('')
  }

  return (
    <div className="auth">
      <header className="auth-bar">
        <Logo size={25} />
        <span className="auth-status">
          <i className="dot" />
          System Online
        </span>
      </header>

      <main className="auth-main">
        <h1 className="auth-title">Secure Login</h1>
        <p className="auth-warn">Unauthorized access prohibited</p>

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
                placeholder="Jane Doe"
                autoComplete="name"
                value={form.name}
                onChange={set('name')}
              />
            )}

            <Field
              label="Investigator ID"
              icon={<IdCard size={16} strokeWidth={2} />}
              placeholder="ID-0000"
              autoComplete="username"
              value={form.id}
              onChange={set('id')}
            />

            <Field
              label="Password"
              icon={<KeyRound size={16} strokeWidth={2} />}
              type="password"
              placeholder="••••••••"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={set('password')}
              right={
                isSignIn && (
                  <a className="forgot" href="#reset">
                    Forgot Password?
                  </a>
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
              />
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="auth-submit">
              <LogIn size={17} strokeWidth={2.4} />
              {isSignIn ? 'Access System' : 'Request Access'}
            </button>
          </form>
        </div>

        <p className="auth-note">
          System Access Required &middot; Activity is Monitored
        </p>
      </main>

      <footer className="auth-foot">
        <span>&copy; 2024 Crime Intel AI - Intelligence Beyond Connections</span>
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
