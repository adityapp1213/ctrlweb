import Image from "next/image";

import { cn } from "@/lib/utils";

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

type ButterflyProps = {
  className: string;
  frameDelay?: number;
};

function ButterflyFrames({
  className,
  frameDelay = 0,
  frames,
}: ButterflyProps & { frames: string[] }) {
  return (
    <span className={cn("pointer-events-none absolute", className)}>
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

export function FlappingButterfly({
  className,
  frameDelay = 0,
}: ButterflyProps) {
  return (
    <ButterflyFrames
      className={className}
      frameDelay={frameDelay}
      frames={butterflyFrames}
    />
  );
}

export function InvertedFlappingButterfly({
  className,
  frameDelay = 0,
}: ButterflyProps) {
  return (
    <ButterflyFrames
      className={className}
      frameDelay={frameDelay}
      frames={invertedButterflyFrames}
    />
  );
}
