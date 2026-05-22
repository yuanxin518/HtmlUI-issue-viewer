import { Router, Request, Response } from 'express';

export const templatesRouter = Router();

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
    description: '深色主题，适合技术教程、API 文档、工具介绍',
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

1. 标题使用 emoji + 文字
2. 每个小节用 <h2> 分隔
3. 代码示例使用 <pre><code>
4. 关键提示用卡片 <div class="card"> 包裹
5. 颜色风格统一使用深色主题`,
  },
  {
    id: 'review-doc',
    name: '代码审查报告',
    description: '展示代码 diff 和 AI 审查意见，带交互切换',
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
    body { display: flex; background: #0d1117; color: #e6edf3; }
    .sidebar { width: 300px; border-right: 1px solid #30363d; }
    .main { flex: 1; }
    .cl-add { background: #0c2d1d; }
    .cl-del { background: #3d1417; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="prompt-card" onclick="selectChunk(this)">
      <div class="chunk-num">1</div>
      <div>提示词描述</div>
      <div class="stats">+10 -2</div>
    </div>
  </div>
  <div class="main">
    <div class="change-group">
      <div class="group-header">变更标题</div>
      <div class="code-side">
        <div class="code-line cl-add"><span>+</span>新增代码</div>
        <div class="code-line cl-del"><span>−</span>删除代码</div>
      </div>
    </div>
  </div>
</body>
</html>
\`\`\`

### 内容要求

1. 每个提示词卡片包含编号、描述、统计
2. 点击卡片切换变更组
3. 新增行绿色背景，删除行红色背景`,
  },
  {
    id: 'note-doc',
    name: '知识笔记',
    description: '浅色主题，适合笔记、总结、知识管理',
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
    body { font-family: 'Georgia', serif; max-width: 720px; margin: auto; padding: 40px 20px; }
    h1 { font-size: 28px; border-bottom: 2px solid #e2e8f0; }
    blockquote { border-left: 4px solid #4299e1; background: #ebf8ff; }
    .tag { background: #ebf4ff; color: #2b6cb0; padding: 2px 10px; border-radius: 12px; }
  </style>
</head>
<body>
  <h1>📝 标题</h1>
  <p><span class="tag">标签</span></p>
  <blockquote>核心引用</blockquote>
  <h2>一、小标题</h2>
  <ul><li>要点</li></ul>
</body>
</html>
\`\`\`

### 内容要求

1. 浅色主题，衬线字体
2. 引用使用 <blockquote>
3. 标签使用圆角 <span class="tag">
4. 列表清晰分段`,
  },
];

export { templates, Template };

// GET /api/templates — list all templates
templatesRouter.get('/', (req: Request, res: Response) => {
  const list = templates.map(({ id, name, description, category }) => ({
    id, name, description, category,
  }));
  res.json({ templates: list });
});

// GET /api/templates/:id — get template detail
templatesRouter.get('/:id', (req: Request, res: Response) => {
  const tpl = templates.find((t) => t.id === req.params.id);
  if (!tpl) {
    return res.status(404).json({ error: `Template "${req.params.id}" not found` });
  }
  res.json({ template: tpl });
});
