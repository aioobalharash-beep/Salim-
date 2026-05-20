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
  startTime?: number;
}

function toEmbedUrl(url: string, startTime?: number): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    let embed: string | null = null;
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      embed = id ? `https://www.youtube.com/embed/${id}` : null;
    } else if (host.endsWith("youtube.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        embed = id ? `https://www.youtube.com/embed/${id}` : null;
      } else if (u.pathname.startsWith("/embed/")) {
        embed = url;
      } else if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        embed = id ? `https://www.youtube.com/embed/${id}` : null;
      }
    } else if (host.endsWith("vimeo.com")) {
      if (host === "player.vimeo.com") {
        embed = url;
      } else {
        const id = u.pathname.split("/").filter(Boolean)[0];
        embed = id ? `https://player.vimeo.com/video/${id}` : null;
      }
    } else {
      embed = url;
    }

    if (!embed) return null;

    if (typeof startTime === "number" && Number.isFinite(startTime) && startTime > 0) {
      const start = Math.floor(startTime);
      const separator = embed.includes("?") ? "&" : "?";
      embed = `${embed}${separator}start=${start}`;
    }

    return embed;
  } catch {
    return null;
  }
}

export default async function VideoPage() {
  let videos: VideoItem[] = [];
  try {
    const fetched =
      (await client.fetch<(VideoItem | null)[] | null>(videoListQuery)) ?? [];
    videos = fetched.filter((v): v is VideoItem => !!v && !!v._id);
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
            const embed = toEmbedUrl(v.videoLink, v.startTime);
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
