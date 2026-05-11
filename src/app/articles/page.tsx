import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { articlesListQuery } from "@/sanity/queries";
import { buildMetadata } from "@/sanity/seo";
import ArticlesFilter from "@/components/ArticlesFilter";

export const revalidate = 60;

const FALLBACK_TITLE = "Articles";
const FALLBACK_DESCRIPTION =
  "Long-form reflections on musicology, cultural preservation, pedagogy, and Mediterranean musical traditions.";

interface ArticleListItem {
  title: string;
  slug: string;
  category: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  featuredImage?: unknown;
}

async function getArticles(): Promise<ArticleListItem[]> {
  try {
    return (await client.fetch<ArticleListItem[]>(articlesListQuery)) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticles();
  const aggregatedKeywords = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean) as string[])
  ).slice(0, 12);

  return buildMetadata({
    seo: aggregatedKeywords.length
      ? { keywords: aggregatedKeywords }
      : undefined,
    fallbackTitle: FALLBACK_TITLE,
    fallbackDescription: FALLBACK_DESCRIPTION,
    url: "/articles",
  });
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen bg-background pt-44 pb-40">
      {/* ── Header ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-20">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-8">
          Perspectives
        </p>
        <h1 className="font-headline text-5xl md:text-7xl font-light text-foreground leading-[1.1] mb-8">
          Articles
        </h1>
        <p className="font-body text-base leading-relaxed text-foreground/50 max-w-xl">
          Long-form reflections on musicology, cultural preservation, pedagogy,
          and the invisible threads connecting Mediterranean musical traditions.
        </p>
      </section>

      <ArticlesFilter articles={articles} />
    </div>
  );
}
