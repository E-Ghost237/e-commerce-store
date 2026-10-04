import Link from "next/link";
import { site } from "@/content/site";
import { readCart } from "@/lib/cart";
import { ui } from "./ui";

export async function SiteHeader() {
  const cart = await readCart().catch(() => null);
  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="border-b-2 border-ink bg-paper">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-coral focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className={`${ui.container} flex items-center justify-between gap-4 py-4`}>
        <Link className="text-xl font-black tracking-[-0.08em]" href="/">
          {site.brand.toUpperCase()}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-bold md:flex">
          <Link href="/#shop">Shop</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/tracking">Track order</Link>
          <Link href="/contact">Support</Link>
        </nav>
        <Link className="border-2 border-ink bg-coral px-4 py-2 text-sm font-black" href="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
          Cart · {count}
        </Link>
      </div>
    </header>
  );
}
