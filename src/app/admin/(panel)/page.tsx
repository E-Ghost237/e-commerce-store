import { PageTitle } from "@/components/admin/Field";
import { ui } from "@/components/ui";
import { adminApi } from "@/lib/admin";
import { formatMoney } from "@/lib/money";

type Row = {
  utm_source?: string;
  utm_campaign?: string | null;
  utm_content?: string | null;
  orders: number;
  revenue_cents: number;
  refunds_cents: number;
  cogs_cents: number;
  shipping_cents: number;
  fees_cents: number;
  ad_spend_cents: number;
  sessions: number;
  checkout_starts: number;
  aov_cents: number | null;
  cac_cents: number | null;
  roas: number | null;
  contribution_cents: number;
  orders_with_unknown_cost: number;
};

type Analytics = { from: string; to: string; attribution_model: string; totals: Row; by_campaign: Row[] };

function isoDay(value: unknown): string | null {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const query = new URLSearchParams();
  const from = isoDay(params.from);
  const to = isoDay(params.to);
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const { data } = await adminApi<{ data: Analytics }>(`/analytics${query.size ? `?${query}` : ""}`);
  const totals = data.totals;

  const tiles: [string, string][] = [
    ["Revenue", formatMoney(totals.revenue_cents)],
    ["Orders", String(totals.orders)],
    ["AOV", formatMoney(totals.aov_cents)],
    ["Ad spend", formatMoney(totals.ad_spend_cents)],
    ["CAC", formatMoney(totals.cac_cents)],
    ["ROAS", totals.roas === null ? "—" : `${totals.roas.toFixed(2)}×`],
    ["COGS", formatMoney(totals.cogs_cents)],
    ["Shipping", formatMoney(totals.shipping_cents)],
    ["Fees (est.)", formatMoney(totals.fees_cents)],
    ["Refunds", formatMoney(totals.refunds_cents)],
    ["Contribution", formatMoney(totals.contribution_cents)],
    ["Checkout starts", String(totals.checkout_starts)],
  ];

  return (
    <>
      <PageTitle title="Dashboard">
        <form className="flex flex-wrap items-end gap-2 text-sm">
          <label>From <input className={`${ui.input} w-auto py-1`} type="date" name="from" defaultValue={data.from} /></label>
          <label>To <input className={`${ui.input} w-auto py-1`} type="date" name="to" defaultValue={data.to} /></label>
          <button className={ui.buttonGhost}>Apply</button>
        </form>
      </PageTitle>
      <p className="mb-4 text-sm">{data.from} → {data.to} · attribution: {data.attribution_model.replaceAll("_", " ")}{totals.orders_with_unknown_cost > 0 && ` · ${totals.orders_with_unknown_cost} orders with unknown cost (contribution overstated)`}</p>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {tiles.map(([label, value]) => (
          <div key={label} className={`${ui.card} p-4 ${label === "Contribution" ? (totals.contribution_cents < 0 ? "bg-coral" : "bg-mint") : ""}`}>
            <dt className="text-xs font-bold uppercase tracking-wider">{label}</dt>
            <dd className="mt-1 text-2xl font-black tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mb-3 mt-10 text-xl font-black">By source / campaign / creative</h2>
      <div className="overflow-x-auto border-2 border-ink">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-ink text-left text-paper">
            <tr>
              {["Source", "Campaign", "Creative", "Sessions", "Checkouts", "Orders", "Revenue", "AOV", "Spend", "CAC", "ROAS", "Contribution"].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-2">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-300 tabular-nums">
            {data.by_campaign.map((row) => (
              <tr key={`${row.utm_source}-${row.utm_campaign}-${row.utm_content}`}>
                <td className="px-3 py-2 font-bold">{row.utm_source}</td>
                <td className="px-3 py-2">{row.utm_campaign ?? "—"}</td>
                <td className="px-3 py-2">{row.utm_content ?? "—"}</td>
                <td className="px-3 py-2">{row.sessions}</td>
                <td className="px-3 py-2">{row.checkout_starts}</td>
                <td className="px-3 py-2">{row.orders}</td>
                <td className="px-3 py-2">{formatMoney(row.revenue_cents)}</td>
                <td className="px-3 py-2">{formatMoney(row.aov_cents)}</td>
                <td className="px-3 py-2">{formatMoney(row.ad_spend_cents)}</td>
                <td className="px-3 py-2">{formatMoney(row.cac_cents)}</td>
                <td className="px-3 py-2">{row.roas === null ? "—" : `${row.roas.toFixed(2)}×`}</td>
                <td className={`px-3 py-2 font-bold ${row.contribution_cents < 0 ? "text-red-700" : ""}`}>{formatMoney(row.contribution_cents)}</td>
              </tr>
            ))}
            {data.by_campaign.length === 0 && (
              <tr><td colSpan={12} className="px-3 py-6 text-center">No sessions or orders in this period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
