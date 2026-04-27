import { defineType, defineField } from "sanity";

export default defineType({
  name: "reviews",
  title: "Reviews",
  type: "document",
  icon: () => "📝",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      description: "The main review snippet.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sourceText",
      title: "Author / Source",
      type: "string",
      description: "Author or publication (italicised at the bottom).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "place",
      title: "Place",
      type: "string",
      description: "Optional — e.g. Algiers, Paris.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "e.g. 2008.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "sourceText",
      subtitle: "content",
      year: "year",
      place: "place",
    },
    prepare({ title, subtitle, year, place }) {
      const meta = [place, year].filter(Boolean).join(" · ");
      return {
        title: title || "Review",
        subtitle: meta ? `${meta} — ${subtitle ?? ""}` : subtitle,
      };
    },
  },
});
