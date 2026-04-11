import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { journalBySlugQuery } from "@/sanity/queries";

export const revalidate = 60;

interface JournalArticle {
  title: string;
  slug: string;
  category: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  body: PortableTextBlock[] | null;
}

async function getArticle(slug: string): Promise<JournalArticle | null> {
  return client.fetch(journalBySlugQuery, { slug });
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
    description: article.excerpt || undefined,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
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
        {/* ── Back Link ── */}
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
          <div className="flex items-center gap-3 mb-10">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/30">
              {formatDate(article.publishedAt)}
            </span>
            {article.category && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-[#2C2C2C]/10" />
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#586059]/40">
                  {article.category}
                </span>
              </>
            )}
          </div>

          <h1 className="font-headline text-4xl md:text-[3.2rem] md:leading-[1.15] text-[#2C2C2C] mb-10">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="font-headline italic text-xl md:text-[1.35rem] leading-relaxed text-[#2C2C2C]/40">
              {article.excerpt}
            </p>
          )}

          <div className="w-12 h-[1px] bg-[#2C2C2C]/10 mt-16" />
        </header>

        {/* ── Body (Portable Text) ── */}
        <section className="max-w-[700px] mx-auto px-6 md:px-8 prose-salim">
          {article.body ? (
            <PortableText
              value={article.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="font-headline text-[1.75rem] md:text-[2rem] leading-snug mt-20 mb-8 text-[#2C2C2C]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-headline text-xl md:text-2xl leading-snug mt-16 mb-6 text-[#2C2C2C]">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-14 mx-0 md:-mx-4 pl-8 md:pl-10 border-l-[2px] border-[#586059]/20 py-1">
                      <p className="font-headline italic text-xl md:text-[1.4rem] leading-relaxed text-[#586059]/80">
                        {children}
                      </p>
                    </blockquote>
                  ),
                  normal: ({ children }) => (
                    <p className="font-body text-[1.05rem] md:text-lg leading-[2] text-[#2C2C2C]/55 mb-7">
                      {children}
                    </p>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-medium text-[#2C2C2C]">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-[#2C2C2C]/70">{children}</em>
                  ),
                },
              }}
            />
          ) : (
            <p className="font-body text-sm text-[#2C2C2C]/30">
              No content yet.
            </p>
          )}
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
            {article.category && (
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#2C2C2C]/15">
                {article.category}
              </span>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
