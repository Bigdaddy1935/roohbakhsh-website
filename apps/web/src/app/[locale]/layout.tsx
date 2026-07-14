import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import QueryProvider from "@/providers/QueryProvider";
import { getMessages, getTranslations } from "next-intl/server";
import { Almarai, Noto_Nastaliq_Urdu } from "next/font/google";
import type { Locale } from "@roohbakhsh/shared";
import { dirForLocale } from "@/core/utils/dir";
import { SITE_URL } from "@/lib/seo";
import { Toaster } from "sonner";
import ServiceWorkerRegister from "@/components/core/ServiceWorkerRegister";
import "@/core/styles/globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-urdu",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("default_title"),
      template: `%s | ${t("site_name")}`,
    },
    description: t("default_description"),
    alternates: {
      languages: { ar: "/ar", ur: "/ur" },
    },
    openGraph: {
      siteName: t("site_name"),
      title: t("default_title"),
      description: t("default_description"),
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("default_title"),
      description: t("default_description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={dirForLocale(locale)}
      className={`${almarai.variable} ${nastaliq.variable}`}
    >
      <body>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ServiceWorkerRegister />
            {children}
            <Toaster
              position="top-center"
              dir={dirForLocale(locale)}
              toastOptions={{ style: { fontFamily: "inherit" } }}
            />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
