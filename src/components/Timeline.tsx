import { client } from "@/sanity/client";
import { timelineQuery } from "@/sanity/queries";

/* ── Types — mirror src/sanity/schemas/timeline.ts ─────────────────── */
interface Milestone {
  title: string;
  description?: string | null;
  location?: string | null;
}

interface YearBlock {
  _id: string;
  year: number;
  milestones: Milestone[];
}

/* Legacy shape: the flat chronology array still embedded on the About
 * document. Used as a graceful fallback until content is migrated to the
 * dedicated `timeline` documents. */
export interface LegacyEntry {
  year: string;
  title: string;
  description?: string;
}

async function getTimeline(): Promise<YearBlock[]> {
  try {
    return (await client.fetch<YearBlock[]>(timelineQuery)) ?? [];
  } catch {
    return [];
  }
}

/* Collapse the flat legacy entries into the nested year→milestones model so
 * the same single-stem layout renders regardless of the data source. */
function groupLegacy(entries: LegacyEntry[]): YearBlock[] {
  const byYear = new Map<string, YearBlock>();
  for (const entry of entries) {
    const key = entry.year;
    if (!byYear.has(key)) {
      byYear.set(key, {
        _id: key,
        year: parseInt(key, 10) || 0,
        milestones: [],
      });
    }
    byYear.get(key)!.milestones.push({
      title: entry.title,
      description: entry.description,
    });
  }
  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

function MilestoneItem({
  milestone,
  alignRight,
}: {
  milestone: Milestone;
  alignRight: boolean;
}) {
  return (
    <div className={`max-w-sm ${alignRight ? "md:ml-auto" : ""}`}>
      <h4 className="font-headline text-base md:text-lg leading-snug text-on-surface mb-1">
        {milestone.title}
      </h4>
      {milestone.location && (
        <p className="font-label text-[10px] tracking-[0.18em] text-primary/60 mb-1.5">
          {milestone.location}
        </p>
      )}
      {milestone.description && (
        <p className="font-body text-sm leading-relaxed text-on-surface-variant/60">
          {milestone.description}
        </p>
      )}
    </div>
  );
}

export default async function Timeline({
  fallback = [],
}: {
  fallback?: LegacyEntry[];
}) {
  const fetched = await getTimeline();
  const blocks = fetched.length > 0 ? fetched : groupLegacy(fallback);

  if (blocks.length === 0) return null;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Central vertical line — Bronze at 40% for clear visibility on Ivory */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/40 md:-translate-x-px" />

      <div className="space-y-0">
        {blocks.map((block, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div
              key={block._id}
              className="relative grid grid-cols-1 md:grid-cols-2"
            >
              {/* ── ONE geometric year indicator on the stem ── */}
              <div className="absolute left-4 md:left-1/2 top-[14px] md:top-[18px] w-[7px] h-[7px] -translate-x-[3px] md:-translate-x-[3.5px] rounded-full bg-primary ring-[3px] ring-background z-10" />

              {/* ── Single year block — alternates sides on desktop ── */}
              <div
                className={`pl-12 md:pl-0 pb-10 md:pb-14 ${
                  isLeft
                    ? "md:pr-16 md:text-right"
                    : "md:col-start-2 md:pl-16 md:text-left"
                }`}
              >
                <span className="font-serif-brand font-bold text-2xl md:text-3xl text-primary block leading-none mb-5">
                  {block.year}
                </span>

                {/* Stack every milestone inside this single chronological bracket */}
                <div className="space-y-6">
                  {block.milestones.map((milestone, j) => (
                    <MilestoneItem
                      key={j}
                      milestone={milestone}
                      alignRight={isLeft}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
