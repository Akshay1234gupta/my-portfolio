import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { ComponentProps, ReactElement } from "react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";
import { CodeBlock } from "./CodeBlock";

type CodeElement = ReactElement<{ className?: string; children?: string }>;

const components: MDXRemoteProps["components"] = {
  pre: ({ children }: ComponentProps<"pre">) => {
    const code = children as CodeElement;
    const raw = String(code?.props?.children ?? "").replace(/\n$/, "");
    const lang = /language-([\w-]+)/.exec(code?.props?.className ?? "")?.[1];
    return <CodeBlock raw={raw} lang={lang} html={highlight(raw)} />;
  },
  a: ({ href = "", children, ...rest }: ComponentProps<"a">) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

/** Renders MDX on the server (no MDX runtime shipped to the browser). */
export function BlogArticle({ source }: { source: string }) {
  return (
    <div className="prose-article">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
      />
    </div>
  );
}
