import Image from "next/image";
import type { ReactNode } from "react";

/**
 * BEAT 1 — the true full-bleed hero the Creative Reset calls for: one
 * photograph filling the viewport, no split, no card. Type sits directly on
 * the photo, legible via a bottom-anchored scrim (not a wash across the
 * whole frame) so the photograph itself still carries the opening moment.
 *
 * Typography: the real KAPU tagline ("Πάμε #kapu να τα πούμε;") is Greek —
 * it stays in Comfortaa (the Greek-safe display face) as the primary
 * headline on both locales, matching the physical mural inside KAPU Kypseli
 * itself. Majesty (Latin-only, no Greek glyph coverage) is reserved for the
 * short English translation beneath it on the /en route — a real, already
 * -localized line, not invented copy.
 */
export default function FullBleedHero({
  src,
  alt,
  kicker,
  greekPhrase,
  englishTranslation,
  locale,
  sub,
  children,
}: {
  src: string;
  alt: string;
  kicker: string;
  greekPhrase: string;
  englishTranslation?: string;
  locale: "en" | "el";
  sub: string;
  children: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden" style={{ backgroundColor: "var(--kapu-charcoal)" }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        quality={90}
        style={{ objectFit: "cover", objectPosition: "50% 18%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          // Phase M fix: this was originally built with color-mix(in srgb,
          // var(--kapu-charcoal) X%, transparent), which computes to the CSS
          // Color 4 `color(srgb r g b / alpha)` function. Confirmed live on
          // the redeployed Netlify site (isolated by swapping this one rule
          // in the live DOM via devtools): Chrome paints a gradient that
          // mixes a `color(srgb ...)` stop with the literal `transparent`
          // keyword as fully OPAQUE across the whole element, not
          // interpolating the alpha channel at all — the entire hero
          // rendered as a solid black band, completely hiding the photo and
          // making the section look broken rather than just having a scrim.
          // Same visual values (--kapu-charcoal is #0f1015 = rgb(15,16,21)),
          // expressed as plain rgba() instead of color-mix(): plain rgba()
          // stops interpolate correctly with `transparent` in this browser,
          // and the fix was verified live before being applied here.
          background:
            "linear-gradient(to top, rgba(15, 16, 21, 0.9) 0%, rgba(15, 16, 21, 0.58) 34%, transparent 64%)",
        }}
      />
      <div className="relative z-10 w-full px-5 pb-14 pt-32 md:px-12 md:pb-20 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">{kicker}</p>
        <h1 lang="el" className="font-display mt-4 max-w-3xl text-[13vw] leading-[1.0] text-white md:text-6xl lg:text-7xl">
          {greekPhrase}
        </h1>
        {locale === "en" && englishTranslation && (
          <p className="font-display mt-3 max-w-md text-2xl text-white/90 md:text-3xl" style={{ fontFamily: "Majesty, ui-serif, Georgia, serif" }}>
            {englishTranslation}
          </p>
        )}
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 md:text-lg">{sub}</p>
        <div className="mt-8 flex flex-wrap gap-4">{children}</div>
      </div>
    </section>
  );
}
