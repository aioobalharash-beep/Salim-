import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import type { PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { articlesBySlugQuery } from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";

export const revalidate = 60;

/* ────────────────────────────────────────────────────────────────────────
 * Types — mirror the Sanity schema in src/sanity/schemas/articles.ts
 * ──────────────────────────────────────────────────────────────────────── */

interface BylineDetails {
  authorName?: string | null;
  authorRole?: string | null;
  publicationCredit?: string | null;
}

/* Captions and credits can be either a plain string (legacy) or a
 * Portable Text array (current). The renderer accepts both. */
type RichOrString = string | PortableTextBlock[];

type SanityImageWithMeta = SanityImageSource & {
  alt?: string;
  caption?: RichOrString;
  credit?: RichOrString;
  size?: "column" | "wide" | "full";
  dimensions?: { width: number; height: number; aspectRatio: number };
};

interface YouTubeBlock {
  url: string;
  caption?: RichOrString;
  credit?: RichOrString;
  size?: "column" | "wide" | "full";
  embedMode?: "thumbnail" | "iframe";
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(embed|shorts|v)\/([^/?#]+)/);
      if (m) return m[2];
    }
  } catch {
    /* fall through */
  }
  return null;
}

function renderRichOrString(value: RichOrString | undefined) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value} components={inlineRichComponents} />;
}

function FigureCaption({
  caption,
  credit,
}: {
  caption?: RichOrString;
  credit?: RichOrString;
}) {
  const hasCaption =
    typeof caption === "string"
      ? caption.length > 0
      : Array.isArray(caption) && caption.length > 0;
  const hasCredit =
    typeof credit === "string"
      ? credit.length > 0
      : Array.isArray(credit) && credit.length > 0;
  if (!hasCaption && !hasCredit) return null;
  return (
    <figcaption>
      {hasCaption && <span className="ed-caption">{renderRichOrString(caption)}</span>}
      {hasCredit && <span className="ed-credit">{renderRichOrString(credit)}</span>}
    </figcaption>
  );
}

interface Article {
  title: string;
  richTitle?: PortableTextBlock[] | null;
  slug: string;
  category: string | null;
  eyebrowTags?: string[] | null;
  publishedAt: string | null;
  readingTimeMinutes?: number | null;
  byline: string | null;
  bylineDetails?: BylineDetails | null;
  deck?: PortableTextBlock[] | null;
  excerpt: string | null;
  showHeroOrnament?: boolean | null;
  accentColor?: string | null;
  showTableOfContents?: boolean | null;
  featuredImage: SanityImageWithMeta | null;
  body: PortableTextBlock[] | null;
  seo?: SeoSettings | null;
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
  return buildMetadata({
    seo: article.seo,
    fallbackTitle: article.title,
    fallbackDescription: article.excerpt,
    fallbackImage: article.featuredImage,
    url: `/articles/${article.slug}`,
    type: "article",
  });
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* Slugify section headings for anchor ids. */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* Extract plain text from a Portable Text block (for anchors / TOC). */
function blockToPlainText(block: PortableTextBlock): string {
  if (!block || !Array.isArray((block as any).children)) return "";
  return (block as any).children
    .map((c: any) => (typeof c?.text === "string" ? c.text : ""))
    .join("");
}

/* ────────────────────────────────────────────────────────────────────────
 * Inline mark / annotation components — shared across PT renderers.
 * ──────────────────────────────────────────────────────────────────────── */

const sharedMarks: PortableTextComponents["marks"] = {
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  underline: ({ children }) => (
    <span style={{ textDecoration: "underline" }}>{children}</span>
  ),
  smallCaps: ({ children }) => <span className="small-caps">{children}</span>,
  color: ({ value, children }) => (
    <span style={{ color: value?.value || undefined }}>{children}</span>
  ),
  lang: ({ value, children }) => (
    <span lang={value?.code || undefined}>{children}</span>
  ),
  link: ({ value, children }) => {
    const target = value?.openInNewTab ? "_blank" : undefined;
    const rel =
      value?.rel ??
      (value?.openInNewTab ? "noopener noreferrer" : undefined);
    return (
      <a href={value?.href || "#"} target={target} rel={rel}>
        {children}
      </a>
    );
  },
  footnoteRef: ({ value, children }) => (
    <sup className="fn-marker">
      <a href={`#fn-${value?.number}`} id={`fnref-${value?.number}`}>
        {children}
        {value?.number}
      </a>
    </sup>
  ),
};

/* Minimal PT components for short rich-text fields (deck, title, etc.) */
const inlineRichComponents: PortableTextComponents = {
  marks: sharedMarks,
  block: {
    normal: ({ children }) => <>{children}</>,
  },
};

/* ────────────────────────────────────────────────────────────────────────
 * Custom block renderers used inside the article body.
 * ──────────────────────────────────────────────────────────────────────── */

function ComposerVoice({ value }: { value: any }) {
  return (
    <aside className="composer-voice">
      <PortableText value={value.body} components={inlineRichComponents} />
      {value.attribution && (
        <span className="attribution">{value.attribution}</span>
      )}
    </aside>
  );
}

function Timeline({ value }: { value: any }) {
  const items: Array<{ date: string; text: PortableTextBlock[] }> =
    value.items || [];
  return (
    <div className="timeline">
      {value.title && <div className="timeline-title">{value.title}</div>}
      {items.map((item, i) => (
        <div className="timeline-item" key={i}>
          <div className="timeline-date">{item.date}</div>
          <div className="timeline-text">
            <PortableText value={item.text} components={inlineRichComponents} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Factbox({ value }: { value: any }) {
  return (
    <aside className="factbox">
      {value.label && <div className="factbox-label">{value.label}</div>}
      {value.title && <div className="factbox-title">{value.title}</div>}
      {value.intro && <p>{value.intro}</p>}
      {Array.isArray(value.items) &&
        value.items.map((item: any, i: number) => (
          <p key={i}>
            {item.term && <strong>{item.term}</strong>}
            {item.term && item.description ? " — " : null}
            {item.description}
          </p>
        ))}
    </aside>
  );
}

function TwoColumn({ value }: { value: any }) {
  return (
    <div className="twocol">
      <div className="twocol-col">
        {value.leftLabel && <h3>{value.leftLabel}</h3>}
        <PortableText
          value={value.leftBody}
          components={inlineRichComponents}
        />
      </div>
      <div className="twocol-col">
        {value.rightLabel && <h3>{value.rightLabel}</h3>}
        <PortableText
          value={value.rightBody}
          components={inlineRichComponents}
        />
      </div>
    </div>
  );
}

function PullQuote({ value }: { value: any }) {
  return (
    <blockquote className="pullquote">
      <p>{value.quote}</p>
      {value.attribution && <footer>{value.attribution}</footer>}
    </blockquote>
  );
}

function AuthorNote({ value }: { value: any }) {
  return (
    <div className="author-note">
      <PortableText value={value.body} components={inlineRichComponents} />
    </div>
  );
}

function Divider({ value }: { value: any }) {
  const style = value?.style || "fleuron";
  if (style === "thin") return <hr className="ed-divider ed-divider--thin" />;
  if (style === "gradient")
    return <hr className="ed-divider ed-divider--gradient" />;
  return (
    <div className={`ed-divider ed-divider--${style}`} aria-hidden>
      {style === "dots" ? "• • •" : "❧"}
    </div>
  );
}

function BodyImage({ value }: { value: SanityImageWithMeta }) {
  if (!value) return null;
  const dims = value.dimensions;
  const renderedWidth = 1600;
  const renderedHeight = dims
    ? Math.round(renderedWidth / dims.aspectRatio)
    : Math.round((renderedWidth * 2) / 3);
  const size = value.size || "column";
  return (
    <figure className={`ed-figure ${size}`}>
      <Image
        src={urlFor(value)
          .width(renderedWidth)
          .quality(88)
          .auto("format")
          .url()}
        alt={value.alt || ""}
        width={renderedWidth}
        height={renderedHeight}
        sizes={
          size === "full"
            ? "100vw"
            : size === "wide"
              ? "(max-width: 900px) 100vw, 900px"
              : "(max-width: 820px) 100vw, 720px"
        }
      />
      <FigureCaption caption={value.caption} credit={value.credit} />
    </figure>
  );
}

/* Quick plain-text extraction from a rich-or-string value (used for
 * alt / title / aria-label attributes where markup isn't allowed). */
function richToPlainText(value: RichOrString | undefined): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value
    .map((b: any) =>
      Array.isArray(b?.children)
        ? b.children.map((c: any) => c?.text ?? "").join("")
        : "",
    )
    .join(" ")
    .trim() || undefined;
}

function YouTubeEmbed({ value }: { value: YouTubeBlock }) {
  const id = getYouTubeId(value?.url || "");
  if (!id) return null;
  const size = value.size || "column";
  const mode = value.embedMode || "thumbnail";
  const captionText = richToPlainText(value.caption);
  return (
    <figure className={`ed-figure ${size}`}>
      {mode === "iframe" ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={captionText || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <a
          className="ed-youtube"
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={captionText || "Watch on YouTube"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt={captionText || "YouTube thumbnail"}
            loading="lazy"
          />
          <span className="ed-yt-play" aria-hidden />
        </a>
      )}
      <FigureCaption caption={value.caption} credit={value.credit} />
    </figure>
  );
}

function Footnotes({ value }: { value: any }) {
  const items: Array<{ number: number; text: PortableTextBlock[] }> =
    value.items || [];
  return (
    <section className="ed-footnotes">
      <h4>Footnotes</h4>
      <ol>
        {items.map((fn, i) => (
          <li key={i} id={`fn-${fn.number}`}>
            <span className="fn-num">{fn.number}.</span>
            <PortableText value={fn.text} components={inlineRichComponents} />{" "}
            <a href={`#fnref-${fn.number}`} aria-label="Back to text">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Body PortableText components.
 * ──────────────────────────────────────────────────────────────────────── */

function buildBodyComponents(): PortableTextComponents {
  return {
    marks: sharedMarks,
    block: {
      normal: ({ children }) => <p>{children}</p>,
      lead: ({ children }) => <p className="lead">{children}</p>,
      caption: ({ children }) => <p className="caption">{children}</p>,
      alignCenter: ({ children }) => (
        <p style={{ textAlign: "center" }}>{children}</p>
      ),
      alignRight: ({ children }) => (
        <p style={{ textAlign: "right" }}>{children}</p>
      ),
      h2: ({ children, value }) => {
        const id = slugify(blockToPlainText(value));
        return <h2 id={id}>{children}</h2>;
      },
      h2Italic: ({ children, value }) => {
        const id = slugify(blockToPlainText(value));
        return (
          <h2 id={id} className="h2-italic">
            {children}
          </h2>
        );
      },
      h3: ({ children }) => <h3>{children}</h3>,
      h3Eyebrow: ({ children }) => <h3 className="h3-eyebrow">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="pullquote">
          <p>{children}</p>
        </blockquote>
      ),
    },
    types: {
      bodyImage: BodyImage as any,
      youtube: YouTubeEmbed as any,
      composerVoice: ComposerVoice as any,
      timeline: Timeline as any,
      factbox: Factbox as any,
      twoColumn: TwoColumn as any,
      pullQuote: PullQuote as any,
      authorNote: AuthorNote as any,
      divider: Divider as any,
      footnotes: Footnotes as any,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const featuredImageUrl = article.featuredImage
    ? urlFor(article.featuredImage).width(1200).url()
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo?.metaDescription || article.excerpt || undefined,
    image: featuredImageUrl ? [featuredImageUrl] : undefined,
    datePublished: article.publishedAt || undefined,
    author: {
      "@type": "Person",
      name: article.bylineDetails?.authorName || "Salim Dada",
      url: "/about",
    },
    articleSection: article.category || undefined,
    keywords: article.seo?.keywords?.join(", ") || undefined,
  };

  // Build TOC from H2 / H2-italic blocks if enabled.
  const tocEntries =
    article.showTableOfContents && Array.isArray(article.body)
      ? article.body
          .filter(
            (b: any) =>
              b?._type === "block" &&
              (b.style === "h2" || b.style === "h2Italic"),
          )
          .map((b: any) => {
            const text = blockToPlainText(b);
            return { id: slugify(text), text };
          })
          .filter((e) => e.id && e.text)
      : [];

  const eyebrowParts = [
    ...(article.eyebrowTags && article.eyebrowTags.length
      ? article.eyebrowTags
      : article.category
        ? [article.category]
        : []),
  ];

  const styleVars = article.accentColor
    ? ({ ["--ed-accent" as any]: article.accentColor } as React.CSSProperties)
    : undefined;

  return (
    <div className="editorial min-h-screen" style={styleVars}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="editorial-top-ornament" />

      <article className="pt-28 pb-24">
        {/* ── Back Link ── */}
        <div className="editorial-hero" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Link
            href="/articles"
            className="editorial-sans"
            style={{
              textDecoration: "none",
              fontSize: "0.7rem",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "var(--ed-warm-grey)",
            }}
          >
            ← Articles
          </Link>
        </div>

        {/* ── Hero ── */}
        <section className="editorial-hero">
          {article.showHeroOrnament !== false && (
            <span className="editorial-fleuron" aria-hidden>
              ❧
            </span>
          )}

          {eyebrowParts.length > 0 && (
            <div className="editorial-eyebrow">
              {eyebrowParts.join("  ·  ")}
            </div>
          )}

          <h1 className="editorial-title">
            {article.richTitle && article.richTitle.length > 0 ? (
              <PortableText
                value={article.richTitle}
                components={inlineRichComponents}
              />
            ) : (
              article.title
            )}
          </h1>

          {article.deck && article.deck.length > 0 ? (
            <div className="editorial-deck">
              <PortableText
                value={article.deck}
                components={inlineRichComponents}
              />
            </div>
          ) : article.excerpt ? (
            <p className="editorial-deck">{article.excerpt}</p>
          ) : null}

          {(article.bylineDetails?.authorName ||
            article.bylineDetails?.authorRole ||
            article.bylineDetails?.publicationCredit ||
            article.byline ||
            article.publishedAt) && (
            <p className="editorial-byline">
              {article.bylineDetails?.authorName ? (
                <strong>{article.bylineDetails.authorName}</strong>
              ) : null}
              {article.bylineDetails?.authorRole && (
                <>
                  {" "}
                  &nbsp;·&nbsp; {article.bylineDetails.authorRole}
                </>
              )}
              {article.publishedAt && (
                <>
                  {" "}
                  &nbsp;·&nbsp; {formatDate(article.publishedAt)}
                </>
              )}
              {article.readingTimeMinutes ? (
                <>
                  {" "}
                  &nbsp;·&nbsp; {article.readingTimeMinutes} min read
                </>
              ) : null}
              {article.bylineDetails?.publicationCredit && (
                <>
                  <br />
                  {article.bylineDetails.publicationCredit}
                </>
              )}
              {!article.bylineDetails?.authorName && article.byline ? (
                <span>{article.byline}</span>
              ) : null}
            </p>
          )}
        </section>

        {/* ── Featured Image ── */}
        {article.featuredImage &&
          (() => {
            const dims = article.featuredImage.dimensions;
            const renderedWidth = 1600;
            const renderedHeight = dims
              ? Math.round(renderedWidth / dims.aspectRatio)
              : Math.round((renderedWidth * 2) / 3);
            return (
              <figure className="ed-figure" style={{ maxWidth: 820, margin: "0 auto", padding: "0 2.5rem" }}>
                <Image
                  src={urlFor(article.featuredImage)
                    .width(renderedWidth)
                    .quality(90)
                    .auto("format")
                    .url()}
                  alt={article.featuredImage.alt || article.title}
                  width={renderedWidth}
                  height={renderedHeight}
                  sizes="(max-width: 820px) 100vw, 820px"
                  priority
                />
                <FigureCaption
                  caption={article.featuredImage.caption}
                  credit={article.featuredImage.credit}
                />
              </figure>
            );
          })()}

        {/* ── Optional TOC ── */}
        {tocEntries.length > 0 && (
          <nav className="ed-toc" aria-label="Table of contents">
            <div className="ed-toc-title">Contents</div>
            <ol>
              {tocEntries.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ── Body ── */}
        <section className="editorial-body">
          {article.body ? (
            <PortableText
              value={article.body}
              components={buildBodyComponents()}
            />
          ) : (
            <p style={{ color: "var(--ed-warm-grey)" }}>No content yet.</p>
          )}
        </section>

        {/* ── Footer / back link ── */}
        <footer
          className="editorial-hero"
          style={{
            paddingTop: "2rem",
            paddingBottom: "2rem",
            borderTop: "1px solid var(--ed-rule)",
          }}
        >
          <Link
            href="/articles"
            className="editorial-sans"
            style={{
              textDecoration: "none",
              fontSize: "0.7rem",
              fontWeight: 300,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "var(--ed-warm-grey)",
            }}
          >
            ← All Articles
          </Link>
          {article.category && (
            <span
              className="editorial-sans"
              style={{
                float: "right",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--ed-warm-grey)",
              }}
            >
              {article.category}
            </span>
          )}
        </footer>
      </article>
    </div>
  );
}
