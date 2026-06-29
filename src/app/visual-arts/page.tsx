import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import type { PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { visualArtsQuery } from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";

export const revalidate = 60;

/* ── Types — mirror src/sanity/schemas/visualArts.ts ───────────────── */
type ArtworkImage = SanityImageSource & {
  alt?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

type TrackBlock =
  | {
      _key: string;
      _type: "textPanel";
      title: string | null;
      chapterSubtitle?: string | null;
      body?: PortableTextBlock[] | null;
    }
  | {
      _key: string;
      _type: "artworkAsset";
      caption: string | null;
      medium?: string | null;
      tags?: string[] | null;
      image: ArtworkImage | null;
    };

interface PortfolioItem {
  _key: string;
  title: string | null;
  year?: string | null;
  notes?: string | null;
  image: ArtworkImage | null;
}

interface ProjectAnnouncement {
  _key: string;
  eyebrow?: string | null;
  title: string | null;
  body?: PortableTextBlock[] | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
  bannerImage: ArtworkImage | null;
}

interface VisualArtsData {
  title: string | null;
  subtitle?: string | null;
  blocks?: TrackBlock[] | null;
  verticalWorks?: PortfolioItem[] | null;
  squareWorks?: PortfolioItem[] | null;
  landscapeWorks?: PortfolioItem[] | null;
  projectAnnouncements?: ProjectAnnouncement[] | null;
  seo?: SeoSettings | null;
}

/* ── Metadata ──────────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  let data: VisualArtsData | null = null;
  try {
    data = await client.fetch<VisualArtsData | null>(visualArtsQuery);
  } catch {
    data = null;
  }

  return buildMetadata({
    seo: data?.seo,
    fallbackTitle: data?.title || "Visual Arts",
    fallbackDescription:
      data?.subtitle ||
      "An immersive, cinematic stream of comic illustrations, sequential graphic stories, landscapes, and storyboards by Salim Dada.",
    url: "/visual-arts",
  });
}

/* ── Rich-text rendering for the narrative columns ─────────────────── */
const loreComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-[15px] leading-relaxed text-neutral-600 mb-4">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="font-headline text-xl text-neutral-800 mt-6 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-neutral-300 pl-4 italic text-neutral-500 my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-800">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-600 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

/* ── Track panels ──────────────────────────────────────────────────── */
function TextColumn({
  title,
  chapterSubtitle,
  body,
}: {
  title: string | null;
  chapterSubtitle?: string | null;
  body?: PortableTextBlock[] | null;
}) {
  // Desktop: a 450px narrative anchor that fills the vertical band.
  // Mobile (<md): un-snaps to a full-width stacked column.
  return (
    <div className="w-full md:w-auto md:min-w-[450px] h-auto md:h-full flex flex-col justify-center px-8 md:px-12 py-12 md:py-0 border-b md:border-b-0 md:border-r border-neutral-200/50">
      {chapterSubtitle && (
        <span className="font-label text-[11px] uppercase tracking-[0.3em] text-neutral-400 mb-4">
          {chapterSubtitle}
        </span>
      )}
      {title && (
        <h2 className="font-headline text-3xl md:text-4xl leading-tight text-neutral-900 mb-6">
          {title}
        </h2>
      )}
      {body && body.length > 0 && (
        <div className="max-w-[42ch]">
          <PortableText value={body} components={loreComponents} />
        </div>
      )}
    </div>
  );
}

function ArtworkPanel({
  caption,
  medium,
  image,
}: {
  caption: string | null;
  medium?: string | null;
  image: ArtworkImage | null;
}) {
  if (!image) return null;

  const dims = image.dimensions;
  const src = urlFor(image).auto("format").quality(90).url();

  // Desktop: locked to a 65vh height boundary so artwork never clips
  // vertically; width flows naturally. Mobile (<md): full-width column.
  return (
    <figure className="flex flex-col flex-shrink-0 items-center md:items-start w-full md:w-auto px-8 md:px-0 py-8 md:py-0 mx-0 md:mx-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={image.alt || caption || "Artwork"}
        width={dims?.width}
        height={dims?.height}
        loading="lazy"
        className="h-auto md:h-[65vh] w-full md:w-auto max-h-[72vh] object-contain"
      />
      <figcaption className="mt-4 text-center md:text-left">
        {caption && (
          <span className="block font-label text-[11px] uppercase tracking-[0.25em] text-neutral-700">
            {caption}
          </span>
        )}
        {medium && (
          <span className="mt-1 block font-label text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            {medium}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/* ── Section A · Portfolio feed card ───────────────────────────────── */
/**
 * A single format-locked artwork card. The image is composited into a rigid,
 * uniform aspect-ratio wrapper (`aspectClass`) so every card in a row aligns
 * perfectly regardless of the raw source proportions.
 *
 * The Sanity image URL builder is fed an explicit `width`/`height` matching
 * the frame ratio with `.fit("crop")`, which makes the CDN honour the editor's
 * hotspot focal point and crop rectangle — Salim's studio framing is baked
 * into the delivered file, and `object-cover` keeps it flush inside the box.
 */
function PortfolioCard({
  item,
  aspectClass,
  width,
  height,
}: {
  item: PortfolioItem;
  aspectClass: string;
  width: number;
  height: number;
}) {
  if (!item.image) return null;

  const src = urlFor(item.image)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .quality(85)
    .url();
  const meta = [item.year, item.notes].filter(Boolean).join(" · ");

  return (
    <figure className="flex flex-col">
      {/* Bordered box panel — equal padding frames the rigid aspect-ratio
          image wrapper. */}
      <div className="border border-neutral-200 bg-white p-3 md:p-4">
        <div className={`relative ${aspectClass} w-full overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={item.image.alt || item.title || "Artwork"}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Typography panel — sits directly beneath the imagery box. */}
      <figcaption className="pt-3 md:pt-4">
        {item.title && (
          <h3 className="font-headline text-base md:text-lg leading-snug text-neutral-900">
            {item.title}
          </h3>
        )}
        {meta && (
          <p className="mt-1.5 font-label text-[10px] uppercase tracking-[0.2em] text-neutral-400">
            {meta}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/* ── Section A · Format-locked portfolio row ───────────────────────── */
/**
 * One labelled portfolio section that lays its artworks out in a responsive
 * grid, every card sharing the same strict aspect ratio so rows stay aligned.
 */
function PortfolioRow({
  eyebrow,
  heading,
  items,
  aspectClass,
  width,
  height,
  columns,
}: {
  eyebrow: string;
  heading: string;
  items: PortfolioItem[];
  aspectClass: string;
  width: number;
  height: number;
  columns: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <header className="mb-8 md:mb-10">
        <span className="font-label text-[11px] uppercase tracking-[0.4em] text-neutral-400">
          {eyebrow}
        </span>
        <h3 className="mt-3 font-headline text-2xl md:text-3xl leading-tight text-neutral-900">
          {heading}
        </h3>
      </header>

      <div className={`grid ${columns} gap-4 md:gap-6`}>
        {items.map((item) => (
          <PortfolioCard
            key={item._key}
            item={item}
            aspectClass={aspectClass}
            width={width}
            height={height}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Section B · Project announcement card ─────────────────────────── */
function AnnouncementCard({
  announcement,
}: {
  announcement: ProjectAnnouncement;
}) {
  const { eyebrow, title, body, ctaLabel, ctaLink, bannerImage } = announcement;
  const bannerSrc = bannerImage
    ? urlFor(bannerImage).width(1200).auto("format").quality(85).url()
    : null;

  return (
    <article className="border border-neutral-200 bg-white">
      {/* Uniform padding all around the internal card boundary. On mobile the
          banner stacks beneath the copy; on md+ they sit side by side. */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-6 md:p-10">
        {/* Left · narrative promotional text */}
        <div className="flex-1 flex flex-col justify-center">
          {eyebrow && (
            <span className="font-label text-[11px] uppercase tracking-[0.3em] text-neutral-400 mb-4">
              {eyebrow}
            </span>
          )}
          {title && (
            <h3 className="font-headline text-2xl md:text-3xl leading-tight text-neutral-900 mb-4">
              {title}
            </h3>
          )}
          {body && body.length > 0 && (
            <div className="max-w-[52ch]">
              <PortableText value={body} components={loreComponents} />
            </div>
          )}
          {ctaLabel && ctaLink && (
            <a
              href={ctaLink}
              className="mt-6 inline-flex w-fit items-center gap-2 font-label text-[11px] uppercase tracking-[0.25em] text-neutral-900 border-b border-neutral-900/30 pb-1 hover:border-neutral-900 transition-colors"
            >
              {ctaLabel}
              <span aria-hidden>→</span>
            </a>
          )}
        </div>

        {/* Right · optional banner illustration */}
        {bannerSrc && (
          <div className="md:w-2/5 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerSrc}
              alt={bannerImage?.alt || title || "Project banner"}
              loading="lazy"
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default async function VisualArtsPage() {
  let data: VisualArtsData | null = null;
  try {
    data = await client.fetch<VisualArtsData | null>(visualArtsQuery);
  } catch {
    data = null;
  }

  const blocks = data?.blocks ?? [];
  const verticalWorks = data?.verticalWorks ?? [];
  const squareWorks = data?.squareWorks ?? [];
  const landscapeWorks = data?.landscapeWorks ?? [];
  const hasPortfolio =
    verticalWorks.length > 0 ||
    squareWorks.length > 0 ||
    landscapeWorks.length > 0;
  const projectAnnouncements = data?.projectAnnouncements ?? [];

  return (
    /*
     * Root: standard vertical document flow. The horizontal cinematic track is
     * a single full-viewport section at the top; everything below it (the
     * portfolio feed and project announcements) scrolls vertically as normal.
     */
    <div className="bg-[#faf8f5]">
      {/*
       * The cinematic track.
       *
       * Desktop (md+): breaks free of vertical scrolling — pinned to the
       * viewport (h-screen) with horizontal momentum scrolling (overflow-x-auto)
       * so artwork streams left-to-right like a graphic-novel preview.
       *
       * Mobile (<md): the media query un-snaps the track back to a tight,
       * high-density vertical column flow, keeping each text block stacked
       * neatly above its respective illustration.
       */}
      <section className="w-full md:w-screen min-h-screen md:h-screen overflow-x-hidden overflow-y-auto md:overflow-x-auto md:overflow-y-hidden flex flex-col md:flex-row items-stretch md:items-center bg-[#faf8f5]">
      {/* Opening narrative anchor, drawn from the page title + intro. */}
      {(data?.title || data?.subtitle) && (
        <div className="w-full md:w-auto md:min-w-[520px] h-auto md:h-full flex flex-col justify-center px-8 md:px-16 pt-28 pb-12 md:py-0 border-b md:border-b-0 md:border-r border-neutral-200/50">
          <span className="font-label text-[11px] uppercase tracking-[0.4em] text-neutral-400 mb-5">
            Visual Arts
          </span>
          {data?.title && (
            <h1 className="font-headline text-4xl md:text-6xl leading-[1.05] text-neutral-900 mb-6">
              {data.title}
            </h1>
          )}
          {data?.subtitle && (
            <p className="max-w-[44ch] font-body text-base leading-relaxed text-neutral-500">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      {blocks.map((block) =>
        block._type === "textPanel" ? (
          <TextColumn
            key={block._key}
            title={block.title}
            chapterSubtitle={block.chapterSubtitle}
            body={block.body}
          />
        ) : (
          <ArtworkPanel
            key={block._key}
            caption={block.caption}
            medium={block.medium}
            image={block.image}
          />
        ),
      )}

      {/* Empty / unpublished state. */}
      {blocks.length === 0 && !data?.title && (
        <div className="w-full h-full flex items-center justify-center px-8">
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-neutral-400">
            The Visual Arts wing is coming soon.
          </p>
        </div>
      )}

      {/* Trailing breathing room so the last artwork isn't flush to the edge. */}
      {blocks.length > 0 && (
        <div className="hidden md:block flex-shrink-0 w-24" aria-hidden />
      )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
       * Section A · Master Artwork Portfolio Feed
       * Three format-locked rows stacked vertically. Each row pins every
       * card to a strict aspect ratio (portrait 3:4, square 1:1, wide
       * 16:10) so rows align perfectly regardless of the raw source files.
       * Each card frames the illustration inside a bordered box with a
       * typography panel directly beneath.
       * ───────────────────────────────────────────────────────────── */}
      {hasPortfolio && (
        <section className="w-full px-6 md:px-12 py-20 md:py-28 border-t border-neutral-200/60">
          <div className="max-w-screen-2xl mx-auto">
            <header className="mb-12 md:mb-16">
              <span className="font-label text-[11px] uppercase tracking-[0.4em] text-neutral-400">
                Portfolio
              </span>
              <h2 className="mt-4 font-headline text-3xl md:text-5xl leading-tight text-neutral-900">
                Selected Works
              </h2>
            </header>

            <div className="flex flex-col gap-16 md:gap-24">
              {/* Vertical row · portrait studies & sketches (3:4). */}
              <PortfolioRow
                eyebrow="Studies & Sketches"
                heading="Vertical Works"
                items={verticalWorks}
                aspectClass="aspect-[3/4]"
                width={900}
                height={1200}
                columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              />

              {/* Square row · 1:1 graphic tiles. */}
              <PortfolioRow
                eyebrow="Graphic Tiles"
                heading="Square Works"
                items={squareWorks}
                aspectClass="aspect-square"
                width={1000}
                height={1000}
                columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              />

              {/* Landscape row · wide scenery, storyboards & panoramas (16:10). */}
              <PortfolioRow
                eyebrow="Scenery & Storyboards"
                heading="Landscape Works"
                items={landscapeWorks}
                aspectClass="aspect-[16/10]"
                width={1280}
                height={800}
                columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              />
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
       * Section B · Future Project Announcements
       * A vertical stack of large promotional cards. Each splits into a
       * narrative text column and an optional banner illustration, with
       * the graphic stacking beneath the copy on mobile.
       * ───────────────────────────────────────────────────────────── */}
      {projectAnnouncements.length > 0 && (
        <section className="w-full px-6 md:px-12 pb-24 md:pb-32 border-t border-neutral-200/60 pt-20 md:pt-28">
          <div className="max-w-screen-xl mx-auto">
            <header className="mb-10 md:mb-14">
              <span className="font-label text-[11px] uppercase tracking-[0.4em] text-neutral-400">
              
              </span>
              <h2 className="mt-4 font-headline text-3xl md:text-5xl leading-tight text-neutral-900">
                 Projects
              </h2>
            </header>

            <div className="flex flex-col gap-8 md:gap-12">
              {projectAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._key}
                  announcement={announcement}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
