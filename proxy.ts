import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const LAB_HOST = "lab.atomctrl.com";

function getHostname(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  )
    .split(",")[0]
    .split(":")[0]
    .trim()
    .toLowerCase();
}

export default clerkMiddleware((_auth, request: NextRequest) => {
  // Platform resources enforce auth themselves; do not rewrite them to /lab.
  if (request.nextUrl.pathname === "/platform" || request.nextUrl.pathname.startsWith("/platform/") || request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hostname = getHostname(request);
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const isAuthRoute = pathname === "/sign" || pathname.startsWith("/sign/");
  if (hostname === LAB_HOST && !isAuthRoute && !pathname.startsWith("/lab")) {
    url.pathname = pathname === "/" ? "/lab" : `/lab${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (hostname !== LAB_HOST && pathname.startsWith("/lab")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}, {
  signInUrl: "/sign/login",
  signUpUrl: "/sign/register",
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
    "/platform/:path*",
  ],
};
