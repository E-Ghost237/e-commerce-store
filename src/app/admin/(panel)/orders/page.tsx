import Link from "next/link";
import { PageTitle, StatusBadge } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { AdminOrder } from "@/lib/admin-types";
import { formatMoney } from "@/lib/money";
import type { Paginated } from "@/lib/types";

const PAYMENT = ["PENDING", "PAID", "FAILED", "PARTIALLY_REFUNDED", "REFUNDED"];
const FULFILMENT = ["UNFULFILLED", "QUEUED", "SUBMITTING", "SUBMITTED", "PROCESSING", "SHIPPED", "DELIVERED", "FAILED", "CANCELLED", "DELIVERY_EXCEPTION"];

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["q", "payment_status", "fulfillment_status", "page"] as const) {
    const value = params[key];
    if (typeof value === "string" && value !== "") {
      query.set(key, value);
    }
  }
  const orders = await adminApi<Paginated<AdminOrder>>(`/orders?${query}`);
  const page = orders.meta?.current_page ?? 1;
  const pageLink = (target: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(target));
    return `/admin/orders?${next}`;
  };

  return (
    <>
      <PageTitle title="Orders" />
      <form className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
        <div>
          <label className={ui.label} htmlFor="q">Order number, e-mail or tracking</label>
          <input id="q" name="q" className={ui.input} defaultValue={query.get("q") ?? ""} />
        </div>
        <div>
          <label className={ui.label} htmlFor="payment_status">Payment</label>
          <select id="payment_status" name="payment_status" className={ui.input} defaultValue={query.get("payment_status") ?? ""}>
            <option value="">Any</option>
            {PAYMENT.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        <div>
          <label className={ui.label} htmlFor="fulfillment_status">Fulfilment</label>
          <select id="fulfillment_status" name="fulfillment_status" className={ui.input} defaultValue={query.get("fulfillment_status") ?? ""}>
            <option value="">Any</option>
            {FULFILMENT.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>
        <button className={ui.buttonPrimary}>Search</button>
      </form>

      <div className="overflow-x-auto rounded-3xl border border-ink/10 bg-white shadow-soft">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-ink text-left text-paper">
            <tr>{["Order", "Placed", "Customer", "Total", "Payment", "Fulfilment", "Tracking"].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {orders.data.map((order) => (
              <tr key={order.id} className="hover:bg-linen">
                <td className="px-3 py-2 font-bold"><Link className="underline" href={`/admin/orders/${order.id}`}>{order.number}</Link></td>
                <td className="px-3 py-2">{new Date(order.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</td>
                <td className="px-3 py-2">{order.email}</td>
                <td className="px-3 py-2 tabular-nums">{formatMoney(order.total_cents, order.currency)}</td>
                <td className="px-3 py-2"><StatusBadge status={order.payment_status} /></td>
                <td className="px-3 py-2"><StatusBadge status={order.fulfillment_status} /></td>
                <td className="px-3 py-2 font-mono text-xs">{order.fulfillments.flatMap((fulfillment) => fulfillment.shipments.map((shipment) => shipment.tracking_number)).filter(Boolean).join(", ") || "—"}</td>
              </tr>
            ))}
            {orders.data.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center">No orders match.</td></tr>}
          </tbody>
        </table>
      </div>
      <nav aria-label="Pagination" className="mt-4 flex items-center gap-3 text-sm font-bold">
        {page > 1 && <Link className={ui.buttonGhost} href={pageLink(page - 1)}>← Previous</Link>}
        <span>Page {page} of {orders.meta?.last_page ?? 1} · {orders.meta?.total ?? orders.data.length} orders</span>
        {page < (orders.meta?.last_page ?? 1) && <Link className={ui.buttonGhost} href={pageLink(page + 1)}>Next →</Link>}
      </nav>
    </>
  );
}
