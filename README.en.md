<div align="right">

[🇨🇳 中文](README.md)

</div>

# HtmlUI Topic Viewer

A web-based system for managing and browsing topic-based HTML content through a directory structure. Suitable for documentation, knowledge bases, and previewing AI-generated content.

---

### Features

**Directory-driven** — Categories and topics are defined in a JSON config file. Sidebar tree navigation, click to switch.

**HTML as content** — Each topic is a standalone HTML file rendered in an iframe. Full CSS and JavaScript support, content style is isolated from the host page.

**AI-assisted generation** — Built-in template prompts at `/ai/templates/:id`. AI models can fetch HTML structure guidance and generate consistent topic pages.

**Hot reload** — Data directory is volume-mounted in Docker. Add, edit, or delete files and refresh the browser — no restart needed.

**Engineering** — React 18 + Ant Design + TypeScript frontend, Express backend, one-command Docker deployment, full RESTful API.

---

### Install

Prerequisites: Node.js 20+

```bash
git clone https://github.com/yuanxin518/HtmlUI-issue-viewer.git
cd HtmlUI-issue-viewer
npm install
```

#### Start

```bash
# Development (frontend :1233, backend :1234)
npm run dev       # Vite dev server
npm run start     # Express API server

# Production
npm run build     # Build frontend assets
npm run start     # Unified on :1234
```

#### Docker

```bash
docker build -t topic-viewer .
docker run -d -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

---

### Usage

#### Manage Topics

All runtime data lives in `data/` — no restart required:

```
data/
├── directory.json       # Category and topic config
└── topics/              # HTML topic files
    ├── example.html
    └── ...
```

```bash
# 1. Place an HTML file
cp output.html data/topics/my-topic.html

# 2. Edit the directory config
vim data/directory.json

# 3. Refresh browser
```

**directory.json format:**

```json
{
  "categories": [
    {
      "name": "Category Name",
      "icon": "FolderOpenOutlined",
      "topics": [
        { "id": "topic-id", "title": "Topic Title", "file": "file.html" }
      ]
    }
  ]
}
```

#### API

Two API layers are available:

| Layer | Path | Description |
|-------|------|-------------|
| Service API | `/api/*` | Returns JSON for frontend or scripts |
| AI Proxy | `/ai/*` | Returns Markdown prompts for AI agents |

```bash
# List topics
curl http://localhost:1234/api/categories

# Get template prompt (AI uses this to generate HTML)
curl http://localhost:1234/ai/templates/tech-doc

# List all AI endpoints
curl http://localhost:1234/ai
```

#### Templates

```bash
curl http://localhost:1234/ai/templates/tech-doc    # Technical docs
curl http://localhost:1234/ai/templates/review-doc   # Code review
curl http://localhost:1234/ai/templates/note-doc     # Knowledge notes
```

---

<div align="center">MIT License</div>
