import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  ShieldCheck,
  Send,
  ArrowLeft
} from 'lucide-react';
import Navbar from '../src/components/Navbar.jsx';

const CHARGESHEETS_LIST = [
  {
    id: 'CS-2024-402',
    caseTitle: "State of Haryana vs Mayank Kotoli & Ors.",
    accused: "Mayank Kotoli (CRM-9942)",
    crimeCategory: 'HOMICIDE & CONTRACT MURDER',
    firNumber: 'FIR-2024-402',
    policeStation: 'Special Crime Branch / PS Sector 18',
    sections: 'BNS Sec 103 (Murder), Sec 111 (Organized Crime), Arms Act Sec 25',
    court: 'Court of District & Sessions Judge, Gurugram',
    ioOfficer: 'Inspector V. Rathore (STF Unit 4)',
    status: 'READY FOR FILING',
    bounty: '₹500,000 INR',
    icon: '🔴',
    summary: 'The accused, Mayank Kotoli, executed a contract assassination at Sector 18 market, firing 4 point-blank 9mm rounds before fleeing on an unregistered motorcycle.',
    exhibits: [
      'CFSL Ballistics: 9mm cartridge striations match Beretta 92FS',
      'Forensic Blood Splatter DNA analysis from Sector 18 crime scene',
      'CCTV Footage: Unregistered KTM Duke getaway motorcycle with 2 shooters',
      'Seizure Memo: .32 Desi Katta & 4 live rounds recovered from hideout'
    ],
    witnesses: [
      'Dr. S. K. Gupta, Senior Forensic Surgeon (Civil Hospital)',
      'S. K. Verma, Senior Scientific Officer (CFSL Ballistics)',
      'Sub-Inspector D. Sharma (First Responder Witness)'
    ]
  },
  {
    id: 'CS-2024-102',
    caseTitle: "State vs Devendra 'D-7' Rawat (Serial Sexual Offenses SIT)",
    accused: "Devendra 'D-7' Rawat (CRM-7721)",
    crimeCategory: 'SEXUAL ASSAULT & SERIAL RAPE',
    firNumber: 'FIR-2024-102',
    policeStation: 'Special SIT / Women Safety PS Sector 14',
    sections: 'BNS Sec 64 (Rape), Sec 70(1) (Gang Rape), POCSO Act Sec 4/6',
    court: 'Special Fast Track Court for Women Safety',
    ioOfficer: 'ACP Sunita Deshmukh (Women Safety SIT)',
    status: 'READY FOR FILING',
    bounty: '₹1,000,000 INR',
    icon: '🟣',
    summary: 'The accused operated a predatory fake taxi cab, targeting lone female commuters near transit hubs. Forensic DNA conclusively matches repeat offense crime scenes.',
    exhibits: [
      '100% STR DNA Allele match from Forensic Evidence Kit #FK-8821',
      'GPS location logs and cell tower triangulation near highway underpass',
      'Seized Hunting Knife with victim biological trace stains',
      'Fake taxi registration plates (DL-1T-4902) recovered from vehicle'
    ],
    witnesses: [
      'Dr. Ananya Ray, Chief Medical Officer (Forensic Medicine)',
      'Forensic DNA Expert (State DNA Database Registry)',
      'Head Constable S. Yadav (SIT Recovery Witness)'
    ]
  },
  {
    id: 'CS-2024-103',
    caseTitle: "State vs Sameer 'Ghost' Qureshi (Axis Bank Vault Robbery)",
    accused: "Sameer 'Ghost' Qureshi (CRM-8821)",
    crimeCategory: 'ARMED ROBBERY & BANK HEISTS',
    firNumber: 'FIR-2024-103',
    policeStation: 'Anti-Robbery Cell / PS Sadar',
    sections: 'BNS Sec 310 (Dacoity with Murder), Sec 312 (Robbery), Arms Act',
    court: 'Court of Additional Sessions Judge, Sadar',
    ioOfficer: 'DSP Alok Verma (Highway Crime Cell)',
    status: 'READY FOR FILING',
    bounty: '₹750,000 INR',
    icon: '🟠',
    summary: 'The accused breached the bank vault using high-temperature thermal lance torches, looting 14kg gold bullion before escaping in a commercial Eicher getaway truck.',
    exhibits: [
      'Thermal lance torch nozzles and oxygen cylinder breach remnants',
      'ANPR Highway Camera Snapshot: Eicher truck carrying 14kg gold bullion',
      '12-Gauge sawed-off shotgun seized from getaway hideout',
      'Bank CCTV laser jammer frequency recording and signal logs'
    ],
    witnesses: [
      'Bank Branch Head & Security Manager (Axis Bank)',
      'ANPR Highway Toll Operations In-Charge',
      'Forensic Cyber & Sensor Expert (Crime Branch)'
    ]
  },
  {
    id: 'CS-2024-001',
    caseTitle: "State vs Mahesh 'Tiger' Khan (MCOCA Gang Syndicate)",
    accused: "Mahesh 'Tiger' Khan (CRM-0014)",
    crimeCategory: 'ORGANIZED CRIME GANG & EXTORTION',
    firNumber: 'FIR-2024-001',
    policeStation: 'Organized Crime Branch / Special Cell',
    sections: 'MCOCA Act Sec 3/4, BNS Sec 308 (Extortion), Arms Act',
    court: 'Special MCOCA Designated Court',
    ioOfficer: 'Special Cell STF Squad',
    status: 'READY FOR FILING',
    bounty: '₹2,500,000 INR',
    icon: '🟡',
    summary: 'The accused leads an inter-state syndicate running extortion networks across builders, deploying armed enforcers to extract protection money with threats of violence.',
    exhibits: [
      'Judicially intercepted wiretap audio recording demanding ₹50 Lakhs ransom',
      'Acoustic Voice Spectrogram 99.1% pitch match certificate',
      'Hawala account ledger records and attached benami properties',
      'Export of 2 imported Glock 17 pistols and 90 live rounds'
    ],
    witnesses: [
      'Complainant Builder (Protected Identity u/s MCOCA)',
      'Acoustic Speech Analysis Senior Expert (CFSL)',
      'Inspector Special Cell (Wiretap Custody Officer)'
    ]
  }
];

export default function Reports() {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState(CHARGESHEETS_LIST[0]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyHash = () => {
    const hash = `SHA256:${selectedCase.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`;
    navigator.clipboard?.writeText(hash);
    showToast('✓ Cryptographic SHA-256 seal copied to clipboard.');
  };

  const handleDownload = () => {
    showToast(`✓ Chargesheet_${selectedCase.firNumber}_Final_Report.pdf downloaded.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCourtSubmit = () => {
    showToast(`✓ Chargesheet electronically filed with ${selectedCase.court}.`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark, #07090E)',
      color: '#FFFFFF',
      fontFamily: 'var(--font-sans, sans-serif)'
    }}>
      {/* Navigation */}
      <Navbar activePage="reports" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />

      {/* Toast Alert */}
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
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1.5rem 3rem 1.5rem',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
          paddingBottom: '1rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: '#00E5FF',
              letterSpacing: '1px'
            }}>
              <span>🇮🇳</span>
              <span>INDIAN POLICE // FINAL CHARGESHEET GENERATOR</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 0 0' }}>
              POLICE CHARGESHEET &amp; JUDICIAL EVIDENCE
            </h1>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#94A3B8',
              borderRadius: '5px',
              padding: '7px 14px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Step 1: Select Case from Horizontal Suspect Cards */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '8px' }}>
            STEP 1: SELECT CRIMINAL CASE DOSSIER
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.85rem'
          }}>
            {CHARGESHEETS_LIST.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'rgba(12, 17, 26, 0.85)',
                    border: isSelected ? '1.5px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 229, 255, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF', fontWeight: 700 }}>
                      {c.firNumber}
                    </span>
                    <span style={{ fontSize: '13px' }}>{c.icon}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#00E5FF' : '#FFFFFF' }}>
                    {c.accused.split('(')[0]}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>
                    {c.crimeCategory.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Main Chargesheet Document (Form 173 / BNSS 193) */}
        <div style={{
          backgroundColor: 'rgba(12, 17, 26, 0.95)',
          border: '1.5px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '10px',
          padding: '2rem',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.6)',
          marginBottom: '1.5rem'
        }}>
          {/* Document Header */}
          <div style={{
            textAlign: 'center',
            borderBottom: '1.5px solid rgba(0, 229, 255, 0.25)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF', letterSpacing: '1.5px' }}>
              // BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS SEC 193 / FORM 173) //
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', margin: '6px 0 3px 0' }}>
              FINAL POLICE INVESTIGATION CHARGESHEET
            </h2>
            <div style={{ fontSize: '12.5px', color: '#94A3B8' }}>
              BEFORE THE COURT OF: <strong style={{ color: '#FFFFFF' }}>{selectedCase.court}</strong>
            </div>
          </div>

          {/* Quick Particulars Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            backgroundColor: 'rgba(7, 10, 16, 0.9)',
            border: '1px solid rgba(0, 229, 255, 0.15)',
            padding: '14px 16px',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            fontSize: '12.5px'
          }}>
            <div><span style={{ color: '#94A3B8' }}>FIR Number:</span> <strong style={{ color: '#00E5FF' }}>{selectedCase.firNumber}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Police Station:</span> <strong style={{ color: '#FFFFFF' }}>{selectedCase.policeStation}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Primary Accused:</span> <strong style={{ color: '#FF8888' }}>{selectedCase.accused}</strong></div>
            <div><span style={{ color: '#94A3B8' }}>Investigating Officer:</span> <strong style={{ color: '#FFFFFF' }}>{selectedCase.ioOfficer}</strong></div>
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px' }}>
              <span style={{ color: '#94A3B8' }}>Penal Sections:</span>{' '}
              <strong style={{ color: '#FBBF24' }}>{selectedCase.sections}</strong>
            </div>
          </div>

          {/* Facts of Case */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#00E5FF', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
              1. Brief Facts &amp; Investigation Findings:
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#CBD5E1',
              lineHeight: 1.6,
              margin: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              padding: '12px 14px',
              borderRadius: '6px',
              borderLeft: '3px solid #00E5FF'
            }}>
              {selectedCase.summary}
            </p>
          </div>

          {/* Evidence Exhibits */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#00E5FF', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              2. Admissible Forensic Evidence Exhibits:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedCase.exhibits.map((ex, idx) => (
                <div key={idx} style={{
                  fontSize: '12px',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.15)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={15} color="#00E5FF" />
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 65B Digital Certificate */}
          <div style={{
            backgroundColor: 'rgba(0, 229, 255, 0.04)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '6px',
            padding: '12px 14px',
            fontSize: '11.5px',
            color: '#94A3B8',
            lineHeight: 1.5
          }}>
            🔒 <strong>Section 65B Bharatiya Sakshya Adhiniyam Certificate</strong>: All digital exhibits, ANPR timestamps, wiretaps, and forensic reports are cryptographically validated under root hash{' '}
            <span style={{ color: '#00E5FF', fontFamily: 'monospace' }}>SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>.
          </div>
        </div>

        {/* Step 3: Large, Simple Action Buttons Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'rgba(12, 17, 26, 0.85)',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          borderRadius: '8px',
          padding: '1rem 1.25rem'
        }}>
          <button
            onClick={handleCopyHash}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              color: '#00E5FF',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Copy size={15} /> COPY HASH SEAL
          </button>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrint}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '10px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} /> PRINT CHARGESHEET
            </button>

            <button
              onClick={handleDownload}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(0, 229, 255, 0.35)',
                color: '#00E5FF',
                borderRadius: '6px',
                padding: '10px 18px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> DOWNLOAD PDF
            </button>

            <button
              onClick={handleCourtSubmit}
              style={{
                backgroundColor: '#00E5FF',
                color: '#07090E',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 22px',
                fontSize: '12.5px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
              }}
            >
              <Send size={15} /> SUBMIT TO COURT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
