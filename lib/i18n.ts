export const locales = ["en", "el"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Swap the locale segment of a path while preserving the rest of the route,
 * e.g. /en/menu -> /el/menu, /en/locations/kypseli -> /el/locations/kypseli.
 */
export function swapLocale(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" because pathname starts with "/"
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = nextLocale;
    return segments.join("/") || "/";
  }
  return `/${nextLocale}${pathname}`;
}
