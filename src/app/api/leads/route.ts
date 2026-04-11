import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Name and email required" },
      { status: 400 },
    );
  }

  // TODO: wire to a backend (e.g. Sanity mutation, email service, or database)
  console.log("Lead captured:", {
    name: body.name,
    email: body.email,
    source: body.source || "consulting",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
