import Image from "next/image";
import { createElement } from "react";
import parse, {
  attributesToProps,
  domToReact,
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";
import type { BlogArticle } from "@/lib/blog-article";
import styles from "./blog.module.css";

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

// Sources are trusted, version-controlled HTML. Keep parsing on the server so
// hydration never replaces the article or changes its links and section IDs.
function hasClass(node: DOMNode, className: string): node is Element {
  return node instanceof Element && (node.attribs.class ?? "").split(/\s+/).includes(className);
}

function textContent(node: DOMNode): string {
  if ("data" in node) return node.data;
  return "children" in node ? node.children.map((child) => textContent(child as DOMNode)).join("") : "";
}

const options: HTMLReactParserOptions = {
  replace(node) {
    if (!(node instanceof Element)) return;

    const props = attributesToProps(node.attribs);
    const className = (node.attribs.class ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => styles[name] ?? name)
      .join(" ");

    if (node.name === "img") {
      return (
        <Image
          {...props}
          src={node.attribs.src}
          alt={node.attribs.alt ?? ""}
          width={Number(node.attribs.width) || 1600}
          height={Number(node.attribs.height) || 900}
          sizes="(max-width: 700px) calc(100vw - 2.5rem), 700px"
          className={className}
        />
      );
    }

    if (hasClass(node, "block")) {
      const children = node.children as DOMNode[];
      const flow = children.find((child) => hasClass(child, "flow-line"));
      const heading = children.find((child) => child instanceof Element && child.name === "h3");
      const label = children.find((child) => hasClass(child, "section-index"));
      if (flow) {
        return (
          <section {...props} className={styles["diagram-section"]}>
            <ResearchFlowDiagram
              label={label ? textContent(label).trim() : ""}
              title={heading ? textContent(heading).trim() : "Process"}
              flow={textContent(flow)}
            />
            <div className={styles["diagram-explanation"]}>
              {domToReact(children.filter((child) => child !== flow && child !== heading && child !== label), options)}
            </div>
          </section>
        );
      }
    }

    if (node.attribs.class) {
      const mappedProps = { ...props, className };
      return node.children.length
        ? createElement(node.name, mappedProps, domToReact(node.children as DOMNode[], options))
        : createElement(node.name, mappedProps);
    }
  },
};

export function BlogBody({ bodyHtml, references }: Pick<BlogArticle, "bodyHtml" | "references">) {
  return (
    <div id="introduction" className={styles.article}>
      {parse(bodyHtml, options)}
      {references.length > 0 ? (
        <section className="mt-14 border-t border-black/8 pt-10" aria-labelledby="references-title">
          <h2 id="references-title">References</h2>
          <ol className="mt-8 space-y-4 text-[0.98rem] leading-8 text-black/64">
            {references.map((reference) => (
              <li id={reference.id} key={reference.id} className="flex gap-3">
                <span className="shrink-0 text-black/34">{reference.number}</span>
                <span>{parse(reference.html, options)}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
