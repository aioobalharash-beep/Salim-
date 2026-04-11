import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "about";
const SEED_FILE = "about.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const about = await kvGet(KV_KEY, SEED_FILE);
  return NextResponse.json(about);
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  await kvSet(KV_KEY, data, SEED_FILE);
  return NextResponse.json({ ok: true });
}
