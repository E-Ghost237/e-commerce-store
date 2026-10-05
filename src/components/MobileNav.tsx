"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Close, Menu } from "./Icons";

type NavItem = { href: string; label: string };

export function MobileNav({ items, cartCount, supportEmail }: { items: NavItem[]; cartCount: number; supportEmail: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white/70 text-ink md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </button>

      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-[60] animate-fade-in bg-paper md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-display text-lg">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/12 bg-white/70"
            >
              <Close className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col px-5 pt-2">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                /* A time-based entrance, not the scroll-driven `.reveal`: a fixed overlay never scrolls,
                   so a view() timeline could leave the links hidden. */
                className="animate-fade-up border-b border-ink/8 py-5 font-display text-3xl tracking-[-0.02em]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3 px-5">
            <Link href="/cart" onClick={() => setOpen(false)} className="inline-flex items-center justify-between rounded-2xl bg-ink px-5 py-4 text-sm font-semibold text-paper">
              <span>Your cart</span>
              <span>
                {cartCount} item{cartCount === 1 ? "" : "s"}
              </span>
            </Link>
            <a href={`mailto:${supportEmail}`} className="rounded-2xl border border-ink/12 px-5 py-4 text-sm font-semibold text-ink/70">
              {supportEmail}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
