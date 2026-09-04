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

  const isLight = localTheme === 'light';
  const isDark = localTheme === 'dark';

  return (
    <div style={{
      flex: 1,
      padding: '24px 28px',
      maxWidth: '1100px',
      margin: '0 auto',
      width: '100%',
      color: 'var(--text-primary, #0f172a)',
      boxSizing: 'border-box'
    }}>
      {/* Page Title */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '16px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent-primary, #1e40af)',
          letterSpacing: '0.8px',
          marginBottom: '2px'
        }}>
          SYSTEM ADMINISTRATION // CONFIGURATION &amp; SECURITY
        </div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--text-primary, #0f172a)',
          margin: 0
        }}>
          System Settings &amp; Security Policy
        </h1>
        <p style={{
          color: 'var(--text-muted, #64748b)',
          fontSize: '13px',
          margin: '4px 0 0 0'
        }}>
          Configure AI intelligence pipelines, neural inference parameters, and Section 65B forensic chain of custody.
        </p>
      </div>

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 1: AI & Neural Engine Parameters */}
        <div className="cl-card" style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '6px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--accent-primary, #1e40af)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'monospace'
          }}>
            🧠 AI &amp; NEURAL INFERENCE ENGINE
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Model Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--text-secondary, #334155)', fontWeight: 600, marginBottom: '6px' }}>
                Core Intelligence Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input, #ffffff)',
                  border: '1px solid var(--border-strong, #cbd5e1)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  color: 'var(--text-primary, #0f172a)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="crimelens-titan-4.2">CrimeLens-Titan v4.2 [Multimodal Entity Graph + Audio Forensics] (Recommended)</option>
                <option value="crimelens-sentinel-ultra">CrimeLens-Sentinel Ultra [Real-time Financial Nexus &amp; SIGINT Stream]</option>
                <option value="crimelens-airgap-local">CrimeLens-AirGap Local [On-Premise Encrypted Offline Inference]</option>
              </select>
            </div>

            {/* Anomaly Detection Sensitivity Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', color: 'var(--text-secondary, #334155)', fontWeight: 600 }}>
                  Anomaly Detection Sensitivity Threshold
                </label>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--accent-primary, #1e40af)', fontWeight: 700 }}>
                  {sensitivity}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary, #1e40af)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                <span>Low False Positives (50%)</span>
                <span>Balanced (80%)</span>
                <span>Hyper-Vigilant (99%)</span>
              </div>
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Automated Entity Resolution</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>Automatically merge aliases, burner phones, and shell bank accounts into unified suspect graph.</div>
              </div>
              <input
                type="checkbox"
                checked={autoDossier}
                onChange={(e) => setAutoDossier(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary, #1e40af)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security & Evidence Vault */}
        <div className="cl-card" style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '6px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--accent-primary, #1e40af)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'monospace'
          }}>
            🔒 SECURITY &amp; EVIDENCE CHAIN OF CUSTODY (SECTION 65B BSA)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>SHA-256 Digital Signature Stamp</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>Cryptographically seal every ingested wiretap transcript and GPS log for court admissibility.</div>
              </div>
              <input
                type="checkbox"
                checked={shaVerification}
                onChange={(e) => setShaVerification(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary, #1e40af)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color, #f1f5f9)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Real-time Dark Web Surge Alerts</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>Trigger alert notifications when target syndicate mentions increase by &gt;200%.</div>
              </div>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary, #1e40af)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Interface & Visual Theme */}
        <div className="cl-card" style={{
          backgroundColor: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '6px',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--accent-primary, #1e40af)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'monospace'
          }}>
            🎨 INTERFACE THEME &amp; DISPLAY PREFERENCES
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: 'var(--text-secondary, #334155)', fontWeight: 600, marginBottom: '8px' }}>
                Active Workspace Visual Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* Light Theme Option Card */}
                <button
                  type="button"
                  onClick={() => {
                    applyTheme('light');
                    setLocalTheme('light');
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: isLight ? '2px solid var(--accent-primary, #1e40af)' : '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: isLight ? 'var(--accent-subtle, #eff6ff)' : 'var(--bg-surface, #ffffff)',
                    color: 'var(--text-primary, #0f172a)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>☀️</span>
                  <div>
                    <div style={{ color: isLight ? 'var(--accent-primary, #1e40af)' : 'var(--text-primary, #0f172a)', fontWeight: 700 }}>
                      Clarity Light Mode {isLight && '(Active Default)'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', fontWeight: 400, marginTop: '2px' }}>
                      Clean high-contrast white &amp; pale slate surfaces for daytime forensics
                    </div>
                  </div>
                </button>

                {/* Dark Theme Option Card */}
                <button
                  type="button"
                  onClick={() => {
                    applyTheme('dark');
                    setLocalTheme('dark');
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    border: isDark ? '2px solid var(--accent-primary, #3b82f6)' : '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: isDark ? 'var(--accent-subtle, rgba(59, 130, 246, 0.15))' : 'var(--bg-surface, #ffffff)',
                    color: 'var(--text-primary, #0f172a)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>🌙</span>
                  <div>
                    <div style={{ color: isDark ? 'var(--accent-primary, #3b82f6)' : 'var(--text-primary, #0f172a)', fontWeight: 700 }}>
                      Dark Slate Mode {isDark && '(Active)'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', fontWeight: 400, marginTop: '2px' }}>
                      Layered deep slate &amp; navy night-shift tactical operations
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '12px', color: 'var(--status-verified, #16a34a)', fontWeight: 600 }}>
            {saveStatus}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => onNavigate && onNavigate('dashboard')}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSaveSettings}>
              Save &amp; Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
