import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ShopCard from "@/components/ShopCard";
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

type ShopImage = SanityImageSource & { alt?: string; originalUrl?: string };

type ShopItem = {
  _id: string;
  title: string;
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
      const url =
        img.originalUrl ||
        (() => {
          try {
            return urlFor(img).width(1200).fit("max").auto("format").url();
          } catch {
            return null;
          }
        })();
      if (!url) return null;
      return { url, alt: img.alt || item.title };
    })
    .filter((s): s is ShopSlide => s !== null);
}

export default async function ShopPage() {
  const items = await getShopItems();

  return (
    <>
      <PageHeader
        tag="Collection"
        title="Shop"
        description="Scores, tabs, and books — published works available for purchase through Sonitus Edizioni and partner editions."
      />

      <section className="px-4 max-w-7xl mx-auto pb-32">
        {items.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant max-w-xl">
            New publications are being prepared. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch justify-items-center sm:justify-items-stretch">
            {items.map((item) => (
              <ShopCard
                key={item._id}
                productId={item._id}
                title={item.title}
                priceText={item.priceText}
                description={item.description}
                purchaseUrl={item.purchaseUrl}
                slides={buildSlides(item)}
                additionalInfo={item.additionalInfo}
                audioTracks={item.audioTracks}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
