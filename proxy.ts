import { NextResponse, type NextRequest } from "next/server";

const LAB_HOST = "lab.atomctrl.com";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  const url = request.nextUrl.clone();
  const { pathname } = url;

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
