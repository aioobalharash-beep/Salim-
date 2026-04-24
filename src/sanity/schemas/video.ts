import { defineType, defineField } from "sanity";

export default defineType({
  name: "video",
  title: "Video",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "videoLink",
      title: "Video Link",
      type: "url",
      description: "YouTube or Vimeo URL.",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      description: "Context shown beside the embedded player.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "description", subtitle: "videoLink" },
    prepare({ title, subtitle }) {
      return {
        title: (title as string)?.slice(0, 60) || "Untitled video",
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
