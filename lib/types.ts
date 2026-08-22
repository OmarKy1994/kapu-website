import type { Locale } from "./i18n";

export type LocalizedString = Record<Locale, string>;

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  price?: string;
  image?: string;
  tags?: Array<"vegan" | "popular" | "18+">;
  adultsOnly?: boolean;
  abv?: string;
}

export interface MenuSubcategory {
  id: string;
  name: LocalizedString;
  price?: string;
  unit?: LocalizedString;
  image?: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  notes?: LocalizedString;
  adultsOnly?: boolean;
  featured?: boolean;
  unverified?: boolean;
  items?: MenuItem[];
  subcategories?: MenuSubcategory[];
}

export interface MenuData {
  mode: "cafe" | "bar";
  sourceNote: string;
  categories: MenuCategory[];
}

export interface OrderingLink {
  url: string | null;
  verified: boolean;
  note?: string;
}

export interface LocationData {
  slug: string;
  name: string;
  neighborhood: LocalizedString;
  address: string;
  phone: string;
  phoneDisplay: string;
  hours: LocalizedString;
  coordinates: { lat: number; lng: number } | null;
  coordinatesNote?: string;
  mapsQuery: string;
  orderingLinks: {
    wolt?: OrderingLink;
    efood?: OrderingLink;
    box?: OrderingLink;
  };
  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: { handle: string; verified: boolean; note?: string };
  };
  barProgram: boolean | "unconfirmed";
  barProgramNote: LocalizedString;
  // Phase L: dropped the unused `interior` field. The rendered location
  // page (app/[locale]/locations/[slug]/page.tsx) only ever had two image
  // slots — a 21:9 hero band and a 3:2 secondary/exterior frame — no third
  // slot was ever built for it. Kypseli's actual interior.jpg file also
  // turned out to be a near-duplicate of the hero (same mural, same
  // counter, just a slightly wider crop), so surfacing it as a genuine
  // third "moment" wouldn't have been editorially distinct anyway. Smallest
  // clean fix: match the data model to what the page actually renders,
  // rather than inventing a third slot to justify data that was never wired
  // up. The unreferenced kypseli-interior.jpg file itself is left in place
  // on disk — untouched photography, just no longer pointed to.
  images: { hero: string | null; exterior: string | null };
  placeholders: Array<{
    id: string;
    subject: LocalizedString;
    aspect: string;
    priority: "P0" | "P1" | "P2";
  }>;
}
