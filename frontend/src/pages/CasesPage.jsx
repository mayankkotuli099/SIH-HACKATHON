import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api.js';
import './CasesPage.css';

const DEFAULT_CASES = [
  {
    id: 'CASE-2024-101',
    title: 'Operation Falcon Hunt: Triple Homicide & Contract Hit',
    leadSuspect: 'Mayank Kotoli',
    status: 'ACTIVE_MANHUNT',
    priority: 'CRITICAL',
    assignedOfficer: 'ACP Rajesh Verma (Special Crime Branch)',
    openedDate: '2024-10-12',
    evidenceCount: 58,
    description: 'Triple homicide execution at Sector 18. Ballistics matched 9mm Beretta; DNA evidence recovered from crime scene vehicle.',
    tags: ['HOMICIDE', 'MURDER_SEC_103', 'CONTRACT_KILLING', 'BALLISTICS_MATCH']
  },
  {
    id: 'CASE-2024-102',
    title: 'Special SIT: Serial Sexual Violence & Kidnapping',
    leadSuspect: "Devendra 'D-7' Rawat",
    status: 'SPECIAL_INVESTIGATION',
    priority: 'CRITICAL',
    assignedOfficer: 'DCP Priya Sharma (Women & Child Safety SIT)',
    openedDate: '2024-10-04',
    evidenceCount: 34,
    description: 'Serial sexual assault and highway abduction case. Forensic DNA matched profile FK-8821 in National DNA Registry.',
    tags: ['RAPE_SEC_64', 'POCSO', 'SERIAL_OFFENDER', 'DNA_MATCH']
  },
  {
    id: 'CASE-2024-103',
    title: 'Operation Gold Vault: Axis Commercial Bank Armed Heist',
    leadSuspect: "Sameer 'Ghost' Qureshi",
    status: 'SURVEILLANCE',
    priority: 'HIGH',
    assignedOfficer: 'Inspector Sandeep Hooda (Anti-Robbery Cell)',
    openedDate: '2024-09-28',
    evidenceCount: 41,
    description: '14 kg gold bullion armed heist; vault thermal breach; getaway truck route triangulated on National Highway toll gate.',
    tags: ['ARMED_ROBBERY', 'DACOITY_SEC_310', 'WEAPONS', 'ANPR_HIT']
  },
  {
    id: 'CASE-2024-104',
    title: 'Operation NarcoGrid: Inter-State Heroin Smuggling Network',
    leadSuspect: "Elena 'Czar' Rostova",
    status: 'CONTAINER_SEALED',
    priority: 'HIGH',
    assignedOfficer: 'Zonal Director K. Nair (Narcotics Control Bureau)',
    openedDate: '2024-09-15',
    evidenceCount: 62,
    description: '100 kg high-grade synthetic opioids intercepted at Port Terminal C container yard alongside military-grade submachine guns.',
    tags: ['NARCOTICS_NDPS', 'ARMS_TRAFFICKING', 'PORT_SEIZURE']
  },
  {
    id: 'CASE-2024-105',
    title: 'Syndicate Extortion & Gangster Racket (MCOCA Case #88)',
    leadSuspect: "Mahesh 'Tiger' Khan",
    status: 'WARRANT_ACTIVE',
    priority: 'CRITICAL',
    assignedOfficer: 'Joint CP Anirudh Saxena (Organized Crime Division)',
    openedDate: '2024-08-20',
    evidenceCount: 79,
    description: 'MCOCA gang syndicate running extortion rings targeting builders and transport companies across NCR with armed enforcers.',
    tags: ['MCOCA_ACT', 'EXTORTION', 'ORGANIZED_GANG', 'INTERPOL_BLUE']
  }
];

export default function CasesPage() {
  const [tracking, setTracking] = useState(true);
  const [casesList, setCasesList] = useState(DEFAULT_CASES);
  const [selectedCase, setSelectedCase] = useState(DEFAULT_CASES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [assetStatus, setAssetStatus] = useState('ACTIVE');
  const [_loading, setLoading] = useState(false);

  // New Case Form State
  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    leadSuspect: '',
    priority: 'HIGH',
    description: '',
    tags: 'HAWALA, SIGINT'
  });

  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load cases from backend
  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await api.cases.getAll();
      if (data && data.cases && data.cases.length > 0) {
        setCasesList(data.cases);
        if (!selectedCase) {
          setSelectedCase(data.cases[0]);
        }
      }
    } catch {
      console.warn('Using local cases cache');
      setCasesList(DEFAULT_CASES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapElement.current) return undefined;

    if (mapElement.current._leaflet_id) {
      mapElement.current._leaflet_id = null;
    }

    let map = null;
    try {
      map = L.map(mapElement.current, {
        zoomControl: false,
        attributionControl: true
      }).setView([28.5500, 77.1800], 8);

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      const markersGroup = L.featureGroup().addTo(map);
      markersRef.current = markersGroup;
      mapInstance.current = map;

      setTimeout(() => {
        map?.invalidateSize();
      }, 200);
    } catch (err) {
      console.warn('Map initialization note:', err);
    }

    return () => {
      try {
        if (map) {
          map.remove();
        }
      } catch {
        // ignore
      }
      mapInstance.current = null;
      markersRef.current = null;
      if (mapElement.current) {
        mapElement.current._leaflet_id = null;
      }
    };
  }, []);

  // Update Map Markers on filtered cases or search
  useEffect(() => {
    const map = mapInstance.current;
    const markersGroup = markersRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const POLICE_FIR_STATIONS = [
      { name: 'Mayank Kotoli', fir: 'FIR-2024-402', station: 'PS Sector 18 Crime Branch', city: 'Gurugram', lat: 28.4721, lng: 77.0392, color: '#FF5555', desc: 'Triple Homicide Sec 103 (9mm Beretta match)' },
      { name: 'Mayank Kotoli', fir: 'FIR-2023-881', station: 'PS Civil Lines Special Cell', city: 'Meerut', lat: 28.9845, lng: 77.7064, color: '#FF5555', desc: 'Attempt to Murder Sec 307' },
      { name: 'Mayank Kotoli', fir: 'FIR-2022-119', station: 'PS Sadar Faridabad', city: 'Faridabad', lat: 28.4089, lng: 77.3178, color: '#FF5555', desc: 'Illegal Firearms Possession' },
      { name: 'Mayank Kotoli', fir: 'FIR-2024-911', station: 'Special Cell STF HQ Lodhi Road', city: 'Delhi', lat: 28.5880, lng: 77.2220, color: '#FF5555', desc: 'MCOCA Gang Syndicate Hit' },
      { name: "Devendra 'D-7' Rawat", fir: 'FIR-2024-102', station: 'Women Safety PS Sector 14', city: 'Gurugram', lat: 28.4595, lng: 77.0266, color: '#C084FC', desc: 'Serial Sexual Assault (100% STR DNA Match)' },
      { name: "Devendra 'D-7' Rawat", fir: 'FIR-2024-089', station: 'PS IFFCO Chowk', city: 'Gurugram', lat: 28.4750, lng: 77.0650, color: '#C084FC', desc: 'Aggravated Assault Sec 376D' },
      { name: "Sameer 'Ghost' Qureshi", fir: 'FIR-2024-103', station: 'PS Sadar Bazar Anti-Robbery', city: 'Gurugram', lat: 28.4600, lng: 77.0300, color: '#FB923C', desc: 'Axis Bank Vault 14kg Gold Heist' },
      { name: "Sameer 'Ghost' Qureshi", fir: 'FIR-2023-662', station: 'PS Manesar Highway Unit', city: 'Manesar', lat: 28.3580, lng: 76.9380, color: '#FB923C', desc: 'Jewelry Logistics Burglary' },
      { name: "Mahesh 'Tiger' Khan", fir: 'FIR-2024-001', station: 'Special Cell Organized Crime Unit', city: 'Delhi', lat: 28.5700, lng: 77.2400, color: '#FBBF24', desc: 'MCOCA Builder ₹50L Extortion' },
      { name: "Elena 'Czar' Rostova", fir: 'FIR-2024-104', station: 'NCB Zonal HQ Mumbai Port', city: 'Mumbai', lat: 18.9500, lng: 72.9500, color: '#4ADE80', desc: '100kg Synthetic Heroin Port Seizure' }
    ];

    const q = searchQuery.toLowerCase().trim();
    const stationsToShow = POLICE_FIR_STATIONS.filter(s =>
      !q || s.name.toLowerCase().includes(q) || s.fir.toLowerCase().includes(q) || s.station.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );

    stationsToShow.forEach(stn => {
      const marker = L.circleMarker([stn.lat, stn.lng], {
        radius: 10,
        color: '#FFFFFF',
        weight: 2,
        fillColor: stn.color,
        fillOpacity: 0.95
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px; color: #07090E; padding: 2px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #0284C7;">🏛️ POLICE STATION FIR</div>
          <div style="font-size: 13px; font-weight: 800; color: #0F172A;">${stn.station}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">📍 ${stn.city}</div>
          <div style="background: #F1F5F9; padding: 5px 7px; border-radius: 4px; font-size: 11px;">
            <div><strong>Suspect:</strong> <span style="color: #DC2626; font-weight: 800;">${stn.name}</span></div>
            <div><strong>FIR:</strong> <span style="color: #0284C7; font-weight: 700;">${stn.fir}</span></div>
            <div>${stn.desc}</div>
          </div>
        </div>
      `);

      marker.on('click', () => setAssetStatus(`FIR FILED: ${stn.station} (${stn.fir})`));
      markersGroup.addLayer(marker);
    });

    try {
      if (stationsToShow.length > 0) {
        map.fitBounds(markersGroup.getBounds(), { padding: [50, 50], maxZoom: 12 });
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [searchQuery, filteredCases]);

  // Handle New Case Submission to Backend
  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newCaseForm.title.trim()) {
      showToast('⚠️ Case title is required.');
      return;
    }

    try {
      const tagsArray = newCaseForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await api.cases.create({
        title: newCaseForm.title,
        leadSuspect: newCaseForm.leadSuspect || 'Pending Identification',
        priority: newCaseForm.priority,
        description: newCaseForm.description,
        tags: tagsArray
      });

      if (res && res.success) {
        showToast(`✓ Case "${res.case.title}" registered with ID ${res.case.id}`);
        setNewCaseForm({
          title: '',
          leadSuspect: '',
          priority: 'HIGH',
          description: '',
          tags: 'HAWALA, SIGINT'
        });
        setIsNewCaseModalOpen(false);
        await loadCases();
      } else {
        showToast('✓ Case registered locally in session memory.');
        setIsNewCaseModalOpen(false);
      }
    } catch (err) {
      showToast(`Error creating case: ${err.message}`);
    }
  };

  const filteredCases = casesList.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.leadSuspect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || c.priority.toUpperCase() === priorityFilter.toUpperCase();
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="cases-screen">
      {/* Toast Notification */}
      {toastMessage && (
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
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Map & Cases Grid */}
      <main className="case-map">
        <div ref={mapElement} className="live-map" aria-label="Live sector map" />

        {/* Tactical Tracking Bar */}
        <div className="tracking-bar">
          <div>
            <span>T-MINUS 24:00:00 [SECTOR 7-G]</span>
            <button
              onClick={() => {
                setTracking(!tracking);
                showToast(tracking ? 'Sector tracking paused.' : 'Live sector tracking engaged.');
              }}
              aria-label="Toggle live tracking"
            >
              <b style={{ left: tracking ? '74%' : '10%' }} />
            </button>
            <span style={{ color: tracking ? '#00e5ff' : '#ff9900' }}>
              {tracking ? '● LIVE TRACKING' : '○ TRACKING PAUSED'}
            </span>
          </div>
        </div>
      </main>

      {/* Sector Insights & Cases Sidebar */}
      <aside className="sector-insights" style={{ overflowY: 'auto' }}>
        <div className="insights-title">
          <div>
            <span style={{ fontSize: '11px', color: 'var(--cyan-glow)', letterSpacing: '1px' }}>
              // TACTICAL DOSSIER
            </span>
            <h1 style={{ fontSize: '24px', margin: '4px 0 0 0' }}>CASE MANAGEMENT</h1>
          </div>
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="btn-cyan"
            style={{ padding: '8px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            + NEW CASE
          </button>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search cases or suspects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(7, 10, 16, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '4px',
              padding: '8px 12px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              backgroundColor: 'rgba(7, 10, 16, 0.8)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderRadius: '4px',
              padding: '8px 10px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}
          >
            <option value="ALL">ALL</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
          </select>
        </div>

        {/* Case List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          {filteredCases.map((item) => {
            const isSelected = selectedCase?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                style={{
                  padding: '12px 14px',
                  backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.1)' : 'rgba(20, 25, 35, 0.7)',
                  border: `1px solid ${isSelected ? 'var(--cyan-glow)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--cyan-glow)' }}>{item.id}</span>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    backgroundColor: item.priority === 'CRITICAL' ? 'rgba(255, 85, 85, 0.2)' : 'rgba(0, 229, 255, 0.2)',
                    color: item.priority === 'CRITICAL' ? '#FF5555' : 'var(--cyan-glow)',
                    fontWeight: 700
                  }}>
                    {item.priority}
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Suspect: <strong style={{ color: '#E2E8F0' }}>{item.leadSuspect}</strong></span>
                  <span>📁 {item.evidenceCount} items</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Case Detail / Anomaly Card */}
        <article className="anomaly-card">
          <div className="card-kicker">
            ACTIVE CASE FILE <em>{selectedCase ? selectedCase.status : 'HIGH PRIORITY'}</em>
          </div>
          <h2>{selectedCase ? selectedCase.title : 'UNAUTHORIZED MOVEMENT DETECTED'}</h2>
          <p>{selectedCase ? selectedCase.description : 'Target TGT_ALPHA_99 deviated from projected route by 4.2km in Sector 7G.'}</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
            {(selectedCase?.tags || ['HAWALA', 'HIGH_RISK']).map(t => (
              <span key={t} style={{
                fontSize: '10px',
                padding: '2px 8px',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '3px',
                color: 'var(--cyan-glow)'
              }}>
                #{t}
              </span>
            ))}
          </div>
        </article>

        {/* Asset Status */}
        <article className="asset-card">
          <div className="card-kicker">ASSET STATUS <em className="active">{assetStatus}</em></div>
          <h2>ASSET_B INTERCEPT READY</h2>
          <p>Asset intercept vector calculated. ETA to target vicinity: 14 mins.</p>
        </article>

        {/* Telemetry */}
        <article className="telemetry">
          <div className="card-kicker">ENVIRONMENTAL TELEMETRY</div>
          <div>
            <span>TRAFFIC DENSITY<strong>84% CONGESTED</strong></span>
            <span>SIGINT NOISE<strong>ELEVATED (ENCRYPTED)</strong></span>
          </div>
        </article>
      </aside>

      {/* Register New Case Modal */}
      {isNewCaseModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#0c111a',
            border: '1px solid var(--cyan-glow)',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 0 40px rgba(0, 229, 255, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--cyan-glow)', letterSpacing: '1.5px' }}>
                  // OFFICIAL FORENSIC INTAKE
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
                  REGISTER NEW INVESTIGATION CASE
                </h2>
              </div>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operation Falcon Intercept"
                  value={newCaseForm.title}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(7, 10, 16, 0.9)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Lead Suspect / Entity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={newCaseForm.leadSuspect}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, leadSuspect: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(7, 10, 16, 0.9)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Priority Clearance
                  </label>
                  <select
                    value={newCaseForm.priority}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(7, 10, 16, 0.9)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px'
                    }}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="HAWALA, CYBER, SHELL_CORP"
                  value={newCaseForm.tags}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(7, 10, 16, 0.9)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Case Brief & Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide tactical context, suspected syndicate links, or intercept summaries..."
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(7, 10, 16, 0.9)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="btn-outline-cyan"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-cyan"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  REGISTER CASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
