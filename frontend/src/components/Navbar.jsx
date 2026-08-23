import React, { useState } from 'react';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'DASHBOARD' },
    { id: 'NETWORK', label: 'NETWORK' },
    { id: 'TIMELINE', label: 'TIMELINE' },
    { id: 'ENTITIES', label: 'ENTITIES' },
    { id: 'CASES', label: 'CASES' },
    { id: 'REPORTS', label: 'REPORTS' },
  ];

  return (
    <header style={{
      borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 2rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #00E5FF, #2979FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#07090E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '1px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            KAVACH <span style={{ color: 'var(--cyan-glow)', textShadow: '0 0 10px rgba(0,229,255,0.6)' }}>AI</span>
          </span>
        </div>

        {/* Center Nav Items */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  padding: '8px 0',
                  position: 'relative',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.label}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-22px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--cyan-glow)',
                    boxShadow: '0 0 8px var(--cyan-glow)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#explore" className="btn-cyan">
            GET STARTED
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
