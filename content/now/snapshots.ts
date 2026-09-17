import type { NowSnapshot } from "@/lib/now";

export const nowSnapshots: NowSnapshot[] = [
  {
    date: "2026-09-17",
    learning: "继续把 Next.js App Router 的内容建模、静态生成和交互边界理顺，也在补充 Python 服务端与 Agent 工程里的基础设施知识。",
    doing: "把个人博客从文章集合整理成一个可以持续更新的工作台：新增项目档案，补上近况快照，并继续把 Aura 和模板项目里的经验写成可回看的记录。",
    realization: "个人网站最重要的不是一次性把所有内容做满，而是让下一次更新足够轻。只要结构能容纳变化，页面不必每次都重新设计。",
    paused: "暂时放下追逐更多框架和视觉效果，先把已经做过的项目、技术决策和学习路径整理清楚，再决定下一步扩展什么。",
    signal: "把正在发生的事收拢成一条能继续走的路。",
    next: "整理项目档案，随后回到下一篇技术记录。",
    focus: [
      { label: "博客工作台", detail: "内容结构与近况快照", progress: 82, tone: "primary" },
      { label: "Agent 基础设施", detail: "Python / LangGraph 实践", progress: 56, tone: "teal" },
      { label: "项目回看", detail: "把经验写成可复用记录", progress: 38, tone: "amber" },
    ],
  },
  {
    date: "2026-09-01",
    learning: "重新梳理 MDX 的内容边界，尝试把文章、代码片段和项目记录放在同一套可审阅的内容工作流里。",
    doing: "整理博客的搜索、目录、代码高亮和部署流程，同时回看 Aura 的多端结构，记录哪些能力应该共享，哪些边界应该保持独立。",
    realization: "复用的价值不只是少写代码，更是让重复决策变少；但模板越大，越容易把不适合自己的默认选择一起带进来。",
    paused: "先不扩展新的内容类型，也不急着接入数据库，把文件化内容的命名、排序和校验约定稳定下来。",
    signal: "让内容先拥有稳定的落点，再考虑更多入口。",
    next: "收紧内容工作流的边界，减少维护时的犹豫。",
    focus: [
      { label: "内容工作流", detail: "MDX / 搜索 / 目录", progress: 72, tone: "primary" },
      { label: "部署链路", detail: "构建与发布检查", progress: 64, tone: "teal" },
      { label: "边界整理", detail: "共享能力与独立模块", progress: 44, tone: "amber" },
    ],
  },
  {
    date: "2026-08-10",
    learning: "从 React、Next.js 和 TypeScript 的基础能力出发，继续补足 PostgreSQL、Redis、Docker 以及 LangGraph 的实践。",
    doing: "完成个人博客的第一版，把已有技术笔记迁移到 MDX，并建立首页、时间线、关于页和全文搜索。",
    realization: "一个小项目只要能持续承接真实内容，就已经不只是练习题；它会反过来暴露信息架构、部署和维护上的真实问题。",
    paused: "暂时不追求复杂的后台管理能力，先用 Git 和内容文件保持发布链路简单，让写作本身成为主要入口。",
    signal: "先让第一版真正被使用，再从使用里发现下一版。",
    next: "继续写内容，记录那些只有运行之后才会出现的问题。",
    focus: [
      { label: "个人博客", detail: "首页 / 时间线 / 关于", progress: 100, tone: "primary" },
      { label: "技术笔记", detail: "React / Next / TypeScript", progress: 48, tone: "teal" },
      { label: "发布体验", detail: "Git 驱动的简单链路", progress: 34, tone: "amber" },
    ],
  },
];
