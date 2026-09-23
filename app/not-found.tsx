"use client";

import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import Link from "next/link";
import { useRef, useState } from "react";

export default function NotFound() {
  const markRef = useRef<HTMLHeadingElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLHeadingElement>) => {
    const bounds = markRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setPointer({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-[#0b0b0b] px-6 text-[#f7f7f5]">
      <h1
        ref={markRef}
        aria-label="404"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setPointer(null)}
        className={`${GeistPixelCircle.className} ${GeistPixelSquare.variable} relative text-[clamp(6rem,20vw,12rem)] leading-none`}
      >
        <span>404</span>
        <span
          aria-hidden="true"
          className={`${GeistPixelSquare.className} pointer-events-none absolute inset-0`}
          style={
            pointer
              ? {
                  WebkitMaskImage: `radial-gradient(circle 4.5rem at ${pointer.x}px ${pointer.y}px, #000 0%, #000 70%, transparent 100%)`,
                  maskImage: `radial-gradient(circle 4.5rem at ${pointer.x}px ${pointer.y}px, #000 0%, #000 70%, transparent 100%)`,
                }
              : { opacity: 0 }
          }
        >
          404
        </span>
      </h1>
      <Link className="text-sm text-[#a6a6a6] underline underline-offset-4 transition-colors hover:text-[#f7f7f5]" href="/">
        ← back
      </Link>
    </main>
  );
}
