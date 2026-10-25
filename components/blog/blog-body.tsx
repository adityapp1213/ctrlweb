"use client";

import {
  motion,
  useInView,
} from "framer-motion";
import Image from "next/image";
import {
  useMemo,
  useRef,
  useSyncExternalStore,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
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
};

type InlineToken = {
  text: string;
  href?: string;
  strong?: boolean;
  code?: boolean;
  em?: boolean;
  sup?: boolean;
};

const diagramColors = ["#2f2f2f", "#4b4b4b", "#666666", "#858585", "#a3a3a3"];

function wrapDiagramText(value: string, limit = 34) {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > limit && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });

  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function ResearchFlowDiagram({ label, title, flow }: { label: string; title: string; flow: string }) {
  const stages = flow
    .replace(/\r/g, "")
    .split(/\n|→/)
    .map((stage) => stage.trim())
    .filter(Boolean);
  const vertical = stages.length > 4;
  const height = vertical ? 92 + stages.length * 92 : 224;
  const horizontalWidth = (680 - Math.max(stages.length - 1, 0) * 26) / Math.max(stages.length, 1);

  return (
    <div className={styles["research-diagram"]}>
      <div className={styles["research-diagram-heading"]}>
        <span>{label}</span>
        <h3>{title}</h3>
      </div>
      <svg
        viewBox={`0 0 760 ${height}`}
        role="img"
        aria-label={`${title}: ${stages.join(" then ")}`}
      >
        {stages.map((stage, index) => {
          const color = diagramColors[index % diagramColors.length];
          const lines = wrapDiagramText(stage, vertical ? 46 : 24);
          const x = vertical ? 130 : 40 + index * (horizontalWidth + 26);
          const y = vertical ? 38 + index * 92 : 78;
          const width = vertical ? 500 : horizontalWidth;
          const boxHeight = vertical ? 64 : 96;

          return (
            <g key={`${stage}-${index}`}>
              {index > 0 && vertical ? (
                <>
                  <line x1="380" y1={y - 28} x2="380" y2={y - 10} className={styles["diagram-connector"]} />
                  <path d={`M374 ${y - 15} L380 ${y - 9} L386 ${y - 15}`} className={styles["diagram-arrow"]} />
                </>
              ) : null}
              {index > 0 && !vertical ? (
                <>
                  <line x1={x - 26} y1="126" x2={x - 8} y2="126" className={styles["diagram-connector"]} />
                  <path d={`M${x - 13} 120 L${x - 7} 126 L${x - 13} 132`} className={styles["diagram-arrow"]} />
                </>
              ) : null}
              <rect
                x={x}
                y={y}
                width={width}
                height={boxHeight}
                rx="14"
                fill={`${color}12`}
                stroke={`${color}88`}
              />
              <text
                x={x + width / 2}
                y={y + boxHeight / 2 - (lines.length - 1) * 9}
                textAnchor="middle"
                fill="#171717"
                className={styles["diagram-stage-text"]}
              >
                {lines.map((line, lineIndex) => (
                  <tspan key={line} x={x + width / 2} dy={lineIndex === 0 ? 0 : 18}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

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
  "block",
  "block-blue",
  "block-teal",
  "block-purple",
  "block-amber",
  "block-rose",
  "section-index",
  "flow-line",
  "image-figure",
  "image-caption",
  "image-pair",
  "article-image",
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
    const text = (node.textContent ?? "").replace(/\s+/g, " ");
    const parts = text.match(/\s+|\S+/g) ?? [];
    const tokens: InlineToken[] = [];
    let pendingWhitespace = "";

    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        pendingWhitespace += part;
        return;
      }

      tokens.push({
        text: `${pendingWhitespace}${part}`,
        ...marks,
      });
      pendingWhitespace = "";
    });

    if (pendingWhitespace) {
      if (tokens.length > 0) {
        tokens[tokens.length - 1].text += pendingWhitespace;
      } else {
        tokens.push({ text: pendingWhitespace, ...marks });
      }
    }

    return tokens;
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
  className,
  id,
  as = "p",
}: {
  tokens: InlineToken[];
  className?: string;
  id?: string;
  as?: "p" | "li" | "h2" | "h3" | "h4";
}) {
  const targetRef = useRef<HTMLElement>(null);
  const isInView = useInView(targetRef, {
    amount: 0.25,
    margin: "0px 0px -10% 0px",
  });
  const Tag = as as ElementType;
  const tokenSpan = (token: InlineToken) => {
    const content = (
      <span
        className={cn(
          "inline-block",
          "whitespace-pre",
          token.strong && "font-medium text-black",
          token.code &&
            "rounded-[0.32rem] bg-black/[0.045] px-[0.34rem] py-[0.08rem] font-mono text-[0.9em]",
          token.em && "italic",
          token.sup && "align-super text-[0.7em] leading-none",
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
    <Tag ref={targetRef as Ref<HTMLElement>} id={id} className={className}>
      {tokens.map((token, index) => {
        return <motion.span
            key={`${token.text}-${index}`}
            initial={false}
            animate={{ opacity: isInView ? 1 : 0.2 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: isInView ? Math.min(index * 0.012, 0.24) : 0,
            }}
            className="inline-block"
          >
            {tokenSpan(token)}
          </motion.span>;
      })}
    </Tag>
  );
}

function BlogBodyContent({
  bodyHtml,
  references,
}: {
  bodyHtml: string;
  references: ReferenceItem[];
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

    const bodyNodes = Array.from(bodyDoc.body.childNodes);
    const referenceNodes = Array.from(refsDoc.querySelectorAll("li"));

    return { bodyNodes, referenceNodes };
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

    if (element.classList.contains("block")) {
      const flowElement = element.querySelector(":scope > .flow-line");

      if (flowElement) {
        const label = element.querySelector(":scope > .section-index")?.textContent?.trim() ?? "";
        const title = element.querySelector(":scope > h3")?.textContent?.trim() ?? "Process";
        const paragraphs = Array.from(element.children).filter(
          (child) => child.tagName.toLowerCase() === "p",
        );

        return (
          <section key={key} className={styles["diagram-section"]}>
            <ResearchFlowDiagram label={label} title={title} flow={flowElement.textContent ?? ""} />
            <div className={styles["diagram-explanation"]}>
              {paragraphs.map((paragraph, index) =>
                renderNode(paragraph, `${key}-explanation-${index}`),
              )}
            </div>
          </section>
        );
      }
    }

    if (tagName === "p") {
      return (
        <RichTextGradient
          key={key}
          as="p"
          tokens={childNodes.flatMap((child) => extractInlineTokens(child))}
          className={cn("m-0", className)}
        />
      );
    }

    if (tagName === "ul" || tagName === "ol") {
      const ListTag = tagName as "ul" | "ol";

      return (
        <ListTag key={key} className={className}>
          {childNodes.map((child, index) => renderNode(child, `${key}-${index}`))}
        </ListTag>
      );
    }

    if (tagName === "li") {
      return (
        <RichTextGradient
          key={key}
          as="li"
          tokens={childNodes.flatMap((child) => extractInlineTokens(child))}
          className={className}
        />
      );
    }

    if (tagName === "h2" || tagName === "h3" || tagName === "h4") {
      return (
        <RichTextGradient
          key={key}
          as={tagName}
          id={element.id || undefined}
          tokens={childNodes.flatMap((child) => extractInlineTokens(child))}
          className={className}
        />
      );
    }

    if (tagName === "hr") {
      return <hr key={key} className={className} />;
    }

    if (tagName === "pre") {
      return (
        <pre key={key} className={className}>
          {element.textContent}
        </pre>
      );
    }

    if (tagName === "img") {
      return (
        <Image
          key={key}
          src={element.getAttribute("src") ?? ""}
          alt={element.getAttribute("alt") ?? ""}
          width={Number(element.getAttribute("width") ?? 1600)}
          height={Number(element.getAttribute("height") ?? 900)}
          className={className}
        />
      );
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
            return (
              <li key={references[index].id} className="flex gap-3">
                <span className="shrink-0 text-black/34">{references[index].number}</span>
                <div className="min-w-0 flex-1">
                  <RichTextGradient
                    as="p"
                    tokens={Array.from(referenceNode.childNodes).flatMap((child) =>
                      extractInlineTokens(child),
                    )}
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
}: BlogBodyProps) {
  return (
    <BlogBodyContent
      bodyHtml={bodyHtml}
      references={references}
    />
  );
}
