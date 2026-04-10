"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ── Static seed data (will be replaced by CMS later) ── */
const articles = [
  {
    slug: "disappearance-of-the-andalusian-nouba",
    date: "October 2024",
    title: "On the Disappearance of the Andalusian Nouba",
    excerpt:
      "The nouba, a multi-movement suite that once defined the sonic landscape of North Africa, is fading from living performance. This essay traces its decline and argues for a new approach to preservation.",
    readTime: "12 min read",
    category: "Cultural Heritage",
  },
  {
    slug: "silence-as-structure",
    date: "August 2024",
    title: "Silence as Structure: Negative Space in Orchestral Conducting",
    excerpt:
      "What happens between the notes matters more than the notes themselves. An exploration of how the great conductors used silence as an architectural element.",
    readTime: "8 min read",
    category: "Composition",
  },
  {
    slug: "the-luthiers-hand",
    date: "May 2024",
    title: "The Luthier\u2019s Hand: Craftsmanship and Memory in the Maghreb",
    excerpt:
      "Documenting the last generation of traditional oud makers in Algeria and Tunisia \u2014 their methods, philosophies, and the threat of industrial replacement.",
    readTime: "15 min read",
    category: "Cultural Heritage",
  },
  {
    slug: "microtonal-bridges",
    date: "February 2024",
    title: "Microtonal Bridges: How the Sahel Shaped European Harmony",
    excerpt:
      "A musicological argument for the overlooked influence of sub-Saharan tonal systems on the development of early European polyphony, traced through trade routes and manuscript evidence.",
    readTime: "18 min read",
    category: "Musicology",
  },
  {
    slug: "teaching-without-words",
    date: "November 2023",
    title: "Teaching Without Words: The Oral Tradition in Guitar Pedagogy",
    excerpt:
      "Before conservatories, the guitar was taught hand-to-hand, ear-to-ear. This essay reflects on what has been lost \u2014 and what can be reclaimed \u2014 in our approach to musical education.",
    readTime: "10 min read",
    category: "Pedagogy",
  },
];

const categories = ["All", "Musicology", "Pedagogy", "Cultural Heritage", "Composition"];

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

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
  }, [activeCategory, search]);

  return (
    <div className="pt-40 pb-32">
      {/* ── Header ── */}
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

      {/* ── Filter Bar + Search ── */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-16">
        <div className="border-b border-outline-variant/15 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Category Pills */}
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

          {/* Search */}
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

      {/* ── Article List ── */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-4xl">
          {filtered.length === 0 && (
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
                {/* Content */}
                <div className="flex-1 max-w-2xl">
                  {/* Meta */}
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

                  {/* Title */}
                  <h2 className="font-serif-brand text-2xl md:text-3xl mb-4 text-on-surface group-hover:text-primary transition-colors duration-300 leading-snug">
                    <Link href={`/journal/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-sm leading-relaxed text-on-surface-variant/80 mb-8">
                    {article.excerpt}
                  </p>

                  {/* CTA */}
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

                {/* Decorative side accent (desktop) */}
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
