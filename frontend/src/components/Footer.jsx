import React from 'react';

export default function Footer() {
  const links = [
    { label: 'PRIVACY POLICY', href: '#privacy' },
    { label: 'SYSTEM STATUS', href: '#status' },
    { label: 'API DOCS', href: '#docs' },
    { label: 'CONTACT SUPPORT', href: '#support' },
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-dark)',
      padding: '1.75rem 2rem',
      marginTop: 'auto',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Left Copyright */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '1px',
          color: 'var(--text-muted)'
        }}>
          &copy; 2024 CRIMELENS - INTELLIGENCE BEYOND CONNECTIONS
        </div>

        {/* Right Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '1px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--cyan-glow)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
