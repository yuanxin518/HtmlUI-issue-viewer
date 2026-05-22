import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const categoriesRouter = Router();

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

// GET /api/categories — list all categories
categoriesRouter.get('/', (req: Request, res: Response) => {
  const dir = readDirectory(req);
  res.json({ categories: dir.categories });
});

// POST /api/categories — create a new category
categoriesRouter.post('/', (req: Request, res: Response) => {
  const { name, icon } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const dir = readDirectory(req);
  if (dir.categories.find(c => c.name === name)) {
    return res.status(409).json({ error: `Category "${name}" already exists` });
  }

  dir.categories.push({ name, icon: icon || 'FolderOpenOutlined', topics: [] });
  writeDirectory(req, dir);
  res.status(201).json({ message: 'Category created', name });
});

// PUT /api/categories/:name — update a category
categoriesRouter.put('/:name', (req: Request, res: Response) => {
  const oldName = decodeURIComponent(req.params.name);
  const { name, icon } = req.body;
  const dir = readDirectory(req);
  const cat = dir.categories.find(c => c.name === oldName);
  if (!cat) return res.status(404).json({ error: 'Category not found' });

  if (name) cat.name = name;
  if (icon) cat.icon = icon;
  writeDirectory(req, dir);
  res.json({ message: 'Category updated' });
});

// DELETE /api/categories/:name — delete a category and its topics
categoriesRouter.delete('/:name', (req: Request, res: Response) => {
  const name = decodeURIComponent(req.params.name);
  const dir = readDirectory(req);
  const idx = dir.categories.findIndex(c => c.name === name);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });

  dir.categories.splice(idx, 1);
  writeDirectory(req, dir);
  res.json({ message: 'Category deleted', name });
});
