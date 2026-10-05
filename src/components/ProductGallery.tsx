"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { id: number; url: string; alt_text: string | null; is_primary?: boolean };

/**
 * Product gallery: one large frame plus thumbnails. Kept client-side so switching images costs no round trip.
 */
export function ProductGallery({ images, name, priority = false }: { images: GalleryImage[]; name: string; priority?: boolean }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) {
    return <div className="aspect-square w-full rounded-[2.5rem] border border-ink/10 bg-linen" />;
  }

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-ink/10 bg-linen">
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt_text ?? name}
          fill
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="animate-fade-in object-cover transition duration-700 hover:scale-105"
          preload={priority}
        />
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === active}
                className={`relative block aspect-square w-full overflow-hidden rounded-2xl border transition ${
                  index === active ? "border-ink" : "border-ink/10 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="12vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
