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

## 国内静态托管

项目支持生成纯静态站点，可部署到腾讯云 EdgeOne Pages、CloudBase、COS 或阿里云 OSS：

```bash
pnpm build:static
```

构建产物位于 `out` 目录。GitHub Actions 会在每次检查时生成并保存静态站点 Artifact。

腾讯云 EdgeOne Pages 连接 GitHub 仓库时使用以下配置：

- 框架预设：Next.js（静态导出）
- Node.js：22
- 安装命令：`pnpm install --frozen-lockfile`
- 构建命令：`pnpm build:static`
- 输出目录：`out`
- 生产分支：`main`

如需使用中国大陆加速节点，自定义域名需要先完成 ICP 备案；未备案域名可先使用香港或亚太节点。

## 部署

生产地址：[https://xygin.vercel.app](https://xygin.vercel.app)

Pull Request 会执行 Lint 与构建检查；推送到 `main` 后，GitHub Actions 会自动部署到 Vercel。
