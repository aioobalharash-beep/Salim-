"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Pagination from "./Pagination";
import { urlFor, type SanityImageSource } from "@/sanity/image";

const ITEMS_PER_PAGE = 20;

export type ProjectImage = SanityImageSource & {
  alt?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
};

export interface ProjectListItem {
  _id: string;
  title: string;
  slug: string | null;
  subtitle: string | null;
  year: string | null;
  coverImage: ProjectImage | null;
}

/* ── Single project card ─────────────────────────────────────────── */
function ProjectCard({ project }: { project: ProjectListItem }) {
  const cover = project.coverImage;
  // urlFor() throws on an image with no uploaded asset; only render once one
  // actually exists, otherwise fall back to the placeholder block.
  const coverAsset = (
    cover as { asset?: { _ref?: string; _id?: string } } | null
  )?.asset;
  const coverReady = !!(coverAsset && (coverAsset._ref || coverAsset._id));
  const dims = cover?.dimensions;
  const renderedWidth = 1200;
  const renderedHeight = dims
    ? Math.round(renderedWidth / dims.aspectRatio)
    : Math.round((renderedWidth * 3) / 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        {/* Image container — transparent bg, artwork never cropped */}
        <div className="overflow-hidden bg-transparent">
          {cover && coverReady ? (
            <Image
              src={urlFor(cover)
                .width(renderedWidth)
                .quality(88)
                .auto("format")
                .url()}
              alt={cover.alt || project.title}
              width={renderedWidth}
              height={renderedHeight}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-foreground/[0.04]" />
          )}
        </div>

        {/* Metadata — left-aligned, directly beneath the image */}
        <div className="pt-5">
          <h2 className="font-headline text-2xl leading-tight text-foreground">
            {project.title}
          </h2>
          {project.subtitle && (
            <p className="mt-1.5 font-body text-sm text-foreground/45">
              {project.subtitle}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

/* ── Paginated grid shell ────────────────────────────────────────── */
export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);

  // Keep the page index in range if the dataset shrinks.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const currentItems = useMemo(() => {
    const lastIndex = safePage * ITEMS_PER_PAGE;
    return projects.slice(lastIndex - ITEMS_PER_PAGE, lastIndex);
  }, [projects, safePage]);

  if (projects.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="py-32 text-center">
          <p className="font-body text-sm text-foreground/30">
            No projects to show yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {currentItems.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="pt-20 pb-4"
      />
    </section>
  );
}
