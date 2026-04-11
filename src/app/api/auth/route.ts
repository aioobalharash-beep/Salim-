import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "salimdada2024";
const COOKIE_NAME = "backstage_session";
const COOKIE_VALUE = "authenticated";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.password === ADMIN_PASS) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
