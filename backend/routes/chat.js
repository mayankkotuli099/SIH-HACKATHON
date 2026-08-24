import express from 'express';

const router = express.Router();

// POST /api/chat/query - AI Investigation Copilot
router.post('/query', (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: 'Query message is required.' });
  }

  const q = message.toLowerCase();
  let aiResponse = {
    text: '',
    entities: [],
    note: '',
    confidence: '95.4%'
  };

  if (q.includes('shell corp') || q.includes('financial') || q.includes('money') || q.includes('wire')) {
    aiResponse = {
      text: 'Analyzing network connections for Shell Corp B: identified 12 direct transactions totaling $450,000 USD matching known criminal syndicate associates.',
      entities: [
        { label: 'TARGET: RAHUL SHARMA', type: 'target' },
        { label: 'SUSPICIOUS TRANSFER: $450,000 via Shell Corp B', type: 'money' },
        { label: 'DESTINATION: Dubai Bullion Exchange', type: 'location' }
      ],
      note: 'Registered director of "Apex Global Logistics", a suspected front company in Hong Kong.',
      confidence: '98.2%'
    };
  } else if (q.includes('rahul') || q.includes('suspect') || q.includes('boss')) {
    aiResponse = {
      text: 'Target profile for RAHUL SHARMA (ID #ENT-8921): Risk Score 94.2/100 (CRITICAL). Connected to 3 burner SIMs, 2 offshore accounts, and 4 Hawala brokers in NCR.',
      entities: [
        { label: 'PRIMARY: RAHUL SHARMA', type: 'target' },
        { label: 'HAWALA BROKER: Vikram Mehta', type: 'target' },
        { label: 'BURNER: +91-98765-43210', type: 'money' }
      ],
      note: 'Voiceprint matched in Wiretap Session #44 with 96.8% biometric certainty.',
      confidence: '96.8%'
    };
  } else if (q.includes('location') || q.includes('gps') || q.includes('tower')) {
    aiResponse = {
      text: 'Geospatial vector analysis: Cell tower triangulated target signal at Sector 29 Cyber Hub (28.4595° N, 77.0266° E) at 13:54 UTC.',
      entities: [
        { label: 'VECTOR: Sector 29 Cyber Hub', type: 'location' },
        { label: 'DEVICE: IMEI 864201938472910', type: 'target' }
      ],
      note: 'Target crossed geofence boundary within 15 minutes of wire transfer dispatch.',
      confidence: '92.0%'
    };
  } else {
    aiResponse = {
      text: `CrimeLens Neural Copilot analyzed query: "${message}". Scanned 12,458 indexed entities across 4 active syndicates. Zero conflicting alibis found.`,
      entities: [
        { label: 'CLUSTER: Alpha 9 Syndicate', type: 'target' },
        { label: 'CLEARANCE: Level 4 Active', type: 'money' }
      ],
      note: 'Cross-referenced against SIGINT domestic wire logs and INTERPOL Red Notices.',
      confidence: '94.0%'
    };
  }

  res.json({
    success: true,
    response: aiResponse
  });
});

export default router;
