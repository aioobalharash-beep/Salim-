import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "timeline",
  title: "Timeline",
  type: "document",
  icon: () => "🪧",
  description:
    "Each document is a single chronological entry on the About-page timeline. Stack every milestone that happened in that period inside the Milestones array — the stem renders one date indicator with all of its milestones grouped beneath it.",
  fields: [
    defineField({
      name: "year",
      title: "Year / Period",
      type: "string",
      description:
        "Flexible date header — a single year (\"1975\"), a range (\"2025-2026\"), or an ongoing status (\"2026 - present\"). Start the value with the 4-digit start year so the timeline sorts chronologically.",
      validation: (Rule) =>
        Rule.required()
          // Enforce one document per period so the stem never renders duplicate
          // date circles.
          .custom(async (year, context) => {
            if (!year) return true;
            const { document, getClient } = context;
            const client = getClient({ apiVersion: "2024-01-01" });
            const id = (document?._id || "").replace(/^drafts\./, "");
            const isUnique = await client.fetch(
              `!defined(*[_type == "timeline" && year == $year && !(_id in [$draft, $published])][0]._id)`,
              {
                year,
                draft: `drafts.${id}`,
                published: id,
              },
            );
            return isUnique
              ? true
              : "Another timeline block already uses this period.";
          }),
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      description:
        "Every distinct milestone that occurred in this year. They stack cleanly inside the single year bracket.",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          title: "Milestone",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description:
                "e.g. 'UNESCO International Cultural Expert'. Typed exactly as it should appear (case is preserved).",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              description:
                "Short descriptive summary, e.g. 'Integration of the EU/UNESCO Expert Facility…'.",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              description: "e.g. 'Paris & Barcelona'.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "location" },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { year: "year", milestones: "milestones" },
    prepare({ year, milestones }) {
      const count = Array.isArray(milestones) ? milestones.length : 0;
      return {
        title: year ? String(year) : "Untitled year",
        subtitle: `${count} milestone${count === 1 ? "" : "s"}`,
      };
    },
  },
  orderings: [
    {
      title: "Year (Newest)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Year (Oldest)",
      name: "yearAsc",
      by: [{ field: "year", direction: "asc" }],
    },
  ],
});
