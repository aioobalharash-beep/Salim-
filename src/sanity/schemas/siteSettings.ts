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
              name: "link",
              title: "Link Destination",
              type: "object",
              description:
                "Where this panel navigates when clicked. Choose Internal for a local route or External for an outside URL.",
              fields: [
                defineField({
                  name: "type",
                  title: "Link Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Internal (this site)", value: "internal" },
                      { title: "External (outside link)", value: "external" },
                    ],
                    layout: "radio",
                    direction: "horizontal",
                  },
                  initialValue: "internal",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "internal",
                  title: "Internal Route",
                  type: "string",
                  hidden: ({ parent }) => parent?.type !== "internal",
                  options: {
                    list: [
                      { title: "Home", value: "/" },
                      { title: "Training", value: "/training" },
                      { title: "Shop", value: "/shop" },
                      { title: "Media", value: "/media" },
                      { title: "Media — Discography", value: "/media/discography" },
                      { title: "Media — Video", value: "/media/video" },
                      { title: "Media — Reviews", value: "/media/reviews" },
                      { title: "Media — Gallery", value: "/media/gallery" },
                      { title: "Catalogue", value: "/catalogue" },
                      { title: "Articles", value: "/articles" },
                      { title: "About Salim", value: "/about" },
                    ],
                    layout: "dropdown",
                  },
                  validation: (Rule) =>
                    Rule.custom((value, context) => {
                      const parent = context.parent as
                        | { type?: string }
                        | undefined;
                      if (parent?.type === "internal" && !value) {
                        return "Pick an internal route.";
                      }
                      return true;
                    }),
                }),
                defineField({
                  name: "external",
                  title: "External URL",
                  type: "url",
                  description:
                    "Full URL starting with https:// — opens in a new tab.",
                  hidden: ({ parent }) => parent?.type !== "external",
                  validation: (Rule) =>
                    Rule.uri({
                      scheme: ["https"],
                      allowRelative: false,
                    }).custom((value, context) => {
                      const parent = context.parent as
                        | { type?: string }
                        | undefined;
                      if (parent?.type === "external" && !value) {
                        return "Enter a full https:// URL.";
                      }
                      return true;
                    }),
                }),
              ],
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
