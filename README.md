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

把以下完整提示词发给 AI，它会自动生成 HTML 页面并通过接口创建话题：

```markdown
## 任务

在 HtmlUI Topic Viewer 系统中创建一个新话题。

## 话题信息

- 分类：React 入门
- 话题 ID：react-intro
- 话题标题：React 简介
- 存放文件：react-intro.html

## HTML 内容要求

请生成一个技术文档风格的话题页面，要求如下：

- 深色主题，背景 #0d1117，文字颜色 #e6edf3
- 标题带 emoji，如 "📖 React 简介"
- 每个小节使用 <h2> 分隔
- 代码示例用 <pre><code>，深色背景
- 关键提示用 <div class="card"> 样式卡片包裹
- 输出完整的 <!DOCTYPE html> 文件

## 执行步骤

1. 先生成符合上述要求的完整 HTML 内容
2. 调用 POST /api/files/content 接口保存文件
   请求体：{ "filename": "react-intro.html", "content": "完整的 HTML 内容" }
3. 调用 POST /api/topics 接口注册话题
   请求体：{ "categoryName": "React 入门", "id": "react-intro", "title": "React 简介", "file": "react-intro.html" }
4. 告知用户刷新浏览器即可查看新话题
```

---

<div align="center">MIT License</div>
