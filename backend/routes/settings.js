import express from 'express';

const router = express.Router();

let settingsData = {
  model: 'crimelens-titan-4.2',
  sensitivity: 85,
  alertsEnabled: true,
  autoDossier: true,
  shaVerification: true
};

// GET /api/settings
router.get('/', (req, res) => {
  res.json({
    success: true,
    settings: settingsData
  });
});

// POST /api/settings - Update settings
router.post('/', (req, res) => {
  const updates = req.body;
  settingsData = { ...settingsData, ...updates };

  res.json({
    success: true,
    message: 'System settings synchronized successfully.',
    settings: settingsData
  });
});

export default router;
