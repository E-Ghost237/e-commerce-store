import Link from "next/link";
import { site } from "@/content/site";
import { readCart } from "@/lib/cart";
import { Logo, Paw, Refresh, Shield, Truck } from "./Icons";
import { MobileNav } from "./MobileNav";
import { ui } from "./ui";

const navigation = [
  { href: "/#bundles", label: "Kits" },
  { href: "/#shop", label: "Shop" },
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/tracking", label: "Track order" },
];

const announcementIcons = [Truck, Refresh, Paw, Shield];

export async function SiteHeader() {
  const cart = await readCart().catch(() => null);
  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper">
        Skip to content
      </a>

      <div className="bg-ink text-paper">
        <div className={`${ui.container} flex items-center justify-center gap-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em]`}>
          {site.announcement.map((item, index) => {
            const Icon = announcementIcons[index % announcementIcons.length];
            return (
              <span key={item} className={index === 0 ? "inline-flex items-center gap-2" : "hidden items-center gap-2 sm:inline-flex"}>
                <Icon className="h-3.5 w-3.5 opacity-70" />
                {item}
              </span>
            );
          })}
        </div>
      </div>

      <div className="sticky top-0 z-50 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
        <div className={`${ui.container} flex h-16 items-center justify-between gap-4 sm:h-18`}>
          <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label={`${site.brand} — home`}>
            <Logo className="h-9 w-9" />
            <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em]">{site.brand}</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium text-ink/75 md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="link-underline hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a href={`mailto:${site.supportEmail}`} className="hidden text-sm font-medium text-ink/60 hover:text-ink lg:block">
              Support
            </a>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ember"
            >
              <span className="hidden sm:block">Cart</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-paper/20 px-1 text-[11px] tabular-nums">{count}</span>
            </Link>
            <MobileNav items={navigation} cartCount={count} supportEmail={site.supportEmail} />
          </div>
        </div>
      </div>
    </header>
  );
}
