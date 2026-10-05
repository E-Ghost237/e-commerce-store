"use client";

import { useActionState } from "react";
import { lookUpOrder, type TrackingState } from "@/app/actions/tracking";
import { ArrowRight, Check, Truck } from "./Icons";
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

/** How many of the four stages are complete for a given API fulfilment status. */
const completedStages: Record<string, number> = {
  UNFULFILLED: 1,
  QUEUED: 2,
  SUBMITTING: 2,
  SUBMITTED: 2,
  PROCESSING: 2,
  HOLD: 2,
  SHIPPED: 3,
  DELIVERY_EXCEPTION: 3,
  FAILED: 2,
  DELIVERED: 4,
  CANCELLED: 1,
};

const stages = ["Order placed", "Packed", "Shipped", "Delivered"];

export function TrackingLookup({ initialOrder }: { initialOrder: string }) {
  const [state, formAction, pending] = useActionState<TrackingState, FormData>(lookUpOrder, { tracking: null, message: null, orderNumber: initialOrder, email: "" });
  const done = state.tracking ? (completedStages[state.tracking.fulfillment_status] ?? 2) : 0;

  return (
    <div className="grid gap-8">
      <form action={formAction} className={`${ui.card} grid gap-5 p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-7`}>
        <div>
          <label className={ui.label} htmlFor="order">
            Order number
          </label>
          <input id="order" name="order" className={ui.input} defaultValue={state.orderNumber} placeholder="CC-20261004-XXXXXXXX" required />
        </div>
        <div>
          <label className={ui.label} htmlFor="tracking-email">
            E-mail used at checkout
          </label>
          <input id="tracking-email" name="email" type="email" className={ui.input} defaultValue={state.email} autoComplete="email" required />
        </div>
        <button className={`${ui.buttonPrimary} py-3.5`} disabled={pending}>
          {pending ? "Looking…" : "Track"}
        </button>
      </form>

      <p aria-live="polite" className="min-h-5 text-sm font-medium text-red-700">
        {state.message}
      </p>

      {state.tracking && (
        <section className={`${ui.card} overflow-hidden`} aria-label="Order status">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/8 bg-linen/60 px-6 py-5 sm:px-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">Order</p>
              <p className="mt-1 font-mono text-sm text-ink/80">{state.tracking.order_number}</p>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-soft">
              <Truck className="h-4 w-4 text-sage" />
              {statusLabels[state.tracking.fulfillment_status] ?? state.tracking.fulfillment_status}
            </p>
          </div>

          <div className="px-6 py-6 sm:px-7">
            <ol className="grid grid-cols-4 gap-2">
              {stages.map((label, index) => {
                const reached = index < done;
                return (
                  <li key={label} className="flex flex-col items-center gap-3 text-center">
                    <span className={`grid h-8 w-8 place-items-center rounded-full border text-[11px] font-semibold ${reached ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white text-ink/40"}`}>
                      {reached ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${reached ? "text-ink/70" : "text-ink/35"}`}>{label}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="border-t border-ink/8 px-6 py-6 sm:px-7">
            {state.tracking.shipments.length === 0 ? (
              <p className="text-sm text-ink/60">Tracking appears here as soon as the parcel ships. We&apos;ll also e-mail it to you.</p>
            ) : (
              state.tracking.shipments.map((shipment) => (
                <div key={shipment.tracking_number ?? shipment.status} className="grid gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-linen/70 px-4 py-3">
                    <p className="text-sm font-semibold">
                      {shipment.carrier ?? "Carrier"} · <span className="font-mono text-[13px] font-normal text-ink/70">{shipment.tracking_number}</span>
                    </p>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">{shipment.status.replaceAll("_", " ")}</span>
                  </div>

                  <ol className="relative grid gap-6 border-l border-ink/12 pl-6">
                    {shipment.events.map((event, index) => (
                      <li key={`${event.status}-${event.occurred_at}`} className="relative">
                        <span className={`absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${index === shipment.events.length - 1 ? "bg-terracotta" : "bg-clay"}`} />
                        <p className="text-sm font-semibold text-ink/80">{event.status}</p>
                        <p className="mt-1 text-[13px] text-ink/55">
                          <time dateTime={event.occurred_at}>
                            {new Date(event.occurred_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                          </time>
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <p className="flex items-center gap-2 text-[13px] text-ink/55">
                    <ArrowRight className="h-4 w-4 text-sage" />
                    Need a change? Contact us with your order number and we&apos;ll follow the carrier for you.
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
