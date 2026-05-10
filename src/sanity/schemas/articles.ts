import { defineType, defineField } from "sanity";

export default defineType({
  name: "articles",
  title: "Articles",
  type: "document",
  icon: () => "📝",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
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
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "byline",
      title: "Byline",
      type: "string",
      description:
        "Optional metadata line shown beneath the title (e.g. 'Le Monde · Salim Dada · March 2024').",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
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
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "A brief summary shown on the Articles listing page.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
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
