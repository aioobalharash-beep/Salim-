import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText, type PortableTextBlock } from "next-sanity";
import type { PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { projectBySlugQuery } from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";
import ProjectContactBar from "@/components/ProjectContactBar";
import ProjectImageSlider from "@/components/ProjectImageSlider";
import ProjectYouTube from "@/components/ProjectYouTube";
import ProjectAlbumBlock from "@/components/ProjectAlbumBlock";

export const revalidate = 60;

/* ── Types — mirror src/sanity/schemas/project.ts ──────────────────── */
type ProjectImage = SanityImageSource & {
  alt?: string | null;
  title?: string | null;
  description?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

interface ProjectDetail {
  label: string | null;
  value: string | null;
}

/* Gallery rows are a discriminated union keyed on `_type`. Image, YouTube,
 * and uploaded video each share optional title/description for the editorial
 * left column. */
type GalleryItem =
  | ({ _key: string; _type: "galleryImage" } & ProjectImage)
  | {
      _key: string;
      _type: "imageGroup";
      images: ProjectImage[] | null;
      title?: string | null;
      description?: string | null;
    }
  | {
      _key: string;
      _type: "youtube";
      url: string | null;
      startTime?: number | null;
      title?: string | null;
      description?: string | null;
    }
  | {
      _key: string;
      _type: "videoFile";
      videoUrl: string | null;
      title?: string | null;
      description?: string | null;
    }
  | {
      _key: string;
      _type: "projectAlbum";
      albumTitle: string | null;
      albumSubtitle?: string | null;
      albumArt?: ProjectImage | null;
      tracks?: { trackTitle: string | null; audioUrl: string | null }[] | null;
    };

interface Project {
  _id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  year: string | null;
  overview: string | null;
  coverImage: ProjectImage | null;
  heroImage: ProjectImage | null;
  gallery: GalleryItem[] | null;
  projectDetails: ProjectDetail[] | null;
  footerText: PortableTextBlock[] | null;
  showContactBar: boolean | null;
  contactBarText: string | null;
  contactButtonLabel: string | null;
  seo?: SeoSettings | null;
}

async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(projectBySlugQuery, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Not Found" };

  return buildMetadata({
    seo: project.seo,
    fallbackTitle: project.title,
    fallbackDescription: project.overview,
    fallbackImage: project.coverImage,
    url: `/projects/${project.slug}`,
    type: "article",
  });
}

/* Extract a YouTube video id from any common URL shape. */
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

/* A Sanity image is only renderable once an asset has actually been uploaded.
 * urlFor() throws on a sourceless image, which would crash the whole server
 * render — so guard every image path against empty/partial blocks. */
function hasAsset(img?: ProjectImage | null): img is ProjectImage {
  const asset = (img as { asset?: { _ref?: string; _id?: string } } | null)
    ?.asset;
  return !!(asset && (asset._ref || asset._id));
}

/* ── Single uncropped gallery image ────────────────────────────────── */
function GalleryImage({
  image,
  sizes,
  priority,
}: {
  image: ProjectImage;
  sizes: string;
  priority?: boolean;
}) {
  if (!hasAsset(image)) return null;

  const dims = image.dimensions;
  const renderedWidth = 1600;
  const renderedHeight = dims
    ? Math.round(renderedWidth / dims.aspectRatio)
    : Math.round((renderedWidth * 2) / 3);

  return (
    <Image
      src={urlFor(image)
        .width(renderedWidth)
        .quality(90)
        .auto("format")
        .url()}
      alt={image.alt || image.title || ""}
      width={renderedWidth}
      height={renderedHeight}
      sizes={sizes}
      priority={priority}
      className="w-full h-auto object-contain"
    />
  );
}

/* ── Caption shown directly beneath a standalone media block ────────── */
function MediaCaption({
  title,
  description,
}: {
  title?: string | null;
  description?: string | null;
}) {
  if (!title && !description) return null;
  return (
    <div className="max-w-2xl mx-auto mt-6 text-center">
      {title && (
        <h2 className="font-headline text-2xl md:text-3xl text-foreground mb-3">
          {title}
        </h2>
      )}
      {description && (
        <p className="font-body text-base md:text-lg leading-relaxed text-foreground/60 whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  );
}

/* ── Bare media element — image, YouTube embed, or local video player ── */
function StandaloneMediaElement({
  item,
  priority,
}: {
  item: GalleryItem;
  priority?: boolean;
}) {
  if (item._type === "youtube") {
    const id = getYouTubeId(item.url || "");
    if (!id) return null;
    return (
      <ProjectYouTube id={id} start={item.startTime} title={item.title} />
    );
  }

  if (item._type === "videoFile") {
    if (!item.videoUrl) return null;
    // Stable 16:9 box + playsInline so iOS plays inline; the `#t=0.1` media
    // fragment makes iOS render the first frame as a poster instead of a
    // blank black box.
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-on-surface">
        <video
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain"
          src={`${item.videoUrl}#t=0.1`}
        />
      </div>
    );
  }

  // imageGroup and projectAlbum are handled by GalleryBlock; only the single
  // galleryImage remains here.
  if (item._type === "imageGroup" || item._type === "projectAlbum") return null;

  return (
    <GalleryImage
      image={item}
      priority={priority}
      sizes="(max-width: 896px) 100vw, 896px"
    />
  );
}

/* ── Album / Discography block — uses the shared AudioPlayer via a client
      child so the player is identical to the Discography page. ────────── */
function ProjectAlbum({
  album,
}: {
  album: Extract<GalleryItem, { _type: "projectAlbum" }>;
}) {
  const artUrl = hasAsset(album.albumArt)
    ? urlFor(album.albumArt)
        .width(800)
        .height(800)
        .quality(85)
        .auto("format")
        .url()
    : null;
  const artAlt = album.albumArt?.alt || album.albumTitle || "Album art";
  const tracks = (album.tracks ?? []).map((t) => ({
    trackTitle: t?.trackTitle ?? null,
    audioUrl: t?.audioUrl ?? null,
  }));

  return (
    <ProjectAlbumBlock
      albumTitle={album.albumTitle}
      albumSubtitle={album.albumSubtitle}
      artUrl={artUrl}
      artAlt={artAlt}
      tracks={tracks}
    />
  );
}

/* ── One gallery block — centered standalone media + caption, or the
      symmetrical coverflow carousel for a multi-image group. ────────── */
function GalleryBlock({
  item,
  priority,
}: {
  item: GalleryItem;
  priority?: boolean;
}) {
  // Discography block — its own full-width split layout.
  if (item._type === "projectAlbum") {
    return <ProjectAlbum album={item} />;
  }

  if (item._type === "imageGroup") {
    const imgs = (item.images ?? []).filter(hasAsset);
    if (imgs.length === 0) return null;
    // Multiple images → premium symmetrical coverflow with reactive caption.
    if (imgs.length > 1) {
      return <ProjectImageSlider images={imgs} />;
    }
    // Single image keeps the centered, uncropped standalone display.
    const only = imgs[0];
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <GalleryImage
          image={only}
          priority={priority}
          sizes="(max-width: 896px) 100vw, 896px"
        />
        <MediaCaption
          title={only.title ?? item.title}
          description={only.description ?? item.description}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
      <div className="w-full">
        <StandaloneMediaElement item={item} priority={priority} />
      </div>
      <MediaCaption title={item.title} description={item.description} />
    </div>
  );
}

/* ── Footer rich-text components — understated typography ───────────── */
const footerComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base md:text-lg leading-relaxed text-foreground/55 text-justify mb-5">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="font-headline text-xl text-foreground mt-8 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-foreground/80">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const blank = (value as { blank?: boolean })?.blank;
      return (
        <a
          href={(value as { href?: string })?.href || "#"}
          target={blank ? "_blank" : undefined}
          rel={blank ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

/* ── Project credits — an understated horizontal meta bar. Sits beneath the
      hero image (or directly under the title when no image is set) so it never
      competes with the media for width or height. ────────────────────────── */
function ProjectCredits({
  details,
  year,
}: {
  details: ProjectDetail[];
  year: string | null;
}) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-7 border-t border-foreground/[0.1] pt-7">
      {details.map((detail, idx) => (
        <div key={idx} className="flex flex-col">
          <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
            {detail.label}
          </dt>
          <dd className="font-body text-sm leading-relaxed text-foreground/75">
            {detail.value}
          </dd>
        </div>
      ))}
      {year && (
        <div className="flex flex-col">
          <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-2">
            Dates
          </dt>
          <dd className="font-body text-sm leading-relaxed text-foreground/75 tabular-nums">
            {year}
          </dd>
        </div>
      )}
    </dl>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const gallery = (project.gallery ?? []).filter(Boolean);
  const details = (project.projectDetails ?? []).filter(
    (d) => d?.label && d?.value,
  );
  const hasFooterText =
    Array.isArray(project.footerText) && project.footerText.length > 0;
  const hasHero = hasAsset(project.heroImage);
  const hasCredits = details.length > 0 || Boolean(project.year);
  // Aspect drives how the hero image is framed below the masthead: wide/
  // landscape art spans the full column, while square or portrait art is
  // height-capped and centered so it reads as balanced instead of leaving a
  // lone gap on one side.
  const heroAspect = project.heroImage?.dimensions?.aspectRatio ?? 1.5;
  const heroIsWide = heroAspect >= 1.15;

  return (
    <div className="min-h-screen bg-background pt-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
        {/* ── Back link ── */}
        <Link
          href="/projects"
          className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
        >
          ← Projects
        </Link>

        {/* ── Header Hero — a calm, stacked editorial masthead: eyebrow +
              title, then the image as the dominant element, then an
              understated credits bar. Nothing flanks the image, so there is no
              aspect-driven gap beside it and no credit column that can outrun
              its height. Landscape art spans full width; square / portrait art
              is capped and centered so its whitespace reads as composed. ── */}
        <header className="mt-10 md:mt-14 max-w-7xl mx-auto">
          <div className="max-w-4xl">
            {project.subtitle && (
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/50 mb-5">
                {project.subtitle}
              </p>
            )}
            <h1 className="font-headline font-light text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-foreground text-balance">
              {project.title}
            </h1>
          </div>

          {hasHero && (
            <figure
              className={`mt-8 md:mt-12 w-full ${
                heroIsWide ? "" : "max-w-2xl mx-auto"
              }`}
            >
              <GalleryImage
                image={project.heroImage!}
                sizes={
                  heroIsWide
                    ? "(max-width: 1280px) 100vw, 1216px"
                    : "(max-width: 672px) 100vw, 672px"
                }
                priority
              />
            </figure>
          )}

          {hasCredits && (
            <div className="mt-10 md:mt-12">
              <ProjectCredits details={details} year={project.year} />
            </div>
          )}
        </header>

        {/* ── Overview — full-width, formally justified ── */}
        {project.overview && (
          <section className="mt-16 md:mt-20">
            <p className="font-headline font-light text-base md:text-lg leading-relaxed text-foreground/70 text-justify whitespace-pre-line [text-indent:1.5em]">
              {project.overview}
            </p>
          </section>
        )}

        {/* ── Media — centered standalone blocks + coverflow galleries ── */}
        {gallery.length > 0 && (
          <section className="mt-20 md:mt-28 space-y-24 md:space-y-32">
            {gallery.map((item, idx) => (
              <GalleryBlock key={item._key} item={item} priority={idx === 0} />
            ))}
          </section>
        )}

        {/* ── Closing block: footer notes (full-width, justified) + back
              link, anchored together as definitive end matter. ── */}
        <footer className="mt-20 md:mt-28 pt-10 border-t border-foreground/[0.08]">
          {hasFooterText && (
            <div className="w-full mb-10 md:mb-12">
              <PortableText
                value={project.footerText!}
                components={footerComponents}
              />
            </div>
          )}
          <Link
            href="/projects"
            className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
          >
            ← All Projects
          </Link>
        </footer>
      </div>

      {/* ── Conditional full-width Contact Bar ── */}
      {project.showContactBar && (
        <ProjectContactBar
          projectTitle={project.title}
          text={project.contactBarText}
          buttonLabel={project.contactButtonLabel}
        />
      )}
    </div>
  );
}
