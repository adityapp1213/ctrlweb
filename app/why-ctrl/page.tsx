import Image from "next/image";

import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";

const cloudyButterflies = [
  {
    className:
      "-left-8 -top-7 size-16 -rotate-12 sm:-left-14 sm:-top-8 sm:size-20",
    inverted: false,
  },
  {
    className:
      "-right-10 -bottom-8 size-16 rotate-12 sm:-right-16 sm:-bottom-10 sm:size-20",
    inverted: true,
  },
] as const;

export function WhyCtrlSection() {
  return (
    <section
      id="why-ctrl"
      className="relative z-10 scroll-mt-28 bg-white px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center overflow-hidden rounded-[2.1rem] bg-[#f7f3ea] px-6 pb-9 pt-10 text-center sm:rounded-[2.5rem] sm:px-10 sm:pb-10 sm:pt-11">
        <div className="relative z-10 w-fit">
          {cloudyButterflies.map((butterfly, index) =>
            butterfly.inverted ? (
              <InvertedFlappingButterfly
                key={butterfly.className}
                className={butterfly.className}
                frameDelay={index * 100}
              />
            ) : (
              <FlappingButterfly
                key={butterfly.className}
                className={butterfly.className}
                frameDelay={index * 100}
              />
            ),
          )}

          <h2 className="relative z-10 text-[2.75rem] font-medium leading-none tracking-[-0.055em] text-black sm:text-[3.6rem]">
            Meet Cloudy.
          </h2>
        </div>

        <div className="relative mx-auto mt-2 h-[18rem] w-full max-w-xl sm:mt-3 sm:h-[20rem]">
          <span
            aria-hidden="true"
            className="absolute bottom-[2.9rem] left-1/2 z-0 h-3 w-44 -translate-x-1/2 rounded-full bg-[#8297a0]/15 blur-md sm:bottom-[3.2rem] sm:w-52"
          />
          <Image
            src="/assets/cloudy.svg"
            alt="Cloudy, the friendly personality inside Ctrl"
            fill
            sizes="(max-width: 640px) 88vw, 576px"
            className="z-10 scale-[1.28] object-contain object-center sm:scale-[1.35]"
          />
        </div>

        <p className="mt-1 max-w-md text-[0.95rem] leading-[1.35] tracking-[-0.018em] text-black/55 sm:mt-2 sm:text-[1.02rem]">
          Cloudy is Ctrl&apos;s calm, familiar voice making powerful models feel
          natural to talk to, and a little more human.
        </p>
      </div>
    </section>
  );
}

export default function WhyCtrlPage() {
  return <WhyCtrlSection />;
}
