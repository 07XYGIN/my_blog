import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkMermaid } from "@/lib/remark-mermaid";

type MdxOptions = NonNullable<NonNullable<MDXRemoteProps["options"]>["mdxOptions"]>;

const prettyCodeOptions: RehypePrettyCodeOptions = {
  defaultLang: { block: "plaintext" },
  grid: true,
  keepBackground: false,
  theme: "github-dark",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

export const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath, remarkMermaid],
  rehypePlugins: [rehypeKatex, [rehypePrettyCode, prettyCodeOptions]],
} as MdxOptions;
