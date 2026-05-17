import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "videosPage",
  title: "Videos Page",
  type: "document",
  icon: () => "🎞️",
  fields: [
    defineField({
      name: "videos",
      title: "Videos (manual order)",
      type: "array",
      description:
        "Drag to reorder. The order set here is the order shown on the public Video page.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "video" }],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Videos Page" };
    },
  },
});
