"use client";

import {
  motion,
  type MotionValue,
  useTransform,
} from "framer-motion";
import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./blog.module.css";

type ReferenceItem = {
  id: string;
  number: string;
  html: string;
};

type BlogBodyProps = {
  bodyHtml: string;
  references: ReferenceItem[];
  progress: MotionValue<number>;
  progressRange?: [number, number];
};

type InlineToken = {
  text: string;
  href?: string;
  strong?: boolean;
  code?: boolean;
  em?: boolean;
  sup?: boolean;
};

const classNamesToMap = [
  "section-rule",
  "diagram-wrap",
  "diagram-label",
  "callout",
  "callout-purple",
  "callout-amber",
  "table-wrap",
  "path-grid",
  "path-card",
  "path-num",
];

function mapModuleClasses(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  return value
    .split(/\s+/)
    .map((className) => {
      if (classNamesToMap.includes(className)) {
        return styles[className as keyof typeof styles];
      }

      return className;
    })
    .filter(Boolean)
    .join(" ");
}

function extractInlineTokens(node: ChildNode, marks: Omit<InlineToken, "text"> = {}): InlineToken[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";

    return text
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => ({ text: part, ...marks }));
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();
  const nextMarks: Omit<InlineToken, "text"> = {
    ...marks,
    href: tagName === "a" ? element.getAttribute("href") ?? marks.href : marks.href,
    strong: marks.strong || tagName === "strong" || tagName === "b",
    code: marks.code || tagName === "code",
    em: marks.em || tagName === "em" || tagName === "i",
    sup: marks.sup || tagName === "sup",
  };

  return Array.from(element.childNodes).flatMap((child) =>
    extractInlineTokens(child, nextMarks),
  );
}

function RichTextGradient({
  tokens,
  progress,
  range,
  className,
  as = "p",
}: {
  tokens: InlineToken[];
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  as?: "p" | "li";
}) {
  const Tag = as;
  const tokenSpan = (token: InlineToken, muted?: boolean) => {
    const content = (
      <span
        className={cn(
          "inline-block",
          token.strong && "font-medium text-black",
          token.code &&
            "rounded-[0.32rem] bg-black/[0.045] px-[0.34rem] py-[0.08rem] font-mono text-[0.9em]",
          token.em && "italic",
          token.sup && "align-super text-[0.7em] leading-none",
          muted ? "opacity-20" : "",
        )}
      >
        {token.text}
      </span>
    );

    if (token.href) {
      return (
        <a
          href={token.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-inherit underline decoration-black/18 underline-offset-[0.18em]"
        >
          {content}
        </a>
      );
    }

    return content;
  };

  return (
    <Tag className={className}>
      {tokens.map((token, index) => {
        const tokenSize = (range[1] - range[0]) / Math.max(tokens.length, 1);
        const start = range[0] + index * tokenSize;
        const end = start + tokenSize;

        return (
          <GradientToken
            key={`${token.text}-${index}`}
            token={token}
            progress={progress}
            range={[start, end]}
            renderToken={tokenSpan}
          />
        );
      })}
    </Tag>
  );
}

function GradientToken({
  token,
  progress,
  range,
  renderToken,
}: {
  token: InlineToken;
  progress: MotionValue<number>;
  range: [number, number];
  renderToken: (token: InlineToken, muted?: boolean) => ReactNode;
}) {
  const tokenSpan = range[1] - range[0];
  const revealStart = Math.max(range[0] - tokenSpan * 0.2, 0);
  const revealEnd = Math.min(range[1] + tokenSpan * 1.75, 1);
  const opacity = useTransform(progress, [revealStart, revealEnd], [0, 1]);

  return (
    <span className="relative mr-[0.34em] inline-flex">
      <span className="absolute left-0 top-0">{renderToken(token, true)}</span>
      <motion.span style={{ opacity, transition: "all .45s" }}>
        {renderToken(token)}
      </motion.span>
    </span>
  );
}

function BlogBodyContent({
  bodyHtml,
  references,
  progress,
  progressRange = [0, 1],
}: {
  bodyHtml: string;
  references: ReferenceItem[];
  progress: MotionValue<number>;
  progressRange?: [number, number];
}) {
  const canEnhance = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const frame = window.requestAnimationFrame(() => {
        onStoreChange();
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    },
    () => true,
    () => false,
  );

  const parsed = useMemo(() => {
    if (!canEnhance) {
      return null;
    }

    const parser = new DOMParser();
    const bodyDoc = parser.parseFromString(bodyHtml, "text/html");
    const refsDoc = parser.parseFromString(
      `<ol>${references
        .map((reference) => `<li data-number="${reference.number}">${reference.html}</li>`)
        .join("")}</ol>`,
      "text/html",
    );

    let textBlockIndex = 0;
    const annotateBlocks = (node: ChildNode) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      if (tagName === "p" || tagName === "li") {
        element.setAttribute("data-block-index", String(textBlockIndex));
        textBlockIndex += 1;
      }

      Array.from(element.childNodes).forEach(annotateBlocks);
    };

    const bodyNodes = Array.from(bodyDoc.body.childNodes);
    const referenceNodes = Array.from(refsDoc.querySelectorAll("li"));

    bodyNodes.forEach(annotateBlocks);
    referenceNodes.forEach(annotateBlocks);

    const totalTextBlocks = textBlockIndex;

    return { bodyNodes, referenceNodes, totalTextBlocks };
  }, [bodyHtml, references, canEnhance]);

  if (!canEnhance || !parsed) {
    return (
      <div id="introduction" className={styles.article} suppressHydrationWarning>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        <div className="mt-14 border-t border-black/8 pt-10">
          <h2 className="text-[2rem] font-medium leading-none tracking-[-0.045em] text-black sm:text-[2.35rem]">
            References
          </h2>
          <ol className="mt-8 space-y-4 text-[0.98rem] leading-8 text-black/64">
            {references.map((reference) => (
              <li key={reference.id} className="flex gap-3">
                <span className="shrink-0 text-black/34">{reference.number}</span>
                <span dangerouslySetInnerHTML={{ __html: reference.html }} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  const renderNode = (node: ChildNode, key: string): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? text : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    const className = mapModuleClasses(element.getAttribute("class"));
    const childNodes = Array.from(element.childNodes);

    if (tagName === "p") {
      const blockIndex = Number(element.getAttribute("data-block-index") ?? 0);
      const segment = progressRange[1] - progressRange[0];
      const range: [number, number] = [
        progressRange[0] +
          (blockIndex / Math.max(parsed.totalTextBlocks, 1)) * segment,
        progressRange[0] +
          ((blockIndex + 1) / Math.max(parsed.totalTextBlocks, 1)) * segment,
      ];

      return (
        <RichTextGradient
          key={key}
          as="p"
          tokens={childNodes.flatMap((child) => extractInlineTokens(child))}
          progress={progress}
          range={range}
          className={cn("m-0", className)}
        />
      );
    }

    if (tagName === "h2") {
      return (
        <h2 key={key} id={element.id}>
          {element.textContent}
        </h2>
      );
    }

    if (tagName === "h3") {
      return <h3 key={key}>{element.textContent}</h3>;
    }

    if (tagName === "h4") {
      return <h4 key={key}>{element.textContent}</h4>;
    }

    if (tagName === "hr") {
      return <hr key={key} className={className} />;
    }

    if (tagName === "svg") {
      return (
        <span
          key={key}
          dangerouslySetInnerHTML={{ __html: element.outerHTML }}
        />
      );
    }

    if (tagName === "a") {
      return (
        <a
          key={key}
          href={element.getAttribute("href") ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </a>
      );
    }

    if (tagName === "code") {
      return <code key={key}>{element.textContent}</code>;
    }

    if (tagName === "table") {
      return (
        <table key={key}>
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </table>
      );
    }

    if (tagName === "thead" || tagName === "tbody" || tagName === "tr") {
      const HtmlTag = tagName as "thead" | "tbody" | "tr";
      return (
        <HtmlTag key={key}>
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </HtmlTag>
      );
    }

    if (tagName === "th" || tagName === "td") {
      const HtmlTag = tagName as "th" | "td";
      return (
        <HtmlTag key={key}>
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </HtmlTag>
      );
    }

    if (tagName === "strong" || tagName === "b") {
      return <strong key={key}>{element.textContent}</strong>;
    }

    if (tagName === "em" || tagName === "i") {
      return <em key={key}>{element.textContent}</em>;
    }

    if (tagName === "sup") {
      return <sup key={key}>{element.textContent}</sup>;
    }

    if (tagName === "br") {
      return <br key={key} />;
    }

    if (tagName === "span") {
      return (
        <span key={key} className={className}>
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </span>
      );
    }

    return (
      <div key={key} className={className}>
        {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
      </div>
    );
  };

  return (
    <div id="introduction" className={styles.article}>
      {parsed.bodyNodes.map((node, index) => renderNode(node, `body-${index}`))}

      <div className="mt-14 border-t border-black/8 pt-10">
        <h2 className="text-[2rem] font-medium leading-none tracking-[-0.045em] text-black sm:text-[2.35rem]">
          References
        </h2>
        <ol className="mt-8 space-y-4 text-[0.98rem] leading-8 text-black/64">
          {parsed.referenceNodes.map((referenceNode, index) => {
            const blockIndex = Number(
              referenceNode.getAttribute("data-block-index") ?? 0,
            );
            const segment = progressRange[1] - progressRange[0];
            const range: [number, number] = [
              progressRange[0] +
                (blockIndex / Math.max(parsed.totalTextBlocks, 1)) * segment,
              progressRange[0] +
                ((blockIndex + 1) / Math.max(parsed.totalTextBlocks, 1)) * segment,
            ];

            return (
              <li key={references[index].id} className="flex gap-3">
                <span className="shrink-0 text-black/34">{references[index].number}</span>
                <div className="min-w-0 flex-1">
                  <RichTextGradient
                    as="p"
                    tokens={Array.from(referenceNode.childNodes).flatMap((child) =>
                      extractInlineTokens(child),
                    )}
                    progress={progress}
                    range={range}
                    className="m-0 text-[0.98rem] leading-8 text-black/64"
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function BlogBody({
  bodyHtml,
  references,
  progress,
  progressRange,
}: BlogBodyProps) {
  return (
    <BlogBodyContent
      bodyHtml={bodyHtml}
      references={references}
      progress={progress}
      progressRange={progressRange}
    />
  );
}
