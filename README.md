<details open>
<summary><b>🇨🇳 中文</b></summary>
<br>

# HtmlUI Topic Viewer

基于 React + Ant Design + Express 的话题式 HTML 内容管理与预览系统。

### 架构

```
浏览器 (SPA) → Express Server ─┬─ /api/*   → JSON 数据接口
                               ├─ /ai/*    → Markdown 提示词
                               └─ /topics/ → 静态 HTML 文件
```

- **SPA** — React 18 + Ant Design。左侧分类/话题树导航，右侧 iframe 预览 HTML 内容。
- **Service API**（`/api/*`）— 分类、话题、文件、模板的 RESTful CRUD 接口。
- **AI Proxy**（`/ai/*`）— 与 Service API 路径对应，返回 Markdown 格式的提示词文本，供 AI 模型使用。
- **数据层** — 运行时数据存放于 `data/` 目录，通过 Docker 卷挂载实现热更新。

### 快速开始

```bash
# 安装依赖
npm install

# 开发模式（前端 :1233，后端 :1234）
npm run dev        # Vite 开发服务器
npm run start      # Express API 服务器

# 生产模式
npm run build
npm run start      # SPA + API 统一在 :1234
```

#### Docker 部署

```bash
docker build -t topic-viewer .
docker run -d -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

数据目录通过卷挂载，修改文件后刷新浏览器即可生效，无需重建镜像。

### API 参考

#### Service 接口

| 方法 | 路径 | 说明 |
|--------|------|------|
| GET | `/api/categories` | 获取所有分类及话题 |
| POST | `/api/categories` | 新建分类 |
| PUT | `/api/categories/:name` | 更新分类 |
| DELETE | `/api/categories/:name` | 删除分类 |
| POST | `/api/topics` | 添加话题 |
| PUT | `/api/topics/:id` | 更新话题 |
| DELETE | `/api/topics/:id` | 删除话题 |
| GET | `/api/files` | 列出 HTML 文件 |
| POST | `/api/files/upload` | 上传 HTML 文件 |
| POST | `/api/files/content` | 直接保存 HTML 内容 |
| DELETE | `/api/files/:filename` | 删除文件 |
| GET | `/api/templates` | 获取模板列表 |
| GET | `/api/templates/:id` | 获取模板详情 |

#### AI Proxy 接口

`/ai/*` 接口返回 Markdown 格式的提示词文本，而非 JSON 数据。

| 方法 | 路径 | 说明 |
|--------|------|------|
| GET | `/ai` | 查看所有可用 AI 接口 |
| GET | `/ai/categories` | 提示词：获取分类列表 |
| POST | `/ai/categories` | 提示词：创建分类 |
| GET | `/ai/topics` | 提示词：获取话题列表 |
| POST | `/ai/topics` | 提示词：添加话题 |
| GET | `/ai/files` | 提示词：文件列表 |
| POST | `/ai/files/content` | 提示词：保存 HTML |
| GET | `/ai/templates` | 提示词：模板列表 |
| GET | `/ai/templates/:id` | 提示词：模板详情 |

### 数据目录

```
data/
├── directory.json     # 分类和话题配置
└── topics/            # HTML 话题文件（不纳入版本控制）
```

添加话题流程：
1. 将 HTML 文件放入 `data/topics/`
2. 编辑 `data/directory.json` 添加条目
3. 刷新浏览器 — 使用 Docker 卷挂载时即时生效

### 项目结构

```
src/                    # 前端源码
├── types/              # TypeScript 类型定义
├── api/                # API 客户端
├── hooks/              # 自定义 Hook
├── components/         # UI 组件
│   ├── Layout/         # 页面布局
│   ├── Sidebar/        # 导航树
│   └── Viewer/         # HTML 预览
└── App.tsx

server/                 # 后端源码
├── index.ts            # Express 入口
├── routes/             # Service API 路由
│   ├── categories.ts
│   ├── topics.ts
│   ├── files.ts
│   └── templates.ts
└── ai/
    └── proxy.ts        # AI 提示词代理
```

</details>

---

<details>
<summary><b>🇬🇧 English</b></summary>
<br>

# HtmlUI Topic Viewer

A topic-based HTML content management and preview system. Built with React, Ant Design, and Express.

### Architecture

```
Browser (SPA) → Express Server ─┬─ /api/*   → JSON CRUD
                                 ├─ /ai/*    → Markdown prompts
                                 └─ /topics/ → Static HTML files
```

- **SPA** — React 18 + Ant Design. Sidebar navigation with category/topic tree, HTML preview via iframe.
- **Service API** (`/api/*`) — RESTful endpoints for categories, topics, files, and templates.
- **AI Proxy** (`/ai/*`) — Mirrors the Service API but returns Markdown prompt text for AI agents.
- **Data Layer** — Runtime data in `data/` directory, mounted as Docker volume for hot-reload.

### Quick Start

```bash
npm install
npm run dev        # Vite dev server on :1233
npm run start      # Express API server on :1234

# Production
npm run build
npm run start      # Serves both SPA and API on :1234
```

#### Docker

```bash
docker build -t topic-viewer .
docker run -d -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

### API Reference

#### Service Endpoints

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

#### AI Proxy Endpoints

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

### Data Directory

```
data/
├── directory.json     # Category and topic configuration
└── topics/            # HTML topic files (not version-controlled)
```

### Project Structure

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

</details>

---

<div align="center">MIT License</div>
