import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RiCloseCircleLine } from "react-icons/ri";

export default async function PaymentFailedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Payment" });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <RiCloseCircleLine size={72} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">{t("zarinpal_failed_title")}</h1>
        <p className="text-gray-500">{t("zarinpal_failed_subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={`/${locale}/cart`}
            className="bg-[var(--cta)] text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            {t("zarinpal_try_again")}
          </Link>
          <Link
            href={`/${locale}/courses`}
            className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          >
            {t("zarinpal_contact_support")}
          </Link>
        </div>
      </div>
    </div>
  );
}
