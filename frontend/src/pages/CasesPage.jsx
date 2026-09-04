import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Folder,
  Search,
  Plus,
  FileText,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Calendar,
  X
} from 'lucide-react';
import { api } from '../services/api.js';
import './CasesPage.css';

const DEFAULT_CASES = [
  {
    id: 'CASE-2024-101',
    title: 'Operation Falcon Hunt: Triple Homicide & Contract Hit',
    leadSuspect: 'Mayank Kotoli',
    status: 'ACTIVE MANHUNT',
    priority: 'CRITICAL',
    assignedOfficer: 'ACP Rajesh Verma (Special Crime Branch)',
    openedDate: '2024-10-12',
    lastUpdated: '2024-10-27 18:45',
    evidenceCount: 58,
    policeStation: 'PS Sector 18 Crime Branch',
    firNumber: 'FIR-2024-402',
    description: 'Triple homicide execution at Sector 18. Ballistics matched 9mm Beretta; DNA evidence recovered from crime scene vehicle. Fugitive tracked on Meerut Expressway.',
    tags: ['HOMICIDE', 'BNS_103', 'CONTRACT_KILLING', 'BALLISTICS_MATCH'],
    evidenceList: [
      { id: 'EVD-9942-01', type: 'Ballistics', name: '4x 9mm Spent Cartridge Casings', source: 'Crime Scene Sector 18', status: 'VERIFIED FSL MATCH', hash: 'SHA256: 8f4a...291b' },
      { id: 'EVD-9942-02', type: 'Biological', name: 'Blood Spatter STR DNA Profile', source: 'Getaway Vehicle Interior', status: '99.4% MATCH', hash: 'SHA256: d28c...901e' },
      { id: 'EVD-9942-03', type: 'SIGINT', name: 'Burner Mobile Intercept Record', source: 'Airtel Tower Trunk #402', status: 'ACTIVE PING', hash: 'SHA256: a14f...552d' },
      { id: 'EVD-9942-04', type: 'Surveillance', name: 'KTM Duke 390 ANPR Toll Snapshot', source: 'Kherki Daula Toll Plaza', status: 'CCTV CATALOGUED', hash: 'SHA256: c91e...384a' }
    ],
    suspectsList: [
      { id: 'CRM-9942', name: 'MAYANK KOTOLI', role: 'Primary Shooter / Contract Hitman', risk: '99.4%', status: 'ACTIVE FUGITIVE' },
      { id: 'CRM-0014', name: "MAHESH 'TIGER' KHAN", role: 'Syndicate Don / Contract Client', risk: '98.5%', status: 'MCOCA FLAG' },
      { id: 'CRM-4494', name: "SURESH 'CHHOTA' GOLI", role: 'Black Market Armorer', risk: '94.0%', status: 'RAID PENDING' }
    ]
  },
  {
    id: 'CASE-2024-102',
    title: 'Special SIT: Serial Sexual Violence & Kidnapping',
    leadSuspect: "Devendra 'D-7' Rawat",
    status: 'SPECIAL INVESTIGATION',
    priority: 'CRITICAL',
    assignedOfficer: 'DCP Priya Sharma (Women & Child Safety SIT)',
    openedDate: '2024-10-04',
    lastUpdated: '2024-10-25 12:10',
    evidenceCount: 34,
    policeStation: 'Women Safety PS Sector 14',
    firNumber: 'FIR-2024-102',
    description: 'Serial sexual assault and highway abduction case. Forensic DNA matched profile FK-8821 in National DNA Registry. Suspect operated using counterfeit commercial taxi.',
    tags: ['RAPE_BNS_64', 'POCSO', 'SERIAL_OFFENDER', 'DNA_MATCH'],
    evidenceList: [
      { id: 'EVD-7721-01', type: 'Biological', name: 'Forensic Medical Kit Swab #FK-8821', source: 'Civil Hospital Forensics', status: '100% STR MATCH', hash: 'SHA256: bb44...819a' },
      { id: 'EVD-7721-02', type: 'Physical', name: 'Forged Taxi License Plate HR26-B-9912', source: 'Seized Vehicle', status: 'FORENSIC LOGGED', hash: 'SHA256: 77ae...204c' },
      { id: 'EVD-7721-03', type: 'SIGINT', name: 'Tower Ping Cluster Sector 14 Transit', source: 'Jio Tower Node', status: 'TRIANGULATED', hash: 'SHA256: 31bf...892d' }
    ],
    suspectsList: [
      { id: 'CRM-7721', name: "DEVENDRA 'D-7' RAWAT", role: 'Primary Serial Accused', risk: '99.8%', status: 'ACTIVE FUGITIVE' },
      { id: 'CRM-3310', name: "RAJU 'MECHANIC' VERMA", role: 'Counterfeit Plate Supplier', risk: '86.0%', status: 'UNDER SURVEILLANCE' }
    ]
  },
  {
    id: 'CASE-2024-103',
    title: 'Operation Gold Vault: Commercial Bank Armed Heist',
    leadSuspect: "Sameer 'Ghost' Qureshi",
    status: 'SURVEILLANCE',
    priority: 'HIGH',
    assignedOfficer: 'Inspector Sandeep Hooda (Anti-Robbery Cell)',
    openedDate: '2024-09-28',
    lastUpdated: '2024-10-24 09:30',
    evidenceCount: 41,
    policeStation: 'PS Sadar Bazar Anti-Robbery',
    firNumber: 'FIR-2024-103',
    description: '14 kg gold bullion armed heist; vault thermal breach; getaway truck route triangulated on National Highway toll gate.',
    tags: ['ARMED_ROBBERY', 'DACOITY_SEC_310', 'WEAPONS', 'ANPR_HIT'],
    evidenceList: [
      { id: 'EVD-8821-01', type: 'Physical', name: 'Thermal Lance Burn Residue', source: 'Vault Door Margin', status: 'METALLURGY REPORT', hash: 'SHA256: fe11...552a' },
      { id: 'EVD-8821-02', type: 'Forensic', name: 'Glove Fiber Match', source: 'Lobby Entry Handle', status: '92.4% MATCH', hash: 'SHA256: 89ab...710f' },
      { id: 'EVD-8821-03', type: 'Financial', name: 'Chandni Chowk Bullion Transit Receipts', source: 'Undercover Informant', status: 'ACCOUNTS FROZEN', hash: 'SHA256: 12de...993c' }
    ],
    suspectsList: [
      { id: 'CRM-8821', name: "SAMEER 'GHOST' QURESHI", role: 'Safe-Cracker Specialist', risk: '92.4%', status: 'TRACKING' }
    ]
  },
  {
    id: 'CASE-2024-104',
    title: 'Operation NarcoGrid: Inter-State Heroin Smuggling Network',
    leadSuspect: "Elena 'Czar' Rostova",
    status: 'CONTAINER SEALED',
    priority: 'HIGH',
    assignedOfficer: 'Zonal Director K. Nair (Narcotics Control Bureau)',
    openedDate: '2024-09-15',
    lastUpdated: '2024-10-20 16:00',
    evidenceCount: 62,
    policeStation: 'NCB Zonal HQ Mumbai Port',
    firNumber: 'FIR-2024-104',
    description: '100 kg high-grade synthetic opioids intercepted at Port Terminal C container yard alongside military-grade submachine guns.',
    tags: ['NARCOTICS_NDPS', 'ARMS_TRAFFICKING', 'PORT_SEIZURE'],
    evidenceList: [
      { id: 'EVD-5512-01', type: 'Narcotics', name: '100 kg Synthetic Heroin (Purity 94%)', source: 'Container #CT-991', status: 'LAB VERIFIED', hash: 'SHA256: aa12...490b' },
      { id: 'EVD-5512-02', type: 'Weapons', name: '8x Steyr TMP 9mm Submachine Guns', source: 'False Floor Cargo', status: 'BALLISTICS SEALED', hash: 'SHA256: ee43...112d' }
    ],
    suspectsList: [
      { id: 'CRM-5512', name: "ELENA 'CZAR' ROSTOVA", role: 'Cartel Director', risk: '96.0%', status: 'INTERPOL WATCH' }
    ]
  },
  {
    id: 'CASE-2024-105',
    title: 'Syndicate Extortion & Gangster Racket (MCOCA Case #88)',
    leadSuspect: "Mahesh 'Tiger' Khan",
    status: 'WARRANT ACTIVE',
    priority: 'CRITICAL',
    assignedOfficer: 'Joint CP Anirudh Saxena (Organized Crime Division)',
    openedDate: '2024-08-20',
    lastUpdated: '2024-10-26 11:20',
    evidenceCount: 79,
    policeStation: 'Special Cell STF Lodhi Road',
    firNumber: 'FIR-2024-001',
    description: 'MCOCA gang syndicate running extortion rings targeting builders and transport companies across NCR with armed enforcers.',
    tags: ['MCOCA_ACT', 'EXTORTION', 'ORGANIZED_GANG', 'INTERPOL_BLUE'],
    evidenceList: [
      { id: 'EVD-0014-01', type: 'Audio', name: 'VoIP Extortion Call Recording (₹50 Lakhs)', source: 'Complainant Handset', status: 'VOICEPRINT MATCH 99.1%', hash: 'SHA256: 44ff...901e' },
      { id: 'EVD-0014-02', type: 'Financial', name: 'Benami Hawala Drop Slips (₹35 Lakhs)', source: 'Old Delhi Conduit', status: 'FROZEN', hash: 'SHA256: 22dd...881a' }
    ],
    suspectsList: [
      { id: 'CRM-0014', name: "MAHESH 'TIGER' KHAN", role: 'Gang Syndicate Apex Commander', risk: '98.5%', status: 'MCOCA WARRANT' },
      { id: 'CRM-9942', name: 'MAYANK KOTOLI', role: 'Enforcer', risk: '99.4%', status: 'ACTIVE FUGITIVE' }
    ]
  }
];

const CASE_MAP_LOCATIONS = [
  { name: 'Mayank Kotoli', fir: 'FIR-2024-402', station: 'PS Sector 18 Crime Branch', city: 'Gurugram', lat: 28.4721, lng: 77.0392, desc: 'Triple Homicide Sec 103 (9mm Beretta match)' },
  { name: 'Mayank Kotoli', fir: 'FIR-2023-881', station: 'PS Civil Lines Special Cell', city: 'Meerut', lat: 28.9845, lng: 77.7064, desc: 'Attempt to Murder Sec 307' },
  { name: 'Mayank Kotoli', fir: 'FIR-2022-119', station: 'PS Sadar Faridabad', city: 'Faridabad', lat: 28.4089, lng: 77.3178, desc: 'Illegal Firearms Possession' },
  { name: "Devendra 'D-7' Rawat", fir: 'FIR-2024-102', station: 'Women Safety PS Sector 14', city: 'Gurugram', lat: 28.4595, lng: 77.0266, desc: 'Serial Sexual Assault (100% STR DNA Match)' },
  { name: "Sameer 'Ghost' Qureshi", fir: 'FIR-2024-103', station: 'PS Sadar Bazar Anti-Robbery', city: 'Gurugram', lat: 28.4600, lng: 77.0300, desc: 'Axis Bank Vault 14kg Gold Heist' },
  { name: "Mahesh 'Tiger' Khan", fir: 'FIR-2024-001', station: 'Special Cell Organized Crime Unit', city: 'Delhi', lat: 28.5700, lng: 77.2400, desc: 'MCOCA Builder ₹50L Extortion' },
  { name: "Elena 'Czar' Rostova", fir: 'FIR-2024-104', station: 'NCB Zonal HQ Mumbai Port', city: 'Mumbai', lat: 18.9500, lng: 72.9500, desc: '100kg Synthetic Heroin Port Seizure' }
];

export default function CasesPage() {
  const [casesList, setCasesList] = useState(DEFAULT_CASES);
  const [selectedCase, setSelectedCase] = useState(DEFAULT_CASES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['OVERVIEW', 'EVIDENCE', 'LOCATIONS', 'SUSPECTS', 'AI_ANALYSIS'].includes(tabParam.toUpperCase())) {
        return tabParam.toUpperCase();
      }
    } catch {}
    return 'OVERVIEW';
  });
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    const checkTab = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam && ['OVERVIEW', 'EVIDENCE', 'LOCATIONS', 'SUSPECTS', 'AI_ANALYSIS'].includes(tabParam.toUpperCase())) {
          setActiveTab(tabParam.toUpperCase());
        }
      } catch {}
    };
    checkTab();
    window.addEventListener('popstate', checkTab);
    return () => window.removeEventListener('popstate', checkTab);
  }, []);

  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    leadSuspect: '',
    firNumber: '',
    policeStation: 'PS Sector 18 Crime Branch',
    priority: 'HIGH',
    description: '',
    tags: 'HOMICIDE, ARMS_ACT'
  });

  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load cases from backend or retain defaults
  useEffect(() => {
    api.cases.getAll().then((data) => {
      if (data && Array.isArray(data.cases) && data.cases.length > 0) {
        setCasesList(data.cases);
      }
    }).catch(() => {});
  }, []);

  // Filtered cases list
  const filteredCases = useMemo(() => {
    return casesList.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.leadSuspect.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.firNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        priorityFilter === 'ALL' || c.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [casesList, searchQuery, priorityFilter]);

  // Leaflet Map for Tab: LOCATIONS
  useEffect(() => {
    if (activeTab !== 'LOCATIONS' || !mapElement.current) return;

    if (mapElement.current._leaflet_id) {
      mapElement.current._leaflet_id = null;
    }

    let map = null;
    try {
      map = L.map(mapElement.current, {
        zoomControl: false,
        attributionControl: true
      }).setView([28.5200, 77.1500], 8);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markersGroup = L.featureGroup().addTo(map);
      markersRef.current = markersGroup;
      mapInstance.current = map;

      // Add pins for the selected case or all relevant stations
      CASE_MAP_LOCATIONS.forEach((loc) => {
        const marker = L.circleMarker([loc.lat, loc.lng], {
          radius: 8,
          fillColor: '#1e40af',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #0f172a;">${loc.station}</strong><br/>
            <span style="font-size: 11px; color: #1e40af;">${loc.fir}</span><br/>
            <span style="font-size: 11px; color: #475569;">${loc.desc}</span>
          </div>
        `);
        markersGroup.addLayer(marker);
      });

      setTimeout(() => map?.invalidateSize(), 150);
    } catch (e) {
      console.warn('Map initialization notice:', e);
    }

    return () => {
      try {
        if (map) map.remove();
      } catch {}
      mapInstance.current = null;
    };
  }, [activeTab, selectedCase]);

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCaseForm.title.trim()) return;

    const newCase = {
      id: `CASE-2024-${Math.floor(110 + Math.random() * 890)}`,
      title: newCaseForm.title,
      leadSuspect: newCaseForm.leadSuspect || 'Unknown Suspect',
      status: 'INVESTIGATION OPEN',
      priority: newCaseForm.priority,
      assignedOfficer: 'Inspector Assigned (State STF)',
      openedDate: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now',
      evidenceCount: 1,
      policeStation: newCaseForm.policeStation,
      firNumber: newCaseForm.firNumber || `FIR-2024-${Math.floor(100 + Math.random() * 900)}`,
      description: newCaseForm.description || 'Newly registered FIR investigation dossier.',
      tags: newCaseForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      evidenceList: [
        { id: 'EVD-INIT-01', type: 'Document', name: 'Initial FIR Complaint Filing Record', source: newCaseForm.policeStation, status: 'CATALOGUED', hash: 'SHA256: new-case-record' }
      ],
      suspectsList: [
        { id: `CRM-${Math.floor(1000 + Math.random() * 9000)}`, name: newCaseForm.leadSuspect || 'Pending Identification', role: 'Primary Accused', risk: '85.0%', status: 'UNDER VERIFICATION' }
      ]
    };

    setCasesList([newCase, ...casesList]);
    setSelectedCase(newCase);
    setIsNewCaseModalOpen(false);
    showToast(`✓ Case created: ${newCase.id}`);
  };

  return (
    <div className="cases-screen">
      {/* ================= TOP CONTROLS ================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', letterSpacing: '0.8px' }}>
            CASE INVESTIGATION WORKBENCH
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
            Case Files & FIR Records
          </h1>
        </div>

        <button
          onClick={() => setIsNewCaseModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={14} />
          <span>New Case File</span>
        </button>
      </div>

      {/* ================= MASTER-DETAIL LAYOUT ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Search & Cases List */}
        <div
          className="cl-card"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: 'calc(100vh - 170px)',
            overflowY: 'auto'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, FIR, suspect..."
              style={{
                width: '100%',
                paddingLeft: '32px',
                height: '34px',
                fontSize: '12.5px'
              }}
            />
          </div>

          {/* Priority Filters */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'CRITICAL', 'HIGH'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                style={{
                  flex: 1,
                  fontSize: '11px',
                  fontWeight: priorityFilter === p ? 600 : 500,
                  padding: '4px 0',
                  borderRadius: '4px',
                  backgroundColor: priorityFilter === p ? 'var(--accent-subtle, #eff6ff)' : 'var(--card-bg-elevated, #f8fafc)',
                  color: priorityFilter === p ? 'var(--accent-primary, #1e40af)' : 'var(--card-text-muted, #64748b)',
                  border: priorityFilter === p ? '1px solid var(--border-active, #bfdbfe)' : '1px solid var(--card-border, #e2e8f0)',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Cases List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`case-card-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCase(c)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent-primary, #1e40af)', fontWeight: 700 }}>
                      {c.id}
                    </span>
                    <span className={c.priority === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                      {c.priority}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', lineHeight: 1.3 }}>
                    {c.title}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--card-text-muted, #64748b)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Lead: <strong>{c.leadSuspect}</strong></span>
                    <span>{c.evidenceCount || (c.evidenceList ? c.evidenceList.length : 0)} Exhibits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Dossier & Tabs */}
        {selectedCase ? (
          <div
            className="cl-card"
            style={{
              padding: '20px 24px'
            }}
          >
            {/* Case Overview Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid var(--card-border, #e2e8f0)',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary, #1e40af)' }}>
                    {selectedCase.id}
                  </span>
                  <span className="badge-info">
                    {selectedCase.firNumber}
                  </span>
                  <span className={selectedCase.priority === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                    {selectedCase.status}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--card-text, #0f172a)', margin: 0 }}>
                  {selectedCase.title}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--card-text-muted, #64748b)', marginTop: '4px' }}>
                  Jurisdiction: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{selectedCase.policeStation}</strong> • Assigned: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{selectedCase.assignedOfficer}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--card-text-muted, #64748b)' }}>Opened: {selectedCase.openedDate}</div>
                <div style={{ fontSize: '11px', color: 'var(--card-text-muted, #64748b)' }}>Updated: {selectedCase.lastUpdated || 'Recent'}</div>
              </div>
            </div>

            {/* Case Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--card-border, #e2e8f0)',
                marginBottom: '16px'
              }}
            >
              {[
                { id: 'OVERVIEW', label: 'Summary & FIR' },
                { id: 'EVIDENCE', label: `Verified Evidence (${selectedCase.evidenceList?.length || 0})` },
                { id: 'PERSONS', label: `Suspects & Persons (${selectedCase.suspectsList?.length || 0})` },
                { id: 'LOCATIONS', label: 'Jurisdiction & Locations (Map)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`case-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'OVERVIEW' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', marginBottom: '6px' }}>
                    Case Incident Narrative & Modus Operandi
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--card-text-secondary, #334155)', lineHeight: 1.6, margin: 0 }}>
                    {selectedCase.description}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', marginBottom: '8px' }}>
                    Legal Classification & Statutory Sections
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedCase.tags?.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          backgroundColor: 'var(--card-bg-elevated, #f1f5f9)',
                          border: '1px solid var(--card-border, #cbd5e1)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          color: 'var(--card-text-secondary, #334155)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="nested-card"
                  style={{
                    backgroundColor: 'var(--card-bg-elevated, #f8fafc)',
                    border: '1px solid var(--card-border, #e2e8f0)',
                    borderRadius: '6px',
                    padding: '14px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    fontSize: '12.5px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--card-text-muted, #64748b)' }}>Primary Lead Suspect:</span><br />
                    <strong style={{ color: 'var(--card-text, #0f172a)' }}>{selectedCase.leadSuspect}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--card-text-muted, #64748b)' }}>Registered FIR Number:</span><br />
                    <strong style={{ color: 'var(--accent-primary, #1e40af)' }}>{selectedCase.firNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--card-text-muted, #64748b)' }}>Court Jurisdiction:</span><br />
                    <strong style={{ color: 'var(--card-text, #0f172a)' }}>Sessions Court / Special STF Bench</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Evidence-First List */}
            {activeTab === 'EVIDENCE' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', margin: 0 }}>
                    Chain of Custody & Laboratory Verified Exhibits
                  </h4>
                  <span className="badge-verified">
                    Evidence Verified
                  </span>
                </div>

                <table className="cl-table">
                  <thead>
                    <tr>
                      <th>Exhibit ID</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Source</th>
                      <th>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedCase.evidenceList || []).map((ev) => (
                      <tr key={ev.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-primary, #1e40af)' }}>
                          {ev.id}
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--card-text-secondary, #334155)' }}>
                            {ev.type}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '12.5px', color: 'var(--card-text, #0f172a)' }}>{ev.name}</strong>
                          <div style={{ fontSize: '10.5px', color: 'var(--card-text-muted, #94a3b8)', fontFamily: 'monospace' }}>{ev.hash}</div>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--card-text-secondary, #475569)' }}>
                          {ev.source}
                        </td>
                        <td>
                          <span className="badge-verified">
                            {ev.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 3: Suspects & Persons Involved */}
            {activeTab === 'PERSONS' && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', marginBottom: '12px' }}>
                  Named Accused & Known Associates
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedCase.suspectsList || []).map((s) => (
                    <div
                      key={s.id}
                      className="nested-card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: 'var(--card-bg-elevated, #f8fafc)',
                        border: '1px solid var(--card-border, #e2e8f0)',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-subtle, #eff6ff)',
                            border: '1px solid var(--border-strong, #bfdbfe)',
                            color: 'var(--accent-primary, #1e40af)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        >
                          <User size={15} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)' }}>
                            {s.name} <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--card-text-muted, #64748b)' }}>({s.id})</span>
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--card-text-muted, #64748b)' }}>{s.role}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-critical, #dc2626)' }}>
                          Risk: {s.risk}
                        </span>
                        <span className="badge-critical">
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Locations & Map */}
            {activeTab === 'LOCATIONS' && (
              <div>
                <div style={{ fontSize: '12px', color: 'var(--card-text-muted, #64748b)', marginBottom: '10px' }}>
                  Inter-state police station jurisdictions, incident coordinates, and radar nodes connected to this case:
                </div>
                <div ref={mapElement} className="case-map-container" />
              </div>
            )}
          </div>
        ) : (
          <div className="cl-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--card-text-muted, #64748b)' }}>
            Select a case file from the left to view investigation details.
          </div>
        )}
      </div>

      {/* ================= NEW CASE MODAL ================= */}
      {isNewCaseModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setIsNewCaseModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-modal, #ffffff)',
              borderRadius: '8px',
              border: '1px solid var(--border-color, #e2e8f0)',
              width: '520px',
              maxWidth: '92vw',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary, #0f172a)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary, #0f172a)', margin: 0 }}>
                Register New FIR & Case Dossier
              </h3>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #334155)', display: 'block', marginBottom: '4px' }}>
                  Case Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCaseForm.title}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                  placeholder="e.g. Operation Hawk: Inter-State Cargo Robbery"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #334155)', display: 'block', marginBottom: '4px' }}>
                    FIR Number
                  </label>
                  <input
                    type="text"
                    value={newCaseForm.firNumber}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, firNumber: e.target.value })}
                    placeholder="FIR-2024-501"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #334155)', display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={newCaseForm.priority}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, priority: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #334155)', display: 'block', marginBottom: '4px' }}>
                  Primary Suspect / Named Accused
                </label>
                <input
                  type="text"
                  value={newCaseForm.leadSuspect}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, leadSuspect: e.target.value })}
                  placeholder="Mayank Kotoli / Unknown"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary, #334155)', display: 'block', marginBottom: '4px' }}>
                  Incident Description & Modus Operandi
                </label>
                <textarea
                  rows={3}
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  placeholder="Details of crime, time of occurrence, recovered evidence..."
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Create Case File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--bg-modal, #ffffff)',
            color: 'var(--text-primary, #0f172a)',
            border: '1px solid var(--border-color, #e2e8f0)',
            padding: '10px 18px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-md)',
            zIndex: 99999
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
