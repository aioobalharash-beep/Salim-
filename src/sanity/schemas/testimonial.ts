import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  icon: () => "💬",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "profession",
      title: "Profession",
      type: "string",
      description: "E.g. 'Guitarist', 'Pianist & Scholar'.",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: "E.g. 'Rosario', 'London'.",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description: "E.g. 'Argentina', 'UK'.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      description:
        "Turn on to publish on the live site. Submissions from the public form arrive as drafts (unapproved) until an editor reviews them here.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      profession: "profession",
      city: "city",
      country: "country",
      content: "content",
      approved: "approved",
    },
    prepare({ title, profession, city, country, content, approved }) {
      const where = [city, country].filter(Boolean).join(", ");
      const who = [profession, where].filter(Boolean).join(" — ");
      const status = approved ? "" : " (unapproved)";
      return {
        title: `${title || "Untitled"}${status}`,
        subtitle: who || content,
      };
    },
  },
});
