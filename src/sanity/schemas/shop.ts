import { defineType, defineField, defineArrayMember } from "sanity";

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
      name: "images",
      title: "Images",
      type: "array",
      description:
        "First image is used as the default cover. Add sample score pages, back cover, etc. — they appear in the inline carousel.",
      of: [
        {
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
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "priceText",
      title: "Price",
      type: "string",
      description:
        'Must follow format "30.00" or "22.50" (do not include currency letters or symbols here).',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d+\.\d{2}$/, { name: "priceText" })
          .error(
            'Must follow format "30.00" or "22.50" — digits, dot, two decimals, no currency.',
          ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "A brief product summary.",
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional Information",
      type: "array",
      description:
        "Dynamic table rows shown in the product pop-up. Add only the rows that apply to this product (e.g. Pages, Binding, ISMN).",
      of: [
        defineArrayMember({
          type: "object",
          name: "infoRow",
          title: "Info Row",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Left column, e.g. 'Pages', 'Binding', 'ISMN'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description:
                "Right column (rendered italicised), e.g. '28', 'Staple', '9790520250702'.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        }),
      ],
    }),
    defineField({
      name: "audioTracks",
      title: "Audio Tracks",
      type: "array",
      description:
        "Optional audio samples for this product. Each track shows in the product pop-up with the site audio player.",
      of: [
        defineArrayMember({
          type: "object",
          name: "audioTrack",
          title: "Audio Track",
          fields: [
            defineField({
              name: "trackTitle",
              title: "Track Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "trackDescription",
              title: "Track Description",
              type: "string",
              description: "Brief subtitle shown under the track title.",
            }),
            defineField({
              name: "audioFile",
              title: "Audio File",
              type: "file",
              options: { accept: "audio/*" },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "trackTitle", subtitle: "trackDescription" },
          },
        }),
      ],
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
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `€${subtitle}` : "No price set",
        media,
      };
    },
  },
});
