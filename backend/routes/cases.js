import express from 'express';

const router = express.Router();

let casesList = [
  {
    id: 'CASE-2024-001',
    title: 'Operation Apex Shadow',
    leadSuspect: 'Rahul Sharma',
    status: 'ACTIVE_INVESTIGATION',
    priority: 'CRITICAL',
    assignedOfficer: 'OP_01 (Clearance L4)',
    openedDate: '2024-09-12',
    evidenceCount: 42,
    description: 'Cross-border hawala syndicate funneling illicit proceeds into luxury real estate and bullion accounts.',
    tags: ['HAWALA', 'SHELL_CORP', 'HIGH_RISK']
  },
  {
    id: 'CASE-2024-002',
    title: 'Project DarkFlow Nexus',
    leadSuspect: 'Unknown Operator (C2 #77)',
    status: 'SURVEILLANCE',
    priority: 'HIGH',
    assignedOfficer: 'OP_03 (Signals Team)',
    openedDate: '2024-10-01',
    evidenceCount: 18,
    description: 'Decentralized botnet coordinating DDoS extortion and crypto tumbler laundering.',
    tags: ['BOTNET', 'CRYPTO', 'SIGINT']
  },
  {
    id: 'CASE-2024-003',
    title: 'Operation Silver Route',
    leadSuspect: 'Vikram Mehta',
    status: 'EVIDENCE_SEALED',
    priority: 'MEDIUM',
    assignedOfficer: 'OP_01 (Clearance L4)',
    openedDate: '2024-08-19',
    evidenceCount: 29,
    description: 'Hawala cash drop courier network operating in Delhi-NCR and Mumbai financial corridors.',
    tags: ['COURIER', 'NCR', 'INTERCEPT']
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
