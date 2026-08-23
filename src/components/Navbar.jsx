import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activePage = 'home', onNavigate }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'network', label: 'NETWORK' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'entities', label: 'ENTITIES' },
    { id: 'cases', label: 'CASES' },
    { id: 'reports', label: 'REPORTS' },
    { id: 'settings', label: 'SETTINGS' },
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    if (id === 'reports') {
      // Reports lives on its own route (frontend/pages/Reports.jsx)
      navigate('/reports');
    } else if (id === 'dashboard') {
      onNavigate && onNavigate('dashboard');
    } else if (id === 'network') {
      onNavigate && onNavigate('network');
    } else if (id === 'cases') {
      onNavigate && onNavigate('cases');
    } else if (id === 'timeline') {
      onNavigate && onNavigate('timeline');
    } else if (id === 'settings') {
      onNavigate && onNavigate('settings');
    } else if (id === 'entities') {
      onNavigate && onNavigate('entities');
    } else {
      // For network, cases
      onNavigate && onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('explore') || document.getElementById('workflow');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header style={{
      borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
      backgroundColor: 'rgba(7, 9, 14, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 2rem'
    }}>
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Kavach AI text (Acts as Home Button) */}
        <div
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="Kavach AI - Return to Home Page"
        >
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '5px',
            background: 'linear-gradient(135deg, #00E5FF, #2979FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(0, 229, 255, 0.55)'
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
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
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

        {/* Right Section: CTA Button + Profile Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
          {/* Main Action Button */}
          <button
            onClick={() => navigate('/login')}
            className="btn-outline-cyan"
          >
            SIGN IN
          </button>
          <button
            onClick={() => onNavigate && onNavigate(activePage === 'home' ? 'dashboard' : 'home')}
            className="btn-cyan"
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            {activePage === 'home' ? 'LAUNCH APP' : 'PORTAL HOME'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          {/* Tactical Profile Button & Dropdown */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              title="Operator Profile & Clearance"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 10px 5px 6px',
                backgroundColor: profileOpen ? 'rgba(0, 229, 255, 0.15)' : 'rgba(16, 22, 34, 0.85)',
                border: profileOpen ? '1px solid var(--cyan-glow)' : '1px solid rgba(0, 229, 255, 0.25)',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: profileOpen ? '0 0 15px rgba(0, 229, 255, 0.3)' : '0 0 8px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!profileOpen) {
                  e.currentTarget.style.borderColor = 'var(--cyan-glow)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 229, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!profileOpen) {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.25)';
                  e.currentTarget.style.backgroundColor = 'rgba(16, 22, 34, 0.85)';
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.3)';
                }
              }}
            >
              {/* Avatar Circle with Status Pip */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 229, 255, 0.2)',
                border: '1.5px solid var(--cyan-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-glow)',
                position: 'relative'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#00E676',
                    border: '1.5px solid #07090E',
                    boxShadow: '0 0 6px #00E676'
                  }}
                />
              </div>

              {/* Operator Name */}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.5px'
              }}>
                OP_01
              </span>

              {/* Dropdown Chevron */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--cyan-glow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 0.2s ease',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Tactical Dropdown Menu */}
            {profileOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '260px',
                  backgroundColor: 'rgba(11, 16, 26, 0.97)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: '8px',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 229, 255, 0.15)',
                  overflow: 'hidden',
                  zIndex: 100,
                  animation: 'fadeInDown 0.2s ease forwards'
                }}
              >
                {/* Profile Header */}
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
                  backgroundColor: 'rgba(0, 229, 255, 0.04)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '1px'
                    }}>
                      OPERATOR_01
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#00E676',
                      backgroundColor: 'rgba(0, 230, 118, 0.12)',
                      border: '1px solid rgba(0, 230, 118, 0.3)',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      ONLINE
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--cyan-glow)',
                    letterSpacing: '0.5px'
                  }}>
                    SECURITY LEVEL 4 // ID: #KV-8921
                  </div>
                </div>

                {/* Menu List */}
                <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate && onNavigate('entities');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                      e.currentTarget.style.color = 'var(--cyan-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <span>🛡️</span>
                    <span>Target Dossier 360</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate && onNavigate('dashboard');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                      e.currentTarget.style.color = 'var(--cyan-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <span>📊</span>
                    <span>Investigation Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate && onNavigate('timeline');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                      e.currentTarget.style.color = 'var(--cyan-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <span>⏱️</span>
                    <span>Event Timeline Stream</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate && onNavigate('settings');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                      e.currentTarget.style.color = 'var(--cyan-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <span>⚙️</span>
                    <span>Security & Neural Settings</span>
                  </button>
                </div>

                {/* Footer Action */}
                <div style={{
                  borderTop: '1px solid rgba(0, 229, 255, 0.12)',
                  padding: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert('Terminal session locked. Re-authenticate to access Level 4 assets.');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'center',
                      padding: '7px',
                      background: 'rgba(255, 85, 85, 0.08)',
                      border: '1px solid rgba(255, 85, 85, 0.25)',
                      borderRadius: '4px',
                      color: '#FF6B6B',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 85, 85, 0.2)';
                      e.currentTarget.style.borderColor = '#FF5555';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 85, 85, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 85, 85, 0.25)';
                    }}
                  >
                    <span>🔒</span>
                    <span>LOCK TERMINAL</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
