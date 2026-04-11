import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
      description: "The Maestro's full biography with rich text formatting.",
    }),
    defineField({
      name: "shortIntro",
      title: "Short Introduction",
      type: "text",
      rows: 3,
      description: "Brief tagline shown in the hero area of the About page.",
    }),
    defineField({
      name: "pullQuote",
      title: "Pull Quote",
      type: "string",
      description: "A signature quote displayed prominently.",
    }),
  ],
  preview: {
    select: { media: "profileImage" },
    prepare({ media }) {
      return { title: "About Salim Dada", media };
    },
  },
});
