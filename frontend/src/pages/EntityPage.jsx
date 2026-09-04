import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Search,
  Shield,
  FileText,
  AlertTriangle,
  Download,
  Share2,
  Lock,
  Phone,
  DollarSign,
  Fingerprint,
  CheckCircle2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api.js';
import AddCriminalModal from '../components/AddCriminalModal.jsx';

const DEFAULT_SUSPECTS = [
  {
    id: "CRM-9942",
    name: "MAYANK KOTOLI",
    aliases: ["Kotoli", "The Trigger", "MK-99"],
    crimeType: "HOMICIDE & CONTRACT KILLING",
    firNumbers: ["FIR-2024-402 (Murder BNS 103 / IPC 302)", "FIR-2023-881 (Attempted Murder)"],
    weaponSignature: "9mm Beretta 92FS / .32 Desi Katta",
    modusOperandi: "Ambush contract killings on rival gang leaders using point-blank double-tap; getaway via unregistered KTM Duke bikes.",
    wantedReward: "₹500,000 INR ($6,000 USD)",
    dnaProfileMatch: "99.4% Match to Blood Splatter at Sector 18 Homicide Scene",
    riskScore: 99.2,
    threatLevel: "CRITICAL",
    status: "ACTIVE FUGITIVE",
    category: "Homicide & Violent Crime",
    policeStation: "Special Crime Branch / PS Sector 18",
    biometrics: {
      dob: "1987-05-14",
      nationality: "Indian (Interpol Blue Notice)",
      scarsAndMarks: "Deep scar across left jawline; Cobra tattoo on right forearm",
      voiceprintConfidence: "98.9%",
      facialVectorId: "FV-99420-MK"
    },
    knownAssociates: [
      { id: "CRM-0014", name: "Mahesh 'Tiger' Khan", relation: "Gang Syndicate Boss", risk: "CRITICAL" },
      { id: "CRM-4494", name: "Suresh 'Chhota' Goli", relation: "Armorer & Weapon Supplier", risk: "HIGH" },
      { id: "CRM-8821", name: "Sameer Qureshi", relation: "Getaway Driver", risk: "HIGH" }
    ],
    financialAccounts: [
      { bank: "Cash Hawala Drops", accNo: "SECTOR-12-HAWALA", balance: "₹35 Lakhs Cash" },
      { bank: "Axis Bank (Benami Proxy)", accNo: "****-4901", balance: "₹14.2 Lakhs (Frozen)" }
    ],
    burnerDevices: [
      { imei: "864201938472910", number: "+91-98711-40291", status: "Cell Tower Ping: Meerut Highway" },
      { imei: "359102847291830", number: "+91-99882-11049", status: "Signal Intercepted" }
    ]
  },
  {
    id: "CRM-7721",
    name: "DEVENDRA 'D-7' RAWAT",
    aliases: ["D-7", "Highway Predator", "Night Stalker"],
    crimeType: "SEXUAL ASSAULT & SERIAL RAPE",
    firNumbers: ["FIR-2024-102 (Aggravated Rape BNS 64 / IPC 376D)", "FIR-2024-089 (POCSO Act)"],
    weaponSignature: "Hunting Knife / Chloroform Spray",
    modusOperandi: "Stalks lone commuters near unlit transit hubs and ring roads; uses fake taxi cabs with altered plates.",
    wantedReward: "₹1,000,000 INR ($12,000 USD)",
    dnaProfileMatch: "100% STR DNA Match from Forensic Kit #FK-8821",
    riskScore: 99.8,
    threatLevel: "CRITICAL",
    status: "ACTIVE FUGITIVE",
    category: "Sexual Offenses & Rape",
    policeStation: "Special SIT / Women Safety PS Sector 14",
    biometrics: {
      dob: "1991-11-03",
      nationality: "Indian",
      scarsAndMarks: "Burn mark on right shoulder; Stutter in speech",
      voiceprintConfidence: "96.4%",
      facialVectorId: "FV-77210-DR"
    },
    knownAssociates: [
      { id: "CRM-3310", name: "Raju 'Mechanic' Verma", relation: "Fake Number Plate Supplier", risk: "HIGH" },
      { id: "CRM-9942", name: "Mayank Kotoli", relation: "Former Inmate / Gang Link", risk: "CRITICAL" }
    ],
    financialAccounts: [
      { bank: "Punjab National Bank", accNo: "****-8821", balance: "₹1.8 Lakhs (Monitored)" }
    ],
    burnerDevices: [
      { imei: "869201948271049", number: "+91-98112-99011", status: "Tower Triangulation: Sector 14" }
    ]
  },
  {
    id: "CRM-8821",
    name: "SAMEER 'GHOST' QURESHI",
    aliases: ["Ghost", "The Drill", "SQ-Lock"],
    crimeType: "ARMED ROBBERY & BANK HEISTS",
    firNumbers: ["FIR-2024-103 (Armed Bank Robbery BNS 310 / IPC 392)", "FIR-2023-662 (Jewelry Vault Burglary)"],
    weaponSignature: "Sawed-off 12-Gauge Shotgun / Thermal Lance",
    modusOperandi: "High-precision vault breaching, security guard neutralization, laser jammer deployment, signal blocker trucks.",
    wantedReward: "₹750,000 INR ($9,000 USD)",
    dnaProfileMatch: "Glove DNA Match from Axis Bank Vault Heist",
    riskScore: 92.4,
    threatLevel: "HIGH",
    status: "ACTIVE TRACKING",
    category: "Armed Robbery & Bank Heists",
    policeStation: "Anti-Robbery Cell / PS Sadar",
    biometrics: {
      dob: "1989-02-18",
      nationality: "Indian",
      scarsAndMarks: "Missing tip of right index finger",
      voiceprintConfidence: "94.2%",
      facialVectorId: "FV-88210-SQ"
    },
    knownAssociates: [
      { id: "CRM-0014", name: "Mahesh Khan", relation: "Syndicate Boss / Fencer", risk: "CRITICAL" },
      { id: "CRM-4494", name: "Vikram Mehta", relation: "Hawala Fencer", risk: "HIGH" }
    ],
    financialAccounts: [
      { bank: "Stolen Gold Bullion Reserves", accNo: "HEIST-OCT-2024", balance: "14 kg Stolen Gold" }
    ],
    burnerDevices: [
      { imei: "864201938472888", number: "+91-98991-00219", status: "Active GPS Beacon on Getaway Truck" }
    ]
  },
  {
    id: "CRM-0014",
    name: "MAHESH 'TIGER' KHAN",
    aliases: ["Tiger", "Bada Don", "MK-01"],
    crimeType: "ORGANIZED GANG SYNDICATE & EXTORTION",
    firNumbers: ["FIR-2024-001 (MCOCA Act)", "FIR-2023-909 (Extortion & Kidnapping)"],
    weaponSignature: "AK-47 / Imported Glock 17",
    modusOperandi: "Extortion rackets on builders, inter-state contraband protection, contract killings via youth recruit sleeper cells.",
    wantedReward: "₹2,500,000 INR ($30,000 USD)",
    dnaProfileMatch: "Indexed in State Police Gangster Database",
    riskScore: 98.5,
    threatLevel: "CRITICAL",
    status: "WARRANT ISSUED",
    category: "Gang Syndicate & Extortion",
    policeStation: "Organized Crime Branch / Special Cell",
    biometrics: {
      dob: "1978-08-22",
      nationality: "Indian (Red Corner Notice)",
      scarsAndMarks: "Bullet exit wound scar on abdomen; Tiger tattoo on neck",
      voiceprintConfidence: "99.1%",
      facialVectorId: "FV-00145-MK"
    },
    knownAssociates: [
      { id: "CRM-9942", name: "Mayank Kotoli", relation: "Lead Hitman", risk: "CRITICAL" },
      { id: "CRM-5512", name: "Elena 'Czar' Rostova", relation: "Narcotics Supply Partner", risk: "CRITICAL" }
    ],
    financialAccounts: [
      { bank: "Dubai Bullion Vault", accNo: "****-9102", balance: "$1.8M Gold Bullion" },
      { bank: "Swiss Escrow #88", accNo: "****-3310", balance: "$3.2M USD (Frozen)" }
    ],
    burnerDevices: [
      { imei: "861902847291830", number: "+971-50-8819021", status: "Encrypted Satellite Relay" }
    ]
  },
  {
    id: "CRM-5512",
    name: "ELENA 'CZAR' ROSTOVA",
    aliases: ["The Chemist", "Czarina", "ER-Narc"],
    crimeType: "NARCOTICS & ILLICIT ARMS TRAFFICKING",
    firNumbers: ["FIR-2024-104 (NDPS Act 100kg Seizure)", "FIR-2023-419 (Cross-Border Arms Smuggling)"],
    weaponSignature: "Steyr TMP 9mm Submachine Gun",
    modusOperandi: "Maritime container smuggling of synthetic opioids, military-grade arms distribution across Northern India.",
    wantedReward: "₹1,500,000 INR ($18,000 USD)",
    dnaProfileMatch: "Fingerprint match on Port Terminal C Container Seal",
    riskScore: 96.0,
    threatLevel: "CRITICAL",
    status: "ACTIVE SURVEILLANCE",
    category: "Narcotics & Arms Smuggling",
    policeStation: "Narcotics Control Bureau (NCB) Zonal Unit",
    biometrics: {
      dob: "1986-10-12",
      nationality: "Dual Flagged (Interpol Red Notice)",
      scarsAndMarks: "Tattoo of Russian Eagle on back",
      voiceprintConfidence: "97.8%",
      facialVectorId: "FV-55120-ER"
    },
    knownAssociates: [
      { id: "CRM-0014", name: "Mahesh 'Tiger' Khan", relation: "Distribution Partner", risk: "CRITICAL" }
    ],
    financialAccounts: [
      { bank: "HSBC Hong Kong Escrow", accNo: "****-4201", balance: "$4.2M Wire Blocked" }
    ],
    burnerDevices: [
      { imei: "359102847291000", number: "+44-7911-123456", status: "Port Terminal Signal Intercept" }
    ]
  }
];

export default function EntityPage({ onNavigate }) {
  const [suspectsList, setSuspectsList] = useState(DEFAULT_SUSPECTS);
  const [selectedSuspect, setSelectedSuspect] = useState(DEFAULT_SUSPECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check URL query parameters (e.g. ?suspect=MAYANK KOTOLI)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const suspectParam = urlParams.get('suspect');
      if (suspectParam) {
        const found = suspectsList.find((s) =>
          s.name.toLowerCase().includes(suspectParam.toLowerCase())
        );
        if (found) setSelectedSuspect(found);
      }
    } catch {}
  }, [suspectsList]);

  const filteredSuspects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return suspectsList.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.aliases && s.aliases.some((a) => a.toLowerCase().includes(q))) ||
        s.crimeType.toLowerCase().includes(q);

      const matchesCat =
        categoryFilter === 'ALL' ||
        s.category.toUpperCase().includes(categoryFilter);

      return matchesSearch && matchesCat;
    });
  }, [suspectsList, searchQuery, categoryFilter]);

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
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
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary, #1e40af)', letterSpacing: '0.8px' }}>
            CRIMINAL BIOMETRICS &amp; DOSSIER ARCHIVE
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #0f172a)', margin: '2px 0 0 0' }}>
            Suspects &amp; Persons 360° Intelligence
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={14} />
          <span>Register New Suspect</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '20px',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Search & Suspects List */}
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
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted, #64748b)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, alias, MO..."
              style={{
                width: '100%',
                paddingLeft: '32px',
                height: '34px',
                fontSize: '12.5px'
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['ALL', 'HOMICIDE', 'RAPE', 'ROBBERY', 'GANG', 'NARCOTICS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  fontSize: '10.5px',
                  fontWeight: categoryFilter === cat ? 600 : 500,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: categoryFilter === cat ? 'var(--accent-subtle, #eff6ff)' : 'var(--bg-subtle, #f8fafc)',
                  color: categoryFilter === cat ? 'var(--accent-primary, #1e40af)' : 'var(--text-muted, #64748b)',
                  border: categoryFilter === cat ? '1px solid var(--accent-primary, #bfdbfe)' : '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Suspects Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredSuspects.map((suspect) => {
              const isSelected = selectedSuspect?.id === suspect.id;
              return (
                <div
                  key={suspect.id}
                  onClick={() => setSelectedSuspect(suspect)}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-subtle, #eff6ff)' : 'var(--bg-card, #ffffff)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary, #1e40af)' : 'var(--border-color, #e2e8f0)'}`,
                    borderRadius: '6px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary, #1e40af)' }}>
                      {suspect.id}
                    </span>
                    <span className={suspect.threatLevel === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                      {suspect.threatLevel}
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                    {suspect.name}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
                    {suspect.crimeType}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px' }}>
                    <span style={{ color: 'var(--status-critical, #dc2626)', fontWeight: 600 }}>{suspect.status}</span>
                    <span style={{ color: 'var(--accent-primary, #1e40af)', fontWeight: 600 }}>Risk: {suspect.riskScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Complete 360° Forensic Dossier */}
        {selectedSuspect ? (
          <div
            className="cl-card"
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-card, #ffffff)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Dossier Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid var(--border-color, #e2e8f0)',
                paddingBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Photo Placeholder */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--accent-subtle, #eff6ff)',
                    border: '1.5px solid var(--border-strong, #bfdbfe)',
                    color: 'var(--accent-primary, #1e40af)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 800,
                    fontFamily: 'monospace'
                  }}
                >
                  {selectedSuspect.name.slice(0, 2)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary, #1e40af)' }}>
                      {selectedSuspect.id}
                    </span>
                    <span className={selectedSuspect.threatLevel === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}>
                      {selectedSuspect.status}
                    </span>
                    <span className="badge-info">
                      BOUNTY: {selectedSuspect.wantedReward}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #0f172a)', margin: 0 }}>
                    {selectedSuspect.name}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                    Aliases: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{selectedSuspect.aliases?.join(', ')}</strong> • Station: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{selectedSuspect.policeStation}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => showToast(`✓ Forensic Dossier PDF generated for ${selectedSuspect.name}`)}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Download size={13} />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('network', { suspect: selectedSuspect.name });
                    }
                  }}
                  className="btn-primary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  <Share2 size={13} />
                  <span>Map Gang Network</span>
                </button>
              </div>
            </div>

            {/* Forensic Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              {/* Card 1: Core Biometrics */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Fingerprint size={16} color="var(--accent-primary, #1e40af)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                    Physical Biometrics &amp; CCTNS Registry
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #475569)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>DOB: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{selectedSuspect.biometrics?.dob}</strong></div>
                  <div>Nationality: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{selectedSuspect.biometrics?.nationality}</strong></div>
                  <div>Scars &amp; Marks: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{selectedSuspect.biometrics?.scarsAndMarks}</strong></div>
                  <div>Facial Vector ID: <strong style={{ color: 'var(--accent-primary, #1e40af)', fontFamily: 'monospace' }}>{selectedSuspect.biometrics?.facialVectorId}</strong></div>
                  <div>Voiceprint Confidence: <strong style={{ color: 'var(--status-verified, #16a34a)' }}>{selectedSuspect.biometrics?.voiceprintConfidence}</strong></div>
                </div>
              </div>

              {/* Card 2: Modus Operandi & Weapons */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Shield size={16} color="var(--accent-primary, #1e40af)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                    Modus Operandi &amp; Weapon Signature
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #475569)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>Weapon Signature: <strong style={{ color: 'var(--status-critical, #dc2626)' }}>{selectedSuspect.weaponSignature}</strong></div>
                  <div>Modus Operandi: <p style={{ fontSize: '12px', color: 'var(--text-secondary, #334155)', margin: '4px 0 0 0', lineHeight: 1.4 }}>{selectedSuspect.modusOperandi}</p></div>
                  <div style={{ marginTop: '4px' }}>
                    DNA Forensic Profile: <strong style={{ color: 'var(--status-verified, #16a34a)' }}>{selectedSuspect.dnaProfileMatch}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: FIR Records & Legal Sections */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle, #f8fafc)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                padding: '14px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', marginBottom: '8px' }}>
                Pending Judicial FIRs &amp; Statutory Charges
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedSuspect.firNumbers?.map((fir, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-card, #ffffff)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: '4px',
                      fontSize: '12.5px'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{fir}</span>
                    <span className="badge-critical">NON-BAILABLE WARRANT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Known Associates & Syndicate Nexus */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle, #f8fafc)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '6px',
                padding: '14px'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', marginBottom: '8px' }}>
                Known Associates &amp; Gang Network Links
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                {selectedSuspect.knownAssociates?.map((assoc) => (
                  <div
                    key={assoc.id}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-card, #ffffff)',
                      border: '1px solid var(--border-color, #e2e8f0)',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                      {assoc.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>{assoc.relation}</div>
                    <div style={{ fontSize: '10.5px', fontWeight: 600, color: assoc.risk === 'CRITICAL' ? 'var(--status-critical, #dc2626)' : 'var(--status-warning, #d97706)', marginTop: '2px' }}>
                      Threat: {assoc.risk}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 5: Financial Accounts & Burner Devices */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}
            >
              {/* Financial */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={15} color="var(--accent-primary, #1e40af)" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>Financial Accounts</span>
                  </div>
                  <button
                    onClick={() => showToast(`✓ Asset Freeze Warrant submitted to RBI for ${selectedSuspect.name}`)}
                    className="btn-ghost"
                    style={{ fontSize: '11px', color: 'var(--status-critical, #dc2626)', padding: '2px 6px' }}
                  >
                    Freeze All Assets
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  {selectedSuspect.financialAccounts?.map((acc, i) => (
                    <div key={i} style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{acc.bank}</strong>: {acc.accNo} ({acc.balance})
                    </div>
                  ))}
                </div>
              </div>

              {/* Burner Devices */}
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Phone size={15} color="var(--accent-primary, #1e40af)" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>Intercepted Burner Devices (SIGINT)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  {selectedSuspect.burnerDevices?.map((dev, i) => (
                    <div key={i} style={{ padding: '6px 8px', backgroundColor: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '4px' }}>
                      <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{dev.number}</strong> (IMEI: {dev.imei})<br />
                      <span style={{ fontSize: '11px', color: 'var(--status-verified, #16a34a)' }}>● {dev.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cl-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted, #64748b)' }}>
            Select a suspect from the list to view the complete 360° Forensic Dossier.
          </div>
        )}
      </div>

      {/* Register Criminal Modal */}
      {isAddModalOpen && (
        <AddCriminalModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCriminalAdded={(newCrim) => {
            showToast(`✓ ${newCrim.name} registered into CCTNS registry.`);
            setSuspectsList([newCrim, ...suspectsList]);
            setSelectedSuspect(newCrim);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* Toast */}
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
