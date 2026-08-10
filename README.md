# 开发日志

这是一个按设计稿还原的技术博客界面，使用 Next.js App Router、TypeScript 和 Tailwind CSS 构建。页面文案已替换为中文，保留了代码示例中的技术关键字。

## 页面

- `/`：首页，支持浅色 / 深色主题切换与文章筛选视觉状态
- `/timeline`：交替时间线
- `/about`：个人介绍、技术栈与联系入口
- `/blog/resilient-microservices`：MDX 文章详情、目录、代码复制和上一篇 / 下一篇导航

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- `motion`（动画）
- `lucide-react`（图标）
- `next-mdx-remote`（MDX 渲染）
- `class-variance-authority`、`clsx`、`tailwind-merge`（shadcn 风格组件基础）

## 本地开发

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 校验

```bash
pnpm lint
pnpm build
```

设计参考位于 `C:\Users\pc\Desktop\stitch_minimalist_developer_portfolio_ui`，本项目只实现界面还原，不包含后端数据或发布流程。
