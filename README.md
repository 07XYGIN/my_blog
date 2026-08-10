# Gin Blog

Gin 的个人技术博客，内容由根目录 `docs/*.mdx` 驱动。

## 技术栈

- Next.js App Router、React、TypeScript
- Tailwind CSS、shadcn/ui、Motion
- next-mdx-remote、rehype-highlight
- pnpm

## 本地开发

需要 Node.js 22 与 pnpm 11。

```bash
pnpm install
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 添加文章

在 `docs` 目录新增 `.mdx` 文件，并填写与现有文章一致的 frontmatter。首页分类、文章详情、目录和相邻文章会自动生成。

## 检查

```bash
pnpm lint
pnpm build
```

## 部署

生产地址：[https://xygin.vercel.app](https://xygin.vercel.app)

Pull Request 会执行 Lint 与构建检查；推送到 `main` 后，GitHub Actions 会自动部署到 Vercel。
