import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "content", "hero.json");

async function readHero() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeHero(data: unknown) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const panels = await readHero();
  return NextResponse.json(panels);
}

export async function PUT(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const panels = await req.json();
  await writeHero(panels);
  return NextResponse.json({ ok: true });
}
