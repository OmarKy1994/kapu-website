import type { Metadata } from "next";
import { getSiteDict } from "@/lib/content";
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
    // Phase L fix: see menu/page.tsx — the layout's title.template already
    // appends the suffix once; this page previously appended it a second
    // time.
    title: dict.story.heading,
    description: dict.story.body,
    alternates: pageAlternates(locale, "/story"),
  };
}

/**
 * Deliberately minimal. No founding story, no owner names, no invented
 * history — per the brief's explicit ban on fabricated brand mythology.
 * This page grows once the client supplies real content.
 */
export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-5 py-20 md:py-32">
      {/* Phase H: this page's column is much narrower (max-w-2xl) and much
          shorter than every other page this component appears on — the
          same width used elsewhere (660) visually collided with the
          heading and body copy here, which the brief calls out as never
          acceptable. Sized down specifically for this instance rather than
          for every "corner" placement site-wide. */}
      <Bougainvillea variant="corner" corner="top-right" focus="bloom" width={360} className="opacity-30" />
      <h1 className="font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
        {dict.story.heading}
      </h1>
      <WobbleDivider className="my-8 max-w-[140px]" color="var(--accent)" />
      <p className="text-lg leading-relaxed">{dict.story.body}</p>
      <p className="mt-6 text-sm italic opacity-60">{dict.story.pending}</p>
    </div>
  );
}
