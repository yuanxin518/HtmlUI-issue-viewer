<div align="right">

[🇨🇳 中文](README.md)

</div>

# HtmlUI Topic Viewer

A web-based system for managing and browsing topic-based HTML content through a directory structure. Suitable for documentation, knowledge bases, and previewing AI-generated content.

---

### Features

Manage topics by organizing HTML files in a directory structure and render them directly in the browser.

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

#### Prompt Example

Copy the following prompt and send it directly to an AI to generate a topic HTML page:

```markdown
Generate a technical documentation style HTML page with these requirements:

- Dark theme (background #0d1117, text #e6edf3)
- Title with emoji + text, e.g. "📖 React Introduction"
- Each section separated by <h2>
- Code examples in <pre><code> with dark background
- Key tips wrapped in <div class="card">

Output a complete HTML file with <!DOCTYPE html> declaration.
```

Once the AI returns the HTML, follow the steps below to save it into the system.

#### Implementation Steps

**1. Get template guidance (optional)**

Built-in templates provide detailed HTML structure requirements:

```bash
curl http://localhost:1234/ai/templates/tech-doc    # Technical docs
curl http://localhost:1234/ai/templates/review-doc   # Code review
curl http://localhost:1234/ai/templates/note-doc     # Knowledge notes
```

**2. Save the HTML file**

Save the AI-generated HTML content into `data/topics/`:

```bash
curl -X POST http://localhost:1234/api/files/content \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "react-intro.html",
    "content": "<!DOCTYPE html>..."
  }'
```

**3. Register the topic**

Add the new file as a topic entry, then refresh the browser to view it:

```bash
curl -X POST http://localhost:1234/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "categoryName": "React 入门",
    "id": "react-intro",
    "title": "React 简介",
    "file": "react-intro.html"
  }'
```

#### Flow

```
Prompt → AI generates HTML → Save file → Register topic → Browser shows it
                                ↑              ↑
                        POST /api/files/content  POST /api/topics
```

---

<div align="center">MIT License</div>
