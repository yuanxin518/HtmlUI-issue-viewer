import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const aiRouter = Router();

// ── AI prompt configuration ──
// Each prompt template is a function that returns a markdown prompt
// based on the request parameters.

const prompts: Record<string, (req: Request) => string> = {
  // GET /ai/categories — 列出所有分类
  'GET /categories': () => `## 获取分类列表

**接口**: \`GET /api/categories\`

**用途**: 返回所有分类及其话题的完整列表。

### 返回结构

\`\`\`json
{
  "categories": [
    {
      "name": "分类名称",
      "icon": "图标组件名",
      "topics": [
        { "id": "话题ID", "title": "话题标题", "file": "对应的HTML文件名" }
      ]
    }
  ]
}
\`\`\`

### 使用场景

- 获取整个目录结构，用于展示侧边栏
- 遍历话题列表供用户选择
`,

  // POST /ai/categories — 创建分类
  'POST /categories': () => `## 创建分类

**接口**: \`POST /api/categories\`

**请求体**:
\`\`\`json
{
  "name": "分类名称（必填）",
  "icon": "图标组件名（可选，默认 FolderOpenOutlined）"
}
\`\`\`

**可用图标**: BookOutlined, CodeOutlined, RobotOutlined, FileTextOutlined, BulbOutlined, ToolOutlined, SettingOutlined, AppstoreOutlined
`,

  // GET /ai/topics — 获取话题（同 /ai/categories）
  'GET /topics': () => `## 获取话题列表

此接口与 \`/api/categories\` 相同，返回所有分类和话题。

请调用 \`GET /api/categories\` 获取数据。
`,

  // POST /ai/topics — 添加话题
  'POST /topics': (req) => `## 添加话题

**接口**: \`POST /api/topics\`

**请求体**:
\`\`\`json
{
  "categoryName": "目标分类名称（必填）",
  "id": "话题唯一ID（必填）",
  "title": "话题显示标题（必填）",
  "file": "HTML文件名，默认 {id}.html（可选）"
}
\`\`\`

**注意事项**:
- ID 在同一分类内必须唯一
- 对应的 HTML 文件需要单独上传到 \`/api/files/content\` 或 \`/api/files/upload\`
`,

  // DELETE /ai/topics/:id — 删除话题
  'DELETE /topics/:id': (req) => `## 删除话题

**接口**: \`DELETE /api/topics/${req.params.id}\`

**用途**: 删除 ID 为 \`${req.params.id}\` 的话题。

注意：此操作仅从目录中移除话题条目，不会删除对应的 HTML 文件。
如需删除文件，请调用 \`DELETE /api/files/{文件名}\`。
`,

  // GET /ai/files — 文件列表
  'GET /files': () => `## 获取 HTML 文件列表

**接口**: \`GET /api/files\`

**用途**: 列出 \`data/topics/\` 目录下所有可用的 HTML 文件。

### 返回结构

\`\`\`json
{
  "files": [
    { "name": "文件名.html", "size": 1234, "mtime": "2025-01-01T00:00:00.000Z" }
  ]
}
\`\`\`
`,

  // POST /ai/files/content — 保存 HTML 内容
  'POST /files/content': () => `## 保存 HTML 文件内容

**接口**: \`POST /api/files/content\`

**用途**: 直接将 HTML 文本保存为话题文件，无需上传。

**请求体**:
\`\`\`json
{
  "filename": "文件名.html（必填）",
  "content": "<!DOCTYPE html>... 完整的 HTML 内容（必填）"
}
\`\`\`

### AI 生成流程

1. AI 根据用户需求生成完整的 HTML 内容
2. 调用此接口保存为文件
3. 调用 \`POST /api/topics\` 添加到目录
4. 刷新页面即可展示
`,
};

// ── 模板相关 AI 提示 ──
const templatePrompts: Record<string, (req: Request) => string> = {
  'GET /templates': () => `## 获取模板列表

**接口**: \`GET /api/templates\`

**用途**: 返回所有可用的话题 HTML 模板列表。

### 返回结构

\`\`\`json
{
  "templates": [
    {
      "id": "模板ID",
      "name": "模板名称",
      "description": "模板描述",
      "category": "适用分类"
    }
  ]
}
\`\`\`

### 使用说明

选择一个模板后，调用 \`GET /api/templates/{id}\` 获取模板详情，
其中包含完整的 HTML 结构提示词，AI 可据此生成对应风格的话题页面。
`,

  'GET /templates/:id': (req) => {
    const template = getTemplateById(req.params.id);
    if (!template) {
      return `## 模板未找到

ID 为 \`${req.params.id}\` 的模板不存在。

请调用 \`GET /api/templates\` 查看可用模板列表。
`;
    }
    return template.prompt;
  },
};

// ── Template data ──
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: 'tech-doc',
    name: '技术文档',
    description: '适合技术教程、API 文档、工具介绍',
    category: '通用',
    prompt: `## 技术文档模板

请生成一个技术文档风格的话题 HTML 页面，包含以下结构：

### HTML 结构要求

\`\`\`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>话题标题</title>
  <style>
    /* 深色主题技术文档风格 */
    body { font-family: -apple-system, ...; background: #0d1117; color: #e6edf3; }
    h1 { border-bottom: 2px solid #58a6ff; }
    pre { background: #161b22; border: 1px solid #30363d; }
    code { background: #1f6feb33; color: #58a6ff; }
    .card { border-left: 4px solid #58a6ff; background: #161b22; padding: 16px; }
  </style>
</head>
<body>
  <h1>📖 标题</h1>
  <p>简介段落</p>
  <h2>章节一</h2>
  <p>内容...</p>
  <pre><code>代码示例</code></pre>
  <div class="card">💡 提示卡片</div>
</body>
</html>
\`\`\`

### 内容要求

1. 标题使用 emoji + 文字（如 📖 React 入门）
2. 每个小节用 \`<h2>\` 分隔
3. 代码示例使用 \`<pre><code>\`
4. 关键提示用卡片 \`<div class="card">\` 包裹
5. 颜色风格统一使用深色主题
`,
  },
  {
    id: 'review-doc',
    name: '代码审查报告',
    description: '适合展示代码 diff 和审查意见',
    category: '开发',
    prompt: `## 代码审查报告模板

请生成一个代码审查报告风格的话题 HTML 页面。

### 结构

\`\`\`
<!DOCTYPE html>
<html>
<head>
  <title>代码审查</title>
  <style>
    /* 左右分栏: 左侧代码 diff，右侧分析 */
    body { display: flex; background: #0d1117; color: #e6edf3; }
    .sidebar { width: 300px; border-right: 1px solid #30363d; }
    .main { flex: 1; }
    .cl-add { background: #0c2d1d; }  /* 新增行绿色 */
    .cl-del { background: #3d1417; }  /* 删除行红色 */
  </style>
</head>
<body>
  <!-- 左侧: 提示词列表（可点击切换） -->
  <div class="sidebar">
    <div class="prompt-card" onclick="selectChunk(this)">
      <div class="chunk-num">1</div>
      <div>提示词描述</div>
      <div class="stats">+10 -2</div>
    </div>
  </div>
  <!-- 右侧: 变更内容 -->
  <div class="main">
    <div class="change-group">
      <div class="group-header">变更标题</div>
      <div class="code-side">
        <div class="code-line cl-add"><span>+</span>新增代码</div>
        <div class="code-line cl-del"><span>−</span>删除代码</div>
      </div>
      <div class="analysis-side">
        <div class="analysis">🧠 分析内容</div>
      </div>
    </div>
  </div>
  <script>
    function selectChunk(el) { /* 切换高亮逻辑 */ }
  </script>
</body>
</html>
\`\`\`

### 内容要求

1. 每个提示词卡片包含编号、描述、统计（+/-行数）
2. 点击卡片切换对应的变更组
3. 每个变更组包含代码 diff 和 AI 分析
4. 新增行标记绿色背景，删除行红色背景
5. diff 使用左右分栏（代码 | 分析）
`,
  },
  {
    id: 'note-doc',
    name: '知识笔记',
    description: '适合笔记、总结、知识管理',
    category: '通用',
    prompt: `## 知识笔记模板

请生成一个知识笔记风格的话题 HTML 页面。

### 结构

\`\`\`
<!DOCTYPE html>
<html>
<head>
  <title>笔记标题</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 720px; margin: auto; padding: 40px 20px; color: #333; }
    h1 { font-size: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h2 { font-size: 20px; margin-top: 32px; color: #1a202c; }
    blockquote { border-left: 4px solid #4299e1; margin: 16px 0; padding: 8px 16px; background: #ebf8ff; }
    .tag { display: inline-block; background: #ebf4ff; color: #2b6cb0; padding: 2px 10px; border-radius: 12px; font-size: 12px; }
    ul { padding-left: 20px; }
    li { margin: 6px 0; }
  </style>
</head>
<body>
  <h1>📝 笔记标题</h1>
  <p><span class="tag">标签1</span> <span class="tag">标签2</span></p>
  <blockquote>核心观点引用</blockquote>
  <h2>一、小标题</h2>
  <ul><li>要点...</li></ul>
</body>
</html>
\`\`\`

### 内容要求

1. 使用浅色主题，衬线字体
2. 关键引用使用 \`<blockquote>\`
3. 标签使用圆角 \`<span class="tag">\`
4. 列表清晰，适当分段
`,
  },
];

function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

// ── AI proxy: matches /ai/* and returns prompts ──
// Dynamically handle /ai/{path}
// GET /ai — list available AI endpoints
aiRouter.get('/', (req: Request, res: Response) => {
  res.type('text/markdown; charset=utf-8');
  res.send(`## AI 接口列表

以下 AI 接口返回 Markdown 格式的提示词文本，可直接供 AI 模型使用。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /ai/categories | 获取分类列表的提示词 |
| POST | /ai/categories | 创建分类的提示词 |
| GET | /ai/topics | 获取话题列表的提示词 |
| POST | /ai/topics | 添加话题的提示词 |
| DELETE | /ai/topics/:id | 删除话题的提示词 |
| GET | /ai/files | 获取文件列表的提示词 |
| POST | /ai/files/content | 保存 HTML 内容的提示词 |
| GET | /ai/templates | 获取模板列表的提示词 |
| GET | /ai/templates/:id | 获取模板详情的提示词 |
`);
});

aiRouter.all('/{*path}', (req: Request, res: Response) => {
  const method = req.method.toUpperCase();
  const raw = req.params.path;
  // Express 5: {*path} may be string ("seg1/seg2") or array (["seg1","seg2"])
  const rawPath = Array.isArray(raw) ? raw.join('/') : String(raw);
  const pathPattern = rawPath;
  const segments = pathPattern.split('/');
  const resource = segments[0]; // e.g. "categories", "topics", "templates"

  // Try exact match first
  const allPrompts = { ...prompts, ...templatePrompts };
  const exactKey = `${method} /${pathPattern}`;
  let generator = allPrompts[exactKey];

  // Fallback: try pattern match for routes with params (e.g. /templates/:id)
  if (!generator) {
    for (const [key, fn] of Object.entries(allPrompts)) {
      const pattern = key.split(' ').slice(1).join('/').replace(/^\//, '');
      const patternParts = pattern.split('/');
      const actualParts = pathPattern.split('/');

      if (patternParts.length === actualParts.length) {
        const params: Record<string, string> = {};
        let match = true;
        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            const paramName = patternParts[i].slice(1);
            params[paramName] = actualParts[i];
            continue;
          }
          if (patternParts[i] !== actualParts[i]) { match = false; break; }
        }
        if (match) {
          // Override req.params with extracted params
          Object.assign(req.params, params);
          generator = fn;
          break;
        }
      }
    }
  }

  if (generator) {
    const promptText = generator(req);
    res.type('text/markdown; charset=utf-8');
    return res.send(promptText);
  }

  // Generic fallback for unmatched AI paths
  res.type('text/markdown; charset=utf-8');
  res.send(`## AI 接口未知

路径 \`${method} /${pathPattern}\` 没有对应的 AI 提示词。可用的 AI 接口请调用 \`GET /ai\` 查看。

### 可用 AI 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /ai/categories | 获取分类列表的提示词 |
| POST | /ai/categories | 创建分类的提示词 |
| GET | /ai/topics | 获取话题列表的提示词 |
| POST | /ai/topics | 添加话题的提示词 |
| DELETE | /ai/topics/:id | 删除话题的提示词 |
| GET | /ai/files | 获取文件列表的提示词 |
| POST | /ai/files/content | 保存 HTML 内容的提示词 |
| GET | /ai/templates | 获取模板列表的提示词 |
| GET | /ai/templates/:id | 获取模板详情的提示词 |
`);
});
