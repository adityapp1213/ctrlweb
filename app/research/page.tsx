import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleResearchProcess } from "@/components/simple-research-process";

export default function ResearchPage() {
  return (
    <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
      <div className="simple-site-shell simple-site-shell-research">
        <SimpleSiteNav active="Research" />
        <SimpleResearchProcess />
      </div>
    </main>
  );
}
