﻿import type { ReactNode } from "react";

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
 *
 * PHASE N — Section 1: genuinely responsive (art-directed) hero photography.
 * Desktop/tablet keeps the original team/storefront photo (`src`) at its
 * existing, already-tuned crop. Mobile switches to a dedicated portrait
 * photo (`mobileSrc`) — a different photograph, not a resized crop of the
 * same image — so this can't be done with next/image's built-in
 * responsive `sizes`/`srcSet` (that only varies resolution, not which
 * photo). A native <picture>/<source media> swap is the only way to do
 * true art direction without JS viewport detection, and the browser only
 * ever fetches the one image that matches, so there's no double-load.
 * next/image's own <Image> component doesn't support multiple <source>
 * elements, so the URLs below are hand-built against Next's image
 * optimizer endpoint (`/_next/image?url=...&w=...&q=...`) — the same
 * endpoint <Image> itself would generate — using only widths from this
 * project's default `deviceSizes` and the `q` values allow-listed in
 * next.config.ts's `images.qualities` ([75, 92]), so these requests hit
 * the optimizer's cache exactly like a normal <Image> would.
 */
const DEVICE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const MOBILE_WIDTHS = [640, 750, 828, 1080];
const IMAGE_QUALITY = 92;

function optimizedUrl(src: string, width: number, quality = IMAGE_QUALITY) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

function buildSrcSet(src: string, widths: number[]) {
  return widths.map((w) => `${optimizedUrl(src, w)} ${w}w`).join(", ");
}

export default function FullBleedHero({
  src,
  alt,
  mobileSrc,
  kicker,
  greekPhrase,
  englishTranslation,
  locale,
  sub,
  children,
}: {
  src: string;
  // Single alt is a real constraint of <picture>: only the fallback <img>
  // carries an alt attribute, and it's what AT reads regardless of which
  // <source> the browser actually painted. There's no server-side way to
  // know the client's viewport ahead of render, and adding JS to pick one
  // is exactly what this section rules out. `alt` is written to stay true
  // across both photos (team + storefront signage on desktop, the same
  // hanging shop sign on mobile) rather than describing either one's full
  // detail — see the call site in app/[locale]/page.tsx.
  alt: string;
  /** Dedicated portrait photo shown below the md breakpoint (767px). */
  mobileSrc: string;
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
      {/* Preserves the LCP preload the old single <Image priority> gave us
          for free — React/Next hoist <link> tags rendered anywhere in a
          Server Component to <head> automatically. Each preload carries the
          same `media` condition as its matching <source>/crop below, so the
          browser only ever fetches the one that applies — no double-load. */}
      <link
        rel="preload"
        as="image"
        href={optimizedUrl(mobileSrc, MOBILE_WIDTHS[MOBILE_WIDTHS.length - 1])}
        imageSrcSet={buildSrcSet(mobileSrc, MOBILE_WIDTHS)}
        imageSizes="100vw"
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={optimizedUrl(src, DEVICE_WIDTHS[DEVICE_WIDTHS.length - 1])}
        imageSrcSet={buildSrcSet(src, DEVICE_WIDTHS)}
        imageSizes="100vw"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <picture>
        {/* Mobile (<768px): the dedicated portrait photo. Verified live
            (injected against the real deployed asset at 320–428px widths,
            with the scrim applied) that a plain centered crop reproduces
            the photo's own composition correctly — full sign on top, full
            cup+hand at bottom — at every common phone size, so unlike the
            old team photo this needs no shifted object-position. */}
        <source
          media="(max-width: 767px)"
          srcSet={buildSrcSet(mobileSrc, MOBILE_WIDTHS)}
          sizes="100vw"
        />
        <img
          src={optimizedUrl(src, DEVICE_WIDTHS[DEVICE_WIDTHS.length - 1])}
          srcSet={buildSrcSet(src, DEVICE_WIDTHS)}
          sizes="100vw"
          alt={alt}
          fetchPriority="high"
          // Desktop crop is untouched from Phase M (object-[50%_18%]).
          // Mobile crop is the dedicated photo's own natural centering —
          // see the <source> comment above.
          className="absolute inset-0 h-full w-full object-cover object-center md:object-[50%_18%]"
        />
      </picture>
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