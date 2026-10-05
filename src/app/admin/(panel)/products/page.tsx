import Link from "next/link";
import { PageTitle, StatusBadge } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { AdminProduct } from "@/lib/admin-types";
import { formatMoney } from "@/lib/money";
import type { Paginated } from "@/lib/types";

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q : "";
  const products = await adminApi<Paginated<AdminProduct>>(`/products?per_page=48${search ? `&q=${encodeURIComponent(search)}` : ""}`);

  return (
    <>
      <PageTitle title="Products"><Link href="/admin/products/new" className={ui.buttonPrimary}>New product</Link></PageTitle>
      <form className="mb-4 flex gap-2"><label className="sr-only" htmlFor="q">Search</label><input id="q" name="q" className={ui.input} defaultValue={search} placeholder="Search by name" /><button className={ui.buttonGhost}>Search</button></form>
      <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-white shadow-soft">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ink text-left text-paper"><tr>{["Product", "Status", "Variants", "Price", "Cost"].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink/8">
            {products.data.map((product) => (
              <tr key={product.id}>
                <td className="px-3 py-2 font-bold"><Link className="underline" href={`/admin/products/${product.id}`}>{product.name}</Link></td>
                <td className="px-3 py-2"><StatusBadge status={product.status} /></td>
                <td className="px-3 py-2">{product.variants.map((variant) => variant.sku).join(", ")}</td>
                <td className="px-3 py-2">{product.variants.map((variant) => formatMoney(variant.price_cents)).join(" / ")}</td>
                <td className="px-3 py-2">{product.variants.map((variant) => formatMoney(variant.unit_cost_cents)).join(" / ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
