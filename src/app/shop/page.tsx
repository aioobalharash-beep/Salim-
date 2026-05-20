import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShopGrid, {
  type ShopCategory,
  type ShopGridItem,
} from "@/components/ShopGrid";
import type { ShopSlide } from "@/components/ShopCarousel";
import type { ShopAudioTrack, ShopInfoRow } from "@/components/ShopModal";
import { client } from "@/sanity/client";
import { urlFor, type SanityImageSource } from "@/sanity/image";
import { shopListQuery } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Salim Dada",
  description:
    "Scores, tabs, and books by Salim Dada — available through Sonitus Edizioni and partner publishers.",
};

type ShopImage = SanityImageSource & { alt?: string };

type ShopItem = {
  _id: string;
  title: string;
  category?: ShopCategory;
  year?: number;
  priceText: string;
  description?: string;
  purchaseUrl: string;
  images?: ShopImage[];
  additionalInfo?: ShopInfoRow[];
  audioTracks?: ShopAudioTrack[];
};

async function getShopItems(): Promise<ShopItem[]> {
  try {
    return (await client.fetch<ShopItem[]>(shopListQuery)) ?? [];
  } catch {
    return [];
  }
}

function buildSlides(item: ShopItem): ShopSlide[] {
  const images = item.images ?? [];
  return images
    .map((img) => {
      try {
        return {
          url: urlFor(img).width(1200).fit("max").auto("format").url(),
          alt: img.alt || item.title,
        };
      } catch {
        return null;
      }
    })
    .filter((s): s is ShopSlide => s !== null);
}

export default async function ShopPage() {
  const items = await getShopItems();
  const gridItems: ShopGridItem[] = items.map((item) => ({
    _id: item._id,
    title: item.title,
    priceText: item.priceText,
    description: item.description,
    purchaseUrl: item.purchaseUrl,
    slides: buildSlides(item),
    additionalInfo: item.additionalInfo,
    audioTracks: item.audioTracks,
    category: item.category,
    year: item.year,
  }));

  return (
    <>
      <PageHeader
        tag="Collection"
        title="Shop"
        description="Scores, tabs, and books — published works available for purchase through Sonitus Edizioni and partner editions."
      />

      <section className="px-4 max-w-7xl mx-auto pb-32">
        {gridItems.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant max-w-xl">
            New publications are being prepared. Please check back soon.
          </p>
        ) : (
          <ShopGrid items={gridItems} />
        )}
      </section>
    </>
  );
}
