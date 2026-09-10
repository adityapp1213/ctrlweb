import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteCta } from "@/components/simple-site-cta";
import { SimpleTeamCards } from "@/components/simple-team-cards";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/team",
  title: "Team",
  description:
    "Meet the people building atom ctrl and its research into world thinking machines.",
});

export default function TeamPage() {
  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell simple-site-shell-empty">
          <SimpleSiteNav active="Team" />
          <SimpleTeamCards />
        </div>
        <SimpleSiteCta />
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
