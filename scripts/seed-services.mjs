/**
 * Seed the high-converting Services funnel content.
 *
 * Creates the 5 backend documents that drive the new /services hub:
 *   1. servicesPage  — the master "Services" directory singleton (header,
 *                      banner, promo block, FAQ, inquiry toggle).
 *   2-5. servicePage — four clean template landing-page entries:
 *        • Music Composition   → /services/music-composition
 *        • Composer Program    → /services/composer-program
 *        • Artistic Direction  → /services/artistic-direction
 *        • Cultural Expertise  → /services/cultural-expertise
 *
 * The four landing pages are created with `createIfNotExists`, so re-running
 * the script never clobbers edits an editor has already made in Backstage.
 * The directory singleton uses `createIfNotExists` too (fixed id), so its
 * authored copy survives subsequent runs.
 *
 * Usage:
 *   # 1. Provide credentials (or put them in .env.local — auto-loaded below):
 *   export NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
 *   export NEXT_PUBLIC_SANITY_DATASET=production
 *   export SANITY_API_TOKEN=<token with Editor/write access>
 *
 *   # 2. Preview the plan (no writes):
 *   node scripts/seed-services.mjs
 *
 *   # 3. Apply it:
 *   node scripts/seed-services.mjs --commit
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

/* ── Minimal .env loader (no extra dependency) ──────────────────────── */
for (const file of [".env.local", ".env"]) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const COMMIT = process.argv.includes("--commit");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!projectId || projectId === "your-project-id") {
  console.error("✗ NEXT_PUBLIC_SANITY_PROJECT_ID is not set.");
  process.exit(1);
}
if (!token) {
  console.error(
    "✗ A write token is required. Set SANITY_API_TOKEN (Editor permission).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/* ── 1 · Master directory singleton ─────────────────────────────────── */
const servicesPageDoc = {
  _id: "servicesPage",
  _type: "servicesPage",
  title: "Services",
  subheader:
    "Music composition, composer mentorship, artistic direction, and cultural expertise — professional offerings tailored to your artistic vision and production requirements.",
  promo: {
    title: "Free 20-Minute Written Work Consultation",
    subtitle:
      "Submit your scores, compositions, or project details for a direct professional review and live strategic breakdown with Salim Dada.",
    ctaLabel: "Book a consultation",
    ctaLink: "/#enquiry-section",
  },
  faqs: [
    {
      _type: "faqItem",
      _key: "faq-process",
      question: "How does a commission or engagement begin?",
      answer:
        "Every collaboration starts with a conversation. Share your vision through the inquiry form and you will receive a tailored proposal outlining scope, timeline, and terms.",
    },
    {
      _type: "faqItem",
      _key: "faq-timeline",
      question: "What are typical timelines?",
      answer:
        "Timelines depend on scope — from a few weeks for focused work to several months for large-scale productions. Indicative dates are agreed before any project begins.",
    },
    {
      _type: "faqItem",
      _key: "faq-remote",
      question: "Do you work internationally and remotely?",
      answer:
        "Yes. Engagements are delivered worldwide, combining remote collaboration with on-site presence where a production requires it.",
    },
  ],
  showInquiry: true,
};

/* ── 2-5 · Four clean landing-page template entries ──────────────────── */
const tally =
  "https://tally.so/embed/dWz4jo?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

function landingTemplate({ id, title, slug, order, summary, headline, sub }) {
  return {
    _id: id,
    _type: "servicePage",
    title,
    slug: { _type: "slug", current: slug },
    order,
    summary,
    hero: {
      headline: headline,
      subheadline: sub,
    },
    howItWorks: {
      title: "How It Works",
      body: [
        {
          _type: "block",
          _key: "hiw-intro",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "hiw-intro-span",
              text: "Describe the process for this service here, step by step.",
              marks: [],
            },
          ],
        },
      ],
    },
    socialProof: {
      title: "Trusted Worldwide",
      content: [
        {
          _type: "block",
          _key: "sp-intro",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "sp-intro-span",
              text: "Add testimonials, credentials, and selected references here. You can intertwine images and pull-quote callouts within this canvas.",
              marks: [],
            },
          ],
        },
      ],
    },
    cta: {
      headline: "Ready to begin?",
      tallyUrl: tally,
    },
  };
}

const landingDocs = [
  landingTemplate({
    id: "servicePage-music-composition",
    title: "Music Composition",
    slug: "music-composition",
    order: 1,
    summary:
      "Custom commissions for orchestra, ensemble, soloist, film, opera, theatre, ballet, and large-scale cultural events — original works tailored to your artistic vision.",
    headline: "Music Composition",
    sub: "Original works, composed for your vision and production.",
  }),
  landingTemplate({
    id: "servicePage-composer-program",
    title: "Composer Program",
    slug: "composer-program",
    order: 2,
    summary:
      "Mentorship and professional support for advanced and emerging composers — from score editing to orchestral recording — drawing on 30 years of international practice.",
    headline: "Composer Program",
    sub: "Mentorship and professional support for the working composer.",
  }),
  landingTemplate({
    id: "servicePage-artistic-direction",
    title: "Artistic Direction",
    slug: "artistic-direction",
    order: 3,
    summary:
      "Strategic and creative leadership for international festivals, cultural institutions, and mega shows — from concept development to full project management.",
    headline: "Artistic Direction",
    sub: "Creative leadership for festivals, institutions, and mega shows.",
  }),
  landingTemplate({
    id: "servicePage-cultural-expertise",
    title: "Cultural Expertise",
    slug: "cultural-expertise",
    order: 4,
    summary:
      "Advisory, capacity building, and technical reports on cultural diversity, cultural policies, creative industries, and the impact of digital technologies and AI on culture.",
    headline: "Cultural Expertise",
    sub: "Advisory and technical expertise on culture and creative industries.",
  }),
];

async function main() {
  console.log(
    `\n${COMMIT ? "APPLYING" : "DRY RUN"} — seeding Services funnel into "${dataset}"\n`,
  );

  const plan = [
    { kind: "createIfNotExists (singleton)", doc: servicesPageDoc },
    ...landingDocs.map((doc) => ({ kind: "createIfNotExists", doc })),
  ];

  for (const { kind, doc } of plan) {
    console.log(`  • ${doc._type.padEnd(13)} ${doc._id}  [${kind}]`);
  }

  if (!COMMIT) {
    console.log(
      "\nNo changes written. Re-run with --commit to create these documents.\n",
    );
    return;
  }

  const tx = client.transaction();
  tx.createIfNotExists(servicesPageDoc);
  for (const doc of landingDocs) tx.createIfNotExists(doc);
  await tx.commit();

  console.log(`\n✓ Done. Created up to ${plan.length} documents.\n`);
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
