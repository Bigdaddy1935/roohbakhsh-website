import { getRequestConfig } from "next-intl/server";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type Locale,
} from "@roohbakhsh/shared";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale: Locale = SUPPORTED_LOCALES.includes(requested as Locale)
    ? (requested as Locale)
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});