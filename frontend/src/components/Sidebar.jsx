import React, { useState, useEffect } from 'react';

export default function Sidebar({
  activePage = 'dashboard',
  onNavigate,
  isCollapsed = false,
  onToggle
}) {
  // Local fallback if onToggle is not provided
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setCollapsed(!collapsed);
    }
  };

  const navSections = [
    {
      group: 'INVESTIGATION & INTELLIGENCE',
      items: [
        { id: 'dashboard', label: 'DASHBOARD', icon: '📊', badge: null, desc: 'Live Telemetry & KPIs' },
        { id: 'cases', label: 'FIR & CASES', icon: '📁', badge: 'ACTIVE', badgeColor: '#00E5FF', desc: 'Case Files & FIR Records' },
        { id: 'entities', label: 'CRIMINAL 360', icon: '👤', badge: 'DOSSIER', badgeColor: '#00E676', desc: 'Biometric & Profile Intel' },
        { id: 'timeline', label: 'TIMELINE & MAP', icon: '⏱️', badge: 'LIVE', badgeColor: '#00E5FF', desc: 'Chronological Event Trace & Map' },
        { id: 'reports', label: 'CHARGESHEETS', icon: '📄', badge: 'BNSS 193', badgeColor: '#FBBF24', desc: 'Form 173 Final Reports' }
      ]
    },
    {
      group: 'THREAT DETECTION',
      items: [
        { id: 'network', label: 'GANG NETWORK', icon: '🕸️', badge: null, desc: 'Cluster & Node Linkage' },
        { id: 'anomalies', label: 'ANOMALIES', icon: '⚡', badge: '3 NEW', badgeColor: '#FF5555', desc: 'Neural Outlier Alerts' },
        { id: 'location', label: 'GEO TRACKING', icon: '📍', badge: null, desc: 'Spatial Heatmaps & Geofence' },
        { id: 'ai_assistant', label: 'AI COPILOT', icon: '🤖', badge: 'GPT-4.5', badgeColor: '#A855F7', desc: 'Neural Investigation Agent' }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '74px' : '260px',
        minWidth: collapsed ? '74px' : '260px',
        height: 'calc(100vh - 68px)',
        position: 'sticky',
        top: '68px',
        backgroundColor: 'rgba(9, 13, 21, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(0, 229, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), min-width 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 40,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* Top Header & Operator / Collapse Toggle Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toggle Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '14px 8px' : '14px 16px',
            borderBottom: '1px solid rgba(0, 229, 255, 0.08)',
            backgroundColor: 'rgba(0, 229, 255, 0.03)'
          }}
        >
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px' }} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  letterSpacing: '1.5px',
                  color: 'var(--cyan-glow)',
                  fontWeight: 700
                }}
              >
                TACTICAL PANEL
              </span>
            </div>
          )}

          <button
            onClick={handleToggle}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '6px',
              color: 'var(--cyan-glow)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.2)';
              e.currentTarget.style.borderColor = 'var(--cyan-glow)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {collapsed ? (
              // Expand Icon (Chevron Right / Panel Open)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            ) : (
              // Collapse Icon (Chevron Left / Panel Close)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            )}
          </button>
        </div>

        {/* Operator Profile Card */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '8px 4px' : '10px 12px',
              backgroundColor: 'rgba(0, 229, 255, 0.04)',
              border: '1px solid rgba(0, 229, 255, 0.12)',
              borderRadius: '6px',
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
            title={collapsed ? 'OPERATOR_01 (LEVEL 4 ACCESS)' : ''}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                minWidth: '34px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-glow)',
                position: 'relative'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#00E676',
                  border: '1.5px solid #07090E',
                  boxShadow: '0 0 6px #00E676'
                }}
              />
            </div>

            {!collapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: '#FFFFFF'
                  }}
                >
                  OPERATOR_01
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    color: 'var(--cyan-glow)',
                    letterSpacing: '0.5px'
                  }}
                >
                  CLEARANCE LVL 4
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <div
          style={{
            padding: collapsed ? '6px 8px' : '6px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 270px)'
          }}
        >
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              {!collapsed && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    color: 'var(--text-muted)',
                    padding: '4px 8px 6px 8px',
                    textTransform: 'uppercase'
                  }}
                >
                  {section.group}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {section.items.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate && onNavigate(item.id)}
                      title={collapsed ? `${item.label} - ${item.desc}` : item.desc}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: collapsed ? '10px 0' : '9px 12px',
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.18) 0%, rgba(0, 229, 255, 0.04) 100%)'
                          : 'transparent',
                        border: isActive ? '1px solid var(--cyan-glow)' : '1px solid transparent',
                        borderRadius: '6px',
                        color: isActive ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: '0.8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        boxShadow: isActive ? '0 0 14px rgba(0, 229, 255, 0.2)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.08)';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                        <span style={{ fontSize: '15px', lineHeight: 1 }}>{item.icon}</span>
                        {!collapsed && (
                          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {/* Badge if present and expanded */}
                      {!collapsed && item.badge && (
                        <span
                          style={{
                            fontSize: '8.5px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.5px',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            backgroundColor: `${item.badgeColor || '#00E5FF'}22`,
                            color: item.badgeColor || '#00E5FF',
                            border: `1px solid ${item.badgeColor || '#00E5FF'}66`
                          }}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed dot badge */}
                      {collapsed && item.badge && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '12px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: item.badgeColor || 'var(--cyan-glow)',
                            boxShadow: `0 0 6px ${item.badgeColor || 'var(--cyan-glow)'}`
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div
        style={{
          borderTop: '1px solid rgba(0, 229, 255, 0.12)',
          padding: collapsed ? '12px 8px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 229, 255, 0.02)'
        }}
      >
        {/* Quick Toggle / Full Bar Expand-Collapse Button */}
        <button
          onClick={handleToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 0',
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px dashed rgba(0, 229, 255, 0.25)',
            borderRadius: '4px',
            color: 'var(--cyan-glow)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.15)';
            e.currentTarget.style.borderColor = 'var(--cyan-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.25)';
          }}
        >
          {collapsed ? (
            <span>» EXPAND</span>
          ) : (
            <span>« COLLAPSE SIDEBAR</span>
          )}
        </button>
      </div>
    </aside>
  );
}
