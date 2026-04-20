import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { discographyListQuery } from "@/sanity/queries";
import Discography from "@/components/Discography";

export const metadata: Metadata = {
  title: "Discography — Salim Dada",
  description:
    "Albums and singles by Salim Dada — compositions, field recordings, and orchestral works.",
};

export const revalidate = 60;

export default async function DiscographyPage() {
  let releases = [];
  try {
    releases = (await client.fetch(discographyListQuery)) ?? [];
  } catch {
    // Sanity unavailable — gallery will show seed data
  }

  return (
    <div className="min-h-screen pt-44 pb-40">
      <section className="max-w-3xl mx-auto px-6 md:px-8 mb-16">
        <h1 className="font-serif-brand text-[1.65rem] md:text-[1.85rem] font-normal text-on-surface tracking-tight">
          Discography
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-8">
        <div className="border-t border-primary/15" />
        <Discography releases={releases} />
      </section>
    </div>
  );
}
