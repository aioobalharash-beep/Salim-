import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "leads";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  const leads = await kvGet<unknown[]>(KV_KEY);
  const lead = {
    name: body.name,
    email: body.email,
    source: body.source || "consulting",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);
  await kvSet(KV_KEY, leads);

  return NextResponse.json({ ok: true }, { status: 201 });
}
