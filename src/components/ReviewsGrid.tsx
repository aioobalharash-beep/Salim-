"use client";

import { useEffect, useState } from "react";

export interface ReviewItem {
  _id: string;
  content: string;
  sourceText: string;
  place?: string;
  year: string;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ReviewsGrid({ items }: { items: ReviewItem[] }) {
  const [ordered, setOrdered] = useState<ReviewItem[]>(items);

  useEffect(() => {
    setOrdered(shuffle(items));
  }, [items]);

  if (ordered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {ordered.map((r) => {
        const meta = [r.place, r.year].filter(Boolean).join(", ");
        return (
          <article
            key={r._id}
            className="relative p-8 bg-surface-container-low border border-primary/20 flex flex-col min-h-[200px]"
          >
            <p className="font-body text-sm leading-[1.8] text-on-surface-variant/80 pr-4 pb-20">
              {r.content}
            </p>
            <div className="absolute bottom-6 right-6 text-right">
              <p className="font-body italic text-xs text-on-surface/70">
                {r.sourceText}
              </p>
              {meta && (
                <p className="font-body text-[11px] text-on-surface/50 mt-1">
                  {meta}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
