"use client";

import Image from "next/image";
import { useState } from "react";
import { CONTACT_URL } from "@/lib/seo";

const members = [
  {
    id: "aditya",
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
    description:
      "aditya is building atom ctrl around thinking machines that can understand the world, predict what may happen next, and act with purpose.",
  },
  {
    id: "anjali",
    name: "anjali panigrahi",
    role: "adviser",
    image: "/assets/chiku2.svg",
    alt: "anjali panigrahi, adviser to atom ctrl",
    links: [
      { label: "linkedin", href: "https://www.linkedin.com/in/anjali-panigrahi", icon: "/assets/linkedin.svg" },
      { label: "instagram", href: "https://www.instagram.com/_anjali_panigrahi_", icon: "/assets/instagram.svg" },
      { label: "gmail", href: "mailto:anjali.panigrahi.99@gmail.com", icon: "/assets/gmail.svg" },
    ],
    description:
      "anjali advises atom ctrl and provides the steady support and perspective behind the lab as its ideas and models take shape.",
  },
];

export function SimpleTeamCards() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className={`simple-team-cards${expandedId ? " is-expanded" : ""}`} aria-labelledby="team-title">
      <h1 id="team-title">
        Meet the minds shaping an <span>industry.</span>
      </h1>
      <div className="simple-site-divider simple-team-divider" aria-hidden="true" />
      {expandedId ? (
        <button className="simple-team-back" type="button" onClick={() => setExpandedId(null)}>
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
                onClick={() => setExpandedId(expanded ? null : member.id)}
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
                  <p>{member.description}</p>
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
          Want to join the team? Let&apos;s connect <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
