import Image from "next/image";
import { kvGet } from "@/lib/kv";

interface HeroPanel {
  id: string;
  subtitle: string;
  title: string;
  src: string;
  alt: string;
}

async function getHeroPanels(): Promise<HeroPanel[]> {
  return kvGet<HeroPanel[]>("hero", "hero.json");
}

export default async function Hero() {
  const panels = await getHeroPanels();

  return (
    <header className="pt-24 min-h-screen flex flex-col md:flex-row w-full overflow-hidden">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className="relative group flex-1 min-h-[409px] md:min-h-0 overflow-hidden cursor-pointer transition-all duration-700 hover:flex-[1.5]"
        >
          <Image
            src={panel.src}
            alt={panel.alt}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover grayscale transition-transform duration-1000 group-hover:scale-110 brightness-75 group-hover:brightness-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12">
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-surface/60 mb-2">
              {panel.subtitle}
            </p>
            <h2 className="font-serif-brand text-4xl text-surface font-light tracking-tight">
              {panel.title}
            </h2>
          </div>
        </div>
      ))}
    </header>
  );
}
