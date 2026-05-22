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

Copy the complete prompt below and send it to an AI. It will generate the HTML page and create the topic via API automatically.

```markdown
## Task

Create a new topic in the HtmlUI Topic Viewer system.

## Topic Details

- Category: React 入门
- Topic ID: react-intro
- Topic Title: React 简介
- File Name: react-intro.html

## HTML Requirements

Generate a technical documentation style page with these requirements:

- Dark theme, background #0d1117, text #e6edf3
- Title with emoji, e.g. "📖 React 简介"
- Each section separated by <h2>
- Code examples in <pre><code> with dark background
- Key tips wrapped in <div class="card">
- Output a complete <!DOCTYPE html> file

## Steps

1. Generate the complete HTML content following the requirements above
2. Call POST /api/files/content to save the file
   Body: { "filename": "react-intro.html", "content": "full HTML content" }
3. Call POST /api/topics to register the topic
   Body: { "categoryName": "React 入门", "id": "react-intro", "title": "React 简介", "file": "react-intro.html" }
4. Tell the user to refresh the browser to view the new topic
```

---

<div align="center">MIT License</div>
