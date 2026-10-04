const formatters = new Map<string, Intl.NumberFormat>();

/** Format integer cents for display; amounts are always integer cents end to end. */
export function formatMoney(cents: number | null | undefined, currency = "USD"): string {
  if (cents === null || cents === undefined) {
    return "—";
  }
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    formatters.set(currency, formatter);
  }
  return formatter.format(cents / 100);
}

/** Parse a dollars input like "24.99" into integer cents, or null when invalid. */
export function parseDollarsToCents(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value.trim())) {
    return null;
  }
  const [dollars, fraction = ""] = value.trim().split(".");
  return Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
}
