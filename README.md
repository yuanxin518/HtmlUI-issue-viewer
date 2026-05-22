# HtmlUI Topic Viewer

A topic-based HTML content management and preview system. Built with React, Ant Design, and Express.

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser (SPA)                                  │
│  React + Ant Design                             │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  Express Server                                 │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  /api/*      │  │  /ai/*                   │ │
│  │  JSON CRUD   │  │  Markdown Prompt Proxy   │ │
│  └──────┬───────┘  └──────────┬───────────────┘ │
│         │                     │                  │
│         ▼                     │                  │
│  ┌──────────────┐             │                  │
│  │  data/       │◄────────────┘                  │
│  │  topics/     │                                │
│  │  directory   │                                │
│  └──────────────┘                                │
└──────────────────────────────────────────────────┘
```

### Layers

- **SPA** — React 18 application with Ant Design UI framework. Provides a sidebar navigation for categories and topics, and renders HTML content in an iframe preview pane.
- **Service API** (`/api/*`) — RESTful endpoints for managing categories, topics, HTML files, and templates. Returns JSON.
- **AI Proxy** (`/ai/*`) — Mirrors the Service API endpoints but returns Markdown-formatted prompt text. Designed for AI agents that need natural language descriptions of available operations and data structures.
- **Data Layer** — All runtime data (topic HTML files, directory configuration) is stored in the `data/` directory, which is mounted as a Docker volume for hot-reload without restarts.

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Development

```bash
# Install dependencies
npm install

# Start frontend dev server (port 1233)
npm run dev

# Start backend API server (port 1234)
npm run start

# Or both concurrently (in separate terminals)
```

### Production

```bash
# Build frontend assets
npm run build

# Start production server
npm run start
# Serves on http://localhost:1234
```

### Docker

```bash
docker build -t topic-viewer .
docker run -d \
  --name topic-viewer \
  -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

Data files are mounted as volumes, so updates take effect immediately without rebuilding the image.

## API Reference

### Service Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List all categories with topics |
| POST | `/api/categories` | Create a new category |
| PUT | `/api/categories/:name` | Update a category |
| DELETE | `/api/categories/:name` | Delete a category |
| POST | `/api/topics` | Add a topic to a category |
| PUT | `/api/topics/:id` | Update a topic |
| DELETE | `/api/topics/:id` | Delete a topic |
| GET | `/api/files` | List available HTML files |
| POST | `/api/files/upload` | Upload an HTML file |
| POST | `/api/files/content` | Save HTML content directly |
| DELETE | `/api/files/:filename` | Delete an HTML file |
| GET | `/api/templates` | List available templates |
| GET | `/api/templates/:id` | Get template details |

### AI Proxy Endpoints

All endpoints under `/ai/*` mirror the service API paths but return Markdown-format prompt text. These are intended for AI agents that need instruction prompts rather than raw data.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ai` | List all available AI endpoints |
| GET | `/ai/categories` | Prompt: list categories |
| POST | `/ai/categories` | Prompt: create category |
| GET | `/ai/topics` | Prompt: list topics |
| POST | `/ai/topics` | Prompt: add topic |
| DELETE | `/ai/topics/:id` | Prompt: delete topic |
| GET | `/ai/files` | Prompt: list files |
| POST | `/ai/files/content` | Prompt: save HTML content |
| GET | `/ai/templates` | Prompt: list templates |
| GET | `/ai/templates/:id` | Prompt: get template detail |

## Data Directory

```
data/
├── directory.json     # Category and topic configuration
└── topics/            # HTML topic files
    ├── react-intro.html
    ├── review-current.html
    └── ...
```

The `data/` directory is excluded from version control. To add new topics:

1. Place the HTML file in `data/topics/`
2. Update `data/directory.json` with the new topic entry
3. Refresh the browser

Changes take effect immediately when using Docker volume mounts.

## Project Structure

```
src/                    # Frontend source
├── types/              # TypeScript type definitions
├── api/                # API client layer
├── hooks/              # Custom React hooks
├── components/         # UI components
│   ├── Layout/         # Application layout
│   ├── Sidebar/        # Category and topic navigation
│   └── Viewer/         # HTML content iframe viewer
└── App.tsx             # Application entry

server/                 # Backend source
├── index.ts            # Express server entry
├── routes/             # Service API route handlers
│   ├── categories.ts
│   ├── topics.ts
│   ├── files.ts
│   └── templates.ts
└── ai/
    └── proxy.ts        # AI prompt proxy
```

## License

MIT
