import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Modular API Routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import entitiesRoutes from './routes/entities.js';
import networkRoutes from './routes/network.js';
import timelineRoutes from './routes/timeline.js';
import casesRoutes from './routes/cases.js';
import chatRoutes from './routes/chat.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CrimeLens Forensic & Intelligence Backend API',
    clearance: 'LEVEL 4 CLEARANCE',
    activeNeuralEngine: 'CrimeLens-Titan v4.2',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entities', entitiesRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/settings', settingsRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.send('CrimeLens Intelligence Backend API Gateway is Operational.');
});

app.listen(PORT, () => {
  console.log(`[CrimeLens Backend] Intelligence API server running on http://localhost:${PORT}`);
});
