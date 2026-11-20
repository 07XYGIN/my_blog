# MDX 多语言代码组调研

日期：2026-11-20

仓库：`main`，已执行 `git pull --ff-only origin main`；远程没有新提交，当前 HEAD 为 `b4604a1`。

## 结论

建议新增一个轻量的 `<CodeTabs>` MDX 组件，用于把同一功能的不同语言实现放在一组可切换的标签中。它只负责语言选择和包裹现有代码块，代码仍使用 Markdown 围栏，由现有 `rehype-pretty-code`、Shiki 和 `CodeFigure` 处理高亮、文件名、行号、复制和全屏。

不需要引入新的高亮器、MDX 框架或组件依赖。现有 `Tabs` 组合已经能完成基本交互；新组件的价值是自动根据语言条目生成标签，避免作者重复维护 trigger 与 panel 两份列表。

## 建议的 MDX 用法

````mdx
<CodeTabs defaultValue="java">
  <CodeTab value="java" label="Java">

    ```java title="UserService.java" showLineNumbers
    User find(long id) {
        return mapper.findById(id);
    }
    ```

  </CodeTab>
  <CodeTab value="python" label="Python">

    ```python title="users.py" showLineNumbers
    def find_user(user_id: int) -> User | None:
        return db.get(User, user_id)
    ```

  </CodeTab>
  <CodeTab value="typescript" label="TypeScript">

    ```ts title="users.ts" showLineNumbers
    const findUser = (id: number) => db.users.find(id);
    ```

  </CodeTab>
</CodeTabs>
````

API 建议：

- `CodeTabs` 接收可选的 `defaultValue`；缺省时使用第一个 `CodeTab` 的 `value`。
- `CodeTab` 接收稳定且唯一的 `value`、可见的 `label` 和代码围栏作为 children。
- 代码围栏本身声明真实语言、文件名及 `showLineNumbers`，避免再维护一份容易不一致的语言或标题信息。
- 所有条目展示同一功能的实现；差异较大的流程应继续使用普通文章段落或现有 Tabs。

组件由 MDX 的 `<CodeTabs>` 服务端组件读取 `<CodeTab>` 的 `value`、`label` 和 `children`，然后用仓库现有 Radix `Tabs`、`TabsList`、`TabsTrigger`、`TabsContent` 生成界面。高亮后的 `<figure>` 作为内容槽传给现有代码框，不在组件中重新解析代码字符串。

## 当前实现基础

- `src/components/mdx/mdx-blocks.tsx` 已将 `Tabs`、`TabsList`、`TabsTrigger`、`TabsContent` 暴露给 MDX。
- `src/components/ui/tabs.tsx` 基于 `radix-ui` Tabs primitives，已提供当前项目样式。
- `src/lib/mdx-options.ts` 使用 `rehype-pretty-code` 0.14.5 和 Shiki 4.4.2 进行构建时高亮。
- 高亮代码围栏生成带 `data-rehype-pretty-code-figure` 的 `<figure>`，由 `src/components/code-block.tsx` 添加文件标题栏、复制和全屏查看。
- `docs/python/fastapi.mdx` 已用原始 Radix Tabs 展示 OAuth2 和手动 Header 两种代码实现，可作为当前语法示例。

本地验证：用安装版本的 `next-mdx-remote/serialize` 和 `rehype-pretty-code` 编译了嵌套 `<CodeTabs><CodeTab>` 以及 Java、Python 代码围栏。编译结果保留 `data-rehype-pretty-code-figure`、文件名标题、行号元数据和两种语言的语法高亮。

## 实现边界与验证点

- `CodeTabs` 是服务端包装组件；只让现有 Radix Tabs 负责交互，避免增加一个重复实现 tabs 状态的新客户端容器。
- `CodeTab` 作为 MDX 里的条目描述，组件只接受在 `CodeTabs` 内使用的直接子项；对重复 value、空条目或无效 defaultValue 给出明确错误。
- 保留每个围栏生成的独立 `CodeFigure`。当前复制和全屏按钮按单个围栏工作，用户切换语言后仍能复制或展开当前实现。
- 使用 Radix 的标签语义和键盘操作；验证 Tab/方向键导航、初始默认语言、空值处理和窄屏布局。
- 验证 Tab 切换时 inactive 面板的代码块对话框不会重复挂载或留下隐藏焦点目标。
- 不通过字符串形式传入 source 后再做运行时高亮；那会绕开现有 MDX 围栏语法及标题、行号、注释元数据。

## 参考资料

1. [MDX：Components](https://mdxjs.com/docs/using-mdx/#components)：MDX 可通过 `components` 映射自定义 JSX 组件，也支持 JSX 组件嵌套。
2. [Radix UI：Tabs](https://www.radix-ui.com/primitives/docs/components/tabs)：支持受控或非受控值、水平/垂直方向和键盘导航；本项目已使用其 primitives。
3. [Next.js：Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)：服务端内容可通过 `children` 槽组合进交互式客户端组件，客户端边界只用于需要交互的部分。
4. [rehype-pretty-code](https://rehype-pretty.pages.dev/)：使用 Shiki 在构建时高亮 Markdown/MDX 代码围栏，支持 `title`、行号、行和字符标记，并由用户自定义其样式。
5. [Fumadocs：Tabs](https://fumadocs.dev/docs/ui/components/tabs)：展示 MDX 中使用 tabs 的常见组合写法；其持久化和锚点功能可以作为未来扩展参考。
6. [Fumadocs：Code Block](https://fumadocs.dev/docs/ui/components/codeblock)：将高亮后的 `pre` 包装为代码块展示组件。当前博客已有对应的 `CodeFigure`，无需迁移到 Fumadocs。
7. [Shiki Transformers](https://shiki.style/packages/transformers)：可扩展行差异和行高亮，但 transformer 不提供语言切换界面；本需求只需 Radix Tabs。
