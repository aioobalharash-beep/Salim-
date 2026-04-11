import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "hero";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const panels = await kvGet(KV_KEY);
    return NextResponse.json(panels);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const panels = await req.json();
  await kvSet(KV_KEY, panels);
  return NextResponse.json({ ok: true });
}
