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
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className={`group block ${i > 0 ? "pt-10" : "pt-6"} pb-10 ${
              i < filtered.length - 1
                ? "border-b border-foreground/[0.04]"
                : ""
            }`}
          >
            <h2 className="font-headline text-3xl md:text-[2.6rem] md:leading-[1.2] text-foreground group-hover:text-primary transition-colors duration-500">
              {article.title}
            </h2>
          </Link>
        ))}
      </section>
    </>
  );
}
