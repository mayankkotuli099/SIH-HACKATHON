import express from 'express';

const router = express.Router();

const entitiesData = [
  {
    id: 'CRM-9942',
    name: "VIKRAM 'RAJA' MALHOTRA",
    aliases: ['Raja Bhai', 'The Trigger', 'VK-99'],
    crimeType: 'HOMICIDE & CONTRACT KILLING',
    firNumbers: ['FIR-2024-402 (Murder Sec 302/103)', 'FIR-2023-881 (Attempted Murder)', 'FIR-2022-119 (Illegal Arms)'],
    weaponSignature: '9mm Beretta 92FS / .32 Desi Katta',
    modusOperandi: 'Ambush contract killings on rival gang leaders using point-blank double-tap; getaway via unregistered KTM Duke bikes.',
    wantedReward: '₹500,000 INR ($6,000 USD)',
    dnaProfileMatch: '99.4% Match to Blood Splatter at Sector 18 Homicide Scene',
    riskScore: 99.2,
    threatLevel: 'CRITICAL',
    status: 'ACTIVE_FUGITIVE',
    category: 'Serial Homicide / Gang Enforcer',
    biometrics: {
      dob: '1987-05-14',
      nationality: 'Indian (Interpol Blue Notice)',
      scarsAndMarks: 'Deep scar across left jawline; Cobra tattoo on right forearm',
      voiceprintConfidence: '98.9%',
      facialVectorId: 'FV-99420-VK'
    },
    knownAssociates: [
      { id: 'CRM-0014', name: "Mahesh 'Tiger' Khan", relation: 'Gang Syndicate Boss', risk: 'CRITICAL' },
      { id: 'CRM-4494', name: "Suresh 'Chhota' Goli", relation: 'Armorer & Weapon Supplier', risk: 'HIGH' },
      { id: 'CRM-8821', name: 'Sameer Qureshi', relation: 'Getaway Driver', risk: 'HIGH' }
    ],
    financialAccounts: [
      { bank: 'Cash Hawala Drops', accNo: 'SECTOR-12-HAWALA', balance: '₹35 Lakhs Cash' },
      { bank: 'Axis Bank (Benami Proxy)', accNo: '****-4901', balance: '₹14.2 Lakhs (Frozen)' }
    ],
    burnerDevices: [
      { imei: '864201938472910', number: '+91-98711-40291', status: 'Cell Tower Ping: Meerut Highway' },
      { imei: '359102847291830', number: '+91-99882-11049', status: 'Signal Intercepted' }
    ]
  },
  {
    id: 'CRM-7721',
    name: "DEVENDRA 'D-7' RAWAT",
    aliases: ['D-7', 'Highway Predator', 'Night Stalker'],
    crimeType: 'SEXUAL ASSAULT & SERIAL RAPE',
    firNumbers: ['FIR-2024-102 (Aggravated Rape Sec 376D/64)', 'FIR-2024-089 (POCSO Act)', 'FIR-2023-312 (Kidnapping Sec 363)'],
    weaponSignature: 'Hunting Knife / Chloroform / Pepper Spray',
    modusOperandi: 'Stalks lone commuters near unlit transit hubs and ring roads; uses fake taxi cabs with altered plates.',
    wantedReward: '₹1,000,000 INR ($12,000 USD)',
    dnaProfileMatch: '100% STR DNA Match from Forensic Kit #FK-8821',
    riskScore: 99.8,
    threatLevel: 'CRITICAL',
    status: 'ACTIVE_FUGITIVE',
    category: 'Serial Sexual Offenses & Abduction',
    biometrics: {
      dob: '1991-11-03',
      nationality: 'Indian',
      scarsAndMarks: 'Burn mark on right shoulder; Stutter in speech',
      voiceprintConfidence: '96.4%',
      facialVectorId: 'FV-77210-DR'
    },
    knownAssociates: [
      { id: 'CRM-3310', name: "Raju 'Mechanic' Verma", relation: 'Fake Number Plate Supplier', risk: 'HIGH' },
      { id: 'CRM-9942', name: 'Vikram Malhotra', relation: 'Former Inmate / Gang Link', risk: 'CRITICAL' }
    ],
    financialAccounts: [
      { bank: 'Punjab National Bank', accNo: '****-8821', balance: '₹1.8 Lakhs (Monitored)' }
    ],
    burnerDevices: [
      { imei: '869201948271049', number: '+91-98112-99011', status: 'Tower Triangulation: Sector 14' }
    ]
  },
  {
    id: 'CRM-0014',
    name: "MAHESH 'TIGER' KHAN",
    aliases: ['Tiger', 'Bada Don', 'MK-01'],
    crimeType: 'ORGANIZED GANG SYNDICATE & EXTORTION',
    firNumbers: ['FIR-2024-001 (MCOCA Act)', 'FIR-2023-909 (Extortion & Kidnapping)', 'FIR-2022-441 (Arms Act)'],
    weaponSignature: 'AK-47 / Imported Glock 17',
    modusOperandi: 'Extortion rackets on builders, inter-state contraband protection, contract killings via youth recruit sleeper cells.',
    wantedReward: '₹2,500,000 INR ($30,000 USD)',
    dnaProfileMatch: 'Indexed in State Police Gangster Database',
    riskScore: 98.5,
    threatLevel: 'CRITICAL',
    status: 'WARRANT_ISSUED',
    category: 'Syndicate Kingpin / Inter-State Gang Leader',
    biometrics: {
      dob: '1978-08-22',
      nationality: 'Indian (Red Corner Notice)',
      scarsAndMarks: 'Bullet exit wound scar on abdomen; Tiger tattoo on neck',
      voiceprintConfidence: '99.1%',
      facialVectorId: 'FV-00145-MK'
    },
    knownAssociates: [
      { id: 'CRM-9942', name: "Vikram 'Raja' Malhotra", relation: 'Lead Hitman', risk: 'CRITICAL' },
      { id: 'CRM-5512', name: "Elena 'Czar' Rostova", relation: 'Narcotics Supply Partner', risk: 'CRITICAL' },
      { id: 'CRM-8821', name: 'Sameer Qureshi', relation: 'Heist Specialist', risk: 'HIGH' }
    ],
    financialAccounts: [
      { bank: 'Dubai Bullion Vault', accNo: '****-9102', balance: '$1.8M Gold Bullion' },
      { bank: 'Swiss Escrow #88', accNo: '****-3310', balance: '$3.2M USD (Frozen)' }
    ],
    burnerDevices: [
      { imei: '861902847291830', number: '+971-50-8819021', status: 'Encrypted Satellite Relay' }
    ]
  },
  {
    id: 'CRM-8821',
    name: "SAMEER 'GHOST' QURESHI",
    aliases: ['Ghost', 'The Drill', 'SQ-Lock'],
    crimeType: 'ARMED ROBBERY & BANK HEISTS',
    firNumbers: ['FIR-2024-103 (Armed Bank Robbery Sec 392/397)', 'FIR-2023-662 (Jewelry Vault Burglary)', 'FIR-2022-210 (Vehicle Theft)'],
    weaponSignature: 'Sawed-off 12-Gauge Shotgun / Thermal Lance',
    modusOperandi: 'High-precision vault breaching, security guard neutralization, laser jammer deployment, signal blocker trucks.',
    wantedReward: '₹750,000 INR ($9,000 USD)',
    dnaProfileMatch: 'Glove DNA Match from Axis Bank Vault Heist',
    riskScore: 92.4,
    threatLevel: 'HIGH',
    status: 'ACTIVE_TRACKING',
    category: 'Armed Robber & Safe Cracker',
    biometrics: {
      dob: '1989-02-18',
      nationality: 'Indian',
      scarsAndMarks: 'Missing tip of right index finger',
      voiceprintConfidence: '94.2%',
      facialVectorId: 'FV-88210-SQ'
    },
    knownAssociates: [
      { id: 'CRM-0014', name: 'Mahesh Khan', relation: 'Syndicate Boss / Fencer', risk: 'CRITICAL' },
      { id: 'CRM-4494', name: 'Vikram Mehta', relation: 'Hawala Fencer', risk: 'HIGH' }
    ],
    financialAccounts: [
      { bank: 'Stolen Gold Bullion Reserves', accNo: 'HEIST-OCT-2024', balance: '14 kg Stolen Gold' }
    ],
    burnerDevices: [
      { imei: '864201938472888', number: '+91-98991-00219', status: 'Active GPS Beacon on Getaway Truck' }
    ]
  },
  {
    id: 'CRM-5512',
    name: "ELENA 'CZAR' ROSTOVA",
    aliases: ['The Chemist', 'Czarina', 'ER-Narc'],
    crimeType: 'NARCOTICS & ILLICIT ARMS TRAFFICKING',
    firNumbers: ['FIR-2024-104 (NDPS Act 100kg Seizure)', 'FIR-2023-419 (Cross-Border Arms Smuggling)'],
    weaponSignature: 'Steyr TMP 9mm Submachine Gun',
    modusOperandi: 'Maritime container smuggling of synthetic opioids, military-grade arms distribution across Northern India.',
    wantedReward: '₹1,500,000 INR ($18,000 USD)',
    dnaProfileMatch: 'Fingerprint match on Port Terminal C Container Seal',
    riskScore: 96.0,
    threatLevel: 'CRITICAL',
    status: 'ACTIVE_SURVEILLANCE',
    category: 'Narcotics Cartel & Arms Trafficking',
    biometrics: {
      dob: '1986-10-12',
      nationality: 'Dual Flagged (Interpol Red Notice)',
      scarsAndMarks: 'Tattoo of Russian Eagle on back',
      voiceprintConfidence: '97.8%',
      facialVectorId: 'FV-55120-ER'
    },
    knownAssociates: [
      { id: 'CRM-0014', name: 'Mahesh Khan', relation: 'Distribution Partner', risk: 'CRITICAL' },
      { id: 'CRM-9942', name: 'Vikram Malhotra', relation: 'Enforcer', risk: 'CRITICAL' }
    ],
    financialAccounts: [
      { bank: 'HSBC HK Maritime Trust', accNo: '****-9921', balance: '$4.2M USD (Frozen)' }
    ],
    burnerDevices: [
      { imei: '359102847291999', number: '+44-7700-900821', status: 'Satellite Tracked: Arabian Sea' }
    ]
  }
];

// GET /api/entities - List all entities
router.get('/', (req, res) => {
  const { search, category, risk } = req.query;

  let filtered = [...entitiesData];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.aliases.some((a) => a.toLowerCase().includes(q))
    );
  }

  if (risk && risk !== 'ALL') {
    filtered = filtered.filter((e) => e.threatLevel.toUpperCase() === risk.toUpperCase());
  }

  res.json({
    success: true,
    totalCount: filtered.length,
    entities: filtered
  });
});

// GET /api/entities/:id - Get single entity dossier
router.get('/:id', (req, res) => {
  const entity = entitiesData.find(
    (e) => e.id.toLowerCase() === req.params.id.toLowerCase() || e.name.toLowerCase().includes(req.params.id.toLowerCase())
  );

  if (!entity) {
    return res.status(404).json({ success: false, error: 'Entity dossier not found.' });
  }

  res.json({
    success: true,
    entity
  });
});

// POST /api/entities - Register new criminal record
router.post('/', (req, res) => {
  const {
    name,
    aliases,
    crimeType,
    firNumbers,
    weaponSignature,
    modusOperandi,
    wantedReward,
    dnaProfileMatch,
    riskScore,
    threatLevel,
    dob,
    scarsAndMarks,
    phone
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Criminal Name is required.' });
  }

  const newId = `CRM-${Math.floor(1000 + Math.random() * 9000)}`;
  const aliasList = Array.isArray(aliases)
    ? aliases
    : typeof aliases === 'string'
      ? aliases.split(',').map((a) => a.trim()).filter(Boolean)
      : [`Alias ${name.trim().split(' ')[0]}`];

  const firList = Array.isArray(firNumbers)
    ? firNumbers
    : typeof firNumbers === 'string'
      ? firNumbers.split(',').map((f) => f.trim()).filter(Boolean)
      : ['FIR-2024-PENDING (Registered)'];

  const newCriminal = {
    id: newId,
    name: name.trim().toUpperCase(),
    aliases: aliasList.length > 0 ? aliasList : [`Alias ${name.trim().split(' ')[0]}`],
    crimeType: crimeType || 'HOMICIDE & VIOLENT CRIME',
    firNumbers: firList.length > 0 ? firList : ['FIR-2024-PENDING (Registered)'],
    weaponSignature: weaponSignature || 'Illegal Firearm / Edged Weapon',
    modusOperandi: modusOperandi || 'Active suspect under police investigation.',
    wantedReward: wantedReward || '₹100,000 INR',
    dnaProfileMatch: dnaProfileMatch || 'Forensic Sampling Scheduled',
    riskScore: parseFloat(riskScore) || 90.0,
    threatLevel: threatLevel || 'HIGH',
    status: 'ACTIVE_WARRANT',
    category: crimeType || 'Criminal Offender',
    biometrics: {
      dob: dob || '1990-01-01',
      nationality: 'Indian',
      scarsAndMarks: scarsAndMarks || 'Identification marks recorded in CCTNS',
      voiceprintConfidence: 'Recorded',
      facialVectorId: `FV-${newId}`
    },
    knownAssociates: [],
    financialAccounts: [],
    burnerDevices: phone
      ? [
          {
            imei: `86${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
            number: phone,
            status: 'Signal Surveillance Active'
          }
        ]
      : []
  };

  entitiesData.unshift(newCriminal);

  res.status(201).json({
    success: true,
    message: `Criminal record for ${newCriminal.name} registered successfully with ID ${newCriminal.id}.`,
    entity: newCriminal
  });
});

export default router;

