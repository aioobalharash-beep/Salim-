import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Master "Services" directory page.
 *
 * A singleton document that drives /services — the high-converting hub that
 * lists the four professional offerings and routes visitors to each dedicated
 * landing page. The four service cards themselves are authored as separate
 * `servicePage` documents; this document owns the surrounding furniture:
 * the centered header, the wide banner, a promotional module, an FAQ list, and
 * a toggle for the shared inquiry input panel.
 */
export default defineType({
  name: "servicesPage",
  title: "Services Page (Directory)",
  type: "document",
  icon: () => "✨",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "promo", title: "Promotional Block" },
    { name: "faq", title: "FAQ" },
    { name: "contact", title: "Inquiry" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Centered Header ───────────────────────────────────────── */
    defineField({
      name: "title",
      title: "Centered Title",
      type: "string",
      group: "header",
      description: "Main heading, centered at the very top of the page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheader",
      title: "Centered Sub-header",
      type: "text",
      rows: 2,
      group: "header",
      description: "Short introductory line shown centered beneath the title.",
    }),
    defineField({
      name: "bannerImage",
      title: "Large Horizontal Banner Image",
      type: "image",
      group: "header",
      options: { hotspot: true },
      description:
        "Wide banner stretched fully across the container, directly below the header.",
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

    /* ── Promotional Section ───────────────────────────────────── */
    defineField({
      name: "promo",
      title: "Promotional Section",
      type: "object",
      group: "promo",
      description:
        "Editorial promotional band rendered beneath the four service cards.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "image",
          title: "Image (optional)",
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
          name: "ctaLabel",
          title: "CTA Label",
          type: "string",
          description: "Button text, e.g. 'Book a consultation'.",
        }),
        defineField({
          name: "ctaLink",
          title: "CTA Link",
          type: "string",
          description: "URL or path the CTA button routes to.",
        }),
      ],
      preview: {
        select: { title: "title", subtitle: "subtitle", media: "image" },
        prepare({ title, subtitle, media }) {
          return { title: title || "Promotional Section", subtitle, media };
        },
      },
    }),

    /* ── FAQ ───────────────────────────────────────────────────── */
    defineField({
      name: "faqs",
      title: "FAQ",
      type: "array",
      group: "faq",
      description:
        "Collapsible questions & answers shown beside the inquiry panel.",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "Question",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "question", subtitle: "answer" },
          },
        }),
      ],
    }),

    /* ── Inquiry module toggle ─────────────────────────────────── */
    defineField({
      name: "showInquiry",
      title: "Show Inquiry Module",
      type: "boolean",
      group: "contact",
      initialValue: true,
      description:
        "Toggle the visibility of the universal inquiry input module (left side of the split panel).",
    }),

    /* ── SEO ───────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", media: "bannerImage" },
    prepare({ title, media }) {
      return { title: title || "Services Page", subtitle: "Directory", media };
    },
  },
});
