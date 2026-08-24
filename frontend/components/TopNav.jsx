import { useState } from 'react'
import { User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import './TopNav.css'

const LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Network', to: '/network' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Entities', to: '/entities' },
  { label: 'Cases', to: '/cases' },
  { label: 'Reports', to: '/reports' },
]

function TopNav() {
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('crimelens_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  return (
    <header className="topnav">
      <Logo size={22} />

      <nav className="topnav-links">
        {LINKS.map(({ label, to }) => (
          <NavLink key={to} to={to} className="topnav-link">
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="operator">
          <span className="operator-avatar">
            <User size={17} strokeWidth={2} />
          </span>
          <span className="operator-meta">
            <strong>{user ? (user.name || user.id) : 'OPERATOR_01'}</strong>
            <small>{user?.clearance || 'LEVEL 4 ACCESS'}</small>
          </span>
        </div>
      </div>
    </header>
  )
}

export default TopNav
