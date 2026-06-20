import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aditya-prasad-panigrahi/",
    icon: "/assets/linkedin.svg",
  },
  {
    label: "GitHub",
    href: "https://github.com/adityapp1213",
    icon: "/assets/github.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/why.adi_tya",
    icon: "/assets/instagram.svg",
  },
  {
    label: "Gmail",
    href: "mailto:adityappanigrahi@gmail.com",
    icon: "/assets/gmail.svg",
  },
];

const adviserLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anjali-panigrahi",
    icon: "/assets/linkedin.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_anjali_panigrahi_",
    icon: "/assets/instagram.svg",
  },
  {
    label: "Gmail",
    href: "mailto:anjali.panigrahi.99@gmail.com",
    icon: "/assets/gmail.svg",
  },
];

function SocialIconLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex size-12 items-center justify-center rounded-xl text-black transition-colors hover:bg-black/[0.03]"
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      <Image
        src={icon}
        alt=""
        width={28}
        height={28}
        aria-hidden="true"
        className="h-8 w-8 shrink-0 scale-[3.25] object-contain"
      />
    </Link>
  );
}

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-24 pt-8 sm:px-6 lg:pb-32 lg:pt-10"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-14 h-64 w-64 -translate-x-1/2 rounded-full bg-[#e2687d]/10 blur-3xl lg:hidden"
        aria-hidden="true"
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="order-2 mx-auto max-w-2xl text-center lg:order-1 lg:mx-0 lg:text-left">
          
          <h2 className="mt-5 text-[3.45rem] font-medium leading-[0.92] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
            Built close to the problem.
          </h2>
          <div className="mx-auto mt-7 grid max-w-xl gap-5 text-pretty text-lg leading-relaxed tracking-[-0.02em] text-black/62 sm:text-xl lg:mx-0">
            <p>
              I&apos;m aditya panigrahi (Chief Everything Officer  
              ), about to turn 18 have been working on atom tech since last year
              have built, ideated and shipped multiple things.
            </p>
            <p>
              Now have shifted my focus on Monarch, because I feel ai is not just about 
              predicting the next word rather to be a Truely Thinking Machine....
            </p>
          </div>

          <div className="mx-auto mt-9 flex w-full max-w-sm items-center justify-center gap-7 lg:mx-0 lg:justify-start">
            {socialLinks.map((link) => (
              <SocialIconLink
                key={link.label}
                href={link.href}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-md lg:max-w-lg">
            <div
              className="absolute -inset-5 rounded-[2rem] bg-gradient-to-b from-[#f4eee7] to-transparent lg:-inset-7 lg:rounded-[2.25rem]"
              aria-hidden="true"
            />
            <Image
              src="/assets/butterfly1.svg"
              alt=""
              width={74}
              height={74}
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 top-10 z-10 w-14 rotate-[-18deg] opacity-80 sm:w-16"
            />
            <Image
              src="/assets/butterfly3.svg"
              alt=""
              width={72}
              height={72}
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 bottom-16 z-10 w-14 rotate-[16deg] opacity-75 sm:w-16"
            />
            <Image
              src="/assets/me.svg"
              alt="Portrait of the Ctrl founder"
              width={810}
              height={1012}
              className="relative w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 grid w-full max-w-7xl items-center gap-10 border-t border-black/10 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20">
        <div className="order-2 mx-auto max-w-2xl text-center lg:order-1 lg:mx-0 lg:text-left">
          
          <h2 className="mt-5 text-[3.45rem] font-medium leading-[0.92] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
            The person who kept believing.
          </h2>
          <div className="mx-auto mt-7 grid max-w-xl gap-5 text-pretty text-lg leading-relaxed tracking-[-0.02em] text-black/62 sm:text-xl lg:mx-0">
            <p>
              Anjali panigrahi (Adviser ), also my sister :) is the one who has been my constant support and adviser throughout this journey.
            </p>
            <p>
              From day one she was the one pushing me to work towards something innovative. She is the one who kept believing in me when I was doubting myself.
            </p>
          </div>

          <div className="mx-auto mt-9 flex w-full max-w-sm items-center justify-center gap-7 lg:mx-0 lg:justify-start">
            {adviserLinks.map((link) => (
              <SocialIconLink
                key={link.label}
                href={link.href}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-md lg:max-w-lg">
            <div
              className="absolute -inset-5 rounded-[2rem] bg-gradient-to-b from-[#f4eee7] to-transparent lg:-inset-7 lg:rounded-[2.25rem]"
              aria-hidden="true"
            />
            <Image
              src="/assets/butterfly2.svg"
              alt=""
              width={74}
              height={74}
              aria-hidden="true"
              className="pointer-events-none absolute -left-5 bottom-16 z-10 w-14 rotate-[18deg] opacity-80 sm:w-16"
            />
            <Image
              src="/assets/butterfly4.svg"
              alt=""
              width={72}
              height={72}
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 top-12 z-10 w-14 rotate-[-14deg] opacity-75 sm:w-16"
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e2687d]/10 blur-3xl"
              aria-hidden="true"
            />
            <Image
              src="/assets/anjali.png"
              alt="Portrait of the adviser"
              width={810}
              height={1012}
              className="relative w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutUsPage() {
  return <AboutUsSection />;
}
