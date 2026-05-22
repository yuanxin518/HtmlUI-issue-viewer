<div align="center">

[🇨🇳 中文](#chinese) · [🇬🇧 English](#english)

</div>

---

## <a name="chinese"></a>🇨🇳 中文

# HtmlUI Topic Viewer

```mermaid
flowchart LR
    A[编辑 directory.json<br>配置分类和话题] --> B[将 HTML 文件<br>放入 topics/ 目录]
    B --> C[刷新浏览器]
    C --> D[左侧导航树<br>选择话题]
    D --> E[右侧 iframe<br>预览 HTML 内容]
    B -.-> F[或通过 API<br>上传/保存]
    F -.-> C
```

### 安装

**环境要求：** Node.js 20+

```bash
# 克隆项目
git clone https://github.com/yuanxin518/HtmlUI-issue-viewer.git
cd HtmlUI-issue-viewer

# 安装依赖
npm install
```

#### 启动服务

```bash
# 开发模式（前端 :1233，后端 :1234）
npm run dev        # 启动 Vite 前端开发服务器
npm run start      # 启动 Express API 服务器

# 生产模式
npm run build      # 构建前端静态资源
npm run start      # 统一在 :1234 端口提供服务
```

#### Docker 部署

```bash
docker build -t topic-viewer .
docker run -d -p 1234:1234 \
  -v $(pwd)/data/directory.json:/app/data/directory.json \
  -v $(pwd)/data/topics:/app/data/topics \
  topic-viewer
```

### 怎么用

#### 添加话题内容

系统通过 `data/` 目录管理所有运行时内容，无需重启服务：

```
data/
├── directory.json     # 编辑此文件管理分类和话题列表
└── topics/            # 存放 HTML 话题文件
    ├── example-1.html
    └── example-2.html
```

```bash
# 1. 放入 HTML 文件
cp output.html data/topics/my-topic.html

# 2. 编辑目录配置
vim data/directory.json

# 3. 浏览器刷新即可看到新话题
```

**directory.json 格式：**
```json
{
  "categories": [
    {
      "name": "分类名称",
      "icon": "FolderOpenOutlined",
      "topics": [
        { "id": "topic-id", "title": "话题标题", "file": "文件名.html" }
      ]
    }
  ]
}
```

#### 调用 API

系统提供两层 API：

| 层 | 路径 | 用途 |
|----|------|------|
| Service API | `/api/*` | 返回 JSON 数据，供前端或脚本调用 |
| AI Proxy | `/ai/*` | 返回 Markdown 提示词，供 AI 模型调用 |

```bash
# 获取话题列表
curl http://localhost:1234/api/categories

# 获取模板详情提示词（AI 可用此生成 HTML）
curl http://localhost:1234/ai/templates/tech-doc

# 查看所有 AI 接口
curl http://localhost:1234/ai
```

#### 模板使用

系统内置三种话题模板，可调用 AI 接口获取 HTML 生成指引：

```bash
curl http://localhost:1234/ai/templates/tech-doc    # 技术文档
curl http://localhost:1234/ai/templates/review-doc   # 代码审查报告
curl http://localhost:1234/ai/templates/note-doc     # 知识笔记
```

### 有什么用

适合在网页上以目录结构管理和浏览 HTML 话题内容，用于文档展示、知识库、AI 生成内容的可视化预览等场景。

- **目录化管理** — 通过 JSON 配置分类和话题层级，侧边栏树形导航，点击即切换，结构清晰。
- **HTML 即内容** — 每个话题对应一个 HTML 文件，页面内 iframe 直接渲染，支持完整 CSS 和 JavaScript，内容样式不受宿主页面干扰。
- **AI 辅助生成** — 内置模板提示词接口，AI 模型可调用 `/ai/templates/:id` 获取 HTML 结构指引，快速生成符合风格的话题页面。
- **热更新** — 数据目录通过 Docker 卷挂载，增删改 HTML 文件或目录配置后刷新浏览器即生效，无需重启。
- **工程化支撑** — React 18 + Ant Design + TypeScript 前端，Express 后端，Docker 一键部署，提供完整的 RESTful API。

---

## <a name="english"></a>🇬🇧 English

# HtmlUI Topic Viewer

```mermaid
flowchart LR
    A[Edit directory.json<br>configure categories & topics] --> B[Place HTML files<br>into topics/ directory]
    B --> C[Refresh browser]
    C --> D[Select topic<br>from sidebar tree]
    D --> E[Preview HTML<br>in iframe pane]
    B -.-> F[Or via API<br>upload / save content]
    F -.-> C
```

### Install

**Prerequisites:** Node.js 20+

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

### Usage

#### Manage Topics

All runtime data lives in `data/` — no restart required:

```
data/
├── directory.json     # Category and topic configuration
└── topics/            # HTML topic files
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

| Layer | Path | Purpose |
|-------|------|---------|
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

Three built-in templates for AI-assisted HTML generation:

```bash
curl http://localhost:1234/ai/templates/tech-doc    # Technical docs
curl http://localhost:1234/ai/templates/review-doc   # Code review
curl http://localhost:1234/ai/templates/note-doc     # Knowledge notes
```

### Features

A web-based system for managing and browsing topic-based HTML content through a directory structure. Suitable for documentation, knowledge bases, and previewing AI-generated content.

- **Directory-driven** — Categories and topics are defined in a JSON config file. Sidebar tree navigation, click to switch.
- **HTML as content** — Each topic is a standalone HTML file rendered in an iframe. Full CSS and JavaScript support, content style is isolated from the host page.
- **AI-assisted generation** — Built-in template prompts at `/ai/templates/:id`. AI models can fetch HTML structure guidance and generate consistent topic pages.
- **Hot reload** — Data directory is volume-mounted in Docker. Add, edit, or delete files and refresh the browser — no restart needed.
- **Engineering** — React 18 + Ant Design + TypeScript frontend, Express backend, one-command Docker deployment, full RESTful API.

---

<div align="center">MIT License</div>
