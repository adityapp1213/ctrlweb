import Image from "next/image";
import Link from "next/link";

import { blogArticles, researchOrder } from "@/lib/research";

export function SimpleResearchProcess() {
  return (
    <section className="simple-research-process" aria-labelledby="research-process-title">
      <div className="simple-research-process-heading">
        <h1 id="research-process-title">
          How we plan, build,
          <br />
          <span>and launch</span>
        </h1>
      </div>

      <div className="simple-research-process-steps">
        {researchOrder.map((slug) => {
          const step = blogArticles[slug];
          return (
            <Link
              className="simple-research-process-step"
              href={step.seo.path}
              key={slug}
              aria-label={`${step.label} research article`}
            >
              <div className="simple-research-process-copy">
                <h2>{step.label}</h2>
                <p>{step.summary}</p>
              </div>
              <Image
                className="simple-research-process-image"
                src={step.heroImageSrc}
                alt={step.heroImageAlt}
                width={220}
                height={124}
                sizes="(max-width: 700px) calc(100vw - 2.5rem), 220px"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
