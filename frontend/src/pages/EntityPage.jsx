import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export default function EntityPage({ onNavigate }) {
  const [exportNotification, setExportNotification] = useState(false);
  const [freezeNotification, setFreezeNotification] = useState(false);
  const [entitiesList, setEntitiesList] = useState([]);

  useEffect(() => {
    async function loadEntities() {
      try {
        const data = await api.entities.getAll();
        if (data && data.entities) {
          setEntitiesList(data.entities);
        }
      } catch (err) {
        console.warn('Entity fallback mode active.');
      }
    }
    loadEntities();
  }, []);

  const handleExport = () => {
    setExportNotification(true);
    setTimeout(() => setExportNotification(false), 3000);
  };

  const handleFreeze = () => {
    setFreezeNotification(true);
    setTimeout(() => setFreezeNotification(false), 3000);
  };

  return (
    <div style={{
      flex: 1,
      minHeight: 'calc(100vh - 68px)',
      backgroundColor: '#07090E',
      color: '#FFFFFF',
      fontFamily: 'var(--font-sans)',
      padding: '2rem 2.5rem 3rem 2.5rem',
      position: 'relative',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%'
    }}>
      {exportNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(0, 229, 255, 0.95)',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          DOSSIER EXPORTED SUCCESSFULLY (PDF / ENCRYPTED XML)
        </div>
      )}

      {freezeNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(255, 85, 85, 0.95)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(255, 85, 85, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
          EMERGENCY ASSET FREEZE PROTOCOL INITIATED
        </div>
      )}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          letterSpacing: '1px',
          color: '#FFFFFF',
          marginBottom: '6px',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase'
        }}>
          ENTITY 360 DOSSIER & BIOMETRIC PROFILE
        </h1>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          letterSpacing: '1.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>TARGET: <strong style={{ color: 'var(--cyan-glow)' }}>VIKTOR KOVACS</strong></span>
          <span style={{ color: 'var(--text-muted)' }}>//</span>
          <span>ALIAS: <strong style={{ color: 'var(--cyan-glow)' }}>CIPHER</strong></span>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr 1.25fr 1fr',
        gap: '1.25rem',
        alignItems: 'start',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" strokeWidth="2">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
              </svg>
              <span>Facial Recognition Scan</span>
            </div>
            <div style={{
              height: '210px',
              backgroundColor: 'rgba(7, 10, 16, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.1)',
              borderRadius: '6px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', width: '14px', height: '14px', borderTop: '2px solid var(--cyan-glow)', borderLeft: '2px solid var(--cyan-glow)' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '14px', height: '14px', borderTop: '2px solid var(--cyan-glow)', borderRight: '2px solid var(--cyan-glow)' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '14px', height: '14px', borderBottom: '2px solid var(--cyan-glow)', borderLeft: '2px solid var(--cyan-glow)' }} />
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '14px', height: '14px', borderBottom: '2px solid var(--cyan-glow)', borderRight: '2px solid var(--cyan-glow)' }} />

              <svg width="150" height="170" viewBox="0 0 100 120" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.6))' }}>

                <polygon points="50,10 68,18 82,35 86,58 80,82 66,102 50,110 34,102 20,82 14,58 18,35 32,18" stroke="#00e5ff" strokeWidth="0.8" fill="rgba(0, 229, 255, 0.03)" />
                <polygon points="50,18 64,25 74,40 76,58 72,78 60,94 50,100 40,94 28,78 24,58 26,40 36,25" stroke="#00e5ff" strokeWidth="0.6" fill="none" strokeDasharray="1 1" />

                {/* Vertical Center Grid Line */}
                <line x1="50" y1="10" x2="50" y2="110" stroke="#00e5ff" strokeWidth="0.8" />

                {/* Horizontal Mesh Grid Lines */}
                <line x1="18" y1="35" x2="82" y2="35" stroke="#00e5ff" strokeWidth="0.6" />
                <line x1="14" y1="58" x2="86" y2="58" stroke="#00e5ff" strokeWidth="0.6" />
                <line x1="20" y1="82" x2="80" y2="82" stroke="#00e5ff" strokeWidth="0.6" />
                <line x1="34" y1="102" x2="66" y2="102" stroke="#00e5ff" strokeWidth="0.6" />

                {/* Eyes Wireframe Triangles */}
                <polygon points="28,42 38,40 44,45 38,48 28,46" stroke="#00e5ff" strokeWidth="0.9" fill="rgba(0, 229, 255, 0.15)" />
                <polygon points="72,42 62,40 56,45 62,48 72,46" stroke="#00e5ff" strokeWidth="0.9" fill="rgba(0, 229, 255, 0.15)" />
                <circle cx="36" cy="44" r="2.5" fill="#00e5ff" />
                <circle cx="64" cy="44" r="2.5" fill="#00e5ff" />

                {/* Nose Mesh */}
                <polygon points="50,42 45,62 50,68 55,62" stroke="#00e5ff" strokeWidth="0.9" fill="none" />
                <line x1="45" y1="62" x2="55" y2="62" stroke="#00e5ff" strokeWidth="0.6" />

                {/* Mouth Mesh */}
                <polygon points="36,78 44,75 50,77 56,75 64,78 56,83 50,84 44,83" stroke="#00e5ff" strokeWidth="0.9" fill="rgba(0, 229, 255, 0.1)" />

                {/* Cheek & Forehead Triangulation Lines */}
                <line x1="32" y1="18" x2="50" y2="42" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="68" y1="18" x2="50" y2="42" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="18" y1="35" x2="28" y2="42" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="82" y1="35" x2="72" y2="42" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="14" y1="58" x2="45" y2="62" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="86" y1="58" x2="55" y2="62" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="20" y1="82" x2="36" y2="78" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="80" y1="82" x2="64" y2="78" stroke="#00e5ff" strokeWidth="0.5" />
                <line x1="50" y1="84" x2="50" y2="110" stroke="#00e5ff" strokeWidth="0.5" />

                {/* Glowing Nodes / Landmarks */}
                <circle cx="50" cy="18" r="1.5" fill="#00e5ff" />
                <circle cx="32" cy="18" r="1.5" fill="#00e5ff" />
                <circle cx="68" cy="18" r="1.5" fill="#00e5ff" />
                <circle cx="50" cy="42" r="1.5" fill="#00e5ff" />
                <circle cx="50" cy="68" r="1.5" fill="#00e5ff" />
                <circle cx="50" cy="110" r="2" fill="#00e5ff" />
              </svg>

              {/* Scanning laser line overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
                boxShadow: '0 0 10px #00e5ff',
                opacity: 0.7,
                animation: 'scanAnimation 3s infinite linear'
              }} />
              <style>{`
                @keyframes scanAnimation {
                  0% { top: 5%; }
                  50% { top: 90%; }
                  100% { top: 5%; }
                }
              `}</style>
            </div>
          </div>

          {/* Threat Meter */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(255, 85, 85, 0.25)'
          }}>
            <div style={{
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem'
            }}>
              Threat Meter
            </div>

            {/* Score Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 85, 85, 0.15)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '94%',
                height: '100%',
                backgroundColor: 'var(--accent-coral)',
                boxShadow: '0 0 10px var(--accent-coral)',
                borderRadius: '3px'
              }} />
            </div>

            {/* Score Text */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                fontSize: '44px',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-coral)',
                lineHeight: 1,
                textShadow: '0 0 15px rgba(255, 85, 85, 0.4)'
              }}>
                94
              </span>
              <span style={{
                fontSize: '18px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}>
                /100
              </span>
            </div>

            {/* Threat Sub-details */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{
                color: 'var(--accent-coral)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700
              }}>
                <span>⚠</span> HIGH RISK
              </div>
              <div style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>INCREASING TREND</span>
                <span style={{ color: 'var(--accent-coral)', fontWeight: 700 }}>📈 +12%</span>
              </div>
            </div>
          </div>

          {/* Biometric Status */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '0.85rem'
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              <span>Biometric Status</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              <span className="pulse-dot"></span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active, Stable</span>
            </div>
          </div>

        </div>

        {/* ==================== COLUMN 2 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Crypto Wallet Trails & Transnational Fund Flows */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              marginBottom: '1rem',
              lineHeight: 1.3
            }}>
              Crypto Wallet Trails & Transnational Fund Flows
            </h3>

            <div style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              marginBottom: '0.85rem'
            }}>
              RECENT TRANSFERS
            </div>

            {/* Transfers Node List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Item 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>From <strong style={{ color: '#FFFFFF' }}>Shell Corp</strong></span>
                </div>
                <span style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  letterSpacing: '0.5px'
                }}>
                  SHELLCORP
                </span>
              </div>

              {/* Item 2 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                paddingLeft: '4px',
                borderLeft: '1px dashed rgba(0, 229, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan-glow)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>From <strong style={{ color: '#FFFFFF' }}>Shell Corp A</strong></span>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    color: 'var(--cyan-glow)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>
                    SHELLCORP
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>To <strong style={{ color: '#FFFFFF' }}>Shell Corp B</strong></span>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    color: 'var(--cyan-glow)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>
                    SHELLCORP
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                paddingLeft: '4px',
                borderLeft: '1px dashed rgba(0, 229, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan-glow)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>From <strong style={{ color: '#FFFFFF' }}>Shell Corp B</strong></span>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    color: 'var(--cyan-glow)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>
                    SHELLCORP
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>To <strong style={{ color: '#FFFFFF' }}>Shell Corp C</strong></span>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    color: 'var(--cyan-glow)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>
                    SHELLCORP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Records */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <line x1="7" y1="8" x2="17" y2="8"></line>
                <line x1="7" y1="12" x2="13" y2="12"></line>
                <line x1="7" y1="16" x2="10" y2="16"></line>
              </svg>
              <span>Official Records</span>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {/* Passport Mockup */}
              <div style={{
                flex: 1,
                height: '115px',
                backgroundColor: '#111827',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '1px',
                  color: 'var(--cyan-glow)',
                  fontWeight: 700
                }}>
                  PASSPORT
                </div>
                {/* Globe Crest */}
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(0, 229, 255, 0.7)" strokeWidth="1.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div style={{
                  fontSize: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  letterSpacing: '1px'
                }}>
                  PASSPORT
                </div>
                <div style={{
                  width: '12px',
                  height: '8px',
                  border: '1px solid rgba(0, 229, 255, 0.4)',
                  borderRadius: '1px'
                }} />
              </div>

              {/* National ID Card Mockup */}
              <div style={{
                flex: 1.4,
                height: '115px',
                backgroundColor: '#1a2234',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingBottom: '4px'
                }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#e11d48', borderRadius: '1px' }} />
                  <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFFFFF' }}>
                    NATIONAL ID CARD
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Silhouette Photo */}
                  <div style={{
                    width: '32px',
                    height: '40px',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <svg width="22" height="26" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>

                  {/* ID Field Lines */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                    <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.4)', width: '80%', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '60%', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: '90%', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.15)', width: '50%', borderRadius: '1px' }} />
                  </div>
                </div>

                {/* Bottom Barcode */}
                <div style={{
                  height: '10px',
                  background: 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 3px)',
                  opacity: 0.4
                }} />
              </div>
            </div>
          </div>

        </div>

        {/* ==================== COLUMN 3 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Known Vehicle Registrations */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              marginBottom: '0.75rem'
            }}>
              Known Vehicle Registrations
            </h3>

            <div style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Plate:</span>
              <span style={{
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                color: 'var(--cyan-glow)',
                padding: '2px 8px',
                borderRadius: '3px',
                fontWeight: 700,
                border: '1px solid rgba(0, 229, 255, 0.3)'
              }}>
                K-0V-42
              </span>
            </div>

            <div style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: '0.25rem'
            }}>
              RECENT GPS LOGS
            </div>
            <div style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '0.85rem'
            }}>
              SUV-Reg-99 233, 17:08:25 PM
            </div>

            {/* Tactical Dark Map Widget */}
            <div style={{
              height: '140px',
              backgroundColor: '#0c1322',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'
            }}>
              {/* Grid Street Map Background */}
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />

                {/* Roads lines */}
                <path d="M 0 40 Q 80 50 150 20 T 300 70" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="3" />
                <path d="M 60 0 L 80 140" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
                <path d="M 180 0 L 160 140" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />

                {/* GPS Route Path */}
                <path d="M 40 100 L 90 70 L 140 85 L 190 35 L 230 45" fill="none" stroke="var(--cyan-glow)" strokeWidth="2" strokeDasharray="3 3" />

                {/* GPS Node Points */}
                <circle cx="40" cy="100" r="4" fill="var(--cyan-glow)" />
                <circle cx="90" cy="70" r="4" fill="var(--cyan-glow)" />
                <circle cx="140" cy="85" r="4" fill="var(--cyan-glow)" />
                <circle cx="190" cy="35" r="5" fill="var(--accent-coral)" stroke="#ffffff" strokeWidth="1.5" />
              </svg>

              {/* Map Ping Beacon */}
              <div style={{
                position: 'absolute',
                top: '29px',
                left: '184px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 229, 255, 0.4)',
                animation: 'pingBeacon 1.8s infinite ease-out'
              }} />
              <style>{`
                @keyframes pingBeacon {
                  0% { transform: scale(1); opacity: 1; }
                  100% { transform: scale(2.5); opacity: 0; }
                }
              `}</style>
            </div>
          </div>

          {/* Monitored Communications */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Monitored Communications</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              {/* Call Logs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span style={{ color: 'var(--text-secondary)' }}>Call logs:</span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  color: '#FFFFFF'
                }}>
                  +1 2022 5:33 AM
                </span>
              </div>

              {/* SMS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span style={{ color: 'var(--text-secondary)' }}>SMS:</span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  color: '#FFFFFF'
                }}>
                  MESSAGE RECEIVED
                </span>
              </div>

              {/* Encrypted Channel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span style={{ color: 'var(--text-secondary)' }}>Encrypted channel detections:</span>
                </div>
                <div style={{ paddingLeft: '22px' }}>
                  <span style={{
                    fontSize: '10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    color: 'var(--cyan-glow)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontWeight: 600
                  }}>
                    ENCRYPTED
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== COLUMN 4 ==================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* AI Threat Assessment */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            borderColor: 'rgba(0, 229, 255, 0.15)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              marginBottom: '0.85rem'
            }}>
              AI Threat Assessment
            </h3>

            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              marginBottom: '1rem'
            }}>
              Summary AI threat assessment, imminent and key risk factors:
            </p>

            {/* Risk Factor Badges List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                backgroundColor: 'rgba(255, 85, 85, 0.1)',
                border: '1px solid rgba(255, 85, 85, 0.25)',
                color: '#ff8888',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '5px 10px',
                borderRadius: '4px'
              }}>
                • High block factor
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 85, 85, 0.1)',
                border: '1px solid rgba(255, 85, 85, 0.25)',
                color: '#ff8888',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '5px 10px',
                borderRadius: '4px'
              }}>
                • Immediate high-risk category cases
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 85, 85, 0.1)',
                border: '1px solid rgba(255, 85, 85, 0.25)',
                color: '#ff8888',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '5px 10px',
                borderRadius: '4px'
              }}>
                • High risk communication patterns
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 85, 85, 0.1)',
                border: '1px solid rgba(255, 85, 85, 0.25)',
                color: '#ff8888',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '5px 10px',
                borderRadius: '4px'
              }}>
                • High risk behavioral actions
              </div>
            </div>
          </div>

          {/* Predictive Behavior Alert */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '8px',
            padding: '1.25rem',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--cyan-glow)',
              fontWeight: 700,
              marginBottom: '0.85rem'
            }}>
              <span>⚠</span> Predictive Behavior Alert
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--cyan-glow)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#07090E'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#FFFFFF',
                lineHeight: 1.35,
                fontWeight: 500
              }}>
                High probability of imminent asset transfer.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* EXPORT DOSSIER Button */}
            <button
              onClick={handleExport}
              style={{
                backgroundColor: 'var(--cyan-glow)',
                color: '#07090E',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 16px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              EXPORT DOSSIER
            </button>

            {/* FREEZE ASSETS Button */}
            <button
              onClick={handleFreeze}
              style={{
                backgroundColor: 'var(--accent-coral)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 16px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(255, 85, 85, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
              </svg>
              FREEZE ASSETS
            </button>
          </div>

        </div>

      </div>


    </div>
  );
}
