"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button7 from "@/components/ui/button-7";

const butterflyFrames = [
  "/assets/butterfly1.svg",
  "/assets/butterfly2.svg",
  "/assets/butterfly3.svg",
  "/assets/butterfly4.svg",
];

const invertedButterflyFrames = [
  "/assets/butterfly1(inverted).svg",
  "/assets/butterfly2(inverted).svg",
  "/assets/butterfly3(inverted).svg",
  "/assets/butterfly4(inverted).svg",
];

const cloudyCtaButterflies = [
  {
    className: "-left-14 -bottom-14 size-20 rotate-12 sm:size-28",
    inverted: false,
  },
  {
    className: "-right-16 -top-14 size-24 -rotate-12 sm:size-32",
    inverted: true,
  },
  {
    className: "-right-5 -bottom-16 size-20 rotate-6 sm:size-28",
    inverted: true,
  },
];

function FlappingButterfly({
  className,
  frameDelay = 0,
  inverted = false,
}: {
  className: string;
  frameDelay?: number;
  inverted?: boolean;
}) {
  const frames = inverted ? invertedButterflyFrames : butterflyFrames;

  return (
    <span className={["pointer-events-none absolute z-30", className].join(" ")}>
      {frames.map((frame, index) => (
        <Image
          key={frame}
          src={frame}
          alt=""
          width={160}
          height={160}
          aria-hidden="true"
          className="absolute inset-0 size-full object-contain opacity-0 [animation:butterfly-flap_640ms_steps(1,end)_infinite]"
          style={{
            animationDelay: `${frameDelay + index * 160}ms`,
          }}
        />
      ))}
    </span>
  );
}

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
          <FlappingButterfly
            className={butterfly.className}
            frameDelay={index * 90}
            inverted={butterfly.inverted}
          />
        </span>
      ))}
      <Button7
        onClick={() => {
          window.open(
            "https://forms.gle/NYkQTh2EeLP3Jc5Z9",
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

export function Section4() {
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
          <div className="mt-8 max-w-xl text-xl leading-relaxed tracking-[-0.02em] text-black/62">
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

export default function Section4Page() {
  return <Section4 />;
}
