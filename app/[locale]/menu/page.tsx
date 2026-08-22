import type { Metadata } from "next";
import { getSiteDict, getCafeMenu, getBarMenu } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import MenuView from "@/components/menu/MenuView";

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
    // Phase L fix: the layout's own generateMetadata already defines
    // `title.template: "%s — " + titleSuffix`, which Next.js applies
    // automatically to any nested route's title (this page is a separate
    // segment from the layout, so it's in scope for the template). Manually
    // re-appending the suffix here duplicated it ("Menu — KAPU — Athens —
    // KAPU — Athens"). Passing just the heading lets the template supply
    // the suffix exactly once.
    title: dict.menu.heading,
    description: dict.menu.sub,
    alternates: pageAlternates(locale, "/menu"),
  };
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const cafe = getCafeMenu();
  const bar = getBarMenu();

  return <MenuView cafe={cafe} bar={bar} locale={locale} dict={dict} />;
}
