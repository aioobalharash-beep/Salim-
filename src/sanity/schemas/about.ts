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
      name: "imageCaption",
      title: "Image Caption / Photographer Credit",
      type: "string",
      description:
        "Small caption shown below the profile image (e.g. photographer credit or archive label).",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      description:
        "The big centered quote/heading at the top of the About page.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      description:
        "Subtitle rendered directly underneath the big centered hero title.",
    }),
    defineField({
      name: "bioTitle",
      title: "Biography Title",
      type: "string",
      description:
        "Heading shown directly above the biography text, next to the portrait.",
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
    defineField({
      name: "bio",
      title: "Short Biography",
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
      description: "Brief biography shown alongside the portrait.",
    }),
    defineField({
      name: "mainBio",
      title: "Long-Form Biography",
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
      description:
        "Extended narrative biography with full rich text — displayed in the dedicated long-form section.",
    }),
    defineField({
      name: "timelineTitle",
      title: "Timeline Title",
      type: "string",
      description:
        "Heading shown above the chronology timeline (replaces the hardcoded 'A Chronology of Precision').",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
    }),
  ],
  preview: {
    select: { media: "profileImage" },
    prepare({ media }) {
      return { title: "About Salim Dada", media };
    },
  },
});
