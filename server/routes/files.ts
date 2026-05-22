import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const filesRouter = Router();

function getTopicsDir(req: Request): string {
  return path.join(req.app.locals.dataDir as string, 'topics');
}

// Multer config — save uploaded HTML files to data/topics/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getTopicsDir(req);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Preserve original filename, ensure .html extension
    let name = file.originalname;
    if (!name.endsWith('.html')) name += '.html';
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed'));
    }
  },
});

// GET /api/files — list HTML files
filesRouter.get('/', (req: Request, res: Response) => {
  const dir = getTopicsDir(req);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return res.json({ files: [] });
  }

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => {
      const stat = fs.statSync(path.join(dir, f));
      return { name: f, size: stat.size, mtime: stat.mtime.toISOString() };
    })
    .sort((a, b) => b.mtime.localeCompare(a.mtime));

  res.json({ files });
});

// POST /api/files/upload — upload an HTML file
filesRouter.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(201).json({
    message: 'File uploaded',
    file: {
      name: req.file.filename,
      size: req.file.size,
      path: `/topics/${req.file.filename}`,
    },
  });
});

// DELETE /api/files/:filename — delete an HTML file
filesRouter.delete('/:filename', (req: Request, res: Response) => {
  const filename = req.params.filename;
  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(getTopicsDir(req), filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  fs.unlinkSync(filePath);
  res.json({ message: 'File deleted', filename });
});

// POST /api/files/content — save HTML content as a file (no upload needed)
filesRouter.post('/content', (req: Request, res: Response) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) {
    return res.status(400).json({ error: 'filename and content are required' });
  }

  let name = filename;
  if (!name.endsWith('.html')) name += '.html';
  if (name.includes('..') || name.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const dir = getTopicsDir(req);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), content, 'utf-8');

  res.status(201).json({ message: 'File saved', file: { name, path: `/topics/${name}` } });
});
