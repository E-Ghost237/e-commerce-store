import type { Metadata } from "next";
import { Truck } from "@/components/Icons";
import { TrackingLookup } from "@/components/TrackingLookup";
import { ui } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Track your order", alternates: { canonical: "/tracking" } };

export default async function TrackingPage({ searchParams }: PageProps<"/tracking">) {
  const { order } = await searchParams;

  return (
    <div className={`${ui.container} max-w-4xl py-12 sm:py-16`}>
      <div className="max-w-2xl">
        <span className="grid h-12 w-12 place-items-center rounded-3xl bg-mint text-forest">
          <Truck className="h-5.5 w-5.5" />
        </span>
        <p className={`${ui.eyebrow} mt-5`}>Order status</p>
        <h1 className={`${ui.h1} mt-3 text-[2.25rem] sm:text-5xl`}>Track your order.</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink/65">
          Enter your order number (it starts with CC-) and the e-mail you used at checkout. Tracking appears here the moment the parcel ships.
        </p>
      </div>

      <div className="mt-10">
        <TrackingLookup initialOrder={typeof order === "string" ? order.slice(0, 40) : ""} />
      </div>

      <p className="mt-10 rounded-3xl bg-linen p-5 text-sm leading-relaxed text-ink/65">
        Lost the order number? Search your inbox for {site.brand} — the confirmation e-mail includes it. If you still can&apos;t find it, write to{" "}
        <a className="link-underline font-semibold text-ember" href={`mailto:${site.supportEmail}`}>
          {site.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
