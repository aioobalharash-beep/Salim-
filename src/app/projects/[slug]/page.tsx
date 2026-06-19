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

/* ── Album / Discography block — art + numbered track list with players ── */
function ProjectAlbum({
  album,
}: {
  album: Extract<GalleryItem, { _type: "projectAlbum" }>;
}) {
  const tracks = (album.tracks ?? []).filter((t) => t?.audioUrl);
  const artReady = hasAsset(album.albumArt);

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto my-16 p-6">
      {/* Left — album art in a sharp square bounding box */}
      <div className="w-full lg:w-1/3">
        <div className="aspect-square overflow-hidden shadow-sm bg-on-surface/[0.05]">
          {artReady && album.albumArt && (
            <Image
              src={urlFor(album.albumArt)
                .width(800)
                .height(800)
                .quality(85)
                .auto("format")
                .url()}
              alt={album.albumArt.alt || album.albumTitle || "Album art"}
              width={800}
              height={800}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Right — title, subtitle, numbered track list */}
      <div className="w-full lg:w-2/3">
        {album.albumTitle && (
          <h3 className="font-headline text-xl md:text-2xl text-foreground">
            {album.albumTitle}
          </h3>
        )}
        {album.albumSubtitle && (
          <p className="font-label text-xs uppercase tracking-widest text-foreground/40 mt-1.5 mb-6">
            {album.albumSubtitle}
          </p>
        )}

        {tracks.length > 0 && (
          <ol className="border-t border-foreground/[0.08]">
            {tracks.map((track, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-4 border-b border-foreground/[0.08]"
              >
                <div className="flex items-center gap-4 min-w-0 sm:flex-1">
                  <span className="font-label text-xs tabular-nums text-foreground/40 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-sm md:text-base text-foreground truncate">
                    {track.trackTitle}
                  </span>
                </div>
                {track.audioUrl && (
                  <audio
                    controls
                    preload="none"
                    src={track.audioUrl}
                    className="h-9 w-full sm:w-auto sm:max-w-[260px] sm:ml-auto"
                  />
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
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

        {/* ── Header Hero: title + hero image (left) · credits (right) ── */}
        <header className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8">
            {project.subtitle && (
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-primary/50 mb-5">
                {project.subtitle}
              </p>
            )}
            <h1 className="font-headline font-light text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-foreground">
              {project.title}
            </h1>

            {/* Hero image fills the space under the title, balancing the
                credit lines pinned on the right. */}
            {hasAsset(project.heroImage) && (
              <div className="mt-8 md:mt-10">
                <GalleryImage
                  image={project.heroImage}
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
            )}
          </div>

          {(details.length > 0 || project.year) && (
            <aside className="lg:col-span-4 lg:pt-3">
              <dl className="lg:sticky lg:top-28 grid grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-6 border-t border-foreground/[0.1] pt-6">
                {details.map((detail, idx) => (
                  <div key={idx} className="flex flex-col">
                    <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-1.5">
                      {detail.label}
                    </dt>
                    <dd className="font-body text-sm leading-relaxed text-foreground/75">
                      {detail.value}
                    </dd>
                  </div>
                ))}
                {project.year && (
                  <div className="flex flex-col">
                    <dt className="font-label text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-1.5">
                      Duration
                    </dt>
                    <dd className="font-body text-sm leading-relaxed text-foreground/75 tabular-nums">
                      {project.year}
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
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
