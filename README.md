# Gin Blog

Gin 的个人技术博客，内容由 `docs/` 目录下的 MDX 文件驱动，支持继续按主题细分子目录。

## 技术栈

- Next.js App Router、React、TypeScript
- Tailwind CSS、shadcn/ui、Motion
- next-mdx-remote、remark-gfm、rehype-highlight
- pnpm

## 本地开发

需要 Node.js 22 与 pnpm 11。

```bash
pnpm install
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

## 添加文章

在 `docs` 或其任意子目录新增 `.mdx` 文件，并填写与现有文章一致的 frontmatter。文件名会生成文章 slug，首页分类、文章详情、目录和相邻文章会自动生成。

当前内容按 `frontend`、`python`、`java`、`agent`、`database` 和 `other` 目录整理，共迁移 13 篇来自 Interview 笔记的文章。代码围栏支持语法高亮，表格等 GFM 语法也会正常渲染。

MDX 支持 GFM 表格和 KaTeX 数学公式。行内公式使用 `$E = mc^2$`，块级公式使用：

```mdx
$$
E = mc^2
$$
```

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

腾讯云 CloudBase 静态托管已连接 GitHub 仓库 `07XYGIN/my_blog` 的 `main` 分支，推送主分支会自动构建并更新站点：

- 国内访问：[https://gin-blog-gin-d0ghqbprg7d3819db.webapps.tcloudbase.com](https://gin-blog-gin-d0ghqbprg7d3819db.webapps.tcloudbase.com)
- CloudBase 环境：`gin`（`gin-d0ghqbprg7d3819db`）
- 应用：`gin-blog`

CloudBase 连接 GitHub 时使用以下配置：

- 框架预设：Next.js（静态导出）
- Node.js：24
- 安装命令：`npx pnpm@11.16.0 install --frozen-lockfile`
- 构建命令：`npx pnpm@11.16.0 build:static`
- 输出目录：`out`
- 生产分支：`main`

如需使用中国大陆加速节点，自定义域名需要先完成 ICP 备案；未备案域名可先使用香港或亚太节点。

## 部署

海外生产地址：[https://xygin.vercel.app](https://xygin.vercel.app)

CloudBase 默认域名适合开发测试，存在访问频率限制和稳定性风险。正式使用建议绑定自有域名；中国大陆节点通常还需要完成 ICP 备案。

Pull Request 会执行 Lint 与构建检查；推送到 `main` 后，GitHub Actions 会自动部署到 Vercel。
