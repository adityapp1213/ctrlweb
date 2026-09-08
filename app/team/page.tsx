import { SimpleSiteNav } from "@/components/simple-site-nav";

export default function TeamPage() {
  return (
    <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
      <div className="simple-site-shell simple-site-shell-empty">
        <SimpleSiteNav active="Team" />
      </div>
    </main>
  );
}
