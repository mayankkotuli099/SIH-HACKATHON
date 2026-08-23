import React, { useState } from 'react';

export default function SettingsPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState('general');
  const [sensitivity, setSensitivity] = useState(85);
  const [model, setModel] = useState('kavach-titan-4.2');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoDossier, setAutoDossier] = useState(true);
  const [shaVerification, setShaVerification] = useState(true);

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 68px)',
      backgroundColor: '#07090E',
      color: '#FFFFFF',
      fontFamily: 'var(--font-sans)',
      position: 'relative'
    }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid rgba(0, 229, 255, 0.1)',
        backgroundColor: 'rgba(11, 15, 23, 0.95)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Operator Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px',
            backgroundColor: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            borderRadius: '6px',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              backgroundColor: 'rgba(0, 229, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-glow)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF' }}>
                OPERATOR_01
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--cyan-glow)' }}>
                LEVEL 4 ACCESS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'anomalies', label: 'ANOMALIES', icon: '⚡' },
              { id: 'location', label: 'LOCATION', icon: '📍' },
              { id: 'influencers', label: 'INFLUENCERS', icon: '🕸' },
              { id: 'ai_assistant', label: 'AI ASSISTANT', icon: '🤖' }
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => onNavigate && onNavigate(menu.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'none',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.08)';
                  e.currentTarget.style.color = 'var(--cyan-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{menu.icon}</span>
                {menu.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Sidebar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setActiveNav('general')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid var(--cyan-glow)',
              borderRadius: '4px',
              color: 'var(--cyan-glow)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              cursor: 'pointer'
            }}
          >
            ⚙️ SETTINGS (ACTIVE)
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderRadius: '4px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11.5px',
              cursor: 'pointer'
            }}
          >
            ❓ HELP
          </button>
        </div>
      </aside>

      {/* Main Settings Content */}
      <main style={{
        flex: 1,
        padding: '2.5rem 3.5rem',
        overflowY: 'auto',
        maxWidth: '1000px'
      }}>
        {/* Page Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#FFFFFF',
            marginBottom: '0.4rem',
            textTransform: 'uppercase'
          }}>
            System Settings & Security
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-mono)'
          }}>
            Configure AI intelligence pipelines, neural inference parameters, and operator security clearance.
          </p>
        </div>

        {/* Settings Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: AI & Neural Engine Parameters */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--cyan-glow)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.5px'
            }}>
              🧠 AI & NEURAL INFERENCE ENGINE
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Model Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#FFFFFF', fontWeight: 600, marginBottom: '6px' }}>
                  Core Intelligence Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(11, 15, 23, 0.9)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="kavach-titan-4.2">Kavach-Titan v4.2 [Multimodal Entity Graph + Audio Forensics] (Recommended)</option>
                  <option value="kavach-sentinel-ultra">Kavach-Sentinel Ultra [Real-time Financial Nexus & SIGINT Stream]</option>
                  <option value="kavach-airgap-local">Kavach-AirGap Local [On-Premise Encrypted Offline Inference]</option>
                </select>
              </div>

              {/* Anomaly Detection Sensitivity Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 600 }}>
                    Anomaly Detection Sensitivity Threshold
                  </label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan-glow)', fontWeight: 700 }}>
                    {sensitivity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--cyan-glow)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Low False Positives (50%)</span>
                  <span>Balanced (80%)</span>
                  <span>Hyper-Vigilant (99%)</span>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>Automated Entity Resolution</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Automatically merge aliases, burner phones, and shell bank accounts into unified suspect graph.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoDossier}
                  onChange={(e) => setAutoDossier(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-glow)' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Security & Evidence Vault */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--cyan-glow)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.5px'
            }}>
              🔒 SECURITY & EVIDENCE CHAIN OF CUSTODY
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>SHA-256 Digital Signature Stamp</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cryptographically seal every ingested wiretap transcript and GPS log for court admissibility.</div>
                </div>
                <input
                  type="checkbox"
                  checked={shaVerification}
                  onChange={(e) => setShaVerification(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-glow)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#FFFFFF' }}>Real-time Dark Web Surge Alerts</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trigger audio alarm & SMS dispatch when target syndicate mentions increase by &gt;200%.</div>
                </div>
                <input
                  type="checkbox"
                  checked={alertsEnabled}
                  onChange={(e) => setAlertsEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--cyan-glow)' }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn-outline-cyan" onClick={() => onNavigate && onNavigate('dashboard')}>
              CANCEL
            </button>
            <button className="btn-cyan" onClick={() => alert('Settings Saved & Synchronized Successfully!')}>
              SAVE & APPLY CHANGES
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
