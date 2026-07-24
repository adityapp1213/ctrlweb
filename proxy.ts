import { NextResponse, type NextRequest } from "next/server";

const LAB_HOST = "lab.atomctrl.com";

export function proxy(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;

  if (hostname === LAB_HOST && pathname === "/") {
    return NextResponse.rewrite(new URL("/lab", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
