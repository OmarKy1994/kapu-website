import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getLocations } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/menu", "/locations", "/order", "/story"];
  const locationSlugs = getLocations().map((loc) => `/locations/${loc.slug}`);
  const paths = [...staticPaths, ...locationSlugs];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    }))
  );
}
