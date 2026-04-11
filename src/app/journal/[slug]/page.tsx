import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { kvGet } from "@/lib/kv";

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
  const articles = await kvGet<Article[]>("articles", "articles.json");
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

    // Heading ##
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-headline text-[1.75rem] md:text-[2rem] leading-snug mt-20 mb-8 text-[#2C2C2C]"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const text = trimmed.replace(/^> /gm, "");
      const html = text
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      return (
        <blockquote
          key={i}
          className="my-14 mx-0 md:-mx-4 pl-8 md:pl-10 border-l-[2px] border-[#586059]/20 py-1"
        >
          <p
            className="font-headline italic text-xl md:text-[1.4rem] leading-relaxed text-[#586059]/80"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </blockquote>
      );
    }

    // Paragraph — inline bold + italic
    const html = trimmed
      .replace(/\*\*(.+?)\*\*/g, "<strong class='font-medium text-[#2C2C2C]'>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em class='text-[#2C2C2C]/70'>$1</em>");

    return (
      <p
        key={i}
        className="font-body text-[1.05rem] md:text-lg leading-[2] text-[#2C2C2C]/55 mb-7"
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
    <div className="min-h-screen bg-[#F5F5F0]">
      <article className="pt-44 pb-40">
        {/* ── Back Link (subtle, fixed position feel) ── */}
        <div className="max-w-[700px] mx-auto px-6 md:px-8 mb-20">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2.5 group"
          >
            <span className="text-[#586059]/30 group-hover:text-[#586059]/60 group-hover:-translate-x-0.5 transition-all duration-300 text-xs">
              ←
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-[#586059]/30 group-hover:text-[#586059]/60 transition-colors duration-300">
              Journal
            </span>
          </Link>
        </div>

        {/* ── Header ── */}
        <header className="max-w-[700px] mx-auto px-6 md:px-8 mb-20">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-10">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/30">
              {article.date}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#2C2C2C]/10" />
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/30">
              {article.readTime}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#2C2C2C]/10" />
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#586059]/40">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-headline text-4xl md:text-[3.2rem] md:leading-[1.15] text-[#2C2C2C] mb-10">
            {article.title}
          </h1>

          {/* Lede / Excerpt */}
          <p className="font-headline italic text-xl md:text-[1.35rem] leading-relaxed text-[#2C2C2C]/40">
            {article.excerpt}
          </p>

          {/* Divider */}
          <div className="w-12 h-[1px] bg-[#2C2C2C]/10 mt-16" />
        </header>

        {/* ── Body ── */}
        <section className="max-w-[700px] mx-auto px-6 md:px-8">
          {renderMarkdown(article.content)}
        </section>

        {/* ── Article Footer ── */}
        <footer className="max-w-[700px] mx-auto px-6 md:px-8 mt-28 pt-14 border-t border-[#2C2C2C]/[0.04]">
          <div className="flex items-center justify-between">
            <Link
              href="/journal"
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-[#586059]/30 group-hover:text-[#586059]/60 group-hover:-translate-x-0.5 transition-all duration-300 text-xs">
                ←
              </span>
              <span className="font-label text-[10px] uppercase tracking-[0.25em] text-[#586059]/40 group-hover:text-[#586059]/70 transition-colors duration-300">
                All Perspectives
              </span>
            </Link>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/15">
              {article.category}
            </span>
          </div>
        </footer>
      </article>
    </div>
  );
}
