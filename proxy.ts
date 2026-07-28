import { NextResponse, type NextRequest } from "next/server";

const LAB_HOST = "lab.atomctrl.com";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/lab") && hostname !== LAB_HOST) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lab/:path*"],
};
