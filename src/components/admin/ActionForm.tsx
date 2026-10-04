"use client";

import { useActionState, type ReactNode } from "react";
import type { AdminActionState } from "@/app/admin/actions";
import { ui } from "../ui";

type Props = {
  action: (previous: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  submitLabel: string;
  pendingLabel?: string;
  children?: ReactNode;
  className?: string;
  confirm?: string;
  tone?: "primary" | "accent" | "ghost";
  /** Render extra output from a successful result (e.g. recovery codes). */
  renderResult?: (data: Record<string, unknown>) => ReactNode;
};

export function ActionForm({ action, submitLabel, pendingLabel = "Saving…", children, className = "grid gap-4", confirm, tone = "primary", renderResult }: Props) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: null, errors: [] });
  const buttonClass = tone === "accent" ? ui.buttonAccent : tone === "ghost" ? ui.buttonGhost : ui.buttonPrimary;

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) {
          event.preventDefault();
        }
      }}
    >
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonClass} disabled={pending}>{pending ? pendingLabel : submitLabel}</button>
        <div aria-live="polite" className="text-sm font-bold">
          {state.message && <p className={state.ok ? "text-emerald-800" : "text-red-700"}>{state.message}</p>}
          {state.errors.length > 0 && (
            <ul className="list-inside list-disc text-red-700">
              {state.errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          )}
        </div>
      </div>
      {state.ok && state.data && renderResult?.(state.data)}
    </form>
  );
}
