import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Folder, User, FileText, MapPin, ShieldAlert, ArrowRight, CornerDownLeft } from 'lucide-react';

const SEARCH_DATABASE = [
  // Cases
  {
    id: 'CASE-2024-101',
    title: 'Operation Falcon Hunt: Triple Homicide & Contract Hit',
    type: 'case',
    category: 'Cases',
    subtitle: 'FIR-2024-402 • PS Sector 18 Crime Branch',
    priority: 'CRITICAL',
    page: 'cases',
    extra: { caseId: 'CASE-2024-101' }
  },
  {
    id: 'CASE-2024-102',
    title: 'Special SIT: Serial Sexual Violence & Highway Abduction',
    type: 'case',
    category: 'Cases',
    subtitle: 'FIR-2024-102 • Women Safety PS Sector 14',
    priority: 'CRITICAL',
    page: 'cases',
    extra: { caseId: 'CASE-2024-102' }
  },
  {
    id: 'CASE-2024-103',
    title: 'Operation Gold Vault: Axis Commercial Bank Armed Heist',
    type: 'case',
    category: 'Cases',
    subtitle: 'FIR-2024-103 • PS Sadar Bazar Anti-Robbery',
    priority: 'HIGH',
    page: 'cases',
    extra: { caseId: 'CASE-2024-103' }
  },
  {
    id: 'CASE-2024-104',
    title: 'Operation NarcoGrid: Inter-State Heroin & Arms Smuggling',
    type: 'case',
    category: 'Cases',
    subtitle: 'FIR-2024-104 • NCB Zonal HQ Mumbai Port',
    priority: 'HIGH',
    page: 'cases',
    extra: { caseId: 'CASE-2024-104' }
  },
  {
    id: 'CASE-2024-105',
    title: 'Syndicate Extortion & Gangster Racket (MCOCA Case #88)',
    type: 'case',
    category: 'Cases',
    subtitle: 'FIR-2024-001 • Special Cell STF Lodhi Road',
    priority: 'CRITICAL',
    page: 'cases',
    extra: { caseId: 'CASE-2024-105' }
  },

  // Suspects
  {
    id: 'CRM-9942',
    title: 'MAYANK KOTOLI ("The Trigger / MK-99")',
    type: 'suspect',
    category: 'Suspects',
    subtitle: 'Active Fugitive • 9mm Contract Hitman • ₹5L Reward',
    priority: 'CRITICAL',
    page: 'entities',
    extra: { suspect: 'MAYANK KOTOLI' }
  },
  {
    id: 'CRM-7721',
    title: "DEVENDRA 'D-7' RAWAT",
    type: 'suspect',
    category: 'Suspects',
    subtitle: 'Active Fugitive • Highway Predator • ₹10L Reward',
    priority: 'CRITICAL',
    page: 'entities',
    extra: { suspect: "DEVENDRA RAWAT" }
  },
  {
    id: 'CRM-8821',
    title: "SAMEER 'GHOST' QURESHI",
    type: 'suspect',
    category: 'Suspects',
    subtitle: 'Active Tracking • Bank Heist Vault Specialist • ₹7.5L Reward',
    priority: 'HIGH',
    page: 'entities',
    extra: { suspect: "SAMEER QURESHI" }
  },
  {
    id: 'CRM-0014',
    title: "MAHESH 'TIGER' KHAN",
    type: 'suspect',
    category: 'Suspects',
    subtitle: 'MCOCA Warrant Issued • Gang Syndicate Apex Don',
    priority: 'CRITICAL',
    page: 'entities',
    extra: { suspect: "MAHESH KHAN" }
  },
  {
    id: 'CRM-5512',
    title: "ELENA 'CZAR' ROSTOVA",
    type: 'suspect',
    category: 'Suspects',
    subtitle: 'Interpol Red Notice • Maritime Arms & NDPS Cartel',
    priority: 'CRITICAL',
    page: 'entities',
    extra: { suspect: "ELENA ROSTOVA" }
  },

  // Evidence
  {
    id: 'EVD-9942-01',
    title: '9mm Beretta 92FS Ballistics Casings (#FSL-884)',
    type: 'evidence',
    category: 'Evidence',
    subtitle: '99.4% Match to Sector 18 Homicide Scene Casings',
    priority: 'VERIFIED',
    page: 'cases',
    extra: { caseId: 'CASE-2024-101' }
  },
  {
    id: 'EVD-7721-02',
    title: 'Forensic STR DNA Profile #FK-8821',
    type: 'evidence',
    category: 'Evidence',
    subtitle: '100% Match in National DNA Database to D-7 Rawat',
    priority: 'VERIFIED',
    page: 'cases',
    extra: { caseId: 'CASE-2024-102' }
  },
  {
    id: 'EVD-CDR-018',
    title: 'Sector 18 Syndicate CDR Wiretap Intercept Trunk #402',
    type: 'evidence',
    category: 'Evidence',
    subtitle: 'Telecommunications Metadata • 42 Bursts Pre-Incident',
    priority: 'HIGH',
    page: 'ingestion',
    extra: {}
  },

  // Incidents
  {
    id: 'INC-2024-402',
    title: 'Sector 18 Market Double Homicide Ambush',
    type: 'incident',
    category: 'Incidents',
    subtitle: 'Gurugram Commissionerate • Unregistered KTM Duke 390',
    priority: 'CRITICAL',
    page: 'location',
    extra: {}
  },
  {
    id: 'INC-2024-103',
    title: 'Axis Commercial Bank 14kg Gold Bullion Heist',
    type: 'incident',
    category: 'Incidents',
    subtitle: 'Sadar Bazar • Thermal Lance Vault Breach',
    priority: 'HIGH',
    page: 'location',
    extra: {}
  },

  // Reports
  {
    id: 'REP-BNSS-193',
    title: 'Final Police Report / Chargesheet (BNSS Form 173)',
    type: 'report',
    category: 'Reports',
    subtitle: 'State Police Special Branch • Judicial Ready Dossier',
    priority: 'READY',
    page: 'reports',
    extra: {}
  }
];

export default function GlobalSearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('crimelens:open-global-search'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SEARCH_DATABASE.filter((item) => {
      if (activeTab !== 'ALL' && item.category.toUpperCase() !== activeTab) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
      );
    });
  }, [query, activeTab]);

  const handleSelect = (item) => {
    onClose();
    if (onNavigate) {
      onNavigate(item.page, item.extra);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
      onClick={onClose}
    >
      <div
        className="cl-card"
        style={{
          backgroundColor: 'var(--bg-modal, #ffffff)',
          width: '640px',
          maxWidth: '92vw',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color, #e2e8f0)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            gap: '12px'
          }}
        >
          <Search size={18} color="var(--text-muted, #64748b)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search cases, suspects, evidence, incidents, reports... (e.g. 'Mayank', 'Ballistics', 'CASE-101')"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary, #0f172a)',
              background: 'transparent'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted, #94a3b8)',
                padding: '2px'
              }}
            >
              <X size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              color: 'var(--text-muted, #64748b)',
              backgroundColor: 'var(--bg-subtle, #f1f5f9)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--border-color, #e2e8f0)'
            }}
          >
            ESC to close
          </span>
        </div>

        {/* Category Filters */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            borderBottom: '1px solid var(--border-color, #e2e8f0)'
          }}
        >
          {['ALL', 'CASES', 'SUSPECTS', 'EVIDENCE', 'INCIDENTS', 'REPORTS'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIndex(0);
              }}
              style={{
                fontSize: '11.5px',
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? 'var(--accent-primary, #1e40af)' : 'var(--text-muted, #64748b)',
                backgroundColor: activeTab === tab ? 'var(--accent-subtle, #eff6ff)' : 'transparent',
                border: activeTab === tab ? '1px solid var(--border-strong, #bfdbfe)' : '1px solid transparent',
                borderRadius: '4px',
                padding: '3px 8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '6px'
          }}
        >
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'var(--text-muted, #64748b)',
                fontSize: '13px'
              }}
            >
              No matching records found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--bg-subtle, #f1f5f9)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        backgroundColor:
                          item.type === 'case'
                            ? 'var(--accent-subtle, #eff6ff)'
                            : item.type === 'suspect'
                            ? 'var(--status-critical-bg, #fef2f2)'
                            : item.type === 'evidence'
                            ? 'var(--status-verified-bg, #f0fdf4)'
                            : 'var(--status-warning-bg, #fffbeb)',
                        color:
                          item.type === 'case'
                            ? 'var(--accent-primary, #1e40af)'
                            : item.type === 'suspect'
                            ? 'var(--status-critical, #dc2626)'
                            : item.type === 'evidence'
                            ? 'var(--status-verified, #16a34a)'
                            : 'var(--status-warning, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {item.type === 'case' && <Folder size={15} />}
                      {item.type === 'suspect' && <User size={15} />}
                      {item.type === 'evidence' && <FileText size={15} />}
                      {item.type === 'incident' && <MapPin size={15} />}
                      {item.type === 'report' && <FileText size={15} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-primary, #0f172a)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontFamily: 'monospace',
                            color: 'var(--text-muted, #64748b)'
                          }}
                        >
                          {item.id}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--text-muted, #64748b)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor:
                          item.priority === 'CRITICAL'
                            ? 'var(--status-critical-bg, #fef2f2)'
                            : item.priority === 'HIGH'
                            ? 'var(--status-warning-bg, #fffbeb)'
                            : 'var(--status-verified-bg, #f0fdf4)',
                        color:
                          item.priority === 'CRITICAL'
                            ? 'var(--status-critical, #dc2626)'
                            : item.priority === 'HIGH'
                            ? 'var(--status-warning, #d97706)'
                            : 'var(--status-verified, #16a34a)',
                        border:
                          item.priority === 'CRITICAL'
                            ? '1px solid var(--status-critical-border, #fecaca)'
                            : item.priority === 'HIGH'
                            ? '1px solid var(--status-warning-border, #fde68a)'
                            : '1px solid var(--status-verified-border, #bbf7d0)'
                      }}
                    >
                      {item.priority}
                    </span>
                    {isSelected && <ArrowRight size={14} color="var(--accent-primary, #1e40af)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-subtle, #f8fafc)',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            fontSize: '11.5px',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Use ↑ ↓ keys to navigate</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Press <CornerDownLeft size={12} /> to select
          </span>
        </div>
      </div>
    </div>
  );
}
