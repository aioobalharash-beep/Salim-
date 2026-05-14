import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { client } from "@/sanity/client";
import { videoListQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Video — Salim Dada",
  description:
    "Performances, interviews, and visual archives of Salim Dada.",
};

export const revalidate = 60;

interface VideoItem {
  _id: string;
  videoLink: string;
  description: string;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      return null;
    }
    if (host.endsWith("vimeo.com")) {
      if (host === "player.vimeo.com") return url;
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
}

export default async function VideoPage() {
  let videos: VideoItem[] = [];
  try {
    videos = (await client.fetch<VideoItem[]>(videoListQuery)) ?? [];
  } catch {
    videos = [];
  }

  return (
    <>
      <PageHeader
        tag="Archive"
        title="Video"
        description="Performances, interviews, and visual archives — moving images from the stage and the studio."
      />

      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto pb-32">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20">
          {videos.map((v) => {
            const embed = toEmbedUrl(v.videoLink);
            return (
              <li key={v._id} className="flex flex-col">
                <div className="relative w-full aspect-video bg-on-surface/5 overflow-hidden">
                  {embed ? (
                    <iframe
                      src={embed}
                      title="Video"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : null}
                </div>
                {v.description && (
                  <p className="mt-6 font-body text-base leading-relaxed text-on-surface-variant whitespace-pre-line text-center">
                    {v.description}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
