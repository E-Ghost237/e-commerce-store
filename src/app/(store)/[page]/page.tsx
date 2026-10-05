import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Chat, Paw, Shield, Truck } from "@/components/Icons";
import { ui } from "@/components/ui";
import { site, type InfoPageKey } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(site.pages).map((page) => ({ page }));
}

function pageFor(key: string) {
  return key in site.pages ? site.pages[key as InfoPageKey] : null;
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const { page } = await params;
  const content = pageFor(page);
  return content ? { title: content.title, description: content.blurb, alternates: { canonical: `/${page}` } } : {};
}

const helpLinks = [
  { href: "/tracking", label: "Track your order", body: "Status and carrier events for a shipped parcel." },
  { href: "/#faq", label: "Common questions", body: "Refills, fabrics, returns and checkout." },
  { href: "/returns", label: "Returns & refunds", body: "Thirty days from delivery, no restocking fee." },
];

export default async function InfoPage({ params }: PageProps<"/[page]">) {
  const { page } = await params;
  const content = pageFor(page);
  if (!content) {
    notFound();
  }

  return (
    <article className="pb-4">
      <header className="border-b border-ink/8 bg-linen">
        <div className={`${ui.container} py-14 sm:py-20`}>
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink/50">
            <Link className="hover:text-ink" href="/">
              Home
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink/70">{content.title}</span>
          </nav>
          <p className={`${ui.eyebrow} mt-6`}>{site.brand}</p>
          <h1 className={`${ui.h1} mt-4`}>{content.title}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink/65">{content.blurb}</p>
        </div>
      </header>

      <div className={`${ui.container} mt-12 grid gap-12 lg:grid-cols-[1.45fr_0.55fr] lg:gap-16`}>
        <div className="prose-page max-w-2xl">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {page === "contact" && (
            <p className="mt-8">
              <a className={ui.buttonPrimary} href={`mailto:${site.supportEmail}`}>
                <Paw className="h-4 w-4" />
                E-mail {site.supportEmail}
              </a>
            </p>
          )}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-28 lg:self-start">
          <div className={`${ui.card} p-6`}>
            <h2 className="font-display text-lg">Need a hand?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
              Write to{" "}
              <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>{" "}
              and a person answers, usually within one business day.
            </p>
            <ul className="mt-5 grid gap-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-start justify-between gap-3 rounded-2xl bg-linen/70 p-4 hover:bg-linen">
                    <span>
                      <span className="block text-[13px] font-semibold">{link.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink/55">{link.body}</span>
                    </span>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink/40 transition group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid gap-3 rounded-3xl bg-linen p-6 text-[13px] text-ink/65">
            <li className="flex items-center gap-3">
              <Truck className="h-4.5 w-4.5 text-sage" /> US delivery with tracking
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-4.5 w-4.5 text-sage" /> Secure checkout by Stripe
            </li>
            <li className="flex items-center gap-3">
              <Chat className="h-4.5 w-4.5 text-sage" /> Support that replies
            </li>
          </ul>
        </aside>
      </div>
    </article>
  );
}
