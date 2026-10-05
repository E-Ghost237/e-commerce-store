import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/ActionForm";
import { Field, PageTitle, Select, StatusBadge, TextArea } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { AdminOrder } from "@/lib/admin-types";
import { ApiError } from "@/lib/api";
import { formatMoney } from "@/lib/money";
import { addOrderNote, fulfillmentAction, refundOrder } from "../../../actions";

const when = (value: string | null | undefined) => (value ? `${new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC` : "—");

const ACTIONS_BY_STATUS: Record<string, string[]> = {
  QUEUED: ["hold", "cancel"],
  FAILED: ["retry", "hold", "cancel"],
  HOLD: ["release", "cancel"],
  SUBMITTED: ["cancel"],
  PROCESSING: ["cancel"],
  DELIVERY_EXCEPTION: ["retry", "cancel"],
};

export default async function OrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  let order: AdminOrder;
  try {
    order = (await adminApi<{ data: AdminOrder }>(`/orders/${Number(id)}`)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const paid = order.payments?.find((payment) => payment.status === "PAID");
  const refunded = (paid?.refunds ?? []).filter((refund) => ["PENDING", "REQUESTED", "SUCCEEDED"].includes(refund.status)).reduce((sum, refund) => sum + refund.amount_cents, 0);
  const refundable = paid && ["PAID", "PARTIALLY_REFUNDED"].includes(order.payment_status) ? paid.amount_cents - refunded : 0;
  const address = order.shipping_address;

  return (
    <>
      <PageTitle title={`Order ${order.number}`}>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={order.payment_status} />
          <StatusBadge status={order.fulfillment_status} />
          <StatusBadge status={order.status} />
        </div>
      </PageTitle>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-6">
          <section className={`${ui.card} p-5`}>
            <h2 className="mb-3 font-black">Items</h2>
            <table className="w-full text-sm">
              <thead className="text-left"><tr><th className="py-1">Item</th><th>Qty</th><th className="text-right">Cost/unit</th><th className="text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-ink/8">
                {order.items.map((item) => (
                  <tr key={item.sku}>
                    <td className="py-2">
                      <span className="font-bold">{item.name}</span> <span className="font-mono text-xs">{item.sku}</span>
                      {item.components && <ul className="text-xs">{item.components.map((component) => <li key={component.sku}>{component.quantity} × {component.name}</li>)}</ul>}
                    </td>
                    <td>{item.quantity}</td>
                    <td className="text-right">{formatMoney(item.unit_cost_cents)}</td>
                    <td className="text-right font-bold">{formatMoney(item.line_total_cents, order.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 grid grid-cols-2 gap-y-1 text-sm sm:w-72 sm:justify-self-end">
              <dt>Subtotal</dt><dd className="text-right">{formatMoney(order.subtotal_cents, order.currency)}</dd>
              <dt>Discount {order.discount_code && `(${order.discount_code})`}</dt><dd className="text-right">−{formatMoney(order.discount_cents, order.currency)}</dd>
              <dt>Shipping ({order.shipping_method ?? "—"})</dt><dd className="text-right">{formatMoney(order.shipping_cents, order.currency)}</dd>
              <dt className="font-black">Total</dt><dd className="text-right font-black">{formatMoney(order.total_cents, order.currency)}</dd>
            </dl>
          </section>

          {order.fulfillments.map((fulfillment) => (
            <section key={fulfillment.id} className={`${ui.card} p-5`}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-black">Fulfilment #{fulfillment.id}</h2>
                <StatusBadge status={fulfillment.status} />
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt>Supplier order</dt><dd className="font-mono">{fulfillment.supplier_order_id ?? "—"}</dd>
                <dt>Submitted</dt><dd>{when(fulfillment.submitted_at)}</dd>
                <dt>Attempts</dt><dd>{fulfillment.attempt_count ?? 0}</dd>
                {fulfillment.last_error && (<><dt>Last error</dt><dd className="font-bold text-red-700">{fulfillment.last_error}</dd></>)}
              </dl>
              {fulfillment.shipments.map((shipment) => (
                <div key={shipment.tracking_number ?? shipment.status} className="mt-4 border-t-2 border-ink pt-3 text-sm">
                  <p className="font-bold">{shipment.carrier ?? "Carrier"} · <span className="font-mono">{shipment.tracking_number}</span> · {shipment.status}</p>
                  <ol className="mt-2 grid gap-1">
                    {(shipment.events ?? []).map((event) => <li key={`${event.status}-${event.occurred_at}`}>{when(event.occurred_at)} · {event.status}{event.location ? ` · ${event.location}` : ""}</li>)}
                  </ol>
                </div>
              ))}
              {(ACTIONS_BY_STATUS[fulfillment.status] ?? []).length > 0 && (
                <div className="mt-5 border-t-2 border-ink pt-4">
                  <ActionForm action={fulfillmentAction.bind(null, fulfillment.id, order.id)} submitLabel="Apply" confirm="Apply this fulfilment action? It is recorded in the audit log." className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-end">
                    <Select label="Action" name="action" required>
                      {ACTIONS_BY_STATUS[fulfillment.status].map((action) => <option key={action} value={action}>{action}</option>)}
                    </Select>
                    <Field label="Reason (audited)" name="note" required maxLength={1000} />
                  </ActionForm>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="grid h-fit gap-6">
          <section className={`${ui.card} p-5 text-sm`}>
            <h2 className="mb-3 font-black">Customer</h2>
            <p>{order.email}</p>
            {address && (
              <address className="mt-2 not-italic">
                {address.name}<br />{address.address_line1}{address.address_line2 ? <><br />{address.address_line2}</> : null}<br />
                {address.city}, {address.province} {address.zip}<br />{address.country}
              </address>
            )}
            <p className="mt-3">Placed {when(order.created_at)} · Paid {when(order.paid_at)}</p>
          </section>

          <section className={`${ui.card} p-5 text-sm`}>
            <h2 className="mb-3 font-black">Payment & refunds</h2>
            {(order.payments ?? []).map((payment) => (
              <div key={`${payment.status}-${payment.amount_cents}`} className="mb-3">
                <p><StatusBadge status={payment.status} /> {formatMoney(payment.amount_cents, order.currency)} · {when(payment.completed_at)}</p>
                <ul className="mt-2 grid gap-1">
                  {payment.refunds.map((refund) => <li key={refund.id}>Refund {formatMoney(refund.amount_cents, order.currency)} · <StatusBadge status={refund.status} /> · {refund.reason ?? "—"} · {when(refund.created_at)}</li>)}
                </ul>
              </div>
            ))}
            {refundable > 0 ? (
              <ActionForm action={refundOrder.bind(null, order.id)} submitLabel="Refund" tone="accent" confirm="Send this refund to Stripe? This cannot be undone." className="mt-4 grid gap-3 border-t-2 border-ink pt-4">
                <Field label={`Amount in USD (up to ${formatMoney(refundable, order.currency)})`} name="amount" inputMode="decimal" placeholder="12.50" required />
                <Field label="Reason" name="reason" maxLength={255} />
              </ActionForm>
            ) : (
              <p className="mt-2">Nothing left to refund.</p>
            )}
          </section>

          {(order.attributions ?? []).length > 0 && (
            <section className={`${ui.card} p-5 text-sm`}>
              <h2 className="mb-3 font-black">Attribution</h2>
              {order.attributions!.map((attribution) => (
                <p key={attribution.model} className="mb-2">
                  <strong>{attribution.model.replaceAll("_", " ")}:</strong> {[attribution.utm_source, attribution.utm_medium, attribution.utm_campaign, attribution.utm_content].filter(Boolean).join(" / ") || "direct"}
                  {(attribution.fbclid || attribution.ttclid || attribution.gclid) && " · click ID"}
                </p>
              ))}
            </section>
          )}

          <section className={`${ui.card} p-5 text-sm`}>
            <h2 className="mb-3 font-black">Internal notes</h2>
            <ul className="mb-4 grid gap-2">
              {(order.notes ?? []).map((note) => <li key={note.id} className="border-l-4 border-coral pl-3"><p>{note.body}</p><p className="text-xs">{when(note.created_at)}</p></li>)}
              {(order.notes ?? []).length === 0 && <li>No notes yet.</li>}
            </ul>
            <ActionForm action={addOrderNote.bind(null, order.id)} submitLabel="Add note" tone="ghost">
              <TextArea label="New note (not visible to the customer)" name="body" required maxLength={5000} />
            </ActionForm>
          </section>
        </div>
      </div>
    </>
  );
}
