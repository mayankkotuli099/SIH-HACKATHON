import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api.js';

const CRIMINAL_FIR_POLICE_STATIONS = [
  // MAYANK KOTOLI
  {
    id: 'FIR-STN-01',
    criminalName: 'Mayank Kotoli',
    criminalId: 'CRM-9942',
    firNumber: 'FIR-2024-402',
    stationName: 'PS Sector 18 (Crime Branch)',
    city: 'Gurugram, Haryana',
    lat: 28.4721,
    lng: 77.0392,
    sections: 'BNS Sec 103 (Murder), Sec 111 (Organized Hit)',
    crimeType: 'Homicide / Contract Killing',
    date: '2024-10-27',
    ioOfficer: 'Inspector V. Rathore (STF Unit 4)',
    status: 'ACTIVE MANHUNT / NBW ISSUED',
    color: '#FF5555'
  },
  {
    id: 'FIR-STN-02',
    criminalName: 'Mayank Kotoli',
    criminalId: 'CRM-9942',
    firNumber: 'FIR-2023-881',
    stationName: 'PS Civil Lines (Special Cell)',
    city: 'Meerut, Uttar Pradesh',
    lat: 28.9845,
    lng: 77.7064,
    sections: 'IPC Sec 307 (Attempt to Murder), Arms Act 25',
    crimeType: 'Gang Rivalry Shootout',
    date: '2023-08-14',
    ioOfficer: 'SI Ravinder Singh',
    status: 'CHARGESHEET SUBMITTED',
    color: '#FF5555'
  },
  {
    id: 'FIR-STN-03',
    criminalName: 'Mayank Kotoli',
    criminalId: 'CRM-9942',
    firNumber: 'FIR-2022-119',
    stationName: 'PS Sadar Faridabad',
    city: 'Faridabad, Haryana',
    lat: 28.4089,
    lng: 77.3178,
    sections: 'Arms Act Sec 25/27, IPC 387 (Extortion)',
    crimeType: 'Illegal Firearms Possession',
    date: '2022-03-29',
    ioOfficer: 'Inspector Ankit Malik',
    status: 'NON-BAILABLE WARRANT',
    color: '#FF5555'
  },
  {
    id: 'FIR-STN-04',
    criminalName: 'Mayank Kotoli',
    criminalId: 'CRM-9942',
    firNumber: 'FIR-2024-911',
    stationName: 'Special Cell STF HQ Lodhi Road',
    city: 'New Delhi',
    lat: 28.5880,
    lng: 77.2220,
    sections: 'MCOCA Act Sec 3, BNS Sec 109',
    crimeType: 'Inter-State Syndicate Conspiracy',
    date: '2024-05-19',
    ioOfficer: 'ACP Alok Sharma',
    status: 'RED CORNER ALERT',
    color: '#FF5555'
  },

  // DEVENDRA RAWAT (D-7)
  {
    id: 'FIR-STN-05',
    criminalName: "Devendra 'D-7' Rawat",
    criminalId: 'CRM-7721',
    firNumber: 'FIR-2024-102',
    stationName: 'Women Safety PS Sector 14',
    city: 'Gurugram, Haryana',
    lat: 28.4595,
    lng: 77.0266,
    sections: 'BNS Sec 64 (Rape), Sec 70(1), POCSO Act',
    crimeType: 'Serial Highway Sexual Assault',
    date: '2024-10-27',
    ioOfficer: 'ACP Sunita Deshmukh',
    status: 'DNA CONFIRMED / HUNT ON',
    color: '#C084FC'
  },
  {
    id: 'FIR-STN-06',
    criminalName: "Devendra 'D-7' Rawat",
    criminalId: 'CRM-7721',
    firNumber: 'FIR-2024-089',
    stationName: 'PS IFFCO Chowk',
    city: 'Gurugram, Haryana',
    lat: 28.4750,
    lng: 77.0650,
    sections: 'IPC Sec 376D (Aggravated Assault)',
    crimeType: 'Fake Taxi Abduction',
    date: '2024-04-11',
    ioOfficer: 'Inspector Neha Tyagi',
    status: 'PRIMARY ACCUSED NAMED',
    color: '#C084FC'
  },
  {
    id: 'FIR-STN-07',
    criminalName: "Devendra 'D-7' Rawat",
    criminalId: 'CRM-7721',
    firNumber: 'FIR-2023-312',
    stationName: 'PS Kashmere Gate / Railway Police',
    city: 'Old Delhi',
    lat: 28.6670,
    lng: 77.2280,
    sections: 'IPC Sec 363 (Kidnapping), Sec 366',
    crimeType: 'Transit Hub Commuter Stalking',
    date: '2023-11-02',
    ioOfficer: 'SI R. K. Meena',
    status: 'PROCLAIMED OFFENDER',
    color: '#C084FC'
  },

  // SAMEER GHOST QURESHI
  {
    id: 'FIR-STN-08',
    criminalName: "Sameer 'Ghost' Qureshi",
    criminalId: 'CRM-8821',
    firNumber: 'FIR-2024-103',
    stationName: 'PS Sadar Bazar Anti-Robbery Cell',
    city: 'Gurugram, Haryana',
    lat: 28.4600,
    lng: 77.0300,
    sections: 'BNS Sec 310 (Dacoity), Sec 312 (Robbery)',
    crimeType: 'Axis Bank 14kg Gold Vault Heist',
    date: '2024-10-27',
    ioOfficer: 'DSP Alok Verma',
    status: 'ACTIVE HIGHWAY TRACKING',
    color: '#FB923C'
  },
  {
    id: 'FIR-STN-09',
    criminalName: "Sameer 'Ghost' Qureshi",
    criminalId: 'CRM-8821',
    firNumber: 'FIR-2023-662',
    stationName: 'PS Manesar Highway Unit',
    city: 'Manesar, Haryana',
    lat: 28.3580,
    lng: 76.9380,
    sections: 'IPC Sec 395 (Dacoity), Arms Act 25',
    crimeType: 'Jewelry Logistics Vault Burglary',
    date: '2023-09-18',
    ioOfficer: 'Inspector Kuldeep Hooda',
    status: 'WARRANT PENDING',
    color: '#FB923C'
  },
  {
    id: 'FIR-STN-10',
    criminalName: "Sameer 'Ghost' Qureshi",
    criminalId: 'CRM-8821',
    firNumber: 'FIR-2022-210',
    stationName: 'PS Connaught Place',
    city: 'Central Delhi',
    lat: 28.6315,
    lng: 77.2167,
    sections: 'IPC Sec 379, 411 (Stolen Property)',
    crimeType: 'Cash-In-Transit Van Intercept',
    date: '2022-12-05',
    ioOfficer: 'SI Vikrant Tomar',
    status: 'CHARGES FRAMED',
    color: '#FB923C'
  },

  // MAHESH TIGER KHAN
  {
    id: 'FIR-STN-11',
    criminalName: "Mahesh 'Tiger' Khan",
    criminalId: 'CRM-0014',
    firNumber: 'FIR-2024-001',
    stationName: 'Special Cell Organized Crime Unit',
    city: 'South Delhi',
    lat: 28.5700,
    lng: 77.2400,
    sections: 'MCOCA Act Sec 3/4, BNS Sec 308 (Extortion)',
    crimeType: 'Builder ₹50 Lakhs Ransom Extortion',
    date: '2024-10-27',
    ioOfficer: 'Special Cell STF Squad',
    status: 'MCOCA SANCTIONED',
    color: '#FBBF24'
  },
  {
    id: 'FIR-STN-12',
    criminalName: "Mahesh 'Tiger' Khan",
    criminalId: 'CRM-0014',
    firNumber: 'FIR-2023-909',
    stationName: 'PS Sector 29 Cyber Hub',
    city: 'Gurugram, Haryana',
    lat: 28.4680,
    lng: 77.0630,
    sections: 'IPC Sec 386 (Extortion fear of death)',
    crimeType: 'Commercial Complex Protection Racket',
    date: '2023-07-22',
    ioOfficer: 'Inspector D. S. Rathi',
    status: 'NBW ISSUED',
    color: '#FBBF24'
  },
  {
    id: 'FIR-STN-13',
    criminalName: "Mahesh 'Tiger' Khan",
    criminalId: 'CRM-0014',
    firNumber: 'FIR-2022-441',
    stationName: 'PS Crime Branch Alwar',
    city: 'Alwar, Rajasthan',
    lat: 27.5530,
    lng: 76.6346,
    sections: 'Arms Act Sec 7/25 (Automatic AK-47)',
    crimeType: 'Illegal Weapons Smuggling',
    date: '2022-04-19',
    ioOfficer: 'DSP Jagdish Meena',
    status: 'RED CORNER CIRCULAR',
    color: '#FBBF24'
  },

  // ELENA CZAR ROSTOVA
  {
    id: 'FIR-STN-14',
    criminalName: "Elena 'Czar' Rostova",
    criminalId: 'CRM-5512',
    firNumber: 'FIR-2024-104',
    stationName: 'Narcotics Control Bureau (NCB) Zonal HQ',
    city: 'Mumbai Port, Maharashtra',
    lat: 18.9500,
    lng: 72.9500,
    sections: 'NDPS Act Sec 21/22/27A (Commercial Quantity)',
    crimeType: '100kg Synthetic Heroin & Steyr SMG Seizure',
    date: '2024-10-27',
    ioOfficer: 'Zonal Director R. K. Shirole',
    status: 'INTERPOL RED NOTICE',
    color: '#4ADE80'
  },
  {
    id: 'FIR-STN-15',
    criminalName: "Elena 'Czar' Rostova",
    criminalId: 'CRM-5512',
    firNumber: 'FIR-2023-419',
    stationName: 'PS Yellow Gate Marine Police',
    city: 'Mumbai Coastal, Maharashtra',
    lat: 18.9400,
    lng: 72.8400,
    sections: 'Customs Act Sec 135, Arms Act',
    crimeType: 'Maritime Contraband Infiltration',
    date: '2023-10-30',
    ioOfficer: 'Inspector Sanjay Patil',
    status: 'ACTIVE SURVEILLANCE',
    color: '#4ADE80'
  }
];

export default function TimelinePage({ onNavigate: _onNavigate }) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeCriminalFilter, setActiveCriminalFilter] = useState('ALL');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const DEFAULT_EVENTS = [
    {
      id: 'TL-2024-001',
      timestamp: '2024-10-27 18:45:00 IST',
      title: 'Homicide Forensics: 9mm Striation Match (Sector 18)',
      category: 'HOMICIDE',
      severity: 'CRITICAL',
      entity: "Mayank Kotoli (CRM-9942)",
      firNumber: 'FIR-2024-402 (BNS Sec 103 / IPC 302)',
      policeStation: 'Special Crime Branch / PS Sector 18',
      description: 'CFSL Ballistics unit confirmed 9mm spent cartridge at Sector 18 crime scene matches the rifling marks of seized Beretta 92FS.',
      confidence: '99.4%',
      coordinates: '28.4721° N, 77.0392° E (Sector 18 Market)',
      evidenceTag: 'BALLISTICS-CFSL-9942',
      ioOfficer: 'Inspector V. Rathore (STF Unit 4)',
      categoryColor: '#FF5555',
      icon: '🔴'
    },
    {
      id: 'TL-2024-002',
      timestamp: '2024-10-27 16:15:30 IST',
      title: 'DNA Registry Match: Serial Sexual Assault SIT',
      category: 'SEXUAL_OFFENSE',
      severity: 'CRITICAL',
      entity: "Devendra 'D-7' Rawat (CRM-7721)",
      firNumber: 'FIR-2024-102 (BNS Sec 64 / IPC 376D, POCSO)',
      policeStation: 'Special SIT / Women Safety PS Sector 14',
      description: '100% STR DNA Profile match from Forensic Evidence Kit #FK-8821 against National DNA Database record of repeat offender.',
      confidence: '100.0%',
      coordinates: '28.4595° N, 77.0266° E (Sector 14 Transit Hub)',
      evidenceTag: 'DNA-FK-8821-STR',
      ioOfficer: 'ACP Sunita Deshmukh (Women Safety SIT)',
      categoryColor: '#C084FC',
      icon: '🟣'
    },
    {
      id: 'TL-2024-003',
      timestamp: '2024-10-27 13:50:12 IST',
      title: 'ANPR Hit: Axis Bank Vault Heist Getaway Truck',
      category: 'ROBBERY',
      severity: 'HIGH',
      entity: "Sameer 'Ghost' Qureshi (CRM-8821)",
      firNumber: 'FIR-2024-103 (BNS Sec 310 / IPC 392)',
      policeStation: 'Anti-Robbery Cell / PS Sadar',
      description: 'High-speed ANPR camera captured getaway Eicher truck (HR-26-BR-9921) transporting 14kg looted gold bullion at KMP Highway Toll Plaza.',
      confidence: '98.2%',
      coordinates: '28.3241° N, 76.9102° E (KMP Expressway Toll)',
      evidenceTag: 'ANPR-CAM-KMP-9921',
      ioOfficer: 'DSP Alok Verma (Highway Crime Cell)',
      categoryColor: '#FB923C',
      icon: '🟠'
    },
    {
      id: 'TL-2024-004',
      timestamp: '2024-10-27 11:20:45 IST',
      title: 'Wiretap Intercept: MCOCA Gang Extortion Call',
      category: 'EXTORTION',
      severity: 'CRITICAL',
      entity: "Mahesh 'Tiger' Khan (CRM-0014)",
      firNumber: 'FIR-2024-001 (MCOCA Act & Extortion)',
      policeStation: 'Organized Crime Branch / Special Cell',
      description: 'Judicial authorized wiretap intercepted voice recording demanding ₹50 Lakhs protection ransom from South City builder with death threat.',
      confidence: '99.1%',
      coordinates: 'Encrypted VoIP Trunk // Tower Meerut North',
      evidenceTag: 'WIRETAP-MCOCA-MK01',
      ioOfficer: 'Special Cell STF Squad',
      categoryColor: '#FBBF24',
      icon: '🟡'
    },
    {
      id: 'TL-2024-005',
      timestamp: '2024-10-27 08:30:00 IST',
      title: 'NCB Port Seizure: 100kg Synthetic Heroin & Steyr SMGs',
      category: 'NARCOTICS',
      severity: 'CRITICAL',
      entity: "Elena 'Czar' Rostova (CRM-5512)",
      firNumber: 'FIR-2024-104 (NDPS Act Commercial Quantity)',
      policeStation: 'Narcotics Control Bureau (NCB) Zonal Unit',
      description: 'Joint NCB and Marine Police raid on maritime shipping container yielded 100kg synthetic heroin and 4 Austrian Steyr submachine guns.',
      confidence: '99.8%',
      coordinates: 'Port Terminal C Container Berth 4',
      evidenceTag: 'SEIZURE-NDPS-100KG',
      ioOfficer: 'Zonal Director R. K. Shirole (NCB)',
      categoryColor: '#4ADE80',
      icon: '🟢'
    },
    {
      id: 'TL-2024-006',
      timestamp: '2024-10-26 21:10:00 IST',
      title: 'NBW Warrant Issued: Court of District & Sessions Judge',
      category: 'JUDICIAL_ORDER',
      severity: 'HIGH',
      entity: "Mayank Kotoli (CRM-9942)",
      firNumber: 'NBW Order #JUD-2024-8819',
      policeStation: 'Court of Sessions Judge, Gurugram',
      description: 'Non-Bailable Warrant issued under BNS Section 103 with non-appearance forfeiture order and police lookout notice.',
      confidence: '100.0%',
      coordinates: 'District Court Complex, Gurugram',
      evidenceTag: 'COURT-NBW-8819',
      ioOfficer: 'Hon. Sessions Judge & Public Prosecutor',
      categoryColor: '#38BDF8',
      icon: '⚖️'
    }
  ];

  // Load custom registered criminals from localStorage
  const getCombinedStations = () => {
    let stations = [...CRIMINAL_FIR_POLICE_STATIONS];
    try {
      const stored = localStorage.getItem('crimelens_custom_criminals');
      if (stored) {
        const customList = JSON.parse(stored);
        customList.forEach((c, idx) => {
          if (c.firNumbers && c.firNumbers.length > 0) {
            c.firNumbers.forEach((fir, fIdx) => {
              stations.push({
                id: `CUSTOM-FIR-${c.id}-${fIdx}`,
                criminalName: c.name,
                criminalId: c.id,
                firNumber: fir,
                stationName: c.policeStation || 'PS City Central (Crime Branch)',
                city: 'Delhi NCR, India',
                lat: 28.5200 + (idx * 0.02) + (fIdx * 0.01),
                lng: 77.1500 + (idx * 0.02) - (fIdx * 0.01),
                sections: c.crimeType || 'Penal Code Investigation',
                crimeType: c.category || 'Special Offense',
                date: '2024-10-27',
                ioOfficer: 'Special Crime Branch IO',
                status: c.status || 'ACTIVE INVESTIGATION',
                color: '#00E5FF'
              });
            });
          }
        });
      }
    } catch {
      // ignore
    }
    return stations;
  };

  const allStations = getCombinedStations();

  // Filter stations based on search query and criminal selector
  const filteredStations = allStations.filter((stn) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      stn.criminalName.toLowerCase().includes(q) ||
      stn.criminalId.toLowerCase().includes(q) ||
      stn.stationName.toLowerCase().includes(q) ||
      stn.firNumber.toLowerCase().includes(q) ||
      stn.city.toLowerCase().includes(q) ||
      stn.sections.toLowerCase().includes(q);

    const matchesCriminal =
      activeCriminalFilter === 'ALL' ||
      stn.criminalName.toLowerCase().includes(activeCriminalFilter.toLowerCase()) ||
      stn.criminalId.toLowerCase().includes(activeCriminalFilter.toLowerCase());

    return matchesQuery && matchesCriminal;
  });

  // Filter timeline events
  const filteredEvents = eventsList.filter((evt) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.entity.toLowerCase().includes(q) ||
      evt.policeStation.toLowerCase().includes(q) ||
      evt.firNumber.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q);

    const matchesCategory = filterType === 'ALL' || evt.category === filterType;

    const matchesCriminal =
      activeCriminalFilter === 'ALL' ||
      evt.entity.toLowerCase().includes(activeCriminalFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesCriminal;
  });

  // 1. Initialize Map on Mount with proper cleanup
  useEffect(() => {
    if (!mapContainerRef.current) return undefined;

    const map = L.map(mapContainerRef.current, {
      center: [28.5500, 77.1800],
      zoom: 9,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Force tile recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    };
  }, []);

  // 2. Reactively Update Markers & Pan whenever filteredStations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (filteredStations.length === 0) return;

    filteredStations.forEach((stn) => {
      const marker = L.circleMarker([stn.lat, stn.lng], {
        radius: 10,
        color: '#FFFFFF',
        weight: 2,
        fillColor: stn.color || '#00E5FF',
        fillOpacity: 0.95
      });

      const popupContent = `
        <div style="font-family: sans-serif; min-width: 220px; color: #07090E; padding: 4px;">
          <div style="font-size: 11px; font-weight: 800; color: #0284C7; letter-spacing: 0.5px; margin-bottom: 2px;">
            🏛️ POLICE STATION JURISDICTION
          </div>
          <div style="font-size: 13.5px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">
            ${stn.stationName}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            📍 ${stn.city}
          </div>
          <div style="background: #F1F5F9; border-left: 3px solid ${stn.color || '#00E5FF'}; padding: 6px 8px; border-radius: 4px; font-size: 11px; margin-bottom: 6px;">
            <div><strong>Suspect:</strong> <span style="color: #DC2626; font-weight: 800;">${stn.criminalName}</span></div>
            <div><strong>FIR No:</strong> <span style="color: #0284C7; font-weight: 700;">${stn.firNumber}</span></div>
            <div><strong>Sections:</strong> ${stn.sections}</div>
            <div><strong>IO:</strong> ${stn.ioOfficer}</div>
          </div>
          <div style="font-size: 10px; font-weight: 800; color: #16A34A; background: #DCFCE7; padding: 3px 6px; border-radius: 3px; display: inline-block;">
            STATUS: ${stn.status}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedStation(stn);
        showToast(`📍 Selected: ${stn.stationName} (${stn.firNumber})`);
      });

      markersGroup.addLayer(marker);
    });

    try {
      if (filteredStations.length > 0) {
        map.fitBounds(markersGroup.getBounds(), { padding: [50, 50], maxZoom: 12 });
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [filteredStations]);

  // Load timeline data from backend
  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await api.timeline.getEvents();
        if (data && data.events && data.events.length > 0) {
          setEventsList(data.events);
        } else {
          setEventsList(DEFAULT_EVENTS);
        }
      } catch (err) {
        console.warn('Using local timeline seed:', err);
        setEventsList(DEFAULT_EVENTS);
      }
    }
    loadTimeline();
  }, []);

  const handleSelectCriminalFilter = (name) => {
    setActiveCriminalFilter(name);
    if (name === 'ALL') {
      showToast('Showing FIR Police Stations for all criminals.');
    } else {
      showToast(`Showing all Police Stations where FIRs registered for: ${name}`);
    }
  };

  return (
    <div style={{
      padding: '1.75rem 2.25rem 3rem 2.25rem',
      backgroundColor: 'var(--bg-dark, #07090E)',
      minHeight: '100vh',
      color: '#FFFFFF',
      boxSizing: 'border-box'
    }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '75px',
          right: '24px',
          backgroundColor: '#00E5FF',
          color: '#07090E',
          padding: '10px 18px',
          borderRadius: '6px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '12.5px',
          boxShadow: '0 0 25px rgba(0, 229, 255, 0.45)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
        paddingBottom: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            color: '#00E5FF',
            letterSpacing: '1.5px',
            marginBottom: '4px'
          }}>
            <span>🇮🇳</span>
            <span>POLICE INVESTIGATION &amp; CRIME TRAIL // SECTION 65B BSA CERTIFIED</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
            CRIMINAL TIMELINE &amp; POLICE STATIONS FIR MAP
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
            Search any criminal to visualize all Police Stations where FIRs are registered across jurisdictions with live forensic chain of custody.
          </p>
        </div>

        {/* Live Tracking Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(0, 229, 255, 0.08)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          padding: '8px 14px',
          borderRadius: '6px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#00E676',
            boxShadow: '0 0 10px #00E676',
            display: 'inline-block'
          }}></span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF', fontWeight: 700 }}>
            {filteredStations.length} FIR JURISDICTIONS ACTIVE
          </span>
        </div>
      </div>

      {/* Search & Criminal Quick Select Bar */}
      <div style={{
        backgroundColor: 'rgba(12, 17, 26, 0.9)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderRadius: '8px',
        padding: '1.2rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Search Input Box */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search Criminal Name, FIR Number, Police Station, or City..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(7, 10, 16, 0.95)',
                border: '1.5px solid rgba(0, 229, 255, 0.35)',
                borderRadius: '6px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#94A3B8',
                borderRadius: '5px',
                padding: '9px 14px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Quick Criminal Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#94A3B8', fontWeight: 700 }}>
            SEARCH BY SUSPECT:
          </span>

          {[
            { label: 'ALL CRIMINALS', filterVal: 'ALL', count: allStations.length },
            { label: '🔴 Mayank Kotoli', filterVal: 'Mayank Kotoli', count: 4 },
            { label: '🟣 Devendra Rawat (D-7)', filterVal: 'Devendra', count: 3 },
            { label: '🟠 Sameer Qureshi (Ghost)', filterVal: 'Sameer', count: 3 },
            { label: '🟡 Mahesh Khan (Tiger)', filterVal: 'Mahesh', count: 3 },
            { label: '🟢 Elena Rostova (Czar)', filterVal: 'Elena', count: 2 },
          ].map((item, idx) => {
            const isSelected = activeCriminalFilter === item.filterVal;
            return (
              <button
                key={idx}
                onClick={() => handleSelectCriminalFilter(item.filterVal)}
                style={{
                  backgroundColor: isSelected ? '#00E5FF' : 'rgba(7, 10, 16, 0.8)',
                  color: isSelected ? '#07090E' : '#CBD5E1',
                  border: isSelected ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '5px',
                  padding: '5px 11px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label} <span style={{ opacity: 0.8, fontSize: '10px' }}>({item.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Police Stations Geospatial Map */}
      <div style={{
        backgroundColor: 'rgba(12, 17, 26, 0.95)',
        border: '1.5px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1.75rem',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: '#00E5FF', fontWeight: 800 }}>
              🗺️ GEOSPATIAL CRIME MAP // POLICE STATIONS WITH REGISTERED FIRS
            </span>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              Showing <strong style={{ color: '#FFFFFF' }}>{filteredStations.length}</strong> Police Station FIR records for{' '}
              <strong style={{ color: '#00E5FF' }}>{activeCriminalFilter === 'ALL' ? 'All Suspects' : activeCriminalFilter}</strong>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)' }}>
            Click on any map pin to view full FIR details &amp; IO officer
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '380px',
            borderRadius: '6px',
            backgroundColor: '#070A10',
            border: '1px solid rgba(0, 229, 255, 0.2)'
          }}
        />

        {/* Selected Station Banner if clicked */}
        {selectedStation && (
          <div style={{
            marginTop: '12px',
            backgroundColor: 'rgba(0, 229, 255, 0.08)',
            border: '1px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ fontSize: '10px', color: '#00E5FF', fontFamily: 'monospace', fontWeight: 700 }}>
                SELECTED POLICE STATION:
              </span>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                🏛️ {selectedStation.stationName} — {selectedStation.city}
              </div>
              <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '2px' }}>
                <strong>Suspect:</strong> <span style={{ color: '#FF8888' }}>{selectedStation.criminalName}</span> |{' '}
                <strong>FIR:</strong> <span style={{ color: '#00E5FF' }}>{selectedStation.firNumber}</span> |{' '}
                <strong>Sections:</strong> {selectedStation.sections} |{' '}
                <strong>IO:</strong> {selectedStation.ioOfficer}
              </div>
            </div>

            <button
              onClick={() => setSelectedStation(null)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#94A3B8',
                borderRadius: '4px',
                padding: '5px 10px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Category Pills for Timeline */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {[
          { label: 'ALL CRIME EVENTS', value: 'ALL' },
          { label: '🔴 HOMICIDE & BALLISTICS', value: 'HOMICIDE' },
          { label: '🟣 SEXUAL OFFENSE SIT', value: 'SEXUAL_OFFENSE' },
          { label: '🟠 ARMED HEISTS', value: 'ROBBERY' },
          { label: '🟡 EXTORTION (MCOCA)', value: 'EXTORTION' },
          { label: '🟢 NARCOTICS SMUGGLING', value: 'NARCOTICS' },
          { label: '⚖️ JUDICIAL ORDERS', value: 'JUDICIAL_ORDER' }
        ].map((cat, idx) => {
          const isSelected = filterType === cat.value;
          return (
            <button
              key={idx}
              onClick={() => setFilterType(cat.value)}
              style={{
                backgroundColor: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'rgba(12, 17, 26, 0.8)',
                color: isSelected ? '#00E5FF' : '#94A3B8',
                border: isSelected ? '1px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Chronological Vertical Evidence Track */}
      <div style={{
        backgroundColor: 'rgba(12, 17, 26, 0.95)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem'
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#00E5FF', fontFamily: 'var(--font-mono, monospace)' }}>
            CHRONOLOGICAL FORENSIC ACTIVITY TRAIL
          </h2>
          <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
            Showing {filteredEvents.length} Verified Incidents
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8' }}>
            No forensic events found matching your current search and filter criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  backgroundColor: 'rgba(7, 10, 16, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '1rem 1.25rem',
                  borderLeft: `4px solid ${evt.categoryColor || '#00E5FF'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{evt.icon || '📌'}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                      {evt.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                      color: '#00E5FF',
                      padding: '2px 7px',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      fontWeight: 700
                    }}>
                      CONFIDENCE: {evt.confidence}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {evt.timestamp}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '6px',
                  fontSize: '11.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <div><span style={{ color: '#94A3B8' }}>Suspect:</span> <strong style={{ color: '#FF8888' }}>{evt.entity}</strong></div>
                  <div><span style={{ color: '#94A3B8' }}>FIR:</span> <strong style={{ color: '#00E5FF' }}>{evt.firNumber}</strong></div>
                  <div><span style={{ color: '#94A3B8' }}>Station:</span> <strong style={{ color: '#FFFFFF' }}>{evt.policeStation}</strong></div>
                  <div><span style={{ color: '#94A3B8' }}>IO:</span> <strong style={{ color: '#CBD5E1' }}>{evt.ioOfficer}</strong></div>
                </div>

                <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    📍 Location: {evt.coordinates}
                  </div>

                  <button
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      backgroundColor: 'rgba(0, 229, 255, 0.1)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      color: '#00E5FF',
                      borderRadius: '4px',
                      padding: '5px 12px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View Forensic Exhibit u/s 65B
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forensic Exhibit Detail Modal */}
      {selectedEvent && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            backgroundColor: '#0c111a',
            border: '1.5px solid #00E5FF',
            borderRadius: '10px',
            padding: '1.75rem',
            boxShadow: '0 0 50px rgba(0, 229, 255, 0.3)',
            color: '#FFFFFF',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(0, 229, 255, 0.25)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  FORENSIC EXHIBIT INSPECTION &amp; CUSTODY LOG
                </h3>
                <span style={{ fontSize: '11px', color: '#00E5FF', fontFamily: 'monospace' }}>
                  TAG: {selectedEvent.evidenceTag || 'EXHIBIT-CFSL-VERIFIED'}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '12.5px', color: '#CBD5E1' }}>
              <div style={{ backgroundColor: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '10px 12px', borderRadius: '6px' }}>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '3px' }}>
                  Admissibility Certification (Section 65B BSA / Evidence Act)
                </strong>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94A3B8' }}>
                  This forensic record is cryptographically signed and admissible in judicial proceedings before the High Court and Sessions Courts.
                </p>
              </div>

              <div>
                <strong style={{ color: '#FFFFFF' }}>Incident Summary:</strong>
                <p style={{ margin: '4px 0 0 0', lineHeight: 1.5 }}>{selectedEvent.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '4px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '11px' }}>Investigating Officer:</span>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{selectedEvent.ioOfficer}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '4px' }}>
                  <span style={{ color: '#94A3B8', fontSize: '11px' }}>Police Station:</span>
                  <div style={{ fontWeight: 700, color: '#00E5FF' }}>{selectedEvent.policeStation}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`SHA256:${selectedEvent.id}-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`);
                    showToast('✓ Cryptographic SHA-256 exhibit hash copied to clipboard.');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: '#00E5FF',
                    borderRadius: '4px',
                    padding: '7px 12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Copy Digital Seal
                </button>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    backgroundColor: '#00E5FF',
                    color: '#07090E',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '7px 14px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
