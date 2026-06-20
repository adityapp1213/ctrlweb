"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/flapping-butterfly";
import Button7 from "@/components/ui/button-7";

const cloudyCtaButterflies = [
  {
    className: "z-30 -left-14 -bottom-14 size-20 rotate-12 sm:size-28",
    inverted: false,
  },
  {
    className: "z-30 -right-16 -top-14 size-24 -rotate-12 sm:size-32",
    inverted: true,
  },
  {
    className: "z-30 -right-5 -bottom-16 size-20 rotate-6 sm:size-28",
    inverted: true,
  },
];

function CloudyCta() {
  const ctaRef = useRef<HTMLSpanElement>(null);
  const [showButterflies, setShowButterflies] = useState(false);

  useEffect(() => {
    const node = ctaRef.current;

    if (!node) {
      return;
    }

    let visibilityTimeout: number | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (visibilityTimeout) {
          window.clearTimeout(visibilityTimeout);
        }

        visibilityTimeout = window.setTimeout(
          () => setShowButterflies(entry.isIntersecting),
          entry.isIntersecting ? 180 : 320,
        );
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      if (visibilityTimeout) {
        window.clearTimeout(visibilityTimeout);
      }

      observer.disconnect();
    };
  }, []);

  return (
    <span
      ref={ctaRef}
      className="relative mx-auto mt-9 flex w-fit overflow-visible lg:mx-0 lg:inline-flex"
    >
      {cloudyCtaButterflies.map((butterfly, index) => (
        <span
          key={butterfly.className}
          className={[
            "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
            showButterflies ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {butterfly.inverted ? (
            <InvertedFlappingButterfly
              className={butterfly.className}
              frameDelay={index * 90}
            />
          ) : (
            <FlappingButterfly
              className={butterfly.className}
              frameDelay={index * 90}
            />
          )}
        </span>
      ))}
      <Button7
        onClick={() => {
          window.open(
            "https://form.typeform.com/to/nMrMD9Wh",
            "_blank",
            "noopener,noreferrer",
          );
        }}
        className="relative z-20 inline-flex h-auto rounded-xl bg-black px-6 py-3.5 text-base font-medium text-white shadow-none hover:bg-black/85"
      >
        Request access
      </Button7>
    </span>
  );
}

export function WhyCtrlSection() {
  return (
    <section
      id="why-ctrl"
      className="relative z-10 scroll-mt-28 bg-white px-4 pb-16 pt-10 sm:px-6 sm:pt-12 lg:pb-16 lg:pt-14"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-2">
          
          <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] text-black sm:text-6xl lg:text-7xl">
            Hi from Cloudy 
          </h2>
          <div className="mt-8 max-w-xl px-3 text-xl leading-relaxed tracking-[-0.02em] text-black/62 sm:px-0">
            <p>
              Ctrl is the app where the models live, but Cloudy is the part that
              makes it feel approachable. It is the personality layer of the
              product, the familiar voice users meet when they chat with the
              system in natural language.
            </p>
            <p className="mt-5">
              The goal is not to make intelligence feel louder. Cloudy is meant
              to keep the experience calm, readable, and human enough that
              talking to advanced models feels less like operating software and
              more like working with a steady companion.
            </p>
          </div>
          <CloudyCta />
        </div>

        <div className="order-1 lg:order-1">
          <div className="relative mx-auto w-full max-w-xl">
            <Image
              src="/assets/cloudy2.png"
              alt="Cloudy, the Ctrl app personality"
              width={1200}
              height={1200}
              className="aspect-square w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WhyCtrlPage() {
  return <WhyCtrlSection />;
}
