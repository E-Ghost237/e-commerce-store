"use client";

import { useActionState } from "react";
import { lookUpOrder, type TrackingState } from "@/app/actions/tracking";
import { ui } from "./ui";

const statusLabels: Record<string, string> = {
  UNFULFILLED: "Awaiting payment confirmation",
  QUEUED: "Preparing your order",
  SUBMITTING: "Preparing your order",
  SUBMITTED: "Sent to our warehouse",
  PROCESSING: "Being packed",
  HOLD: "On hold, we'll contact you",
  SHIPPED: "On its way",
  DELIVERED: "Delivered",
  DELIVERY_EXCEPTION: "Delivery issue, we're on it",
  FAILED: "Delayed, we're on it",
  CANCELLED: "Cancelled",
};

export function TrackingLookup({ initialOrder }: { initialOrder: string }) {
  const [state, formAction, pending] = useActionState<TrackingState, FormData>(lookUpOrder, { tracking: null, message: null, orderNumber: initialOrder, email: "" });

  return (
    <div className="grid gap-8">
      <form action={formAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className={ui.label} htmlFor="order">Order number</label>
          <input id="order" name="order" className={ui.input} defaultValue={state.orderNumber} placeholder="CC-20261004-XXXXXXXX" required />
        </div>
        <div>
          <label className={ui.label} htmlFor="tracking-email">E-mail used at checkout</label>
          <input id="tracking-email" name="email" type="email" className={ui.input} defaultValue={state.email} autoComplete="email" required />
        </div>
        <button className={ui.buttonPrimary} disabled={pending}>{pending ? "Looking…" : "Track"}</button>
      </form>

      <p aria-live="polite" className="font-bold text-red-700">{state.message}</p>

      {state.tracking && (
        <section className={`${ui.card} p-6`} aria-label="Order status">
          <p className={ui.eyebrow}>Order {state.tracking.order_number}</p>
          <p className="mt-2 text-3xl font-black tracking-[-.05em]">{statusLabels[state.tracking.fulfillment_status] ?? state.tracking.fulfillment_status}</p>
          {state.tracking.shipments.length === 0 && <p className="mt-4">Tracking appears here as soon as the parcel ships.</p>}
          {state.tracking.shipments.map((shipment) => (
            <div key={shipment.tracking_number ?? shipment.status} className="mt-6 border-t-2 border-ink pt-4">
              <p className="font-bold">{shipment.carrier ?? "Carrier"} · {shipment.tracking_number}</p>
              <ol className="mt-3 grid gap-2">
                {shipment.events.map((event) => (
                  <li key={`${event.status}-${event.occurred_at}`} className="text-sm">
                    <time dateTime={event.occurred_at} className="font-mono">{new Date(event.occurred_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>
                    {" · "}
                    {event.status}
                    {event.location ? ` · ${event.location}` : ""}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
