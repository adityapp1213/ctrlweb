import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteCta } from "@/components/simple-site-cta";

export default function TeamPage() {
  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell simple-site-shell-empty">
          <SimpleSiteNav active="Team" />
        </div>
        <SimpleSiteCta />
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
