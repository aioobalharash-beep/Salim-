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
  "Musicology",
  "Pedagogy",
  "Cultural Heritage",
  "Composition",
];

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function JournalFilter({ articles }: { articles: Article[] }) {
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-10 border-b border-[#2C2C2C]/[0.06]">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none bg-transparent border-0 border-b border-[#2C2C2C]/[0.08] focus:border-[#586059] focus:ring-0 pl-0 pr-8 py-3 font-label text-[11px] uppercase tracking-[0.18em] text-[#2C2C2C] cursor-pointer transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#586059]/40 text-sm pointer-events-none">
              expand_more
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[#2C2C2C]/20 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#2C2C2C]/[0.08] focus:border-[#2C2C2C]/30 focus:ring-0 pl-8 pr-0 py-3 font-body text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── Article List ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-8">
        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-body text-sm text-[#2C2C2C]/30">
              No perspectives match your search.
            </p>
          </div>
        )}

        {filtered.map((article, i) => (
          <article
            key={article.slug}
            className={`group ${i > 0 ? "pt-20" : "pt-12"} pb-20 ${
              i < filtered.length - 1
                ? "border-b border-[#2C2C2C]/[0.04]"
                : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-7">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/30">
                {formatDate(article.publishedAt)}
              </span>
              {article.category && (
                <>
                  <span className="w-[3px] h-[3px] rounded-full bg-[#2C2C2C]/10" />
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#586059]/50">
                    {article.category}
                  </span>
                </>
              )}
            </div>

            <h2 className="mb-6">
              <Link
                href={`/journal/${article.slug}`}
                className="font-headline text-3xl md:text-[2.6rem] md:leading-[1.2] text-[#2C2C2C] group-hover:text-[#586059] transition-colors duration-500"
              >
                {article.title}
              </Link>
            </h2>

            {article.excerpt && (
              <p className="font-body text-[15px] leading-[1.85] text-[#2C2C2C]/45 max-w-2xl mb-10">
                {article.excerpt}
              </p>
            )}

            <Link
              href={`/journal/${article.slug}`}
              className="inline-flex items-center gap-4 group/link"
            >
              <span className="font-label text-[10px] uppercase tracking-[0.25em] text-[#586059]/60 group-hover/link:text-[#586059] transition-colors duration-300">
                Read Perspective
              </span>
              <span className="text-[#586059]/30 group-hover/link:text-[#586059]/60 group-hover/link:translate-x-1 transition-all duration-300 text-xs">
                →
              </span>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
