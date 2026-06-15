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

interface VisualArtsData {
  title: string | null;
  subtitle?: string | null;
  blocks?: TrackBlock[] | null;
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

/* ── Page ──────────────────────────────────────────────────────────── */
export default async function VisualArtsPage() {
  let data: VisualArtsData | null = null;
  try {
    data = await client.fetch<VisualArtsData | null>(visualArtsQuery);
  } catch {
    data = null;
  }

  const blocks = data?.blocks ?? [];

  return (
    /*
     * The cinematic track.
     *
     * Desktop (md+): breaks free of vertical scrolling — pinned to the
     * viewport (h-screen) with horizontal momentum scrolling (overflow-x-auto)
     * so artwork streams left-to-right like a graphic-novel preview.
     *
     * Mobile (<md): the media query un-snaps the track back to a tight,
     * high-density vertical column flow, keeping each text block stacked
     * neatly above its respective illustration.
     */
    <main className="w-full md:w-screen min-h-screen md:h-screen overflow-x-hidden overflow-y-auto md:overflow-x-auto md:overflow-y-hidden flex flex-col md:flex-row items-stretch md:items-center bg-[#faf8f5]">
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
    </main>
  );
}
