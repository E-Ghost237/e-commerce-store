import type { ProductVideo as Video } from "@/lib/types";

/** Product demonstration video: muted, inline and loaded on demand so it never delays the page. */
export function ProductVideo({ video, label, className = "" }: { video: Video; label: string; className?: string }) {
  const portrait = video.width !== null && video.height !== null && video.height > video.width;

  return (
    <video
      className={`w-full bg-ink object-contain ${portrait ? "aspect-[9/16] max-h-[80vh]" : video.width === video.height ? "aspect-square" : "aspect-video"} ${className}`}
      controls
      muted
      playsInline
      preload="none"
      poster={video.poster_url ?? undefined}
      aria-label={label}
    >
      <source src={video.url} type={video.mime_type ?? "video/mp4"} />
    </video>
  );
}
