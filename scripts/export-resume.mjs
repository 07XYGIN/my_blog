import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { compileMDX } from "next-mdx-remote/rsc";
import { Code2, Globe2, Mail, Phone, UserRound } from "lucide-react";
import remarkGfm from "remark-gfm";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = await readFile(path.join(root, "content/resume.md"), "utf8");
const styles = await readFile(path.join(root, "src/app/about/resume/resume.css"), "utf8");
const { content } = await compileMDX({
  source,
  options: { mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } },
  components: {
    p: ({ children }) => String(children).startsWith("男 / 3年开发经验")
      ? createElement("p", { className: "resume-identity" }, createElement(UserRound, { size: 15, "aria-hidden": true }), children)
      : createElement("p", null, children),
    a: ({ href, children }) => {
      const Icon = href?.startsWith("tel:") ? Phone
        : href?.startsWith("mailto:") ? Mail
          : href?.includes("github.com") ? Code2 : Globe2;
      return createElement("a", { className: "resume-contact-link", href }, createElement(Icon, { size: 14, "aria-hidden": true }), children);
    },
  },
});
const output = path.join(root, "public/resume/qiao-yushuai.pdf");
const browser = await chromium.launch({ channel: process.env.RESUME_BROWSER_CHANNEL || undefined });

try {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html>
    <html lang="zh-CN"><head><meta charset="utf-8">
    <title>乔宇帅 - 简历</title><style>${styles}</style></head>
    <body><article class="resume-document">${renderToStaticMarkup(content)}</article></body></html>`);
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(path.dirname(output), { recursive: true });
  await page.pdf({
    path: output,
    format: "A4",
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="width:100%;text-align:center;font:9px sans-serif;color:#777"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    tagged: true,
    outline: true,
  });
  console.log(`PDF generated: ${output}`);
} finally {
  await browser.close();
}
