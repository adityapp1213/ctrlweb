import Image from "next/image";

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

const footerButterflies = [
  {
    className:
      "-left-8 -top-12 size-20 rotate-[-18deg] sm:-left-10 sm:-top-16 sm:size-28",
    inverted: false,
  },
  {
    className:
      "right-[18%] -top-12 size-20 rotate-[16deg] sm:-top-16 sm:size-28",
    inverted: true,
  },
  {
    className:
      "-bottom-10 right-0 size-20 rotate-[22deg] sm:-bottom-14 sm:size-28",
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
    <span className={["pointer-events-none absolute z-10", className].join(" ")}>
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

export function Section7() {
  return (
    <section className="relative z-10 bg-white px-4 pb-4 pt-4 sm:px-6 lg:pt-6">
      <footer className="mx-auto flex min-h-[58vh] w-full max-w-[calc(100vw-2rem)] flex-col justify-end overflow-hidden rounded-xl bg-[#e2687d] px-5 pb-6 text-white sm:px-7 lg:min-h-[62vh] lg:max-w-[calc(100vw-3rem)] lg:px-8 lg:pb-8">
        <div className="relative">
          {footerButterflies.map((butterfly, index) => (
            <FlappingButterfly
              key={butterfly.className}
              className={butterfly.className}
              frameDelay={index * 90}
              inverted={butterfly.inverted}
            />
          ))}
          <h2 className="relative z-0 select-none whitespace-nowrap text-[21.5vw] font-semibold leading-[0.8] tracking-[-0.11em] text-white">
            atomctrl.com
          </h2>
        </div>

        <div className="mt-3 flex w-full flex-col items-start gap-5 text-sm font-medium uppercase leading-tight tracking-[-0.04em] text-white sm:mt-0 sm:flex-row sm:items-end sm:justify-between sm:text-base lg:text-lg">
          <div className="flex w-full items-start justify-between gap-8 sm:w-fit sm:justify-start sm:gap-16">
            <p>
              Bhubaneswar, India
              <br />
              and online
            </p>
            <p className="text-right sm:text-left">
              Ctrl
              <br />
              by atom
            </p>
          </div>

          <div className="flex w-full items-start justify-between gap-8 sm:w-fit sm:justify-start sm:gap-16">
            <p>
              online
              <br />
              early access
            </p>
            <p className="text-right sm:text-left">
              request
              <br />
              waitlist
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default function Section7Page() {
  return <Section7 />;
}
