import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Locale } from "@roohbakhsh/shared";
import { dirForLocale } from "../../lib/dir";
import "./globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next 15/16: params حالا async است (Promise) → باید await شود
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dirForLocale(locale)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
