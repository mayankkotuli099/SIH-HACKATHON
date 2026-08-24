import React, { useState } from 'react';

export default function DashboardPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = [
    {
      id: 'entities',
      title: 'TOTAL ENTITIES',
      value: '12,458',
      change: '+3.4% from last week',
      icon: '{}',
      borderAccent: 'rgba(0, 229, 255, 0.2)'
    },
    {
      id: 'relationships',
      title: 'RELATIONSHIPS',
      value: '35,789',
      change: '+8.1% from last week',
      icon: '🕸',
      borderAccent: 'rgba(41, 121, 255, 0.2)'
    },
    {
      id: 'cases',
      title: 'ACTIVE CASES',
      value: '245',
      change: '12 REQUIRING ATTENTION',
      icon: '📁',
      borderAccent: 'rgba(0, 230, 118, 0.2)'
    },
    {
      id: 'high-risk',
      title: 'HIGH-RISK ENTITIES',
      value: '32 •',
      change: '! IMMEDIATE REVIEW REQUIRED',
      icon: '⚠️',
      isWarning: true,
      borderAccent: 'rgba(255, 85, 85, 0.4)'
    }
  ];

  const topInfluencers = [
    { id: 'E1', name: 'NODE_X92_BETA', relevance: '98.5%', connections: '4,210' },
    { id: 'E2', name: 'ALIAS_UNKNOWN_4494', relevance: '94.2%', connections: '3,845' },
    { id: 'E3', name: 'IP_ROUTE_77.9.XX', relevance: '88.7%', connections: '2,109' },
  ];

  const recentLogs = [
    {
      id: 1,
      time: '2024-10-27 14:32:01',
      type: 'NEW CONNECTION',
      typeColor: 'var(--cyan-glow)',
      entity: 'NODE_X92_BETA → ALIAS_UK_09',
      severity: 'LOW',
      severityColor: 'var(--text-secondary)',
      action: 'VIEW DETAILS'
    },
    {
      id: 2,
      time: '2024-10-27 14:28:45',
      type: 'ANOMALY DETECTED',
      typeColor: '#FF5555',
      entity: 'IP_ROUTE_77.9.XX',
      severity: '▲ CRITICAL',
      severityColor: '#FF5555',
      action: 'INVESTIGATE'
    },
    {
      id: 3,
      time: '2024-10-27 14:15:22',
      type: 'DATA IMPORT',
      typeColor: 'var(--text-muted)',
      entity: 'BATCH_REQ_992 (450 records)',
      severity: 'INFO',
      severityColor: 'var(--text-muted)',
      action: 'VIEW LOG'
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
        {/* Header Title + System Status + Action Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#FFFFFF',
              marginBottom: '0.35rem',
              textTransform: 'uppercase'
            }}>
              Investigation Overview
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" style={{ width: '8px', height: '8px' }} />
              <span style={{
                color: 'var(--cyan-glow)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                SYSTEM STATUS: SECURE & MONITORING
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn-outline-cyan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              EXPORT
            </button>
            <button className="btn-cyan">
              + NEW QUERY
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {metrics.map((m) => (
            <div
              key={m.id}
              className="glass-card"
              style={{
                padding: '1.25rem 1.5rem',
                border: m.isWarning ? '1.5px solid rgba(255, 85, 85, 0.4)' : `1px solid ${m.borderAccent}`,
                backgroundColor: m.isWarning ? 'rgba(30, 15, 20, 0.8)' : 'rgba(16, 22, 34, 0.8)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  fontWeight: 600,
                  color: m.isWarning ? '#FF6B6B' : 'var(--text-secondary)'
                }}>
                  {m.title}
                </span>
                <span style={{ fontSize: '14px', color: m.isWarning ? '#FF6B6B' : 'var(--cyan-glow)' }}>
                  {m.icon}
                </span>
              </div>

              <div style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: m.isWarning ? '#FF6B6B' : '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                marginBottom: '0.4rem',
                letterSpacing: '-0.5px'
              }}>
                {m.value}
              </div>

              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: m.isWarning ? '#FF8888' : 'var(--cyan-glow)'
              }}>
                {m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Central Middle Grid: Network Topology Map + Right Panels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Center: Network Topology Map Card */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--cyan-glow)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>
                <span>🕸</span> NETWORK TOPOLOGY MAP
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--cyan-glow)', borderRadius: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}>🔍</button>
                <button style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--cyan-glow)', borderRadius: '3px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}>⚙</button>
              </div>
            </div>

            {/* Holographic Visualizer Area */}
            <div style={{
              flex: 1,
              minHeight: '280px',
              backgroundColor: 'rgba(5, 8, 14, 0.9)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1rem',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.15) 0%, rgba(41, 121, 255, 0.05) 50%, transparent 80%)',
                pointerEvents: 'none'
              }} />

              {/* Sub-header inside Map */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  CURRENT VIEW
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan-glow)', fontWeight: 700 }}>
                  CLUSTER_ALPHA_9
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  NODES: 1,432 | EDGES: 4,891
                </div>
              </div>

              {/* Graph Hologram Simulation */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '140px'
              }}>
                <svg width="260" height="140" viewBox="0 0 260 140" fill="none">
                  <line x1="50" y1="70" x2="130" y2="40" stroke="rgba(0, 229, 255, 0.6)" strokeWidth="1.5" />
                  <line x1="130" y1="40" x2="210" y2="70" stroke="rgba(0, 229, 255, 0.6)" strokeWidth="1.5" />
                  <line x1="50" y1="70" x2="130" y2="100" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" />
                  <line x1="130" y1="100" x2="210" y2="70" stroke="rgba(0, 229, 255, 0.4)" strokeWidth="1.5" />
                  <line x1="130" y1="40" x2="130" y2="100" stroke="rgba(255, 85, 85, 0.6)" strokeWidth="2" strokeDasharray="3 3" />
                  
                  <circle cx="50" cy="70" r="10" fill="#070A0F" stroke="#00E5FF" strokeWidth="2" />
                  <circle cx="130" cy="40" r="14" fill="#070A0F" stroke="#00E5FF" strokeWidth="2.5" />
                  <circle cx="210" cy="70" r="10" fill="#070A0F" stroke="#00E5FF" strokeWidth="2" />
                  <circle cx="130" cy="100" r="12" fill="#070A0F" stroke="#FF5555" strokeWidth="2.5" />
                  <circle cx="130" cy="40" r="4" fill="#00E5FF" />
                  <circle cx="130" cy="100" r="4" fill="#FF5555" />
                </svg>
              </div>

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  THREAT LEVEL: HIGH
                </span>
                <button
                  onClick={() => onNavigate && onNavigate('timeline')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan-glow)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  EXPAND IN TIMELINE →
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Risk Distribution + Top Influencers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Risk Distribution Card */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '1px',
                marginBottom: '1rem'
              }}>
                📊 RISK DISTRIBUTION
              </div>
              <div style={{ display: 'flex', height: '14px', borderRadius: '3px', overflow: 'hidden', gap: '2px', marginBottom: '8px' }}>
                <div style={{ flex: 4, backgroundColor: 'var(--cyan-glow)' }} />
                <div style={{ flex: 3, backgroundColor: 'var(--accent-blue)' }} />
                <div style={{ flex: 2, backgroundColor: '#FBBF24' }} />
                <div style={{ flex: 1, backgroundColor: '#FF5555' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                <span>LOW (40%)</span>
                <span>MED (30%)</span>
                <span>HIGH (20%)</span>
                <span style={{ color: '#FF5555', fontWeight: 700 }}>CRIT (10%)</span>
              </div>
            </div>

            {/* Top Influencers Card */}
            <div className="glass-card" style={{ padding: '1.25rem', flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#FFFFFF',
                marginBottom: '1rem'
              }}>
                <span>🕸 TOP INFLUENCERS</span>
                <span style={{ color: 'var(--cyan-glow)', fontSize: '10px', cursor: 'pointer' }}>VIEW ALL</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topInfluencers.map((inf) => (
                  <div
                    key={inf.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: 'rgba(0, 229, 255, 0.04)',
                      border: '1px solid rgba(0, 229, 255, 0.12)',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--cyan-glow)' }}>
                        {inf.id}
                      </span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#E2E8F0' }}>
                        {inf.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cyan-glow)', fontWeight: 700 }}>
                        {inf.relevance}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
                        {inf.connections} conn
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Activity Log Table */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.75rem'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📑</span> RECENT ACTIVITY LOG
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '11px', color: 'var(--cyan-glow)', fontFamily: 'var(--font-mono)' }}>LIVE FEED</span>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>TIMESTAMP (UTC)</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>EVENT TYPE</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>TARGET / ENTITY</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>SEVERITY</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{log.time}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        border: `1px solid ${log.typeColor}`,
                        color: log.typeColor,
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#FFFFFF', fontWeight: 600 }}>{log.entity}</td>
                    <td style={{ padding: '12px', color: log.severityColor, fontWeight: 700 }}>{log.severity}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => onNavigate && onNavigate('timeline')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--cyan-glow)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {log.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
