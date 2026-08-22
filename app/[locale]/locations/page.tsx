import type { Metadata } from "next";
import { getSiteDict, getLocations } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import LocationCard from "@/components/locations/LocationCard";
import WobbleDivider from "@/components/motifs/WobbleDivider";
import Bougainvillea from "@/components/motifs/Bougainvillea";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  return {
    // Phase L fix: see menu/page.tsx — the layout's title.template already
    // appends the suffix once; this page previously appended it a second
    // time.
    title: dict.locations.heading,
    description: dict.locations.sub,
    alternates: pageAlternates(locale, "/locations"),
  };
}

export default async function LocationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const locations = getLocations();

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-5 pb-24 pt-10 md:pt-16">
      {/* Phase H: mobile-hidden, same reasoning as the homepage hero's
          stem instance (Phase G) — the mobile clamp term (50vw) is sized
          right for a short heading, but "Find Your KAPU" is long enough to
          wrap into the top-right corner on a 390px screen, so the flowers
          landed across the last letters of the heading itself. Desktop has
          plenty of clearance (the heading sits far left of this wide
          container), so this stays a desktop-only accent rather than
          shrinking it everywhere just to fix the one narrow case. */}
      <div className="hidden md:block">
        <Bougainvillea variant="corner" corner="top-right" focus="bloom" width={640} className="opacity-35" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">{dict.home.locationsEyebrow}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
        {dict.locations.heading}
      </h1>
      <p className="mt-3 max-w-xl text-sm opacity-70">{dict.locations.sub}</p>
      <WobbleDivider className="my-8 max-w-[140px]" color="var(--accent)" />

      <div className="grid gap-8 md:grid-cols-2">
        {locations.map((location) => (
          <LocationCard key={location.slug} location={location} locale={locale} dict={dict} />
        ))}
      </div>
    </div>
  );
}
