"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  publishedAt: string | null;
}

const categories = [
  "All",
  "Arts",
  "Composition",
  "Music & Technology",
  "Conducting",
  "Diversity of Cultural Expressions",
  "Guitar",
  "Musicology",
  "Other",
];

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();
}

export default function ArticlesFilter({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        activeCategory === "All" || a.category === activeCategory;
      const matchesSearch =
        search === "" ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.excerpt || "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, search]);

  return (
    <>
      {/* ── Filter Bar ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-10 border-b border-foreground/[0.06]">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none bg-transparent border-0 border-b border-foreground/[0.08] focus:border-primary focus:ring-0 pl-0 pr-8 py-3 font-label text-[11px] uppercase tracking-[0.18em] text-foreground cursor-pointer transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-primary/40 text-sm pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-foreground/20 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-foreground/[0.08] focus:border-foreground/30 focus:ring-0 pl-8 pr-0 py-3 font-body text-sm text-foreground placeholder:text-foreground/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Article List ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-8">
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-body text-sm text-foreground/30">
              No articles match your search.
            </p>
          </div>
        )}

        {filtered.map((article, i) => (
          <article
            key={article.slug}
            className={`group py-14 md:py-16 ${
              i < filtered.length - 1
                ? "border-b border-foreground/[0.06]"
                : ""
            }`}
          >
            {(article.publishedAt || article.category) && (
              <div className="flex items-center gap-3 mb-6">
                {article.publishedAt && (
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-foreground/30">
                    {formatDate(article.publishedAt)}
                  </span>
                )}
                {article.publishedAt && article.category && (
                  <span className="w-[3px] h-[3px] rounded-full bg-foreground/10" />
                )}
                {article.category && (
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/50">
                    {article.category}
                  </span>
                )}
              </div>
            )}

            <h2 className="mb-7">
              <Link
                href={`/articles/${article.slug}`}
                className="font-headline text-3xl md:text-[2.6rem] md:leading-[1.2] text-foreground group-hover:text-primary transition-colors duration-500"
              >
                {article.title}
              </Link>
            </h2>

            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex items-center gap-3 group/link"
            >
              <span className="font-body text-sm lowercase tracking-normal text-primary/60 group-hover/link:text-primary transition-colors duration-300">
                read article
              </span>
              <span className="text-primary/30 group-hover/link:text-primary/60 group-hover/link:translate-x-1 transition-all duration-300 text-xs">
                →
              </span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
