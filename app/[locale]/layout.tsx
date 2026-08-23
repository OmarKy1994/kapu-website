import type { Metadata } from "next";
import "../globals.css";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getSiteDict } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import Nav from "@/components/nav/Nav";
import MobileNav from "@/components/nav/MobileNav";
import Footer from "@/components/footer/Footer";
import OrderModalProvider from "@/components/order/OrderModalProvider";

// Fonts are self-hosted via @fontsource, imported once in globals.css
// (app/fonts.css) rather than fetched from Google Fonts at request time —
// see that file for the full rationale and the Majesty-substitute research
// trail. Poppins/Inter/EB Garamond are plain CSS font-family names here,
// no next/font/google wiring needed.

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = getSiteDict(locale);
  // The real KAPU storefront/team photo already used as the homepage hero —
  // a genuine site photo, not a fabricated social-share graphic, used as
  // the fallback OG/Twitter image for any page that doesn't set its own.
  const ogImage = `${SITE_URL}/images/hero/kapu-staff-team-exterior.jpg`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.meta.siteName, template: `%s — ${dict.meta.titleSuffix}` },
    description: dict.meta.defaultDescription,
    alternates: {
      languages: { en: "/en", el: "/el" },
    },
    openGraph: {
      siteName: dict.meta.siteName,
      description: dict.meta.defaultDescription,
      locale: locale === "el" ? "el_GR" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: dict.meta.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteName,
      description: dict.meta.defaultDescription,
      images: [ogImage],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getSiteDict(locale);
  // Poppins has no Greek glyphs, so the body face swaps to Inter for /el —
  // both feed the same --font-kapu-body token components already read,
  // never a silent system-font fallback. Display face is Majesty (EN) /
  // Comfortaa (EL) — see app/fonts.css for the full research trail
  // (including the honest licensing flag on Majesty itself). Majesty only
  // ships one weight (400) and already reads decorative at display sizes;
  // Comfortaa needs an explicit 700 to match that visual weight, so the
  // weight travels as its own token alongside the family.
  // Note: the hero's Greek tagline is forced to Comfortaa on BOTH locales
  // via the `.font-display[lang="el"]` rule in globals.css, since Majesty
  // has zero Greek glyph coverage (verified via cmap) — this per-locale
  // variable only governs the rest of each locale's own-language headings.
  //
  // PHASE I: 'Alex Brush' → 'Majesty', the real supplied font file,
  // replacing Phase H's disclosed stand-in now that the actual TTF exists.
  // This is a request-scoped variable read by the .font-display CSS rule,
  // so every existing .font-display element on the English site picks it
  // up automatically; nothing else needed to change. Two exceptions, both
  // intentional and both still on Comfortaa regardless of this variable:
  // the homepage hero headline and the footer tagline are both Greek brand
  // copy (`lang="el"`) shown on the English site too, and the
  // `.font-display[lang="el"]` override in globals.css takes over for them
  // specifically, for the same Greek-glyph-coverage reason described above.
  const bodyFontFamily = locale === "el" ? "'Inter'" : "'Poppins'";
  const displayFontFamily = locale === "el" ? "'Comfortaa'" : "'Majesty'";
  const displayFontWeight = locale === "el" ? "700" : "400";

  return (
    <html lang={locale}>
      <body
        // Phase H: "font-body" removed from this className — it was a
        // Tailwind-auto-generated utility that no longer exists now that
        // --font-body isn't declared inside @theme (see the CSS fix note
        // in globals.css); the plain `body { font-family: ... }` tag rule
        // there already sets the real font, so this was dead weight.
        className="antialiased"
        style={
          {
            "--font-kapu-body": bodyFontFamily,
            "--font-kapu-display": displayFontFamily,
            "--font-kapu-display-weight": displayFontWeight,
          } as React.CSSProperties
        }
      >
        <a href="#main" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        {/* PHASE I — Section 7: one modal instance, shared by the desktop
            nav Order button and the mobile bottom-bar Order button, so
            "Order → choose location → choose platform" is a single fast
            in-page interaction instead of a page hop to /order. */}
        <OrderModalProvider locale={locale} dict={dict}>
          <Nav locale={locale} dict={dict} />
          <main id="main" className="pb-24 md:pb-0">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
          <MobileNav locale={locale} dict={dict} />
        </OrderModalProvider>
      </body>
    </html>
  );
}
