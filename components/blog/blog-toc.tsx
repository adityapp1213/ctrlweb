"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  label: string;
};

export function BlogToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "introduction");

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash) {
        setActiveId(hash);
      }
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observers = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.3, 0.6],
      },
    );

    observers.forEach((node) => observer.observe(node));

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
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
                activeId === item.id ? "font-medium text-black" : "",
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
