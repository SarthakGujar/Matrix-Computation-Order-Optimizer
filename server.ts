import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { validateDimensions, solveMCM } from './src/lib/mcm.ts';
import { SAMPLE_PROBLEMS } from './src/data/sampleProblems.ts';
import {
  getOrCreateUser,
  saveOptimizationRun,
  getOptimizationRuns,
  getOptimizationRunById,
  deleteOptimizationRun,
} from './src/db/users.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Optimize Matrix Chain Multiplication
  app.post('/api/optimize', (req: Request, res: Response) => {
    try {
      const { dimensions } = req.body;
      if (!dimensions) {
        return res.status(400).json({ error: 'Missing dimensions array in request body.' });
      }

      const numDims = dimensions.map((d: any) => Number(d));
      const validation = validateDimensions(numDims);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }

      const result = solveMCM(numDims);
      return res.json(result);
    } catch (error: any) {
      console.error('Error in /api/optimize:', error);
      return res.status(500).json({ error: 'An unexpected error occurred during optimization.' });
    }
  });

  // Get Sample Problems
  app.get('/api/examples', (_req: Request, res: Response) => {
    res.json(SAMPLE_PROBLEMS);
  });

  // Save an optimization run (authenticated or guest session)
  app.post('/api/history', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { name, matrixCount, dimensions, minimumCost, parenthesization, costTable, splitTable } = req.body;

      if (!dimensions || !matrixCount || minimumCost === undefined || !parenthesization) {
        return res.status(400).json({ error: 'Incomplete optimization run data.' });
      }

      let userId: number | undefined;
      const userUid = req.user?.uid;

      if (userUid && req.user?.email) {
        try {
          const dbUser = await getOrCreateUser(
            userUid,
            req.user.email,
            req.user.name || undefined,
            req.user.picture || undefined
          );
          userId = dbUser.id;
        } catch (uErr) {
          console.warn('Could not associate user record:', uErr);
        }
      }

      const saved = await saveOptimizationRun({
        userId,
        userUid,
        name,
        matrixCount: Number(matrixCount),
        dimensions,
        minimumCost: String(minimumCost),
        parenthesization,
        costTable,
        splitTable,
      });

      return res.status(201).json(saved);
    } catch (error: any) {
      console.error('Error saving optimization history:', error);
      return res.status(500).json({ error: 'Failed to save optimization run.' });
    }
  });

  // Get optimization history
  app.get('/api/history', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const runs = await getOptimizationRuns(req.user?.uid);
      return res.json(runs);
    } catch (error: any) {
      console.error('Error fetching optimization history:', error);
      return res.status(500).json({ error: 'Failed to fetch optimization history.' });
    }
  });

  // Get specific run by id
  app.get('/api/history/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid run ID.' });
      }
      const run = await getOptimizationRunById(id, req.user?.uid);
      if (!run) {
        return res.status(404).json({ error: 'Optimization run not found.' });
      }
      return res.json(run);
    } catch (error: any) {
      console.error('Error fetching run by id:', error);
      return res.status(500).json({ error: 'Failed to retrieve run.' });
    }
  });

  // Delete specific run
  app.delete('/api/history/:id', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid run ID.' });
      }
      const deleted = await deleteOptimizationRun(id, req.user?.uid);
      if (!deleted) {
        return res.status(404).json({ error: 'Run not found or permission denied.' });
      }
      return res.json({ success: true, message: 'Run deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting run:', error);
      return res.status(500).json({ error: 'Failed to delete optimization run.' });
    }
  });

  // User sync
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.uid || !req.user.email) {
        return res.status(400).json({ error: 'Missing user credentials in token.' });
      }
      const dbUser = await getOrCreateUser(
        req.user.uid,
        req.user.email,
        req.user.name || undefined,
        req.user.picture || undefined
      );
      return res.json(dbUser);
    } catch (error: any) {
      console.error('Error syncing user:', error);
      return res.status(500).json({ error: 'Failed to sync user data.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
