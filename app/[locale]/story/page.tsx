import type { Metadata } from "next";
import { getSiteDict, getLocations } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
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
    title: dict.story.heading,
    description: dict.story.intro,
    alternates: pageAlternates(locale, "/story"),
  };
}

/**
 * AEO/GEO entity-authority page (brief Sections 13–14). Every sentence here
 * is traceable to confirmed data already used elsewhere in the app —
 * content/locations/*.json for addresses/hours/bar program, RatingBadge's
 * client-supplied numbers, etc. No invented founding history, no owner
 * names, no fabricated milestones. The FAQ block below mirrors the exact
 * questions the brief lists as what an AI/search engine should be able to
 * answer from this site, and the FAQPage JSON-LD makes that structure
 * machine-readable without adding any text that isn't already visible.
 */
export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const locations = getLocations();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.story.faq.map((entry: { q: string; a: string }) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-5 py-20 md:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Bougainvillea variant="corner" corner="top-right" focus="bloom" width={360} className="opacity-30" />

      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{dict.story.kicker}</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
        {dict.story.heading}
      </h1>
      <WobbleDivider className="my-8 max-w-[140px]" color="var(--accent)" />

      <p className="text-lg leading-relaxed">{dict.story.intro}</p>
      <p className="mt-5 text-base leading-relaxed opacity-80">{dict.story.body}</p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {locations.map((location) => (
          <div key={location.slug} className="kapu-panel p-5">
            <p className="font-display text-xl" style={{ color: "var(--accent)" }}>
              {location.name}
            </p>
            <p className="mt-1 text-sm opacity-70">{location.address}</p>
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--brand)" }}>
              {location.hours[locale]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl" style={{ color: "var(--accent)" }}>
          {dict.story.faqHeading}
        </h2>
        <WobbleDivider className="my-5 max-w-[100px]" color="var(--accent)" />
        <dl className="space-y-6">
          {dict.story.faq.map((entry: { q: string; a: string }) => (
            <div key={entry.q}>
              <dt className="text-sm font-semibold" style={{ color: "var(--on-surface)" }}>
                {entry.q}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed opacity-75">{entry.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
