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

Feed prompts to AI to generate HTML topic content and save it into the system:

#### 1. Describe your requirements

Tell the AI what content you want, for example "Generate a React introduction page".

#### 2. Get template guidance

Call the AI endpoint to get the HTML structure prompt for your desired template style:

```bash
curl http://localhost:1234/ai/templates/tech-doc
```

> Returns a Markdown prompt with HTML skeleton, style requirements, content structure, etc. Feed this prompt along with your requirements to the AI.

#### 3. AI generates HTML

The AI produces a complete HTML file (with styles and content) based on the template guidance.

#### 4. Save the HTML file

Save the generated HTML content via the API into `data/topics/`:

```bash
curl -X POST http://localhost:1234/api/files/content \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "react-intro.html",
    "content": "<!DOCTYPE html>..."
  }'
```

#### 5. Register the topic

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
Your requirements → Get template prompt → AI generates HTML → Save file → Register topic → Browser shows it
                           ↑                                              ↑
                   GET /ai/templates/:id                       POST /api/files/content
                                                                      POST /api/topics
```

---

<div align="center">MIT License</div>
