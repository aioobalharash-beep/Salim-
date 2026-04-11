import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "about";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const about = await kvGet(KV_KEY);
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: "Failed to load about data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  await kvSet(KV_KEY, data);
  return NextResponse.json({ ok: true });
}
