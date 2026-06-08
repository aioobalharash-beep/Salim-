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
    { name: "footer", title: "Footer & Contact" },
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
        "Multimedia showcase shown on the individual project page. Mix images, YouTube videos, and uploaded video files — each renders as an editorial row with an optional title and description.",
      of: [
        /* — Image — */
        defineArrayMember({
          type: "image",
          name: "galleryImage",
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
              name: "title",
              title: "Title",
              type: "string",
              description: "Optional heading shown beside the image (serif).",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description: "Optional descriptive text shown beside the image.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "alt", media: "asset" },
            prepare({ title, subtitle, media }) {
              return { title: title || "Image", subtitle, media };
            },
          },
        }),
        /* — YouTube Video — */
        defineArrayMember({
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "startTime",
              title: "Start Time (seconds)",
              type: "number",
              description: "Optional. Begin playback this many seconds in.",
              validation: (Rule) => Rule.min(0).integer(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "url" },
            prepare({ title, subtitle }) {
              return { title: title || "YouTube Video", subtitle };
            },
          },
        }),
        /* — Local Video File — */
        defineArrayMember({
          type: "object",
          name: "videoFile",
          title: "Video File",
          fields: [
            defineField({
              name: "file",
              title: "Video File",
              type: "file",
              options: { accept: "video/*" },
              description: "Upload a local video (e.g. mp4).",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return { title: title || "Video File" };
            },
          },
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

    /* ── Project Footer ────────────────────────────────────────── */
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "array",
      group: "footer",
      description:
        "Final project notes and external links, shown beneath the gallery in understated typography.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h3" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "External Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                  defineField({
                    name: "blank",
                    title: "Open in new tab",
                    type: "boolean",
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),

    /* ── Contact Bar ───────────────────────────────────────────── */
    defineField({
      name: "showContactBar",
      title: "Show Contact Bar",
      type: "boolean",
      group: "footer",
      initialValue: false,
      description:
        "Toggle the full-width contact bar at the very bottom of the project page.",
    }),
    defineField({
      name: "contactBarText",
      title: "Contact Bar Text",
      type: "string",
      group: "footer",
      description: "The text appearing on the left of the bar.",
      hidden: ({ parent }) => !parent?.showContactBar,
    }),
    defineField({
      name: "contactButtonLabel",
      title: "Contact Button Label",
      type: "string",
      group: "footer",
      initialValue: "contact",
      description: "Label for the button on the right of the bar.",
      hidden: ({ parent }) => !parent?.showContactBar,
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
