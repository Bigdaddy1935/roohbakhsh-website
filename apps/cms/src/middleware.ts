import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_FLAG_COOKIE = "cms_auth";

const AUTH_ROUTES = ["/signin", "/forgot-password", "/reset-password"];
const PUBLIC_ROUTES = [...AUTH_ROUTES];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has(AUTH_FLAG_COOKIE);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // لاگین نیست و داره به روت محافظت‌شده دسترسی پیدا می‌کنه
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // لاگین هست و داره به صفحه auth میره
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)"],
};
