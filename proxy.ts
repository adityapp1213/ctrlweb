import { NextResponse, type NextRequest } from "next/server";

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

export function proxy(request: NextRequest) {
  const hostname = getHostname(request);
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  if (hostname === LAB_HOST && !pathname.startsWith("/lab")) {
    url.pathname = pathname === "/" ? "/lab" : `/lab${pathname}`;
    return NextResponse.rewrite(url);
  }

  if (hostname !== LAB_HOST && pathname.startsWith("/lab")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|assets).*)"],
};
