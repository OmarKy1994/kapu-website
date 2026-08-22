import type { Metadata } from "next";
import { getSiteDict, getLocations } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import OrderButtons from "@/components/order/OrderButtons";
import RatingBadge from "@/components/order/RatingBadge";
import WobbleDivider from "@/components/motifs/WobbleDivider";

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
    title: dict.order.heading,
    description: dict.order.sub,
    alternates: pageAlternates(locale, "/order"),
  };
}

export default async function OrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const locations = getLocations();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
        {dict.order.heading}
      </h1>
      <p className="mt-3 max-w-md text-sm opacity-70">{dict.order.sub}</p>
      <WobbleDivider className="my-8 max-w-[140px]" color="var(--accent)" />

      {/* Trust signals — aggregate ratings only, never individual review
          quotes. Wolt's own rating was left blank by KAPU and is not
          estimated or shown. */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <RatingBadge label="Box" rating="4.8" count={3084} locale={locale} />
        <RatingBadge label="efood" rating="4.9" count={1944} locale={locale} />
        <RatingBadge label="Google" rating="4.7" count={338} locale={locale} />
      </div>

      <div className="mt-10 space-y-10">
        {locations.map((location) => (
          <div key={location.slug}>
            {/* PHASE N — Section 4: Majesty removed from location names. */}
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--accent)" }}>{location.name}</h2>
            <p className="mt-1 text-xs opacity-60">{location.neighborhood[locale]}</p>
            <div className="mt-4">
              <OrderButtons location={location} dict={dict} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}