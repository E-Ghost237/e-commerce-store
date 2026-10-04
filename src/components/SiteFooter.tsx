import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "./ui";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-2 border-ink">
      <div className={`${ui.container} grid gap-6 py-8 text-sm sm:grid-cols-[1fr_auto]`}>
        <div>
          <p className="font-black">{site.brand}</p>
          <p className="mt-1 max-w-md">{site.description}</p>
          <p className="mt-3">
            Help: <a className="underline" href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </p>
        </div>
        <nav aria-label="Policies" className="flex flex-wrap gap-x-5 gap-y-2 font-bold">
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/tracking">Track order</Link>
        </nav>
      </div>
      <p className={`${ui.container} pb-8 text-xs`}>© {new Date().getFullYear()} {site.brand} · US delivery · Secure checkout by Stripe</p>
    </footer>
  );
}
