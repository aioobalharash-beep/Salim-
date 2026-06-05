/**
 * One-off migration: legacy duration fields -> single `duration` (seconds).
 *
 * Older catalogue documents stored duration across two fields:
 *   - durationMinutes : number  (whole minutes)
 *   - durationDisplay : string  (free text, e.g. "4'30", "12'", "1h 20m")
 *
 * The schema now uses a single integer field `duration`, expressed in SECONDS.
 * This script backfills `duration` for every catalogue document and removes the
 * obsolete fields — so you never have to re-enter anything by hand.
 *
 * For each document it derives the value in this order of preference:
 *   1. existing `duration` (already migrated — left untouched)
 *   2. durationMinutes * 60
 *   3. parsed from durationDisplay ("4'30" -> 270, "12'" -> 720, "1h 20m" -> 4800)
 *
 * Usage:
 *   # 1. Provide credentials (or put them in .env.local — auto-loaded below):
 *   export NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
 *   export NEXT_PUBLIC_SANITY_DATASET=production
 *   export SANITY_API_TOKEN=<token with Editor/write access>
 *
 *   # 2. Preview the plan (no writes):
 *   node scripts/migrate-duration.mjs
 *
 *   # 3. Apply it:
 *   node scripts/migrate-duration.mjs --commit
 *
 * Create the write token at https://www.sanity.io/manage -> API -> Tokens
 * (Editor permission). It is only needed to RUN the migration, not for the site.
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

/**
 * Parse a legacy human-readable duration string into total seconds.
 * Handles: "4'30" (4m30s), "12'" (12m), "1h 20m", "15m", "90 min", "45s".
 * Returns null when nothing recognisable is found.
 */
function parseDisplayToSeconds(display) {
  if (typeof display !== "string") return null;
  const s = display.trim();
  if (!s) return null;

  let total = 0;
  let matched = false;

  const h = s.match(/(\d+)\s*h/i);
  if (h) {
    total += parseInt(h[1], 10) * 3600;
    matched = true;
  }

  // Minutes: "20m", "15 min", or a prime mark "12'".
  const m = s.match(/(\d+)\s*(?:m(?:in)?|')/i);
  if (m) {
    total += parseInt(m[1], 10) * 60;
    matched = true;
  }

  // Seconds: digits directly after a prime ("4'30") or an explicit "30s".
  const primeSec = s.match(/'\s*(\d{1,2})\b/);
  if (primeSec) {
    total += parseInt(primeSec[1], 10);
    matched = true;
  } else {
    const sec = s.match(/(\d+)\s*s\b/i);
    if (sec) {
      total += parseInt(sec[1], 10);
      matched = true;
    }
  }

  return matched ? total : null;
}

function deriveSeconds(doc) {
  if (typeof doc.duration === "number") {
    return { seconds: doc.duration, source: "already-migrated" };
  }
  if (typeof doc.durationMinutes === "number") {
    return { seconds: Math.round(doc.durationMinutes * 60), source: "minutes" };
  }
  const parsed = parseDisplayToSeconds(doc.durationDisplay);
  if (parsed !== null) {
    return { seconds: parsed, source: `display "${doc.durationDisplay}"` };
  }
  return { seconds: null, source: "none" };
}

async function main() {
  const docs = await client.fetch(
    `*[_type == "catalogue" && (defined(durationMinutes) || defined(durationDisplay))]{
      _id, title, duration, durationMinutes, durationDisplay
    }`,
  );

  console.log(
    `\n${COMMIT ? "APPLYING" : "DRY RUN"} — ${docs.length} document(s) carry legacy duration fields.\n`,
  );

  if (docs.length === 0) {
    console.log("Nothing to migrate. ✓");
    return;
  }

  const tx = client.transaction();
  let willSet = 0;
  let onlyCleanup = 0;
  const unresolved = [];

  for (const doc of docs) {
    const { seconds, source } = deriveSeconds(doc);
    const patch = client.patch(doc._id).unset(["durationMinutes", "durationDisplay"]);

    const needsSet = typeof doc.duration !== "number" && seconds !== null;
    if (needsSet) {
      patch.set({ duration: seconds });
      willSet += 1;
    } else if (typeof doc.duration === "number") {
      onlyCleanup += 1;
    }

    if (typeof doc.duration !== "number" && seconds === null) {
      unresolved.push(doc);
      // Still clean up the stale fields, but leave duration unset for manual entry.
    }

    const label =
      seconds === null
        ? "duration UNRESOLVED (left empty)"
        : `duration = ${seconds}s  [from ${source}]`;
    console.log(`  • ${doc.title ?? doc._id}: ${label}`);

    tx.patch(patch);
  }

  console.log(
    `\nSummary: ${willSet} to set, ${onlyCleanup} cleanup-only, ${unresolved.length} unresolved.`,
  );

  if (unresolved.length > 0) {
    console.log(
      "\n⚠ Could not parse a duration for the following — set them manually in Studio:",
    );
    for (const d of unresolved) {
      console.log(
        `    - ${d.title ?? d._id} (durationDisplay: ${JSON.stringify(d.durationDisplay)})`,
      );
    }
  }

  if (!COMMIT) {
    console.log("\nDry run only. Re-run with --commit to apply these changes.\n");
    return;
  }

  await tx.commit();
  console.log("\n✓ Migration committed.\n");
}

main().catch((err) => {
  console.error("\n✗ Migration failed:", err.message ?? err);
  process.exit(1);
});
