import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "leads";
const SEED_FILE = "leads.json";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  const leads = await kvGet<unknown[]>(KV_KEY, SEED_FILE);
  const lead = {
    name: body.name,
    email: body.email,
    source: body.source || "consulting",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);
  await kvSet(KV_KEY, leads, SEED_FILE);

  return NextResponse.json({ ok: true }, { status: 201 });
}
