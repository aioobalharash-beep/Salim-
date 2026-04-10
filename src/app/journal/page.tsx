"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
}

const categories = ["All", "Musicology", "Pedagogy", "Cultural Heritage", "Composition"];

export default function JournalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        activeCategory === "All" || a.category === activeCategory;
      const matchesSearch =
        search === "" ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, search]);

  return (
    <div className="pt-40 pb-32">
      {/* Header */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-8">
        <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6">
          Perspectives
        </p>
        <h1 className="font-headline text-5xl md:text-6xl font-light mb-6">
          Journal
        </h1>
        <p className="font-body text-lg leading-relaxed text-on-surface-variant max-w-2xl">
          Long-form reflections on musicology, cultural preservation, pedagogy,
          and the invisible threads connecting Mediterranean musical traditions.
        </p>
      </section>

      {/* Filter Bar + Search */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16">
        <div className="border-b border-outline-variant/15 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-label text-[11px] uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-primary/40 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search perspectives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-primary focus:ring-0 pl-8 pr-0 py-3 font-body text-sm placeholder:text-on-surface-variant/40 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Article List */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl">
          {loading && (
            <div className="py-24 text-center">
              <p className="font-body text-on-surface-variant/60">Loading...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-body text-on-surface-variant/60">
                No articles match your search.
              </p>
            </div>
          )}

          {filtered.map((article) => (
            <article
              key={article.slug}
              className="group py-14 border-b border-outline-variant/10 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                      {article.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                    <span className="font-label text-[10px] uppercase tracking-widest text-primary/50">
                      {article.readTime}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant/30" />
                    <span className="font-label text-[10px] uppercase tracking-widest text-tertiary/70">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="font-serif-brand text-2xl md:text-3xl mb-4 text-on-surface group-hover:text-primary transition-colors duration-300 leading-snug">
                    <Link href={`/journal/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant/80 mb-8">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="inline-flex items-center gap-3 group/link"
                  >
                    <span className="font-label text-[10px] uppercase tracking-[0.15em] text-primary border-b border-primary/30 pb-1 group-hover/link:border-primary group-hover/link:tracking-[0.2em] transition-all duration-300">
                      Read Full Perspective
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm transition-transform duration-300 group-hover/link:translate-x-1">
                      arrow_forward
                    </span>
                  </Link>
                </div>
                <div className="hidden md:flex flex-col items-end pt-2">
                  <div className="w-16 h-[1px] bg-primary/10 group-hover:bg-primary/30 group-hover:w-24 transition-all duration-500" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
