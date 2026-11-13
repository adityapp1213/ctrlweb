"use client";

import { useEffect, useState } from "react";

export function BlogReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.getElementById("research-article");
    if (!article) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const bounds = article.getBoundingClientRect();
      const distance = Math.max(1, bounds.height - window.innerHeight);
      setProgress(Math.round(Math.max(0, Math.min(1, -bounds.top / distance)) * 100));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-30 hidden items-center justify-center rounded-2xl border border-black/12 bg-white/85 p-1 backdrop-blur-md lg:flex"
      role="progressbar" aria-label="Article reading progress"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
    >
      <svg className="size-10" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
        <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="3"
          pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress}
          strokeLinecap="round" transform="rotate(-90 24 24)" />
      </svg>
      <span className="sr-only">{progress}%</span>
    </div>
  );
}
