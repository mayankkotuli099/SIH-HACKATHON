import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import AddCriminalModal from '../components/AddCriminalModal.jsx';

export default function DashboardPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [activeCluster, setActiveCluster] = useState('CLUSTER_HOMICIDE_GANG');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);
  const [isNewQueryModalOpen, setIsNewQueryModalOpen] = useState(false);
  const [isAddCriminalModalOpen, setIsAddCriminalModalOpen] = useState(false);
  const [showAllInfluencersModal, setShowAllInfluencersModal] = useState(false);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // New query state
  const [newQueryForm, setNewQueryForm] = useState({
    targetType: 'PERSON_OF_INTEREST',
    identifier: '',
    jurisdiction: 'DOMESTIC_SIGINT',
    priority: 'HIGH'
  });

  // Dynamic live metric counters
  const [metrics, setMetrics] = useState([
    {
      id: 'entities',
      title: 'TOTAL ENTITIES',
      value: 12458,
      displayValue: '12,458',
      change: '+3.4% from last week',
      icon: '🛡️',
      borderAccent: 'rgba(0, 229, 255, 0.2)',
      targetPage: 'entities'
    },
    {
      id: 'relationships',
      title: 'RELATIONSHIPS',
      value: 35789,
      displayValue: '35,789',
      change: '+8.1% from last week',
      icon: '🕸️',
      borderAccent: 'rgba(41, 121, 255, 0.2)',
      targetPage: 'network'
    },
    {
      id: 'cases',
      title: 'ACTIVE CASES',
      value: 245,
      displayValue: '245',
      change: '12 REQUIRING ATTENTION',
      icon: '📁',
      borderAccent: 'rgba(0, 230, 118, 0.2)',
      targetPage: 'cases'
    },
    {
      id: 'high-risk',
      title: 'HIGH-RISK ENTITIES',
      value: 32,
      displayValue: '32 •',
      change: '! IMMEDIATE REVIEW REQUIRED',
      icon: '⚠️',
      isWarning: true,
      borderAccent: 'rgba(255, 85, 85, 0.4)',
      targetPage: 'entities'
    }
  ]);

  // Cluster graph definitions
  const clusterData = {
    CLUSTER_HOMICIDE_GANG: {
      name: 'CLUSTER_HOMICIDE_GANG [CONTRACT KILLING & ARMS]',
      nodesCount: '1,432',
      edgesCount: '4,891',
      threatLevel: 'CRITICAL',
      threatColor: '#FF5555',
      nodes: [
        { id: 'N1', name: "MAYANK KOTOLI", type: 'LEAD_HITMAN', x: 50, y: 70, r: 15, color: '#FF5555', clearance: 'WARRANT_ISSUED', risk: '99%', status: 'ACTIVE_FUGITIVE' },
        { id: 'N2', name: "MAHESH 'TIGER' KHAN", type: 'GANG_KINGPIN', x: 130, y: 35, r: 16, color: '#00E5FF', clearance: 'MCOCA_FLAG', risk: '98%', status: 'SURVEILLED' },
        { id: 'N3', name: 'SECTOR_18_CRIME_SCENE', type: 'HOMICIDE_SCENE', x: 210, y: 70, r: 12, color: '#FF5555', clearance: 'BALLISTICS_MATCH', risk: '100%', status: 'EVIDENCE_SEALED' },
        { id: 'N4', name: 'SURESH_ARMORER_KATAS', type: 'ILLEGAL_ARMS_SUPPLIER', x: 130, y: 105, r: 13, color: '#FBBF24', clearance: 'ARMS_ACT', risk: '94%', status: 'RAID_PENDING' },
        { id: 'N5', name: 'KTM_DUKE_GETAWAY', type: 'VEHICLE_INTERCEPT', x: 90, y: 125, r: 8, color: '#00E676', clearance: 'ANPR_FLAGGED', risk: '88%', status: 'TRACED_TOLL' },
        { id: 'N6', name: 'HAWALA_PAYMENT_DROP', type: 'CONTRACT_BOUNTY', x: 170, y: 125, r: 9, color: '#A855F7', clearance: 'MONITORED', risk: '91%', status: 'CASH_SEIZED' },
      ],
      edges: [
        { from: [50, 70], to: [130, 35], color: 'rgba(255, 85, 85, 0.7)', width: 2.5, label: 'HIT CONTRACT' },
        { from: [50, 70], to: [210, 70], color: 'rgba(255, 85, 85, 0.8)', width: 2, label: '9mm CASINGS' },
        { from: [130, 35], to: [130, 105], color: 'rgba(251, 191, 36, 0.6)', width: 1.5, dashed: true },
        { from: [130, 105], to: [50, 70], color: 'rgba(251, 191, 36, 0.8)', width: 2, dashed: true },
        { from: [50, 70], to: [90, 125], color: 'rgba(0, 230, 118, 0.7)', width: 1.5 },
        { from: [130, 35], to: [170, 125], color: 'rgba(168, 85, 247, 0.6)', width: 1.5 },
      ]
    },
    CLUSTER_ROBBERY_FENCING: {
      name: 'CLUSTER_ROBBERY_FENCING [BANK HEISTS & GOLD BULLION]',
      nodesCount: '842',
      edgesCount: '2,910',
      threatLevel: 'HIGH',
      threatColor: '#FBBF24',
      nodes: [
        { id: 'FN1', name: "SAMEER 'GHOST' QURESHI", type: 'SAFE_CRACKER', x: 60, y: 50, r: 14, color: '#FBBF24', clearance: 'WARRANT_ACTIVE', risk: '93%', status: 'FUGITIVE' },
        { id: 'FN2', name: 'AXIS_BANK_VAULT_SCENE', type: 'CRIME_SCENE', x: 140, y: 40, r: 15, color: '#FF5555', clearance: 'THERMAL_BREACH', risk: '99%', status: '14KG_GOLD_STOLEN' },
        { id: 'FN3', name: 'BULLION_FENCER_CHANDNI_CHOWK', type: 'BLACK_MARKET', x: 210, y: 60, r: 12, color: '#00E676', clearance: 'RECEIVER', risk: '89%', status: 'MONITORED' },
        { id: 'FN4', name: 'GETAWAY_BOLERO_HR26', type: 'ANPR_CAMERA_HIT', x: 110, y: 110, r: 10, color: '#00E5FF', clearance: 'KMP_EXPRESSWAY', risk: '96%', status: 'INTERCEPT_UNIT' },
      ],
      edges: [
        { from: [60, 50], to: [140, 40], color: 'rgba(255, 85, 85, 0.8)', width: 2.5 },
        { from: [140, 40], to: [210, 60], color: 'rgba(251, 191, 36, 0.7)', width: 2 },
        { from: [60, 50], to: [110, 110], color: 'rgba(0, 229, 255, 0.7)', width: 2, dashed: true },
        { from: [140, 40], to: [110, 110], color: 'rgba(255, 85, 85, 0.6)', width: 1.5, dashed: true },
      ]
    },
    CLUSTER_NARCO_PIPELINE: {
      name: 'CLUSTER_NARCO_PIPELINE [HEROIN & ARMS SMUGGLING]',
      nodesCount: '620',
      edgesCount: '1,490',
      threatLevel: 'CRITICAL',
      threatColor: '#FF5555',
      nodes: [
        { id: 'DN1', name: "ELENA 'CZAR' ROSTOVA", type: 'CARTEL_BOSS', x: 70, y: 70, r: 14, color: '#FF5555', clearance: 'INTERPOL_RED', risk: '96%', status: 'ARABIAN_SEA_CARGO' },
        { id: 'DN2', name: 'PORT_TERMINAL_C_YARD', type: 'CONTAINER_INTERCEPT', x: 130, y: 40, r: 15, color: '#00E5FF', clearance: 'NCB_SEIZED', risk: '100%', status: '100KG_OPIOIDS' },
        { id: 'DN3', name: 'STEYR_TMP_FIREARMS_CRATE', type: 'MILITARY_ARMS', x: 190, y: 80, r: 12, color: '#FBBF24', clearance: 'ARMS_TRAFFICKING', risk: '98%', status: 'CUSTOMS_HOLD' },
      ],
      edges: [
        { from: [70, 70], to: [130, 40], color: 'rgba(0, 229, 255, 0.8)', width: 2.5 },
        { from: [130, 40], to: [190, 80], color: 'rgba(251, 191, 36, 0.8)', width: 2 },
      ]
    }
  };

  const topInfluencers = [
    { id: 'E1', name: "MAYANK KOTOLI", relevance: '99.4%', connections: '4,210', category: 'Homicide / Contract Hitman', risk: 'CRITICAL', riskColor: '#FF5555' },
    { id: 'E2', name: "MAHESH 'TIGER' KHAN", relevance: '98.5%', connections: '3,845', category: 'Syndicate Don / MCOCA', risk: 'CRITICAL', riskColor: '#FF5555' },
    { id: 'E3', name: "DEVENDRA 'D-7' RAWAT", relevance: '99.8%', connections: '1,120', category: 'Serial Sexual Offender', risk: 'CRITICAL', riskColor: '#FF5555' },
    { id: 'E4', name: "SAMEER 'GHOST' QURESHI", relevance: '92.4%', connections: '2,109', category: 'Armed Bank Heist Master', risk: 'HIGH', riskColor: '#FF8800' },
    { id: 'E5', name: "ELENA 'CZAR' ROSTOVA", relevance: '96.0%', connections: '1,720', category: 'Narcotics & Arms Cartel', risk: 'CRITICAL', riskColor: '#FF5555' },
  ];

  const [recentLogs, setRecentLogs] = useState([
    {
      id: 101,
      time: '2024-10-27 15:10:22',
      type: 'BALLISTICS HIT',
      typeColor: '#FF5555',
      entity: "CRIME SCENE #18 → MAYANK KOTOLI",
      severity: '▲ CRITICAL',
      severityBadge: 'CRITICAL',
      severityColor: '#FF5555',
      action: 'DISPATCH STF',
      rawPayload: 'FSL Forensic Ballistics match: 9mm cartridge casing recovered from Sector 18 double homicide fired from seized Beretta #92FS-881.',
      hash: 'sha256:4f8a91c78b66e9921c',
      location: 'Sector 18 Homicide Scene (28.5700° N, 77.3200° E)',
      interceptType: 'FORENSIC_BALLISTICS'
    },
    {
      id: 102,
      time: '2024-10-27 14:48:15',
      type: 'DNA MATCH ALERT',
      typeColor: '#FF5555',
      entity: "DEVENDRA 'D-7' RAWAT (Fugitive)",
      severity: '▲ CRITICAL',
      severityBadge: 'CRITICAL',
      severityColor: '#FF5555',
      action: 'APPREHEND',
      rawPayload: 'Automated National DNA Registry hit: 100% STR profile match with evidence kit from Sector 14 highway abduction case.',
      hash: 'sha256:b93c8472ef9104492a',
      location: 'Special SIT Forensics Lab',
      interceptType: 'DNA_FORENSICS'
    },
    {
      id: 103,
      time: '2024-10-27 14:22:40',
      type: 'ANPR TOLL HIT',
      typeColor: '#FBBF24',
      entity: 'ARMED HEIST GETAWAY (HR-26-XX-4902)',
      severity: 'HIGH',
      severityBadge: 'HIGH',
      severityColor: '#FBBF24',
      action: 'INTERCEPT',
      rawPayload: 'Automatic Number Plate Recognition camera detected suspect Bolero vehicle used in Axis Bank gold heist heading towards Meerut Expressway.',
      hash: 'sha256:71de01488ca901192b',
      location: 'KMP Expressway Toll Gate #4',
      interceptType: 'HIGHWAY_SURVEILLANCE'
    }
  ]);

  // Load live data from backend
  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api.dashboard.getOverview();
        if (data && data.success) {
          if (data.metrics) setMetrics(data.metrics);
          if (data.logs && data.logs.length > 0) setRecentLogs(data.logs);
        }
      } catch (err) {
        console.warn('Using local telemetry cache:', err);
      }
    }
    loadDashboard();
  }, []);

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Live telemetry stream simulation
  useEffect(() => {
    if (!isLiveFeedActive) return;

    const interval = setInterval(() => {
      const simulatedEvents = [
        {
          type: 'WIRE INTERCEPT',
          typeColor: '#A855F7',
          entity: 'SUSPECT_VOIP_09 → UNKNOWN_CALLER',
          severity: 'HIGH',
          severityBadge: 'HIGH',
          severityColor: '#FBBF24',
          action: 'INVESTIGATE',
          rawPayload: 'Encrypted SIP call duration 4m 12s. Voice biometric matched Rahul Sharma (94.2% confidence).',
          hash: `sha256:${Math.random().toString(16).substring(2, 12)}...`,
          location: 'Encrypted VoIP Trunk #99',
          interceptType: 'AUDIO_FORENSICS'
        },
        {
          type: 'NEW CONNECTION',
          typeColor: 'var(--cyan-glow)',
          entity: `NODE_RELAY_${Math.floor(Math.random() * 80 + 10)} → CLUSTER_ALPHA`,
          severity: 'LOW',
          severityBadge: 'LOW',
          severityColor: 'var(--text-secondary)',
          action: 'VIEW DETAILS',
          rawPayload: 'Telemetry association indexed into active investigation matrix.',
          hash: `sha256:${Math.random().toString(16).substring(2, 12)}...`,
          location: 'Cloud Gateway',
          interceptType: 'NETWORK_TELEMETRY'
        },
        {
          type: 'ANOMALY DETECTED',
          typeColor: '#FF5555',
          entity: `WALLET_TX_0x${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
          severity: '▲ CRITICAL',
          severityBadge: 'CRITICAL',
          severityColor: '#FF5555',
          action: 'INVESTIGATE',
          rawPayload: 'Flash transaction detected through decentralized cross-chain bridge.',
          hash: `sha256:${Math.random().toString(16).substring(2, 12)}...`,
          location: 'Polygon Bridge',
          interceptType: 'CRYPTO_FLOW'
        }
      ];

      const chosen = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newLog = {
        id: Date.now(),
        time: timeStr,
        ...chosen
      };

      setRecentLogs((prev) => [newLog, ...prev.slice(0, 19)]);

      // Increment entity or relationship metrics slightly for live feel
      setMetrics((prevMetrics) =>
        prevMetrics.map((m) => {
          if (m.id === 'entities') {
            const nextVal = m.value + 1;
            return { ...m, value: nextVal, displayValue: nextVal.toLocaleString() };
          }
          if (m.id === 'relationships') {
            const nextVal = m.value + 3;
            return { ...m, value: nextVal, displayValue: nextVal.toLocaleString() };
          }
          return m;
        })
      );
    }, 9000);

    return () => clearInterval(interval);
  }, [isLiveFeedActive]);

  // Filter logs by search query and severity
  const filteredLogs = recentLogs.filter((log) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.rawPayload.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' ||
      log.severityBadge.toUpperCase().includes(severityFilter.toUpperCase());

    return matchesSearch && matchesSeverity;
  });

  // Handle Export Report
  const handleExportData = () => {
    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      classification: 'CRIMELENS LEVEL 4 INTELLIGENCE DOSSIER',
      activeCluster: activeCluster,
      metricsSummary: metrics,
      topInfluencers: topInfluencers,
      telemetryLogsCount: filteredLogs.length,
      telemetryLogs: filteredLogs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CrimeLens_Investigation_Export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('✓ Investigation dossier exported successfully as JSON');
  };

  // Handle Submit New Query
  const handleCreateNewQuery = async (e) => {
    e.preventDefault();
    if (!newQueryForm.identifier.trim()) {
      showToast('⚠️ Target identifier cannot be empty');
      return;
    }

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newQueryLog = {
      id: Date.now(),
      time: timeStr,
      type: 'MANUAL QUERY',
      typeColor: 'var(--cyan-glow)',
      entity: `TARGET: ${newQueryForm.identifier.toUpperCase()} [${newQueryForm.targetType}]`,
      severity: newQueryForm.priority === 'CRITICAL' ? '▲ CRITICAL' : newQueryForm.priority,
      severityBadge: newQueryForm.priority,
      severityColor: newQueryForm.priority === 'CRITICAL' ? '#FF5555' : 'var(--cyan-glow)',
      action: 'VIEW DETAILS',
      rawPayload: `Operator dispatched search on jurisdiction: ${newQueryForm.jurisdiction}. Neural indexing initialized.`,
      hash: `sha256:${Math.random().toString(16).substring(2, 12)}...`,
      location: 'Direct Operator Terminal',
      interceptType: 'OPERATOR_DISPATCH'
    };

    setRecentLogs((prev) => [newQueryLog, ...prev]);
    setIsNewQueryModalOpen(false);

    // Also persist query to backend
    try {
      await api.dashboard.dispatchQuery(newQueryForm);
    } catch (err) {
      console.warn('Persisted locally.');
    }

    setNewQueryForm({
      targetType: 'PERSON_OF_INTEREST',
      identifier: '',
      jurisdiction: 'DOMESTIC_SIGINT',
      priority: 'HIGH'
    });

    showToast(`✓ Query initialized for target: ${newQueryForm.identifier}`);
  };

  const currentCluster = clusterData[activeCluster] || clusterData.CLUSTER_ALPHA_9;

  return (
    <div style={{
      flex: 1,
      padding: '2rem 2.5rem 3rem 2.5rem',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
      position: 'relative'
    }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'rgba(7, 18, 30, 0.95)',
          border: '1px solid var(--cyan-glow)',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
          borderRadius: '6px',
          padding: '12px 20px',
          color: '#FFFFFF',
          fontFamily: 'var(--font-mono)',
          fontSize: '12.5px',
          fontWeight: 600,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <span style={{ color: 'var(--cyan-glow)' }}>⚡</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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

            {/* Live Telemetry Toggle */}
            <button
              onClick={() => {
                setIsLiveFeedActive(!isLiveFeedActive);
                showToast(isLiveFeedActive ? 'Live Telemetry Paused' : 'Live Telemetry Resumed');
              }}
              style={{
                background: isLiveFeedActive ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 85, 85, 0.12)',
                border: `1px solid ${isLiveFeedActive ? '#00E676' : '#FF5555'}`,
                color: isLiveFeedActive ? '#00E676' : '#FF6B6B',
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                fontWeight: 700,
                borderRadius: '4px',
                padding: '3px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{isLiveFeedActive ? '🟢 LIVE STREAM ON' : '⏸ STREAM PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Global Search & Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Quick Search Bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <input
              type="text"
              placeholder="Search Target, IP, Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(11, 15, 23, 0.9)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '4px',
                padding: '7px 28px 7px 10px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                outline: 'none'
              }}
            />
            {searchQuery ? (
              <span
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '7px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕
              </span>
            ) : (
              <span style={{ position: 'absolute', right: '8px', top: '7px', color: 'var(--cyan-glow)', fontSize: '11px' }}>
                🔍
              </span>
            )}
          </div>

          <button
            onClick={handleExportData}
            className="btn-outline-cyan"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', padding: '7px 14px' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            EXPORT DOSSIER
          </button>

          <button
            onClick={() => setIsAddCriminalModalOpen(true)}
            style={{
              backgroundColor: '#00E5FF',
              color: '#07090E',
              border: 'none',
              borderRadius: '4px',
              padding: '7px 16px',
              fontSize: '11.5px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono, monospace)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
            }}
          >
            <span>🚨</span>
            <span>+ ADD CRIMINAL</span>
          </button>

          <button
            onClick={() => setIsNewQueryModalOpen(true)}
            className="btn-cyan"
            style={{ fontSize: '11.5px', padding: '7px 16px' }}
          >
            + TARGET DISPATCH
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards (Clickable to navigate / drill down) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((m) => (
          <div
            key={m.id}
            onClick={() => onNavigate && onNavigate(m.targetPage)}
            className="glass-card"
            style={{
              padding: '1.25rem 1.5rem',
              border: m.isWarning ? '1.5px solid rgba(255, 85, 85, 0.4)' : `1px solid ${m.borderAccent}`,
              backgroundColor: m.isWarning ? 'rgba(30, 15, 20, 0.8)' : 'rgba(16, 22, 34, 0.8)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = m.isWarning ? '0 6px 20px rgba(255, 85, 85, 0.2)' : '0 6px 20px rgba(0, 229, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title={`Click to explore ${m.title}`}
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
              <span style={{ fontSize: '15px', color: m.isWarning ? '#FF6B6B' : 'var(--cyan-glow)' }}>
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
              {m.displayValue}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: m.isWarning ? '#FF8888' : 'var(--cyan-glow)'
            }}>
              <span>{m.change}</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>OPEN →</span>
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
        {/* Center: Interactive Network Topology Map Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '8px'
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
              <span>🕸️</span> INTERACTIVE TOPOLOGY MAP
            </div>

            {/* Cluster Selector Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {Object.keys(clusterData).map((cKey) => (
                <button
                  key={cKey}
                  onClick={() => {
                    setActiveCluster(cKey);
                    setSelectedNode(null);
                  }}
                  style={{
                    background: activeCluster === cKey ? 'rgba(0,229,255,0.2)' : 'rgba(0,229,255,0.05)',
                    border: activeCluster === cKey ? '1px solid var(--cyan-glow)' : '1px solid rgba(0,229,255,0.2)',
                    color: activeCluster === cKey ? 'var(--cyan-glow)' : 'var(--text-muted)',
                    borderRadius: '3px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cKey === 'CLUSTER_ALPHA_9' && 'ALPHA CORE'}
                  {cKey === 'CLUSTER_FINANCIAL_NEXUS' && 'FINANCIAL'}
                  {cKey === 'CLUSTER_DARKNET_RELAY' && 'DARKNET'}
                </button>
              ))}
              <button
                onClick={() => onNavigate && onNavigate('network')}
                title="Open Full Screen Graph"
                style={{
                  background: 'rgba(0,229,255,0.1)',
                  border: '1px solid rgba(0,229,255,0.3)',
                  color: 'var(--cyan-glow)',
                  borderRadius: '3px',
                  padding: '3px 7px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                FULL GRAPH ↗
              </button>
            </div>
          </div>

          {/* Holographic Visualizer Area */}
          <div style={{
            flex: 1,
            minHeight: '290px',
            backgroundColor: 'rgba(5, 8, 14, 0.95)',
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
              backgroundImage: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.12) 0%, rgba(41, 121, 255, 0.04) 50%, transparent 80%)',
              pointerEvents: 'none'
            }} />

            {/* Sub-header inside Map */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  ACTIVE CLUSTER VIEW
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--cyan-glow)', fontWeight: 700 }}>
                  {currentCluster.name}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  NODES: {currentCluster.nodesCount} | EDGES: {currentCluster.edgesCount}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: currentCluster.threatColor,
                  backgroundColor: `${currentCluster.threatColor}18`,
                  border: `1px solid ${currentCluster.threatColor}66`,
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}>
                  THREAT: {currentCluster.threatLevel}
                </span>
              </div>
            </div>

            {/* Interactive Graph Simulation (Clickable SVG Nodes) */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '170px'
            }}>
              <svg width="270" height="160" viewBox="0 0 270 160" fill="none" style={{ overflow: 'visible' }}>
                {/* Edges */}
                {currentCluster.edges.map((edge, eIdx) => (
                  <line
                    key={eIdx}
                    x1={edge.from[0]}
                    y1={edge.from[1]}
                    x2={edge.to[0]}
                    y2={edge.to[1]}
                    stroke={edge.color}
                    strokeWidth={edge.width}
                    strokeDasharray={edge.dashed ? '3 3' : 'none'}
                  />
                ))}

                {/* Nodes */}
                {currentCluster.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Halo ring if selected */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.r + 6}
                          fill="none"
                          stroke="var(--cyan-glow)"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r}
                        fill="#070A0F"
                        stroke={node.color}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r * 0.4}
                        fill={node.color}
                      />
                      <text
                        x={node.x}
                        y={node.y + node.r + 10}
                        textAnchor="middle"
                        fill={isSelected ? '#FFFFFF' : 'var(--text-secondary)'}
                        fontSize="8.5"
                        fontFamily="var(--font-mono)"
                        fontWeight={isSelected ? 700 : 500}
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Node Details Drawer or Default Helper */}
            {selectedNode ? (
              <div style={{
                position: 'relative',
                zIndex: 2,
                backgroundColor: 'rgba(11, 16, 26, 0.95)',
                border: '1px solid var(--cyan-glow)',
                borderRadius: '4px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                animation: 'fadeIn 0.15s ease'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>
                    {selectedNode.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--cyan-glow)' }}>
                    TYPE: {selectedNode.type} | RISK: {selectedNode.risk} | STATUS: {selectedNode.status}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onNavigate && onNavigate('entities')}
                    className="btn-cyan"
                    style={{ fontSize: '9.5px', padding: '3px 8px' }}
                  >
                    VIEW 360 DOSSIER
                  </button>
                  <button
                    onClick={() => setSelectedNode(null)}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'var(--text-muted)',
                      borderRadius: '3px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  💡 Click on any node above to inspect entity connections & metadata
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
            )}
          </div>
        </div>

        {/* Right Side: Risk Distribution + Top Influencers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Interactive Risk Distribution Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '1px',
              marginBottom: '0.75rem'
            }}>
              <span>📊 RISK DISTRIBUTION MATRIX</span>
              {severityFilter !== 'ALL' && (
                <button
                  onClick={() => setSeverityFilter('ALL')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan-glow)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9.5px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  RESET FILTER
                </button>
              )}
            </div>

            <div style={{ display: 'flex', height: '14px', borderRadius: '3px', overflow: 'hidden', gap: '2px', marginBottom: '8px' }}>
              <div
                onClick={() => setSeverityFilter('LOW')}
                style={{ flex: 4, backgroundColor: 'var(--cyan-glow)', cursor: 'pointer', opacity: severityFilter === 'ALL' || severityFilter === 'LOW' ? 1 : 0.35 }}
                title="Filter Low Severity"
              />
              <div
                onClick={() => setSeverityFilter('MEDIUM')}
                style={{ flex: 3, backgroundColor: 'var(--accent-blue)', cursor: 'pointer', opacity: severityFilter === 'ALL' || severityFilter === 'MEDIUM' ? 1 : 0.35 }}
                title="Filter Medium Severity"
              />
              <div
                onClick={() => setSeverityFilter('HIGH')}
                style={{ flex: 2, backgroundColor: '#FBBF24', cursor: 'pointer', opacity: severityFilter === 'ALL' || severityFilter === 'HIGH' ? 1 : 0.35 }}
                title="Filter High Severity"
              />
              <div
                onClick={() => setSeverityFilter('CRITICAL')}
                style={{ flex: 1, backgroundColor: '#FF5555', cursor: 'pointer', opacity: severityFilter === 'ALL' || severityFilter === 'CRITICAL' ? 1 : 0.35 }}
                title="Filter Critical Severity"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              <span onClick={() => setSeverityFilter('LOW')} style={{ cursor: 'pointer', color: severityFilter === 'LOW' ? 'var(--cyan-glow)' : 'inherit', fontWeight: severityFilter === 'LOW' ? 700 : 400 }}>LOW (40%)</span>
              <span onClick={() => setSeverityFilter('MEDIUM')} style={{ cursor: 'pointer', color: severityFilter === 'MEDIUM' ? 'var(--accent-blue)' : 'inherit', fontWeight: severityFilter === 'MEDIUM' ? 700 : 400 }}>MED (30%)</span>
              <span onClick={() => setSeverityFilter('HIGH')} style={{ cursor: 'pointer', color: severityFilter === 'HIGH' ? '#FBBF24' : 'inherit', fontWeight: severityFilter === 'HIGH' ? 700 : 400 }}>HIGH (20%)</span>
              <span onClick={() => setSeverityFilter('CRITICAL')} style={{ cursor: 'pointer', color: '#FF5555', fontWeight: 700 }}>CRIT (10%)</span>
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
              <span>🕸️ TOP INFLUENCERS</span>
              <span
                onClick={() => setShowAllInfluencersModal(true)}
                style={{ color: 'var(--cyan-glow)', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
              >
                VIEW ALL ({topInfluencers.length}) →
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topInfluencers.slice(0, 3).map((inf) => (
                <div
                  key={inf.id}
                  onClick={() => {
                    setSearchQuery(inf.name);
                    showToast(`Filtering activity logs by ${inf.name}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: 'rgba(0, 229, 255, 0.04)',
                    border: '1px solid rgba(0, 229, 255, 0.12)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'var(--cyan-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.12)';
                  }}
                  title="Click to filter logs by this influencer"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--cyan-glow)' }}>
                      {inf.id}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E2E8F0', fontWeight: 600 }}>
                        {inf.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
                        {inf.category}
                      </div>
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

      {/* Bottom Section: Recent Activity Log Table with Live Filter & Actions */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '10px'
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
            <span>📑</span> RECENT ACTIVITY LOG ({filteredLogs.length})
          </div>

          {/* Severity & Action Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>FILTER:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  background: severityFilter === sev ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: severityFilter === sev ? '1px solid var(--cyan-glow)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: severityFilter === sev ? 'var(--cyan-glow)' : 'var(--text-secondary)',
                  borderRadius: '3px',
                  padding: '3px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {sev}
              </button>
            ))}
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
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>LOCATION / VECTOR</th>
                <th style={{ padding: '8px 12px', fontWeight: 600 }}>SEVERITY</th>
                <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    No telemetry records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {log.time}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(0, 229, 255, 0.08)',
                        border: `1px solid ${log.typeColor || 'var(--cyan-glow)'}`,
                        color: log.typeColor || 'var(--cyan-glow)',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#FFFFFF', fontWeight: 600 }}>
                      {log.entity}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                      {log.location}
                    </td>
                    <td style={{ padding: '10px 12px', color: log.severityColor, fontWeight: 700, fontSize: '11px' }}>
                      {log.severity}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => setSelectedLogDetail(log)}
                        style={{
                          background: 'rgba(0, 229, 255, 0.08)',
                          border: '1px solid rgba(0, 229, 255, 0.25)',
                          borderRadius: '3px',
                          color: 'var(--cyan-glow)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--cyan-glow)';
                          e.currentTarget.style.color = '#07090E';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.08)';
                          e.currentTarget.style.color = 'var(--cyan-glow)';
                        }}
                      >
                        {log.action}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Target / Event Log Inspector Modal */}
      {selectedLogDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(4, 7, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#090D15',
            border: '1px solid var(--cyan-glow)',
            boxShadow: '0 0 35px rgba(0, 229, 255, 0.25)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--cyan-glow)', letterSpacing: '1px' }}>
                  // EVIDENCE TELEMETRY PACKET #{selectedLogDetail.id}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  {selectedLogDetail.entity}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.04)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EVENT TYPE:</span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: selectedLogDetail.typeColor, fontFamily: 'var(--font-mono)' }}>
                  {selectedLogDetail.type}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.04)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SEVERITY CLEARANCE:</span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: selectedLogDetail.severityColor, fontFamily: 'var(--font-mono)' }}>
                  {selectedLogDetail.severity}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.04)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LOCATION / NODE:</span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                  {selectedLogDetail.location}
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.04)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIMESTAMP (UTC):</span>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                  {selectedLogDetail.time}
                </div>
              </div>
            </div>

            {/* Raw Payload Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan-glow)', marginBottom: '6px' }}>
                RAW INTERCEPT PAYLOAD:
              </div>
              <div style={{
                backgroundColor: '#05070B',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '4px',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#E2E8F0',
                lineHeight: 1.5
              }}>
                {selectedLogDetail.rawPayload}
              </div>
              <div style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                DIGITAL HASH: {selectedLogDetail.hash}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedLogDetail(null);
                  onNavigate && onNavigate('timeline');
                }}
                className="btn-outline-cyan"
                style={{ fontSize: '11px', padding: '8px 14px' }}
              >
                TRACE IN TIMELINE
              </button>
              <button
                onClick={() => {
                  setSelectedLogDetail(null);
                  onNavigate && onNavigate('entities');
                }}
                className="btn-cyan"
                style={{ fontSize: '11px', padding: '8px 16px' }}
              >
                OPEN ENTITY 360 DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: "+ NEW QUERY" Target Dispatch Modal */}
      {isNewQueryModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(4, 7, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#090D15',
            border: '1px solid var(--cyan-glow)',
            boxShadow: '0 0 35px rgba(0, 229, 255, 0.25)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--cyan-glow)' }}>
                  // NEURAL DISPATCH ENGINE
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  Initialize Target Investigation Query
                </h3>
              </div>
              <button
                onClick={() => setIsNewQueryModalOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewQuery} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  TARGET IDENTIFIER (SUSPECT NAME, FIR #, WEAPON, VEHICLE, PHONE):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mayank Kotoli, FIR-2024-402, 9mm Beretta, HR-26-XX-4902..."
                  value={newQueryForm.identifier}
                  onChange={(e) => setNewQueryForm({ ...newQueryForm, identifier: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(5, 8, 14, 0.95)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    CRIME CLASSIFICATION:
                  </label>
                  <select
                    value={newQueryForm.targetType}
                    onChange={(e) => setNewQueryForm({ ...newQueryForm, targetType: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(5, 8, 14, 0.95)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '4px',
                      padding: '8px 10px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="HOMICIDE_MURDER">Homicide & Contract Murder (Sec 302/103)</option>
                    <option value="SEXUAL_OFFENSE">Sexual Assault & Serial Rape (Sec 376D/64)</option>
                    <option value="ARMED_ROBBERY">Armed Bank Robbery & Heist (Sec 392)</option>
                    <option value="NARCOTICS_ARMS">Narcotics Cartel & Arms Smuggling (NDPS)</option>
                    <option value="KIDNAPPING_EXTORTION">Kidnapping & Extortion Syndicate (MCOCA)</option>
                    <option value="CYBER_FINANCIAL">Cyber Syndicate & Hawala Laundering</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    SURVEILLANCE PRIORITY:
                  </label>
                  <select
                    value={newQueryForm.priority}
                    onChange={(e) => setNewQueryForm({ ...newQueryForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(5, 8, 14, 0.95)',
                      border: '1px solid rgba(0, 229, 255, 0.3)',
                      borderRadius: '4px',
                      padding: '8px 10px',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    <option value="CRITICAL">▲ CRITICAL (Red Corner Alert)</option>
                    <option value="HIGH">HIGH (Non-Bailable Warrant)</option>
                    <option value="MEDIUM">MEDIUM (Active SIT Case)</option>
                    <option value="LOW">LOW (Intelligence Surveillance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  INVESTIGATIVE JURISDICTION / BRANCH:
                </label>
                <select
                  value={newQueryForm.jurisdiction}
                  onChange={(e) => setNewQueryForm({ ...newQueryForm, jurisdiction: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(5, 8, 14, 0.95)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  <option value="SPECIAL_CELL_HOMICIDE">Special Crime Branch (Homicide & STF)</option>
                  <option value="WOMEN_SAFETY_SIT">Special SIT (Women & Child Safety / Rape)</option>
                  <option value="ANTI_ROBBERY_SQUAD">Anti-Robbery & Dacoity Squad</option>
                  <option value="NARCOTICS_CONTROL_BUREAU">Narcotics Control Bureau (NCB)</option>
                  <option value="ORGANIZED_CRIME_DIVISION">Organized Crime & MCOCA Division</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewQueryModalOpen(false)}
                  className="btn-outline-cyan"
                  style={{ fontSize: '11.5px', padding: '8px 14px' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-cyan"
                  style={{ fontSize: '11.5px', padding: '8px 18px' }}
                >
                  🚀 DISPATCH QUERY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: View All Top Influencers Modal */}
      {showAllInfluencersModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(4, 7, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#090D15',
            border: '1px solid var(--cyan-glow)',
            boxShadow: '0 0 35px rgba(0, 229, 255, 0.25)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--cyan-glow)' }}>
                  // SYNDICATE TOPOLOGY HIERARCHY
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  Ranked Centrality & Top Influencers
                </h3>
              </div>
              <button
                onClick={() => setShowAllInfluencersModal(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'var(--text-muted)',
                  borderRadius: '4px',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
              {topInfluencers.map((inf) => (
                <div
                  key={inf.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(0, 229, 255, 0.04)',
                    border: '1px solid rgba(0, 229, 255, 0.12)',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--cyan-glow)' }}>
                      {inf.id}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>
                        {inf.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {inf.category} | {inf.connections} active connections
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      color: inf.riskColor,
                      backgroundColor: `${inf.riskColor}18`,
                      border: `1px solid ${inf.riskColor}55`,
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      {inf.risk}
                    </span>
                    <button
                      onClick={() => {
                        setShowAllInfluencersModal(false);
                        setSearchQuery(inf.name);
                      }}
                      className="btn-cyan"
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      TRACE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Indian Police Criminal Intake Modal */}
      <AddCriminalModal
        isOpen={isAddCriminalModalOpen}
        onClose={() => setIsAddCriminalModalOpen(false)}
        onCriminalAdded={(newCrim) => {
          showToast(`✓ Offender ${newCrim.name} (${newCrim.id}) registered in Police CCTNS database.`);
          if (onNavigate) onNavigate('entities');
        }}
      />
    </div>
  );
}
