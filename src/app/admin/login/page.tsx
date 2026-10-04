import { ActionForm } from "@/components/admin/ActionForm";
import { Field } from "@/components/admin/Field";
import { signIn } from "../actions";

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { expired } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-2 text-4xl font-black tracking-[-.06em]">Back office</h1>
      <p className="mb-8 text-sm">{expired ? "Your session expired. Sign in again." : "Sign in with your administrator account."}</p>
      <ActionForm action={signIn} submitLabel="Sign in" pendingLabel="Signing in…">
        <Field label="E-mail" name="email" type="email" autoComplete="username" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" required />
        <Field label="Authenticator or recovery code" name="code" inputMode="numeric" autoComplete="one-time-code" hint="Required once two-factor authentication is enabled." />
      </ActionForm>
    </main>
  );
}
