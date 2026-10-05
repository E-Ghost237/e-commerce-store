import { ActionForm } from "@/components/admin/ActionForm";
import { Field, PageTitle, Select, StatusBadge } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { AdminProduct, LaravelPage } from "@/lib/admin-types";
import { formatMoney } from "@/lib/money";
import type { Paginated } from "@/lib/types";
import { saveMapping, saveSupplier, syncMapping } from "../../actions";

type Supplier = { id: number; name: string; code: string; status: string; products_count: number };
type Mapping = {
  id: number;
  supplier_sku: string;
  warehouse: string | null;
  unit_cost_cents: number | null;
  stock_quantity: number | null;
  synced_at: string | null;
  supplier: { id: number; name: string; code: string };
  product_variant: { id: number; sku: string; name: string; status: string };
};

export default async function SuppliersPage() {
  const [suppliers, mappings, products] = await Promise.all([
    adminApi<{ data: Supplier[] }>("/suppliers"),
    adminApi<LaravelPage<Mapping>>("/supplier-products"),
    adminApi<Paginated<AdminProduct>>("/products?per_page=48"),
  ]);
  const variants = products.data.flatMap((product) => product.variants.map((variant) => ({ id: variant.id, label: `${product.name} · ${variant.name} (${variant.sku})` })));

  return (
    <>
      <PageTitle title="Suppliers & SKU mapping" />
      <section className="mb-8 grid gap-4 md:grid-cols-[1fr_1fr]">
        <ul className="grid h-fit gap-2">
          {suppliers.data.map((supplier) => (
            <li key={supplier.id} className={`${ui.card} flex items-center justify-between p-3`}>
              <span><strong>{supplier.name}</strong> <span className="font-mono text-xs">{supplier.code}</span></span>
              <span className="text-sm">{supplier.products_count} mapped · <StatusBadge status={supplier.status} /></span>
            </li>
          ))}
        </ul>
        <div className={`${ui.card} p-4`}>
          <h2 className="mb-3 font-black">Add supplier</h2>
          <ActionForm action={saveSupplier} submitLabel="Add supplier" tone="ghost" className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" name="name" required />
            <Field label="Code" name="code" required pattern="[A-Za-z0-9_-]+" hint="Matches COMMERCE_SUPPLIER." />
          </ActionForm>
        </div>
      </section>

      <h2 className="mb-3 text-xl font-black">Variant mappings</h2>
      <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-white shadow-soft">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-ink text-left text-paper"><tr>{["Variant", "Supplier", "Supplier SKU / warehouse / cost", "Stock", "Last sync", ""].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink/8 align-top">
            {mappings.data.map((mapping) => (
              <tr key={mapping.id}>
                <td className="px-3 py-2"><strong>{mapping.product_variant.sku}</strong><br />{mapping.product_variant.name}</td>
                <td className="px-3 py-2">{mapping.supplier.code}</td>
                <td className="px-3 py-2">
                  <ActionForm action={saveMapping.bind(null, mapping.id)} submitLabel="Save" tone="ghost" className="grid grid-cols-[1fr_60px_90px_auto] items-end gap-2">
                    <div><label className="sr-only" htmlFor={`sku-${mapping.id}`}>Supplier SKU</label><input id={`sku-${mapping.id}`} className={ui.input} name="supplier_sku" defaultValue={mapping.supplier_sku} required /></div>
                    <div><label className="sr-only" htmlFor={`wh-${mapping.id}`}>Warehouse</label><input id={`wh-${mapping.id}`} className={ui.input} name="warehouse" defaultValue={mapping.warehouse ?? ""} maxLength={2} /></div>
                    <div><label className="sr-only" htmlFor={`cost-${mapping.id}`}>Cost USD</label><input id={`cost-${mapping.id}`} className={ui.input} name="unit_cost" inputMode="decimal" defaultValue={mapping.unit_cost_cents === null ? "" : (mapping.unit_cost_cents / 100).toFixed(2)} /></div>
                  </ActionForm>
                </td>
                <td className="px-3 py-2 tabular-nums">{mapping.stock_quantity ?? "unknown"}</td>
                <td className="px-3 py-2">{mapping.synced_at ? new Date(mapping.synced_at).toLocaleString("en-US", { timeZone: "UTC" }) : "never"}<br /><span className="text-xs">cost {formatMoney(mapping.unit_cost_cents)}</span></td>
                <td className="px-3 py-2"><ActionForm action={syncMapping.bind(null, mapping.id)} submitLabel="Refresh stock" pendingLabel="Queuing…" tone="ghost" /></td>
              </tr>
            ))}
            {mappings.data.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center">No mappings yet. Unmapped variants cannot be sold.</td></tr>}
          </tbody>
        </table>
      </div>

      <section className={`${ui.card} mt-6 p-4`}>
        <h2 className="mb-3 font-black">Map a variant</h2>
        <ActionForm action={saveMapping.bind(null, null)} submitLabel="Add mapping" className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_80px_100px] md:items-end">
          <Select label="Variant" name="product_variant_id" required defaultValue="">
            <option value="" disabled>Choose…</option>
            {variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}
          </Select>
          <Select label="Supplier" name="supplier_id" required>
            {suppliers.data.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.code}</option>)}
          </Select>
          <Field label="Supplier SKU / vid" name="supplier_sku" required />
          <Field label="Warehouse" name="warehouse" maxLength={2} placeholder="US" />
          <Field label="Cost USD" name="unit_cost" inputMode="decimal" />
        </ActionForm>
      </section>
    </>
  );
}
