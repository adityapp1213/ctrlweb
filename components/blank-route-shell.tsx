import { RouteTopNav } from "@/components/route-top-nav";

export function BlankRouteShell() {
  return (
    <>
      <RouteTopNav />
      <main className="min-h-screen bg-white" />
    </>
  );
}
