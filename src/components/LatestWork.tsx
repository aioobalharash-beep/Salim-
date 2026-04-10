import Image from "next/image";

const featured = {
  tag: "Paris, 2024",
  title: "The Mediterranean Symphony Cycle",
  description:
    "A multi-year archaeological musicology project commissioned by UNESCO, exploring the shared sonic heritage of North African and Southern European cultures.",
  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6r-Mctd1H1GECr_-W16XF8uRUjpmIeGtwRNv9zYhQIpSXjaA5GwKHNpFiSTpGvT7JZ85RJmxu5LJmwRgd0hrTzZ2AaemNWtEngXPXcbvIC8Kfz5Pai8YpXUQLmVDmuJlprTVDQQlcDZBHaswsMGm6L8crK8e0Y_LruCzHV4FX4T0-Kajy6RioqNxNyHk-YVerCOf_sObHQQvPETVoqLMyiCg1zHgD1U4XHVrKNItrC6koFlqKnj8_gM9qumec098Vdv8N3D8BADI",
  alt: "Modern concert hall with warm wooden architecture and a stage set for an orchestral performance",
};

const sideProjects = [
  {
    tag: "New Release",
    title: "Echoes of Algiers",
    description:
      "Solo guitar compositions recorded in the silence of the Casbah, utilizing natural room acoustics.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm8N-B8paqMsf-Qq--j02S8rM6pwRW5iYqhHbHQ3hj2godwwe3TKmYIsI7ej8NDw2AjUkqulg6_K2Q1hT1gSowt7saduB_gri2VVFY2gxrzqFoNt8s-dBXbPGE_N4z-KP3YAj6Fry0EDBpuzfDswB5IOIUFV9UORspEBbQ2RygTCs6h09hJn2y6IMwdj7PtZHsrjB-Qzkf5sH21qoeJbvm-WyKQ0inrbQeiEBuZAaVPlzzgWlS3oK86Y0f1SsEt64H_U4O2HbaH7Q",
    alt: "Microphone close up in a dark studio setting with soft glowing indicator lights",
    aspect: "aspect-square" as const,
    imageFirst: true,
  },
  {
    tag: "Scholarship",
    title: "The Trans-Saharan Scale",
    description:
      "An archival study on the migration of microtonal melodies from the Sahel to the Mediterranean coast.",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA2HzKVHVrZU6DMo9jGpg-hq9CrPTt2yR8306t0OXm2yM4T0dfOEedW2PPtbVEbZQLWxTWzziuGZ3jEzJsdT2NKBpfojGCzWJAyQ0s1b0_qdaB8wZxUUuxnVKNKP0MBKG5llqth2Ix3LWgkhT678AcgeGwhV_jikD4zMUmk3N1bQJZ_3How9am7KuP0OOKyOF4zNMNWUILr0xgwyBnra0d0arAmkFr0dRNos-rDU28KERJlBmB7rW-T4yl5Z38Gznb-0U53hioNps",
    alt: "Detailed close up of an ancient musical manuscript with handwritten notations and worn edges",
    aspect: "aspect-[4/3]" as const,
    imageFirst: false,
  },
];

const horizontal = {
  tag: "Heritage",
  title: "Reclaiming the Oud",
  description:
    "Documenting the master luthiers of the Maghreb and their influence on European lute construction.",
  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQncCtMO1LDFajAnhmh05zwIo_IQRwymL9y2EG3ceqtszirfBoTL70nYvS4bLIgIv_iONQu42Df7ta_GKfzf6T7l_lBBDOXEBsFXs5GMB6oSPVe7O433s8_gpm-LXrqwPK4FZW6yEK0rDPZ_EvlOZfSof6F5ozP2PJz20Qqv0tDNn_5VDCOJBBu3q5h6snC2z7Qcirlb61C7k1undiDIlwmVNMBDTN8ZkzBbGob-_MapKkypGt2t025qAPtNDusV1A4rZV9AJR3Y",
  alt: "Night view of a classical outdoor theatre with spotlights and architectural shadows",
};

export default function LatestWork() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
      {/* Section Header */}
      <div className="mb-20">
        <h3 className="font-headline text-3xl font-light mb-4">Latest Work</h3>
        <div className="w-16 h-[1px] bg-primary/30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Featured Large */}
        <div className="md:col-span-8 bg-surface-container-low p-8 rounded shadow-card">
          <div className="aspect-[16/9] w-full overflow-hidden mb-8 relative">
            <Image
              src={featured.src}
              alt={featured.alt}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover grayscale brightness-95"
            />
          </div>
          <div className="max-w-2xl">
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-4">
              {featured.tag}
            </p>
            <h4 className="font-serif-brand text-2xl mb-4">
              {featured.title}
            </h4>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant">
              {featured.description}
            </p>
          </div>
        </div>

        {/* Side Projects */}
        {sideProjects.map((project) => (
          <div
            key={project.title}
            className="md:col-span-4 bg-surface-container-low p-6 rounded shadow-card"
          >
            {project.imageFirst && (
              <div
                className={`${project.aspect} w-full overflow-hidden mb-6 relative`}
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale brightness-95"
                />
              </div>
            )}
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
              {project.tag}
            </p>
            <h4 className="font-serif-brand text-xl mb-3">{project.title}</h4>
            <p className="font-body text-xs leading-relaxed text-on-surface-variant mb-6">
              {project.description}
            </p>
            {!project.imageFirst && (
              <div
                className={`${project.aspect} w-full overflow-hidden relative`}
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale brightness-95"
                />
              </div>
            )}
          </div>
        ))}

        {/* Horizontal Card */}
        <div className="md:col-span-8 bg-surface-container-low p-8 rounded shadow-card flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 aspect-video overflow-hidden relative">
            <Image
              src={horizontal.src}
              alt={horizontal.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover grayscale brightness-95"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">
              {horizontal.tag}
            </p>
            <h4 className="font-serif-brand text-xl mb-3">
              {horizontal.title}
            </h4>
            <p className="font-body text-xs leading-relaxed text-on-surface-variant">
              {horizontal.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
