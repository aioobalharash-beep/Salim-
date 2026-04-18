import { defineType, defineField } from "sanity";

export default defineType({
  name: "audio",
  title: "Audio",
  type: "document",
  icon: () => "🎧",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Background info about this recording.",
    }),
    defineField({
      name: "albumCover",
      title: "Album Cover",
      type: "image",
      options: { hotspot: true },
      description: "Square or rectangular cover art. Displayed with sharp edges.",
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
      options: {
        accept: "audio/*",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "date",
      description: "Used for sorting (newest first).",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishDate", media: "albumCover" },
  },
  orderings: [
    {
      title: "Publish Date (Newest)",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
});
