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
    };

interface Project {
  _id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  year: number | null;
  overview: string | null;
  coverImage: ProjectImage | null;
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

/* ── Media renderer — image, YouTube embed, or local video player ──── */
function GalleryMedia({
  item,
  priority,
}: {
  item: GalleryItem;
  priority?: boolean;
}) {
  if (item._type === "youtube") {
    const id = getYouTubeId(item.url || "");
    if (!id) return null;
    const start =
      typeof item.startTime === "number" && item.startTime > 0
        ? Math.floor(item.startTime)
        : null;
    const src = `https://www.youtube-nocookie.com/embed/${id}${
      start ? `?start=${start}` : ""
    }`;
    return (
      <div className="relative w-full aspect-video overflow-hidden bg-on-surface/5">
        <iframe
          src={src}
          title={item.title || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (item._type === "videoFile") {
    if (!item.videoUrl) return null;
    return (
      <video
        controls
        preload="metadata"
        className="w-full h-auto bg-on-surface/5"
        src={item.videoUrl}
      />
    );
  }

  return (
    <GalleryImage
      image={item}
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  );
}

/* ── Footer rich-text components — understated typography ───────────── */
const footerComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-sm md:text-[15px] leading-relaxed text-foreground/55 mb-4">
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
      <article className="max-w-6xl mx-auto px-6 md:px-8 pb-24">
        {/* ── Back link ── */}
        <Link
          href="/projects"
          className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
        >
          ← Projects
        </Link>

        {/* ── Header Hero: title + pinned details sidebar ── */}
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
                      Year
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

        {/* ── Overview ── */}
        {project.overview && (
          <section className="mt-16 md:mt-20 max-w-3xl">
            <p className="font-headline font-light text-xl sm:text-2xl leading-[1.6] text-foreground/70 whitespace-pre-line">
              {project.overview}
            </p>
          </section>
        )}

        {/* ── Multimedia Gallery — asymmetrical content/media rows ── */}
        {gallery.length > 0 && (
          <section className="mt-20 md:mt-28 space-y-20 md:space-y-28">
            {gallery.map((item, idx) => {
              const hasText = !!(item.title || item.description);
              return (
                <div
                  key={item._key}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                >
                  {/* Content — below media on mobile, left on desktop.
                      When there is no title the description sits at the top
                      and fills the space on its own. */}
                  <div
                    className={`order-2 lg:order-1 ${
                      hasText ? "" : "hidden lg:block"
                    }`}
                  >
                    {item.title && (
                      <h2 className="font-headline font-light text-3xl md:text-4xl leading-tight text-foreground mb-5">
                        {item.title}
                      </h2>
                    )}
                    {item.description && (
                      <p className="font-body text-base leading-relaxed text-foreground/60 whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Media — above text on mobile, right on desktop. */}
                  <div className="order-1 lg:order-2 w-full bg-transparent">
                    <GalleryMedia item={item} priority={idx === 0} />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ── Project Footer ── */}
        {hasFooterText && (
          <section className="mt-20 md:mt-28 pt-10 border-t border-foreground/[0.08] max-w-3xl">
            <PortableText
              value={project.footerText!}
              components={footerComponents}
            />
          </section>
        )}

        {/* ── Back link ── */}
        <footer className="mt-20 pt-10 border-t border-foreground/[0.08]">
          <Link
            href="/projects"
            className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
          >
            ← All Projects
          </Link>
        </footer>
      </article>

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
