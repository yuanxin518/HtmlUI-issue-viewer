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

给 AI 喂提示词，让它生成 HTML 话题内容并存入系统：

#### 1. 说明你的要求

向 AI 描述你想要的话题内容，例如「生成一篇 React 入门的介绍文档」。

#### 2. 获取模板指引

调用 AI 接口获取对应模板的 HTML 结构提示词，指导 AI 生成符合风格的页面：

```bash
curl http://localhost:1234/ai/templates/tech-doc
```

> 返回 Markdown 格式的提示词：包含 HTML 骨架、样式要求、内容结构等。将此提示词连同你的需求一起发给 AI。

#### 3. AI 生成 HTML 内容

AI 根据模板指引生成完整的 HTML 文件内容（包含样式和正文）。

#### 4. 保存 HTML 文件

将生成的 HTML 内容通过接口保存到 `data/topics/` 目录：

```bash
curl -X POST http://localhost:1234/api/files/content \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "react-intro.html",
    "content": "<!DOCTYPE html>..."
  }'
```

#### 5. 添加话题

将新文件注册为话题，刷新页面即可展示：

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
用户需求 → 获取模板提示词 → AI 生成 HTML → 保存文件 → 注册话题 → 浏览器展示
                      ↑                          ↑
              GET /ai/templates/:id     POST /api/files/content
                                               POST /api/topics
```

---

<div align="center">MIT License</div>
