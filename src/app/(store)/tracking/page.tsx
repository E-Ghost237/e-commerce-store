import type { Metadata } from "next";
import { TrackingLookup } from "@/components/TrackingLookup";
import { ui } from "@/components/ui";

export const metadata: Metadata = { title: "Track your order", alternates: { canonical: "/tracking" } };

export default async function TrackingPage({ searchParams }: PageProps<"/tracking">) {
  const { order } = await searchParams;

  return (
    <div className={`${ui.container} max-w-3xl py-10`}>
      <h1 className={`${ui.h1} mb-8`}>Track your order</h1>
      <TrackingLookup initialOrder={typeof order === "string" ? order.slice(0, 40) : ""} />
    </div>
  );
}
