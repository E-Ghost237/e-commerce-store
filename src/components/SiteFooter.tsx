import Link from "next/link";
import { site } from "@/content/site";
import { Logo, Refresh, Shield, Truck } from "./Icons";
import { ui } from "./ui";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/#bundles", label: "Kits & bundles" },
      { href: "/#shop", label: "All products" },
      { href: "/#how", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/tracking", label: "Track your order" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns & refunds" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of sale" },
    ],
  },
];

const reassurances = [
  { Icon: Truck, label: "US delivery with tracking" },
  { Icon: Refresh, label: "30-day returns" },
  { Icon: Shield, label: "Secure checkout by Stripe" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest text-paper">
      <div className={`${ui.container} grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20`}>
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9 text-paper" />
            <span className="font-display text-[1.35rem] leading-none">{site.brand}</span>
          </Link>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/70">{site.description}</p>
          <ul className="mt-8 grid gap-3 text-sm text-paper/75">
            {reassurances.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon className="h-4.5 w-4.5 text-paper/50" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-paper/60">
            Questions? Write to{" "}
            <a className="link-underline text-paper" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
            .
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/45">{column.title}</h2>
              <ul className="mt-4 grid gap-3 text-sm text-paper/80">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-paper/12">
        <div className={`${ui.container} flex flex-col gap-3 py-6 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between`}>
          <p>
            © {new Date().getFullYear()} {site.brand}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span className="text-paper/40">Payments handled by Stripe</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
