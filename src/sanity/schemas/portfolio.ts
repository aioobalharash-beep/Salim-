import { defineType, defineField } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "portfolio",
  title: "Portfolio",
  type: "document",
  icon: () => "🎭",
  fields: [
    // Hidden field that stores the drag-and-drop weight. Managed automatically
    // by the orderable document list in the Portfolio desk panel — editors set
    // the order by dragging items, never by editing this field directly.
    orderRankField({ type: "portfolio" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow Label",
      type: "string",
      description:
        "Small label shown above the title (e.g. \"Publication\", \"Premiere\"). Leave empty to hide.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short description shown next to the image.",
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
      name: "link",
      title: "Link URL",
      type: "url",
      description: "External or internal URL this item links to.",
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      media: "image",
      orientation: "orientation",
    },
    prepare: ({ title, subtitle, media, orientation }) => ({
      title,
      subtitle: `${subtitle ?? ""} · ${orientation ?? "?"}`,
      media,
    }),
  },
  orderings: [orderRankOrdering],
});
