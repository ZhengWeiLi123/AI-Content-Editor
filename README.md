# AI-Content-Editor

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
# AI 内容编辑部

Vue 3 + Coze Workflow + Express + MySQL 的轻量 AI 内容生产闭环。

## 本地数据库初始化

1. 打开 SQLyog 并连接本机 MySQL。
2. 打开 `database/schema.sql`，执行全部 SQL。
3. 将 `.env.example` 复制为 `.env.local`。
4. 在 `.env.local` 填写自己的 MySQL 密码和 Coze Token。不要提交该文件。

默认配置：

- MySQL：`127.0.0.1:3306`
- 数据库：`ai_content_editor`
- 后端 API：`http://localhost:3000/api`
- Vue：Vite 启动时显示的本地地址

## 启动项目

确认 MySQL 服务已经启动后，可以用一个命令同时启动前后端：

```bash
npm run dev:all
```

也可以打开两个终端分别启动：

打开两个终端：

```bash
npm run dev:server
```

```bash
npm run dev
```

浏览器访问 `http://localhost:3000/api/health`，返回 `{"ok":true,"database":"connected"}` 表示数据库连接成功。

## 当前持久化范围

- 创作页“保存草稿”：保存至 `articles`
- AI 审核完成：保存至 `review_results`
- 数据分析完成：保存 Workflow 原始结果至 `analysis_records`
- `topics` 表和接口已经预留，便于后续接入选题收藏

数据库不可用时不阻断现有 Coze 功能，便于产品演示。
