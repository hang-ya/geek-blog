<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# geek.tzyday.com — 个人博客

## 项目概要

独立于 tzyday.com 的个人极客博客。写技术笔记、工具推荐、阅读思考。
不做 SEO，不追热点。

## 技术栈

- Next.js 16 (App Router, static export)
- Tailwind CSS v4
- Cloudflare Pages 托管
- Markdown 文章（gray-matter + marked）

## 关键路径

- 文章目录：`content/posts/`
- 文章加载：`src/lib/posts.ts`
- Markdown 渲染：`src/lib/markdown.ts`

## 新增文章

在 `content/posts/` 下创建 `.md` 文件：

```md
---
title: "文章标题"
date: "2026-06-28"
description: "文章摘要"
tags: ["技术", "前端"]
---

正文内容（Markdown）...
```

然后 `npm run build` 或推送到 GitHub 触发自动部署。

## 部署

```bash
npm run build        # 构建，输出到 out/
npx wrangler pages deploy out --project-name=geek-blog
```

## 与主站关系

- 主站 (tzyday.com) 导航栏有 Blog 入口 → 跳转到这里
- 博客 Footer 有链接回主站
- 完全独立的代码仓库、构建流程、Cloudflare Pages 项目

## Cloudflare

- 子域名：geek.tzyday.com
- DNS 已配（CNAME → Cloudflare Pages）
