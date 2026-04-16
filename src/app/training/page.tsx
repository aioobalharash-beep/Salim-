import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import TrainingGrid from "@/components/TrainingGrid";
import { client } from "@/sanity/client";
import { servicesQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function TrainingPage() {
  const services = await client.fetch(servicesQuery).catch(() => []);

  return (
    <>
      <PageHeader
        tag="Pedagogy"
        title="Training & Masterclasses"
        description="Advanced masterclasses for orchestral conductors and soloists focusing on interpretive emotional depth, precision, and the rich intersection of Mediterranean musical traditions."
      />

      {/* Hero Image */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24">
        <div className="aspect-[21/9] w-full overflow-hidden rounded relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI"
            alt="Concert hall with warm wooden architecture set for an orchestral masterclass"
            fill
            sizes="100vw"
            className="object-cover grayscale brightness-90"
            priority
          />
        </div>
      </section>

      <TrainingGrid items={services ?? []} />
    </>
  );
}
