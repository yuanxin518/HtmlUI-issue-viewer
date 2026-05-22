# HtmlUI Topic Viewer

A topic-based HTML content management and preview system. Built with React, Ant Design, and Express.

## Architecture

```
Browser (SPA) → Express Server ─┬─ /api/*   → JSON CRUD
                                 ├─ /ai/*    → Markdown prompts
                                 └─ /topics/ → Static HTML files
```

- **SPA** — React 18 + Ant Design. Sidebar navigation with category/topic tree, HTML preview via iframe.
- **Service API** (`/api/*`) — RESTful endpoints for categories, topics, files, and templates.
- **AI Proxy** (`/ai/*`) — Mirrors the Service API but returns Markdown prompt text for AI agents.
- **Data Layer** — Runtime data in `data/` directory, mounted as Docker volume for hot-reload.

## Quick Start

```bash
# Install
npm install

# Development (frontend on :1233, backend on :1234)
npm run dev        # Vite dev server
npm run start      # Express API server

# Production
npm run build
npm run start      # Serves both SPA and API on :1234
```

### Docker

```bash
docker build -t topic-viewer .
docker run -d -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

Data files are volume-mounted — updates take effect without rebuilding.

## API Reference

### Service Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List categories with topics |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:name` | Update category |
| DELETE | `/api/categories/:name` | Delete category |
| POST | `/api/topics` | Add topic |
| PUT | `/api/topics/:id` | Update topic |
| DELETE | `/api/topics/:id` | Delete topic |
| GET | `/api/files` | List HTML files |
| POST | `/api/files/upload` | Upload HTML file |
| POST | `/api/files/content` | Save HTML content |
| DELETE | `/api/files/:filename` | Delete file |
| GET | `/api/templates` | List templates |
| GET | `/api/templates/:id` | Get template detail |

### AI Proxy Endpoints

All `/ai/*` endpoints return Markdown prompt text instead of JSON.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ai` | List available AI endpoints |
| GET | `/ai/categories` | Prompt: list categories |
| POST | `/ai/categories` | Prompt: create category |
| GET | `/ai/topics` | Prompt: list topics |
| POST | `/ai/topics` | Prompt: add topic |
| GET | `/ai/files` | Prompt: list files |
| POST | `/ai/files/content` | Prompt: save HTML content |
| GET | `/ai/templates` | Prompt: list templates |
| GET | `/ai/templates/:id` | Prompt: get template detail |

## Data Directory

```
data/
├── directory.json     # Category and topic configuration
└── topics/            # HTML topic files (not version-controlled)
```

To add topics:
1. Place the HTML file in `data/topics/`
2. Update `data/directory.json`
3. Refresh browser — changes are instant with Docker volumes

## Project Structure

```
src/                    # Frontend
├── types/              # TypeScript definitions
├── api/                # API client
├── hooks/              # Custom hooks
├── components/         # UI components
│   ├── Layout/         # App layout
│   ├── Sidebar/        # Navigation tree
│   └── Viewer/         # HTML preview
└── App.tsx

server/                 # Backend
├── index.ts            # Express entry point
├── routes/             # Service API handlers
│   ├── categories.ts
│   ├── topics.ts
│   ├── files.ts
│   └── templates.ts
└── ai/
    └── proxy.ts        # AI prompt proxy
```

## License

MIT
