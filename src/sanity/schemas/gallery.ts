import { defineType, defineField } from "sanity";

export default defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
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
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "ratio",
      title: "Ratio",
      type: "string",
      description:
        "Controls which collage row this image belongs to on the gallery page.",
      options: {
        list: [
          { title: "Landscape (16:9)", value: "landscape" },
          { title: "Balanced (4:3)", value: "balanced" },
          { title: "Portrait (3:4)", value: "portrait" },
        ],
        layout: "radio",
      },
      initialValue: "balanced",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "description", subtitle: "ratio", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled image",
        subtitle: subtitle ? `Ratio: ${subtitle}` : undefined,
        media,
      };
    },
  },
});
