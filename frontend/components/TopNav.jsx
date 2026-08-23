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

function TopNav({ operator = 'OPERATOR_01', clearance = 'LEVEL 4 ACCESS' }) {
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

      <div className="operator">
        <span className="operator-avatar">
          <User size={17} strokeWidth={2} />
        </span>
        <span className="operator-meta">
          <strong>{operator}</strong>
          <small>{clearance}</small>
        </span>
      </div>
    </header>
  )
}

export default TopNav
