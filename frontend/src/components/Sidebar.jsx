import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Folder,
  Users,
  Navigation,
  Network,
  Clock,
  Radio,
  Shield,
  Database,
  FileText,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'MAIN',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null,
        desc: 'Command telemetry & crime prediction'
      },
      {
        id: 'cases',
        label: 'Cases',
        icon: Folder,
        badge: '5 ACTIVE',
        badgeType: 'critical',
        desc: 'FIR repository & case investigations'
      },
      {
        id: 'entities',
        label: 'Criminal Data',
        icon: Users,
        badge: 'DOSSIER',
        badgeType: 'verified',
        desc: 'Criminal 360° intelligence dossiers & MO'
      }
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      {
        id: 'location',
        label: 'Tracking',
        icon: Navigation,
        badge: 'LIVE GIS',
        badgeType: 'info',
        desc: 'GIS geospatial telemetry & cell tower vectors'
      },
      {
        id: 'network',
        label: 'Connections',
        icon: Network,
        badge: null,
        desc: 'Gang syndicate & money flow topology'
      },
      {
        id: 'timeline',
        label: 'Timeline',
        icon: Clock,
        badge: null,
        desc: 'Forensic event chronology & trace map'
      },
      {
        id: 'anomalies',
        label: 'Predictions',
        icon: Radio,
        badge: 'LIVE',
        badgeType: 'warning',
        desc: 'Real-time threat anomalies & AI stream'
      }
    ]
  },
  {
    title: 'FORENSICS',
    items: [
      {
        id: 'evidence',
        label: 'Evidence',
        icon: Shield,
        badge: '65B BSA',
        badgeType: 'verified',
        desc: 'Catalogued forensic exhibits & chain of custody'
      },
      {
        id: 'ingestion',
        label: 'Digital Forensics',
        icon: Database,
        badge: 'TELECOM',
        badgeType: 'warning',
        desc: 'CDR, IP logs & telecom data ingestion hub'
      }
    ]
  },
  {
    title: 'OUTPUT',
    items: [
      {
        id: 'reports',
        label: 'Reports/Charge-Sheets',
        icon: FileText,
        badge: 'BNSS 193',
        badgeType: 'warning',
        desc: 'Court-ready police chargesheet Form 173'
      }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        badge: null,
        desc: 'Access control, CCTNS sync & audit logs'
      }
    ]
  }
];

export default function Sidebar({
  activePage = 'dashboard',
  onNavigate,
  mobileOpen = false,
  onCloseMobile
}) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('crimelens_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('crimelens_user');
        if (stored) setCurrentUser(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const userName = currentUser?.name || 'Insp. Rajesh Kumar';
  const userRole = currentUser?.role || 'Lead Investigator';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'RK';

  const handleItemClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`crimelens-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      aria-label="Application Navigation Sidebar"
    >
      {/* 1. Header & Branding */}
      <div
        style={{
          height: '58px',
          padding: '0 16px',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-sidebar, #ffffff)',
          flexShrink: 0
        }}
      >
        <div
          onClick={() => handleItemClick('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="CrimeLens - Law Enforcement Intelligence (Kavach AI)"
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-primary, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 1px 2px 0 rgba(30, 64, 175, 0.2)'
            }}
          >
            <Shield size={18} strokeWidth={2.4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '0.4px',
                color: 'var(--text-primary, #0f172a)',
                lineHeight: '1.2'
              }}
            >
              CRIME<span style={{ color: 'var(--accent-primary, #1e40af)' }}>LENS</span>
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.8px',
                color: 'var(--text-muted, #64748b)',
                textTransform: 'uppercase',
                lineHeight: '1'
              }}
            >
              Kavach AI
            </span>
          </div>
        </div>

        {/* Mobile drawer close button */}
        <button
          type="button"
          className="sidebar-mobile-close"
          onClick={onCloseMobile}
          title="Close navigation drawer"
          aria-label="Close navigation"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted, #64748b)',
            padding: '4px',
            borderRadius: '4px',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. Scrollable Navigation Sections */}
      <div className="crimelens-sidebar-nav">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Section Heading */}
            <div className="sidebar-nav-group-title">
              {group.title}
            </div>

            {/* Navigation Items */}
            {group.items.map((item) => {
              const isActive =
                (item.id === 'dashboard' && (activePage === 'dashboard' || activePage === 'home')) ||
                activePage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  title={`${item.label} — ${item.desc}`}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && <div className="sidebar-nav-indicator" />}

                  {/* Left: Icon & Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      color={isActive ? '#1e40af' : '#64748b'}
                      style={{ flexShrink: 0 }}
                    />
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '13px'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {/* Right: Badge */}
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        letterSpacing: '0.3px',
                        backgroundColor:
                          item.badgeType === 'critical'
                            ? '#fef2f2'
                            : item.badgeType === 'verified'
                            ? '#f0fdf4'
                            : item.badgeType === 'warning'
                            ? '#fffbeb'
                            : '#eff6ff',
                        color:
                          item.badgeType === 'critical'
                            ? '#dc2626'
                            : item.badgeType === 'verified'
                            ? '#16a34a'
                            : item.badgeType === 'warning'
                            ? '#d97706'
                            : '#1e40af',
                        border:
                          item.badgeType === 'critical'
                            ? '1px solid #fecaca'
                            : item.badgeType === 'verified'
                            ? '1px solid #bbf7d0'
                            : item.badgeType === 'warning'
                            ? '1px solid #fde68a'
                            : '1px solid #bfdbfe'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Bottom Investigator Profile / System Status Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          padding: '12px 14px',
          backgroundColor: 'var(--bg-subtle, #f8fafc)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div
            onClick={() => handleItemClick('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              minWidth: 0,
              flex: 1
            }}
            title="View Investigator Clearance & Settings"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-subtle, #eff6ff)',
                border: '1px solid var(--border-strong, #bfdbfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary, #1e40af)',
                fontWeight: 700,
                fontSize: '12.5px',
                flexShrink: 0
              }}
            >
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: 'var(--text-primary, #0f172a)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {userName}
              </div>
              <div
                style={{
                  fontSize: '10.5px',
                  color: 'var(--text-muted, #64748b)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleItemClick('settings')}
            title="System Settings & Audit"
            aria-label="Settings"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted, #64748b)',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary, #1e40af)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted, #64748b)')}
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
