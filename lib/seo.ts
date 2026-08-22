import { locales, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/**
 * Canonical + hreflang alternates for a given locale/path pair, e.g.
 * pageAlternates("en", "/menu") -> canonical /en/menu, alternates for
 * /en/menu and /el/menu. Spread into a page's generateMetadata return.
 */
export function pageAlternates(locale: Locale, path: string) {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
  };
}
