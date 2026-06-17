import { defineType, defineField, defineArrayMember } from "sanity";

/* ── Shared link annotation for rich-text blocks ──────────────────────── */
const linkAnnotation = {
  name: "link",
  type: "object",
  title: "Link",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
    }),
    defineField({
      name: "blank",
      title: "Open in new tab",
      type: "boolean",
      initialValue: true,
    }),
  ],
};

/**
 * Individual service landing page.
 *
 * A standardized collection model — one document per professional offering
 * (Music Composition, Composer Program, Artistic Direction, Cultural
 * Expertise). Every entry shares the same four modular sections so each lander
 * reads as a consistent, high-converting profile:
 *   1. Hero          — headline, sub-headline, optional showcase image
 *   2. How It Works   — editorial title + full-width rich-text marketing copy
 *   3. Social Proof   — rich-text canvas mixing images and callout text
 *   4. Call-to-Action — large headline that embeds a Tally intake form below it
 */
export default defineType({
  name: "servicePage",
  title: "Service Landing Pages",
  type: "document",
  icon: () => "🎯",
  groups: [
    { name: "directory", title: "Directory Card", default: true },
    { name: "hero", title: "1 · Hero" },
    { name: "howItWorks", title: "2 · How It Works" },
    { name: "socialProof", title: "3 · Social Proof" },
    { name: "cta", title: "4 · Call to Action" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Directory card meta ───────────────────────────────────── */
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      group: "directory",
      description:
        "Name of the service, e.g. 'Music Composition'. Shown on the master Services directory card.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "directory",
      options: { source: "title", maxLength: 96 },
      description:
        "Auto-generated from the title. Drives the route, e.g. /services/music-composition.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Directory Summary",
      type: "text",
      rows: 3,
      group: "directory",
      description:
        "Short description shown in the service card on the master /services grid.",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      group: "directory",
      description: "Controls the position of this card in the directory grid.",
    }),

    /* ── 1 · Hero ──────────────────────────────────────────────── */
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subheadline",
          title: "Sub-headline",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "image",
          title: "Showcase Image (optional)",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Short description of the image for accessibility and SEO.",
            }),
          ],
        }),
      ],
      preview: {
        select: { title: "headline", subtitle: "subheadline", media: "image" },
        prepare({ title, subtitle, media }) {
          return { title: title || "Hero", subtitle, media };
        },
      },
    }),

    /* ── 2 · How It Works ──────────────────────────────────────── */
    defineField({
      name: "howItWorks",
      title: "How It Works Section",
      type: "object",
      group: "howItWorks",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Editorial Title",
          type: "string",
        }),
        defineField({
          name: "body",
          title: "Marketing Copy",
          type: "array",
          description: "Full-width rich-text body.",
          of: [
            defineArrayMember({
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "Heading", value: "h3" },
              ],
              lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                ],
                annotations: [linkAnnotation],
              },
            }),
          ],
        }),
      ],
    }),

    /* ── 3 · Social Proof & Credibility ────────────────────────── */
    defineField({
      name: "socialProof",
      title: "Social Proof & Credibility Section",
      type: "object",
      group: "socialProof",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "array",
          description:
            "Rich-text canvas — intertwine paragraphs, images, and pull-quote callouts.",
          of: [
            defineArrayMember({
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "Heading", value: "h3" },
              ],
              lists: [{ title: "Bullet", value: "bullet" }],
              marks: {
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                ],
                annotations: [linkAnnotation],
              },
            }),
            /* — Inline image — */
            defineArrayMember({
              type: "image",
              name: "proofImage",
              title: "Image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                  description:
                    "Short description of the image for accessibility and SEO.",
                }),
                defineField({
                  name: "caption",
                  title: "Caption",
                  type: "string",
                }),
              ],
            }),
            /* — Callout / pull quote — */
            defineArrayMember({
              type: "object",
              name: "callout",
              title: "Callout",
              fields: [
                defineField({
                  name: "text",
                  title: "Callout Text",
                  type: "text",
                  rows: 3,
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "attribution",
                  title: "Attribution",
                  type: "string",
                  description: "Optional — who said it, e.g. 'UNESCO, 2023'.",
                }),
              ],
              preview: {
                select: { title: "text", subtitle: "attribution" },
                prepare({ title, subtitle }) {
                  return { title: title || "Callout", subtitle };
                },
              },
            }),
          ],
        }),
      ],
    }),

    /* ── 4 · Call to Action ────────────────────────────────────── */
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      group: "cta",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          description:
            "Large, prominent callout shown on the left of the closing banner.",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          description:
            "Optional value-pitch copy shown beneath the headline in an editorial tone.",
        }),
        defineField({
          name: "tallyUrl",
          title: "Tally Form URL",
          type: "url",
          description:
            "Full Tally embed URL opened in the pop-up form, e.g. https://tally.so/embed/dWz4jo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        }),
      ],
    }),

    /* ── SEO ───────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "hero.image" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `/services/${subtitle}` : "—",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
