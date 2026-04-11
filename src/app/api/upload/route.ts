import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Allow larger uploads (Next.js defaults to 4 MB body limit)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Auth check
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, AVIF, or GIF." },
        { status: 400 }
      );
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum 10 MB." },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
