import { defineType, defineField } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "object",
  options: { collapsible: true, collapsed: true },
  description:
    "Search engine and social-sharing metadata. If left blank, the page's main title and description are used as fallbacks.",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Title shown in Google search results and browser tabs. Aim for 50–60 characters.",
      validation: (Rule) =>
        Rule.max(60).warning("Meta titles longer than 60 characters get truncated by Google."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "Snippet shown beneath the title in search results. Aim for 140–160 characters.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Meta descriptions longer than 160 characters get truncated by Google."
        ),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Internal categorization tags. Also rendered as the meta-keywords tag for legacy crawlers.",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Preview image used when this page is shared on social media (Facebook, Twitter, LinkedIn, iMessage). Recommended size: 1200 × 630.",
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
  ],
});
