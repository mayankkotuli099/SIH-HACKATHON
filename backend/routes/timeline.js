import express from 'express';

const router = express.Router();

const timelineEvents = [
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
    ioOfficer: 'Inspector V. Rathore (STF Unit 4)'
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
    ioOfficer: 'ACP Sunita Deshmukh (Women Safety SIT)'
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
    ioOfficer: 'DSP Alok Verma (Highway Crime Cell)'
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
    ioOfficer: 'Special Cell STF Squad'
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
    ioOfficer: 'Zonal Director R. K. Shirole (NCB)'
  },
  {
    id: 'TL-2024-006',
    timestamp: '2024-10-26 22:10:15 IST',
    title: 'Non-Bailable Warrant (NBW) Judicial Execution Issued',
    category: 'POLICE_ACTION',
    severity: 'HIGH',
    entity: 'All State Police Forces / Border Checkposts',
    firNumber: 'Sessions Court Warrant Order #NBW-2024-918',
    policeStation: 'District & Sessions Court / Crime Branch',
    description: 'Sessions Court issued Non-Bailable Arrest Warrants for immediate inter-state apprehension and freezing of Hawala bank assets.',
    confidence: '100.0%',
    coordinates: 'All Police Jurisdictions & Airport Lookouts',
    evidenceTag: 'COURT-NBW-ORDER-918',
    ioOfficer: 'Chief Judicial Magistrate Registry'
  }
];

// GET /api/timeline - Get timeline events
router.get('/', (req, res) => {
  const { category, search } = req.query;

  let filtered = [...timelineEvents];

  if (category && category !== 'ALL') {
    filtered = filtered.filter((t) => t.category.toUpperCase() === category.toUpperCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.entity.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.firNumber && t.firNumber.toLowerCase().includes(q)) ||
        (t.policeStation && t.policeStation.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    totalCount: filtered.length,
    events: filtered
  });
});

export default router;
