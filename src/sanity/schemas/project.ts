import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: () => "🗂️",
  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "media", title: "Media" },
    { name: "details", title: "Project Details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Basic Info ────────────────────────────────────────────── */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basic",
      description: "Project name, e.g. 'Vireon Health'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basic",
      options: { source: "title", maxLength: 96 },
      description:
        "Auto-generated from the title. Drives the route, e.g. /projects/vireon-health.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Category",
      type: "string",
      group: "basic",
      description:
        "Short category or descriptor, e.g. 'Healthcare & Wellness' or 'Symphonic Production'.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "basic",
      description: "Used for chronological sorting (e.g., 2026).",
      validation: (Rule) => Rule.integer().min(1900).max(2100),
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 6,
      group: "basic",
      description: "A brief introductory descriptive summary paragraph.",
    }),

    /* ── Media ─────────────────────────────────────────────────── */
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description:
        "Thumbnail shown on the main Projects grid card. Displayed uncropped (object-contain).",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Short description of the image for accessibility and SEO.",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      description:
        "High-resolution showcase images displayed on the individual project page.",
      of: [
        defineArrayMember({
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
    }),

    /* ── Project Details (flexible key-value specs) ────────────── */
    defineField({
      name: "projectDetails",
      title: "Project Details / Credits",
      type: "array",
      group: "details",
      description:
        "Flexible key-value specs, e.g. 'Role: Artistic Director', 'Client: UNESCO', 'Location: Paris'.",
      of: [
        defineArrayMember({
          type: "object",
          name: "detailRow",
          title: "Detail Row",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Left column, e.g. 'Role', 'Client', 'Location'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description:
                "Right column, e.g. 'Artistic Director', 'UNESCO', 'Paris'.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
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
    select: {
      title: "title",
      subtitle: "subtitle",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, subtitle, year, media }) {
      const meta = [subtitle, year].filter(Boolean).join(" · ");
      return { title, subtitle: meta, media };
    },
  },
  orderings: [
    {
      title: "Year (Newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Year (Oldest)",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
