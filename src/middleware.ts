import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself
  if (pathname === "/backstage") {
    return NextResponse.next();
  }

  // Protect everything under /backstage/*
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backstage/:path*"],
};
