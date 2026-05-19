import { defineType, defineField } from "sanity";

export default defineType({
  name: "shop",
  title: "Shop",
  type: "document",
  icon: () => "🛒",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g. 'Suite Algérienne for Guitar Solo'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Short description of the image for accessibility and SEO.",
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Scores", value: "Scores" },
          { title: "Tabs", value: "Tabs" },
          { title: "Books", value: "Books" },
          { title: "Other", value: "Other" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceText",
      title: "Price",
      type: "string",
      description: "Display price, e.g. '€22.00'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "A brief product summary.",
    }),
    defineField({
      name: "purchaseUrl",
      title: "Sonitus Edizioni Link",
      type: "url",
      description: "The exact page link where this item can be purchased.",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceText",
      category: "category",
      media: "coverImage",
    },
    prepare({ title, subtitle, category, media }) {
      return {
        title,
        subtitle: [category, subtitle].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
