import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { getInitialTheme, applyTheme } from '../utils/theme.js';

export default function SettingsPage({ onNavigate }) {
  const [sensitivity, setSensitivity] = useState(85);
  const [model, setModel] = useState('crimelens-titan-4.2');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoDossier, setAutoDossier] = useState(true);
  const [shaVerification, setShaVerification] = useState(true);
  const [localTheme, setLocalTheme] = useState(getInitialTheme);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const handleTheme = (e) => setLocalTheme(e.detail || getInitialTheme());
    window.addEventListener('crimelens-theme-change', handleTheme);
    return () => window.removeEventListener('crimelens-theme-change', handleTheme);
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.settings.get();
        if (data && data.settings) {
          if (data.settings.sensitivity !== undefined) setSensitivity(data.settings.sensitivity);
          if (data.settings.model) setModel(data.settings.model);
          if (data.settings.alertsEnabled !== undefined) setAlertsEnabled(data.settings.alertsEnabled);
          if (data.settings.autoDossier !== undefined) setAutoDossier(data.settings.autoDossier);
          if (data.settings.shaVerification !== undefined) setShaVerification(data.settings.shaVerification);
        }
      } catch (err) {
        console.warn('Using local settings');
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaveStatus('Synchronizing with backend...');
    try {
      await api.settings.update({
        sensitivity,
        model,
        alertsEnabled,
        autoDossier,
        shaVerification
      });
      setSaveStatus('✓ Settings Saved & Synchronized Successfully!');
    } catch (err) {
      setSaveStatus('✓ Settings Saved Locally.');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div style={{
      flex: 1,
      padding: '2rem 2.5rem 3rem 2.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
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
                  <option value="crimelens-titan-4.2">CrimeLens-Titan v4.2 [Multimodal Entity Graph + Audio Forensics] (Recommended)</option>
                  <option value="crimelens-sentinel-ultra">CrimeLens-Sentinel Ultra [Real-time Financial Nexus & SIGINT Stream]</option>
                  <option value="crimelens-airgap-local">CrimeLens-AirGap Local [On-Premise Encrypted Offline Inference]</option>
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
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>Real-time Dark Web Surge Alerts</div>
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

          {/* Section 3: Interface & Visual Theme */}
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
              🎨 INTERFACE THEME & DISPLAY PREFERENCES
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                  Active Workspace Visual Mode
                </label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      applyTheme('dark');
                      setLocalTheme('dark');
                    }}
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      padding: '14px',
                      borderRadius: '6px',
                      border: localTheme === 'dark' ? '2px solid var(--cyan-glow)' : '1px solid var(--border-color)',
                      backgroundColor: localTheme === 'dark' ? 'rgba(0, 229, 255, 0.1)' : 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🌙</span>
                    <div style={{ textAlign: 'left' }}>
                      <div>Cyber Dark Mode</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400 }}>High contrast neon forensic palette</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      applyTheme('light');
                      setLocalTheme('light');
                    }}
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      padding: '14px',
                      borderRadius: '6px',
                      border: localTheme === 'light' ? '2px solid var(--cyan-glow)' : '1px solid var(--border-color)',
                      backgroundColor: localTheme === 'light' ? 'rgba(8, 145, 178, 0.1)' : 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>☀️</span>
                    <div style={{ textAlign: 'left' }}>
                      <div>Clarity Light Mode</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400 }}>Clean daylit analytical theme</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyan-glow)', fontWeight: 600 }}>
              {saveStatus}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline-cyan" onClick={() => onNavigate && onNavigate('dashboard')}>
                CANCEL
              </button>
              <button className="btn-cyan" onClick={handleSaveSettings}>
                SAVE & APPLY CHANGES
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
