import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { galleryListQuery } from "@/sanity/queries";
import Gallery, { type GalleryItem } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Gallery — Salim Dada",
  description:
    "A borderless collage of stage, studio, and field imagery from Salim Dada's artistic practice.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  try {
    items = (await client.fetch<GalleryItem[]>(galleryListQuery)) ?? [];
  } catch {
    items = [];
  }

  return (
    <main className="w-full">
      <Gallery items={items} />
    </main>
  );
}
