import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "content", "leads.json");

async function readLeads(): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  const leads = await readLeads();
  const lead = {
    name: body.name,
    email: body.email,
    source: body.source || "consulting",
    createdAt: new Date().toISOString(),
  };

  leads.push(lead);
  await fs.writeFile(DATA_PATH, JSON.stringify(leads, null, 2), "utf-8");

  return NextResponse.json({ ok: true }, { status: 201 });
}
