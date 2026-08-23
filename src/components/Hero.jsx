import React from 'react';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '6rem 1.5rem 5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1
    }}>
      {/* System Status Pill Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(0, 229, 255, 0.04)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        marginBottom: '2.5rem',
        boxShadow: '0 0 15px rgba(0, 229, 255, 0.06)'
      }}>
        <span className="pulse-dot" />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '1.5px',
          fontWeight: 600,
          color: 'var(--cyan-glow)'
        }}>
          SYSTEM ONLINE // V 4.2.0 ACTIVE
        </span>
      </div>

      {/* Main Hero Typography */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: '-0.03em',
        maxWidth: '900px',
        margin: '0 auto 1.5rem',
        color: '#FFFFFF'
      }}>
        Uncover Connections.<br />
        <span style={{
          background: 'linear-gradient(135deg, #00E5FF 0%, #2979FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(0, 229, 255, 0.35)'
        }}>
          Expose Hidden Networks.
        </span>
      </h1>

      {/* Hero Subtitle */}
      <p style={{
        fontSize: '16px',
        color: 'var(--text-secondary)',
        maxWidth: '650px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6,
        fontWeight: 400
      }}>
        Transform fragmented investigation data into connected intelligence using AI, graph analytics, NLP and anomaly detection.
      </p>

      {/* Hero CTA Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <a href="#explore" className="btn-cyan">
          EXPLORE PLATFORM
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </a>

        <a href="#network" className="btn-outline-cyan">
          VIEW NETWORK
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </a>
      </div>
    </section>
  );
}
