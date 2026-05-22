<div align="right">

[🇬🇧 English](README.en.md)

</div>

# HtmlUI Topic Viewer

适合在网页上以目录结构管理和浏览 HTML 话题内容，用于文档展示、知识库、AI 生成内容的可视化预览等场景。

---

### 有什么用

**目录化管理** — 通过 JSON 配置分类和话题层级，侧边栏树形导航，点击即切换，结构清晰。

**HTML 即内容** — 每个话题对应一个独立 HTML 文件，iframe 直接渲染，完整支持 CSS 和 JavaScript，内容样式不受宿主页面干扰。

**AI 辅助生成** — 内置模板提示词接口，AI 模型可调用 `/ai/templates/:id` 获取 HTML 结构指引，快速生成符合风格的话题页面。

**热更新** — 数据目录通过 Docker 卷挂载，增删改 HTML 文件或目录配置后刷新浏览器即生效，无需重启。

**工程化支撑** — React 18 + Ant Design + TypeScript 前端，Express 后端，Docker 一键部署，提供完整的 RESTful API。

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

#### 添加话题内容

系统通过 `data/` 目录管理所有运行时内容，无需重启服务：

```
data/
├── directory.json       # 分类和话题配置
└── topics/              # HTML 话题文件
    ├── example.html
    └── ...
```

操作步骤：

```bash
# 1. 放入 HTML 文件
cp output.html data/topics/my-topic.html

# 2. 编辑目录配置
vim data/directory.json

# 3. 刷新浏览器即可
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

| 层 | 路径 | 说明 |
|----|------|-------|
| Service API | `/api/*` | 返回 JSON，供前端或脚本调用 |
| AI Proxy | `/ai/*` | 返回 Markdown 提示词，供 AI 模型调用 |

```bash
# 获取话题列表
curl http://localhost:1234/api/categories

# 获取模板提示词（AI 用此生成 HTML）
curl http://localhost:1234/ai/templates/tech-doc

# 查看所有 AI 接口
curl http://localhost:1234/ai
```

#### 模板

```bash
curl http://localhost:1234/ai/templates/tech-doc    # 技术文档
curl http://localhost:1234/ai/templates/review-doc   # 代码审查报告
curl http://localhost:1234/ai/templates/note-doc     # 知识笔记
```

---

<div align="center">MIT License</div>
