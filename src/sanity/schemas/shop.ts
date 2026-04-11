import { defineType, defineField } from "sanity";

export default defineType({
  name: "shop",
  title: "Shop",
  type: "document",
  icon: () => "🛒",
  fields: [
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Price in USD.",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Purchase link — internal page or external store.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "productName", subtitle: "price", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `$${subtitle}` : "No price set",
        media,
      };
    },
  },
});
