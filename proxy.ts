import { NextRequest, NextResponse } from "next/server";

const locales = ["ja", "en"];
const defaultLocale = "ja";

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const preferred = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim());

  for (const lang of preferred) {
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("en")) return "en";
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const res = NextResponse.next();
    res.headers.set("Vary", "Cookie, Accept-Language");
    return res;
  }

  // Determine locale from cookie or headers
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    cookieLocale && locales.includes(cookieLocale)
      ? cookieLocale
      : getLocaleFromHeaders(request);

  // For default locale (ja), rewrite internally without redirect
  // This keeps the URL clean (netwalking.net/ instead of netwalking.net/ja/)
  if (locale === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/ja${pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("Vary", "Cookie, Accept-Language");
    return res;
  }

  // For non-default locale, redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const res = NextResponse.redirect(url);
  res.headers.set("Vary", "Cookie, Accept-Language");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon|icon|apple-icon|robots\\.txt|sitemap\\.xml|images/|community/).*)"],
};
