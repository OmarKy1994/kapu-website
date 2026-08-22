import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

// Redirects "/" and any locale-less path to the default locale ("/en/...").
// This is the only place locale detection happens; no runtime translation.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // sitemap.xml and robots.txt must stay at the site root for crawlers —
  // never redirected under a /en or /el prefix. PHASE I: icon.png and
  // apple-icon.png joined favicon.ico here — Next's file-convention icons
  // are also only defined at the true app root (app/icon.png,
  // app/apple-icon.png, not app/[locale]/icon.png), so without this
  // exclusion every browser/OS request for them was being redirected to
  // /en/icon.png (404) instead of served — found via curl during Phase I
  // favicon QA, not by inspection alone. `fonts/` joined the list for the
  // same reason, found the same way — every request for
  // /fonts/majesty/Majesty-Regular.ttf (referenced as an absolute
  // `url(/fonts/...)` in app/fonts.css) was being redirected to
  // /en/fonts/majesty/Majesty-Regular.ttf (404, public/fonts is only ever
  // served at the true root), so Majesty was silently 404ing and falling
  // back to the plain serif stack on every real page load this entire
  // phase — the isolated /tmp test page that "confirmed" it rendered
  // never went through this proxy, so it never hit the bug. Re-verified
  // live on-site after this fix, not just re-trusted the old test.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|images/|fonts/|sitemap.xml|robots.txt).*)"],
};
