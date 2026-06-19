"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  label: string;
};

export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "introduction");

  useEffect(() => {
    let animationFrame = 0;

    const getHeadingNodes = () =>
      items
        .map((item) => document.getElementById(item.id))
        .filter((node): node is HTMLElement => Boolean(node));

    const updateFromScroll = () => {
      const nodes = getHeadingNodes();

      if (!nodes.length) {
        return;
      }

      const activationLine = 150;
      const nextActive =
        [...nodes]
          .reverse()
          .find((node) => node.getBoundingClientRect().top <= activationLine)
          ?.id ?? nodes[0].id;

      setActiveId(nextActive);
    };

    const requestScrollUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        setActiveId(hash);
        requestScrollUpdate();
      }
    };

    requestScrollUpdate();
    window.addEventListener("hashchange", updateFromHash);
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("hashchange", updateFromHash);
      window.removeEventListener("scroll", requestScrollUpdate);
      window.removeEventListener("resize", requestScrollUpdate);
    };
  }, [items]);

  return (
    <nav className="sticky top-28">
      <ul className="space-y-4 text-[0.98rem] leading-7 text-black/55">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              className={[
                "transition-colors hover:text-black",
                activeId === item.id ? "text-black" : "",
              ].join(" ")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
