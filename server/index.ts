import express from 'express';
import cors from 'cors';
import path from 'path';
import { categoriesRouter } from './routes/categories';
import { topicsRouter } from './routes/topics';
import { filesRouter } from './routes/files';
import { templatesRouter } from './routes/templates';
import { aiRouter } from './ai/proxy';

const app = express();
const PORT = process.env.PORT || 1234;
const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.locals.dataDir = DATA_DIR;

// ── Service API routes ──
app.use('/api/categories', categoriesRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/files', filesRouter);
app.use('/api/templates', templatesRouter);

// ── AI proxy routes (returns markdown prompts) ──
// /ai/* mirrors /api/* but returns prompt text instead of data
app.use('/ai', aiRouter);

// ── Serve built SPA ──
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback for non-API routes
app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/ai/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] running on http://0.0.0.0:${PORT}`);
  console.log(`[server] Data dir: ${DATA_DIR}`);
  console.log(`[server] API:  /api/*`);
  console.log(`[server] AI:   /ai/*  → returns markdown prompts`);
});
