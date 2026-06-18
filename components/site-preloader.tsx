"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteLoaderScreen } from "@/components/site-loader-screen";
import { siteAssetManifest } from "@/lib/site-assets";

const MIN_LOADER_MS = 900;

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
    image.decoding = "async";
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });
}

export function SitePreloader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const totalAssets = Number(siteAssetManifest.length);
  const progress = useMemo(() => {
    if (totalAssets === 0) {
      return 100;
    }

    return (loadedCount / totalAssets) * 100;
  }, [loadedCount, totalAssets]);

  useEffect(() => {
    let cancelled = false;
    const start = window.performance.now();

    document.body.style.overflow = "hidden";

    const preload = async () => {
      const tasks = siteAssetManifest.map(async (src) => {
        await preloadImage(src);

        if (!cancelled) {
          setLoadedCount((count) => count + 1);
        }
      });

      const fontReady =
        "fonts" in document ? document.fonts.ready.catch(() => undefined) : null;

      await Promise.allSettled(fontReady ? [...tasks, fontReady] : tasks);

      const elapsed = window.performance.now() - start;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

      window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        setLoadedCount(totalAssets);
        setIsReady(true);
        document.body.style.overflow = "";
      }, remaining);
    };

    void preload();

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, [totalAssets]);

  return (
    <>
      <div
        className={[
          "transition-opacity duration-500 ease-out",
          isReady ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        {children}
      </div>
      <SiteLoaderScreen progress={progress} visible={!isReady} />
    </>
  );
}
