import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Services",
  type: "document",
  icon: () => "🎓",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Material Icon Name",
      type: "string",
      description: "Google Material Symbols icon name (e.g. 'school', 'edit_note').",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: "e.g. '3 days', '15 min', 'Ongoing'.",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      description: "URL or path. Leave empty for modal action.",
    }),
    defineField({
      name: "action",
      title: "CTA Action",
      type: "string",
      options: {
        list: [
          { title: "Link", value: "link" },
          { title: "Open Modal", value: "modal" },
        ],
        layout: "radio",
      },
      initialValue: "link",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "duration" },
  },
  orderings: [
    { title: "Sort Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
