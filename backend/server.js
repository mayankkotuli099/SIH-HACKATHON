import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CrimeLens Intelligence Backend',
    clearance: 'LEVEL 4',
    timestamp: new Date().toISOString()
  });
});

// Telemetry & Investigation Feed Routes
app.get('/api/telemetry/live', (req, res) => {
  res.json({
    activeCluster: 'CLUSTER_ALPHA_9',
    telemetryStream: [
      {
        id: 101,
        time: new Date().toISOString(),
        type: 'NEW CONNECTION',
        entity: 'NODE_X92_BETA → ALIAS_UK_09',
        severity: 'LOW',
        location: 'Frankfurt DE -> Zurich CH'
      },
      {
        id: 102,
        time: new Date().toISOString(),
        type: 'ANOMALY DETECTED',
        entity: 'IP_ROUTE_77.9.XX',
        severity: 'CRITICAL',
        location: 'Hong Kong SAR'
      }
    ]
  });
});

// Entities API Route
app.get('/api/entities', (req, res) => {
  res.json({
    totalCount: 12458,
    entities: [
      { id: 'E1', name: 'RAHUL SHARMA', aliases: ['Apex Master', 'Operator Zero'], riskScore: 94.2 },
      { id: 'E2', name: 'SHELL CORP B', jurisdiction: 'Hong Kong', riskScore: 89.0 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[CrimeLens Backend] Intelligence API server running on port ${PORT}`);
});
