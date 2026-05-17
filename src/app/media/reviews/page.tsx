import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ReviewsGrid, { type ReviewItem } from "@/components/ReviewsGrid";
import { client } from "@/sanity/client";
import { reviewsListQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Reviews — Salim Dada",
  description:
    "Selected reviews and coverage of Salim Dada's work across publications.",
};

export const revalidate = 60;

export default async function ReviewsPage() {
  let items: ReviewItem[] = [];
  try {
    items = (await client.fetch<ReviewItem[]>(reviewsListQuery)) ?? [];
  } catch {
    items = [];
  }

  return (
    <>
      <PageHeader
        tag="Reviews"
        title="Reviews"
        description="Selected quotes and coverage — reflections on the work from across publications and stages."
      />

      <section className="px-8 sm:px-10 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <ReviewsGrid items={items} />
      </section>
    </>
  );
}
