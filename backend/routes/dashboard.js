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
    time: '2024-10-27 14:32:01',
    type: 'NEW CONNECTION',
    typeColor: 'var(--cyan-glow)',
    entity: 'NODE_X92_BETA → ALIAS_UK_09',
    severity: 'LOW',
    severityBadge: 'LOW',
    severityColor: 'var(--text-secondary)',
    action: 'VIEW DETAILS',
    rawPayload: 'Direct TCP handshake logged on port 8443 with encrypted payload size 12.4 KB.',
    hash: 'sha256:4f8a91c78b66e...',
    location: 'Frankfurt DE -> Zurich CH',
    interceptType: 'NETWORK_TELEMETRY'
  },
  {
    id: 102,
    time: '2024-10-27 14:28:45',
    type: 'ANOMALY DETECTED',
    typeColor: '#FF5555',
    entity: 'IP_ROUTE_77.9.XX',
    severity: '▲ CRITICAL',
    severityBadge: 'CRITICAL',
    severityColor: '#FF5555',
    action: 'INVESTIGATE',
    rawPayload: 'Surge of 400+ encrypted packets to known C2 server in under 12 seconds.',
    hash: 'sha256:b93c8472ef910...',
    location: 'Hong Kong SAR',
    interceptType: 'SIGNALS_INTELLIGENCE'
  },
  {
    id: 103,
    time: '2024-10-27 14:15:22',
    type: 'DATA IMPORT',
    typeColor: 'var(--text-muted)',
    entity: 'BATCH_REQ_992 (450 records)',
    severity: 'INFO',
    severityBadge: 'INFO',
    severityColor: 'var(--text-muted)',
    action: 'VIEW LOG',
    rawPayload: 'Batch bank transaction CSV ingested into unified knowledge graph. 32 new suspect links synthesized.',
    hash: 'sha256:71de01488ca90...',
    location: 'Internal Ingestion Pipeline',
    interceptType: 'DATA_INGESTION'
  },
  {
    id: 104,
    time: '2024-10-27 14:02:18',
    type: 'SUSPICIOUS TRANSFER',
    typeColor: '#FBBF24',
    entity: 'SHELL_CORP_B → DUBAI_BULLION',
    severity: 'HIGH',
    severityBadge: 'HIGH',
    severityColor: '#FBBF24',
    action: 'INVESTIGATE',
    rawPayload: 'Automated wire of $450,000 USD routed via three intermediate escrow accounts.',
    hash: 'sha256:dd82910fa31b5...',
    location: 'Dubai UAE',
    interceptType: 'FINANCIAL_TRANSACTION'
  },
  {
    id: 105,
    time: '2024-10-27 13:54:10',
    type: 'GEOLOCATION PING',
    typeColor: 'var(--cyan-glow)',
    entity: 'RAHUL_SHARMA_ALIAS (Burner #2)',
    severity: 'MEDIUM',
    severityBadge: 'MEDIUM',
    severityColor: '#FBBF24',
    action: 'VIEW DETAILS',
    rawPayload: 'Triangulated cell tower handshake in Sector 29 Cyber Hub near financial district.',
    hash: 'sha256:aa290192eef81...',
    location: 'NCR 28.4595° N, 77.0266° E',
    interceptType: 'GEOSPATIAL_VECTOR'
  }
];

// GET /api/dashboard/overview
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    metrics: [
      {
        id: 'entities',
        title: 'TOTAL ENTITIES',
        value: metricsData.totalEntities,
        displayValue: metricsData.totalEntities.toLocaleString(),
        change: '+3.4% from last week',
        icon: '🛡️',
        borderAccent: 'rgba(0, 229, 255, 0.2)',
        targetPage: 'entities'
      },
      {
        id: 'relationships',
        title: 'RELATIONSHIPS',
        value: metricsData.relationships,
        displayValue: metricsData.relationships.toLocaleString(),
        change: '+8.1% from last week',
        icon: '🕸️',
        borderAccent: 'rgba(41, 121, 255, 0.2)',
        targetPage: 'network'
      },
      {
        id: 'cases',
        title: 'ACTIVE CASES',
        value: metricsData.activeCases,
        displayValue: String(metricsData.activeCases),
        change: '12 REQUIRING ATTENTION',
        icon: '📁',
        borderAccent: 'rgba(0, 230, 118, 0.2)',
        targetPage: 'cases'
      },
      {
        id: 'high-risk',
        title: 'HIGH-RISK ENTITIES',
        value: metricsData.highRiskEntities,
        displayValue: `${metricsData.highRiskEntities} •`,
        change: '! IMMEDIATE REVIEW REQUIRED',
        icon: '⚠️',
        isWarning: true,
        borderAccent: 'rgba(255, 85, 85, 0.4)',
        targetPage: 'entities'
      }
    ],
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
