import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";

const SITE_URL = "https://salimdada.net";

type SlugRow = { slug: string; _updatedAt: string };

const articleSlugsQuery = groq`
  *[_type == "articles" && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    _updatedAt
  }
`;

const catalogueSlugsQuery = groq`
  *[_type == "catalogue" && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    _updatedAt
  }
`;

const servicePageSlugsQuery = groq`
  *[_type == "servicePage" && defined(slug.current) && !(_id in path("drafts.**"))]{
    "slug": slug.current,
    _updatedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/catalogue`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/media/reviews`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms-and-privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const [articles, catalogue, servicePages] = await Promise.all([
    client.fetch<SlugRow[]>(articleSlugsQuery),
    client.fetch<SlugRow[]>(catalogueSlugsQuery),
    client.fetch<SlugRow[]>(servicePageSlugsQuery),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a._updatedAt ? new Date(a._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const catalogueRoutes: MetadataRoute.Sitemap = (catalogue ?? []).map((c) => ({
    url: `${SITE_URL}/catalogue/${c.slug}`,
    lastModified: c._updatedAt ? new Date(c._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = (servicePages ?? []).map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: s._updatedAt ? new Date(s._updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...catalogueRoutes,
    ...serviceRoutes,
  ];
}
