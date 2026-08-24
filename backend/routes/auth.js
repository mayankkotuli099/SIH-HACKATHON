import express from 'express';

const router = express.Router();

// Mock in-memory user store
const users = [
  {
    id: 'OP_01',
    name: 'Operator 01',
    role: 'Lead Forensic Investigator',
    clearance: 'LEVEL 4 ACCESS',
    badgeId: '#CL-8921',
    email: 'op01@crimelens.intel.gov'
  }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ success: false, error: 'Investigator ID and password are required.' });
  }

  // Find user or generate session
  const user = users.find((u) => u.id.toLowerCase() === id.toLowerCase()) || {
    id: id.toUpperCase(),
    name: `Investigator ${id.toUpperCase()}`,
    role: 'Tactical Analyst',
    clearance: 'LEVEL 4 ACCESS',
    badgeId: `#CL-${Math.floor(1000 + Math.random() * 9000)}`,
    email: `${id.toLowerCase()}@crimelens.intel.gov`
  };

  const token = `cl_token_${Buffer.from(id + ':' + Date.now()).toString('base64')}`;

  return res.json({
    success: true,
    message: 'Authentication successful. Security Level 4 granted.',
    token,
    user
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { id, name, password } = req.body;

  if (!id || !name || !password) {
    return res.status(400).json({ success: false, error: 'All registration fields are required.' });
  }

  const newUser = {
    id: id.toUpperCase(),
    name,
    role: 'Field Analyst',
    clearance: 'LEVEL 4 ACCESS',
    badgeId: `#CL-${Math.floor(1000 + Math.random() * 9000)}`,
    email: `${id.toLowerCase()}@crimelens.intel.gov`
  };

  users.push(newUser);
  const token = `cl_token_${Buffer.from(id + ':' + Date.now()).toString('base64')}`;

  return res.status(201).json({
    success: true,
    message: 'Investigator credentials registered successfully.',
    token,
    user: newUser
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: users[0]
  });
});

export default router;
