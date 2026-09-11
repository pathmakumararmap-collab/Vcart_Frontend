import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants/api";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/checkout"];
const AUTH_PAGES = ["/login", "/register"];
// Matches a leading /si or /ta segment so auth-prefix checks work the
// same regardless of which locale the URL is in.
const LOCALE_PREFIX_PATTERN = /^\/(si|ta)(?=\/|$)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  const localeMatch = pathname.match(LOCALE_PREFIX_PATTERN);
  const localePrefix = localeMatch ? localeMatch[0] : "";
  const pathWithoutLocale = pathname.replace(LOCALE_PREFIX_PATTERN, "") || "/";

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathWithoutLocale.startsWith(prefix));
  const isAuthPage = AUTH_PAGES.some((page) => pathWithoutLocale.startsWith(page));

  if (isProtected && !token) {
    const loginUrl = new URL(`${localePrefix}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, request.url));
  }

  // Admin panel stays English-only/un-prefixed — skip locale
  // negotiation entirely for it.
  if (pathWithoutLocale.startsWith("/admin")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
