"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CONTACT_URL } from "@/lib/seo";

const members = [
  {
    id: "aditya",
    route: "/team/#aditya",
    backRoute: "/team",
    name: "aditya panigrahi",
    role: "founder · chief everything officer",
    image: "/assets/chintu1.svg",
    alt: "aditya prasad panigrahi, founder of atom ctrl",
    links: [
      { label: "linkedin", href: "https://www.linkedin.com/in/aditya-prasad-panigrahi/", icon: "/assets/linkedin.svg" },
      { label: "github", href: "https://github.com/adityapp1213", icon: "/assets/github.svg" },
      { label: "instagram", href: "https://www.instagram.com/why.adi_tya", icon: "/assets/instagram.svg" },
      { label: "gmail", href: "mailto:aditya@atomctrl.com", icon: "/assets/gmail.svg" },
    ],
    heading: "built close to the problem.",
    paragraphs: [
      "i'm aditya panigrahi (chief everything officer), 18 have been working on atom ctrl since last year have built, ideated and shipped multiple things.",
      "now have shifted my focus on WAM, because i feel ai is not just about predicting the next word rather to be a truely thinking machine....",
    ],
  },
  {
    id: "anjali",
    route: "/team/#anjali",
    backRoute: "/team",
    name: "anjali panigrahi",
    role: "adviser",
    image: "/assets/chiku2.svg",
    alt: "anjali panigrahi, adviser to atom ctrl",
    links: [
      { label: "linkedin", href: "https://www.linkedin.com/in/anjali-panigrahi", icon: "/assets/linkedin.svg" },
      { label: "instagram", href: "https://www.instagram.com/_anjali_panigrahi_", icon: "/assets/instagram.svg" },
      { label: "gmail", href: "mailto:anjali.panigrahi.99@gmail.com", icon: "/assets/gmail.svg" },
    ],
    heading: "the person who kept believing.",
    paragraphs: [
      "anjali panigrahi (adviser ), also my sister :) is the one who has been my constant support and adviser throughout this journey.",
      "from day one she was the one pushing me to work towards something innovative. she is the one who kept believing in me when i was doubting myself.",
    ],
  },
];

export function SimpleTeamCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const syncExpandedMember = () => {
      const member = members.find((item) => window.location.hash === `#${item.id}`);
      setExpandedId(member?.id ?? null);
    };

    syncExpandedMember();
    window.addEventListener("popstate", syncExpandedMember);

    return () => window.removeEventListener("popstate", syncExpandedMember);
  }, []);

  const toggleMember = (memberId: string) => {
    const member = members.find((item) => item.id === memberId);
    const isExpanded = expandedId === memberId;

    setExpandedId(isExpanded ? null : memberId);
    window.history.pushState(null, "", isExpanded ? member?.backRoute : member?.route);
  };

  return (
    <section className={`simple-team-cards${expandedId ? " is-expanded" : ""}`} aria-labelledby="team-title">
      <h1 id="team-title">
        Meet the minds shaping an <span>industry.</span>
      </h1>
      <div className="simple-site-divider simple-team-divider" aria-hidden="true" />
      {expandedId ? (
        <button className="simple-team-back" type="button" onClick={() => toggleMember(expandedId)}>
          <span aria-hidden="true">←</span> Back to Team
        </button>
      ) : null}
      <div className={`simple-team-card-grid${expandedId ? " is-expanded" : ""}`}>
        {members.filter((member) => !expandedId || member.id === expandedId).map((member) => {
          const expanded = expandedId === member.id;

          return (
            <article className={`simple-team-card${expanded ? " is-expanded" : ""}`} key={member.id}>
              <button
                className="simple-team-card-toggle"
                type="button"
                aria-expanded={expanded}
                onClick={() => toggleMember(member.id)}
              >
                <span className={`simple-team-card-image simple-team-card-image-${member.id}`}>
                  <Image src={member.image} alt={member.alt} fill sizes="(max-width: 700px) 100vw, 18rem" />
                </span>
                <span className="simple-team-card-meta">
                  <span>
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </span>
                  <span className="simple-team-card-plus" aria-hidden="true">
                    {expanded ? "−" : "+"}
                  </span>
                </span>
              </button>
              {expanded ? (
                <div className="simple-team-card-details">
                  <h2>{member.heading}</h2>
                  {member.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <div className="simple-team-card-links" aria-label={`${member.name} social links`}>
                    {member.links.map((link) => (
                      <a
                        href={link.href}
                        key={link.label}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                        aria-label={link.label}
                      >
                        <Image src={link.icon} alt="" width={22} height={22} />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <div className="simple-team-connect-section">
        <a className="simple-team-connect" href={CONTACT_URL} target="_blank" rel="noreferrer">
          Want to join the team? Let&apos;s connect <span aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
