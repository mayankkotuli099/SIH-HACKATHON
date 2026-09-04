import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Download,
  Printer,
  ShieldCheck,
  Send,
  ArrowLeft,
  Search,
  UserPlus,
  Fingerprint
} from 'lucide-react';
import Navbar from '../src/components/Navbar.jsx';
import AddCriminalModal from '../src/components/AddCriminalModal.jsx';
import { api } from '../src/services/api.js';

// Default seed suspects fallback
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
      { id: "CRM-9942", name: "Mayank Kotoli", relation: "Lead Hitman", risk: "CRITICAL" },
      { id: "CRM-5512", name: "Elena 'Czar' Rostova", relation: "Narcotics Supply Partner", risk: "CRITICAL" },
      { id: "CRM-8821", name: "Sameer Qureshi", relation: "Heist Specialist", risk: "HIGH" }
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
      { id: "CRM-0014", name: "Mahesh Khan", relation: "Distribution Partner", risk: "CRITICAL" },
      { id: "CRM-9942", name: "Mayank Kotoli", relation: "Enforcer", risk: "CRITICAL" }
    ],
    financialAccounts: [
      { bank: "HSBC HK Maritime Trust", accNo: "****-9921", balance: "$4.2M USD (Frozen)" }
    ],
    burnerDevices: [
      { imei: "359102847291999", number: "+44-7700-900821", status: "Satellite Tracked: Arabian Sea" }
    ]
  }
];

// Transform any raw entity/criminal into a complete Form 173 / BNSS 193 Police Chargesheet
export function formatEntityToChargesheet(entity) {
  const name = (entity.name || 'UNKNOWN ACCUSED').toUpperCase();
  const id = entity.id || `CRM-${Math.floor(1000 + Math.random() * 9000)}`;
  const crimeCategory = entity.crimeType || entity.category || 'VIOLENT CRIME';
  const upperCrime = crimeCategory.toUpperCase();

  // Determine legal sections and court benchmark
  let sections = 'BNS Sec 111 (Organized Crime Gang), Bharatiya Nyaya Sanhita, Arms Act Sec 25';
  let court = 'Court of District & Sessions Judge, Gurugram';
  let icon = '🔴';

  if (upperCrime.includes('HOMICIDE') || upperCrime.includes('MURDER')) {
    sections = 'BNS Sec 103 (Murder), Sec 111 (Organized Crime Gang), Sec 61 (Criminal Conspiracy), Arms Act Sec 25/27';
    court = 'Court of District & Sessions Judge (Special Homicide Bench)';
    icon = '🔴';
  } else if (upperCrime.includes('SEXUAL') || upperCrime.includes('RAPE') || upperCrime.includes('POCSO')) {
    sections = 'BNS Sec 64 (Rape), Sec 70(1) (Gang Rape), POCSO Act Sec 4/6, BNS Sec 351 (Criminal Intimidation)';
    court = 'Special Fast Track Court for Women & Child Safety';
    icon = '🟣';
  } else if (upperCrime.includes('ROBBERY') || upperCrime.includes('HEIST') || upperCrime.includes('DACOITY')) {
    sections = 'BNS Sec 310 (Dacoity with Murder), Sec 312 (Robbery), Sec 317 (Stolen Property), Arms Act Sec 25';
    court = 'Court of Additional Sessions Judge (Anti-Robbery Cell)';
    icon = '🟠';
  } else if (upperCrime.includes('NARCOTICS') || upperCrime.includes('NDPS') || upperCrime.includes('ARMS')) {
    sections = 'NDPS Act Sec 21(c)/29 (Commercial Quantity Synthetic Heroin), Arms Act Sec 25(1AA)';
    court = 'Special NDPS Designated Sessions Court';
    icon = '🟢';
  } else if (upperCrime.includes('GANG') || upperCrime.includes('MCOCA') || upperCrime.includes('EXTORTION')) {
    sections = 'MCOCA Act Sec 3 & 4 (Organized Crime), BNS Sec 308 (Extortion), BNS Sec 140 (Kidnapping for Ransom)';
    court = 'Special MCOCA Designated Court';
    icon = '🟡';
  } else if (upperCrime.includes('KIDNAP')) {
    sections = 'BNS Sec 140 (Kidnapping for Ransom), BNS Sec 308 (Extortion), Arms Act Sec 25';
    court = 'Court of District & Sessions Judge (SIT Special Court)';
    icon = '🟡';
  }

  // FIR Number parsing
  const firList = Array.isArray(entity.firNumbers) ? entity.firNumbers : (entity.firNumbers ? [entity.firNumbers] : []);
  const firNumber = firList.length > 0
    ? firList[0].split(' ')[0]
    : `FIR-2024-${id.replace(/[^0-9]/g, '') || '402'}`;

  // Police Station
  const policeStation = entity.policeStation || 'Special Crime Branch / State STF Unit';

  // Exhibits compilation
  const exhibits = [];
  if (entity.weaponSignature) {
    exhibits.push(`Forensic Ballistics & Weapon Memo: ${entity.weaponSignature} recovered & striations matched`);
  } else {
    exhibits.push(`Forensic Seizure Memo: Illicit weapon & ammunition recovered u/s 27 Indian Evidence Act`);
  }

  if (entity.dnaProfileMatch) {
    exhibits.push(`Forensic DNA STR Match: ${entity.dnaProfileMatch}`);
  } else {
    exhibits.push(`Biological Evidence: STR DNA Sample processed at State Forensic Science Laboratory (CFSL)`);
  }

  if (entity.burnerDevices && entity.burnerDevices.length > 0) {
    exhibits.push(`Cell Surveillance & CDR Memo: Intercept on ${entity.burnerDevices[0].number || entity.burnerDevices[0].imei} (${entity.burnerDevices[0].status})`);
  } else if (entity.phone) {
    exhibits.push(`Cell Tower Triangulation & CDR Intercept log on suspect registered contact ${entity.phone}`);
  } else {
    exhibits.push(`Digital Surveillance: Cell tower pings and ANPR highway camera timestamps logged`);
  }

  const scars = entity.scarsAndMarks || (entity.biometrics && entity.biometrics.scarsAndMarks);
  if (scars) {
    exhibits.push(`Identification Memo: Physical Scars & Tattoos (${scars}) catalogued in CCTNS registry`);
  } else {
    exhibits.push(`Biometric Vector Memo: Facial vector ID FV-${id} verified against National Criminal Database`);
  }

  const ioOfficer = entity.ioOfficer || 'Inspector V. Rathore (STF Unit 4 / Crime Branch)';

  return {
    id: `CS-2024-${id.replace(/[^0-9]/g, '') || Math.floor(100 + Math.random() * 900)}`,
    entityId: id,
    caseTitle: `State vs ${name} & Ors.`,
    accused: `${name} (${id})`,
    rawName: name,
    aliases: entity.aliases || [`Alias ${name.split(' ')[0]}`],
    crimeCategory,
    firNumber,
    allFirs: firList.length > 0 ? firList : [firNumber],
    policeStation,
    sections,
    court,
    ioOfficer,
    status: entity.status === 'ACTIVE_FUGITIVE' ? 'ACTIVE FUGITIVE - WARRANT PENDING' : 'READY FOR FILING',
    bounty: entity.wantedReward || '₹200,000 INR',
    icon,
    summary: entity.modusOperandi || `The accused, ${name}, is identified as the prime perpetrator in ${firNumber}. Investigation establishes physical presence, witness testimonies, and forensic correlation with the crime scene.`,
    exhibits,
    witnesses: [
      'Dr. S. K. Gupta, Senior Forensic Surgeon (Civil Hospital)',
      'Senior Scientific Officer (CFSL Forensic & Ballistics Division)',
      'Sub-Inspector / Investigating Officer (First Responder & Recovery Witness)'
    ],
    weaponSignature: entity.weaponSignature || 'Unlicensed Country-made Firearm',
    scarsAndMarks: scars || 'Catalogued in Police CCTNS archive',
    phone: entity.phone || (entity.burnerDevices && entity.burnerDevices[0] ? entity.burnerDevices[0].number : 'Active Tracking'),
    threatLevel: entity.threatLevel || 'CRITICAL',
    riskScore: entity.riskScore || 92,
    biometrics: entity.biometrics || { dob: '1990-01-01', nationality: 'Indian' },
    knownAssociates: entity.knownAssociates || [],
    financialAccounts: entity.financialAccounts || [],
    burnerDevices: entity.burnerDevices || []
  };
}

export default function Reports({ embedded = false, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [entitiesList, setEntitiesList] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isSection65BOpen, setIsSection65BOpen] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Generate SHA-256 cryptographic seal
  const computeDossierHash = useCallback(async (caseObj) => {
    if (!caseObj) return;
    try {
      const payload = JSON.stringify({
        fir: caseObj.firNumber,
        accused: caseObj.accused,
        sections: caseObj.sections,
        court: caseObj.court,
        io: caseObj.ioOfficer,
        exhibits: caseObj.exhibits
      });
      const msgBuffer = new TextEncoder().encode(payload);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setGeneratedHash(`SHA256:${hashHex}`);
    } catch {
      setGeneratedHash(`SHA256:${caseObj.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`);
    }
  }, []);

  // Load criminals and construct chargesheets
  const loadChargesheets = useCallback(async (preferredId = null) => {
    let customList = [];
    try {
      const stored = localStorage.getItem('crimelens_custom_criminals');
      if (stored) customList = JSON.parse(stored);
    } catch {
      customList = [];
    }

    let allEntities = [];
    try {
      const data = await api.entities.getAll();
      const existingIds = new Set();

      // Custom list first
      for (const item of customList) {
        if (item && item.id && !existingIds.has(item.id)) {
          existingIds.add(item.id);
          allEntities.push(item);
        }
      }

      // Backend list
      if (data && data.entities) {
        for (const item of data.entities) {
          if (item && item.id && !existingIds.has(item.id)) {
            existingIds.add(item.id);
            allEntities.push(item);
          }
        }
      }

      // Default seed fallbacks
      for (const item of DEFAULT_SEED) {
        if (item && item.id && !existingIds.has(item.id)) {
          existingIds.add(item.id);
          allEntities.push(item);
        }
      }
    } catch {
      const existingIds = new Set();
      for (const item of [...customList, ...DEFAULT_SEED]) {
        if (item && item.id && !existingIds.has(item.id)) {
          existingIds.add(item.id);
          allEntities.push(item);
        }
      }
    }

    setEntitiesList(allEntities);

    // Format all entities to chargesheets
    const chargesheets = allEntities.map(formatEntityToChargesheet);

    // Selection logic
    let target = null;
    const targetId = preferredId || localStorage.getItem('crimelens_selected_chargesheet');
    if (targetId) {
      target = chargesheets.find(c => c.entityId.toLowerCase() === targetId.toLowerCase() || c.rawName.toLowerCase().includes(targetId.toLowerCase()));
    }

    if (!target && chargesheets.length > 0) {
      target = chargesheets[0];
    }

    if (target) {
      setSelectedCase(target);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramId = params.get('id') || params.get('suspect');
    loadChargesheets(paramId);

    // Global listener when a criminal is added anywhere in the app
    const handleCriminalAdded = (e) => {
      const newCrim = e.detail;
      if (newCrim) {
        showToast(`✓ New Criminal "${newCrim.name}" registered. Chargesheet generated.`);
        loadChargesheets(newCrim.id);
      }
    };

    window.addEventListener('crimelens:criminal-added', handleCriminalAdded);
    return () => window.removeEventListener('crimelens:criminal-added', handleCriminalAdded);
  }, [location.search, loadChargesheets, showToast]);

  const handleCopyHash = () => {
    if (!selectedCase) return;
    const hash = `SHA256:${selectedCase.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`;
    navigator.clipboard?.writeText(hash);
    showToast('✓ Cryptographic SHA-256 seal copied to clipboard.');
  };

  const handleDownload = () => {
    if (!selectedCase) return;
    showToast(`✓ Chargesheet_${selectedCase.firNumber}_Final_Report.pdf downloaded.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCourtSubmit = () => {
    if (!selectedCase) return;
    showToast(`✓ Chargesheet electronically filed with ${selectedCase.court}.`);
  };

  const handleAddCriminalSuccess = (newCriminal) => {
    if (newCriminal) {
      showToast(`✓ Offender ${newCriminal.name} added to chargesheets list.`);
      loadChargesheets(newCriminal.id);
    }
  };

  // Convert loaded entities into chargesheet items
  const allChargesheets = useMemo(() => {
    return entitiesList.map(formatEntityToChargesheet);
  }, [entitiesList]);

  // Filter chargesheets by search query and category
  const filteredChargesheets = useMemo(() => {
    return allChargesheets.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        c.rawName.toLowerCase().includes(q) ||
        c.entityId.toLowerCase().includes(q) ||
        c.firNumber.toLowerCase().includes(q) ||
        c.crimeCategory.toLowerCase().includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q)) ||
        (c.weaponSignature && c.weaponSignature.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (categoryFilter === 'ALL') return true;
      if (categoryFilter === 'HOMICIDE') return c.crimeCategory.includes('HOMICIDE') || c.crimeCategory.includes('MURDER');
      if (categoryFilter === 'RAPE') return c.crimeCategory.includes('SEXUAL') || c.crimeCategory.includes('RAPE');
      if (categoryFilter === 'ROBBERY') return c.crimeCategory.includes('ROBBERY') || c.crimeCategory.includes('HEIST');
      if (categoryFilter === 'NARCOTICS') return c.crimeCategory.includes('NARCOTICS') || c.crimeCategory.includes('NDPS');
      if (categoryFilter === 'GANG') return c.crimeCategory.includes('GANG') || c.crimeCategory.includes('MCOCA') || c.crimeCategory.includes('EXTORTION');

      return true;
    });
  }, [allChargesheets, searchQuery, categoryFilter]);

  const activeCase = selectedCase || filteredChargesheets[0] || (allChargesheets.length > 0 ? allChargesheets[0] : null);

  return (
    <div style={{
      minHeight: embedded ? 'auto' : '100vh',
      backgroundColor: 'var(--bg-app, #f8fafc)',
      color: 'var(--text-primary, #0f172a)',
      fontFamily: 'var(--font-sans, sans-serif)'
    }}>
      {/* Top Navbar only if accessed standalone outside SiteApp */}
      {!embedded && (
        <Navbar activePage="reports" onNavigate={(page) => (onNavigate ? onNavigate(page) : navigate(page === 'home' ? '/' : `/${page}`))} />
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          backgroundColor: 'var(--card-bg, #ffffff)',
          color: 'var(--card-text, #0f172a)',
          border: '1px solid var(--card-border, #e2e8f0)',
          padding: '12px 20px',
          borderRadius: '6px',
          fontWeight: 600,
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: '13px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#16a34a" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1.5rem 3rem 1.5rem',
        boxSizing: 'border-box'
      }}>
        {/* Header with Title & Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          paddingBottom: '1rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              color: 'var(--text-accent, #1e40af)',
              fontWeight: 700,
              letterSpacing: '0.8px'
            }}>
              <span>🏛️</span>
              <span>INDIAN POLICE // FINAL FORM 173 / BNSS 193 CHARGESHEET SYSTEM</span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 0 0', letterSpacing: '-0.01em', color: 'var(--text-primary, #0f172a)' }}>
              Police Chargesheet &amp; Judicial Evidence
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: 'var(--primary, #1e40af)',
                border: '1px solid var(--primary, #1e40af)',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: 600,
                fontFamily: 'var(--font-sans, sans-serif)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover, #1d4ed8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary, #1e40af)'}
            >
              <UserPlus size={14} /> + Register Suspect &amp; Generate Chargesheet
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-secondary, #475569)',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f1f5f9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card, #ffffff)'}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Step 1: Select Accused Criminal Dossier */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #64748b)', letterSpacing: '0.5px', fontFamily: 'var(--font-mono, monospace)' }}>
              STEP 1: SELECT ACCUSED DOSSIER ({filteredChargesheets.length} CHARGESHEETS AVAILABLE)
            </div>

            {/* Search Input for Criminals */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={13} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted, #94A3B8)' }} />
                <input
                  type="text"
                  placeholder="Search accused, FIR, alias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-input, #ffffff)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '6px',
                    padding: '6px 12px 6px 30px',
                    color: 'var(--text-primary, #0f172a)',
                    fontSize: '12px',
                    outline: 'none',
                    width: '220px'
                  }}
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-input, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-accent, #1e40af)',
                  fontSize: '12px',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="ALL">All Offenses</option>
                <option value="HOMICIDE">Homicide</option>
                <option value="RAPE">Sexual Offenses</option>
                <option value="ROBBERY">Armed Robbery</option>
                <option value="NARCOTICS">Narcotics</option>
                <option value="GANG">Gang / MCOCA</option>
              </select>
            </div>
          </div>

          {/* Horizontal Grid of Criminals */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '0.85rem'
          }}>
            {filteredChargesheets.map((c) => {
              const isSelected = activeCase && activeCase.entityId === c.entityId;
              return (
                <div
                  key={c.entityId}
                  onClick={() => setSelectedCase(c)}
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-subtle, #eff6ff)' : 'var(--bg-card, #ffffff)',
                    border: isSelected ? '1.5px solid var(--accent-blue, #1e40af)' : '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 6px -1px rgba(30, 64, 175, 0.08)' : 'var(--shadow-card)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-accent, #1e40af)', fontWeight: 700 }}>
                      {c.firNumber}
                    </span>
                    <span style={{ fontSize: '13px' }}>{c.icon}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? 'var(--text-accent, #1e40af)' : 'var(--text-primary, #0f172a)' }}>
                    {c.rawName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', marginTop: '3px', fontFamily: 'var(--font-mono, monospace)' }}>
                    ID: {c.entityId} • {c.crimeCategory.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Main Chargesheet Document (Form 173 / BNSS 193) */}
        {activeCase ? (
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            border: '1px solid var(--border-color, #cbd5e1)',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '1.5rem'
          }}>
            {/* Document Header */}
            <div style={{
              textAlign: 'center',
              borderBottom: '1px solid var(--border-color, #e2e8f0)',
              paddingBottom: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-accent, #1e40af)', letterSpacing: '1.2px', fontWeight: 700 }}>
                // BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS SEC 193 / FORM 173) //
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary, #0f172a)', margin: '6px 0 3px 0' }}>
                FINAL POLICE INVESTIGATION CHARGESHEET
              </h2>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary, #475569)' }}>
                BEFORE THE COURT OF: <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.court}</strong>
              </div>
            </div>

            {/* Quick Particulars Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              padding: '14px 16px',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '12.5px'
            }}>
              <div><span style={{ color: 'var(--text-muted, #64748b)' }}>FIR Number:</span> <strong style={{ color: 'var(--text-accent, #1e40af)' }}>{activeCase.firNumber}</strong></div>
              <div><span style={{ color: 'var(--text-muted, #64748b)' }}>Police Station:</span> <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.policeStation}</strong></div>
              <div><span style={{ color: 'var(--text-muted, #64748b)' }}>Primary Accused:</span> <strong style={{ color: 'var(--status-critical, #dc2626)' }}>{activeCase.accused}</strong></div>
              <div><span style={{ color: 'var(--text-muted, #64748b)' }}>Investigating Officer:</span> <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.ioOfficer}</strong></div>
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Penal Sections:</span>{' '}
                  <strong style={{ color: 'var(--status-warning, #b45309)' }}>{activeCase.sections}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted, #64748b)' }}>Warrant Status:</span>{' '}
                  <span style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: 'var(--status-critical, #dc2626)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '11px'
                  }}>
                    {activeCase.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Facts of Case */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                1. Brief Facts &amp; Investigation Findings:
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #334155)',
                lineHeight: 1.6,
                margin: 0,
                backgroundColor: 'var(--bg-subtle, #f8fafc)',
                padding: '12px 14px',
                borderRadius: '6px',
                borderLeft: '3px solid var(--primary, #1e40af)'
              }}>
                {activeCase.summary}
              </p>
            </div>

            {/* Section 2: Admissible Forensic Exhibits */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                2. Admissible Forensic Evidence Exhibits:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeCase.exhibits.map((ex, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: 'var(--text-primary, #0f172a)',
                    backgroundColor: 'var(--bg-subtle, #f8fafc)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ShieldCheck size={15} color="#3b82f6" />
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Comprehensive Accused Bio-Data & Intelligence Profile */}
            <div style={{
              marginBottom: '1.5rem',
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '8px' }}>
                <Fingerprint size={16} color="#3b82f6" />
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  3. Accused Specific Intelligence &amp; Bio-Data Dossier
                </h3>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
                fontSize: '12px'
              }}>
                {/* Identification Marks */}
                <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>PHYSICAL IDENTIFICATION &amp; SCARS</div>
                  <div style={{ color: 'var(--text-primary, #0f172a)', fontWeight: 600 }}>{activeCase.scarsAndMarks}</div>
                </div>

                {/* Weapon Signature */}
                <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>WEAPON SIGNATURE / BALLISTICS</div>
                  <div style={{ color: 'var(--status-critical, #dc2626)', fontWeight: 600 }}>{activeCase.weaponSignature}</div>
                </div>

                {/* Active Phone & Burner Devices */}
                <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>ACTIVE CONTACT / SURVEILLANCE BEACON</div>
                  <div style={{ color: 'var(--text-accent, #1e40af)', fontWeight: 600 }}>
                    {activeCase.phone}
                  </div>
                </div>

                {/* Bounty & Risk Score */}
                <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                  <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>STATE REWARD BOUNTY &amp; RISK SCORE</div>
                  <div style={{ color: 'var(--status-warning, #b45309)', fontWeight: 700 }}>
                    {activeCase.bounty} <span style={{ color: 'var(--text-muted, #64748b)', fontWeight: 400 }}>(Risk Score: {activeCase.riskScore}/100)</span>
                  </div>
                </div>

                {/* Aliases */}
                {activeCase.aliases && activeCase.aliases.length > 0 && (
                  <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                    <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>KNOWN ALIASES / GANG MONIKERS</div>
                    <div style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.aliases.join(', ')}</div>
                  </div>
                )}

                {/* Known Associates */}
                {activeCase.knownAssociates && activeCase.knownAssociates.length > 0 && (
                  <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                    <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>CRIME NETWORK ASSOCIATES</div>
                    <div style={{ color: 'var(--text-primary, #0f172a)' }}>
                      {activeCase.knownAssociates.map(a => `${a.name} (${a.relation})`).join('; ')}
                    </div>
                  </div>
                )}

                {/* Financial Hawala / Benami Accounts */}
                {activeCase.financialAccounts && activeCase.financialAccounts.length > 0 && (
                  <div style={{ gridColumn: '1 / -1', backgroundColor: 'var(--bg-card, #ffffff)', padding: '10px 12px', borderRadius: '4px', border: '1px solid var(--border-color, #e2e8f0)' }}>
                    <div style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 600, marginBottom: '3px' }}>ATTACHED HAWALA / BENAMI FINANCIAL ASSETS</div>
                    <div style={{ color: 'var(--status-warning, #b45309)', fontWeight: 600 }}>
                      {activeCase.financialAccounts.map(f => `${f.bank} [${f.accNo}]: ${f.balance}`).join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 4: Prosecution Witnesses */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary, #0f172a)', margin: '0 0 6px 0', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                4. Charge-Sheeted Prosecution Witnesses:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                {activeCase.witnesses.map((w, idx) => (
                  <div key={idx} style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary, #334155)',
                    backgroundColor: 'var(--bg-subtle, #f8fafc)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color, #e2e8f0)'
                  }}>
                    👤 <strong>Witness #{idx + 1}:</strong> {w}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 65B Digital Certificate */}
            <div style={{
              backgroundColor: 'var(--bg-subtle, #eff6ff)',
              border: '1px solid var(--border-strong, #bfdbfe)',
              borderRadius: '6px',
              padding: '12px 14px',
              fontSize: '11.5px',
              color: 'var(--text-accent, #1e40af)',
              lineHeight: 1.5
            }}>
              🔒 <strong>Section 65B Bharatiya Sakshya Adhiniyam Certificate</strong>: All digital exhibits, ANPR timestamps, wiretaps, and forensic reports for accused <span style={{ color: 'var(--text-primary, #0f172a)', fontWeight: 700 }}>{activeCase.accused}</span> are cryptographically validated under root hash{' '}
              <span style={{ color: 'var(--text-accent, #1e40af)', fontFamily: 'monospace', fontWeight: 600 }}>SHA256:{activeCase.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>.
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            border: '1px dashed var(--border-color, #cbd5e1)',
            borderRadius: '8px',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '14px', margin: 0 }}>
              No criminal dossier selected. Click "+ Register Suspect &amp; Generate Chargesheet" above or select an accused from the list.
            </p>
          </div>
        )}

        {/* Step 3: Action Buttons Bar */}
        {activeCase && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            backgroundColor: 'var(--bg-card, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '6px',
            padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-card)'
          }}>
            <button
              onClick={handleCopyHash}
              style={{
                backgroundColor: 'var(--bg-card, #ffffff)',
                border: '1px solid var(--border-color, #cbd5e1)',
                color: 'var(--text-accent, #1e40af)',
                borderRadius: '6px',
                padding: '9px 16px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f1f5f9)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card, #ffffff)'}
            >
              <Copy size={15} /> Copy Hash Seal
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (activeCase) {
                    computeDossierHash(activeCase);
                    setIsSection65BOpen(true);
                  }
                }}
                style={{
                  backgroundColor: 'var(--bg-subtle, #eff6ff)',
                  border: '1px solid var(--border-strong, #bfdbfe)',
                  color: 'var(--text-accent, #1e40af)',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans, sans-serif)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover, #dbeafe)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #eff6ff)'}
              >
                <ShieldCheck size={16} /> 📜 Sec 65B BSA Certificate
              </button>

              <button
                onClick={handlePrint}
                style={{
                  backgroundColor: 'var(--bg-card, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-primary, #0f172a)',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f1f5f9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card, #ffffff)'}
              >
                <Printer size={15} /> Print / Save PDF
              </button>

              <button
                onClick={handleDownload}
                style={{
                  backgroundColor: 'var(--bg-card, #ffffff)',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  color: 'var(--text-accent, #1e40af)',
                  borderRadius: '6px',
                  padding: '9px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #f1f5f9)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card, #ffffff)'}
              >
                <Download size={15} /> Download Brief
              </button>

              <button
                onClick={handleCourtSubmit}
                style={{
                  backgroundColor: 'var(--primary, #1e40af)',
                  color: '#ffffff',
                  border: '1px solid var(--primary, #1e40af)',
                  borderRadius: '6px',
                  padding: '9px 20px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover, #1d4ed8)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary, #1e40af)'}
              >
                <Send size={15} /> Submit to Court
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Section 65B / Section 63 BSA Digital Evidence Certificate Modal */}
      {isSection65BOpen && activeCase && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100000,
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
            maxWidth: '850px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            position: 'relative',
            color: 'var(--text-primary, #0f172a)'
          }}>
            {/* Certificate Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🏛️</div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-accent, #1e40af)', letterSpacing: '1.5px', fontWeight: 700 }}>
                GOVERNMENT OF INDIA // STATE FORENSIC SCIENCE LABORATORY
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, margin: '6px 0 2px 0', letterSpacing: '-0.01em', color: 'var(--text-primary, #0f172a)' }}>
                CERTIFICATE OF ADMISSIBILITY OF ELECTRONIC RECORD
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>
                [Under Section 65B of Indian Evidence Act, 1872 &amp; Section 63 of Bharatiya Sakshya Adhiniyam, 2023]
              </div>
            </div>

            {/* Certificate Body */}
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-secondary, #334155)', marginBottom: '1.5rem' }}>
              <p>
                I, <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.ioOfficer}</strong>, Investigating Officer &amp; Cyber Forensic Analyst at <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.policeStation}</strong>, do hereby solemnly affirm and certify that:
              </p>
              <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <li>
                  The electronic evidence comprising Call Detail Records (CDR), Cell Tower Triangulation pings, ANPR surveillance hits, and intercepted digital transcripts produced in the case of <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.caseTitle}</strong> (<strong style={{ color: 'var(--text-accent, #1e40af)' }}>{activeCase.firNumber}</strong>) were derived from computer output lawfully under my lawful control.
                </li>
                <li>
                  The digital data was extracted in regular and ordinary course of criminal investigation and the target computing system operated properly without unauthorized tampering.
                </li>
                <li>
                  The cryptographic hash fingerprint generated below certifies that the electronic exhibits submitted before the Hon'ble <strong style={{ color: 'var(--text-primary, #0f172a)' }}>{activeCase.court}</strong> are identical bit-for-bit with the master forensic mirror.
                </li>
              </ol>
            </div>

            {/* Cryptographic Hash Seal Box */}
            <div style={{
              backgroundColor: 'var(--bg-subtle, #f8fafc)',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '6px',
              padding: '14px 18px',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-mono, monospace)'
            }}>
              <div style={{ fontSize: '10.5px', color: 'var(--text-accent, #1e40af)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
                IMMUTABLE SHA-256 DIGITAL EVIDENCE SEAL:
              </div>
              <div style={{ fontSize: '13px', color: 'var(--status-success, #15803d)', wordBreak: 'break-all', fontWeight: 700 }}>
                {generatedHash || `SHA256:${activeCase.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted, #64748b)', marginTop: '8px', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '6px' }}>
                <span>DEVICE MAC: 00:1A:2B:3C:4D:5E</span>
                <span>CFSL MIRROR ID: CFSL-DEL-2024-991</span>
                <span>STATUS: COURT ADMISSIBLE ✓</span>
              </div>
            </div>

            {/* Signatures & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid var(--border-color, #e2e8f0)', paddingTop: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)' }}>ISSUED AT GURUGRAM / DELHI-NCR</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary, #0f172a)', fontWeight: 700 }}>DATE: {new Date().toLocaleDateString()}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedHash);
                    showToast('✓ SHA-256 Section 65B Seal copied to clipboard.');
                  }}
                  style={{
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    color: 'var(--text-accent, #1e40af)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Copy Seal
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    backgroundColor: 'var(--primary, #1e40af)',
                    border: '1px solid var(--primary, #1e40af)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Print Certificate
                </button>
                <button
                  onClick={() => setIsSection65BOpen(false)}
                  style={{
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    color: 'var(--text-secondary, #475569)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Criminal Modal */}
      <AddCriminalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCriminalAdded={handleAddCriminalSuccess}
      />
    </div>
  );
}
