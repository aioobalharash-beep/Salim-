import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "timeline",
  title: "Timeline",
  type: "document",
  icon: () => "🪧",
  description:
    "Each document is a single chronological YEAR on the About-page timeline. Stack every milestone that happened in that year inside the Milestones array — the stem renders one year indicator with all of its milestones grouped beneath it.",
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description:
        "The unique year for this block (e.g., 2026). Used to sort the stem chronologically.",
      validation: (Rule) =>
        Rule.required()
          .integer()
          .min(1900)
          .max(2100)
          // Enforce one document per year so the stem never renders duplicate
          // year circles.
          .custom(async (year, context) => {
            if (year === undefined || year === null) return true;
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
            return isUnique ? true : "Another timeline block already uses this year.";
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
