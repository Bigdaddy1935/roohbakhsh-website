import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Locale } from "@roohbakhsh/shared";
import { dirForLocale } from "@/core/utils/dir";
import "@/core/styles/globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dirForLocale(locale)}>
      <body cz-shortcut-listen="true">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}