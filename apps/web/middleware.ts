import createMiddleware from "next-intl/middleware";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@roohbakhsh/shared";

// مسیریابی زبان: /ar/...  و  /ur/...
export default createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
