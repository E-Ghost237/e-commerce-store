import { ActionForm } from "@/components/admin/ActionForm";
import { Field, PageTitle } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import type { LaravelPage } from "@/lib/admin-types";
import { formatMoney } from "@/lib/money";
import { recordAdSpend } from "../../actions";

type AdSpend = { id: number; spent_on: string; utm_source: string; utm_campaign: string | null; utm_content: string | null; amount_cents: number };

export default async function MarketingPage() {
  const spends = await adminApi<LaravelPage<AdSpend>>("/ad-spends");

  return (
    <>
      <PageTitle title="Ad spend" />
      <p className="mb-4 max-w-2xl text-sm">Record spend with the same source / campaign / content values used in your UTM links so CAC, ROAS and contribution line up per creative on the dashboard.</p>
      <section className={`${ui.card} mb-6 p-4`}>
        <ActionForm action={recordAdSpend} submitLabel="Record spend" className="grid gap-3 md:grid-cols-5 md:items-end">
          <Field label="Date" name="spent_on" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
          <Field label="utm_source" name="utm_source" required placeholder="facebook" />
          <Field label="utm_campaign" name="utm_campaign" />
          <Field label="utm_content" name="utm_content" />
          <Field label="Amount (USD)" name="amount" inputMode="decimal" required />
        </ActionForm>
      </section>
      <div className="overflow-x-auto border-2 border-ink">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-ink text-left text-paper"><tr>{["Date", "Source", "Campaign", "Creative", "Amount"].map((heading) => <th key={heading} scope="col" className="px-3 py-2">{heading}</th>)}</tr></thead>
          <tbody className="divide-y divide-stone-300">
            {spends.data.map((spend) => (
              <tr key={spend.id}>
                <td className="px-3 py-2">{spend.spent_on.slice(0, 10)}</td>
                <td className="px-3 py-2">{spend.utm_source}</td>
                <td className="px-3 py-2">{spend.utm_campaign ?? "—"}</td>
                <td className="px-3 py-2">{spend.utm_content ?? "—"}</td>
                <td className="px-3 py-2 tabular-nums">{formatMoney(spend.amount_cents)}</td>
              </tr>
            ))}
            {spends.data.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center">No spend recorded.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
