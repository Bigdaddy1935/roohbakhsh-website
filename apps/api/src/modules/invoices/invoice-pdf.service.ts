import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import type { Money } from "@roohbakhsh/shared";
import { Invoice } from "./entities/invoice.entity";

type Locale = "ar" | "ur";

interface InvoiceLabels {
  title: string;
  invoiceNumber: string;
  issuedAt: string;
  item: string;
  price: string;
  subtotal: string;
  discount: string;
  coupon: string;
  total: string;
  paymentRef: string;
  free: string;
  academy: string;
}

const LABELS: Record<Locale, InvoiceLabels> = {
  ar: {
    title: "فاتورة",
    invoiceNumber: "رقم الفاتورة",
    issuedAt: "تاريخ الإصدار",
    item: "الدورة",
    price: "السعر",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    coupon: "كود الخصم",
    total: "الإجمالي",
    paymentRef: "مرجع الدفع",
    free: "مجاني",
    academy: "أكاديمية روح‌بخش الإسلامية الدولية",
  },
  ur: {
    title: "انوائس",
    invoiceNumber: "انوائس نمبر",
    issuedAt: "تاریخ اجرا",
    item: "کورس",
    price: "قیمت",
    subtotal: "ذیلی مجموعہ",
    discount: "رعایت",
    coupon: "ڈسکاؤنٹ کوڈ",
    total: "کل رقم",
    paymentRef: "ادائیگی ریفرنس",
    free: "مفت",
    academy: "بین الاقوامی اسلامی اکادمی روح بخش",
  },
};

function fmtMoney(money: Money | null, locale: Locale): string {
  if (!money || money.amountMinor === 0) return LABELS[locale].free;
  const divisor = money.currency === "IRR" ? 1 : 100;
  const amount = money.amountMinor / divisor;
  const symbol = money.currency === "USD" ? "$" : money.currency === "EUR" ? "€" : "ر.س";
  return `${amount.toLocaleString()} ${symbol}`;
}

@Injectable()
export class InvoicePdfService {
  private renderHtml(invoice: Invoice, locale: Locale): string {
    const t = LABELS[locale];
    const rows = invoice.items
      .map(
        (item) => `
          <tr>
            <td>${item.titleSnapshot[locale] ?? item.titleSnapshot.ar}</td>
            <td>${fmtMoney(item.priceSnapshot, locale)}</td>
          </tr>`,
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html lang="${locale}" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, Tahoma, sans-serif; color: #2B2D42; padding: 40px; direction: rtl; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0CA789; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { color: #0CA789; font-size: 22px; margin: 0; }
          .meta { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th, td { padding: 10px 12px; text-align: start; border-bottom: 1px solid #eee; font-size: 13px; }
          th { background: #F8F9FA; color: #2B2D42; }
          .totals { width: 320px; margin-inline-start: auto; font-size: 13px; }
          .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals .total { font-weight: bold; font-size: 16px; color: #0CA789; border-top: 2px solid #0CA789; margin-top: 6px; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t.academy}</h1>
          <div style="font-size: 18px; font-weight: bold;">${t.title}</div>
        </div>
        <div class="meta">
          <span>${t.invoiceNumber}: <strong>${invoice.invoiceNumber}</strong></span>
          <span>${t.issuedAt}: <strong>${invoice.issuedAt.toISOString().slice(0, 10)}</strong></span>
        </div>
        <table>
          <thead><tr><th>${t.item}</th><th>${t.price}</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals">
          <div><span>${t.subtotal}</span><span>${fmtMoney(invoice.subtotal, locale)}</span></div>
          ${invoice.discountAmount.amountMinor > 0 ? `<div><span>${t.discount}${invoice.couponCode ? ` (${invoice.couponCode})` : ""}</span><span>-${fmtMoney(invoice.discountAmount, locale)}</span></div>` : ""}
          <div class="total"><span>${t.total}</span><span>${fmtMoney(invoice.total, locale)}</span></div>
          ${invoice.paymentRefId ? `<div><span>${t.paymentRef}</span><span>${invoice.paymentRefId}</span></div>` : ""}
        </div>
      </body>
      </html>`;
  }

  async generate(invoice: Invoice, locale: Locale): Promise<Buffer> {
    const html = this.renderHtml(invoice, locale);
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20px", bottom: "20px" } });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
