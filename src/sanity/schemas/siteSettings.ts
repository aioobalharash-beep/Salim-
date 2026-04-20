import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({
      name: "heroColumns",
      title: "Hero Panels",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "link",
              title: "Link Destination",
              type: "string",
              options: {
                list: [
                  { title: "Home", value: "/" },
                  { title: "Training", value: "/training" },
                  { title: "Shop", value: "/shop" },
                  { title: "Media", value: "/media" },
                  { title: "Media — Discography", value: "/media/discography" },
                  { title: "Media — Video", value: "/media/video" },
                  { title: "Media — Press", value: "/media/press" },
                  { title: "Media — Gallery", value: "/media/gallery" },
                  { title: "Journal", value: "/journal" },
                  { title: "About Salim", value: "/about" },
                ],
                layout: "dropdown",
              },
              description: "The page this panel links to when clicked.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
          },
        }),
      ],
      description:
        "The four identity panels on the homepage hero. Each panel is a full-height clickable column.",
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
