import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { projectBySlugQuery } from "@/sanity/queries";
import { buildMetadata, type SeoSettings } from "@/sanity/seo";

export const revalidate = 60;

/* ── Types — mirror src/sanity/schemas/project.ts ──────────────────── */
type ProjectImage = SanityImageSource & {
  alt?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number };
};

interface ProjectDetail {
  label: string | null;
  value: string | null;
}

interface Project {
  _id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  year: number | null;
  overview: string | null;
  coverImage: ProjectImage | null;
  gallery: ProjectImage[] | null;
  projectDetails: ProjectDetail[] | null;
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
  const renderedWidth = 1800;
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
      alt={image.alt || ""}
      width={renderedWidth}
      height={renderedHeight}
      sizes={sizes}
      priority={priority}
      className="w-full h-auto object-contain"
    />
  );
}

/* ── Stagger the gallery into alternating full-bleed and 2-up rows.
 *   On mobile every row collapses to a single vertical full-width block. */
type GalleryRow =
  | { kind: "full"; images: [ProjectImage] }
  | { kind: "pair"; images: ProjectImage[] };

function buildGalleryRows(images: ProjectImage[]): GalleryRow[] {
  const rows: GalleryRow[] = [];
  let i = 0;
  let full = true; // start with a full-bleed showcase block

  while (i < images.length) {
    if (full || i === images.length - 1) {
      rows.push({ kind: "full", images: [images[i]] });
      i += 1;
    } else {
      rows.push({ kind: "pair", images: [images[i], images[i + 1]] });
      i += 2;
    }
    full = !full;
  }
  return rows;
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const gallery = (project.gallery ?? []).filter(Boolean);
  const rows = buildGalleryRows(gallery);
  const details = (project.projectDetails ?? []).filter(
    (d) => d?.label && d?.value,
  );

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <article className="max-w-6xl mx-auto px-6 md:px-8">
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

        {/* ── Master Imagery Grid (Artboard case-study mimic) ── */}
        {rows.length > 0 && (
          <section className="mt-16 md:mt-24 space-y-8 md:space-y-12">
            {rows.map((row, idx) =>
              row.kind === "full" ? (
                <div key={idx} className="w-full bg-transparent">
                  <GalleryImage
                    image={row.images[0]}
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    priority={idx === 0}
                  />
                </div>
              ) : (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                >
                  {row.images.map((image, j) => (
                    <div key={j} className="w-full bg-transparent">
                      <GalleryImage
                        image={image}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              ),
            )}
          </section>
        )}

        {/* ── Footer back link ── */}
        <footer className="mt-20 pt-10 border-t border-foreground/[0.08]">
          <Link
            href="/projects"
            className="inline-flex items-center font-label text-[10px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground transition-colors"
          >
            ← All Projects
          </Link>
        </footer>
      </article>
    </div>
  );
}
