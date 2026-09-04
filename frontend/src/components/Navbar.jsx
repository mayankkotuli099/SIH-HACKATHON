import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  Shield,
  Sun,
  Moon,
  LogOut,
  Building,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Plus,
  Menu
} from 'lucide-react';
import { api } from '../services/api.js';
import { toggleTheme, getInitialTheme } from '../utils/theme.js';
import AddCriminalModal from './AddCriminalModal.jsx';

const BREADCRUMBS_MAP = {
  home: { section: 'Overview', title: 'Command & Prediction Dashboard' },
  dashboard: { section: 'Overview', title: 'Command & Prediction Dashboard' },
  cases: { section: 'Main', title: 'FIR Records & Case Management' },
  evidence: { section: 'Forensics', title: 'Evidence Chain of Custody (65B BSA)' },
  entities: { section: 'Main', title: 'Criminal 360° Intelligence Dossier' },
  location: { section: 'Intelligence', title: 'GIS Geospatial Telemetry & Vectors' },
  network: { section: 'Intelligence', title: 'Gang Syndicate & Association Topology' },
  timeline: { section: 'Intelligence', title: 'Chronological Event Trace & Map' },
  reports: { section: 'Output', title: 'Chargesheet Generator (BNSS 193 / Form 173)' },
  settings: { section: 'System', title: 'Platform Settings & Forensic Audit' },
  anomalies: { section: 'Intelligence', title: 'Real-time Threat Analytics' },
  ai_assistant: { section: 'Intelligence', title: 'Neural Copilot & AI Investigation' }
};

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Ballistics Match Confirmed',
    desc: '9mm Beretta match on Sector 18 Homicide scene (99.4% confidence).',
    time: '4 mins ago',
    type: 'critical',
    unread: true
  },
  {
    id: 'notif-2',
    title: 'Cell Tower Triangulation Alert',
    desc: 'Burner IMEI 864201938472910 pinged on Meerut Expressway.',
    time: '18 mins ago',
    type: 'warning',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'CCTNS National Node Sync',
    desc: '1,432 inter-state criminal records synced successfully.',
    time: '1 hour ago',
    type: 'info',
    unread: false
  }
];

export const POLICE_STATIONS_NAV = [
  { id: 'PS-18', name: 'PS Sector 18 Crime Branch', code: 'STN-NCR-018' },
  { id: 'PS-14', name: 'Women Safety PS Sector 14', code: 'STN-NCR-014' },
  { id: 'PS-SADAR', name: 'PS Sadar Bazar Anti-Robbery', code: 'STN-DEL-042' },
  { id: 'PS-STF', name: 'Special Cell STF Delhi HQ', code: 'STN-STF-001' },
  { id: 'PS-CYBER', name: 'Cyber Crime PS Sector 43', code: 'STN-CYB-043' }
];

export default function Navbar({ activePage = 'dashboard', onNavigate, onToggleSidebar }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [stationOpen, setStationOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const stationRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('crimelens_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [selectedStationId, setSelectedStationId] = useState(() => {
    try {
      return localStorage.getItem('crimelens_station_id') || 'PS-18';
    } catch {
      return 'PS-18';
    }
  });

  const currentStation = POLICE_STATIONS_NAV.find((s) => s.id === selectedStationId) || POLICE_STATIONS_NAV[0];

  useEffect(() => {
    const handleThemeChange = (e) => setCurrentTheme(e.detail || getInitialTheme());
    window.addEventListener('crimelens-theme-change', handleThemeChange);
    return () => window.removeEventListener('crimelens-theme-change', handleThemeChange);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (stationRef.current && !stationRef.current.contains(e.target)) setStationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStationSelect = (st) => {
    setSelectedStationId(st.id);
    localStorage.setItem('crimelens_station_id', st.id);
    setStationOpen(false);
  };

  const handleThemeToggle = () => {
    const next = toggleTheme();
    setCurrentTheme(next);
  };

  const handleLogout = () => {
    api.auth.logout();
    navigate('/login');
  };

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('crimelens:open-global-search'));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const breadcrumb = BREADCRUMBS_MAP[activePage] || { section: 'Investigation', title: activePage.toUpperCase() };

  return (
    <header
      style={{
        height: '56px',
        backgroundColor: 'var(--bg-navbar, #ffffff)',
        borderBottom: '1px solid var(--border-color, #e2e8f0)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Left: Mobile Toggle & Dynamic Contextual Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="mobile-sidebar-toggle"
          title="Open Navigation Menu"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        {/* Mobile Brand Crest (Visible only on mobile when sidebar is offscreen) */}
        <div
          className="mobile-brand-crest"
          onClick={() => onNavigate && onNavigate('dashboard')}
          style={{
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="CrimeLens - Law Enforcement Intelligence"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '5px',
              backgroundColor: 'var(--accent-primary, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Shield size={16} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.4px',
              color: 'var(--text-primary, #0f172a)'
            }}
          >
            CRIME<span style={{ color: 'var(--accent-primary, #1e40af)' }}>LENS</span>
          </span>
        </div>

        {/* Contextual Breadcrumb Navigation */}
        <nav className="breadcrumb-nav">
          <span
            className="link"
            onClick={() => onNavigate && onNavigate('dashboard')}
            style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted, #64748b)' }}
          >
            {breadcrumb.section}
          </span>
          <span className="separator" style={{ color: 'var(--text-muted, #94a3b8)' }}>/</span>
          <span className="current" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
            {breadcrumb.title}
          </span>
        </nav>
      </div>

      {/* Right: Contextual Utility Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Global Search Bar / Button (Ctrl+K) */}
        <button
          onClick={handleOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            border: '1px solid var(--border-color, #cbd5e1)',
            borderRadius: '6px',
            padding: '5px 12px',
            color: 'var(--text-muted, #64748b)',
            fontSize: '12.5px',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary, #1e40af)';
            e.currentTarget.style.backgroundColor = 'var(--bg-surface, #ffffff)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color, #cbd5e1)';
            e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f8fafc)';
          }}
          title="Search all cases, suspects, evidence, and reports (Ctrl+K)"
        >
          <Search size={14} color="var(--text-muted, #64748b)" />
          <span style={{ color: 'var(--text-muted, #64748b)' }}>Search intelligence...</span>
          <kbd
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              backgroundColor: 'var(--bg-surface, #ffffff)',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '3px',
              padding: '1px 5px',
              color: 'var(--text-muted, #64748b)',
              marginLeft: '6px'
            }}
          >
            Ctrl+K
          </kbd>
        </button>

        {/* Live CCTNS Sync Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#15803d'
          }}
          title="Live synchronization active with state police CCTNS node"
        >
          <span className="pulse-dot" style={{ backgroundColor: '#16a34a', width: '6px', height: '6px' }} />
          <span>CCTNS LIVE</span>
        </div>

        {/* Connected Police Station Dropdown */}
        <div ref={stationRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setStationOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              color: 'var(--text-primary, #334155)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Building size={14} color="var(--text-muted, #64748b)" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentStation.name.replace('PS ', '')}
            </span>
            <ChevronDown size={12} color="var(--text-muted, #64748b)" />
          </button>

          {stationOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '260px',
                backgroundColor: 'var(--bg-modal, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
                padding: '6px',
                zIndex: 60
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #64748b)', padding: '6px 8px' }}>
                SWITCH POLICE STATION NODE
              </div>
              {POLICE_STATIONS_NAV.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleStationSelect(st)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedStationId === st.id ? 'var(--accent-subtle, #eff6ff)' : 'transparent',
                    color: selectedStationId === st.id ? 'var(--accent-primary, #1e40af)' : 'var(--text-primary, #0f172a)',
                    fontWeight: selectedStationId === st.id ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{st.name}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{st.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: notifOpen ? 'var(--bg-subtle, #f1f5f9)' : 'transparent',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)',
              position: 'relative'
            }}
            title="Forensic & Threat Alerts"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-critical, #dc2626)'
                }}
              />
            )}
          </button>

          {notifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-modal, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
                padding: '8px',
                zIndex: 60
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderBottom: '1px solid var(--border-color, #f1f5f9)'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Threat Notifications</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-primary, #1e40af)', cursor: 'pointer' }} onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}>
                  Mark all read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: n.unread ? 'var(--bg-subtle, #f8fafc)' : 'transparent',
                      borderLeft: n.unread ? '3px solid var(--accent-primary, #1e40af)' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{n.title}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Light / Dark Theme Toggle Button */}
        <button
          type="button"
          onClick={handleThemeToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            height: '32px',
            padding: '0 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-subtle, #f1f5f9)',
            border: '1px solid var(--border-strong, #cbd5e1)',
            color: 'var(--text-primary, #0f172a)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={`Current theme: ${currentTheme === 'dark' ? 'Dark' : 'Light'}. Click to switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {currentTheme === 'dark' ? (
            <>
              <Sun size={14} color="#fbbf24" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={14} color="var(--accent-primary, #1e40af)" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Primary Action Button: + Register Suspect */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
          style={{
            padding: '6px 12px !important',
            fontSize: '12px !important',
            height: '32px'
          }}
          title="Register new suspect in police database"
        >
          <Plus size={14} />
          <span>Register Suspect</span>
        </button>

        {/* Operator Profile Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 8px 3px 4px',
              backgroundColor: profileOpen ? 'var(--bg-subtle, #f1f5f9)' : 'var(--bg-surface, #f8fafc)',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary, #1e40af)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              OP
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
              {currentUser ? currentUser.name || currentUser.id : 'Operator 01'}
            </span>
            <ChevronDown size={12} color="var(--text-muted, #64748b)" />
          </button>

          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '240px',
                backgroundColor: 'var(--bg-modal, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
                padding: '8px',
                zIndex: 60
              }}
            >
              <div style={{ padding: '8px', borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                  {currentUser ? currentUser.name || currentUser.id : 'Operator 01'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--status-verified, #16a34a)', fontWeight: 600 }}>LEVEL 4 CLEARANCE</div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)' }}>Special Operations Grid</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '4px 0' }}>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    if (onNavigate) onNavigate('settings');
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 8px' }}
                >
                  <Shield size={14} />
                  <span>Security & Audit Logs</span>
                </button>

                <button
                  onClick={handleThemeToggle}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '6px 8px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentTheme === 'dark' ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="var(--accent-primary, #1e40af)" />}
                    <span>Theme: {currentTheme === 'dark' ? 'Dark' : 'Light'}</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted, #94a3b8)' }}>Toggle</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color, #f1f5f9)', margin: '4px 0' }} />

                <button
                  onClick={handleLogout}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 8px', color: 'var(--status-critical, #dc2626)' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Criminal Modal */}
      {isAddModalOpen && (
        <AddCriminalModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCriminalAdded={(newCrim) => {
            setIsAddModalOpen(false);
            if (onNavigate) {
              onNavigate('entities', { suspect: newCrim.name });
            }
          }}
        />
      )}
    </header>
  );
}
