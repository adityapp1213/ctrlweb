import Image from "next/image";
import Link from "next/link";

const processSteps = [
  {
    number: "01",
    title: "Monarch",
    description:
      "An architecture for representing the world, using memory, and reasoning before action.",
    image: "/assets/blog-cards/1.png",
    alt: "A landscape moving past a train window",
    href: "/research/monarch",
  },
  {
    number: "02",
    title: "Interaction system",
    description:
      "A real-time interaction architecture for understanding and responding while a conversation unfolds.",
    image: "/assets/blog-cards/2.2.png",
    alt: "A blurred landscape in motion",
    href: "/research/interaction-systems",
  },
  {
    number: "03",
    title: "Godel model",
    description:
      "A hybrid local and cloud language model architecture that routes work where it fits.",
    image: "/assets/blog-cards/3.png",
    alt: "A landscape with red birds moving through the sky",
    href: "/research/godel-model",
  },
  {
    number: "04",
    title: "Scaling synthetic data",
      description: "A study of how cleaner synthetic data can make compact models more capable.",
    image: "/assets/blog-cards/4.png",
    alt: "Trees moving past a train window",
    href: "/research/scaling-synthetic-data",
  },
];

export function SimpleResearchProcess() {
  return (
    <section className="simple-research-process" aria-labelledby="research-process-title">
      <div className="simple-research-process-heading">
        <h1 id="research-process-title">
          Research for machines that
          <br />
          <span>can act in the world.</span>
        </h1>
      </div>

      <div className="simple-research-process-steps">
        {processSteps.map((step) => (
          <Link
            className="simple-research-process-step"
            href={step.href}
            key={step.number}
            aria-label={`Read ${step.title} research`}
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
