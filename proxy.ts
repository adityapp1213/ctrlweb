import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";

export function proxy(request: NextRequest) {
  // There are no /lab routes in this app. Send legacy lab URLs to the
  // corresponding public page instead of rewriting them to a missing route.
  const url = request.nextUrl.clone();
  const hostname = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host)
    .split(",")[0].trim().split(":")[0].toLowerCase();
  const isLabPath = url.pathname === "/lab" || url.pathname.startsWith("/lab/");
  if (hostname === "lab.atomctrl.com" || isLabPath) {
    const target = new URL(SITE_URL);
    target.pathname = isLabPath ? url.pathname.slice(4) || "/" : url.pathname;
    target.search = url.search;
    return NextResponse.redirect(target);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|assets).*)"],
};
