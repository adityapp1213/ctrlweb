"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

type ProfileId = "aditya" | "anjali";

type Profile = {
  id: ProfileId;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  heading: string;
  paragraphs: string[];
  links: Array<{ label: string; href: string; icon: string }>;
};

const profiles: Profile[] = [
  {
    id: "aditya",
    name: "Aditya Panigrahi",
    role: "Chief Everything Officer",
    image: "/assets/chintu1.svg",
    imageAlt: "Aditya Prasad Panigrahi, founder of Atom Ctrl",
    heading: "Built close to the problem.",
    paragraphs: [
      "I'm aditya panigrahi (Chief Everything Officer), about to turn 18 have been working on atom tech since last year have built, ideated and shipped multiple things.",
      "Now have shifted my focus on Monarch, because I feel ai is not just about predicting the next word rather to be a Truely Thinking Machine....",
    ],
    links: [
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
        href: "mailto:aditya@atomctrl.com",
        icon: "/assets/gmail.svg",
      },
    ],
  },
  {
    id: "anjali",
    name: "Anjali Panigrahi",
    role: "Adviser",
    image: "/assets/chiku2.svg",
    imageAlt: "Anjali Panigrahi, adviser to Atom Ctrl",
    heading: "The person who kept believing.",
    paragraphs: [
      "Anjali panigrahi (Adviser ), also my sister :) is the one who has been my constant support and adviser throughout this journey.",
      "From day one she was the one pushing me to work towards something innovative. She is the one who kept believing in me when I was doubting myself.",
    ],
    links: [
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
    ],
  },
];

function SocialLinks({ profile }: { profile: Profile }) {
  return (
    <div className="mt-8 flex items-center gap-7 sm:gap-8">
      {profile.links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          aria-label={link.label}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group inline-flex size-12 items-center justify-center text-black transition-opacity hover:opacity-55"
        >
          <Image
            src={link.icon}
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            className="size-8 scale-[2.65] object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </Link>
      ))}
    </div>
  );
}

function PortraitButton({
  profile,
  onSelect,
}: {
  profile: Profile;
  onSelect: (id: ProfileId) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(profile.id)}
      className="group relative h-full min-h-[24rem] w-full cursor-pointer overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e2687d] sm:min-h-[32rem] lg:min-h-[38rem]"
      whileHover={{ scale: 1.012 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`Read about ${profile.name}`}
    >
      <motion.div className="absolute inset-0 bg-white">
        <Image
          src={profile.image}
          alt={profile.imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, 38vw"
          className="-translate-y-8 object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.015] sm:-translate-y-12 lg:-translate-y-14"
        />
      </motion.div>
    </motion.button>
  );
}

function MobilePortraitStory({
  onSelect,
}: {
  onSelect: (id: ProfileId) => void;
}) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = progress < 0.48 ? 0 : 1;
    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  });

  const activeProfile = profiles[activeIndex];
  const scrollToNextProfile = () => {
    const story = storyRef.current;

    if (!story) {
      return;
    }

    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    const scrollRange = Math.max(0, story.offsetHeight - window.innerHeight);

    window.scrollTo({
      top: storyTop + scrollRange * 0.62,
      behavior: "smooth",
    });
  };

  return (
    <div ref={storyRef} className="relative h-[170svh] md:hidden">
      <div className="sticky top-[7.5rem] flex h-[calc(100svh-7.5rem)] min-h-[32rem] flex-col overflow-hidden bg-white">
        <div className="relative z-20 shrink-0 px-6 pb-3 pt-5 text-center">
          
          <h2 className="mt-3 text-[2.75rem] font-medium leading-[0.88] tracking-[-0.06em] text-black">
            Meet the minds
            <br />
            shaping an industry.
          </h2>
        </div>

        <div className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={activeProfile.id}
              type="button"
              onClick={() => onSelect(activeProfile.id)}
              aria-label={`Read about ${activeProfile.name}`}
              className="absolute inset-0 overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e2687d]"
              initial={{ opacity: 0, y: 18, filter: "blur(12px)", scale: 0.985 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, y: -12, filter: "blur(9px)", scale: 0.99 }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={activeProfile.image}
                alt={activeProfile.imageAlt}
                fill
                sizes="100vw"
                className="origin-bottom -translate-y-11 scale-[0.92] object-contain object-bottom"
              />
              <motion.div
                className="absolute inset-x-5 bottom-4 z-20 flex items-end justify-between border-t border-black/10 bg-white/88 px-1 pt-3 text-left backdrop-blur-md"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.36 }}
              >
                <div>
                  <p className="text-xl font-medium leading-none tracking-[-0.035em] text-black">
                    {activeProfile.name}
                  </p>
                  <p className="mt-1.5 text-xs text-black/45">{activeProfile.role}</p>
                </div>
                <span className="text-xs tabular-nums text-black/35">
                  see details
                </span>
              </motion.div>
            </motion.button>
          </AnimatePresence>

          <AnimatePresence>
            {activeIndex < profiles.length - 1 ? (
              <motion.button
                type="button"
                onClick={scrollToNextProfile}
                aria-label="Show next team member"
                className="absolute bottom-24 left-1/2 z-30 ml-[-1.25rem] grid size-10 place-items-center rounded-full border border-black/[0.08] bg-white text-black shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition-transform active:scale-95"
                initial={{ opacity: 0, y: -6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronDown className="size-4" strokeWidth={1.8} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="relative mx-auto grid w-full max-w-7xl overflow-hidden bg-white md:min-h-[40rem] md:grid-cols-[minmax(0,1.34fr)_minmax(22rem,0.76fr)] lg:min-h-[42rem]"
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      role="region"
      aria-labelledby={`profile-${profile.id}`}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="group absolute left-5 top-6 z-30 inline-flex h-9 items-center gap-2 bg-white/88 pr-3 text-sm font-medium text-black/55 backdrop-blur-md transition-colors hover:text-black sm:left-8 sm:top-7"
        aria-label="Back to team"
      >
        <ArrowLeft
          className="size-[1.1rem] transition-transform duration-300 group-hover:-translate-x-0.5"
          strokeWidth={1.6}
        />
        <span>Back to team</span>
      </button>

      <motion.div
        className="relative min-h-[20rem] overflow-hidden bg-white sm:min-h-[24rem] md:min-h-full"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={profile.image}
          alt={profile.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 65vw"
          className="origin-bottom scale-[0.8] object-contain object-bottom sm:scale-[0.78] md:-translate-y-20 md:scale-[0.72] lg:-translate-y-24 lg:scale-[0.74]"
        />
      </motion.div>

      <motion.div
        className="flex flex-col justify-center border-t border-black/[0.06] px-6 pb-12 pt-9 sm:px-10 sm:pb-14 sm:pt-11 md:border-l md:border-t-0 md:px-10 md:py-14 lg:px-14"
        initial={{ opacity: 0, x: 22, filter: "blur(7px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.58, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          id={`profile-${profile.id}`}
          className="max-w-sm text-[2.35rem] font-medium leading-[0.9] tracking-[-0.055em] text-black sm:text-[2.8rem]"
        >
          {profile.name}
        </h2>
        <p className="mt-2 text-sm font-medium tracking-[0.04em] text-[#e2687d]">
          {profile.role}
        </p>
        <p className="mt-7 max-w-sm text-[1.25rem] font-medium leading-tight tracking-[-0.03em] text-black sm:text-[1.4rem]">
          {profile.heading}
        </p>
        <div className="mt-6 grid max-w-sm gap-5 text-justify text-[1rem] leading-[1.65] tracking-[-0.012em] text-black/58 md:text-left">
          {profile.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <SocialLinks profile={profile} />
      </motion.div>
    </motion.div>
  );
}

export function AboutUsGallery() {
  const [selectedId, setSelectedId] = useState<ProfileId | null>(null);
  const selectedProfile = profiles.find((profile) => profile.id === selectedId);

  const returnToSectionStart = () => {
    window.requestAnimationFrame(() => {
      document
        .getElementById("about-us")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const selectProfile = (id: ProfileId) => {
    setSelectedId(id);
    returnToSectionStart();
  };

  const closeProfile = () => {
    setSelectedId(null);
    returnToSectionStart();
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {selectedProfile ? (
        <ProfilePanel
          key={`profile-${selectedProfile.id}`}
          profile={selectedProfile}
          onClose={closeProfile}
        />
      ) : (
        <div
          key="team"
          className="relative mx-auto w-full max-w-7xl bg-white"
        >
          <MobilePortraitStory onSelect={selectProfile} />

          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative z-10 mx-auto max-w-3xl px-6 pb-4 pt-8 text-center lg:pt-10">
              <h2 className="mt-5 text-[2.65rem] font-medium leading-[0.95] tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl">
                Meet the minds
                <br />
                shaping an industry.
              </h2>
            </div>

            <div className="grid grid-cols-2 items-end bg-white px-8 lg:px-20">
              {profiles.map((profile) => (
                <PortraitButton
                  key={profile.id}
                  profile={profile}
                  onSelect={selectProfile}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
