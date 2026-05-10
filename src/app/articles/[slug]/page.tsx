import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { articlesBySlugQuery } from "@/sanity/queries";

export const revalidate = 60;

interface Article {
  title: string;
  slug: string;
  category: string | null;
  publishedAt: string | null;
  byline: string | null;
  excerpt: string | null;
  featuredImage:
    | (SanityImageSource & {
        alt?: string;
        dimensions?: { width: number; height: number; aspectRatio: number };
      })
    | null;
  body: PortableTextBlock[] | null;
}

async function getArticle(slug: string): Promise<Article | null> {
  return client.fetch(articlesBySlugQuery, { slug });
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
    <div className="min-h-screen bg-background">
      <article className="pt-44 pb-40">
        {/* ── Back Link ── */}
        <div className="max-w-[700px] mx-auto px-6 md:px-8 mb-20">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2.5 group"
          >
            <span className="text-primary/30 group-hover:text-primary/60 group-hover:-translate-x-0.5 transition-all duration-300 text-xs">
              ←
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/30 group-hover:text-primary/60 transition-colors duration-300">
              Articles
            </span>
          </Link>
        </div>

        {/* ── Header ── */}
        <header className="max-w-[700px] mx-auto px-6 md:px-8 mb-16">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-foreground/30">
              {formatDate(article.publishedAt)}
            </span>
            {article.category && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-foreground/10" />
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary/40">
                  {article.category}
                </span>
              </>
            )}
          </div>

          <h1 className="font-headline text-4xl md:text-[3.2rem] md:leading-[1.15] text-foreground mb-6">
            {article.title}
          </h1>

          {article.byline && (
            <p className="font-label text-[12px] md:text-[13px] tracking-[0.08em] text-primary/80 mb-10">
              {article.byline}
            </p>
          )}

          {article.excerpt && (
            <p className="font-headline italic text-xl md:text-[1.35rem] leading-relaxed text-foreground/40 mt-2">
              {article.excerpt}
            </p>
          )}

          <div className="w-12 h-[1px] bg-foreground/10 mt-16" />
        </header>

        {/* ── Featured Image ── constrained to the text column, manual crop honored by Sanity */}
        {article.featuredImage && (() => {
          const dims = article.featuredImage.dimensions;
          const renderedWidth = 1400; // 700px column @ 2x
          const renderedHeight = dims
            ? Math.round(renderedWidth / dims.aspectRatio)
            : Math.round((renderedWidth * 2) / 3);
          return (
            <figure className="max-w-[700px] mx-auto px-6 md:px-8 mb-20">
              <Image
                src={urlFor(article.featuredImage)
                  .width(renderedWidth)
                  .quality(90)
                  .auto("format")
                  .url()}
                alt={article.featuredImage.alt || article.title}
                width={renderedWidth}
                height={renderedHeight}
                sizes="(max-width: 700px) 100vw, 700px"
                priority
                className="w-full h-auto object-contain bg-foreground/[0.04]"
              />
              {article.featuredImage.alt && (
                <figcaption className="font-label text-[10px] uppercase tracking-[0.22em] text-foreground/35 text-center mt-4">
                  {article.featuredImage.alt}
                </figcaption>
              )}
            </figure>
          );
        })()}

        {/* ── Body (Portable Text) ── */}
        <section className="max-w-[700px] mx-auto px-6 md:px-8 prose-salim">
          {article.body ? (
            <PortableText
              value={article.body}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="font-headline text-[1.75rem] md:text-[2rem] leading-snug mt-20 mb-8 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-headline text-xl md:text-2xl leading-snug mt-16 mb-6 text-foreground">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-14 mx-0 md:-mx-4 pl-8 md:pl-10 border-l-[2px] border-primary/20 py-1">
                      <p className="font-headline italic text-xl md:text-[1.4rem] leading-relaxed text-primary/80">
                        {children}
                      </p>
                    </blockquote>
                  ),
                  normal: ({ children }) => (
                    <p className="font-body text-[1.05rem] md:text-lg leading-[2] text-foreground/55 mb-7">
                      {children}
                    </p>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-medium text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-foreground/70">{children}</em>
                  ),
                },
              }}
            />
          ) : (
            <p className="font-body text-sm text-foreground/30">
              No content yet.
            </p>
          )}
        </section>

        {/* ── Article Footer ── */}
        <footer className="max-w-[700px] mx-auto px-6 md:px-8 mt-28 pt-14 border-t border-foreground/[0.04]">
          <div className="flex items-center justify-between">
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-primary/30 group-hover:text-primary/60 group-hover:-translate-x-0.5 transition-all duration-300 text-xs">
                ←
              </span>
              <span className="font-label text-[10px] uppercase tracking-[0.25em] text-primary/40 group-hover:text-primary/70 transition-colors duration-300">
                All Perspectives
              </span>
            </Link>
            {article.category && (
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-foreground/15">
                {article.category}
              </span>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
}
