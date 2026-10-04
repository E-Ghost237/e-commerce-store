"use client";

import Link from "next/link";
import { beginMfa, confirmMfa, disableMfa } from "@/app/admin/actions";
import { ActionForm } from "./ActionForm";
import { Field } from "./Field";

export function MfaPanel({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return (
      <ActionForm action={disableMfa} submitLabel="Turn off two-factor" tone="ghost" confirm="Turn off two-factor authentication for your account?">
        <Field label="Current code or recovery code" name="code" required autoComplete="one-time-code" />
      </ActionForm>
    );
  }

  return (
    <div className="grid gap-6">
      <ActionForm
        action={beginMfa}
        submitLabel="1. Generate a key"
        tone="ghost"
        renderResult={(data) => (
          <div className="grid gap-2 border-2 border-ink bg-sand p-4 text-sm">
            <p>Add this key to your authenticator app (manual entry), or open the link on your phone:</p>
            <code className="break-all font-mono text-base font-bold">{String(data.secret)}</code>
            <a className="break-all underline" href={String(data.otpauth_url)}>{String(data.otpauth_url)}</a>
          </div>
        )}
      />
      <ActionForm
        action={confirmMfa}
        submitLabel="2. Confirm"
        renderResult={(data) => (
          <div className="grid gap-3">
            <ol className="grid list-inside list-decimal gap-1 border-2 border-ink bg-mint p-4 font-mono">
              {(data.recovery_codes as string[]).map((code) => <li key={code}>{code}</li>)}
            </ol>
            <Link href="/admin/security" className="w-fit text-sm font-bold underline">I&apos;ve saved my recovery codes</Link>
          </div>
        )}
      >
        <Field label="6-digit code from the app" name="code" inputMode="numeric" pattern="\d{6}" required autoComplete="one-time-code" />
      </ActionForm>
    </div>
  );
}
