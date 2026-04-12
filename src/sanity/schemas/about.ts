import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "shortIntro",
      title: "Short Introduction",
      type: "text",
      rows: 3,
      description: "Brief tagline shown in the hero area of the About page.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull Quote",
      type: "string",
      description: "A signature quote displayed prominently.",
    }),
    defineField({
      name: "bio",
      title: "Short Biography",
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
      ],
      description: "Brief biography shown alongside the portrait.",
    }),
    defineField({
      name: "mainBio",
      title: "Long-Form Biography",
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
      ],
      description:
        "Extended narrative biography with full rich text — displayed in the dedicated long-form section.",
    }),
    defineField({
      name: "achievements",
      title: "Achievements & Highlights",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Career highlights, UNESCO roles, awards — one per line. Displayed as a curated list.",
    }),
    defineField({
      name: "philosophy",
      title: "Musical Philosophy",
      type: "text",
      rows: 6,
      description:
        "His artistic philosophy in his own words — shown in the Philosophy section.",
    }),
    defineField({
      name: "chronology",
      title: "Chronology of Precision",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "year",
              title: "Display Year",
              type: "string",
              description:
                "e.g. '2012' or '2012 — 2018' for a period.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Event Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "year" },
          },
        }),
      ],
      description:
        "Timeline entries displayed on the About page. Add as many as needed — they alternate left and right.",
    }),
  ],
  preview: {
    select: { media: "profileImage" },
    prepare({ media }) {
      return { title: "About Salim Dada", media };
    },
  },
});
