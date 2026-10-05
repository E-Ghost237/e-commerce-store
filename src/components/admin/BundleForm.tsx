import { saveBundle } from "@/app/admin/actions";
import type { AdminProduct } from "@/lib/admin-types";
import type { Bundle } from "@/lib/types";
import { ActionForm } from "./ActionForm";
import { Field, Select, TextArea } from "./Field";
import { ui } from "../ui";

export function BundleForm({ bundle, products }: { bundle: Bundle | null; products: AdminProduct[] }) {
  const rows = [...(bundle?.items ?? []), null, null];
  const variants = products.flatMap((product) => product.variants.map((variant) => ({ id: variant.id, label: `${product.name} · ${variant.name} (${variant.sku})` })));

  return (
    <ActionForm action={saveBundle.bind(null, bundle?.id ?? null)} submitLabel={bundle ? "Save bundle" : "Create bundle"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={bundle?.name} required />
        <Field label="Slug" name="slug" defaultValue={bundle?.slug} required pattern="[a-z0-9-]+" />
        <Field label="Bundle price (USD)" name="price" inputMode="decimal" defaultValue={bundle ? (bundle.price_cents / 100).toFixed(2) : ""} required />
        <Field label="Badge" name="badge" defaultValue={bundle?.badge ?? ""} placeholder="Best value" />
        <Field label="Display order" name="sort_order" type="number" min={0} defaultValue={bundle?.sort_order ?? 0} />
        <Select label="Status" name="status" defaultValue={bundle?.status ?? "draft"}>
          <option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option>
        </Select>
        <div className="sm:col-span-2"><TextArea label="Description" name="description" defaultValue={bundle?.description ?? ""} /></div>
      </div>
      <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft">
        <legend className="px-2 font-black">Contents</legend>
        <p className="mb-3 text-sm">Past orders keep the contents they were sold with.</p>
        <div className="grid gap-2">
          {rows.map((item, index) => (
            <div key={item?.product_variant_id ?? `new-${index}`} className="grid gap-2 sm:grid-cols-[1fr_100px]">
              <div>
                <label className="sr-only" htmlFor={`item-${index}`}>Variant</label>
                <select id={`item-${index}`} className={ui.input} name="item_variant" defaultValue={item?.product_variant_id ?? ""}>
                  <option value="">—</option>
                  {variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}
                </select>
              </div>
              <div>
                <label className="sr-only" htmlFor={`qty-${index}`}>Quantity</label>
                <input id={`qty-${index}`} className={ui.input} name="item_quantity" type="number" min={1} max={25} defaultValue={item?.quantity ?? 1} />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </ActionForm>
  );
}
