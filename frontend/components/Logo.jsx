import { Shield } from 'lucide-react'

/** Brand wordmark. `size` scales the shield with the text. */
function Logo({ size = 25 }) {
  return (
    <span className="logo">
      <Shield size={size * 0.86} fill="currentColor" strokeWidth={1.5} />
      <span className="logo-text" style={{ fontSize: size }}>
        CRIME INTEL AI
      </span>
    </span>
  )
}

export default Logo
