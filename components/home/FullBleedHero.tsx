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
    <section
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden"
      style={{
        backgroundColor: "var(--kapu-charcoal)",
        // Phase M fix, part 2: the gradient CSS itself was never the bug —
        // re-verified live that rgba(...,0) still painted the hero fully
        // opaque on a genuinely fresh page load (no scroll, no JS touch),
        // and stayed that way indefinitely, only correcting the instant
        // any repaint was forced (e.g. a scroll). That's a first-paint
        // compositing race between this section's dark fallback background
        // and its absolutely-positioned Image/scrim children, not a
        // gradient-syntax issue. Promoting the section to its own
        // GPU-composited layer up front (a standard, inert fix for this
        // exact class of bug) forces the browser to composite the whole
        // subtree together from the first frame instead of racing it.
        transform: "translateZ(0)",
      }}
    >
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
          // Phase M fix (revised): the real trigger isn't color-mix()
          // specifically — it's the literal `transparent` keyword appearing
          // as a color-stop alongside non-keyword stops (rgba() or
          // color(srgb ...)) in a multi-stop gradient. Confirmed live on the
          // redeployed Netlify site by toggling this exact rule in the live
          // DOM: a first attempt that swapped color-mix() for rgba() but
          // still ended the gradient on the bare `transparent` keyword still
          // painted fully OPAQUE, hiding the photo entirely. Replacing that
          // keyword with the equivalent explicit rgba(15, 16, 21, 0) — same
          // color, alpha 0 spelled out instead of the keyword — was verified
          // live to interpolate correctly and reveal the photo, and is the
          // fix actually applied here. See also the day/night transition
          // gradient in app/[locale]/page.tsx, which was re-checked against
          // this same root cause.
          background:
            "linear-gradient(to top, rgba(15, 16, 21, 0.9) 0%, rgba(15, 16, 21, 0.58) 34%, rgba(15, 16, 21, 0) 64%)",
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
