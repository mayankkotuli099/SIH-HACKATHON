import express from 'express';

const router = express.Router();

const entitiesData = [
  {
    id: 'ENT-8921',
    name: 'RAHUL SHARMA',
    aliases: ['Apex Master', 'Operator Zero', 'RS_77'],
    riskScore: 94.2,
    threatLevel: 'CRITICAL',
    status: 'ACTIVE_SURVEILLANCE',
    category: 'Syndicate Kingpin / Financial Controller',
    biometrics: {
      dob: '1984-06-14',
      nationality: 'Indian (Dual Passport Flagged)',
      voiceprintConfidence: '96.8%',
      facialVectorId: 'FV-99420-IN'
    },
    knownAssociates: [
      { id: 'ENT-4494', name: 'Vikram Mehta', relation: 'Hawala Broker', risk: 'HIGH' },
      { id: 'ENT-1120', name: 'Elena Rostova', relation: 'Crypto Custodian', risk: 'CRITICAL' }
    ],
    financialAccounts: [
      { bank: 'Standard Chartered HK', accNo: '****-9921', balance: '$2.4M USD (Frozen)' },
      { bank: 'Dubai Islamic Bank', accNo: '****-3310', balance: '$850K USD (Active)' }
    ],
    burnerDevices: [
      { imei: '864201938472910', number: '+91-98765-43210', status: 'Cell Tower Triangulated' },
      { imei: '359102847291830', number: '+971-50-1234567', status: 'VoIP Forwarding' }
    ]
  },
  {
    id: 'ENT-4494',
    name: 'VIKRAM MEHTA',
    aliases: ['VK Broker', 'Hawala One'],
    riskScore: 88.5,
    threatLevel: 'HIGH',
    status: 'ACTIVE_TRACKING',
    category: 'Hawala Courier & Shell Director',
    biometrics: {
      dob: '1979-11-22',
      nationality: 'Indian',
      voiceprintConfidence: '91.4%',
      facialVectorId: 'FV-88210-IN'
    },
    knownAssociates: [
      { id: 'ENT-8921', name: 'Rahul Sharma', relation: 'Syndicate Boss', risk: 'CRITICAL' }
    ],
    financialAccounts: [
      { bank: 'Emirates NBD', accNo: '****-1104', balance: '$420K USD' }
    ],
    burnerDevices: [
      { imei: '869201948271049', number: '+91-98111-22334', status: 'Active Signal' }
    ]
  },
  {
    id: 'ENT-1120',
    name: 'SHELL CORP B (HONG KONG)',
    aliases: ['Apex Global Logistics HK Ltd'],
    riskScore: 91.0,
    threatLevel: 'CRITICAL',
    status: 'FROZEN_ASSET',
    category: 'Front Commercial Entity',
    biometrics: {
      registrationNo: 'HK-CR-892144',
      jurisdiction: 'Hong Kong SAR',
      registeredDirector: 'Rahul Sharma (Proxy)'
    },
    knownAssociates: [
      { id: 'ENT-8921', name: 'Rahul Sharma', relation: 'Beneficial Owner', risk: 'CRITICAL' }
    ],
    financialAccounts: [
      { bank: 'HSBC Hong Kong', accNo: '****-8402', balance: '$1.8M USD' }
    ],
    burnerDevices: []
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

export default router;
