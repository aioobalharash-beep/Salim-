import { defineType, defineField } from "sanity";

export default defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  icon: () => "🎭",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Work", value: "work" },
          { title: "Event", value: "event" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
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
      name: "orientation",
      title: "Image orientation",
      type: "string",
      initialValue: "vertical",
      description:
        "Used to lay out the slider page. Each page on the home Work & Events section must be either three vertical items OR one vertical + one horizontal.",
      options: {
        list: [
          { title: "Vertical (portrait)", value: "vertical" },
          { title: "Horizontal (landscape)", value: "horizontal" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageGroup",
      title: "Slider page number",
      type: "number",
      initialValue: 1,
      description:
        "Items with the same number appear together on the same slider page. Group items so each page contains either three verticals OR one vertical + one horizontal.",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "link",
      title: "Link URL",
      type: "url",
      description: "External or internal URL this item links to.",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "order",
      title: "Sort Order (within page)",
      type: "number",
      description: "Lower numbers appear first inside the slider page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      media: "image",
      orientation: "orientation",
      pageGroup: "pageGroup",
    },
    prepare: ({ title, subtitle, media, orientation, pageGroup }) => ({
      title,
      subtitle: `${subtitle ?? ""} · ${orientation ?? "?"} · page ${pageGroup ?? "?"}`,
      media,
    }),
  },
  orderings: [
    {
      title: "Slider page, then order",
      name: "pageGroupAsc",
      by: [
        { field: "pageGroup", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Sort Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
