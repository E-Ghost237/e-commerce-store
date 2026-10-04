import Link from "next/link";
import { PageTitle, StatusBadge } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import { formatMoney } from "@/lib/money";
import type { Bundle, Paginated } from "@/lib/types";

export default async function BundlesPage() {
  const bundles = await adminApi<Paginated<Bundle>>("/bundles");

  return (
    <>
      <PageTitle title="Bundles"><Link href="/admin/bundles/new" className={ui.buttonPrimary}>New bundle</Link></PageTitle>
      <ul className="grid gap-3">
        {bundles.data.map((bundle) => (
          <li key={bundle.id} className={`${ui.card} flex flex-wrap items-center justify-between gap-3 p-4`}>
            <div>
              <Link className="font-black underline" href={`/admin/bundles/${bundle.id}`}>{bundle.name}</Link>
              <p className="text-sm">{bundle.items.map((item) => `${item.quantity} × ${item.sku}`).join(" + ")}</p>
            </div>
            <div className="flex items-center gap-3"><span className="font-black">{formatMoney(bundle.price_cents)}</span><StatusBadge status={bundle.status} /></div>
          </li>
        ))}
        {bundles.data.length === 0 && <li>No bundles yet.</li>}
      </ul>
    </>
  );
}
