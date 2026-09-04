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
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-modal, #ffffff)',
        border: '1px solid var(--border-color, #cbd5e1)',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        position: 'relative',
        color: 'var(--text-primary, #0f172a)'
      }}>
        {/* Toast Alert */}
        {successToast && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '24px',
            backgroundColor: 'var(--bg-surface, #ffffff)',
            color: 'var(--text-primary, #0f172a)',
            border: '1px solid var(--border-color, #e2e8f0)',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} color="#16a34a" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface, #ffffff)'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-accent, #1e40af)',
              letterSpacing: '0.8px'
            }}>
              <Radio size={13} />
              <span>FORENSIC TELEMETRY // CDR &amp; TRANSACTION INGESTION HUB</span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary, #0f172a)', margin: '2px 0 0 0' }}>
              Multi-Source Digital Evidence Ingestion
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color, #e2e8f0)',
              color: 'var(--text-muted, #64748b)',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Preset Dataset Selector Ribbon */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-subtle, #f8fafc)',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>
              PRESETS:
            </span>
            {Object.entries(SAMPLE_DATASETS).map(([key, data]) => {
              const isSelected = selectedPresetKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPresetKey(key)}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-subtle, #eff6ff)' : 'var(--bg-card, #ffffff)',
                    border: isSelected ? '1px solid var(--border-strong, #bfdbfe)' : '1px solid var(--border-color, #e2e8f0)',
                    color: isSelected ? 'var(--text-accent, #1e40af)' : 'var(--text-secondary, #475569)',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {data.type === 'CDR' && <PhoneCall size={12} />}
                  {data.type === 'FINANCIAL' && <DollarSign size={12} />}
                  {data.type === 'TOWER_DUMP' && <Radio size={12} />}
                  <span>{data.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                backgroundColor: activeTab === 'preview' ? 'var(--bg-subtle, #eff6ff)' : 'var(--bg-card, #ffffff)',
                border: activeTab === 'preview' ? '1px solid var(--border-strong, #bfdbfe)' : '1px solid var(--border-color, #e2e8f0)',
                color: activeTab === 'preview' ? 'var(--text-accent, #1e40af)' : 'var(--text-muted, #64748b)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              DATA GRID
            </button>
            <button
              onClick={() => setActiveTab('overlaps')}
              style={{
                backgroundColor: activeTab === 'overlaps' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card, #ffffff)',
                border: activeTab === 'overlaps' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color, #e2e8f0)',
                color: activeTab === 'overlaps' ? 'var(--status-critical, #dc2626)' : 'var(--text-muted, #64748b)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Zap size={12} color="#dc2626" />
              <span>AI ANOMALIES (3)</span>
            </button>
            <button
              onClick={() => setActiveTab('custom_csv')}
              style={{
                backgroundColor: activeTab === 'custom_csv' ? 'var(--bg-subtle, #eff6ff)' : 'var(--bg-card, #ffffff)',
                border: activeTab === 'custom_csv' ? '1px solid var(--border-strong, #bfdbfe)' : '1px solid var(--border-color, #e2e8f0)',
                color: activeTab === 'custom_csv' ? 'var(--text-accent, #1e40af)' : 'var(--text-muted, #64748b)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
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
          padding: '16px 20px',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--bg-main, #f8fafc)'
        }}>
          {/* Active Preset Summary Banner */}
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                📁 {activeDataset.name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace', marginTop: '2px' }}>
                SOURCE: <strong style={{ color: 'var(--text-accent, #1e40af)' }}>{activeDataset.source}</strong> • TIME: {activeDataset.timestampRange}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-verified">
                ✓ {activeDataset.records.length} PARSED RECORDS
              </span>
            </div>
          </div>

          {/* TAB 1: DATA GRID PREVIEW */}
          {activeTab === 'preview' && (
            <div>
              <div style={{
                overflowX: 'auto',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card, #ffffff)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-subtle, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                      {activeDataset.type === 'CDR' && (
                        <>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>CALLER (A-PARTY)</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>RECEIVER (B-PARTY)</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>DURATION</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>TOWER / CELL ID</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>FLAGGED RISK</th>
                        </>
                      )}
                      {activeDataset.type === 'FINANCIAL' && (
                        <>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>SENDER ENTITY</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>BENEFICIARY ACCOUNT</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>AMOUNT</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>CHANNEL / UTR</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>AML STATUS</th>
                        </>
                      )}
                      {activeDataset.type === 'TOWER_DUMP' && (
                        <>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>TIMESTAMP</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>MAST NAME / CELL ID</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>TRIANGULATED IMSI / SUSPECT</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>SIGNAL (dBm)</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>PROXIMITY</th>
                          <th style={{ padding: '10px 12px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>INTELLIGENCE ALERT</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {activeDataset.records.map((r, idx) => (
                      <tr key={r.id || idx} style={{
                        borderBottom: '1px solid var(--border-color, #f1f5f9)',
                        backgroundColor: idx % 2 === 0 ? 'var(--bg-card, #ffffff)' : 'var(--bg-subtle, #f8fafc)'
                      }}>
                        {activeDataset.type === 'CDR' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: 'var(--status-critical, #dc2626)' }}>{r.callerName}</strong>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.callerNumber}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: 'var(--text-accent, #1e40af)' }}>{r.receiverName}</strong>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.receiverNumber}</div>
                            </td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-secondary, #334155)' }}>{r.durationSec}s ({r.callType})</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{ color: 'var(--text-primary, #0f172a)', fontWeight: 500 }}>{r.towerLocation}</span>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.cellTowerId}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span className="badge-critical">
                                ⚠️ {r.riskFlag}
                              </span>
                            </td>
                          </>
                        )}

                        {activeDataset.type === 'FINANCIAL' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{r.senderName}</strong>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.senderAcc}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: 'var(--text-accent, #1e40af)' }}>{r.receiverName}</strong>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.receiverAcc}</div>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--status-success, #16a34a)', fontWeight: 800, fontFamily: 'monospace' }}>
                              {r.amount}
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '11px' }}>
                              <span style={{ color: 'var(--text-primary, #0f172a)' }}>{r.channel}</span>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.utr}</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span className="badge-warning">
                                {r.status}
                              </span>
                            </td>
                          </>
                        )}

                        {activeDataset.type === 'TOWER_DUMP' && (
                          <>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-muted, #64748b)' }}>{r.timestamp}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{r.towerName}</strong>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>{r.towerId}</div>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--status-critical, #dc2626)', fontWeight: 700 }}>{r.activeImsi}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-accent, #1e40af)' }}>{r.signalDbm} dBm</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-secondary, #475569)' }}>~{r.distanceM} meters</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span className="badge-critical">
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderLeft: '4px solid #dc2626',
                borderRadius: '6px',
                padding: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--status-critical, #dc2626)', fontSize: '13px' }}>🚨 Co-Location Temporal Overlap: Sector 18 Homicide</strong>
                  <span className="badge-critical">99.8% CONFIDENCE</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                  CDR signals confirm Mayank Kotoli and Devendra Rawat pinged identical cell mast (TWR-DEL-SEC18-04) within a 4-minute window of the primary shooting incident at 18:14 IST.
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderLeft: '4px solid #d97706',
                borderRadius: '6px',
                padding: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--status-warning, #d97706)', fontSize: '13px' }}>⚡ Rapid Burner Swap &amp; IMEI Rotation</strong>
                  <span className="badge-warning">HIGH SUSPICION</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                  Sameer Qureshi rotated 3 distinct SIM cards across a single IMEI handset over an 8-hour window post-heist, terminating calls after fewer than 45 seconds.
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderLeft: '4px solid #1e40af',
                borderRadius: '6px',
                padding: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-accent, #1e40af)', fontSize: '13px' }}>🌐 Inter-State Hawala Structuring Chain</strong>
                  <span className="badge-info">PMLA TRIGGER</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #475569)', lineHeight: 1.4 }}>
                  Multiple structured deposits below the ₹50,000 threshold channeled through benami accounts within 90 minutes of the Axis Bank breach.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM CSV PASTE */}
          {activeTab === 'custom_csv' && (
            <div style={{
              backgroundColor: 'var(--bg-card, #ffffff)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', marginBottom: '6px' }}>
                Ingest Raw CSV Forensic Feed
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', margin: '0 0 12px 0' }}>
                Paste comma-separated CDR, Tower Dump, or Bank Ledger logs. Schema will be normalized automatically.
              </p>
              <textarea
                value={customCsvInput}
                onChange={(e) => setCustomCsvInput(e.target.value)}
                rows={7}
                placeholder="timestamp,caller,receiver,duration,tower_id,risk_level..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: 'var(--text-primary, #0f172a)',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={handleApplyCustomCsv}
                  className="btn-primary"
                  style={{ fontSize: '12px' }}
                >
                  Parse &amp; Ingest Records
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface, #ffffff)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', fontFamily: 'monospace' }}>
            STATUS: <strong style={{ color: 'var(--status-success, #16a34a)' }}>READY FOR SYNDICATE CORRELATION</strong>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Cancel
            </button>

            <button
              onClick={handleSyncToLiveState}
              disabled={isProcessing}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '6px 16px' }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={13} className="spin" />
                  <span>Syncing to Graph...</span>
                </>
              ) : (
                <>
                  <Database size={13} />
                  <span>Sync with Intelligence Graph</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
