import React, { useState, useEffect, useMemo } from 'react';
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
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // AI Suspect Prediction State
  const [predictionInput, setPredictionInput] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('HOMICIDE_9MM');

  // Predefined AI Suspect Prediction Scenarios & Neural Matching Knowledge Base
  const PREDICTION_SCENARIOS = {
    HOMICIDE_9MM: {
      id: 'HOMICIDE_9MM',
      title: '🎯 Contract Homicide / 9mm Ambush',
      crimeType: 'Contract Assassination (BNS 103)',
      location: 'Sector 18 Market, Gurugram',
      weapon: '9mm Beretta 92FS / Double-Tap MO',
      vehicle: 'Unregistered KTM Duke 390 (Orange/Black)',
      predictedSuspects: [
        {
          name: 'MAYANK KOTOLI',
          id: 'CRM-9942',
          alias: 'The Trigger / MK-99',
          probability: 99.4,
          risk: 'CRITICAL',
          confidence: 'Forensic Ballistics Match (99.4%)',
          role: 'Lead Contract Hitman',
          modusOperandi: 'Ambush contract killings on rival gang leaders using point-blank double-tap; getaway via unregistered KTM Duke bikes.',
          evidence: 'Spent 9mm casings matched FSL forensic firing pin impressions; cell tower pinged Kherki Daula toll 14 mins post-incident.',
          status: 'ACTIVE FUGITIVE'
        },
        {
          name: "MAHESH 'TIGER' KHAN",
          id: 'CRM-0014',
          alias: 'Tiger / Bada Don',
          probability: 88.5,
          risk: 'CRITICAL',
          confidence: 'Syndicate Command Link',
          role: 'Contract Benefactor / Client',
          modusOperandi: 'Finances contract hits through ₹50L Hawala escrow via Chandni Chowk bullion operators.',
          evidence: 'Intercepted wiretap recorded murder sanction call 48 hrs prior.',
          status: 'MCOCA SURVEILLED'
        },
        {
          name: "SURESH 'CHHOTA' GOLI",
          id: 'CRM-4494',
          alias: 'The Armorer',
          probability: 78.0,
          risk: 'HIGH',
          confidence: 'Weapon Supply Vector',
          role: 'Firearms Supplier',
          modusOperandi: 'Distributes wiped-serial Berettas and hollow-point ammo across NCR.',
          evidence: 'Arms courier caught with matching 9mm batch crates.',
          status: 'RAID PENDING'
        }
      ]
    },
    EXTORTION_MCOCA: {
      id: 'EXTORTION_MCOCA',
      title: '💼 Builder Syndicate Extortion & Threats',
      crimeType: 'Organized Extortion & MCOCA Syndicate',
      location: 'Cyber City DLF Phase 2, Gurugram',
      weapon: 'AK-47 Threats / VoIP Encrypted Relay',
      vehicle: 'Black Fortuner HR26 Proxy Plated',
      predictedSuspects: [
        {
          name: "MAHESH 'TIGER' KHAN",
          id: 'CRM-0014',
          alias: 'Tiger / Bada Don',
          probability: 98.5,
          risk: 'CRITICAL',
          confidence: 'Voice Biometric Match (99.1%)',
          role: 'Syndicate Apex Commander',
          modusOperandi: 'Extortion rackets targeting infrastructure developers with multi-million rupee ransom demands via VoIP.',
          evidence: 'Voiceprint matched Dubai satellite relay intercept demanding ₹50 Lakhs ransom from builder.',
          status: 'WARRANT ISSUED'
        },
        {
          name: 'SAMEER ALI',
          id: 'CRM-1092',
          alias: 'Hawala Banker',
          probability: 84.0,
          risk: 'HIGH',
          confidence: 'Hawala Ledger Intercept',
          role: 'Financial Conduit',
          modusOperandi: 'Routes syndicate extortion deposits through multi-tiered shell accounts in Hong Kong & Dubai.',
          evidence: 'Benami UPI accounts frozen holding ₹35 Lakhs split transfers.',
          status: 'MONITORED'
        }
      ]
    },
    VAULT_BREACH: {
      id: 'VAULT_BREACH',
      title: '🏦 Bank Vault Heist / Thermal Lance',
      crimeType: 'Commercial Bank Vault Breach (BNS 310)',
      location: 'Axis Bank Commercial Hub, Noida',
      weapon: 'Thermal Lance & High-Power RF Signal Jammer',
      vehicle: 'Bolero Camper with Strobe Jammers',
      predictedSuspects: [
        {
          name: "SAMEER 'GHOST' QURESHI",
          id: 'CRM-8821',
          alias: 'Ghost / The Drill',
          probability: 96.8,
          risk: 'HIGH',
          confidence: 'Physical Toolmark & DNA Match',
          role: 'Master Safe Cracker',
          modusOperandi: 'High-precision vault breaching, laser sensor neutralization, and electronic RF jamming.',
          evidence: 'Glove residue DNA recovered on vault keypad; RF frequency matched seized signal jammer.',
          status: 'ACTIVE TRACKING'
        },
        {
          name: "MAHESH 'TIGER' KHAN",
          id: 'CRM-0014',
          alias: 'Tiger / Fencer',
          probability: 79.5,
          risk: 'CRITICAL',
          confidence: 'Bullion Fencing Nexus',
          role: 'Stolen Gold Receiver',
          modusOperandi: 'Purchases stolen bullion at 40% discount for melting in Chandni Chowk underground kilns.',
          evidence: 'Black market melting ledger cross-referenced with 14kg stolen gold bars.',
          status: 'SURVEILLED'
        }
      ]
    },
    PREDATOR_HIGHWAY: {
      id: 'PREDATOR_HIGHWAY',
      title: '🚗 Ring Road Transit Assault & Fake Taxi',
      crimeType: 'Serial Sexual Offense & Aggravated Assault',
      location: 'Mehrauli-Gurugram Transit Corridor',
      weapon: 'Hunting Knife & Chloroform Spray',
      vehicle: 'White Sedan with Disabled Inside Locks & Counterfeit Plates',
      predictedSuspects: [
        {
          name: "DEVENDRA 'D-7' RAWAT",
          id: 'CRM-7721',
          alias: 'D-7 / Highway Predator',
          probability: 99.8,
          risk: 'CRITICAL',
          confidence: '100% STR DNA Profile Match',
          role: 'Serial Offender',
          modusOperandi: 'Stalks commuters near dark transit hubs using cabs fitted with inside door-locks removed.',
          evidence: '100% STR DNA match confirmed across 3 crime scene forensics kits (FSL #FK-8821).',
          status: 'ACTIVE FUGITIVE'
        },
        {
          name: "RAJU 'MECHANIC' VERMA",
          id: 'CRM-3310',
          alias: 'The Plate Maker',
          probability: 82.0,
          risk: 'HIGH',
          confidence: 'Counterfeit Stamping Press Match',
          role: 'Fake Number Plate Fabricator',
          modusOperandi: 'Stamps forged commercial license plates for predatory vehicles.',
          evidence: 'Seized hydraulic press with matching font dye in Sector 14 workshop raid.',
          status: 'DETAINED'
        }
      ]
    },
    NARCO_MARITIME: {
      id: 'NARCO_MARITIME',
      title: '🚢 Port Container Synthetic Opioids & Arms',
      crimeType: 'NDPS Act & Military Arms Smuggling',
      location: 'Port Terminal C / ICD Dadri Yard',
      weapon: 'Steyr TMP 9mm Military SMGs',
      vehicle: 'Maritime Container #CT-991',
      predictedSuspects: [
        {
          name: "ELENA 'CZAR' ROSTOVA",
          id: 'CRM-5512',
          alias: 'The Chemist / Czarina',
          probability: 96.0,
          risk: 'CRITICAL',
          confidence: 'Interpol Red Notice Fingerprint Match',
          role: 'International Cartel Director',
          modusOperandi: 'Maritime container smuggling of synthetic opioids and military carbines across Northern India.',
          evidence: 'Fingerprint match on Port Terminal C container seal; $4.2M wire trail flagged in HSBC HK.',
          status: 'MARITIME SURVEILLANCE'
        }
      ]
    }
  };

  // Compute active predicted suspects based on selected scenario or custom query
  const activePrediction = useMemo(() => {
    if (predictionInput.trim()) {
      const q = predictionInput.toLowerCase();
      // Match keywords in custom input
      if (q.includes('shoot') || q.includes('kill') || q.includes('9mm') || q.includes('beretta') || q.includes('kotoli') || q.includes('homicide')) {
        return PREDICTION_SCENARIOS.HOMICIDE_9MM;
      }
      if (q.includes('extort') || q.includes('threat') || q.includes('ransom') || q.includes('tiger') || q.includes('khan') || q.includes('don')) {
        return PREDICTION_SCENARIOS.EXTORTION_MCOCA;
      }
      if (q.includes('bank') || q.includes('vault') || q.includes('gold') || q.includes('heist') || q.includes('lance') || q.includes('qureshi')) {
        return PREDICTION_SCENARIOS.VAULT_BREACH;
      }
      if (q.includes('rape') || q.includes('assault') || q.includes('taxi') || q.includes('predator') || q.includes('rawat') || q.includes('d-7')) {
        return PREDICTION_SCENARIOS.PREDATOR_HIGHWAY;
      }
      if (q.includes('drug') || q.includes('narco') || q.includes('opioid') || q.includes('elena') || q.includes('rostova') || q.includes('port')) {
        return PREDICTION_SCENARIOS.NARCO_MARITIME;
      }
      // Dynamic fallback based on input
      return {
        id: 'CUSTOM_QUERY',
        title: `🔍 Custom Incident Query: "${predictionInput.slice(0, 30)}..."`,
        crimeType: 'Correlated Investigation Vector',
        location: 'NCR Inter-State Jurisdiction',
        weapon: 'Correlated Modus Operandi',
        vehicle: 'Under Surveillance Vector',
        predictedSuspects: [
          {
            name: 'MAYANK KOTOLI',
            id: 'CRM-9942',
            alias: 'The Trigger',
            probability: 94.2,
            risk: 'CRITICAL',
            confidence: 'Neural Modus Operandi Match (94.2%)',
            role: 'Primary Violent Offender',
            modusOperandi: 'Contract assassinations & armed syndicate strikes.',
            evidence: 'Correlated crime signature matches active fugitive profile.',
            status: 'ACTIVE FUGITIVE'
          },
          {
            name: "MAHESH 'TIGER' KHAN",
            id: 'CRM-0014',
            alias: 'Tiger Don',
            probability: 89.0,
            risk: 'CRITICAL',
            confidence: 'Syndicate Network Correlation',
            role: 'Command Mastermind',
            modusOperandi: 'Extortion and armed logistics nexus.',
            evidence: 'Inter-state telecommunication metadata correlation.',
            status: 'MCOCA FLAG'
          }
        ]
      };
    }
    return PREDICTION_SCENARIOS[selectedScenario] || PREDICTION_SCENARIOS.HOMICIDE_9MM;
  }, [predictionInput, selectedScenario]);

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Top KPI Metrics
  const [metrics, setMetrics] = useState([
    {
      id: 'entities',
      title: 'TOTAL ENTITIES',
      value: 12458,
      displayValue: '12,458',
      change: '+3.4% this week',
      icon: '🛡️',
      color: '#00E5FF',
      targetPage: 'entities'
    },
    {
      id: 'relationships',
      title: 'NETWORK EDGES',
      value: 35789,
      displayValue: '35,789',
      change: 'Active Gang Vectors',
      icon: '🕸️',
      color: '#A855F7',
      targetPage: 'network'
    },
    {
      id: 'cases',
      title: 'ACTIVE CASES',
      value: 245,
      displayValue: '245',
      change: '12 Require Attention',
      icon: '📁',
      color: '#00E676',
      targetPage: 'cases'
    },
    {
      id: 'high-risk',
      title: 'HIGH-RISK TARGETS',
      value: 32,
      displayValue: '32 ⚠️',
      change: 'Immediate STF Alert',
      icon: '🚨',
      color: '#FF5555',
      isWarning: true,
      targetPage: 'entities'
    }
  ]);

  // Cluster graph definitions
  const clusterData = {
    CLUSTER_HOMICIDE_GANG: {
      name: 'HOMICIDE & CONTRACT KILLING SYNDICATE',
      nodesCount: '1,432',
      edgesCount: '4,891',
      threatLevel: 'CRITICAL',
      threatColor: '#FF5555',
      nodes: [
        { id: 'N1', name: "MAYANK KOTOLI", type: 'LEAD_HITMAN', x: 60, y: 70, r: 14, color: '#FF5555', risk: '99.4%', status: 'FUGITIVE' },
        { id: 'N2', name: "MAHESH 'TIGER' KHAN", type: 'GANG_KINGPIN', x: 140, y: 35, r: 15, color: '#00E5FF', risk: '98.5%', status: 'MCOCA' },
        { id: 'N3', name: 'SECTOR-18 CRIME SCENE', type: 'HOMICIDE_SCENE', x: 210, y: 70, r: 11, color: '#FF5555', risk: '100%', status: 'SEALED' },
        { id: 'N4', name: 'SURESH ARMORER KATAS', type: 'ARMS_SUPPLIER', x: 140, y: 110, r: 12, color: '#FBBF24', risk: '94.0%', status: 'RAID' },
        { id: 'N5', name: 'KTM DUKE GETAWAY', type: 'VEHICLE', x: 80, y: 130, r: 9, color: '#00E676', risk: '88.2%', status: 'ANPR HIT' },
        { id: 'N6', name: 'HAWALA DROP ₹35L', type: 'FINANCIAL', x: 190, y: 130, r: 10, color: '#A855F7', risk: '91.5%', status: 'FROZEN' },
      ],
      edges: [
        { from: [60, 70], to: [140, 35], color: '#FF5555', width: 2.2, label: 'HIT CONTRACT' },
        { from: [60, 70], to: [210, 70], color: '#FF5555', width: 2, label: '9mm CASINGS' },
        { from: [140, 35], to: [140, 110], color: '#FBBF24', width: 1.5, dashed: true },
        { from: [140, 110], to: [60, 70], color: '#FBBF24', width: 1.8, dashed: true },
        { from: [60, 70], to: [80, 130], color: '#00E676', width: 1.5 },
        { from: [140, 35], to: [190, 130], color: '#A855F7', width: 1.5 },
      ]
    },
    CLUSTER_ROBBERY_FENCING: {
      name: 'ARMED BANK HEISTS & GOLD BULLION',
      nodesCount: '842',
      edgesCount: '2,910',
      threatLevel: 'HIGH',
      threatColor: '#FBBF24',
      nodes: [
        { id: 'FN1', name: "SAMEER 'GHOST' QURESHI", type: 'SAFE_CRACKER', x: 60, y: 50, r: 14, color: '#FBBF24', risk: '92.4%', status: 'TRACKING' },
        { id: 'FN2', name: 'AXIS BANK VAULT 14KG GOLD', type: 'CRIME_SCENE', x: 140, y: 40, r: 14, color: '#FF5555', risk: '99.0%', status: 'BREACHED' },
        { id: 'FN3', name: 'BULLION FENCER CHANDNI CHOWK', type: 'BLACK_MARKET', x: 210, y: 60, r: 11, color: '#00E676', risk: '89.2%', status: 'MONITORED' },
        { id: 'FN4', name: 'GETAWAY BOLERO HR26', type: 'ANPR_CAMERA', x: 110, y: 110, r: 10, color: '#00E5FF', risk: '96.0%', status: 'GPS HIT' },
      ],
      edges: [
        { from: [60, 50], to: [140, 40], color: '#FF5555', width: 2.2 },
        { from: [140, 40], to: [210, 60], color: '#FBBF24', width: 2 },
        { from: [60, 50], to: [110, 110], color: '#00E5FF', width: 1.8, dashed: true },
      ]
    },
    CLUSTER_NARCO_PIPELINE: {
      name: 'NARCOTICS & MILITARY ARMS TRAFFICKING',
      nodesCount: '620',
      edgesCount: '1,490',
      threatLevel: 'CRITICAL',
      threatColor: '#FF5555',
      nodes: [
        { id: 'DN1', name: "ELENA 'CZAR' ROSTOVA", type: 'CARTEL_BOSS', x: 70, y: 70, r: 14, color: '#FF5555', risk: '96.0%', status: 'INTERPOL' },
        { id: 'DN2', name: 'PORT TERMINAL C YARD', type: 'SEIZURE', x: 140, y: 40, r: 14, color: '#00E5FF', risk: '100%', status: '100KG SEIZED' },
        { id: 'DN3', name: 'STEYR TMP FIREARMS', type: 'WEAPONS_CACHE', x: 200, y: 80, r: 12, color: '#FBBF24', risk: '98.0%', status: 'CUSTOMS' },
      ],
      edges: [
        { from: [70, 70], to: [140, 40], color: '#00E5FF', width: 2.2 },
        { from: [140, 40], to: [200, 80], color: '#FBBF24', width: 2 },
      ]
    }
  };

  // Recent Live Activity Logs
  const [recentLogs, setRecentLogs] = useState([
    {
      id: 101,
      time: 'Just now',
      type: 'BALLISTICS MATCH',
      typeColor: '#FF5555',
      entity: 'SECTOR 18 HOMICIDE → MAYANK KOTOLI',
      severityBadge: 'CRITICAL',
      severityColor: '#FF5555',
      rawPayload: 'FSL Forensic Ballistics match: 9mm cartridge casing recovered from Sector 18 double homicide fired from seized Beretta 92FS with 99.4% confidence.',
      action: 'DISPATCH STF'
    },
    {
      id: 102,
      time: '4 mins ago',
      type: 'WIRETAP INTERCEPT',
      typeColor: '#A855F7',
      entity: "MAHESH 'TIGER' KHAN SYNDICATE",
      severityBadge: 'CRITICAL',
      severityColor: '#FF5555',
      rawPayload: 'VOIP Wiretap intercept: ₹50 Lakhs ransom call made to Gurugram infrastructure builder. Voiceprint matched Mahesh Khan.',
      action: 'SURVEIL'
    },
    {
      id: 103,
      time: '12 mins ago',
      type: 'STR DNA MATCH',
      typeColor: '#00E5FF',
      entity: "DEVENDRA 'D-7' RAWAT",
      severityBadge: 'CRITICAL',
      severityColor: '#FF5555',
      rawPayload: '100% STR DNA profile match on forensic kit #FK-8821. Active Non-Bailable Warrant issued across NCR jurisdiction.',
      action: 'CORDON AREA'
    },
    {
      id: 104,
      time: '28 mins ago',
      type: 'ANPR TOLL HIT',
      typeColor: '#00E676',
      entity: 'GETAWAY KTM DUKE → MAYANK KOTOLI',
      severityBadge: 'HIGH',
      severityColor: '#FBBF24',
      rawPayload: 'ANPR camera flagged unregistered motorcycle at Kherki Daula Toll plaza traveling at 114 km/h.',
      action: 'INTERCEPT'
    }
  ]);

  const currentCluster = clusterData[activeCluster] || clusterData.CLUSTER_HOMICIDE_GANG;

  return (
    <div style={{
      flex: 1,
      padding: '1.5rem 2rem 3rem 2rem',
      maxWidth: '1550px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* ================= TOP HEADER & QUICK CONTROLS ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(0, 229, 255, 0.15)',
        paddingBottom: '1rem'
      }}>
        <div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'var(--cyan-glow)',
            letterSpacing: '1.5px',
            marginBottom: '3px'
          }}>
            // INTELLIGENCE & CRIME PREDICTION PLATFORM
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 900,
            margin: 0,
            color: '#FFFFFF',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🛡️</span>
            <span>COMMAND & PREDICTION DASHBOARD</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate && onNavigate('network')}
            className="interactive-btn"
            style={{
              backgroundColor: 'rgba(0, 229, 255, 0.12)',
              border: '1px solid var(--cyan-glow)',
              color: 'var(--cyan-glow)',
              padding: '8px 14px',
              borderRadius: '5px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🕸️</span>
            <span>GANG NETWORK MAPPER</span>
          </button>

          <button
            onClick={() => setIsAddCriminalModalOpen(true)}
            style={{
              backgroundColor: '#00E5FF',
              color: '#07090E',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
            }}
          >
            <span>🚨</span>
            <span>+ REGISTER CRIMINAL</span>
          </button>
        </div>
      </div>

      {/* ================= 4 KPI METRIC CARDS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {metrics.map((m) => (
          <div
            key={m.id}
            onClick={() => onNavigate && onNavigate(m.targetPage)}
            style={{
              backgroundColor: 'rgba(11, 18, 30, 0.85)',
              border: `1px solid ${m.isWarning ? 'rgba(255, 85, 85, 0.4)' : 'rgba(0, 229, 255, 0.2)'}`,
              borderRadius: '8px',
              padding: '1.1rem 1.25rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = m.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = m.isWarning ? 'rgba(255, 85, 85, 0.4)' : 'rgba(0, 229, 255, 0.2)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{m.title}</span>
              <span>{m.icon}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '4px' }}>
              {m.displayValue}
            </div>
            <div style={{ fontSize: '11px', color: m.color, fontWeight: 600 }}>
              {m.change} →
            </div>
          </div>
        ))}
      </div>

      {/* ================= SECTION 1: SIMPLIFIED AI SUSPECT PREDICTION ================= */}
      <div style={{
        backgroundColor: 'rgba(11, 18, 30, 0.9)',
        border: '1px solid rgba(0, 229, 255, 0.25)',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
      }}>
        {/* Header & Quick Selector Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '10.5px', fontFamily: 'monospace', color: 'var(--cyan-glow)', letterSpacing: '1px' }}>
              // NEURAL CRIME INVESTIGATOR
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0 0 0', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span>
              <span>AI SUSPECT PREDICTOR</span>
            </h2>
          </div>

          {/* Quick Incident Type Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'HOMICIDE_9MM', label: '🔴 9mm Homicide' },
              { id: 'EXTORTION_MCOCA', label: '🔵 Extortion' },
              { id: 'VAULT_BREACH', label: '🟡 Bank Heist' },
              { id: 'PREDATOR_HIGHWAY', label: '🟠 Highway Predator' },
              { id: 'NARCO_MARITIME', label: '🟣 Narco Smuggling' }
            ].map((scen) => {
              const isSelected = selectedScenario === scen.id && !predictionInput;
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen.id);
                    setPredictionInput('');
                    showToast(`Matched pattern: ${scen.label}`);
                  }}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isSelected ? 'var(--cyan-glow)' : 'rgba(255, 255, 255, 0.12)'}`,
                    color: isSelected ? 'var(--cyan-glow)' : '#94A3B8',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {scen.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Clues Bar */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'var(--cyan-glow)' }}>
            🔍
          </span>
          <input
            type="text"
            value={predictionInput}
            onChange={(e) => setPredictionInput(e.target.value)}
            placeholder="Type crime clue or modus operandi (e.g. 'Biker on KTM Duke', '₹50L ransom call', 'Vault lance breach')..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'rgba(7, 12, 20, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '6px',
              padding: '9px 12px 9px 36px',
              color: '#FFFFFF',
              fontSize: '12.5px',
              outline: 'none'
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
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Simplified Suspect Predictions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activePrediction.predictedSuspects.map((suspect, idx) => (
            <div
              key={suspect.id}
              style={{
                backgroundColor: idx === 0 ? 'rgba(255, 85, 85, 0.08)' : 'rgba(7, 12, 20, 0.75)',
                border: `1px solid ${idx === 0 ? 'rgba(255, 85, 85, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '6px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              {/* Suspect Identity & Evidence Summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 320px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? 'rgba(255, 85, 85, 0.2)' : 'rgba(0, 229, 255, 0.12)',
                  border: `1.5px solid ${idx === 0 ? '#FF5555' : 'var(--cyan-glow)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px',
                  color: idx === 0 ? '#FF5555' : 'var(--cyan-glow)',
                  fontFamily: 'monospace'
                }}>
                  {suspect.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                      {suspect.name}
                    </span>
                    <span style={{ fontSize: '10.5px', fontFamily: 'monospace', color: 'var(--cyan-glow)' }}>
                      ({suspect.id})
                    </span>
                    <span style={{
                      fontSize: '9.5px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: idx === 0 ? '#FF5555' : '#FBBF24',
                      backgroundColor: idx === 0 ? 'rgba(255, 85, 85, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      padding: '1px 6px',
                      borderRadius: '3px'
                    }}>
                      {suspect.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                    <strong style={{ color: '#FBBF24' }}>🧬 {suspect.confidence}</strong> • {suspect.modusOperandi.slice(0, 85)}...
                  </div>
                </div>
              </div>

              {/* Match Probability */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '9px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>MATCH PROBABILITY</div>
                  <div style={{ fontSize: '17px', fontWeight: 900, color: idx === 0 ? '#FF5555' : 'var(--cyan-glow)', fontFamily: 'monospace' }}>
                    {suspect.probability}%
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onNavigate && onNavigate('network', { suspect: suspect.name })}
                    className="interactive-btn"
                    title="Map Gang Network"
                    style={{
                      backgroundColor: 'rgba(0, 229, 255, 0.12)',
                      border: '1px solid var(--cyan-glow)',
                      color: 'var(--cyan-glow)',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🕸️</span>
                    <span>NETWORK</span>
                  </button>

                  <button
                    onClick={() => onNavigate && onNavigate('entities')}
                    className="interactive-btn"
                    title="View 360° Police Dossier"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>👤 DOSSIER</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION 2: GANG TOPOLOGY & RECENT INTELLIGENCE ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Left: Gang Cluster Map */}
        <div style={{
          backgroundColor: 'rgba(11, 18, 30, 0.88)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--cyan-glow)' }}>
                  🕸️ GANG SYNDICATE TOPOLOGY
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {currentCluster.name}
                </h3>
              </div>

              <button
                onClick={() => onNavigate && onNavigate('network')}
                style={{
                  backgroundColor: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid var(--cyan-glow)',
                  color: 'var(--cyan-glow)',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                OPEN FULL GRAPH ↗
              </button>
            </div>

            {/* Cluster Buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {Object.keys(clusterData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveCluster(key)}
                  style={{
                    backgroundColor: activeCluster === key ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${activeCluster === key ? 'var(--cyan-glow)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: activeCluster === key ? 'var(--cyan-glow)' : '#94A3B8',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10.5px',
                    cursor: 'pointer',
                    fontWeight: activeCluster === key ? 700 : 400
                  }}
                >
                  {key.replace('CLUSTER_', '')}
                </button>
              ))}
            </div>

            {/* SVG Graph Canvas */}
            <div style={{
              height: '180px',
              backgroundColor: 'rgba(4, 8, 15, 0.85)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 229, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 270 160">
                {currentCluster.edges.map((edge, i) => (
                  <line
                    key={i}
                    x1={edge.from[0]}
                    y1={edge.from[1]}
                    x2={edge.to[0]}
                    y2={edge.to[1]}
                    stroke={edge.color}
                    strokeWidth={edge.width || 1.5}
                    strokeDasharray={edge.dashed ? '3 3' : 'none'}
                  />
                ))}
                {currentCluster.nodes.map((node) => (
                  <g
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      showToast(`Selected Node: ${node.name} (${node.risk})`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
                    <text x={node.x} y={node.y + node.r + 9} fill="#FFFFFF" fontSize="7.5" textAnchor="middle" fontWeight="bold">
                      {node.name.slice(0, 14)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Total Nodes: <strong>{currentCluster.nodesCount}</strong></span>
            <span>Threat Index: <strong style={{ color: currentCluster.threatColor }}>{currentCluster.threatLevel}</strong></span>
          </div>
        </div>

        {/* Right: Live STF Intercepts & Forensic Activity */}
        <div style={{
          backgroundColor: 'rgba(11, 18, 30, 0.88)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--cyan-glow)' }}>
              ⚡ LIVE STF TELEMETRY & INTERCEPTS
            </div>
            <span style={{ fontSize: '10px', color: '#00E676', fontWeight: 700, fontFamily: 'monospace' }}>
              ● STREAM ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '250px' }}>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  backgroundColor: 'rgba(7, 12, 20, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  fontSize: '11.5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 800, color: log.typeColor }}>{log.type}</span>
                  <span style={{ color: '#94A3B8', fontSize: '10px' }}>{log.time}</span>
                </div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '2px' }}>{log.entity}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '10.5px' }}>{log.rawPayload}</div>
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
          onSuccess={() => {
            showToast('✓ Criminal record registered and synchronized with CrimeLens AI.');
            setIsAddCriminalModalOpen(false);
          }}
        />
      )}

      {/* ================= FLOATING TOAST ================= */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'rgba(0, 229, 255, 0.95)',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 800,
          fontFamily: 'monospace',
          fontSize: '13px',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.5)',
          zIndex: 99999
        }}>
          {toastMessage}
        </div>
      )}

    </div>
  );
}
