import { defineType, defineField, defineArrayMember } from "sanity";

/* ────────────────────────────────────────────────────────────────────────
 * Articles schema — editorial-grade rich content.
 *
 * This schema is built around the "Tomasi guitar concerto" reference
 * article (see project notes). It gives editors the structured blocks
 * they need to reproduce that design inside Sanity:
 *   – rich title with italic + colour
 *   – deck / standfirst
 *   – structured byline
 *   – composer voice (dark pull-out), timeline, factbox, two-column poem,
 *     pull quote, author note, decorative divider, footnotes
 *   – inline marks (small caps, foreign-language span, footnote, link,
 *     colour)
 *   – images inside the body, with caption + credit
 * ──────────────────────────────────────────────────────────────────────── */

/* ── Reusable colour palette for inline `color` annotation. ───────────── */
const COLOR_PALETTE = [
  { title: "Deep (default body)", value: "#1b1208" },
  { title: "Rust (accent)", value: "#8b3a1a" },
  { title: "Gold", value: "#b8952a" },
  { title: "Warm Grey", value: "#6b6050" },
  { title: "Parchment", value: "#f2ede4" },
  { title: "Ink Black", value: "#000000" },
  { title: "Forest", value: "#2f4a32" },
  { title: "Royal Blue", value: "#1f3a8a" },
  { title: "Burgundy", value: "#6b1f2a" },
];

/* ── Decorators / annotations reused in body + small rich-text fields ── */
const inlineMarks = {
  decorators: [
    { title: "Bold", value: "strong" },
    { title: "Italic", value: "em" },
    { title: "Underline", value: "underline" },
    { title: "Small Caps", value: "smallCaps" },
  ],
  annotations: [
    {
      name: "link",
      title: "Link",
      type: "object",
      fields: [
        defineField({
          name: "href",
          title: "URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
        }),
        defineField({
          name: "openInNewTab",
          title: "Open in new tab",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "rel",
          title: "rel attribute",
          type: "string",
          description: "Optional. e.g. 'noopener noreferrer nofollow'.",
        }),
      ],
    },
    {
      name: "color",
      title: "Text Colour",
      type: "object",
      fields: [
        defineField({
          name: "value",
          title: "Colour",
          type: "string",
          description: "Pick from the palette or enter any hex (e.g. #8b3a1a).",
          options: { list: COLOR_PALETTE },
        }),
      ],
    },
    {
      name: "lang",
      title: "Foreign Language",
      type: "object",
      description:
        "Wrap a word/phrase in a different language. Adds lang attribute for typography & accessibility.",
      fields: [
        defineField({
          name: "code",
          title: "Language code",
          type: "string",
          description: "BCP-47 tag (e.g. es, fr, ar, it, la).",
          options: {
            list: [
              { title: "Spanish", value: "es" },
              { title: "French", value: "fr" },
              { title: "Arabic", value: "ar" },
              { title: "Italian", value: "it" },
              { title: "Latin", value: "la" },
              { title: "German", value: "de" },
              { title: "Portuguese", value: "pt" },
            ],
          },
        }),
      ],
    },
    {
      name: "footnoteRef",
      title: "Footnote",
      type: "object",
      description:
        "Inline footnote marker. The footnote list is set at the bottom of the article (Footnotes block).",
      fields: [
        defineField({
          name: "number",
          title: "Footnote number",
          type: "number",
          validation: (Rule) => Rule.required().integer().positive(),
        }),
      ],
    },
  ],
};

/* ── Block styles ── */
const blockStyles = [
  { title: "Normal", value: "normal" },
  { title: "Lead (first paragraph)", value: "lead" },
  { title: "H2", value: "h2" },
  { title: "H2 — Italic Rust (section head)", value: "h2Italic" },
  { title: "H3", value: "h3" },
  { title: "H3 — Eyebrow (uppercase tracked)", value: "h3Eyebrow" },
  { title: "Caption (small italic)", value: "caption" },
  { title: "Quote", value: "blockquote" },
];

const blockLists = [
  { title: "Bullet", value: "bullet" },
  { title: "Numbered", value: "number" },
];

export default defineType({
  name: "articles",
  title: "Articles",
  type: "document",
  icon: () => "📝",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "design", title: "Design" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Core identity ────────────────────────────────────────────── */
    defineField({
      name: "title",
      title: "Title (plain text)",
      type: "string",
      group: "content",
      description:
        "Plain title — used for SEO, slug, listings, and as a fallback if no Rich Title is set.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "richTitle",
      title: "Rich Title (display)",
      type: "array",
      group: "content",
      description:
        "Optional. If set, replaces the plain title in the article hero. Supports italic and colour on individual words (e.g. italicise 'a Murdered Poet').",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Small Caps", value: "smallCaps" },
            ],
            annotations: [
              {
                name: "color",
                title: "Text Colour",
                type: "object",
                fields: [
                  defineField({
                    name: "value",
                    title: "Colour",
                    type: "string",
                    options: { list: COLOR_PALETTE },
                  }),
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.max(1),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrowTags",
      title: "Eyebrow Tags",
      type: "array",
      group: "content",
      description:
        "Small uppercase tags shown above the title (e.g. ['Guitar', 'Repertoire', '20th Century']).",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Arts", value: "Arts" },
          { title: "Composition", value: "Composition" },
          { title: "Music & Technology", value: "Music & Technology" },
          { title: "Conducting", value: "Conducting" },
          {
            title: "Diversity of Cultural Expressions",
            value: "Diversity of Cultural Expressions",
          },
          { title: "Guitar", value: "Guitar" },
          { title: "Musicology", value: "Musicology" },
          { title: "Other", value: "Other" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading time (minutes)",
      type: "number",
      group: "content",
      description: "Optional. Shown in the metadata line. Leave empty to hide.",
      validation: (Rule) => Rule.min(1).max(180),
    }),

    /* ── Deck / standfirst ───────────────────────────────────────── */
    defineField({
      name: "deck",
      title: "Deck / Subtitle",
      type: "array",
      group: "content",
      description:
        "Italic standfirst paragraph rendered with a gold left rule, beneath the title.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Italic", value: "em" },
              { title: "Bold", value: "strong" },
            ],
            annotations: [],
          },
        },
      ],
      validation: (Rule) => Rule.max(2),
    }),

    /* ── Byline (structured) ─────────────────────────────────────── */
    defineField({
      name: "bylineDetails",
      title: "Byline",
      type: "object",
      group: "content",
      description:
        "Structured byline shown beneath the deck (author, role, original publication credit).",
      fields: [
        defineField({
          name: "authorName",
          title: "Author name",
          type: "string",
          initialValue: "Salim Dada",
        }),
        defineField({
          name: "authorRole",
          title: "Author role",
          type: "string",
          description: "e.g. 'Guitarist & Musicologist'.",
        }),
        defineField({
          name: "publicationCredit",
          title: "Original publication credit",
          type: "string",
          description:
            "e.g. 'Originally published in Henri Tomasi, du lyrisme méditerranéen…, Presses Universitaires de Provence, 2015'.",
        }),
      ],
    }),
    defineField({
      name: "byline",
      title: "Byline (legacy single-line)",
      type: "string",
      group: "content",
      hidden: ({ document }) => Boolean((document as any)?.bylineDetails?.authorName),
      description:
        "Legacy single-line byline. Use the structured 'Byline' above for new articles.",
    }),

    /* ── Featured image ──────────────────────────────────────────── */
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Short description of the image for accessibility and SEO.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Italic caption shown beneath the image.",
        }),
        defineField({
          name: "credit",
          title: "Credit",
          type: "string",
          description: "Photographer / source. Rendered in small uppercase.",
        }),
      ],
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt (listing)",
      type: "text",
      group: "content",
      rows: 3,
      description:
        "Plain-text summary shown on the Articles listing page (and as SEO fallback).",
    }),

    /* ── Design controls ─────────────────────────────────────────── */
    defineField({
      name: "showHeroOrnament",
      title: "Show hero ornament (❧)",
      type: "boolean",
      group: "design",
      initialValue: true,
      description:
        "Toggles the decorative fleuron above the title in the article hero.",
    }),
    defineField({
      name: "accentColor",
      title: "Accent colour override",
      type: "string",
      group: "design",
      description:
        "Optional. Override the default rust accent for this article only (any valid CSS colour).",
      options: { list: COLOR_PALETTE },
    }),
    defineField({
      name: "showTableOfContents",
      title: "Show table of contents",
      type: "boolean",
      group: "design",
      initialValue: false,
      description:
        "If on, auto-generates a small TOC from the article's H2 headings.",
    }),

    /* ── BODY ────────────────────────────────────────────────────── */
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: blockStyles,
          lists: blockLists,
          marks: inlineMarks,
        }),

        /* ── Image (with caption + credit) ── */
        defineArrayMember({
          type: "image",
          name: "bodyImage",
          title: "Image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Italic caption below the image.",
            }),
            defineField({
              name: "credit",
              title: "Credit",
              type: "string",
              description: "Photographer / source (small uppercase).",
            }),
            defineField({
              name: "size",
              title: "Display size",
              type: "string",
              initialValue: "column",
              options: {
                list: [
                  { title: "Column width", value: "column" },
                  { title: "Wide (slight bleed)", value: "wide" },
                  { title: "Full bleed", value: "full" },
                ],
                layout: "radio",
              },
            }),
          ],
        }),

        /* ── Composer / Subject voice (dark pull-out) ── */
        defineArrayMember({
          type: "object",
          name: "composerVoice",
          title: "Composer / Subject Voice",
          fields: [
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Italic", value: "em" },
                      { title: "Bold", value: "strong" },
                    ],
                    annotations: [],
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              description:
                "Small uppercase line beneath the quote (e.g. '— Henri Tomasi, manuscript preface').",
            }),
          ],
          preview: {
            select: { attribution: "attribution" },
            prepare: ({ attribution }) => ({
              title: "Composer / Subject Voice",
              subtitle: attribution || "Dark pull-out quote",
            }),
          },
        }),

        /* ── Timeline ── */
        defineArrayMember({
          type: "object",
          name: "timeline",
          title: "Timeline",
          fields: [
            defineField({
              name: "title",
              title: "Optional heading",
              type: "string",
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              validation: (Rule) => Rule.required().min(1),
              of: [
                {
                  type: "object",
                  name: "timelineItem",
                  fields: [
                    defineField({
                      name: "date",
                      title: "Date / label",
                      type: "string",
                      description: "e.g. '1966', 'April 1967', 'March 12, 1969'.",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "text",
                      title: "Text",
                      type: "array",
                      of: [
                        {
                          type: "block",
                          styles: [{ title: "Normal", value: "normal" }],
                          lists: [],
                          marks: {
                            decorators: [
                              { title: "Italic", value: "em" },
                              { title: "Bold", value: "strong" },
                            ],
                            annotations: [],
                          },
                        },
                      ],
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: { title: "date", subtitle: "text.0.children.0.text" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title: title || "Timeline",
              subtitle: `${(items?.length ?? 0)} item(s)`,
            }),
          },
        }),

        /* ── Factbox ── */
        defineArrayMember({
          type: "object",
          name: "factbox",
          title: "Factbox / Info Card",
          fields: [
            defineField({
              name: "label",
              title: "Eyebrow label",
              type: "string",
              description: "Tiny uppercase label at the top of the box.",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "intro",
              title: "Intro paragraph",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "factItem",
                  fields: [
                    defineField({
                      name: "term",
                      title: "Lead-in term",
                      type: "string",
                      description: "Bold opening (e.g. 'The picturesque guitar').",
                    }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "text",
                      rows: 2,
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "term", subtitle: "description" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title", label: "label" },
            prepare: ({ title, label }) => ({
              title: title || "Factbox",
              subtitle: label,
            }),
          },
        }),

        /* ── Two-column / bilingual block ── */
        defineArrayMember({
          type: "object",
          name: "twoColumn",
          title: "Two-Column / Bilingual Block",
          fields: [
            defineField({
              name: "leftLabel",
              title: "Left column label",
              type: "string",
              description: "e.g. 'Original — Spanish'.",
            }),
            defineField({
              name: "leftBody",
              title: "Left column text",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Italic", value: "em" },
                      { title: "Bold", value: "strong" },
                    ],
                    annotations: [
                      {
                        name: "lang",
                        title: "Language",
                        type: "object",
                        fields: [{ name: "code", type: "string", title: "Language code" }],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "rightLabel",
              title: "Right column label",
              type: "string",
              description: "e.g. 'Translation — English'.",
            }),
            defineField({
              name: "rightBody",
              title: "Right column text",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Italic", value: "em" },
                      { title: "Bold", value: "strong" },
                    ],
                    annotations: [
                      {
                        name: "lang",
                        title: "Language",
                        type: "object",
                        fields: [{ name: "code", type: "string", title: "Language code" }],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { left: "leftLabel", right: "rightLabel" },
            prepare: ({ left, right }) => ({
              title: "Two-Column Block",
              subtitle: [left, right].filter(Boolean).join("  ·  "),
            }),
          },
        }),

        /* ── Pull quote ── */
        defineArrayMember({
          type: "object",
          name: "pullQuote",
          title: "Pull Quote",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              description: "e.g. '— Antoine Goléa, Musica, Paris, November 1969'.",
            }),
          ],
          preview: {
            select: { title: "quote", subtitle: "attribution" },
          },
        }),

        /* ── Author note / colophon ── */
        defineArrayMember({
          type: "object",
          name: "authorNote",
          title: "Author Note / Colophon",
          fields: [
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                    ],
                    annotations: [
                      {
                        name: "link",
                        title: "Link",
                        type: "object",
                        fields: [{ name: "href", type: "url", title: "URL" }],
                      },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            prepare: () => ({ title: "Author Note / Colophon" }),
          },
        }),

        /* ── Decorative divider ── */
        defineArrayMember({
          type: "object",
          name: "divider",
          title: "Decorative Divider",
          fields: [
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              initialValue: "fleuron",
              options: {
                list: [
                  { title: "Fleuron (❧)", value: "fleuron" },
                  { title: "Gradient rule", value: "gradient" },
                  { title: "Thin line", value: "thin" },
                  { title: "Three dots", value: "dots" },
                ],
                layout: "radio",
              },
            }),
          ],
          preview: {
            select: { style: "style" },
            prepare: ({ style }) => ({
              title: "Decorative Divider",
              subtitle: style,
            }),
          },
        }),

        /* ── Footnotes (rendered at end of article) ── */
        defineArrayMember({
          type: "object",
          name: "footnotes",
          title: "Footnotes",
          description:
            "Insert once at the end of the article. Numbers correspond to inline footnote markers.",
          fields: [
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              validation: (Rule) => Rule.required().min(1),
              of: [
                {
                  type: "object",
                  name: "footnote",
                  fields: [
                    defineField({
                      name: "number",
                      title: "Number",
                      type: "number",
                      validation: (Rule) => Rule.required().integer().positive(),
                    }),
                    defineField({
                      name: "text",
                      title: "Text",
                      type: "array",
                      of: [
                        {
                          type: "block",
                          styles: [{ title: "Normal", value: "normal" }],
                          lists: [],
                          marks: {
                            decorators: [
                              { title: "Italic", value: "em" },
                              { title: "Bold", value: "strong" },
                            ],
                            annotations: [
                              {
                                name: "link",
                                title: "Link",
                                type: "object",
                                fields: [{ name: "href", type: "url", title: "URL" }],
                              },
                            ],
                          },
                        },
                      ],
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: { number: "number", subtitle: "text.0.children.0.text" },
                    prepare: ({ number, subtitle }) => ({
                      title: `Footnote ${number ?? "?"}`,
                      subtitle,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { items: "items" },
            prepare: ({ items }) => ({
              title: "Footnotes",
              subtitle: `${(items?.length ?? 0)} entries`,
            }),
          },
        }),
      ],
    }),

    /* ── SEO ─────────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "featuredImage" },
  },
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
