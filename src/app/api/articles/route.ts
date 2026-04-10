import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "content", "articles.json");

async function readArticles() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeArticles(data: unknown) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const articles = await readArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get("backstage_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const articles = await readArticles();

  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const newArticle = {
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

  articles.unshift(newArticle);
  await writeArticles(articles);

  return NextResponse.json(newArticle, { status: 201 });
}
