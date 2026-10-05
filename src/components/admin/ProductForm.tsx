import type { AdminProduct } from "@/lib/admin-types";
import { saveProduct } from "@/app/admin/actions";
import { ActionForm } from "./ActionForm";
import { Field, Select, TextArea } from "./Field";
import { ui } from "../ui";

const dollars = (cents: number | null | undefined) => (cents === null || cents === undefined ? "" : (cents / 100).toFixed(2));

export function ProductForm({ product }: { product: AdminProduct | null }) {
  const variants = [...(product?.variants ?? []), null];
  const image = product?.images[0];

  return (
    <ActionForm action={saveProduct.bind(null, product?.id ?? null)} submitLabel={product ? "Save product" : "Create product"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <Field label="Slug (URL)" name="slug" defaultValue={product?.slug} required pattern="[a-z0-9-]+" hint="Lowercase letters, numbers and dashes." />
        <Select label="Status" name="status" defaultValue={product?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="active">Active (visible)</option>
          <option value="archived">Archived</option>
        </Select>
        <Field label="SEO title" name="seo_title" defaultValue={product?.seo_title ?? ""} />
        <div className="sm:col-span-2"><TextArea label="Description" name="description" defaultValue={product?.description ?? ""} /></div>
        <div className="sm:col-span-2"><TextArea label="SEO description" name="seo_description" defaultValue={product?.seo_description ?? ""} /></div>
        <input type="hidden" name="image_url_original" value={image?.url ?? ""} />
        {(product?.images ?? []).slice(1).map((other) => <input key={other.id} type="hidden" name="other_image_url" value={other.url} />)}
        <Field label="Main image URL" name="image_url" type="url" defaultValue={image?.url ?? ""} hint={product && product.images.length > 1 ? `Gallery: ${product.images.length} pictures. Changing this only replaces the main one.` : undefined} />
        <Field label="Image alt text" name="image_alt" defaultValue={image?.alt_text ?? ""} />
      </div>

      <fieldset className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft">
        <legend className="px-2 font-black">Variants</legend>
        <p className="mb-3 text-sm">Changing a price starts a new price from now; past orders keep the price they were sold at. Leave the last row empty to add nothing.</p>
        <div className="grid gap-3">
          {variants.map((variant, index) => (
            <div key={variant?.id ?? `new-${index}`} className="grid gap-2 border-b border-stone-300 pb-3 sm:grid-cols-[1fr_1fr_120px_110px_110px]">
              <input type="hidden" name="variant_id" value={variant?.id ?? ""} />
              <div><label className="sr-only" htmlFor={`sku-${index}`}>SKU</label><input id={`sku-${index}`} className={ui.input} name="variant_sku" placeholder="SKU" defaultValue={variant?.sku ?? ""} /></div>
              <div><label className="sr-only" htmlFor={`vname-${index}`}>Variant name</label><input id={`vname-${index}`} className={ui.input} name="variant_name" placeholder={variant ? "Name" : "New variant name"} defaultValue={variant?.name ?? ""} /></div>
              <div>
                <label className="sr-only" htmlFor={`vstatus-${index}`}>Variant status</label>
                <select id={`vstatus-${index}`} className={ui.input} name="variant_status" defaultValue={variant?.status ?? "draft"}>
                  <option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option>
                </select>
              </div>
              <div><label className="sr-only" htmlFor={`vprice-${index}`}>Price (USD)</label><input id={`vprice-${index}`} className={ui.input} name="variant_price" inputMode="decimal" placeholder="Price $" defaultValue={dollars(variant?.price_cents)} /></div>
              <div><label className="sr-only" htmlFor={`vcost-${index}`}>Landed cost (USD)</label><input id={`vcost-${index}`} className={ui.input} name="variant_cost" inputMode="decimal" placeholder="Cost $" defaultValue={dollars(variant?.unit_cost_cents)} /></div>
            </div>
          ))}
        </div>
      </fieldset>
    </ActionForm>
  );
}
