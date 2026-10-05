import Link from "next/link";
import { ActionForm } from "@/components/admin/ActionForm";
import { Field } from "@/components/admin/Field";
import { Logo } from "@/components/Icons";
import { ui } from "@/components/ui";
import { signIn } from "../actions";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { expired } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-linen px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 text-ink">
          <Logo className="h-10 w-10" />
          <span className="font-display text-xl leading-none">Back office</span>
        </div>

        <div className={`${ui.card} mt-6 p-7`}>
          <h1 className="font-display text-3xl tracking-[-0.02em]">Sign in</h1>
          <p className="mt-2 text-sm text-ink/60">{expired ? "Your session expired. Sign in again." : "Sign in with your administrator account."}</p>

          <div className="mt-6">
            <ActionForm action={signIn} submitLabel="Sign in" pendingLabel="Signing in…">
              <Field label="E-mail" name="email" type="email" autoComplete="username" required />
              <Field label="Password" name="password" type="password" autoComplete="current-password" required />
              <Field label="Authenticator or recovery code" name="code" inputMode="numeric" autoComplete="one-time-code" hint="Required once two-factor authentication is enabled." />
            </ActionForm>
          </div>
        </div>

        <Link href="/" className="mt-5 inline-block text-sm text-ink/55 underline underline-offset-4 hover:text-ink">
          ← Back to the storefront
        </Link>
      </div>
    </main>
  );
}
