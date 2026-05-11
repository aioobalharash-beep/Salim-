import { defineType, defineField } from "sanity";

export const INSTRUMENTATION_OPTIONS: { title: string; value: string }[] = [
  { title: "Symphony Orchestra", value: "Symphony Orchestra" },
  { title: "Wind & Military Orchestra", value: "Wind & Military Orchestra" },
  { title: "Chamber Orchestra", value: "Chamber Orchestra" },
  { title: "Strings", value: "Strings" },
  { title: "Winds", value: "Winds" },
  { title: "Voice", value: "Voice" },
  { title: "Takht Arabi", value: "Takht Arabi" },
  { title: "Hybrid Ensemble", value: "Hybrid Ensemble" },
  { title: "Guitar", value: "Guitar" },
  { title: "Piano", value: "Piano" },
  { title: "Electronics", value: "Electronics" },
  { title: "Other", value: "Other" },
];

export const GENRE_OPTIONS: { title: string; value: string }[] = [
  { title: "Symphonic Works", value: "Symphonic Works" },
  { title: "Chamber Music", value: "Chamber Music" },
  { title: "Vocal Forms", value: "Vocal Forms" },
  { title: "Soundtrack", value: "Soundtrack" },
  { title: "Solo Music", value: "Solo Music" },
  { title: "Traditional & Mixed Ensemble", value: "Traditional & Mixed Ensemble" },
  { title: "Contemporary Song", value: "Contemporary Song" },
  { title: "Arrangement & Orchestration", value: "Arrangement & Orchestration" },
  { title: "Didactic Music", value: "Didactic Music" },
  { title: "Other", value: "Other" },
];

export default defineType({
  name: "catalogue",
  title: "Catalogue",
  type: "document",
  icon: () => "🎼",
  groups: [
    { name: "basic", title: "Basic Info", default: true },
    { name: "categorization", title: "Categorization" },
    { name: "technical", title: "Technical" },
    { name: "premiere", title: "World Premiere" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ── Basic Info ────────────────────────────────────────────── */
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      group: "basic",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "basic",
      description: "Year of composition (e.g. '2021' or '2018–2020').",
    }),

    /* ── Categorization ────────────────────────────────────────── */
    defineField({
      name: "instrumentation",
      title: "Instrumentation",
      type: "string",
      group: "categorization",
      options: {
        list: INSTRUMENTATION_OPTIONS,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "genre",
      title: "Genre",
      type: "string",
      group: "categorization",
      options: {
        list: GENRE_OPTIONS,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    /* ── Technical ─────────────────────────────────────────────── */
    defineField({
      name: "durationMinutes",
      title: "Duration (Total Minutes)",
      type: "number",
      group: "technical",
      description: "Used for filtering & sorting. Round to the nearest minute.",
      validation: (Rule) => Rule.min(0).max(600),
    }),
    defineField({
      name: "durationDisplay",
      title: "Duration (Display)",
      type: "string",
      group: "technical",
      description: "Human-readable duration shown on the card (e.g. '1h 20m', '12'').",
    }),
    defineField({
      name: "movements",
      title: "Movements",
      type: "number",
      group: "technical",
      description: "Total number of movements in the work.",
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      group: "technical",
      initialValue: false,
      description: "Toggle visibility on the public catalogue page.",
    }),

    /* ── World Premiere ────────────────────────────────────────── */
    defineField({
      name: "premiereDate",
      title: "Premiere Date",
      type: "date",
      group: "premiere",
    }),
    defineField({
      name: "premierePlace",
      title: "Premiere Place",
      type: "string",
      group: "premiere",
    }),
    defineField({
      name: "performers",
      title: "Performers",
      type: "text",
      rows: 3,
      group: "premiere",
    }),

    /* ── Media ─────────────────────────────────────────────────── */
    defineField({
      name: "watchLink",
      title: "Watch Link",
      type: "url",
      group: "media",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
      group: "media",
      options: { accept: "audio/*" },
    }),

    /* ── SEO ────────────────────────────────────────────────────── */
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seoSettings",
      group: "seo",
    }),

    /* ── Catalogue Slug (used for canonical URLs) ─────────────── */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "seo",
      options: { source: "title", maxLength: 96 },
      description:
        "URL-friendly identifier used as a stable anchor on the Catalogue page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      genre: "genre",
      published: "published",
    },
    prepare({ title, subtitle, genre, published }) {
      const status = published ? "Published" : "Unpublished";
      const meta = [subtitle, genre, status].filter(Boolean).join(" · ");
      return { title, subtitle: meta };
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
    {
      title: "Title (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Duration (Longest)",
      name: "durationDesc",
      by: [{ field: "durationMinutes", direction: "desc" }],
    },
    {
      title: "Duration (Shortest)",
      name: "durationAsc",
      by: [{ field: "durationMinutes", direction: "asc" }],
    },
    {
      title: "Movements (Most)",
      name: "movementsDesc",
      by: [{ field: "movements", direction: "desc" }],
    },
    {
      title: "Movements (Fewest)",
      name: "movementsAsc",
      by: [{ field: "movements", direction: "asc" }],
    },
  ],
});
