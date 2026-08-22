import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSiteDict, getLocation, getLocations } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import Placeholder from "@/components/placeholders/Placeholder";
import LocationInfo from "@/components/locations/LocationInfo";
import WobbleDivider from "@/components/motifs/WobbleDivider";
import Bougainvillea from "@/components/motifs/Bougainvillea";
import type { LocationData } from "@/lib/types";

/**
 * LocalBusiness (CafeOrCoffeeShop) JSON-LD from the same verified location
 * data the page renders — no invented ratings/review counts, ever. Hours
 * are the one supplied string per location, applied to every day (that is
 * what "Mon–Sun 07:00–21:00" means); nothing here goes further than what
 * content/locations/*.json already states.
 */
function locationJsonLd(location: LocationData, locale: Locale) {
  const [openTime, closeTime] = location.hours.en.split(" ").pop()?.split("–") ?? [];
  const sameAs = [location.social.instagram, location.social.facebook].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: location.name,
    url: `${SITE_URL}/${locale}/locations/${location.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: "Athens",
      addressCountry: "GR",
    },
    telephone: location.phone,
    ...(openTime && closeTime
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: openTime,
            closes: closeTime,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function generateStaticParams() {
  return locales.flatMap((locale) => getLocations().map((loc) => ({ locale, slug: loc.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const location = getLocation(slug);
  if (!location) return {};
  return {
    // Phase L fix: see menu/page.tsx — the layout's title.template already
    // appends the suffix once; this page previously appended it a second
    // time (e.g. "KAPU Kypseli — KAPU — Athens — KAPU — Athens").
    title: location.name,
    description: `${location.address} · ${location.hours[locale]}`,
    alternates: pageAlternates(locale, `/locations/${slug}`),
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const location = getLocation(slug);

  if (!location) {
    notFound();
  }

  const heroPlaceholder = location.placeholders.find((p) => p.id.endsWith("-hero"));
  const exteriorPlaceholder = location.placeholders.find((p) => p.id.endsWith("-exterior"));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationJsonLd(location, locale)) }}
      />
      {/* Phase H: this wrapper had no overflow-hidden ancestor of its own —
          the sibling hero-image div clips itself, but the floral corner
          instance sits as its sibling, not inside it. Fine at the old,
          modest width; needed now that the branch bleeds substantially
          further past its corner, or it would push a horizontal scrollbar.
          The corner instance itself is mobile-hidden: the hero band is a
          fixed 21:9 aspect, so its height shrinks linearly with viewport
          width, but Branch's mobile floor doesn't shrink nearly as fast —
          on a 390px screen the box is only ~167px tall and the floral
          reached the centered placeholder subject line (both locations
          currently render the placeholder, not a real photo, so this is a
          live collision today, not a hypothetical one). Desktop's much
          taller effective box has clearance, so it keeps the full-size
          accent; same "shrink-the-box-not-the-flower" reasoning as the
          locations-index page's corner instance below. */}
      <div className="relative overflow-hidden">
        {location.images.hero ? (
          <div className="relative aspect-[21/9] w-full overflow-hidden">
            <Image src={location.images.hero} alt={location.name} fill sizes="100vw" style={{ objectFit: "cover" }} />
          </div>
        ) : (
          heroPlaceholder && (
            <Placeholder
              subject={heroPlaceholder.subject}
              aspect="21/9"
              locale={locale}
              labelPrefix={dict.placeholder.labelPrefix}
              temporaryLabel={dict.placeholder.temporary}
              priority={heroPlaceholder.priority}
            />
          )
        )}
        <div className="hidden md:block">
          <Bougainvillea variant="corner" corner="bottom-left" focus="stem" width={620} className="opacity-40" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-10 md:py-16">
        <Link href={`/${locale}/locations`} className="text-xs font-semibold uppercase tracking-wider opacity-60 hover:opacity-100">
          ← {dict.locations.backToLocations}
        </Link>
        <h1 className="mt-3 font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
          {location.name}
        </h1>
        <p className="mt-1 text-sm opacity-70">{location.neighborhood[locale]}</p>
        <WobbleDivider className="my-8 max-w-[140px]" color="var(--accent)" />

        <LocationInfo location={location} locale={locale} dict={dict} />

        {location.images.exterior ? (
          <div className="relative mt-16 aspect-[3/2] w-full max-w-md overflow-hidden">
            <Image
              src={location.images.exterior}
              alt={location.name}
              fill
              sizes="(min-width: 768px) 400px, 100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          exteriorPlaceholder && (
            <div className="mt-16">
              <Placeholder
                subject={exteriorPlaceholder.subject}
                aspect="3/2"
                locale={locale}
                labelPrefix={dict.placeholder.labelPrefix}
                temporaryLabel={dict.placeholder.temporary}
                priority={exteriorPlaceholder.priority}
                className="max-w-md"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
