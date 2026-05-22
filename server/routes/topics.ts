import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const topicsRouter = Router();

interface Topic {
  id: string;
  title: string;
  file: string;
}

interface Category {
  name: string;
  icon: string;
  topics: Topic[];
}

interface Directory {
  categories: Category[];
}

function getDataDir(req: Request): string {
  return req.app.locals.dataDir as string;
}

function readDirectory(req: Request): Directory {
  const filePath = path.join(getDataDir(req), 'directory.json');
  if (!fs.existsSync(filePath)) return { categories: [] };
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeDirectory(req: Request, dir: Directory): void {
  const filePath = path.join(getDataDir(req), 'directory.json');
  fs.writeFileSync(filePath, JSON.stringify(dir, null, 2), 'utf-8');
}

// POST /api/topics — add a topic to a category
topicsRouter.post('/', (req: Request, res: Response) => {
  const { categoryName, id, title, file } = req.body;
  if (!categoryName || !id || !title) {
    return res.status(400).json({ error: 'categoryName, id, title are required' });
  }

  const dir = readDirectory(req);
  const cat = dir.categories.find(c => c.name === categoryName);
  if (!cat) return res.status(404).json({ error: `Category "${categoryName}" not found` });

  if (cat.topics.find(t => t.id === id)) {
    return res.status(409).json({ error: `Topic "${id}" already exists in this category` });
  }

  const topic: Topic = { id, title, file: file || `${id}.html` };
  cat.topics.push(topic);
  writeDirectory(req, dir);
  res.status(201).json({ message: 'Topic added', topic });
});

// PUT /api/topics/:id — update a topic
topicsRouter.put('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, file, categoryName } = req.body;
  const dir = readDirectory(req);

  for (const cat of dir.categories) {
    const topic = cat.topics.find(t => t.id === id);
    if (topic) {
      if (title) topic.title = title;
      if (file) topic.file = file;

      // Move to different category if requested
      if (categoryName && categoryName !== cat.name) {
        const targetCat = dir.categories.find(c => c.name === categoryName);
        if (!targetCat) return res.status(404).json({ error: `Category "${categoryName}" not found` });
        cat.topics = cat.topics.filter(t => t.id !== id);
        targetCat.topics.push(topic);
      }

      writeDirectory(req, dir);
      return res.json({ message: 'Topic updated', topic });
    }
  }

  res.status(404).json({ error: `Topic "${id}" not found` });
});

// DELETE /api/topics/:id — delete a topic
topicsRouter.delete('/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const dir = readDirectory(req);

  for (const cat of dir.categories) {
    const idx = cat.topics.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = cat.topics.splice(idx, 1)[0];
      writeDirectory(req, dir);
      return res.json({ message: 'Topic deleted', topic: removed });
    }
  }

  res.status(404).json({ error: `Topic "${id}" not found` });
});
