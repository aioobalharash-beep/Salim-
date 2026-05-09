import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "audio",
  title: "Discography",
  type: "document",
  icon: () => "\uD83D\uDCBF",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Album", value: "album" },
          { title: "Single", value: "single" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "single",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "album",
      title: "Album",
      type: "string",
      description:
        "Album name this release belongs to (leave empty for standalone releases).",
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
    }),
    defineField({
      name: "instrumentation",
      title: "Instrumentation",
      type: "string",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "albumCover",
      title: "Cover Art",
      type: "image",
      options: { hotspot: true },
      description: "Sharp rectangular cover. Square or portrait both work.",
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
      options: { accept: "audio/*" },
      hidden: ({ parent }) => parent?.releaseType === "album",
      description: "Used for singles. Leave empty for albums.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { releaseType?: string } | undefined;
          if (parent?.releaseType === "single" && !value) {
            return "Singles require an audio file.";
          }
          return true;
        }),
    }),
    defineField({
      name: "tracks",
      title: "Tracklist",
      type: "array",
      hidden: ({ parent }) => parent?.releaseType !== "album",
      description: "Ordered list of tracks on the album.",
      of: [
        defineArrayMember({
          type: "object",
          name: "track",
          title: "Track",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "audioFile",
              title: "Audio File",
              type: "file",
              options: { accept: "audio/*" },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { releaseType?: string } | undefined;
          if (
            parent?.releaseType === "album" &&
            (!value || (value as unknown[]).length === 0)
          ) {
            return "Albums require at least one track.";
          }
          return true;
        }),
    }),
    defineField({
      name: "purchaseUrl",
      title: "Purchase URL",
      type: "url",
      description: "External link to buy or stream (Bandcamp, iTunes, etc.).",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "shareUrl",
      title: "Share URL",
      type: "url",
      description:
        "Public link used when listeners tap Share. Defaults to the release page if empty.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "watchUrl",
      title: "Watch URL",
      type: "url",
      description:
        "External video link (YouTube, Vimeo, etc.). When set, a Watch button appears next to Full Album.",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }),
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
    select: {
      title: "title",
      subtitle: "releaseType",
      media: "albumCover",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === "album" ? "Album" : "Single",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Publish Date (Newest)",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
});
