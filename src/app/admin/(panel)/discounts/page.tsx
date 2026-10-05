import Link from "next/link";
import { PageTitle, StatusBadge } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { AdminDiscount } from "@/lib/admin-types";
import { formatMoney } from "@/lib/money";
import type { Paginated } from "@/lib/types";

export default async function DiscountsPage() {
  const discounts = await adminApi<Paginated<AdminDiscount>>("/discounts");

  return (
    <>
      <PageTitle title="Discounts"><Link href="/admin/discounts/new" className={ui.buttonPrimary}>New discount</Link></PageTitle>
      <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ink text-left text-paper"><tr>{["Code", "Value", "Minimum", "Used", "Window", "Status"].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink/8">
            {discounts.data.map((discount) => (
              <tr key={discount.id}>
                <td className="px-3 py-2 font-mono font-bold"><Link className="underline" href={`/admin/discounts/${discount.id}`}>{discount.code}</Link></td>
                <td className="px-3 py-2">{discount.type === "fixed" ? formatMoney(discount.value) : `${discount.value}%`}{discount.product_ids || discount.bundle_ids ? " (scoped)" : ""}</td>
                <td className="px-3 py-2">{formatMoney(discount.minimum_subtotal_cents)}</td>
                <td className="px-3 py-2">{discount.usage_count}{discount.usage_limit ? ` / ${discount.usage_limit}` : ""}</td>
                <td className="px-3 py-2">{discount.starts_at?.slice(0, 10) ?? "…"} → {discount.ends_at?.slice(0, 10) ?? "…"}</td>
                <td className="px-3 py-2"><StatusBadge status={discount.active ? "active" : "archived"} /></td>
              </tr>
            ))}
            {discounts.data.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center">No discounts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
