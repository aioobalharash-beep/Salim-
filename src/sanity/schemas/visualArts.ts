import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Visual Arts — the immersive "graphic novel preview" wing.
 *
 * A singleton document that drives /visual-arts. Rather than a standard
 * e-commerce grid, the page renders an ordered, horizontally-scrolling
 * cinematic track. Salim authors a single `blocks` array where he can freely
 * intermix two kinds of panels:
 *
 *   - `textPanel`    — a spacious narrative column that introduces a comic
 *                      chapter (title, chapter subtitle, and rich-text lore).
 *   - `artworkAsset` — a full-height illustration with a caption, medium
 *                      notes (e.g. Charcoal, Ink) and optional grouping tags.
 *
 * Order is meaningful: blocks render left-to-right exactly as arranged here.
 *
 * The portfolio feed below the track is split into three format-locked
 * sections — vertical, square and landscape — so every row aligns to a
 * uniform aspect ratio regardless of the raw source file. Each artwork image
 * enables Sanity's hotspot & crop tooling so Salim can visually re-frame a
 * canvas inside its fixed wrapper from the studio.
 */

/**
 * Shared field-set factory for a single portfolio artwork.
 *
 * Each of the three format sections reuses the identical authoring shape
 * (image + title + year + medium notes); only the array member `name`/`title`
 * differs so the studio can label the format. The image enables
 * `options.hotspot`, which surfaces Sanity's native focal-point selector and
 * crop handles — these crop parameters are then honoured by the frontend image
 * URL builder when the artwork is composited into its fixed-ratio frame.
 */
function portfolioWorkMember({
  name,
  title,
  formatHint,
}: {
  name: string;
  title: string;
  formatHint: string;
}) {
  return defineArrayMember({
    type: "object",
    name,
    title,
    icon: () => "🖼️",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "image",
        // Hotspot + crop: unlocks the visual focal-point selector and crop
        // handles in the studio so the artwork can be re-framed inside its
        // fixed aspect-ratio wrapper on the page.
        options: { hotspot: true },
        validation: (Rule) => Rule.required(),
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
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        description: "Artwork title, shown beneath the image.",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "year",
        title: "Year",
        type: "string",
        description: "Year of production, e.g. '2026'.",
      }),
      defineField({
        name: "notes",
        title: "Medium / Production Notes",
        type: "string",
        description: `Medium or technique, e.g. 'Ink'. ${formatHint}`,
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "year", media: "image" },
      prepare({ title, subtitle, media }) {
        return { title: title || "Artwork", subtitle, media };
      },
    },
  });
}
export default defineType({
  name: "visualArts",
  title: "Visual Arts",
  type: "document",
  icon: () => "🎨",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "track", title: "Cinematic Track" },
    { name: "feed", title: "Portfolio Feed" },
    { name: "announcements", title: "Project Announcements" },
    { name: "seo", title: "SEO" },
  ],
  // The portfolio feed is authored as three format-locked arrays so each row
  // on the page snaps to a uniform aspect ratio: verticalWorks (portrait
  // studies & sketches), squareWorks (1:1 graphic tiles) and landscapeWorks
  // (wide scenery, storyboards & panoramas).
  fieldsets: [
    {
      name: "portfolioFeed",
      title: "Artwork Portfolio Feed",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    /* ── Header ─────────────────────────────────────────────────── */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "header",
      description:
        "Wing title, e.g. 'Visual Arts'. Used for the browser tab and the opening narrative anchor.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Intro",
      type: "text",
      rows: 3,
      group: "header",
      description:
        "Short introductory line that sets the tone before the first chapter.",
    }),

    /* ── Cinematic Track (ordered, mixed blocks) ────────────────── */
    defineField({
      name: "blocks",
      title: "Cinematic Track",
      type: "array",
      group: "track",
      description:
        "An ordered sequence of panels rendered left-to-right along the horizontal scroll track. Mix narrative text columns and artwork freely — drag to reorder.",
      of: [
        /* — Narrative Text Column — */
        defineArrayMember({
          type: "object",
          name: "textPanel",
          title: "Text Panel",
          icon: () => "📝",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "Large chapter heading, e.g. 'Chapter One — The Quiet City'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "chapterSubtitle",
              title: "Chapter Subtitle",
              type: "string",
              description:
                "Small eyebrow line shown above the title, e.g. 'Sequential Story · 2026'.",
            }),
            defineField({
              name: "body",
              title: "Story Lore / Background",
              type: "array",
              description:
                "Rich-text narrative — story lore, background descriptions, artist notes.",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Normal", value: "normal" },
                    { title: "Heading", value: "h3" },
                    { title: "Quote", value: "blockquote" },
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
          ],
          preview: {
            select: { title: "title", subtitle: "chapterSubtitle" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Text Panel",
                subtitle: subtitle
                  ? `Text · ${subtitle}`
                  : "Narrative text column",
              };
            },
          },
        }),

        /* — Artwork Asset — */
        defineArrayMember({
          type: "object",
          name: "artworkAsset",
          title: "Artwork",
          icon: () => "🖼️",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
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
            defineField({
              name: "caption",
              title: "Title / Caption",
              type: "string",
              description:
                "Title shown directly beneath the illustration, e.g. 'The Last Tramway'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "medium",
              title: "Medium Notes",
              type: "string",
              description: "Materials & technique, e.g. 'Charcoal & Ink on paper'.",
            }),
            defineField({
              name: "tags",
              title: "Project / Chapter Tags",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { layout: "tags" },
              description:
                "Optional grouping tags that associate this artwork with a project or chapter.",
            }),
          ],
          preview: {
            select: {
              title: "caption",
              subtitle: "medium",
              media: "image",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Artwork",
                subtitle: subtitle ? `Artwork · ${subtitle}` : "Artwork",
                media,
              };
            },
          },
        }),
      ],
    }),

    /* ── Section A · Master Artwork Portfolio Feed ──────────────────
     * The vertical-scrolling card matrix rendered below the horizontal
     * track. Split into three format-locked rows so every card aligns to a
     * uniform aspect ratio regardless of the raw source proportions. Each
     * image enables hotspot & crop so Salim can re-frame the canvas inside
     * its fixed wrapper from the studio. */
    defineField({
      name: "verticalWorks",
      title: "Vertical Works (Portrait)",
      type: "array",
      group: "feed",
      fieldset: "portfolioFeed",
      description:
        "Portrait-format illustrations — sketches, figure studies and tall works. Rendered in a 3:4 aspect-ratio grid.",
      of: [
        portfolioWorkMember({
          name: "verticalWork",
          title: "Vertical Artwork",
          formatHint: "Shown in a portrait (3:4) frame.",
        }),
      ],
    }),
    defineField({
      name: "squareWorks",
      title: "Square Works (1:1)",
      type: "array",
      group: "feed",
      fieldset: "portfolioFeed",
      description:
        "Square, 1:1-formatted graphic tiles. Rendered in a perfectly square grid.",
      of: [
        portfolioWorkMember({
          name: "squareWork",
          title: "Square Artwork",
          formatHint: "Shown in a square (1:1) frame.",
        }),
      ],
    }),
    defineField({
      name: "landscapeWorks",
      title: "Landscape Works (Wide)",
      type: "array",
      group: "feed",
      fieldset: "portfolioFeed",
      description:
        "Wide scenery, storyboards and panoramas. Rendered in a 16:10 aspect-ratio grid.",
      of: [
        portfolioWorkMember({
          name: "landscapeWork",
          title: "Landscape Artwork",
          formatHint: "Shown in a wide (16:10) frame.",
        }),
      ],
    }),

    /* ── Section B · Future Project Announcements ───────────────────
     * A vertical stack of large promotional cards. Each splits into a
     * narrative text column (left) and an optional banner image (right),
     * stacking on mobile. */
    defineField({
      name: "projectAnnouncements",
      title: "Future Project Announcements",
      type: "array",
      group: "announcements",
      description:
        "Large promotional cards stacked below the portfolio feed. Each pairs announcement copy with an optional banner illustration.",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectAnnouncement",
          title: "Announcement",
          icon: () => "📣",
          fields: [
            defineField({
              name: "eyebrow",
              title: "Eyebrow",
              type: "string",
              description: "Small label above the title, e.g. 'Coming 2027'.",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Announcement Text",
              type: "array",
              description: "Narrative promotional copy shown on the left side.",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Normal", value: "normal" },
                    { title: "Quote", value: "blockquote" },
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
            defineField({
              name: "ctaLabel",
              title: "CTA Label",
              type: "string",
              description: "Optional button text, e.g. 'Read more'.",
            }),
            defineField({
              name: "ctaLink",
              title: "CTA Link",
              type: "string",
              description: "URL or path the CTA routes to.",
            }),
            defineField({
              name: "bannerImage",
              title: "Banner Illustration (optional)",
              type: "image",
              options: { hotspot: true },
              description: "Optional banner shown on the right side of the card.",
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
            select: {
              title: "title",
              subtitle: "eyebrow",
              media: "bannerImage",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Announcement",
                subtitle: subtitle || "Project announcement",
                media,
              };
            },
          },
        }),
      ],
    }),

    /* ── SEO ────────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Visual Arts", subtitle: "Cinematic Track" };
    },
  },
});
