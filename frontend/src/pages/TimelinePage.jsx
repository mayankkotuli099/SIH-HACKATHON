import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { api } from '../services/api.js';

export default function TimelinePage({ onNavigate }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const DEFAULT_EVENTS = [
    {
      id: 'TL-2024-001',
      timestamp: '2024-10-27 18:45:00 IST',
      title: 'Homicide Forensics: 9mm Striation Match (Sector 18)',
      category: 'HOMICIDE',
      severity: 'CRITICAL',
      entity: "Mayank Kotoli (CRM-9942)",
      firNumber: 'FIR-2024-402 (BNS Sec 103 / IPC 302)',
      policeStation: 'Special Crime Branch / PS Sector 18',
      description: 'CFSL Ballistics unit confirmed 9mm spent cartridge at Sector 18 crime scene matches the rifling marks of seized Beretta 92FS.',
      confidence: '99.4%',
      coordinates: '28.4721° N, 77.0392° E (Sector 18 Market)',
      evidenceTag: 'BALLISTICS-CFSL-9942',
      ioOfficer: 'Inspector V. Rathore (STF Unit 4)',
      categoryColor: '#FF5555',
      icon: '🔴'
    },
    {
      id: 'TL-2024-002',
      timestamp: '2024-10-27 16:15:30 IST',
      title: 'DNA Registry Match: Serial Sexual Assault SIT',
      category: 'SEXUAL_OFFENSE',
      severity: 'CRITICAL',
      entity: "Devendra 'D-7' Rawat (CRM-7721)",
      firNumber: 'FIR-2024-102 (BNS Sec 64 / IPC 376D, POCSO)',
      policeStation: 'Special SIT / Women Safety PS Sector 14',
      description: '100% STR DNA Profile match from Forensic Evidence Kit #FK-8821 against National DNA Database record of repeat offender.',
      confidence: '100.0%',
      coordinates: '28.4595° N, 77.0266° E (Sector 14 Transit Hub)',
      evidenceTag: 'DNA-FK-8821-STR',
      ioOfficer: 'ACP Sunita Deshmukh (Women Safety SIT)',
      categoryColor: '#C084FC',
      icon: '🟣'
    },
    {
      id: 'TL-2024-003',
      timestamp: '2024-10-27 13:50:12 IST',
      title: 'ANPR Hit: Axis Bank Vault Heist Getaway Truck',
      category: 'ROBBERY',
      severity: 'HIGH',
      entity: "Sameer 'Ghost' Qureshi (CRM-8821)",
      firNumber: 'FIR-2024-103 (BNS Sec 310 / IPC 392)',
      policeStation: 'Anti-Robbery Cell / PS Sadar',
      description: 'High-speed ANPR camera captured getaway Eicher truck (HR-26-BR-9921) transporting 14kg looted gold bullion at KMP Highway Toll Plaza.',
      confidence: '98.2%',
      coordinates: '28.3241° N, 76.9102° E (KMP Expressway Toll)',
      evidenceTag: 'ANPR-CAM-KMP-9921',
      ioOfficer: 'DSP Alok Verma (Highway Crime Cell)',
      categoryColor: '#FB923C',
      icon: '🟠'
    },
    {
      id: 'TL-2024-004',
      timestamp: '2024-10-27 11:20:45 IST',
      title: 'Wiretap Intercept: MCOCA Gang Extortion Call',
      category: 'EXTORTION',
      severity: 'CRITICAL',
      entity: "Mahesh 'Tiger' Khan (CRM-0014)",
      firNumber: 'FIR-2024-001 (MCOCA Act & Extortion)',
      policeStation: 'Organized Crime Branch / Special Cell',
      description: 'Judicial authorized wiretap intercepted voice recording demanding ₹50 Lakhs protection ransom from South City builder with death threat.',
      confidence: '99.1%',
      coordinates: 'Encrypted VoIP Trunk // Tower Meerut North',
      evidenceTag: 'WIRETAP-MCOCA-MK01',
      ioOfficer: 'Special Cell STF Squad',
      categoryColor: '#FBBF24',
      icon: '🟡'
    },
    {
      id: 'TL-2024-005',
      timestamp: '2024-10-27 08:30:00 IST',
      title: 'NCB Port Seizure: 100kg Synthetic Heroin & Steyr SMGs',
      category: 'NARCOTICS',
      severity: 'CRITICAL',
      entity: "Elena 'Czar' Rostova (CRM-5512)",
      firNumber: 'FIR-2024-104 (NDPS Act Commercial Quantity)',
      policeStation: 'Narcotics Control Bureau (NCB) Zonal Unit',
      description: 'Joint NCB and Marine Police raid on maritime shipping container yielded 100kg synthetic heroin and 4 Austrian Steyr submachine guns.',
      confidence: '99.8%',
      coordinates: 'Port Terminal C Container Berth 4',
      evidenceTag: 'SEIZURE-NDPS-100KG',
      ioOfficer: 'Zonal Director R. K. Shirole (NCB)',
      categoryColor: '#4ADE80',
      icon: '🟢'
    },
    {
      id: 'TL-2024-006',
      timestamp: '2024-10-26 22:10:15 IST',
      title: 'Non-Bailable Warrant (NBW) Judicial Execution Issued',
      category: 'POLICE_ACTION',
      severity: 'HIGH',
      entity: 'All State Police Forces / Border Checkposts',
      firNumber: 'Sessions Court Warrant Order #NBW-2024-918',
      policeStation: 'District & Sessions Court / Crime Branch',
      description: 'Sessions Court issued Non-Bailable Arrest Warrants for immediate inter-state apprehension and freezing of Hawala bank assets.',
      confidence: '100.0%',
      coordinates: 'All Police Jurisdictions & Airport Lookouts',
      evidenceTag: 'COURT-NBW-ORDER-918',
      ioOfficer: 'Chief Judicial Magistrate Registry',
      categoryColor: '#00E5FF',
      icon: '🚔'
    }
  ];

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await api.timeline.getEvents();
        if (data && data.events && data.events.length > 0) {
          // Augment with category icons and colors
          const augmented = data.events.map((evt) => {
            let catColor = '#00E5FF';
            let icon = '🚔';
            if (evt.category === 'HOMICIDE') { catColor = '#FF5555'; icon = '🔴'; }
            else if (evt.category === 'SEXUAL_OFFENSE') { catColor = '#C084FC'; icon = '🟣'; }
            else if (evt.category === 'ROBBERY') { catColor = '#FB923C'; icon = '🟠'; }
            else if (evt.category === 'EXTORTION') { catColor = '#FBBF24'; icon = '🟡'; }
            else if (evt.category === 'NARCOTICS') { catColor = '#4ADE80'; icon = '🟢'; }
            return { ...evt, categoryColor: catColor, icon };
          });
          setEventsList(augmented);
        } else {
          setEventsList(DEFAULT_EVENTS);
        }
      } catch (err) {
        console.warn('Using local Indian Police timeline seed:', err);
        setEventsList(DEFAULT_EVENTS);
      }
    }
    loadTimeline();
  }, []);

  const filteredEvents = eventsList.filter((evt) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.entity.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      (evt.firNumber && evt.firNumber.toLowerCase().includes(q)) ||
      (evt.policeStation && evt.policeStation.toLowerCase().includes(q)) ||
      (evt.evidenceTag && evt.evidenceTag.toLowerCase().includes(q)) ||
      (evt.ioOfficer && evt.ioOfficer.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    return evt.category.toUpperCase() === filterType.toUpperCase();
  });

  return (
    <div style={{
      flex: 1,
      minHeight: 'calc(100vh - 68px)',
      backgroundColor: 'var(--bg-dark, #07090E)',
      color: 'var(--text-primary, #FFFFFF)',
      fontFamily: 'var(--font-sans, sans-serif)',
      padding: '2rem 2.5rem 3rem 2.5rem',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#00E5FF',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          zIndex: 10000
        }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Status Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '1.75rem',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            color: 'var(--cyan-glow, #00E5FF)',
            letterSpacing: '1.5px',
            marginBottom: '4px'
          }}>
            <span>🇮🇳</span>
            <span>INDIAN POLICE CRIME BRANCH // FORENSIC TIMELINE TRAIL</span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            letterSpacing: '0.5px'
          }}>
            CRIME INVESTIGATION ACTIVITY TRAIL & EVIDENCE LOG
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #94A3B8)' }}>
            Real-Time Forensic Intercepts, CCTV Sightings, Ballistics Striations & Judicial Case Chronology
          </p>
        </div>

        {/* Quick Police Stats Badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'rgba(255, 85, 85, 0.1)',
            border: '1px solid rgba(255, 85, 85, 0.3)',
            borderRadius: '6px',
            padding: '8px 14px',
            fontFamily: 'var(--font-mono, monospace)'
          }}>
            <div style={{ fontSize: '10px', color: '#FF8888' }}>ACTIVE LOGS</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF5555' }}>6 EVENTS</div>
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '6px',
            padding: '8px 14px',
            fontFamily: 'var(--font-mono, monospace)'
          }}>
            <div style={{ fontSize: '10px', color: '#00E5FF' }}>COURT EXHIBITS</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#00E5FF' }}>CFSL / BSA 65B</div>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filter Bar */}
      <div style={{
        backgroundColor: 'rgba(12, 17, 26, 0.85)',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="Search by FIR #, Suspect Name, Investigating Officer, Exhibit Barcode, Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'rgba(7, 10, 16, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '4px',
              padding: '9px 36px 9px 12px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery ? (
            <span
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '9px', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕
            </span>
          ) : (
            <span style={{ position: 'absolute', right: '12px', top: '9px', color: '#00E5FF', fontSize: '14px' }}>
              🔍
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `ALL INCIDENTS (${eventsList.length})` },
            { id: 'HOMICIDE', label: '🔴 HOMICIDE & BALLISTICS' },
            { id: 'SEXUAL_OFFENSE', label: '🟣 SEXUAL ASSAULT SIT' },
            { id: 'ROBBERY', label: '🟠 ARMED ROBBERY & HEISTS' },
            { id: 'EXTORTION', label: '🟡 EXTORTION WIRETAPS' },
            { id: 'NARCOTICS', label: '🟢 NARCOTICS / NDPS' },
            { id: 'POLICE_ACTION', label: '🚔 POLICE WARRANTS & RAIDS' }
          ].map((cat) => {
            const isSelected = filterType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.2)' : 'rgba(7, 10, 16, 0.8)',
                  color: isSelected ? '#00E5FF' : '#94A3B8',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chronological Timeline Stream */}
      <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
        {/* Glowing Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '10px',
          bottom: '10px',
          width: '2px',
          backgroundColor: 'rgba(0, 229, 255, 0.25)',
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)'
        }} />

        {filteredEvents.length === 0 ? (
          <div style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(12, 17, 26, 0.6)',
            borderRadius: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ color: '#94A3B8', margin: 0 }}>No timeline logs matching your filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(12, 17, 26, 0.9)',
                  border: `1px solid ${evt.categoryColor}44`,
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.4)`,
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = evt.categoryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = `${evt.categoryColor}44`;
                }}
              >
                {/* Timeline Dot on the line */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '1.25rem',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: evt.categoryColor,
                  border: '3px solid #07090E',
                  boxShadow: `0 0 12px ${evt.categoryColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateX(-5px)'
                }} />

                {/* Card Top Row: Timestamp, Category & Exhibit Barcode */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '0.75rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.65rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{evt.icon}</span>
                    <span style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 800,
                      color: evt.categoryColor,
                      backgroundColor: `${evt.categoryColor}18`,
                      border: `1px solid ${evt.categoryColor}55`,
                      padding: '2px 8px',
                      borderRadius: '3px'
                    }}>
                      {evt.category}
                    </span>
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono, monospace)', color: '#CBD5E1' }}>
                      ⏱ {evt.timestamp}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'var(--cyan-glow, #00E5FF)',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}>
                    EXHIBIT: {evt.evidenceTag || 'CERTIFIED'}
                  </div>
                </div>

                {/* Event Title & Description */}
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                  {evt.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                  {evt.description}
                </p>

                {/* Key Intelligence Fields Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.65rem',
                  backgroundColor: 'rgba(7, 10, 16, 0.8)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '1rem',
                  fontSize: '11.5px'
                }}>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Primary Suspect:</span>{' '}
                    <strong style={{ color: '#FFFFFF' }}>{evt.entity}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>FIR Record:</span>{' '}
                    <strong style={{ color: '#FF8888' }}>{evt.firNumber || 'Active Case File'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Police Station / IO:</span>{' '}
                    <strong style={{ color: '#00E5FF' }}>{evt.ioOfficer || evt.policeStation}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>Location Coordinates:</span>{' '}
                    <strong style={{ color: '#FBBF24', fontFamily: 'var(--font-mono, monospace)' }}>{evt.coordinates}</strong>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
                    FORENSIC CONFIDENCE: <strong style={{ color: '#00E676' }}>{evt.confidence}</strong> (BSA Sec 65B Certified)
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(0, 229, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        color: '#00E5FF',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono, monospace)'
                      }}
                    >
                      🔍 INSPECT EXHIBIT
                    </button>

                    <button
                      onClick={() => showToast(`✓ Exhibit ${evt.evidenceTag} attached to Police Chargesheet.`)}
                      style={{
                        backgroundColor: 'rgba(0, 229, 255, 0.15)',
                        border: '1px solid #00E5FF',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        color: '#00E5FF',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono, monospace)'
                      }}
                    >
                      ⚖ ADD TO CHARGESHEET
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forensic Exhibit Detail Inspection Modal */}
      {selectedEvent && (
        <EvidenceDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAction={(act) => {
            showToast(act);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}

// Forensic Evidence Modal with Full Viewport Center Portal
function EvidenceDetailModal({ event, onClose, onAction }) {
  const modal = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        backgroundColor: '#0c111a',
        border: '1.5px solid #00E5FF',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 0 60px rgba(0, 229, 255, 0.35)',
        padding: '2rem',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: 'var(--font-sans, sans-serif)',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{event.icon}</span>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                FORENSIC EVIDENCE EXHIBIT: {event.evidenceTag}
              </h2>
              <div style={{ fontSize: '11px', color: '#00E5FF', fontFamily: 'var(--font-mono, monospace)' }}>
                JUDICIAL ADMISSIBILITY CERTIFICATE // BHARATIYA SAKSHYA ADHINIYAM
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px 10px',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '13px' }}>
          <div>
            <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '2px' }}>INCIDENT TITLE:</strong>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{event.title}</span>
          </div>

          <div>
            <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '2px' }}>FORENSIC SUMMARY & RECONSTRUCTION:</strong>
            <p style={{ margin: 0, color: '#CBD5E1', lineHeight: 1.5 }}>{event.description}</p>
          </div>

          <div style={{
            backgroundColor: 'rgba(7, 10, 16, 0.95)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '6px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            fontSize: '12px'
          }}>
            <div><span style={{ color: '#94A3B8' }}>Offender Target:</span> <strong style={{ color: '#FFFFFF' }}>{event.entity}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>FIR Record:</span> <strong style={{ color: '#FF8888' }}>{event.firNumber}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Police Unit:</span> <strong style={{ color: '#00E5FF' }}>{event.policeStation}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Lead Officer:</span> <strong style={{ color: '#FFFFFF' }}>{event.ioOfficer}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>GPS Location:</span> <strong style={{ color: '#FBBF24' }}>{event.coordinates}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Confidence Match:</span> <strong style={{ color: '#00E676' }}>{event.confidence}</strong></div>
          </div>

          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '11.5px',
            color: '#94A3B8',
            lineHeight: 1.4
          }}>
            🔒 <strong>Chain of Custody Verified</strong>: Forensic physical seal intact. Digitally counter-signed by CFSL Senior Scientific Officer. Admissible under Section 65B of Evidence Act in all High Courts & Sessions Courts.
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#94a3b8',
              borderRadius: '4px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
          <button
            onClick={() => onAction(`✓ Dispatch Order issued to ${event.policeStation} for immediate raid.`)}
            style={{
              backgroundColor: '#FF5555',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '4px',
              padding: '8px 16px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)'
            }}
          >
            🚨 DISPATCH STF RAID
          </button>
          <button
            onClick={() => onAction(`✓ Certified PDF Chargesheet Exported for ${event.evidenceTag}.`)}
            style={{
              backgroundColor: '#00E5FF',
              border: 'none',
              color: '#07090E',
              borderRadius: '4px',
              padding: '8px 18px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)'
            }}
          >
            📄 EXPORT COURT REPORT
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(modal, document.body)
    : modal;
}
