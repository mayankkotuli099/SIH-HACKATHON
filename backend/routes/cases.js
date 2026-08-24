import express from 'express';

const router = express.Router();

let casesList = [
  {
    id: 'CASE-2024-101',
    title: 'Operation Falcon Hunt: Triple Homicide & Contract Hit',
    leadSuspect: "Mayank Kotoli",
    status: 'ACTIVE_MANHUNT',
    priority: 'CRITICAL',
    assignedOfficer: 'ACP Rajesh Verma (Special Crime Branch)',
    openedDate: '2024-10-12',
    evidenceCount: 58,
    description: 'Triple homicide execution at Sector 18. Ballistics matched 9mm Beretta; DNA evidence recovered from crime scene vehicle.',
    tags: ['HOMICIDE', 'MURDER_SEC_302', 'CONTRACT_KILLING', 'BALLISTICS_MATCH']
  },
  {
    id: 'CASE-2024-102',
    title: 'Special SIT: Serial Sexual Violence & Kidnapping',
    leadSuspect: "Devendra 'D-7' Rawat",
    status: 'SPECIAL_INVESTIGATION',
    priority: 'CRITICAL',
    assignedOfficer: 'DCP Priya Sharma (Women & Child Safety SIT)',
    openedDate: '2024-10-04',
    evidenceCount: 34,
    description: 'Serial sexual assault and highway abduction case. Forensic DNA matched profile FK-8821 in National DNA Registry.',
    tags: ['RAPE_SEC_376D', 'POCSO', 'SERIAL_OFFENDER', 'DNA_MATCH']
  },
  {
    id: 'CASE-2024-103',
    title: 'Operation Gold Vault: Axis Commercial Bank Armed Heist',
    leadSuspect: "Sameer 'Ghost' Qureshi",
    status: 'SURVEILLANCE',
    priority: 'HIGH',
    assignedOfficer: 'Inspector Sandeep Hooda (Anti-Robbery Cell)',
    openedDate: '2024-09-28',
    evidenceCount: 41,
    description: '14 kg gold bullion armed heist; vault thermal breach; getaway truck route triangulated on National Highway toll gate.',
    tags: ['ARMED_ROBBERY', 'HEIST_SEC_392', 'WEAPONS', 'ANPR_HIT']
  },
  {
    id: 'CASE-2024-104',
    title: 'Operation NarcoGrid: Inter-State Heroin Smuggling Network',
    leadSuspect: "Elena 'Czar' Rostova",
    status: 'CONTAINER_SEALED',
    priority: 'HIGH',
    assignedOfficer: 'Zonal Director K. Nair (Narcotics Control Bureau)',
    openedDate: '2024-09-15',
    evidenceCount: 62,
    description: '100 kg high-grade synthetic opioids intercepted at Port Terminal C container yard alongside military-grade submachine guns.',
    tags: ['NARCOTICS_NDPS', 'ARMS_TRAFFICKING', 'PORT_SEIZURE']
  },
  {
    id: 'CASE-2024-105',
    title: 'Syndicate Extortion & Gangster Racket (MCOCA Case #88)',
    leadSuspect: "Mahesh 'Tiger' Khan",
    status: 'WARRANT_ACTIVE',
    priority: 'CRITICAL',
    assignedOfficer: 'Joint CP Anirudh Saxena (Organized Crime Division)',
    openedDate: '2024-08-10',
    evidenceCount: 94,
    description: 'Extortion and protection money ring collecting ₹5 Cr monthly from NCR builders with threats of contract execution.',
    tags: ['MCOCA_GANG', 'EXTORTION', 'KIDNAPPING', 'HAWALA']
  }
];

// GET /api/cases - List all cases
router.get('/', (req, res) => {
  res.json({
    success: true,
    totalCount: casesList.length,
    cases: casesList
  });
});

// POST /api/cases - Create new investigation case
router.post('/', (req, res) => {
  const { title, leadSuspect, priority, description, tags } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Case title is required.' });
  }

  const newCase = {
    id: `CASE-2024-${String(casesList.length + 1).padStart(3, '0')}`,
    title,
    leadSuspect: leadSuspect || 'Pending Identification',
    status: 'ACTIVE_INVESTIGATION',
    priority: priority || 'HIGH',
    assignedOfficer: 'OP_01 (Clearance L4)',
    openedDate: new Date().toISOString().split('T')[0],
    evidenceCount: 1,
    description: description || 'Initial case file opened via CrimeLens investigator portal.',
    tags: tags || ['TACTICAL_DISPATCH']
  };

  casesList.unshift(newCase);

  res.status(201).json({
    success: true,
    message: `Case ${newCase.id} registered successfully.`,
    case: newCase
  });
});

export default router;
