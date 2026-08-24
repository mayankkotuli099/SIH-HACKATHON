import express from 'express';

const router = express.Router();

let metricsData = {
  totalEntities: 12458,
  relationships: 35789,
  activeCases: 245,
  highRiskEntities: 32
};

let telemetryLogs = [
  {
    id: 101,
    time: '2024-10-27 15:10:22',
    type: 'BALLISTICS HIT',
    typeColor: '#FF5555',
    entity: "CRIME SCENE #18 → VIKRAM 'RAJA' MALHOTRA",
    severity: '▲ CRITICAL',
    severityBadge: 'CRITICAL',
    severityColor: '#FF5555',
    action: 'DISPATCH STF',
    rawPayload: 'FSL Forensic Ballistics match: 9mm cartridge casing recovered from Sector 18 double homicide fired from seized Beretta #92FS-881.',
    hash: 'sha256:4f8a91c78b66e9921c',
    location: 'Sector 18 Homicide Scene (28.5700° N, 77.3200° E)',
    interceptType: 'FORENSIC_BALLISTICS'
  },
  {
    id: 102,
    time: '2024-10-27 14:48:15',
    type: 'DNA MATCH ALERT',
    typeColor: '#FF5555',
    entity: "DEVENDRA 'D-7' RAWAT (Fugitive)",
    severity: '▲ CRITICAL',
    severityBadge: 'CRITICAL',
    severityColor: '#FF5555',
    action: 'APPREHEND',
    rawPayload: 'Automated National DNA Registry hit: 100% STR profile match with evidence kit from Sector 14 highway abduction case.',
    hash: 'sha256:b93c8472ef9104492a',
    location: 'Special SIT Forensics Lab',
    interceptType: 'DNA_FORENSICS'
  },
  {
    id: 103,
    time: '2024-10-27 14:22:40',
    type: 'ANPR TOLL HIT',
    typeColor: '#FBBF24',
    entity: 'ARMED HEIST GETAWAY (HR-26-XX-4902)',
    severity: 'HIGH',
    severityBadge: 'HIGH',
    severityColor: '#FBBF24',
    action: 'INTERCEPT',
    rawPayload: 'Automatic Number Plate Recognition camera detected suspect Bolero vehicle used in Axis Bank gold heist heading towards Meerut Expressway.',
    hash: 'sha256:71de01488ca901192b',
    location: 'KMP Expressway Toll Gate #4',
    interceptType: 'HIGHWAY_SURVEILLANCE'
  },
  {
    id: 104,
    time: '2024-10-27 13:58:18',
    type: 'PORT NARCO SEIZURE',
    typeColor: '#A855F7',
    entity: 'ELENA ROSTOVA → PORT TERMINAL C',
    severity: 'HIGH',
    severityBadge: 'HIGH',
    severityColor: '#A855F7',
    action: 'SEAL CARGO',
    rawPayload: 'Customs & NCB special inspection intercepted container with 100kg synthetic heroin hidden inside industrial compressor units.',
    hash: 'sha256:dd82910fa31b57891c',
    location: 'Port Container Terminal C',
    interceptType: 'NARCOTICS_INTERCEPT'
  },
  {
    id: 105,
    time: '2024-10-27 13:30:10',
    type: 'EXTORTION WIREPING',
    typeColor: 'var(--cyan-glow)',
    entity: "MAHESH 'TIGER' KHAN SYNDICATE",
    severity: 'MEDIUM',
    severityBadge: 'MEDIUM',
    severityColor: 'var(--cyan-glow)',
    action: 'VIEW RECORD',
    rawPayload: 'Voice intercept: Threat call recorded demanding ₹50 Lakhs ransom from real estate developer in Sector 62.',
    hash: 'sha256:aa290192eef814402a',
    location: 'Cell Tower #88 Gurgaon',
    interceptType: 'SIGINT_EXTORTION'
  }
];

// GET /api/dashboard/overview - Dashboard stats and recent telemetry feed
router.get('/overview', (req, res) => {
  const metrics = [
    {
      id: 'entities',
      title: 'WANTED CRIMINALS',
      value: metricsData.totalEntities,
      displayValue: metricsData.totalEntities.toLocaleString(),
      change: '+18 Active Warrants this week',
      icon: '🚨',
      borderAccent: 'rgba(255, 85, 85, 0.3)',
      targetPage: 'entities'
    },
    {
      id: 'relationships',
      title: 'CRIME SYNDICATE LINKS',
      value: metricsData.relationships,
      displayValue: metricsData.relationships.toLocaleString(),
      change: '+45 Gang Associates mapped',
      icon: '🕸️',
      borderAccent: 'rgba(0, 229, 255, 0.2)',
      targetPage: 'network'
    },
    {
      id: 'cases',
      title: 'ACTIVE FIR & CASES',
      value: metricsData.activeCases,
      displayValue: String(metricsData.activeCases),
      change: '14 Homicide & Rape cases in SIT',
      icon: '📁',
      borderAccent: 'rgba(251, 191, 36, 0.2)',
      targetPage: 'cases'
    },
    {
      id: 'high-risk',
      title: 'RED CORNER FUGITIVES',
      value: metricsData.highRiskEntities,
      displayValue: `${metricsData.highRiskEntities} •`,
      change: '! RED ALERT MANHUNT IN PROGRESS',
      icon: '⚠️',
      isWarning: true,
      borderAccent: 'rgba(255, 85, 85, 0.5)',
      targetPage: 'entities'
    }
  ];

  res.json({
    success: true,
    metrics: metrics,
    logs: telemetryLogs
  });
});

// POST /api/dashboard/query - Dispatch a target query
router.post('/query', (req, res) => {
  const { targetType, identifier, jurisdiction, priority } = req.body;

  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Identifier is required.' });
  }

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newLog = {
    id: Date.now(),
    time: timeStr,
    type: 'MANUAL QUERY',
    typeColor: 'var(--cyan-glow)',
    entity: `TARGET: ${identifier.toUpperCase()} [${targetType || 'PERSON_OF_INTEREST'}]`,
    severity: priority === 'CRITICAL' ? '▲ CRITICAL' : (priority || 'HIGH'),
    severityBadge: priority || 'HIGH',
    severityColor: priority === 'CRITICAL' ? '#FF5555' : 'var(--cyan-glow)',
    action: 'VIEW DETAILS',
    rawPayload: `Operator dispatched search on jurisdiction: ${jurisdiction || 'DOMESTIC_SIGINT'}. Neural indexing active.`,
    hash: `sha256:${Math.random().toString(16).substring(2, 12)}...`,
    location: 'Direct Operator Terminal',
    interceptType: 'OPERATOR_DISPATCH'
  };

  telemetryLogs.unshift(newLog);
  metricsData.totalEntities += 1;
  metricsData.relationships += 2;

  res.status(201).json({
    success: true,
    message: `Query for target "${identifier}" dispatched successfully.`,
    log: newLog
  });
});

export default router;
