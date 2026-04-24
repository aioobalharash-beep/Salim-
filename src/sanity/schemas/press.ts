import { defineType, defineField } from "sanity";

export default defineType({
  name: "press",
  title: "Press",
  type: "document",
  icon: () => "📰",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      description: "Main quote or snippet.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceText",
      title: "Source Text",
      type: "string",
      description: "Publication / author (italicized at the bottom).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "DD/MM/YY" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "sourceText", subtitle: "content", date: "date" },
    prepare({ title, subtitle, date }) {
      return {
        title: title || "Press",
        subtitle: date ? `${date} — ${subtitle ?? ""}` : subtitle,
      };
    },
  },
});
