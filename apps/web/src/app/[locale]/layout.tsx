import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Almarai, Noto_Nastaliq_Urdu } from "next/font/google";
import type { Locale } from "@roohbakhsh/shared";
import { dirForLocale } from "@/core/utils/dir";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
