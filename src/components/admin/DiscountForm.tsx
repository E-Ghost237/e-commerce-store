import { saveDiscount } from "@/app/admin/actions";
import type { AdminDiscount, AdminProduct } from "@/lib/admin-types";
import type { Bundle } from "@/lib/types";
import { ActionForm } from "./ActionForm";
import { Field, Select } from "./Field";

const localDateTime = (value: string | null) => (value ? value.slice(0, 16) : "");

export function DiscountForm({ discount, products, bundles }: { discount: AdminDiscount | null; products: AdminProduct[]; bundles: Bundle[] }) {
  const isFixed = discount?.type === "fixed";

  return (
    <ActionForm action={saveDiscount.bind(null, discount?.id ?? null)} submitLabel={discount ? "Save discount" : "Create discount"}>
      {discount && <input type="hidden" name="type" value={discount.type} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Code" name="code" defaultValue={discount?.code} required={!discount} disabled={Boolean(discount)} pattern="[A-Za-z0-9_-]+" hint={discount ? "Codes cannot change once created." : "Letters, numbers, dashes."} />
        <Select label="Type" name="type" defaultValue={discount?.type ?? "percentage"} disabled={Boolean(discount)}>
          <option value="percentage">Percentage off eligible items</option>
          <option value="fixed">Fixed amount off eligible items</option>
        </Select>
        <Field label={discount ? (isFixed ? "Amount off (USD)" : "Percent off (1-100)") : "Value (percent, or USD for fixed)"} name="value" inputMode="decimal" defaultValue={discount ? (isFixed ? (discount.value / 100).toFixed(2) : String(discount.value)) : ""} required />
        <Field label="Minimum cart subtotal (USD)" name="minimum" inputMode="decimal" defaultValue={discount ? (discount.minimum_subtotal_cents / 100).toFixed(2) : "0"} />
        <Field label="Usage limit (blank = unlimited)" name="usage_limit" type="number" min={1} defaultValue={discount?.usage_limit ?? ""} />
        <div className="flex items-end gap-3 pb-2"><input id="active" type="checkbox" name="active" className="h-5 w-5 accent-ink" defaultChecked={discount?.active ?? true} /><label htmlFor="active" className="font-bold">Active</label></div>
        <Field label="Starts (UTC)" name="starts_at" type="datetime-local" defaultValue={localDateTime(discount?.starts_at ?? null)} />
        <Field label="Ends (UTC)" name="ends_at" type="datetime-local" defaultValue={localDateTime(discount?.ends_at ?? null)} />
      </div>
      <fieldset className="grid gap-4 border-2 border-ink p-4 sm:grid-cols-2">
        <legend className="px-2 font-black">Scope (leave empty for the whole cart)</legend>
        <Select label="Products" name="product_ids" multiple size={Math.min(6, Math.max(2, products.length))} defaultValue={(discount?.product_ids ?? []).map(String)}>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </Select>
        <Select label="Bundles" name="bundle_ids" multiple size={Math.min(6, Math.max(2, bundles.length))} defaultValue={(discount?.bundle_ids ?? []).map(String)}>
          {bundles.map((bundle) => <option key={bundle.id} value={bundle.id}>{bundle.name}</option>)}
        </Select>
      </fieldset>
      {discount && <p className="text-sm">Used {discount.usage_count} time{discount.usage_count === 1 ? "" : "s"}. Deactivate instead of deleting; history is kept.</p>}
    </ActionForm>
  );
}
