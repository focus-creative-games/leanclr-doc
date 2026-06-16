# LeanCLR 文档站

[LeanCLR](https://github.com/focus-creative-games/leanclr) 官方文档，基于 [Docusaurus](https://docusaurus.io/) 构建。

- 在线文档：https://doc.leanclr.com
- 源码仓库：https://github.com/focus-creative-games/leanclr-doc

## 本地开发

```bash
npm install
npm start
```

浏览器访问 http://localhost:3000 预览。

## 构建

```bash
npm run build
npm run serve
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动部署到 GitHub Pages。

域名 `doc.leanclr.com` 通过 `static/CNAME` 配置。

## 文档结构

详见 `sidebars.ts` 与 `docs/` 目录。
