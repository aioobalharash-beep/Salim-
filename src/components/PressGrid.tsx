"use client";

import { useEffect, useState } from "react";

export interface PressItem {
  _id: string;
  content: string;
  sourceText: string;
  date: string;
}

function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function PressGrid({ items }: { items: PressItem[] }) {
  const [ordered, setOrdered] = useState<PressItem[]>(items);

  useEffect(() => {
    setOrdered(shuffle(items));
  }, [items]);

  if (ordered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {ordered.map((p) => (
        <article
          key={p._id}
          className="relative p-8 bg-surface flex flex-col min-h-[180px]"
        >
          <p className="font-body text-sm leading-[1.8] text-on-surface-variant/80 pr-4 pb-16">
            {p.content}
          </p>
          <div className="absolute bottom-6 right-6 text-right">
            <p className="font-body italic text-xs text-on-surface/70">
              {p.sourceText}
            </p>
            <p className="font-label text-[10px] tracking-[0.15em] text-on-surface/50 mt-1">
              {formatDate(p.date)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
