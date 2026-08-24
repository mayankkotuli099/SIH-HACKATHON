import express from 'express';

const router = express.Router();

const networkClusters = {
  CLUSTER_ALPHA_9: {
    id: 'CLUSTER_ALPHA_9',
    name: 'Syndicate Command Core (Alpha 9)',
    description: 'Central command nexus coordinating multi-state hawala and encrypted communications.',
    nodes: [
      { id: 'N1', label: 'Rahul Sharma', category: 'SUSPECT', risk: 95, degree: 14, group: 'CORE' },
      { id: 'N2', label: 'Shell Corp B (HK)', category: 'FINANCIAL', risk: 89, degree: 8, group: 'FINANCE' },
      { id: 'N3', label: 'Vikram Mehta', category: 'SUSPECT', risk: 88, degree: 9, group: 'CORE' },
      { id: 'N4', label: 'Burner +91-98765...', category: 'COMMUNICATION', risk: 78, degree: 6, group: 'SIGINT' },
      { id: 'N5', label: 'Dubai Bullion Vault', category: 'FINANCIAL', risk: 92, degree: 5, group: 'FINANCE' },
      { id: 'N6', label: 'IP 77.9.142.88 (C2)', category: 'INFRASTRUCTURE', risk: 99, degree: 12, group: 'CYBER' }
    ],
    edges: [
      { source: 'N1', target: 'N2', label: '$450K Wire', weight: 4.5, type: 'TRANSACTION' },
      { source: 'N1', target: 'N3', label: 'Encrypted Calls (42)', weight: 3.8, type: 'CALL' },
      { source: 'N1', target: 'N4', label: 'SIM Insertion', weight: 2.0, type: 'DEVICE' },
      { source: 'N2', target: 'N5', label: 'Hawala Gold Purchase', weight: 5.0, type: 'TRANSACTION' },
      { source: 'N1', target: 'N6', label: 'C2 Keep-Alive Ping', weight: 4.0, type: 'NETWORK' },
      { source: 'N3', target: 'N5', label: 'Escrow Release', weight: 3.2, type: 'TRANSACTION' }
    ]
  },
  CLUSTER_FINANCIAL_NEXUS: {
    id: 'CLUSTER_FINANCIAL_NEXUS',
    name: 'Cross-Border Financial Trail',
    description: 'Offshore shell companies, multi-layered wire transfers, and crypto escrow pools.',
    nodes: [
      { id: 'FN1', label: 'Apex Logistics Holdings', category: 'FINANCIAL', risk: 91, degree: 7, group: 'FINANCE' },
      { id: 'FN2', label: 'Dubai Bullion Exchange', category: 'FINANCIAL', risk: 97, degree: 11, group: 'FINANCE' },
      { id: 'FN3', label: 'Swiss Escrow #88', category: 'FINANCIAL', risk: 78, degree: 4, group: 'FINANCE' },
      { id: 'FN4', label: 'Tether USDT Mixer', category: 'CRYPTO', risk: 99, degree: 15, group: 'CYBER' }
    ],
    edges: [
      { source: 'FN1', target: 'FN2', label: '$1.2M Bullion Route', weight: 5.0, type: 'TRANSACTION' },
      { source: 'FN2', target: 'FN3', label: 'Tier 1 Private Transfer', weight: 4.2, type: 'TRANSACTION' },
      { source: 'FN1', target: 'FN4', label: 'DeFi Mixer Swap', weight: 4.8, type: 'CRYPTO' }
    ]
  }
};

// GET /api/network/clusters - Get all network clusters
router.get('/clusters', (req, res) => {
  res.json({
    success: true,
    clusters: Object.values(networkClusters)
  });
});

// GET /api/network/:clusterId - Get specific cluster graph
router.get('/:clusterId', (req, res) => {
  const cluster = networkClusters[req.params.clusterId.toUpperCase()] || networkClusters.CLUSTER_ALPHA_9;
  res.json({
    success: true,
    cluster
  });
});

export default router;
