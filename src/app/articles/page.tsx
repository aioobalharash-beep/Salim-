import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { articlesListQuery } from "@/sanity/queries";
import ArticlesFilter from "@/components/ArticlesFilter";

export const metadata: Metadata = {
  title: "Articles — Salim Dada",
  description:
    "Long-form reflections on musicology, cultural preservation, pedagogy, and Mediterranean musical traditions.",
};

export const revalidate = 60;

export default async function ArticlesPage() {
  let articles = [];
  try {
    articles = (await client.fetch(articlesListQuery)) ?? [];
  } catch {
    // Sanity unavailable — show empty list
  }

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

      <ArticlesFilter articles={articles ?? []} />
    </div>
  );
}
