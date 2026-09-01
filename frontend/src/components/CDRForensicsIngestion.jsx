import React, { useState, useMemo } from 'react';
import {
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  Radio,
  PhoneCall,
  DollarSign,
  Globe,
  Database,
  CheckCircle2,
  Filter,
  RefreshCw,
  Search,
  Layers,
  ArrowRight,
  ShieldAlert,
  Zap,
  X
} from 'lucide-react';

// Pre-built High-Impact Demo Datasets for 1-Click Forensic Demonstrations
const SAMPLE_DATASETS = {
  cdr_interstate: {
    name: 'Sector 18 Syndicate CDR Intercept (Mayank Kotoli & Tiger Khan)',
    type: 'CDR',
    source: 'Airtel / Jio Wiretap Intercept Trunk #402',
    timestampRange: '2024-10-27 14:00 - 2024-10-27 21:00 IST',
    records: [
      {
        id: 'CDR-991',
        callerNumber: '+91-98711-40291',
        callerName: 'Mayank Kotoli (Burner Alpha)',
        receiverNumber: '+91-99882-11049',
        receiverName: 'Sameer Qureshi (Getaway)',
        callType: 'OUTGOING',
        durationSec: 142,
        cellTowerId: 'TWR-DEL-SEC18-04',
        towerLocation: 'Sector 18 Market, Gurugram',
        timestamp: '2024-10-27 18:14:20',
        imei: '864201938472910',
        imsi: '404450892184712',
        riskFlag: 'HIGH_FREQUENCY_BURST'
      },
      {
        id: 'CDR-992',
        callerNumber: '+91-98711-40291',
        callerName: 'Mayank Kotoli (Burner Alpha)',
        receiverNumber: '+971-50-8819021',
        receiverName: "Mahesh 'Tiger' Khan (Dubai VoIP)",
        callType: 'OUTGOING_INTL',
        durationSec: 380,
        cellTowerId: 'TWR-DEL-SEC18-04',
        towerLocation: 'Sector 18 Market, Gurugram',
        timestamp: '2024-10-27 18:31:05',
        imei: '864201938472910',
        imsi: '404450892184712',
        riskFlag: 'SYNDICATE_HEAD_CONTACT'
      },
      {
        id: 'CDR-993',
        callerNumber: '+91-99882-11049',
        callerName: 'Sameer Qureshi (Getaway)',
        receiverNumber: '+91-98112-99011',
        receiverName: "Devendra 'D-7' Rawat",
        callType: 'INCOMING',
        durationSec: 45,
        cellTowerId: 'TWR-DEL-SEC14-02',
        towerLocation: 'Sector 14 Transit Hub, Gurugram',
        timestamp: '2024-10-27 18:48:12',
        imei: '359102847291830',
        imsi: '404450119823410',
        riskFlag: 'CO_LOCATION_PROXIMITY'
      },
      {
        id: 'CDR-994',
        callerNumber: '+91-98112-99011',
        callerName: "Devendra 'D-7' Rawat",
        receiverNumber: '+91-98711-40291',
        receiverName: 'Mayank Kotoli (Burner Alpha)',
        callType: 'OUTGOING',
        durationSec: 92,
        cellTowerId: 'TWR-DEL-SEC18-04',
        towerLocation: 'Sector 18 Market, Gurugram',
        timestamp: '2024-10-27 19:02:44',
        imei: '869201948271049',
        imsi: '404450772183991',
        riskFlag: 'CO_LOCATION_PROXIMITY'
      },
      {
        id: 'CDR-995',
        callerNumber: '+91-98711-40291',
        callerName: 'Mayank Kotoli (Burner Alpha)',
        receiverNumber: '+91-98991-00219',
        receiverName: 'Suresh Goli (Armorer)',
        callType: 'OUTGOING',
        durationSec: 64,
        cellTowerId: 'TWR-DEL-HWY-09',
        towerLocation: 'KMP Expressway Toll Plaza',
        timestamp: '2024-10-27 19:45:10',
        imei: '864201938472910',
        imsi: '404450892184712',
        riskFlag: 'HIGHWAY_ESCAPE_VECTOR'
      }
    ]
  },
  financial_hawala: {
    name: 'Syndicate Hawala / UPI Mule Account Stream',
    type: 'FINANCIAL',
    source: 'FIU-IND & Bank AML Alert Node #889',
    timestampRange: '2024-10-26 - 2024-10-27 IST',
    records: [
      {
        id: 'TXN-4011',
        senderAcc: '9921008471@okaxis (Benami Mule)',
        senderName: 'Rajesh Kumar (Mule #1)',
        receiverAcc: 'SECTOR-12-HAWALA-DROP',
        receiverName: 'Mayank Kotoli Cash Proxy',
        amount: '₹3,500,000 INR ($42,000 USD)',
        channel: 'RTGS / HAWALA LEDGER',
        utr: 'UTR-20241027-AXS-991204',
        timestamp: '2024-10-27 15:30:00',
        flag: 'STRUCTURING_HAWALA_DROP',
        status: 'FLAGGED_HIGH_RISK'
      },
      {
        id: 'TXN-4012',
        senderAcc: 'SECTOR-12-HAWALA-DROP',
        senderName: 'Mayank Kotoli Cash Proxy',
        receiverAcc: 'GOLD-VAULT-MEHR-8821',
        receiverName: 'Sameer Qureshi Bullion Fencer',
        amount: '₹1,420,000 INR ($17,000 USD)',
        channel: 'PHYSICAL CASH TO GOLD SETTLEMENT',
        utr: 'UTR-HAW-2024-8812',
        timestamp: '2024-10-27 17:15:00',
        flag: 'WEAPON_PAYOUT_MATCH',
        status: 'FROZEN_BY_STF'
      },
      {
        id: 'TXN-4013',
        senderAcc: 'hsbc-hk-trust-9921',
        senderName: "Elena 'Czar' Rostova",
        receiverAcc: 'dubai-bullion-vault-0014',
        receiverName: "Mahesh 'Tiger' Khan",
        amount: '$250,000 USD (₹2.08 Cr)',
        channel: 'SWIFT OFFSHORE WIRE',
        utr: 'SWIFT-HSBC-DXB-99812',
        timestamp: '2024-10-27 12:00:00',
        flag: 'CROSS_BORDER_NARCO_FLOW',
        status: 'INTERPOL_FLAGGED'
      }
    ]
  },
  tower_dump_sector18: {
    name: 'Sector 18 Homicide Cell Tower Dump (Triangulated Overlaps)',
    type: 'TOWER_DUMP',
    source: 'STF Cyber Cell Automated Triangulation Engine',
    timestampRange: '2024-10-27 18:00 - 19:30 IST',
    records: [
      {
        id: 'TD-01',
        towerId: 'TWR-DEL-SEC18-04',
        towerName: 'Sector 18 Market Main Mast (Azimuth 120°)',
        lat: 28.4721,
        lng: 77.0392,
        activeImsi: '404450892184712 (Mayank Kotoli)',
        signalDbm: -68,
        distanceM: 140,
        timestamp: '2024-10-27 18:42:15',
        overlapAlert: 'PRESENT AT SHOOTING SCENE (0 min delta)'
      },
      {
        id: 'TD-02',
        towerId: 'TWR-DEL-SEC18-04',
        towerName: 'Sector 18 Market Main Mast (Azimuth 120°)',
        lat: 28.4721,
        lng: 77.0392,
        activeImsi: '404450772183991 (Devendra Rawat)',
        signalDbm: -72,
        distanceM: 320,
        timestamp: '2024-10-27 18:45:10',
        overlapAlert: 'CO-LOCATED WITHIN 350 METERS OF SHOOTER'
      },
      {
        id: 'TD-03',
        towerId: 'TWR-DEL-SEC14-02',
        towerName: 'Sector 14 Transit Hub Relay',
        lat: 28.4595,
        lng: 77.0266,
        activeImsi: '404450119823410 (Sameer Qureshi)',
        signalDbm: -70,
        distanceM: 210,
        timestamp: '2024-10-27 18:48:00',
        overlapAlert: 'STANDBY GETAWAY POSITION LOGGED'
      }
    ]
  }
};

export default function CDRForensicsIngestion({ isOpen, onClose, onIngestSuccess }) {
  const [selectedPresetKey, setSelectedPresetKey] = useState('cdr_interstate');
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'overlaps' | 'custom_csv'
  const [customCsvText, setCustomCsvText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  const activeDataset = SAMPLE_DATASETS[selectedPresetKey] || SAMPLE_DATASETS.cdr_interstate;

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Detected Overlaps & Intelligence Highlights
  const intelligenceInsights = useMemo(() => {
    return [
      {
        type: 'CO_LOCATION_ANOMALY',
        severity: 'CRITICAL',
        title: '3 Accused Triangulated at Sector 18 Homicide Scene',
        desc: 'Mayank Kotoli, Devendra Rawat, and Sameer Qureshi pinged towers within 600m radius at 18:45 IST.',
        confidence: '99.8%'
      },
      {
        type: 'CALL_BURST_SPIKE',
        severity: 'HIGH',
        title: 'Burst Communication 14 Mins Before Incident',
        desc: '6 encrypted outgoing calls logged from Burner Alpha (+91-98711-40291) to syndicate contacts.',
        confidence: '98.5%'
      },
      {
        type: 'HAWALA_SETTLEMENT',
        severity: 'CRITICAL',
        title: '₹35 Lakhs Hawala Cash Drop Executed',
        desc: 'Unregistered cash structuring matched Axis Bank proxy account 30 mins prior to incident.',
        confidence: '97.2%'
      }
    ];
  }, []);

  const handleApplyCustomCsv = () => {
    if (!customCsvText.trim()) {
      alert('Please paste or upload valid CSV records first.');
      return;
    }

    try {
      const lines = customCsvText.trim().split('\n');
      if (lines.length < 2) {
        alert('CSV must contain a header row and at least one data row.');
        return;
      }
      showToast(`✓ Parsed ${lines.length - 1} custom forensic records successfully.`);
      setActiveTab('preview');
    } catch {
      alert('Failed to parse CSV. Please verify comma-separated syntax.');
    }
  };

  const handleSyncToLiveState = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast('✓ Ingested CDR & Forensic Records synced to Criminal 360, Timeline & Network Graph!');
      if (onIngestSuccess) {
        onIngestSuccess(activeDataset);
      }
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#0A0E17',
        border: '1.5px solid rgba(0, 229, 255, 0.35)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 229, 255, 0.2)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Toast Alert */}
        {successToast && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '24px',
            backgroundColor: '#00E5FF',
            color: '#07090E',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 229, 255, 0.03)'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: '#00E5FF',
              letterSpacing: '1.5px'
            }}>
              <Radio size={14} className="pulse-dot" />
              <span>FORENSIC TELEMETRY // CDR &amp; TRANSACTION INGESTION HUB</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
              MULTI-SOURCE DIGITAL EVIDENCE INGESTION
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94A3B8',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Dataset Selector Ribbon */}
        <div style={{
          padding: '1rem 1.75rem',
          backgroundColor: 'rgba(12, 17, 26, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
              DEMO PRESETS:
            </span>
            {Object.entries(SAMPLE_DATASETS).map(([key, data]) => {
              const isSelected = selectedPresetKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPresetKey(key)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: isSelected ? '#00E5FF' : '#94A3B8',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono, monospace)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {data.type === 'CDR' && <PhoneCall size={13} />}
                  {data.type === 'FINANCIAL' && <DollarSign size={13} />}
                  {data.type === 'TOWER_DUMP' && <Radio size={13} />}
                  <span>{data.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                backgroundColor: activeTab === 'preview' ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                border: activeTab === 'preview' ? '1px solid #00E5FF' : '1px solid transparent',
                color: activeTab === 'preview' ? '#00E5FF' : '#94A3B8',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer'
              }}
            >
              DATA GRID
            </button>
            <button
              onClick={() => setActiveTab('overlaps')}
              style={{
                backgroundColor: activeTab === 'overlaps' ? 'rgba(255, 85, 85, 0.2)' : 'transparent',
                border: activeTab === 'overlaps' ? '1px solid #FF5555' : '1px solid transparent',
                color: activeTab === 'overlaps' ? '#FF8888' : '#94A3B8',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Zap size={12} color="#FF5555" />
              <span>AI ANOMALIES (3)</span>
            </button>
            <button
              onClick={() => setActiveTab('custom_csv')}
              style={{
                backgroundColor: activeTab === 'custom_csv' ? 'rgba(0, 230, 118, 0.2)' : 'transparent',
                border: activeTab === 'custom_csv' ? '1px solid #00E676' : '1px solid transparent',
                color: activeTab === 'custom_csv' ? '#00E676' : '#94A3B8',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Upload size={12} />
              <span>PASTE CSV</span>
            </button>
          </div>
        </div>

        {/* Content Body Area */}
        <div style={{
          padding: '1.5rem 1.75rem',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#07090E'
        }}>
          {/* Active Preset Summary Banner */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.04)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                📁 {activeDataset.name}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}>
                SOURCE: <strong style={{ color: '#00E5FF' }}>{activeDataset.source}</strong> • TIME: {activeDataset.timestampRange}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                color: '#00E676',
                fontSize: '10.5px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono, monospace)'
              }}>
                ✓ {activeDataset.records.length} PARSED RECORDS
              </span>
            </div>
          </div>

          {/* TAB 1: DATA GRID PREVIEW */}
          {activeTab === 'preview' && (
            <div>
              <div style={{
                overflowX: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backgroundColor: 'rgba(12, 17, 26, 0.9)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(0, 229, 255, 0.08)', borderBottom: '1px solid rgba(0, 229, 255, 0.2)' }}>
                      {activeDataset.type === 'CDR' && (
                        <>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>CALLER (A-PARTY)</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>RECEIVER (B-PARTY)</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>DURATION</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>TOWER / CELL ID</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>FLAGGED RISK</th>
                        </>
                      )}
                      {activeDataset.type === 'FINANCIAL' && (
                        <>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>SENDER ENTITY</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>BENEFICIARY ACCOUNT</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>AMOUNT</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>CHANNEL / UTR</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>AML STATUS</th>
                        </>
                      )}
                      {activeDataset.type === 'TOWER_DUMP' && (
                        <>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>MAST NAME / CELL ID</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>TRIANGULATED IMSI / SUSPECT</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>SIGNAL (dBm)</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>PROXIMITY</th>
                          <th style={{ padding: '10px 12px', color: '#00E5FF' }}>INTELLIGENCE ALERT</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activeDataset.records.map((r, idx) => (
                      <tr key={r.id || idx} style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                      }}>
                        {activeDataset.type === 'CDR' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)', color: '#94A3B8' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#FF8888' }}>{r.callerName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>{r.callerNumber}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#00E5FF' }}>{r.receiverName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>{r.receiverNumber}</div>
                            </td>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)' }}>{r.durationSec}s ({r.callType})</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ color: '#FFFFFF' }}>{r.towerLocation}</span>
                              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono, monospace)' }}>{r.cellTowerId}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                backgroundColor: 'rgba(255, 85, 85, 0.15)',
                                color: '#FF6B6B',
                                border: '1px solid rgba(255, 85, 85, 0.3)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '10.5px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono, monospace)'
                              }}>
                                ⚠️ {r.riskFlag}
                              </span>
                            </td>
                          </>
                        )}

                        {activeDataset.type === 'FINANCIAL' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)', color: '#94A3B8' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#FFFFFF' }}>{r.senderName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>{r.senderAcc}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#00E5FF' }}>{r.receiverName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>{r.receiverAcc}</div>
                            </td>
                            <td style={{ padding: '10px 12px', color: '#00E676', fontWeight: 800, fontFamily: 'var(--font-mono, monospace)' }}>
                              {r.amount}
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '11px' }}>
                              <span style={{ color: '#FFFFFF' }}>{r.channel}</span>
                              <div style={{ fontSize: '10px', color: '#64748B', fontFamily: 'var(--font-mono, monospace)' }}>{r.utr}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                                color: '#FBBF24',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '10.5px',
                                fontWeight: 700
                              }}>
                                {r.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeDataset.type === 'TOWER_DUMP' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)', color: '#94A3B8' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: '#FFFFFF' }}>{r.towerName}</strong>
                              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>{r.towerId}</div>
                            </td>
                            <td style={{ padding: '10px 12px', color: '#FF8888', fontWeight: 700 }}>{r.activeImsi}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF' }}>{r.signalDbm} dBm</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono, monospace)' }}>~{r.distanceM} meters</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                backgroundColor: 'rgba(255, 85, 85, 0.15)',
                                color: '#FF6B6B',
                                border: '1px solid rgba(255, 85, 85, 0.3)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '10.5px',
                                fontWeight: 700
                              }}>
                                🚨 {r.overlapAlert}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AI OVERLAPS & FORENSIC INSIGHTS */}
          {activeTab === 'overlaps' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '4px' }}>
                AUTOMATED HEURISTIC CORRELATION DETECTED 3 HIGH-RISK THREAT VECTORS:
              </div>

              {intelligenceInsights.map((ins, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(12, 17, 26, 0.95)',
                  border: '1px solid rgba(255, 85, 85, 0.3)',
                  borderLeft: '4px solid #FF5555',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ maxWidth: '750px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 800,
                        backgroundColor: 'rgba(255, 85, 85, 0.2)',
                        color: '#FF6B6B',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontFamily: 'var(--font-mono, monospace)'
                      }}>
                        {ins.type}
                      </span>
                      <strong style={{ fontSize: '13.5px', color: '#FFFFFF' }}>{ins.title}</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5 }}>
                      {ins.desc}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>AI CONFIDENCE</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#00E676', fontFamily: 'var(--font-mono, monospace)' }}>
                      {ins.confidence}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CUSTOM CSV DROPZONE */}
          {activeTab === 'custom_csv' && (
            <div>
              <div style={{
                border: '2px dashed rgba(0, 229, 255, 0.3)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 229, 255, 0.02)',
                marginBottom: '1rem'
              }}>
                <FileSpreadsheet size={32} color="#00E5FF" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  Upload or Paste Custom Raw CDR / Bank Transaction CSV
                </h4>
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 12px 0' }}>
                  Accepts standard telecom CDR headers: <code style={{ color: '#00E5FF' }}>timestamp,caller,receiver,duration,tower_id,imei</code>
                </p>

                <textarea
                  rows={6}
                  value={customCsvText}
                  onChange={(e) => setCustomCsvText(e.target.value)}
                  placeholder={`timestamp,caller,receiver,duration_sec,cell_id,imei\n2024-10-27 18:40:00,+91-9871140291,+91-9988211049,120,TWR-SEC18-04,864201938472910\n2024-10-27 18:45:10,+91-9811299011,+91-9871140291,95,TWR-SEC18-04,869201948271049`}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(7, 10, 16, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '11.5px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    onClick={handleApplyCustomCsv}
                    style={{
                      backgroundColor: '#00E5FF',
                      border: 'none',
                      color: '#07090E',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono, monospace)',
                      padding: '8px 18px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    PARSE &amp; INGEST CSV RECORDS
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(0, 229, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(12, 17, 26, 0.98)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
            STATUS: <strong style={{ color: '#00E676' }}>READY FOR SYNDICATE CORRELATION</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#94A3B8',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSyncToLiveState}
              disabled={isProcessing}
              style={{
                backgroundColor: '#00E5FF',
                border: 'none',
                color: '#07090E',
                borderRadius: '6px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  <span>SYNCING TO GRAPH...</span>
                </>
              ) : (
                <>
                  <Database size={14} />
                  <span>SYNC WITH INTELLIGENCE GRAPH &amp; TIMELINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
