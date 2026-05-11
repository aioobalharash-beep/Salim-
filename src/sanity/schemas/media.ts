import { defineType, defineField } from "sanity";

export default defineType({
  name: "media",
  title: "Media",
  type: "document",
  icon: () => "🎵",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mediaType",
      title: "Media Type",
      type: "string",
      options: {
        list: [
          { title: "Video", value: "video" },
          { title: "Audio", value: "audio" },
          { title: "Photo", value: "photo" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      description: "For video media type.",
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "file",
      title: "File Upload",
      type: "file",
      description: "For audio or PDF files.",
      hidden: ({ parent }) => parent?.mediaType === "video",
    }),
    defineField({
      name: "image",
      title: "Thumbnail / Photo",
      type: "image",
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
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "mediaType", media: "image" },
  },
});
