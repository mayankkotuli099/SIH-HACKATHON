import { Shield } from 'lucide-react'

/** Brand wordmark. Matches the split-colour treatment in src/components/Navbar.jsx. */
function Logo({ size = 25 }) {
  return (
    <span className="logo">
      <Shield size={size * 0.86} fill="currentColor" strokeWidth={1.5} />
      <span className="logo-text" style={{ fontSize: size }}>
        KAVACH <em>AI</em>
      </span>
    </span>
  )
}

export default Logo
