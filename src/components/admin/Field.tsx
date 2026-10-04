import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ui } from "../ui";

export function Field({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; name: string }) {
  return (
    <div>
      <label className={ui.label} htmlFor={props.id ?? props.name}>{label}</label>
      <input id={props.id ?? props.name} className={ui.input} {...props} />
      {hint && <p className="mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  return (
    <div>
      <label className={ui.label} htmlFor={props.id ?? props.name}>{label}</label>
      <textarea id={props.id ?? props.name} className={`${ui.input} min-h-28`} {...props} />
    </div>
  );
}

export function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string; children: ReactNode }) {
  return (
    <div>
      <label className={ui.label} htmlFor={props.id ?? props.name}>{label}</label>
      <select id={props.id ?? props.name} className={ui.input} {...props}>{children}</select>
    </div>
  );
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const tone = status && ["PAID", "DELIVERED", "COMPLETED", "SUCCEEDED", "active", "SHIPPED"].includes(status)
    ? "bg-mint"
    : status && ["FAILED", "CANCELLED", "DELIVERY_EXCEPTION", "REFUNDED", "HOLD", "archived"].includes(status)
      ? "bg-coral"
      : "bg-sand";
  return <span className={`inline-block border-2 border-ink px-2 py-0.5 text-xs font-black ${tone}`}>{status ?? "—"}</span>;
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
      <h1 className="text-3xl font-black tracking-[-.05em]">{title}</h1>
      {children}
    </div>
  );
}
