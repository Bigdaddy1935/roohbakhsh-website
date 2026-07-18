import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RiCheckboxCircleLine } from "react-icons/ri";

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ refId?: string }>;
}) {
  const { locale } = await params;
  const { refId } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Payment" });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <RiCheckboxCircleLine size={72} className="text-[var(--brand)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">{t("zarinpal_success_title")}</h1>
        <p className="text-gray-500">{t("zarinpal_success_subtitle")}</p>
        {refId && (
          <div className="bg-[var(--brand)]/10 rounded-xl px-5 py-3 text-sm text-[var(--brand)] font-mono">
            {t("zarinpal_ref_id")}: {refId}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={`/${locale}/dashboard`}
            className="bg-[var(--brand)] text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {t("zarinpal_go_to_dashboard")}
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="border border-[var(--brand)] text-[var(--brand)] px-6 py-2.5 rounded-full font-semibold hover:bg-[var(--brand)]/5 transition-colors"
          >
            {t("zarinpal_go_to_courses")}
          </Link>
        </div>
      </div>
    </div>
  );
}
