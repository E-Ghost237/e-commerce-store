"use client";

import { useEffect, useState } from "react";
import { ui } from "./ui";

/**
 * Phone-sized buy bar. It only appears once the shopper has scrolled past the gallery and links back to the
 * add-to-cart panel, so there is exactly one place an order can be started.
 */
export function StickyBuyBar({ price, cta }: { price: string; cta: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 px-4 pb-4 pt-3 backdrop-blur-xl transition-transform duration-300 ease-smooth md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none invisible translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-xl tabular-nums">{price}</p>
        <a href="#buy" className={`${ui.buttonAccent} flex-1 py-3.5`}>
          {cta}
        </a>
      </div>
    </div>
  );
}
