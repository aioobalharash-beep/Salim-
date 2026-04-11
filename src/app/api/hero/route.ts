import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "hero";
const SEED_FILE = "hero.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const panels = await kvGet(KV_KEY, SEED_FILE);
  return NextResponse.json(panels);
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const panels = await req.json();
  await kvSet(KV_KEY, panels, SEED_FILE);
  return NextResponse.json({ ok: true });
}
