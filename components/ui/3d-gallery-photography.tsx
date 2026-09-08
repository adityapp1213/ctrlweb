"use client";

/* eslint-disable @next/next/no-img-element */

import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  zSpacing?: number;
  visibleCount?: number;
  falloff?: { near: number; far: number };
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  xSeed: number;
  ySeed: number;
}

const DEFAULT_Z_SPACING = 3;
const DEFAULT_FALLOFF = { near: 0.8, far: 14 };
const SCROLL_TO_PROGRESS = 0.0048;
const TOUCH_TO_PROGRESS = 0.007;
const GALLERY_SCROLL_PASSES = 0.38;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeImages(images: ImageItem[]) {
  return images.map((image) =>
    typeof image === "string" ? { src: image, alt: "" } : image,
  );
}

function calculateFade(progress: number, fadeSettings: FadeSettings) {
  if (progress < fadeSettings.fadeIn.start) return 0;
  if (progress <= fadeSettings.fadeIn.end) {
    return (progress - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
  }
  if (progress >= fadeSettings.fadeOut.start && progress <= fadeSettings.fadeOut.end) {
    return 1 - (progress - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
  }
  if (progress > fadeSettings.fadeOut.end) return 0;
  return 1;
}

function calculateBlur(progress: number, blurSettings: BlurSettings) {
  if (progress < blurSettings.blurIn.start) return blurSettings.maxBlur;
  if (progress <= blurSettings.blurIn.end) {
    return blurSettings.maxBlur * (1 - (progress - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start));
  }
  if (progress >= blurSettings.blurOut.start && progress <= blurSettings.blurOut.end) {
    return blurSettings.maxBlur * ((progress - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start));
  }
  if (progress > blurSettings.blurOut.end) return blurSettings.maxBlur;
  return 0;
}

function isGalleryActive(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const alignmentTolerance = Math.min(140, viewportHeight * 0.18);

  return Math.abs(rect.top) <= alignmentTolerance;
}

export default function InfiniteGallery({
  images,
  speed = 1,
  zSpacing = DEFAULT_Z_SPACING,
  visibleCount = 8,
  falloff = DEFAULT_FALLOFF,
  className = "h-96 w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0, end: 0.12 },
    fadeOut: { start: 0.78, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0, end: 0.1 },
    blurOut: { start: 0.78, end: 0.95 },
    maxBlur: 8,
  },
}: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const targetProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const totalImages = normalizedImages.length;
  const depthRange = Math.max(zSpacing * visibleCount, falloff.far - falloff.near + zSpacing);
  const scrollLimit = depthRange * GALLERY_SCROLL_PASSES;
  const initialPlanes = useMemo(
    () => Array.from({ length: visibleCount }, (_, index) => {
      const horizontalAngle = (index * 2.618) % (Math.PI * 2);
      const verticalAngle = (index * 1.618 + Math.PI / 3) % (Math.PI * 2);

      return {
        index,
        z: zSpacing * index,
        imageIndex: totalImages > 0 ? index % totalImages : 0,
        xSeed: Math.sin(horizontalAngle) * (0.25 + (index % 3) * 0.36),
        ySeed: Math.cos(verticalAngle) * (0.2 + ((index + 1) % 4) * 0.22),
      };
    }),
    [totalImages, visibleCount, zSpacing],
  );
  const planesRef = useRef<PlaneData[]>(initialPlanes);

  useEffect(() => {
    planesRef.current = initialPlanes.map((plane) => ({ ...plane }));
    targetProgressRef.current = 0;
    displayProgressRef.current = 0;
  }, [initialPlanes]);

  const captureGalleryScroll = useCallback(
    (delta: number) => {
      const container = containerRef.current;
      if (!container || !isGalleryActive(container)) return false;

      const nextProgress = targetProgressRef.current + delta;
      const atStart = targetProgressRef.current <= 0;
      const atEnd = targetProgressRef.current >= scrollLimit;

      if ((atStart && delta < 0) || (atEnd && delta > 0)) {
        return false;
      }

      targetProgressRef.current = clamp(nextProgress, 0, scrollLimit);
      return true;
    },
    [scrollLimit],
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const delta = event.deltaY * SCROLL_TO_PROGRESS * speed;
      if (!captureGalleryScroll(delta)) return;
      event.preventDefault();
    },
    [captureGalleryScroll, speed],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        if (!captureGalleryScroll(-2 * speed)) return;
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        if (!captureGalleryScroll(2 * speed)) return;
      } else {
        return;
      }
      event.preventDefault();
    },
    [captureGalleryScroll, speed],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? touchStartY;
      const delta = (touchStartY - y) * TOUCH_TO_PROGRESS * speed;
      touchStartY = y;
      if (captureGalleryScroll(delta)) event.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [captureGalleryScroll, handleKeyDown, handleWheel, speed]);

  useEffect(() => {
    let frameId = 0;

    const render = () => {
      const container = containerRef.current;

      if (container && totalImages > 0) {
        if (isGalleryActive(container)) {
          displayProgressRef.current += (targetProgressRef.current - displayProgressRef.current) * 0.075;
        } else {
          displayProgressRef.current = targetProgressRef.current;
        }

        const rect = container.getBoundingClientRect();
        const maxX = Math.min(rect.width * 0.34, 420);
        const maxY = Math.min(rect.height * 0.24, 190);

        planesRef.current.forEach((plane, index) => {
          const image = imageRefs.current[index];
          if (!image) return;

          const finiteZ = plane.z - displayProgressRef.current;
          const progress = clamp((finiteZ + zSpacing) / depthRange, 0, 1);
          const distance = falloff.near + finiteZ;
          const depthScale = clamp(1.35 - distance / Math.max(falloff.far, 1) * 0.9, 0.38, 1.15);
          const opacity = clamp(calculateFade(progress, fadeSettings), 0, 1);
          const blur = clamp(calculateBlur(progress, blurSettings), 0, blurSettings.maxBlur);
          const x = plane.xSeed * maxX;
          const y = plane.ySeed * maxY;
          const zOffset = -distance * 34;

          image.style.opacity = String(opacity);
          image.style.filter = `blur(${blur}px)`;
          image.style.transform = `translate3d(-50%, -50%, ${zOffset}px) translate3d(${x}px, ${y}px, 0) scale(${depthScale})`;
          image.style.zIndex = String(Math.round((1 - progress) * 100));
        });
      }

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frameId);
  }, [blurSettings, depthRange, fadeSettings, falloff.far, falloff.near, totalImages, zSpacing]);

  if (normalizedImages.length === 0) return null;

  return (
    <div className={className} ref={containerRef} style={style}>
      <div className="relative h-full w-full touch-pan-y overflow-hidden bg-white [perspective:900px] [transform-style:preserve-3d]">
        {initialPlanes.map((plane, index) => {
          const image = normalizedImages[plane.imageIndex];
          if (!image) return null;

          return (
            <img
              alt={image.alt}
              className="pointer-events-auto absolute left-1/2 top-1/2 w-[clamp(150px,21vw,310px)] max-w-none select-none rounded-sm object-cover shadow-[0_18px_40px_rgba(0,0,0,0.12)] will-change-[transform,opacity,filter]"
              draggable={false}
              key={plane.index}
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              src={image.src}
            />
          );
        })}
      </div>
    </div>
  );
}
