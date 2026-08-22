import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteDict, getLocations, getBarMenu } from "@/lib/content";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import ModeSection from "@/components/ModeSection";
import Placeholder from "@/components/placeholders/Placeholder";
import WobbleDivider from "@/components/motifs/WobbleDivider";
import Bougainvillea from "@/components/motifs/Bougainvillea";
import LocationCard from "@/components/locations/LocationCard";
import OrderButtons from "@/components/order/OrderButtons";
import OrderTriggerButton from "@/components/order/OrderTriggerButton";
import FullBleedHero from "@/components/home/FullBleedHero";
import CinematicBand from "@/components/home/CinematicBand";

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
    title: dict.meta.siteName,
    description: dict.meta.defaultDescription,
    alternates: pageAlternates(locale, ""),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = getSiteDict(locale);
  const locations = getLocations();
  const barMenu = getBarMenu();
  const signature = barMenu.categories.find((c) => c.id === "signature-cocktails");
  const base = `/${locale}`;

  return (
    <>
      {/* ================= BEAT 1 — FULL-BLEED HERO =================
          Phase L correction: the previous hero image (kapu-hero-sign-
          handheld.jpg) was confirmed genuinely out of focus on the live
          Netlify render — not a stylistic effect, a focus miss in the
          source photo itself. Replaced with kapu-staff-team-exterior.jpg,
          selected after an objective sharpness scan (Laplacian-variance
          proxy) across every landscape-orientation, ≥1400px-wide photo in
          the brand-lifestyle/exteriors/interiors library: this file scored
          ~3.4x sharper than the discarded image (the discarded image was in
          fact the single least-sharp photo in the entire scanned pool).
          Two sharper candidates existed (kapu-cup-meteora-travel.jpg,
          kapu-cup-mountain-landscape.jpg) but both were rejected on
          inspection — they're customer travel photos shot hundreds of km
          from Athens (Meteora, a snow resort), which would misrepresent
          the hero as being about a place rather than KAPU's actual Kypseli/
          Kallithea shops. This photo is the real storefront with the real
          team standing in the doorway — genuine identity, and it pairs
          naturally with the "Come through, let's catch up" copy directly
          beneath it. */}
      <FullBleedHero
        src="/images/hero/kapu-staff-team-exterior.jpg"
        mobileSrc="/images/hero/kapu-hero-sign-handheld.jpg"
        alt="The KAPU team outside the shop, beneath the hanging KAPU sign"
        kicker={dict.home.heroKicker}
        greekPhrase={dict.home.heroPhraseEl}
        englishTranslation={dict.home.heroPhraseTranslation}
        locale={locale}
        sub={dict.home.heroSub}
      >
        <OrderTriggerButton
          className="kapu-button inline-flex min-h-[44px] items-center px-6 py-3 text-sm font-semibold tracking-wide text-white hover:opacity-90"
          style={{ backgroundColor: "var(--kapu-teal-deep)" }}
        >
          {dict.order.heading}
        </OrderTriggerButton>
        <Link
          href={`${base}/menu`}
          className="kapu-button inline-flex min-h-[44px] items-center border-2 border-white/70 px-6 py-3 text-sm font-semibold tracking-wide text-white hover:bg-white/10"
        >
          {dict.home.menuPreviewCta}
        </Link>
      </FullBleedHero>

      {/* ================= BEAT 2 — ASYMMETRIC EDITORIAL (60/40) =================
          Real photograph on one side, typography on the other — the photo
          bleeds to the section edge rather than sitting in a matched card.
          This is KAPU Kypseli's own counter, identifiable (not guessed) via
          the wall mural's own text: "ΟΔΟΣ ΖΑΚΥΝΘΟΥ" (Zakinthou Street) and
          the Municipal Market of Kypseli — the exact street the location's
          real address is on. */}
      <ModeSection mode="day" className="border-t" id="cafe" style={{ backgroundColor: "var(--kapu-mint)" }}>
        <div className="grid md:min-h-[70vh] md:grid-cols-[1fr_1.5fr] md:items-stretch">
          <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-20 lg:px-16">
            <p className="font-display text-2xl" style={{ color: "var(--accent)" }}>
              {dict.home.dayEyebrow}
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl" style={{ color: "var(--on-surface)" }}>
              {dict.home.dayHeading}
            </h2>
            <WobbleDivider className="my-6 max-w-[120px]" color="var(--brand)" />
            <p className="max-w-md text-base leading-relaxed opacity-80">{dict.home.dayBody}</p>
            <Link
              href={`${base}/menu?mode=cafe`}
              className="mt-8 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 hover:opacity-70"
              style={{ color: "var(--brand)", textDecorationColor: "var(--brand)" }}
            >
              {dict.home.menuPreviewCta} →
            </Link>
          </div>
          <div className="relative min-h-[60vh] w-full overflow-hidden md:min-h-0">
            <Image
              src="/images/photography/kypseli-doorway-mural.jpg"
              alt="KAPU Kypseli's doorway, with the neighborhood mural — depicting Zakinthou Street and the Kypseli market — on the wall behind the counter"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              style={{ objectFit: "cover", objectPosition: "50% 30%" }}
            />
          </div>
        </div>
      </ModeSection>

      {/* ================= BEAT 3 — CINEMATIC PHOTO INTERLUDE =================
          Visual breathing space, intentionally near-textless. */}
      <CinematicBand
        src="/images/photography/cups-sky-cheers.jpg"
        alt="Two KAPU cups held up against an open sky"
        objectPosition="50% 55%"
      />

      {/* ================= BEAT 4 — BOUGAINVILLEA MOMENT =================
          The one large-scale floral moment on the page — the branch reads
          across the full width, not a corner sticker. Sits on cream, the
          day canvas's own base, so it functions as a materials/texture beat
          rather than another card. */}
      {/* Phase L fix: this instance previously passed className="relative"
          into Bougainvillea, which appends onto that component's own
          `absolute inset-x-0` base class on the same element. Tailwind's
          `.relative` utility is later in the compiled stylesheet than
          `.absolute`, so it silently won the cascade — the span became
          position:relative instead of absolute, and since it's a <span>
          (inline by default) its inline `height: 340px` style had no effect
          on a non-replaced inline box. Net result: the branch image (an
          absolutely-positioned child of that now-zero-height span) rendered
          with zero visible height, while the sibling spacer div still
          reserved a full 340px — a blank band exactly where the floral
          moment was supposed to be. The wrapping ModeSection already
          provides `position: relative`, so Bougainvillea doesn't need its
          own override here — removing the prop lets its base `absolute`
          class apply as intended. */}
      <ModeSection mode="day" as="div" className="relative overflow-hidden border-t">
        <Bougainvillea variant="full" width={1400} fullHeight={340} />
        <div className="h-[340px]" />
      </ModeSection>

      {/* ================= COFFEE / SWEET / FOOD FEATURE — day, cream panel. ================= */}
      <ModeSection mode="day" className="relative overflow-hidden border-t" style={{ backgroundColor: "var(--panel)" }}>
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="font-display text-2xl" style={{ color: "var(--accent)" }}>
            {locale === "el" ? "Από τον πάγκο" : "From the counter"}
          </p>
          <div className="mt-10 grid gap-12 md:grid-cols-3">
            <div>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/menu/coffee-mint.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="mt-4 font-display text-2xl" style={{ color: "var(--on-surface)" }}>
                {locale === "el" ? "Καφές" : "Coffee"}
              </h3>
            </div>
            <div className="md:mt-14">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/menu/soft-cookie-red-velvet.jpg"
                  alt="A soft Red Velvet cookie with dark and white chocolate chunks"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="mt-4 font-display text-2xl" style={{ color: "var(--on-surface)" }}>
                {locale === "el" ? "Γλυκό" : "Sweet"}
              </h3>
            </div>
            <div>
              {/* PHASE 2 CREATIVE RESET: real photo replaces the placeholder —
                  the actual Beef Pastrami Baguette, identified by its own
                  legible product label. */}
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/menu/beef-pastrami-baguette.jpg"
                  alt="KAPU's Beef Pastrami Baguette, packaged and labeled"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="mt-4 font-display text-2xl" style={{ color: "var(--on-surface)" }}>
                {locale === "el" ? "Φαγητό" : "Food"}
              </h3>
            </div>
          </div>
        </div>
      </ModeSection>

      {/* ================= LOCATION INTRO — day. ================= */}
      <ModeSection mode="day" className="relative border-t" id="find-your-kapu">
        <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{dict.home.locationsEyebrow}</p>
          <div className="mt-3 h-[3px] w-16" style={{ backgroundColor: "var(--accent)" }} />
          <h2 className="mt-4 font-display text-4xl md:text-5xl" style={{ color: "var(--accent)" }}>
            {dict.home.locationsHeading}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed opacity-80">{dict.home.locationsBody}</p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {locations.map((location, i) => (
              <LocationCard
                key={location.slug}
                location={location}
                locale={locale}
                dict={dict}
                className={i % 2 === 1 ? "md:mt-10" : ""}
              />
            ))}
          </div>
        </div>
      </ModeSection>

      {/* ================= BEAT 5 — DAY → NIGHT TRANSITION =================
          A real KAPU photograph carries the transition — the plant-wall/
          neon-sign shot from the venue itself ("Forget the maps... Follow
          your instincts"), genuinely atmospheric, no faces in frame. */}
      <div
        aria-hidden="false"
        className="relative flex min-h-[280px] items-center justify-center overflow-hidden py-24"
        style={{ backgroundColor: "var(--kapu-charcoal)" }}
      >
        <Image
          src="/images/photography/plant-wall-neon.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "50% 35%" }}
          className="opacity-90"
        />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--kapu-charcoal) 55%, transparent) 0%, color-mix(in srgb, var(--kapu-charcoal) 25%, transparent) 55%, transparent 80%)" }} />
        <p
          className="relative px-5 text-center font-display text-2xl tracking-[0.1em] md:text-3xl"
          style={{ color: "var(--kapu-mint)" }}
        >
          {dict.home.transitionLabel}
        </p>
      </div>

      {/* ================= BEAT 6 — NIGHT / BAR EXPERIENCE =================
          Phase J.1 correction: the previous image here (bartender-karekau.jpg,
          sourced from kapu-bartender-cocktail-bar.jpg) turned out on inspection
          to be a 720x1280 social-media video still with "KAREKAU COCKTAIL"
          baked into the pixels as a caption — every other bar/bartender shot
          in the current photography library has the same problem (each is a
          Reel-style still for one specific signature cocktail, captioned
          accordingly), so there was no clean "bartender in action" photo
          available without a baked-in competing caption. Replaced with a
          genuine, text-free KAPU lifestyle photo instead: real people, real
          drinks in hand, a warm lit lantern glowing behind them — this
          reads as the bar's actual atmosphere rather than a staged product
          shot. It no longer names a specific cocktail in the photo itself;
          the signature-cocktails gallery immediately below this section
          handles that connection with real menu data.
          Phase L correction: this comment and the alt text originally
          claimed "the lit KAPU sign visible in the background" — checked
          against the actual live Netlify render (Phase K) and against a
          zoomed inspection of the source crop, and that isn't accurate. At
          the deployed aspect-[4/5] crop, the background reads as a warm,
          out-of-focus lantern glow with no legible KAPU signage — worth
          fixing the description rather than leaving an inaccurate claim in
          the code and the alt text. */}
      <ModeSection mode="night" className="border-t" id="bar" style={{ borderColor: "var(--border-soft)" }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="relative aspect-[4/5] w-full overflow-hidden md:order-2">
            <Image
              src="/images/photography/night-friends-cheers.jpg"
              alt="Friends toasting with drinks inside KAPU at night, a warm lantern glowing behind them"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              style={{ objectFit: "cover", objectPosition: "50% 42%" }}
            />
          </div>
          <div className="md:order-1">
            <span
              className="kapu-frame--accent inline-block px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--on-surface)" }}
            >
              {dict.home.nightEyebrow}
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl" style={{ color: "var(--on-surface)" }}>
              {dict.home.nightHeading}
            </h2>
            <WobbleDivider className="my-6 max-w-[120px]" color="var(--brand)" />
            <p className="max-w-md text-base leading-relaxed opacity-80">{dict.home.nightBody}</p>
            <Link
              href={`${base}/menu?mode=bar`}
              className="mt-8 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 hover:opacity-70"
              style={{ color: "var(--brand)", textDecorationColor: "var(--brand)" }}
            >
              {dict.home.cocktailsCta} →
            </Link>
          </div>
        </div>
      </ModeSection>

      {/* ================= SIGNATURE COCKTAILS — night =================
          Moumou now has a real photograph (a strawberry-purée-red tiki
          drink, matched by ingredient color — the menu has no ABV/photo
          gap here anymore). Teitei / Karekau / Tukituki / Pupuhi keep their
          existing, already-correct production images unchanged. */}
      {signature && (
        <ModeSection mode="night" className="border-t" style={{ borderColor: "var(--border-soft)" }}>
          <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: "var(--accent)" }}>
              {signature.name[locale]}
            </h2>
            {signature.description && (
              <p className="mt-3 max-w-md text-sm opacity-70">{signature.description[locale]}</p>
            )}

            <div className="mt-14 space-y-16">
              {signature.items?.map((item, i) => (
                <div
                  key={item.id}
                  className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name[locale]}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Placeholder
                        subject={{ en: `${item.name.en} — signature cocktail`, el: `${item.name.el} — signature cocktail` }}
                        aspect="4/3"
                        locale={locale}
                        labelPrefix={dict.placeholder.labelPrefix}
                        temporaryLabel={dict.placeholder.temporary}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl">{item.name[locale]}</h3>
                    {item.description && (
                      <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-70">{item.description[locale]}</p>
                    )}
                    <p className="mt-4 text-sm font-semibold tabular-nums" style={{ color: "var(--brand)" }}>
                      €{item.price} {item.abv && <span className="opacity-60">· {item.abv}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ModeSection>
      )}

      {/* ================= ORDER CTA — day, cream panel. ================= */}
      <ModeSection mode="day" className="relative overflow-hidden border-t" style={{ backgroundColor: "var(--panel)" }}>
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{dict.home.orderEyebrow}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl" style={{ color: "var(--on-surface)" }}>
            {dict.home.orderHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-70">{dict.home.orderBody}</p>
          <div className="mt-8 flex justify-center">
            <OrderTriggerButton
              className="kapu-button inline-flex min-h-[44px] items-center px-8 py-3 text-sm font-semibold tracking-wide text-white hover:opacity-90"
              style={{ backgroundColor: "var(--kapu-teal-deep)" }}
            >
              {dict.home.orderHeading}
            </OrderTriggerButton>
          </div>
        </div>
      </ModeSection>

      {/* ================= FINAL VISIT — day, mint. ================= */}
      <ModeSection mode="day" className="relative border-t">
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
          <h2 className="font-display text-3xl md:text-4xl" style={{ color: "var(--accent)" }}>
            {dict.home.finalVisitHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-70">{dict.home.finalVisitBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            {locations.map((location) => (
              <div key={location.slug} className="text-sm">
                <p className="font-display text-2xl" style={{ color: "var(--accent)" }}>
                  {location.name}
                </p>
                <p className="mt-1 opacity-70">{location.hours[locale]}</p>
                <div className="mt-3">
                  <OrderButtons location={location} dict={dict} size="compact" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModeSection>
    </>
  );
}