import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  AlertTriangle,
  FileText,
  Navigation,
  Search,
  Building,
  CheckCircle2,
  Shield,
  ArrowRight,
  TrendingUp,
  Cpu,
  Radio,
  ExternalLink,
  Filter,
  Plus
} from 'lucide-react';
import { api } from '../services/api.js';
import AddCriminalModal from '../components/AddCriminalModal.jsx';

export const POLICE_STATIONS = [
  {
    id: 'PS-18',
    name: 'PS Sector 18 Crime Branch',
    code: 'STN-NCR-018',
    district: 'Gurugram Commissionerate',
    zone: 'Zone-1 (DLF & Cyber City)',
    sho: 'Inspector R. K. Dahiya',
    status: 'ONLINE',
    ping: '14ms',
    activeOfficers: 24,
    emergencyHotline: '112 / 0124-2391001',
    cctnsStatus: 'LIVE CCTNS NODE'
  },
  // {
  //   id: 'PS-14',
  //   name: 'Women Safety PS Sector 14',
  //   code: 'STN-NCR-014',
  //   district: 'Gurugram Commissionerate',
  //   zone: 'South-West Sub-Division',
  //   sho: 'Inspector Meena Sangwan',
  //   status: 'ONLINE',
  //   ping: '18ms',
  //   activeOfficers: 18,
  //   emergencyHotline: '1091 / 0124-2221414',
  //   cctnsStatus: 'LIVE CCTNS NODE'
  // },
  // {
  //   id: 'PS-SADAR',
  //   name: 'PS Sadar Bazar Anti-Robbery',
  //   code: 'STN-DEL-042',
  //   district: 'Delhi Central District',
  //   zone: 'Old Delhi & Chandni Chowk',
  //   sho: 'Inspector Sandeep Hooda',
  //   status: 'ONLINE',
  //   ping: '22ms',
  //   activeOfficers: 28,
  //   emergencyHotline: '011-23512345',
  //   cctnsStatus: 'LIVE CCTNS NODE'
  // },
  // {
  //   id: 'PS-STF',
  //   name: 'Special Cell STF Delhi HQ',
  //   code: 'STN-STF-001',
  //   district: 'Special Operations Command',
  //   zone: 'Inter-State Gang & Terror Grid',
  //   sho: 'ACP Rajesh Verma',
  //   status: 'ONLINE',
  //   ping: '9ms',
  //   activeOfficers: 42,
  //   emergencyHotline: '011-24361000',
  //   cctnsStatus: 'HIGH SEC CCTNS'
  // },
  // {
  //   id: 'PS-CYBER',
  //   name: 'Cyber Crime PS Sector 43',
  //   code: 'STN-CYB-043',
  //   district: 'Cyber Command Wing',
  //   zone: 'Fintech & Digital Fraud Hub',
  //   sho: 'Inspector Amit Kulkarni',
  //   status: 'ONLINE',
  //   ping: '11ms',
  //   activeOfficers: 16,
  //   emergencyHotline: '1930 / 0124-2884300',
  //   cctnsStatus: 'LIVE CCTNS NODE'
  // }
];

export default function DashboardPage({ onNavigate }) {
  const [predictionInput, setPredictionInput] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('HOMICIDE_9MM');
  const [activeCluster, setActiveCluster] = useState('CLUSTER_HOMICIDE_GANG');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddCriminalModalOpen, setIsAddCriminalModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showStationDetails, setShowStationDetails] = useState(false);

  // Connected Police Station
  const [selectedStationId, setSelectedStationId] = useState(() => {
    try {
      return localStorage.getItem('crimelens_station_id') || 'PS-18';
    } catch {
      return 'PS-18';
    }
  });

  const activeStation = useMemo(() => {
    return POLICE_STATIONS.find((s) => s.id === selectedStationId) || POLICE_STATIONS[0];
  }, [selectedStationId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Structured AI Prediction Scenarios with Explainable Forensics
  const PREDICTION_SCENARIOS = {
    HOMICIDE_9MM: {
      id: 'HOMICIDE_9MM',
      title: 'Contract Assassination (BNS Sec 103 / IPC 302)',
      location: 'Sector 18 Market, Gurugram',
      weapon: '9mm Beretta 92FS / Double-Tap Signature',
      vehicle: 'Unregistered KTM Duke 390 (Orange/Black)',
      suspect: {
        name: 'MAYANK KOTOLI',
        id: 'CRM-9942',
        alias: 'The Trigger / MK-99',
        confidence: 99.4,
        threatLevel: 'CRITICAL',
        status: 'ACTIVE FUGITIVE',
        role: 'Lead Syndicate Hitman',
        reason: 'Firing pin marks on spent 9mm casings matched laboratory reference #FSL-884 with 99.4% confidence; MO matches previous contract killings.',
        verifiedEvidence: '4 spent cartridge casings; CCTV footage from Sector 18 junction; blood spatter STR DNA test.',
        recommendedAction: 'Execute Non-Bailable Arrest Warrant (NBW-2024-402); alert Meerut expressway toll plazas.'
      }
    },
    EXTORTION_MCOCA: {
      id: 'EXTORTION_MCOCA',
      title: 'Organized Crime & Syndicate Extortion (MCOCA Act)',
      location: 'NCR Commercial Real Estate Belt',
      weapon: 'Imported Glock-17 / Clandestine AK-47',
      vehicle: 'Armored SUV convoy / Proxy Benami registration',
      suspect: {
        name: "MAHESH 'TIGER' KHAN",
        id: 'CRM-0014',
        alias: 'Tiger Don / MK-01',
        confidence: 98.5,
        threatLevel: 'CRITICAL',
        status: 'MCOCA WARRANT',
        role: 'Syndicate Apex Commander',
        reason: 'VoIP audio recording matched suspect voiceprint with 99.1% acoustic match; bank transfer routed to Dubai escrow.',
        verifiedEvidence: 'VoIP intercept audio file; bank deposit slips (₹35 Lakhs); FIR-2024-001 witness deposition.',
        recommendedAction: 'Submit MCOCA Section 3 attachment petition; freeze flagged Hawala conduit accounts.'
      }
    },
    VAULT_BREACH: {
      id: 'VAULT_BREACH',
      title: 'Commercial Bank Vault Heist & Gold Bullion (BNS Sec 310)',
      location: 'Commercial Bank Vault, Sadar Bazar',
      weapon: 'Thermal Lance / Frequency Jammer',
      vehicle: 'White Mahindra Bolero Camper (HR-26)',
      suspect: {
        name: "SAMEER 'GHOST' QURESHI",
        id: 'CRM-8821',
        alias: 'The Drill / SQ-Lock',
        confidence: 92.4,
        threatLevel: 'HIGH',
        status: 'ACTIVE TRACKING',
        role: 'Safe-Cracking Specialist',
        reason: 'Precision thermal lance burn patterns on Class-A vault door; glove fiber recovered at point of entry.',
        verifiedEvidence: '14 kg bullion heist FIR-2024-103; ANPR camera match on Manesar toll barrier.',
        recommendedAction: 'Deploy surveillance at Chandni Chowk bullion fencers; intercept getaway vehicle vector.'
      }
    },
    PREDATOR_HIGHWAY: {
      id: 'PREDATOR_HIGHWAY',
      title: 'Highway Serial Assault & Kidnapping (BNS Sec 64)',
      location: 'Transit Junction / IFFCO Chowk Highway',
      weapon: 'Chloroform Spray / Hunting Blade',
      vehicle: 'Yellow Commercial Taxi with Forged Plates',
      suspect: {
        name: "DEVENDRA 'D-7' RAWAT",
        id: 'CRM-7721',
        alias: 'Highway Predator / Night Stalker',
        confidence: 100.0,
        threatLevel: 'CRITICAL',
        status: 'ACTIVE FUGITIVE',
        role: 'Serial Violent Offender',
        reason: 'Biological STR DNA profile extracted from forensic rape kit #FK-8821 confirmed 100% identity match in national DNA registry.',
        verifiedEvidence: 'Forensic DNA Report #DNA-GUR-2024; fake taxi number plate seized by Sector 14 police.',
        recommendedAction: 'Issue Inter-State Blue Notice; alert women transit safety patrols along Ring Road.'
      }
    },
    NARCO_MARITIME: {
      id: 'NARCO_MARITIME',
      title: 'Maritime Opioids & Military Arms Smuggling (NDPS Act)',
      location: 'Port Terminal C / Yard 4',
      weapon: 'Steyr TMP Military Submachine Guns',
      vehicle: 'Maritime Cargo Container #CT-991',
      suspect: {
        name: "ELENA 'CZAR' ROSTOVA",
        id: 'CRM-5512',
        alias: 'The Chemist / Czarina',
        confidence: 96.0,
        threatLevel: 'CRITICAL',
        status: 'INTERPOL WATCH',
        role: 'Cartel Logistics Director',
        reason: 'Latent fingerprint on cargo container mechanical seal matched Interpol Red Notice biometric database.',
        verifiedEvidence: '100 kg synthetic opioids seizure report; 8 military carbines recovered; $4.2M wire trail.',
        recommendedAction: 'Seal customs transit container; coordinate extradition alert with Interpol New Delhi NCB.'
      }
    }
  };

  const activePrediction = useMemo(() => {
    if (predictionInput.trim()) {
      const q = predictionInput.toLowerCase();
      if (q.includes('shoot') || q.includes('kill') || q.includes('9mm') || q.includes('beretta') || q.includes('kotoli') || q.includes('homicide')) {
        return PREDICTION_SCENARIOS.HOMICIDE_9MM;
      }
      if (q.includes('extort') || q.includes('threat') || q.includes('ransom') || q.includes('tiger') || q.includes('khan')) {
        return PREDICTION_SCENARIOS.EXTORTION_MCOCA;
      }
      if (q.includes('bank') || q.includes('vault') || q.includes('gold') || q.includes('heist') || q.includes('qureshi')) {
        return PREDICTION_SCENARIOS.VAULT_BREACH;
      }
      if (q.includes('rape') || q.includes('assault') || q.includes('taxi') || q.includes('predator') || q.includes('rawat')) {
        return PREDICTION_SCENARIOS.PREDATOR_HIGHWAY;
      }
      if (q.includes('drug') || q.includes('narco') || q.includes('opioid') || q.includes('rostova')) {
        return PREDICTION_SCENARIOS.NARCO_MARITIME;
      }
    }
    return PREDICTION_SCENARIOS[selectedScenario] || PREDICTION_SCENARIOS.HOMICIDE_9MM;
  }, [predictionInput, selectedScenario]);

  // Top 4 High-Priority Investigation Metrics
  const KPI_METRICS = [
    {
      id: 'active_cases',
      label: 'ACTIVE CASES',
      value: '245',
      trend: '+12 Requiring Attention',
      status: 'normal',
      icon: Folder,
      targetPage: 'cases'
    },
    {
      id: 'critical_alerts',
      label: 'CRITICAL ALERTS & MANHUNTS',
      value: '32',
      trend: 'Active NBW Warrants',
      status: 'critical',
      icon: AlertTriangle,
      targetPage: 'entities'
    },
    {
      id: 'evidence_items',
      label: 'CATALOGUED EVIDENCE ITEMS',
      value: '1,248',
      trend: '99.4% Verified Chain of Custody',
      status: 'verified',
      icon: FileText,
      targetPage: 'cases'
    },
    {
      id: 'active_investigations',
      label: 'ACTIVE INVESTIGATION VECTORS',
      value: '18',
      trend: 'Live CDR & GIS Trajectories',
      status: 'info',
      icon: Navigation,
      targetPage: 'location'
    }
  ];

  // Cluster graph definitions (Clean light intelligence layout)
  const CLUSTERS = {
    CLUSTER_HOMICIDE_GANG: {
      name: 'Homicide & Contract Killing Syndicate',
      nodesCount: '1,432',
      threatLevel: 'CRITICAL',
      nodes: [
        { id: 'N1', name: 'MAYANK KOTOLI', role: 'Hitman', x: 70, y: 80, r: 12, color: '#dc2626', risk: '99.4%' },
        { id: 'N2', name: "TIGER KHAN", role: 'Syndicate Boss', x: 150, y: 40, r: 14, color: '#1e40af', risk: '98.5%' },
        { id: 'N3', name: 'SECTOR-18 SCENE', role: 'Double Homicide', x: 230, y: 80, r: 11, color: '#dc2626', risk: '100%' },
        { id: 'N4', name: 'SURESH ARMORER', role: 'Weapon Supply', x: 150, y: 120, r: 11, color: '#d97706', risk: '94.0%' },
        { id: 'N5', name: 'KTM GETAWAY', role: 'Vehicle Vector', x: 80, y: 140, r: 9, color: '#16a34a', risk: '88.2%' },
        { id: 'N6', name: 'HAWALA ₹35L', role: 'Escrow Account', x: 210, y: 140, r: 10, color: '#2563eb', risk: '91.5%' }
      ],
      edges: [
        { from: [70, 80], to: [150, 40], color: '#dc2626', label: 'HIT CONTRACT' },
        { from: [70, 80], to: [230, 80], color: '#dc2626', label: '9mm CASINGS' },
        { from: [150, 40], to: [150, 120], color: '#d97706', dashed: true },
        { from: [150, 120], to: [70, 80], color: '#d97706', dashed: true },
        { from: [70, 80], to: [80, 140], color: '#16a34a' },
        { from: [150, 40], to: [210, 140], color: '#2563eb' }
      ]
    },
    CLUSTER_ROBBERY_FENCING: {
      name: 'Armed Bank Heists & Gold Bullion Vault Breaches',
      nodesCount: '842',
      threatLevel: 'HIGH',
      nodes: [
        { id: 'FN1', name: 'SAMEER QURESHI', role: 'Safe Cracker', x: 70, y: 60, r: 13, color: '#d97706', risk: '92.4%' },
        { id: 'FN2', name: 'AXIS BANK VAULT', role: '14kg Gold Heist', x: 150, y: 50, r: 14, color: '#dc2626', risk: '99.0%' },
        { id: 'FN3', name: 'CHANDNI CHOWK', role: 'Bullion Fencer', x: 220, y: 70, r: 11, color: '#16a34a', risk: '89.2%' },
        { id: 'FN4', name: 'GETAWAY BOLERO', role: 'ANPR Camera', x: 120, y: 120, r: 10, color: '#1e40af', risk: '96.0%' }
      ],
      edges: [
        { from: [70, 60], to: [150, 50], color: '#dc2626' },
        { from: [150, 50], to: [220, 70], color: '#d97706' },
        { from: [70, 60], to: [120, 120], color: '#1e40af', dashed: true }
      ]
    },
    CLUSTER_NARCO_PIPELINE: {
      name: 'Maritime Narcotics & Military Arms Pipeline',
      nodesCount: '620',
      threatLevel: 'CRITICAL',
      nodes: [
        { id: 'DN1', name: 'ELENA ROSTOVA', role: 'Cartel Boss', x: 80, y: 80, r: 13, color: '#dc2626', risk: '96.0%' },
        { id: 'DN2', name: 'PORT TERMINAL C', role: '100kg Opioids', x: 150, y: 50, r: 13, color: '#1e40af', risk: '100%' },
        { id: 'DN3', name: 'STEYR TMP FIREARMS', role: 'Military Weapons', x: 220, y: 90, r: 11, color: '#d97706', risk: '98.0%' }
      ],
      edges: [
        { from: [80, 80], to: [150, 50], color: '#1e40af' },
        { from: [150, 50], to: [220, 90], color: '#d97706' }
      ]
    }
  };

  const currentCluster = CLUSTERS[activeCluster] || CLUSTERS.CLUSTER_HOMICIDE_GANG;

  // Real-Time Field Activity & Telemetry Feed
  const RECENT_ACTIVITY = [
    {
      id: 'ACT-01',
      time: '4 mins ago',
      type: 'BALLISTICS VERIFIED',
      typeColor: '#dc2626',
      entity: 'Mayank Kotoli (CRM-9942)',
      detail: 'State FSL confirmed 9mm cartridge casings match Sector 18 double homicide (#FSL-884).'
    },
    {
      id: 'ACT-02',
      time: '18 mins ago',
      type: 'CELL TOWER PING',
      typeColor: '#d97706',
      entity: 'Burner Intercept (+91-98711-40291)',
      detail: 'Cell tower triangulation pinged suspect mobile moving along Meerut Expressway corridor.'
    },
    {
      id: 'ACT-03',
      time: '45 mins ago',
      type: 'ANPR HIT',
      typeColor: '#2563eb',
      entity: 'Unregistered KTM Duke 390',
      detail: 'Captured crossing Kherki Daula Highway Toll barrier heading towards NCR border.'
    },
    {
      id: 'ACT-04',
      time: '2 hours ago',
      type: 'DNA CODIS MATCH',
      typeColor: '#16a34a',
      entity: "Devendra 'D-7' Rawat",
      detail: '100% STR profile match confirmed on forensic kit #FK-8821 in serial assault investigation.'
    }
  ];

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* ================= PAGE HEADER ================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', letterSpacing: '0.8px' }}>
            LAW ENFORCEMENT INTELLIGENCE WORKBENCH
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
            Command & Investigation Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            Real-time crime intelligence, forensic correlation, and suspect threat monitoring.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate && onNavigate('network')}
            className="btn-secondary"
          >
            <span>Inspect Syndicate Graph</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={() => setIsAddCriminalModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={14} />
            <span>Register Suspect</span>
          </button>
        </div>
      </div>

      {/* ================= CONNECTED POLICE STATION BANNER ================= */}
      <div
        className="cl-card"
        style={{
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              backgroundColor: 'var(--accent-subtle, #eff6ff)',
              border: '1px solid var(--border-strong, #bfdbfe)',
              color: 'var(--accent-primary, #1e40af)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building size={18} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--card-text, #0f172a)' }}>
                {activeStation.name}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--card-text-muted, #64748b)', backgroundColor: 'var(--card-bg-elevated, #f1f5f9)', padding: '1px 6px', borderRadius: '3px' }}>
                {activeStation.code}
              </span>
              <span className="badge-verified">
                ● {activeStation.cctnsStatus}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--card-text-muted, #64748b)', marginTop: '2px' }}>
              📍 {activeStation.district} • Station Head: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{activeStation.sho}</strong> • Latency: {activeStation.ping}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--card-text-muted, #64748b)' }}>
            Officers Active: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{activeStation.activeOfficers}</strong>
          </div>

          <button
            onClick={() => setShowStationDetails((prev) => !prev)}
            className="btn-ghost"
            style={{ fontSize: '11.5px', padding: '4px 8px' }}
          >
            {showStationDetails ? 'Hide Station Info ▲' : 'Station Info ▼'}
          </button>
        </div>

        {showStationDetails && (
          <div
            style={{
              width: '100%',
              paddingTop: '12px',
              marginTop: '4px',
              borderTop: '1px solid var(--card-border, #e2e8f0)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--card-text-muted, #64748b)'
            }}
          >
            <div>
              Zone: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{activeStation.zone}</strong>
            </div>
            <div>
              Emergency Hotline: <strong style={{ color: 'var(--status-verified, #16a34a)' }}>{activeStation.emergencyHotline}</strong>
            </div>
            <div>
              Encryption: <strong style={{ color: 'var(--card-text, #0f172a)' }}>AES-256 STF VPN Tunnel</strong>
            </div>
            <div>
              CCTNS Gateway: <strong style={{ color: 'var(--status-verified, #16a34a)' }}>Sync Active</strong>
            </div>
          </div>
        )}
      </div>

      {/* ================= TOP 4 KPI OVERVIEW CARDS ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {KPI_METRICS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="cl-card"
              onClick={() => onNavigate && onNavigate(kpi.targetPage)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--card-text-muted, #64748b)', letterSpacing: '0.5px' }}>
                  {kpi.label}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor:
                      kpi.status === 'critical'
                        ? 'var(--status-critical-bg, #fef2f2)'
                        : kpi.status === 'verified'
                        ? 'var(--status-verified-bg, #f0fdf4)'
                        : 'var(--accent-subtle, #eff6ff)',
                    color:
                      kpi.status === 'critical'
                        ? 'var(--status-critical, #dc2626)'
                        : kpi.status === 'verified'
                        ? 'var(--status-verified, #16a34a)'
                        : 'var(--accent-primary, #1e40af)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--card-text, #0f172a)', marginBottom: '4px' }}>
                {kpi.value}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color:
                      kpi.status === 'critical'
                        ? 'var(--status-critical, #dc2626)'
                        : kpi.status === 'verified'
                        ? 'var(--status-verified, #16a34a)'
                        : 'var(--card-text-muted, #64748b)'
                  }}
                >
                  {kpi.trend}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--accent-primary, #1e40af)', fontWeight: 600 }}>View →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= AI INVESTIGATION CORRELATION ASSISTANT ================= */}
      <div
        className="cl-card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={15} color="var(--accent-primary, #1e40af)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary, #1e40af)', letterSpacing: '0.8px' }}>
                NEURAL INVESTIGATION ASSISTANT
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--card-text, #0f172a)', margin: '2px 0 0 0' }}>
              AI Suspect & Modus Operandi Matcher
            </h2>
          </div>

          {/* Quick Incident Scenario Selectors */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'HOMICIDE_9MM', label: '9mm Homicide Ambush' },
              { id: 'EXTORTION_MCOCA', label: 'MCOCA Extortion' },
              { id: 'VAULT_BREACH', label: 'Bank Vault Heist' },
              { id: 'PREDATOR_HIGHWAY', label: 'Highway Predator' },
              { id: 'NARCO_MARITIME', label: 'NDPS Port Opioids' }
            ].map((scen) => {
              const isSelected = selectedScenario === scen.id && !predictionInput;
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen.id);
                    setPredictionInput('');
                    showToast(`Matched scenario: ${scen.label}`);
                  }}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-subtle, #eff6ff)' : 'var(--card-bg-elevated, #f8fafc)',
                    color: isSelected ? 'var(--accent-primary, #1e40af)' : 'var(--card-text-secondary, #475569)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary, #1e40af)' : 'var(--card-border, #cbd5e1)'}`,
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {scen.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Clues Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search
            size={16}
            color="var(--card-text-muted, #64748b)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={predictionInput}
            onChange={(e) => setPredictionInput(e.target.value)}
            placeholder="Type incident clues or modus operandi (e.g. 'Unregistered KTM Duke getaway', '₹50L builder extortion', 'Thermal lance vault breach')..."
            style={{
              width: '100%',
              paddingLeft: '36px',
              paddingRight: '36px',
              height: '38px',
              fontSize: '13px',
              backgroundColor: 'var(--bg-input, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              border: '1px solid var(--card-border, #cbd5e1)'
            }}
          />
          {predictionInput && (
            <button
              onClick={() => setPredictionInput('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--card-text-muted, #94a3b8)',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Structured AI Finding & Evidence Card (Nested Card) */}
        <div
          className="nested-card"
          style={{
            backgroundColor: 'var(--card-bg-elevated, #f8fafc)',
            border: '1px solid var(--card-border, #e2e8f0)',
            borderRadius: '6px',
            padding: '16px 20px'
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              borderBottom: '1px solid var(--card-border, #e2e8f0)',
              paddingBottom: '12px',
              marginBottom: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--card-text-muted, #64748b)', fontWeight: 600 }}>CORRELATED INCIDENT TYPE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--card-text, #0f172a)' }}>
                {activePrediction.title}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--card-text-muted, #64748b)' }}>CONFIDENCE SCORE</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary, #1e40af)', fontFamily: 'monospace' }}>
                  {activePrediction.suspect.confidence}%
                </div>
              </div>
              <span className={activePrediction.suspect.threatLevel === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                {activePrediction.suspect.threatLevel} THREAT
              </span>
            </div>
          </div>

          {/* Structured Forensic Schema Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              fontSize: '13px'
            }}
          >
            {/* Primary Suspect */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--card-text-muted, #64748b)', marginBottom: '4px' }}>
                PRIMARY SUSPECT IDENTIFIED
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '15px', color: 'var(--card-text, #0f172a)' }}>
                  {activePrediction.suspect.name}
                </strong>
                <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: 'var(--accent-primary, #1e40af)' }}>
                  ({activePrediction.suspect.id})
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--card-text-muted, #64748b)', marginTop: '2px' }}>
                Role: {activePrediction.suspect.role} • Status: <span style={{ color: 'var(--status-critical, #dc2626)', fontWeight: 600 }}>{activePrediction.suspect.status}</span>
              </div>
            </div>

            {/* Explainable Reasoning */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--card-text-muted, #64748b)', marginBottom: '4px' }}>
                EXPLAINABLE REASONING (AI ANALYSIS)
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--card-text-secondary, #334155)', margin: 0 }}>
                {activePrediction.suspect.reason}
              </p>
            </div>

            {/* Verified Forensic Evidence */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-verified, #16a34a)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="var(--status-verified, #16a34a)" />
                <span>VERIFIED FORENSIC EVIDENCE</span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--card-text-secondary, #334155)', margin: 0 }}>
                {activePrediction.suspect.verifiedEvidence}
              </p>
            </div>

            {/* Recommended Police Action */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-primary, #1e40af)', marginBottom: '4px' }}>
                RECOMMENDED ACTION
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--card-text, #0f172a)', fontWeight: 600, margin: 0 }}>
                {activePrediction.suspect.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid var(--card-border, #e2e8f0)'
            }}
          >
            <button
              onClick={() => onNavigate && onNavigate('network', { suspect: activePrediction.suspect.name })}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Map Gang Network →
            </button>
            <button
              onClick={() => onNavigate && onNavigate('entities', { suspect: activePrediction.suspect.name })}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Open Suspect 360° Dossier →
            </button>
          </div>
        </div>
      </div>

      {/* ================= INVESTIGATION & INTELLIGENCE SECTION ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}
      >
        {/* Left: Syndicate Network Topology */}
        <div
          className="cl-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary, #1e40af)' }}>
                  INTELLIGENCE TOPOLOGY
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--card-text, #0f172a)', margin: '2px 0 0 0' }}>
                  {currentCluster.name}
                </h3>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('network')}
                className="btn-ghost"
                style={{ fontSize: '11.5px' }}
              >
                <span>Full Graph</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Cluster Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {Object.keys(CLUSTERS).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCluster(key)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: activeCluster === key ? 600 : 400,
                    backgroundColor: activeCluster === key ? 'var(--accent-subtle, #eff6ff)' : 'var(--card-bg-elevated, #f8fafc)',
                    color: activeCluster === key ? 'var(--accent-primary, #1e40af)' : 'var(--card-text-muted, #64748b)',
                    border: activeCluster === key ? '1px solid var(--border-active, #bfdbfe)' : '1px solid var(--card-border, #e2e8f0)',
                    cursor: 'pointer'
                  }}
                >
                  {key.replace('CLUSTER_', '')}
                </button>
              ))}
            </div>

            {/* Clean SVG Canvas */}
            <div
              className="nested-card"
              style={{
                height: '190px',
                backgroundColor: 'var(--card-bg-elevated, #f8fafc)',
                borderRadius: '6px',
                border: '1px solid var(--card-border, #e2e8f0)',
                position: 'relative'
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 280 160">
                {currentCluster.edges.map((edge, i) => (
                  <line
                    key={i}
                    x1={edge.from[0]}
                    y1={edge.from[1]}
                    x2={edge.to[0]}
                    y2={edge.to[1]}
                    stroke={edge.color || 'var(--card-border-strong, #cbd5e1)'}
                    strokeWidth="1.6"
                    strokeDasharray={edge.dashed ? '3 3' : 'none'}
                  />
                ))}
                {currentCluster.nodes.map((node) => (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      showToast(`Node selected: ${node.name} (${node.risk})`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} stroke="var(--card-bg, #ffffff)" strokeWidth="2" />
                    <text
                      x={node.x}
                      y={node.y + node.r + 10}
                      fill="var(--card-text, #0f172a)"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {node.name.slice(0, 14)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--card-text-muted, #64748b)',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid var(--card-border, #f1f5f9)'
            }}
          >
            <span>Tracked Entities: <strong style={{ color: 'var(--card-text, #0f172a)' }}>{currentCluster.nodesCount}</strong></span>
            <span>Threat Index: <strong style={{ color: 'var(--status-critical, #dc2626)' }}>{currentCluster.threatLevel}</strong></span>
          </div>
        </div>

        {/* Right: Live Field Activity & Telemetry Feed */}
        <div
          className="cl-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary, #1e40af)' }}>
                FORENSIC ACTIVITY FEED
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--card-text, #0f172a)', margin: '2px 0 0 0' }}>
                Live STF Telemetry & Field Intercepts
              </h3>
            </div>

            <span className="badge-verified">
              ● STREAM ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '250px' }}>
            {RECENT_ACTIVITY.map((act) => (
              <div
                key={act.id}
                className="nested-card"
                style={{
                  backgroundColor: 'var(--card-bg-elevated, #f8fafc)',
                  border: '1px solid var(--card-border, #e2e8f0)',
                  borderRadius: '6px',
                  padding: '10px 12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: act.typeColor }}>
                    {act.type}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--card-text-muted, #94a3b8)' }}>{act.time}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--card-text, #0f172a)', marginBottom: '2px' }}>
                  {act.entity}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--card-text-secondary, #475569)' }}>
                  {act.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= REGISTER CRIMINAL MODAL ================= */}
      {isAddCriminalModalOpen && (
        <AddCriminalModal
          isOpen={isAddCriminalModalOpen}
          onClose={() => setIsAddCriminalModalOpen(false)}
          onCriminalAdded={(newCrim) => {
            showToast(`✓ ${newCrim.name} registered. Opening Dossier...`);
            setIsAddCriminalModalOpen(false);
            if (onNavigate) {
              onNavigate('entities', { suspect: newCrim.name });
            }
          }}
        />
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
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
