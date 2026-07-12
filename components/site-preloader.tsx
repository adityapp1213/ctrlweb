"use client";

import { useEffect, useState } from "react";
import { SiteLoaderScreen } from "@/components/site-loader-screen";

const MIN_LOADER_MS = 450;
const MAX_CRITICAL_WAIT_MS = 5000;

function waitForImage(image: HTMLImageElement) {
  if (image.complete) {
    return image.decode().catch(() => undefined);
  }

  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  }).then(() => image.decode().catch(() => undefined));
}

export function SitePreloader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = window.performance.now();

    const prepareCriticalContent = async () => {
      // Both responsive hero images exist in the DOM. Wait only for the one
      // selected by CSS, so the loader follows the asset the user will see and
      // never downloads the site's below-the-fold media itself.
      const heroImages = Array.from(
        document.querySelectorAll<HTMLImageElement>("#hero img"),
      );
      const visibleHeroImage = heroImages.find(
        (image) => window.getComputedStyle(image).display !== "none",
      );
      const criticalTasks: Promise<unknown>[] = [];

      if (visibleHeroImage) {
        criticalTasks.push(waitForImage(visibleHeroImage));
      }

      if ("fonts" in document) {
        criticalTasks.push(document.fonts.ready.catch(() => undefined));
      }

      await Promise.race([
        Promise.allSettled(criticalTasks),
        new Promise<void>((resolve) =>
          window.setTimeout(resolve, MAX_CRITICAL_WAIT_MS),
        ),
      ]);

      const elapsed = window.performance.now() - start;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

      window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        setIsReady(true);
      }, remaining);
    };

    void prepareCriticalContent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SiteLoaderScreen visible={!isReady} />
      <div
        className={[
          "opacity-100",
          isReady ? "" : "pointer-events-none",
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}
