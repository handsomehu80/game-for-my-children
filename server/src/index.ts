import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import playerRoutes from './routes/player';
import answerRoutes from './routes/answer';
import knowledgeRoutes from './routes/knowledge';
import parentRoutes from './routes/parent';
import coopRoutes from './routes/coop';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/player', playerRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/coop', coopRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    console.log('Database initialized');

    app.listen(PORT, () => {
      console.log(`Learning Tracking Server running on http://localhost:${PORT}`);
      console.log('Available endpoints:');
      console.log('  POST   /api/player/create             - Create a new player');
      console.log('  GET    /api/player/:id/profile       - Get player learning profile');
      console.log('  POST   /api/answer/record             - Record an answer');
      console.log('  GET    /api/knowledge/:id/mastery    - Get knowledge point mastery');
      console.log('  GET    /api/parent/:playerId/summary - Get parent dashboard summary');
      console.log('  GET    /api/parent/:playerId/weak-points - Get weak points');
      console.log('  GET    /api/parent/:playerId/progress    - Get progress trend');
      console.log('  POST   /api/coop/session              - Create co-op session');
      console.log('  PUT    /api/coop/session/:id          - Update co-op session');
      console.log('  GET    /api/coop/session/:id         - Get co-op session');
      console.log('  GET    /api/coop/sessions/:playerId  - Get player co-op sessions');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
