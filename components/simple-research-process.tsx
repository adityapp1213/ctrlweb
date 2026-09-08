import Image from "next/image";
import Link from "next/link";

const processSteps = [
  {
    number: "01",
    title: "Monarch",
    description:
      "A thought-grounded multimodal architecture for memory, reasoning, and persistent state.",
    image: "/assets/blog-cards/1.png",
    alt: "A landscape moving past a train window",
    href: "/blog/monarch",
  },
  {
    number: "02",
    title: "Interaction system",
    description:
      "A real-time voice architecture for conversations that understand while they unfold.",
    image: "/assets/blog-cards/2.2.png",
    alt: "A blurred landscape in motion",
    href: "/blog/interaction-systems",
  },
  {
    number: "03",
    title: "Godel model",
    description:
      "A hybrid local-cloud language model architecture that routes work where it fits.",
    image: "/assets/blog-cards/3.png",
    alt: "A landscape with red birds moving through the sky",
    href: "/blog/godel-model",
  },
  {
    number: "04",
    title: "Scaling synthetic data",
    description: "A practical study of turning raw web text into cleaner training data.",
    image: "/assets/blog-cards/4.png",
    alt: "Trees moving past a train window",
    href: "/blog/scaling-synthetic-data",
  },
];

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
        {processSteps.map((step) => (
          <Link
            className="simple-research-process-step"
            href={step.href}
            key={step.number}
            aria-label={`${step.title} blog`}
          >
            <div className="simple-research-process-copy">
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
            <Image
              className="simple-research-process-image"
              src={step.image}
              alt={step.alt}
              width={220}
              height={124}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
