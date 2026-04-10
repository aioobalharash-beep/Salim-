import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Article {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  category: string;
}

async function getArticle(slug: string): Promise<Article | undefined> {
  const filePath = path.join(process.cwd(), "content", "articles.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const articles: Article[] = JSON.parse(raw);
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Not Found" };
  return {
    title: `${article.title} — Salim Dada`,
    description: article.excerpt,
  };
}

function renderMarkdown(md: string) {
  const blocks = md.split("\n\n");
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Heading
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-serif-brand text-2xl md:text-3xl mt-16 mb-6 text-on-surface"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const text = trimmed.replace(/^> /gm, "");
      return (
        <blockquote
          key={i}
          className="border-l-2 border-primary-container pl-8 py-2 my-10 italic text-primary font-serif-brand text-xl leading-relaxed"
        >
          {text}
        </blockquote>
      );
    }

    // Regular paragraph — handle inline bold and italic
    const html = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

    return (
      <p
        key={i}
        className="text-lg leading-[1.9] text-on-surface-variant mb-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="pt-40 pb-32">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-6 md:px-8 mb-16">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 mb-12 group"
        >
          <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">
            Back to Journal
          </span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
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

        <h1 className="font-serif-brand text-4xl md:text-5xl leading-tight text-on-surface mb-8">
          {article.title}
        </h1>

        <p className="font-headline text-xl italic text-on-surface-variant leading-relaxed">
          {article.excerpt}
        </p>

        <div className="w-16 h-[1px] bg-primary/20 mt-12" />
      </header>

      {/* Body */}
      <section className="max-w-2xl mx-auto px-6 md:px-8 font-body">
        {renderMarkdown(article.content)}
      </section>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-6 md:px-8 mt-24 pt-12 border-t border-outline-variant/10">
        <div className="flex items-center justify-between">
          <Link
            href="/journal"
            className="inline-flex items-center gap-3 group"
          >
            <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-primary border-b border-primary/30 pb-1 group-hover:border-primary transition-all duration-300">
              All Perspectives
            </span>
          </Link>
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/30">
            {article.category}
          </span>
        </div>
      </footer>
    </article>
  );
}
