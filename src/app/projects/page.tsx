import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { projectsListQuery } from "@/sanity/queries";
import { buildMetadata } from "@/sanity/seo";
import ProjectsGrid, { type ProjectListItem } from "@/components/ProjectsGrid";

export const revalidate = 60;

const FALLBACK_TITLE = "Projects";
const FALLBACK_DESCRIPTION =
  "A curated archive of projects by Salim Dada — artistic direction, productions, and collaborations.";

async function getProjects(): Promise<ProjectListItem[]> {
  try {
    return (await client.fetch<ProjectListItem[]>(projectsListQuery)) ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    fallbackTitle: FALLBACK_TITLE,
    fallbackDescription: FALLBACK_DESCRIPTION,
    url: "/projects",
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      {/* ── Header ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 mb-12 md:mb-16">
        <p className="font-label text-[10px] uppercase tracking-[0.5em] text-primary/50 mb-5">
          Selected Work
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.1] mb-6">
          Projects
        </h1>
        <p className="font-body text-base leading-relaxed text-foreground/55 max-w-2xl">
          {FALLBACK_DESCRIPTION}
        </p>
      </section>

      <ProjectsGrid projects={projects} />
    </div>
  );
}
