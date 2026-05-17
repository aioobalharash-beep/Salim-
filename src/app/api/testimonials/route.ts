import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const runtime = "nodejs";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function clean(value: unknown, max = 200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = clean(payload.name, 120);
  const content = clean(payload.content, 2000);
  if (!name || !content) {
    return NextResponse.json(
      { error: "Name and content are required." },
      { status: 400 },
    );
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Server is not configured to accept submissions." },
      { status: 503 },
    );
  }

  const doc = {
    _id: `drafts.testimonial-${crypto.randomUUID()}`,
    _type: "testimonial",
    name,
    profession: clean(payload.profession, 120),
    city: clean(payload.city, 120),
    country: clean(payload.country, 120),
    content,
    approved: false,
  };

  try {
    await writeClient.create(doc);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Failed to create testimonial draft:", err);
    return NextResponse.json(
      { error: "Could not save submission." },
      { status: 500 },
    );
  }
}
