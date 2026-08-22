import type { Locale } from "./i18n";
import type { LocationData, MenuData } from "./types";

import siteEn from "@/content/site/en.json";
import siteEl from "@/content/site/el.json";
import cafeMenu from "@/content/menu/cafe.json";
import barMenu from "@/content/menu/bar.json";
import kypseli from "@/content/locations/kypseli.json";
import kallithea from "@/content/locations/kallithea.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SiteDict = any;

const siteDicts: Record<Locale, SiteDict> = { en: siteEn, el: siteEl };

export function getSiteDict(locale: Locale): SiteDict {
  return siteDicts[locale] ?? siteDicts.en;
}

export function getCafeMenu(): MenuData {
  return cafeMenu as unknown as MenuData;
}

export function getBarMenu(): MenuData {
  return barMenu as unknown as MenuData;
}

const locationList: LocationData[] = [
  kypseli as unknown as LocationData,
  kallithea as unknown as LocationData,
];

export function getLocations(): LocationData[] {
  return locationList;
}

export function getLocation(slug: string): LocationData | undefined {
  return locationList.find((loc) => loc.slug === slug);
}
