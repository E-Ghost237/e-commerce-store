import { PageTitle } from "@/components/admin/Field";
import { MfaPanel } from "@/components/admin/MfaPanel";
import { ui } from "@/components/ui";
import { requireAdmin } from "@/lib/admin";

export default async function SecurityPage() {
  const admin = await requireAdmin();

  return (
    <>
      <PageTitle title="Security" />
      <section className={`${ui.card} max-w-2xl p-5`}>
        <h2 className="text-xl font-black">Two-factor authentication</h2>
        <p className="mb-4 mt-2 text-sm">
          {admin.mfa_enabled ? "On. You need a code from your authenticator app at every sign-in." : "Off. Protect refunds and order data with a second factor."}
        </p>
        <MfaPanel enabled={admin.mfa_enabled} />
      </section>
    </>
  );
}
