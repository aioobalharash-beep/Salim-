import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PressGrid, { type PressItem } from "@/components/PressGrid";
import { client } from "@/sanity/client";
import { pressListQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Press — Salim Dada",
  description:
    "Selected press quotes and coverage of Salim Dada's work across publications.",
};

export const revalidate = 60;

export default async function PressPage() {
  let items: PressItem[] = [];
  try {
    items = (await client.fetch<PressItem[]>(pressListQuery)) ?? [];
  } catch {
    items = [];
  }

  return (
    <>
      <PageHeader
        tag="Press"
        title="Press"
        description="Selected quotes and coverage — reflections on the work from across publications and stages."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <PressGrid items={items} />
      </section>
    </>
  );
}
