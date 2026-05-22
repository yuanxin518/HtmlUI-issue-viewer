<div align="right">

[🇬🇧 English](README.en.md)

</div>

# HtmlUI Topic Viewer

适合在网页上以目录结构管理和浏览 HTML 话题内容，用于文档展示、知识库、AI 生成内容的可视化预览等场景。

---

### 有什么用

以 HTML 文件为信息载体，通过目录结构管理话题，在网页中直接渲染展示。

---

### 安装

环境要求：Node.js 20+

```bash
git clone https://github.com/yuanxin518/HtmlUI-issue-viewer.git
cd HtmlUI-issue-viewer
npm install
```

#### 启动服务

```bash
# 开发模式（前端 :1233，后端 :1234）
npm run dev        # Vite 前端开发服务器
npm run start      # Express API 服务器

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

---

### 怎么用

#### 提示词示例

把以下提示词直接发给 AI，即可生成一个话题 HTML 页面：

```markdown
请生成一个技术文档风格的话题 HTML 页面，要求如下：

- 深色主题（背景 #0d1117，文字 #e6edf3）
- 标题使用 emoji + 文字，如 "📖 React 入门"
- 每个小节用 <h2> 分隔
- 代码示例使用 <pre><code>，深色背景
- 关键提示用卡片 <div class="card"> 包裹

输出一个完整的 HTML 文件，包含 <!DOCTYPE html> 声明。
```

AI 返回 HTML 内容后，按以下步骤存入系统。

#### 实现步骤

**1. 获取模板指引（可选）**

系统内置模板可提供更详细的 HTML 结构要求：

```bash
curl http://localhost:1234/ai/templates/tech-doc    # 技术文档
curl http://localhost:1234/ai/templates/review-doc   # 代码审查
curl http://localhost:1234/ai/templates/note-doc     # 知识笔记
```

**2. 保存 HTML 文件**

将 AI 返回的 HTML 内容保存到 `data/topics/`：

```bash
curl -X POST http://localhost:1234/api/files/content \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "react-intro.html",
    "content": "<!DOCTYPE html>..."
  }'
```

**3. 注册话题**

将新文件添加为话题，刷新页面即可展示：

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

#### 完整流程

```
提示词 → AI 生成 HTML → 保存文件 → 注册话题 → 浏览器展示
                          ↑              ↑
                  POST /api/files/content  POST /api/topics
```

---

<div align="center">MIT License</div>
