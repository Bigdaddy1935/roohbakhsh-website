import type { Money, Locale } from "@roohbakhsh/shared";

export function formatMoney(money: Money | null | undefined, locale: Locale): string {
  if (!money) return locale === "ar" ? "مجاني" : "مفت";
  const divisor = money.currency === "IRR" ? 1 : 100;
  const amount = money.amountMinor / divisor;
  if (money.currency === "USD") return `$${amount.toLocaleString()}`;
  if (money.currency === "EUR") return `€${amount.toLocaleString()}`;
  return locale === "ar"
    ? `${amount.toLocaleString("ar-EG")} ر.س`
    : `${amount.toLocaleString()} ر.س`;
}

export function isFree(money: Money | null | undefined): boolean {
  return !money || money.amountMinor === 0;
}

export function discountPercent(original: Money | null, effective: Money | null): number {
  if (!original || !effective || original.amountMinor === 0) return 0;
  return Math.round(((original.amountMinor - effective.amountMinor) / original.amountMinor) * 100);
}
