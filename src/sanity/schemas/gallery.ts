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
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule) => Rule.max(240),
    }),
  ],
  preview: {
    select: { title: "description", media: "image" },
    prepare({ title, media }) {
      return {
        title: title || "Untitled image",
        media,
      };
    },
  },
});
