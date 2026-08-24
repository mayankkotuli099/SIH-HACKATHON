import express from 'express';

const router = express.Router();

const timelineEvents = [
  {
    id: 'TL-101',
    timestamp: '2024-10-27 14:32:01 UTC',
    title: 'Encrypted C2 Handshake',
    category: 'NETWORK',
    severity: 'LOW',
    entity: 'NODE_X92_BETA',
    description: 'Direct TLS 1.3 encrypted handshake with Frankfurt exit node.',
    confidence: '98.5%',
    coordinates: '50.1109° N, 8.6821° E'
  },
  {
    id: 'TL-102',
    timestamp: '2024-10-27 14:02:18 UTC',
    title: '$450,000 Offshore Wire Transfer',
    category: 'FINANCIAL',
    severity: 'HIGH',
    entity: 'Shell Corp B -> Dubai Bullion',
    description: 'Wire initiated via proxy bank account. Flagged by anti-money laundering anomaly engine.',
    confidence: '99.1%',
    coordinates: '25.2048° N, 55.2708° E'
  },
  {
    id: 'TL-103',
    timestamp: '2024-10-27 13:54:10 UTC',
    title: 'Burner SIM Geolocation Triangulation',
    category: 'GEOSPATIAL',
    severity: 'MEDIUM',
    entity: 'Rahul Sharma (+91-98765-43210)',
    description: 'Cell tower ping near DLF Cyber Hub Sector 29.',
    confidence: '92.0%',
    coordinates: '28.4595° N, 77.0266° E'
  },
  {
    id: 'TL-104',
    timestamp: '2024-10-27 11:18:40 UTC',
    title: 'Wiretap Audio Intercept: VoIP Session #44',
    category: 'COMMUNICATION',
    severity: 'CRITICAL',
    entity: 'Rahul Sharma & Vikram Mehta',
    description: 'Discussed delivery of gold bullion consignments and alternate banking rails.',
    confidence: '96.8%',
    coordinates: 'Encrypted SIP VoIP Trunk'
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
        t.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    totalCount: filtered.length,
    events: filtered
  });
});

export default router;
