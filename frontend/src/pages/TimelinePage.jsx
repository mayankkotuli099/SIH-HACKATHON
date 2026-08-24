import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';

export default function TimelinePage({ onNavigate }) {
  const [filterType, setFilterType] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [backendEvents, setBackendEvents] = useState([]);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await api.timeline.getEvents();
        if (data && data.events) {
          setBackendEvents(data.events);
        }
      } catch (err) {
        console.warn('Timeline offline cache mode active.');
      }
    }
    loadTimeline();
  }, []);

  const timelineEvents = [
    {
      id: 1,
      type: 'phone',
      badgeLabel: 'Phone Communication',
      badgeColor: 'var(--cyan-glow)',
      dotColor: 'var(--cyan-glow)',
      timestamp: '2023-10-27 14:32:00 UTC',
      source: '+1 (555) 019-8372',
      target: '+44 7700 900077',
      analysis: 'Encrypted signal detected. Duration: 04m 12s. High probability of operational coordination based on historical patterns.',
      isAnomaly: false
    },
    {
      id: 2,
      type: 'location',
      badgeLabel: 'Location Visit',
      badgeColor: 'var(--cyan-glow)',
      dotColor: 'var(--cyan-glow)',
      timestamp: '2023-10-27 16:45:30 UTC',
      coordinates: '40.7128° N, 74.0060° W',
      observation: 'Target vehicle (License Plate: UNK-482) lingered at Port Terminal C for 45 minutes. Associated with maritime logistics firm.',
      locationTag: 'Port Terminal C // Sector 7',
      isAnomaly: false
    },
    {
      id: 3,
      type: 'finance',
      badgeLabel: 'Financial Transaction',
      badgeColor: '#FF5555',
      dotColor: '#FF5555',
      timestamp: '2023-10-28 09:15:00 UTC',
      amount: '$2,450,000 USD',
      origin: 'Offshore Trust (BVI)',
      destination: 'Shell Corp Holdings',
      warningTitle: 'WARNING: ANOMALY DETECTED',
      warningText: 'Transaction volume exceeds historical baseline by 400%.',
      isAnomaly: true
    },
    {
      id: 4,
      type: 'intercept',
      badgeLabel: 'Encrypted Radio Burst',
      badgeColor: '#A855F7',
      dotColor: '#A855F7',
      timestamp: '2023-10-28 11:20:15 UTC',
      source: 'SIGINT Node Alpha-9',
      target: 'Unknown Receiver // Frequency: 433.92 MHz',
      analysis: 'Shortwave burst detected near Warehouse 4 perimeter. AI automated decrypt extracted coordinates matching target container depot.',
      isAnomaly: false
    }
  ];

  return (
    <div style={{
      flex: 1,
      padding: '2rem 2.5rem 3rem 2.5rem',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%'
    }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#FFFFFF',
            marginBottom: '0.4rem',
            textTransform: 'uppercase'
          }}>
            Activity Timeline
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-mono)'
          }}>
            Chronological sequence of identified events and anomalies.
          </p>
        </div>

        {/* Layout Grid: Timeline stream on left, Insights on right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Timeline Feed with Vertical Glowing Line */}
          <div style={{ position: 'relative', paddingLeft: '32px' }}>
            {/* Vertical Line */}
            <div style={{
              position: 'absolute',
              top: '15px',
              bottom: '20px',
              left: '9px',
              width: '2px',
              backgroundColor: 'rgba(0, 229, 255, 0.2)',
              boxShadow: '0 0 8px rgba(0, 229, 255, 0.3)'
            }} />

            {/* Event Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {timelineEvents.map((evt) => (
                <div key={evt.id} style={{ position: 'relative' }}>
                  {/* Timeline Glowing Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-32px',
                    top: '20px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#0B0F17',
                    border: `2.5px solid ${evt.dotColor}`,
                    boxShadow: `0 0 12px ${evt.dotColor}`,
                    zIndex: 2
                  }} />

                  {/* Event Glass Card */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      border: evt.isAnomaly ? '1.5px solid rgba(255, 85, 85, 0.5)' : '1px solid rgba(0, 229, 255, 0.15)',
                      backgroundColor: evt.isAnomaly ? 'rgba(30, 15, 20, 0.85)' : 'rgba(15, 21, 32, 0.8)'
                    }}
                  >
                    {/* Event Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      paddingBottom: '0.75rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: evt.badgeColor,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        <span>{evt.type === 'phone' ? '📱' : evt.type === 'location' ? '📍' : evt.type === 'finance' ? '💳' : '📡'}</span>
                        {evt.badgeLabel}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-muted)'
                      }}>
                        {evt.timestamp}
                      </div>
                    </div>

                    {/* Content Based on Event Type */}
                    {evt.type === 'phone' && (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SOURCE</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#E2E8F0' }}>{evt.source}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TARGET</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#E2E8F0' }}>{evt.target}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <span style={{ color: 'var(--cyan-glow)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>ANALYSIS // </span>
                          {evt.analysis}
                        </div>
                      </div>
                    )}

                    {evt.type === 'location' && (
                      <div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          padding: '10px',
                          borderRadius: '6px',
                          marginBottom: '0.85rem'
                        }}>
                          <div style={{
                            width: '90px',
                            height: '60px',
                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                            borderRadius: '4px',
                            border: '1px solid rgba(0, 229, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '22px'
                          }}>
                            🗺️
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>COORDINATES</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan-glow)', marginBottom: '4px' }}>
                              {evt.coordinates}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {evt.locationTag}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <span style={{ color: 'var(--cyan-glow)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>OBSERVATION // </span>
                          {evt.observation}
                        </div>
                      </div>
                    )}

                    {evt.type === 'finance' && (
                      <div>
                        <div style={{
                          backgroundColor: 'rgba(255, 85, 85, 0.12)',
                          border: '1px solid rgba(255, 85, 85, 0.3)',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ color: '#FF6B6B', fontWeight: 800, fontSize: '13px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ⚠️ {evt.warningTitle}
                          </div>
                          <div style={{ color: '#E2E8F0', fontSize: '12px', marginTop: '2px' }}>
                            {evt.warningText}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>AMOUNT</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#FF6B6B' }}>
                              {evt.amount}
                            </div>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ORIGIN</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#E2E8F0' }}>{evt.origin}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>DESTINATION</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#E2E8F0' }}>{evt.destination}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {evt.type === 'intercept' && (
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SOURCE</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: '#E2E8F0' }}>{evt.source}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TARGET</span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: '#E2E8F0' }}>{evt.target}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <span style={{ color: '#A855F7', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>DECRYPT // </span>
                          {evt.analysis}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Insights Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Timeline Insights Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ color: 'var(--cyan-glow)' }}>📊</span> TIMELINE INSIGHTS
              </h3>

              <div style={{
                backgroundColor: 'rgba(0, 229, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.15)',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--cyan-glow)',
                  fontWeight: 700,
                  marginBottom: '4px'
                }}>
                  CRITICAL NODE IDENTIFIED
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The intersection of Location Visit (Terminal C) and the ensuing Financial Transaction suggests a coordinated handover of assets.
                </p>
              </div>

              {/* Pattern Analysis Bar Chart */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  letterSpacing: '0.5px'
                }}>
                  PATTERN ANALYSIS // ACTIVITY FREQUENCY (7 DAYS)
                </div>
                <div style={{
                  height: '110px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '8px',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {[
                    { h: '35%', color: 'var(--cyan-glow)' },
                    { h: '25%', color: 'var(--cyan-glow)' },
                    { h: '65%', color: 'var(--cyan-glow)' },
                    { h: '45%', color: 'var(--cyan-glow)' },
                    { h: '95%', color: '#FF5555' },
                    { h: '30%', color: 'var(--cyan-glow)' },
                    { h: '50%', color: 'var(--cyan-glow)' }
                  ].map((bar, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: bar.h,
                        backgroundColor: bar.color,
                        borderRadius: '2px 2px 0 0',
                        boxShadow: `0 0 8px ${bar.color}`
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <span>D-6</span>
                  <span>D-5</span>
                  <span>D-4</span>
                  <span>D-3</span>
                  <span style={{ color: '#FF5555', fontWeight: 700 }}>TODAY</span>
                  <span>D+1</span>
                  <span>D+2</span>
                </div>
              </div>
            </div>

            {/* Export Report Action */}
            <button className="btn-outline-cyan" style={{ width: '100%', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              EXPORT TIMELINE REPORT
            </button>
          </div>
        </div>
    </div>
  );
}
