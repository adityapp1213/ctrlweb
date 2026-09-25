"use client";

import { GeistPixelCircle } from "geist/font/pixel";
import { useRef } from "react";

type PixelHoverMarkProps = {
  text: string;
  className?: string;
  as?: "div" | "h1";
  ariaLabel?: string;
};

export function PixelHoverMark({
  text,
  className = "",
  as: Tag = "div",
  ariaLabel,
}: PixelHoverMarkProps) {
  const markRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = markRef.current?.getBoundingClientRect();
    const highlight = highlightRef.current;
    if (!bounds || !highlight) return;

    highlight.style.setProperty("--pixel-x", `${event.clientX - bounds.left}px`);
    highlight.style.setProperty("--pixel-y", `${event.clientY - bounds.top}px`);
    highlight.style.opacity = "1";
  };

  const handlePointerLeave = () => {
    if (highlightRef.current) highlightRef.current.style.opacity = "0";
  };

  return (
    <Tag
      ref={(node) => {
        markRef.current = node;
      }}
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`${GeistPixelCircle.className} ${className}`}
    >
      <span>{text}</span>
      <span
        ref={highlightRef}
        aria-hidden="true"
        className={`${GeistPixelCircle.className} pixel-hover-highlight pointer-events-none`}
      >
        {text}
      </span>
    </Tag>
  );
}
