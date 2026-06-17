import { Skiper89 } from "@/components/ui/skiper-ui/skiper89";

export function Section2() {
  return (
    <section className="relative z-30 -mt-24 min-h-screen overflow-visible bg-white px-4 py-16 sm:px-6">
      <Skiper89 />
    </section>
  );
}

export default function Section2Page() {
  return <Section2 />;
}
