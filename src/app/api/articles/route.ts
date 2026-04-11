import { NextRequest, NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/kv";

const KV_KEY = "articles";
const SEED_FILE = "articles.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await kvGet<unknown[]>(KV_KEY, SEED_FILE);
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const articles = await kvGet<Record<string, string>[]>(KV_KEY, SEED_FILE);

  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const newArticle: Record<string, string> = {
    slug,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    readTime: `${Math.max(1, Math.ceil((body.content || "").split(/\s+/).length / 200))} min read`,
    category: body.category,
  };

  if (body.featuredImage) {
    newArticle.featuredImage = body.featuredImage;
  }

  articles.unshift(newArticle);
  await kvSet(KV_KEY, articles, SEED_FILE);

  return NextResponse.json(newArticle, { status: 201 });
}
