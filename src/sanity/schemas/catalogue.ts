import { defineType, defineField } from "sanity";

export const INSTRUMENTATION_OPTIONS: { title: string; value: string }[] = [
  { title: "Solo Instrument", value: "Solo Instrument" },
  { title: "Duo", value: "Duo" },
  { title: "Trio", value: "Trio" },
  { title: "Quartet", value: "Quartet" },
  { title: "Quintet", value: "Quintet" },
  { title: "Chamber Ensemble", value: "Chamber Ensemble" },
  { title: "Chamber Orchestra", value: "Chamber Orchestra" },
  { title: "Symphony Orchestra", value: "Symphony Orchestra" },
  { title: "Voice & Instrument", value: "Voice & Instrument" },
  { title: "Choir", value: "Choir" },
  { title: "Vocal Ensemble", value: "Vocal Ensemble" },
  { title: "Electronic / Electroacoustic", value: "Electronic / Electroacoustic" },
];

export const GENRE_OPTIONS: { title: string; value: string }[] = [
  { title: "Classical", value: "Classical" },
  { title: "Contemporary", value: "Contemporary" },
  { title: "Chamber Music", value: "Chamber Music" },
  { title: "Symphonic", value: "Symphonic" },
  { title: "Sacred / Liturgical", value: "Sacred / Liturgical" },
  { title: "Andalusian / Mediterranean", value: "Andalusian / Mediterranean" },
  { title: "Folk / Traditional", value: "Folk / Traditional" },
  { title: "Film / Stage Music", value: "Film / Stage Music" },
  { title: "Vocal / Choral", value: "Vocal / Choral" },
  { title: "Experimental", value: "Experimental" },
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
  ],
});
