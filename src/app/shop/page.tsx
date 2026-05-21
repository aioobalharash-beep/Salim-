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
    "Scores, albums, and books by Salim Dada — available for purchase.",
};

type ShopImage = SanityImageSource & {
  alt?: string;
  dimensions?: { width?: number; height?: number; aspectRatio?: number };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
};

type ShopItem = {
  _id: string;
  title: string;
  category?: ShopCategory;
  year?: number;
  month?: string;
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
    .map((img): ShopSlide | null => {
      try {
        // Sanity reports the SOURCE asset dimensions. If the editor cropped
        // the image in Studio, the delivered URL is cropped but
        // asset->metadata.dimensions still reflects the original. Apply the
        // crop rectangle here so the aspect ratio matches what actually
        // renders.
        const ow = img.dimensions?.width ?? 0;
        const oh = img.dimensions?.height ?? 0;
        const crop = img.crop;
        let vw = ow;
        let vh = oh;
        if (crop && ow > 0 && oh > 0) {
          vw = ow * (1 - (crop.left ?? 0) - (crop.right ?? 0));
          vh = oh * (1 - (crop.top ?? 0) - (crop.bottom ?? 0));
        }
        const aspectRatio =
          vw > 0 && vh > 0
            ? vw / vh
            : (img.dimensions?.aspectRatio ?? undefined);
        return {
          url: urlFor(img).width(1200).fit("max").auto("format").url(),
          alt: img.alt || item.title,
          aspectRatio,
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
    month: item.month,
  }));

  return (
    <>
      <PageHeader
        tag="Collection"
        title="Shop"
        description="Scores, albums, and books — published works available for purchase ."
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
