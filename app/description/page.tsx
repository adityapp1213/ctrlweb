import { ScrollProgressStory } from "@/components/ui/main/scroll-progress-story";

export function DescriptionSection() {
  return (
    <section
      id="description"
      className="relative z-30 -mt-24 min-h-screen scroll-mt-28 overflow-visible bg-white px-4 py-16 sm:px-6"
    >
      <ScrollProgressStory />
    </section>
  );
}

export default function DescriptionPage() {
  return <DescriptionSection />;
}
