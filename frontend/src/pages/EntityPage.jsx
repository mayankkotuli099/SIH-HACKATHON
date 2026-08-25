import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import AddCriminalModal from '../components/AddCriminalModal.jsx';

export default function EntityPage({ onNavigate }) {
  const [exportNotification, setExportNotification] = useState(false);
  const [freezeNotification, setFreezeNotification] = useState(false);
  const [warrantNotification, setWarrantNotification] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entitiesList, setEntitiesList] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Default seed suspects if offline
  const DEFAULT_SEED = [
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
      status: "ACTIVE_FUGITIVE",
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
      status: "ACTIVE_FUGITIVE",
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
      status: "ACTIVE_TRACKING",
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
        { id: "CRM-0014", name: "Mahesh Khan", relation: "Syndicate Boss / Fencer", risk: "CRITICAL" }
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
      status: "WARRANT_ISSUED",
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
        { id: "CRM-9942", name: "Mayank Kotoli", relation: "Lead Hitman", risk: "CRITICAL" }
      ],
      financialAccounts: [
        { bank: "Dubai Bullion Vault", accNo: "****-9102", balance: "$1.8M Gold Bullion" }
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
      status: "ACTIVE_SURVEILLANCE",
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
        { id: "CRM-0014", name: "Mahesh Khan", relation: "Distribution Partner", risk: "CRITICAL" }
      ],
      financialAccounts: [
        { bank: "HSBC HK Maritime Trust", accNo: "****-9921", balance: "$4.2M USD (Frozen)" }
      ],
      burnerDevices: [
        { imei: "359102847291999", number: "+44-7700-900821", status: "Satellite Tracked: Arabian Sea" }
      ]
    }
  ];

  // Load backend entities and merge with local custom entities
  const loadEntities = async () => {
    let customList = [];
    try {
      const stored = localStorage.getItem('crimelens_custom_criminals');
      if (stored) customList = JSON.parse(stored);
    } catch {
      customList = [];
    }

    try {
      const data = await api.entities.getAll();
      let merged = [];
      const existingIds = new Set();

      // Custom list first
      for (const item of customList) {
        if (!existingIds.has(item.id)) {
          existingIds.add(item.id);
          merged.push(item);
        }
      }

      if (data && data.entities && data.entities.length > 0) {
        for (const item of data.entities) {
          if (!existingIds.has(item.id)) {
            existingIds.add(item.id);
            merged.push(item);
          }
        }
      } else {
        for (const item of DEFAULT_SEED) {
          if (!existingIds.has(item.id)) {
            existingIds.add(item.id);
            merged.push(item);
          }
        }
      }

      setEntitiesList(merged);

      // Check URL parameters for selected suspect
      const params = new URLSearchParams(window.location.search);
      const suspectParam = params.get('suspect');
      const idParam = params.get('id');

      if (suspectParam || idParam) {
        const found = merged.find(c =>
          (idParam && c.id.toLowerCase() === idParam.toLowerCase()) ||
          (suspectParam && c.name.toLowerCase().includes(suspectParam.toLowerCase()))
        );
        if (found) {
          setSelectedEntity(found);
          return;
        }
      }

      if (merged.length > 0 && !selectedEntity) {
        setSelectedEntity(merged[0]);
      }
    } catch (err) {
      console.warn('Using local fallback criminal directory:', err);
      const existingIds = new Set();
      const merged = [];
      for (const item of [...customList, ...DEFAULT_SEED]) {
        if (!existingIds.has(item.id)) {
          existingIds.add(item.id);
          merged.push(item);
        }
      }
      setEntitiesList(merged);
      if (!selectedEntity && merged.length > 0) {
        setSelectedEntity(merged[0]);
      }
    }
  };

  useEffect(() => {
    loadEntities();

    // Listen for global criminal added event
    const handleGlobalAdded = (e) => {
      const newCrim = e.detail;
      if (newCrim) {
        handleCriminalAdded(newCrim);
      }
    };

    window.addEventListener('crimelens:criminal-added', handleGlobalAdded);
    return () => window.removeEventListener('crimelens:criminal-added', handleGlobalAdded);
  }, []);

  const handleCriminalAdded = (newCrim) => {
    if (!newCrim) return;

    // Reset filters so the new criminal is guaranteed visible
    setSelectedCategory('ALL');
    setSearchQuery('');

    // Prepend to state
    setEntitiesList((prev) => {
      const updated = [newCrim, ...prev.filter(c => c.id !== newCrim.id)];
      // Save custom criminals in localStorage for permanent persistence
      try {
        const stored = JSON.parse(localStorage.getItem('crimelens_custom_criminals') || '[]');
        const updatedStored = [newCrim, ...stored.filter(c => c.id !== newCrim.id)];
        localStorage.setItem('crimelens_custom_criminals', JSON.stringify(updatedStored));
      } catch (e) {
        console.warn('Failed to save to local storage', e);
      }
      return updated;
    });

    setSelectedEntity(newCrim);
    setWarrantNotification(true);
    setTimeout(() => setWarrantNotification(false), 3500);

    // Smooth scroll down to the 360 dossier view
    setTimeout(() => {
      const el = document.getElementById('dossier-view');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleExport = () => {
    setExportNotification(true);
    setTimeout(() => setExportNotification(false), 3200);
  };

  const handleFreeze = () => {
    setFreezeNotification(true);
    setTimeout(() => setFreezeNotification(false), 3200);
  };

  const handleWarrant = () => {
    setWarrantNotification(true);
    setTimeout(() => setWarrantNotification(false), 3200);
  };

  // Filter criminals by search and category
  const filteredCriminals = entitiesList.filter((crim) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      crim.name.toLowerCase().includes(q) ||
      crim.id.toLowerCase().includes(q) ||
      (crim.crimeType && crim.crimeType.toLowerCase().includes(q)) ||
      (crim.aliases && crim.aliases.some(a => a.toLowerCase().includes(q))) ||
      (crim.firNumbers && crim.firNumbers.some(f => f.toLowerCase().includes(q))) ||
      (crim.weaponSignature && crim.weaponSignature.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'HOMICIDE') return crim.crimeType.includes('HOMICIDE') || crim.crimeType.includes('MURDER');
    if (selectedCategory === 'RAPE') return crim.crimeType.includes('SEXUAL') || crim.crimeType.includes('RAPE');
    if (selectedCategory === 'ROBBERY') return crim.crimeType.includes('ROBBERY') || crim.crimeType.includes('HEIST');
    if (selectedCategory === 'NARCOTICS') return crim.crimeType.includes('NARCOTICS') || crim.crimeType.includes('NDPS');
    if (selectedCategory === 'GANG') return crim.crimeType.includes('GANG') || crim.crimeType.includes('MCOCA') || crim.crimeType.includes('EXTORTION');

    return true;
  });

  const active = selectedEntity || entitiesList[0] || DEFAULT_SEED[0];

  return (
    <div style={{
      flex: 1,
      minHeight: 'calc(100vh - 68px)',
      backgroundColor: 'var(--bg-dark, #07090E)',
      color: 'var(--text-primary, #FFFFFF)',
      fontFamily: 'var(--font-sans, sans-serif)',
      padding: '2rem 2.5rem 3rem 2.5rem',
      position: 'relative',
      maxWidth: '1440px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Toast Notifications */}
      {exportNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(0, 229, 255, 0.95)',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓ POLICE CHARGESHEET & CRIMINAL DOSSIER EXPORTED (PDF / SEALED XML)</span>
        </div>
      )}

      {freezeNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'rgba(255, 85, 85, 0.95)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(255, 85, 85, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🚨 EMERGENCY ASSET FREEZE & ILLEGAL WEAPON SEIZURE DISPATCHED</span>
        </div>
      )}

      {warrantNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: '#FBBF24',
          color: '#07090E',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚖ CRIMINAL RECORD REGISTERED IN CCTNS // NON-BAILABLE WARRANT ACTIVE</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
            <span>NATIONAL CRIME RECORDS & POLICE INTELLIGENCE DIRECTORY</span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 4px 0',
            letterSpacing: '0.5px'
          }}>
            CRIMINAL 360° INTELLIGENCE REPOSITORY
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary, #94A3B8)' }}>
            Track Wanted Fugitives, FIR History, Weapon Signatures, Modus Operandi & Forensic Evidence
          </p>
        </div>

        {/* Big Action: + REGISTER NEW CRIMINAL RECORD */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#00E5FF',
            color: '#07090E',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 22px',
            fontWeight: 800,
            fontSize: '13px',
            fontFamily: 'var(--font-mono, monospace)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.45)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.45)';
          }}
        >
          <span style={{ fontSize: '16px' }}>🚨</span>
          <span>+ ADD NEW CRIMINAL RECORD</span>
        </button>
      </div>

      {/* Search & Crime Category Filter Bar */}
      <div style={{
        backgroundColor: 'rgba(12, 17, 26, 0.85)',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Quick Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search by Offender Name, FIR Number, Alias, Weapon, Vehicle Plate..."
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

          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #94A3B8)' }}>
            SHOWING <strong style={{ color: '#00E5FF' }}>{filteredCriminals.length}</strong> REGISTERED OFFENDERS
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `ALL CRIMINALS (${entitiesList.length})` },
            { id: 'HOMICIDE', label: '🔴 HOMICIDE / MURDER' },
            { id: 'RAPE', label: '🟣 SEXUAL OFFENSES / RAPE' },
            { id: 'ROBBERY', label: '🟠 ARMED ROBBERY / THEFT' },
            { id: 'NARCOTICS', label: '🟢 NARCOTICS / NDPS' },
            { id: 'GANG', label: '🔵 GANG / EXTORTION' }
          ].map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Criminal Record Cards Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👤</span>
            <span>CRIMINAL OFFENDER ROSTER (SELECT A CARD TO INSPECT 360° DOSSIER)</span>
          </h2>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #94A3B8)' }}>
            CLICK ANY CARD BELOW FOR FULL POLICE REPORT
          </span>
        </div>

        {filteredCriminals.length === 0 ? (
          <div style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'rgba(12, 17, 26, 0.6)',
            borderRadius: '8px',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ color: '#94A3B8', margin: '0 0 1rem 0' }}>No criminal records matching your query.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#00E5FF',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontWeight: 700,
                color: '#07090E',
                cursor: 'pointer'
              }}
            >
              + Register New Criminal
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredCriminals.map((crim) => {
              const isSelected = active.id === crim.id;
              const isNewlyAdded = !['CRM-9942', 'CRM-7721', 'CRM-8821', 'CRM-0014', 'CRM-5512'].includes(crim.id);

              return (
                <div
                  key={crim.id}
                  onClick={() => {
                    setSelectedEntity(crim);
                    setTimeout(() => {
                      const el = document.getElementById('dossier-view');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(12, 17, 26, 0.9)',
                    border: isSelected ? '1.5px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 25px rgba(0, 229, 255, 0.25)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {/* Newly Added Badge */}
                  {isNewlyAdded && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '12px',
                      backgroundColor: '#00E676',
                      color: '#07090E',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono, monospace)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      boxShadow: '0 0 10px rgba(0, 230, 118, 0.5)'
                    }}>
                      ✨ NEWLY REGISTERED
                    </div>
                  )}

                  {/* Card Header: Photo Placeholder & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.2)' : 'rgba(7, 10, 16, 0.95)',
                      border: `1px solid ${isSelected ? '#00E5FF' : 'rgba(255, 255, 255, 0.2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px'
                    }}>
                      {crim.crimeType.includes('HOMICIDE') ? '🔴' :
                       crim.crimeType.includes('SEXUAL') ? '🟣' :
                       crim.crimeType.includes('ROBBERY') ? '🟠' :
                       crim.crimeType.includes('NARCOTICS') ? '🟢' : '🔵'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: isSelected ? '#00E5FF' : '#FFFFFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {crim.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
                        ID: {crim.id}
                      </div>
                    </div>
                  </div>

                  {/* Crime Category Badge */}
                  <div style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 700,
                    color: '#00E5FF',
                    backgroundColor: 'rgba(0, 229, 255, 0.08)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    marginBottom: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {crim.crimeType}
                  </div>

                  {/* FIR Record & Bounty */}
                  <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    <div>⚖ <strong style={{ color: '#FFFFFF' }}>{crim.firNumbers?.[0] || 'FIR Pending'}</strong></div>
                    <div style={{ color: '#FBBF24', fontWeight: 700, marginTop: '2px' }}>
                      💰 Bounty: {crim.wantedReward || '₹100,000 INR'}
                    </div>
                  </div>

                  {/* Card Footer: Threat and Button */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.65rem'
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono, monospace)',
                      color: crim.threatLevel === 'CRITICAL' ? '#FF5555' : '#FBBF24',
                      backgroundColor: crim.threatLevel === 'CRITICAL' ? 'rgba(255, 85, 85, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}>
                      {crim.threatLevel}
                    </span>

                    <span style={{
                      fontSize: '11px',
                      color: isSelected ? '#00E5FF' : '#94A3B8',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {isSelected ? 'ACTIVE DOSSIER ✓' : 'VIEW 360° →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Selected Criminal 360° Dossier View */}
      <div id="dossier-view" style={{
        borderTop: '2px solid rgba(0, 229, 255, 0.3)',
        paddingTop: '2rem'
      }}>
        {/* Dossier Banner */}
        <div style={{
          backgroundColor: 'rgba(12, 17, 26, 0.95)',
          border: '1px solid #00E5FF',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF', marginBottom: '2px' }}>
              // SELECTED DOSSIER INTAKE // STATE POLICE HEADQUARTERS
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              {active.name} ({active.id})
            </h2>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontFamily: 'var(--font-mono, monospace)' }}>
              ALIASES: <strong style={{ color: '#00E5FF' }}>{active.aliases?.join(', ') || 'None'}</strong> • CRIME: <strong style={{ color: '#FF5555' }}>{active.crimeType}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate('network', { suspect: active.name });
                }
              }}
              className="interactive-btn"
              style={{
                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                border: '1.5px solid #00E5FF',
                color: '#00E5FF',
                borderRadius: '5px',
                padding: '9px 14px',
                fontWeight: 800,
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🕸️</span>
              <span>VIEW GANG NETWORK</span>
            </button>

            <button
              onClick={handleWarrant}
              style={{
                backgroundColor: '#FBBF24',
                color: '#07090E',
                border: 'none',
                borderRadius: '5px',
                padding: '9px 14px',
                fontWeight: 800,
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)'
              }}
            >
              ⚖ ISSUE NON-BAILABLE WARRANT
            </button>

            <button
              onClick={handleExport}
              className="btn-cyan"
              style={{ padding: '9px 14px', fontSize: '11.5px' }}
            >
              📄 EXPORT POLICE CHARGESHEET
            </button>

            <button
              onClick={handleFreeze}
              style={{
                backgroundColor: '#FF5555',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '5px',
                padding: '9px 14px',
                fontWeight: 800,
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono, monospace)',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(255, 85, 85, 0.4)'
              }}
            >
              🚫 FREEZE ASSETS & RAID
            </button>
          </div>
        </div>

        {/* 4-Card Intelligence Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Card 1: Identification & Physical Scars */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            border: '1px solid rgba(0, 229, 255, 0.18)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#00E5FF', margin: '0 0 0.85rem 0' }}>
              👤 IDENTIFICATION & BIOMETRICS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div><span style={{ color: '#94A3B8' }}>Offender Name:</span> <strong style={{ color: '#FFFFFF' }}>{active.name}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Date of Birth / Age:</span> <strong style={{ color: '#FFFFFF' }}>{active.biometrics?.dob || '1987-05-14'}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Nationality & Warrants:</span> <strong style={{ color: '#FFFFFF' }}>{active.biometrics?.nationality || 'Indian'}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Scars / Tattoos:</span> <strong style={{ color: '#FBBF24' }}>{active.biometrics?.scarsAndMarks || 'Identification marks catalogued'}</strong></div>
              <div><span style={{ color: '#94A3B8' }}>Facial Vector ID:</span> <strong style={{ color: '#00E5FF', fontFamily: 'var(--font-mono, monospace)' }}>{active.biometrics?.facialVectorId || `FV-${active.id}`}</strong></div>
              <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '6px' }}>
                <span style={{ color: '#94A3B8' }}>Recidivism Threat Score:</span> <strong style={{ color: '#FF5555', fontFamily: 'var(--font-mono, monospace)' }}>{active.riskScore || 95}% (CRITICAL)</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Crime MO & FIR Records */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FBBF24', margin: '0 0 0.85rem 0' }}>
              ⚖ MODUS OPERANDI & FIR RECORDS
            </h3>
            <div style={{ fontSize: '12.5px', color: '#E2E8F0', marginBottom: '0.85rem', lineHeight: 1.5 }}>
              <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '2px' }}>CRIME PATTERN:</strong>
              {active.modusOperandi || 'Active repeat offender under active State Police and STF surveillance.'}
            </div>

            <div style={{ fontSize: '12.5px', marginBottom: '0.85rem' }}>
              <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '2px' }}>WEAPON SIGNATURE:</strong>
              <span style={{ color: '#FF8888', fontWeight: 700 }}>{active.weaponSignature || 'Illegal Firearm / Edged Weapon'}</span>
            </div>

            <div>
              <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '4px' }}>REGISTERED FIRs:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(active.firNumbers || ["FIR-2024-PENDING"]).map((fir) => (
                  <div key={fir} style={{
                    backgroundColor: 'rgba(255, 85, 85, 0.08)',
                    border: '1px solid rgba(255, 85, 85, 0.2)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    color: '#FF8888',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}>
                    {fir}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Forensic Ballistics & DNA Matching */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#00E5FF', margin: '0 0 0.85rem 0' }}>
              🧬 FORENSIC DNA & BALLISTICS PROOF
            </h3>
            <div style={{
              backgroundColor: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '12px',
              color: '#00E5FF',
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '0.75rem'
            }}>
              {active.dnaProfileMatch || 'CFSL Forensic Certified STR Profile Indexed'}
            </div>
            <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
              Admissible in Sessions Court under Bharatiya Sakshya Adhiniyam / Evidence Act. Ballistic chamber striations catalogued.
            </p>
            <div style={{ fontSize: '12px', color: '#CBD5E1' }}>
              <div>State Police Reward: <strong style={{ color: '#FBBF24' }}>{active.wantedReward || '₹200,000 INR'}</strong></div>
              <div style={{ marginTop: '2px' }}>Investigation Unit: <strong style={{ color: '#FFFFFF' }}>{active.policeStation || 'State Crime Branch STF'}</strong></div>
            </div>
          </div>

          {/* Card 4: Gang Associates & Crime Proceeds */}
          <div className="glass-card" style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(12, 17, 26, 0.85)',
            border: '1px solid rgba(0, 229, 255, 0.18)',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.85rem 0' }}>
              💰 CRIME PROCEEDS & ASSOCIATES
            </h3>

            <div style={{ marginBottom: '0.85rem' }}>
              <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '4px' }}>KNOWN GANG ACCOMPLICES:</strong>
              {active.knownAssociates && active.knownAssociates.length > 0 ? (
                active.knownAssociates.map((a) => (
                  <div key={a.id || a.name} style={{ fontSize: '11.5px', color: '#FFFFFF', marginBottom: '3px' }}>
                    • {a.name} ({a.relation}) - <span style={{ color: a.risk === 'CRITICAL' ? '#FF5555' : '#FBBF24' }}>{a.risk}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Co-conspirators under active wiretap surveillance.</div>
              )}
            </div>

            <div>
              <strong style={{ color: '#94A3B8', display: 'block', fontSize: '11px', marginBottom: '4px' }}>SEIZED ASSETS & PHONES:</strong>
              {active.financialAccounts && active.financialAccounts.length > 0 ? (
                active.financialAccounts.map((acc) => (
                  <div key={acc.bank} style={{ fontSize: '11.5px', color: '#00E676', fontFamily: 'var(--font-mono, monospace)' }}>
                    • {acc.bank}: {acc.balance}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '11.5px', color: '#00E676', fontFamily: 'var(--font-mono, monospace)' }}>
                  • Benami Hawala Assets (Under Attachment)
                </div>
              )}
              {active.burnerDevices && active.burnerDevices.length > 0 && (
                <div style={{ fontSize: '11.5px', color: '#00E5FF', fontFamily: 'var(--font-mono, monospace)', marginTop: '4px' }}>
                  • IMEI Signal: {active.burnerDevices[0].number} ({active.burnerDevices[0].status})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Police Criminal Intake Modal */}
      <AddCriminalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCriminalAdded={handleCriminalAdded}
      />
    </div>
  );
}
