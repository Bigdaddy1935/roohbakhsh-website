import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// مسیرهایی که کاربر لاگین‌شده نباید به آن‌ها دسترسی داشته باشد.
const GUEST_ONLY_ROUTES = ["/signin", "/signup"];

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(LOCALE_PREFIX);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(LOCALE_PREFIX, "") || "/";

  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`),
  );
  const isLoggedIn = request.cookies.get("rh_auth")?.value === "1";

  if (isGuestOnlyRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
