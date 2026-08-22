import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import { getLocations } from "@/lib/content";
import WobbleDivider from "@/components/motifs/WobbleDivider";

/** Small, hand-drawn-weight glyphs — not a full icon library, just enough
 * line to read as "Instagram" / "Facebook" inside a pink circular badge,
 * the way the PDF's back-page footer marks its social handles. */
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M15 4h-2.2C10.7 4 9.5 5.3 9.5 7.3V10H7v3.2h2.5V20h3.3v-6.8H15l.6-3.2h-3.1V7.6c0-.8.4-1.2 1.3-1.2H15V4Z" />
    </svg>
  );
}
/** TikTok is on the printed menu's own back page (page 7) alongside
 * Instagram and Facebook, but was never wired into the site — a
 * simplified line-weight note glyph, matching the hand-drawn register of
 * the other two rather than a literal trace of TikTok's mark. */
function TikTokGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M13 3.5v11.2a2.8 2.8 0 1 1-2.2-2.74" strokeLinecap="round" />
      <path d="M13 3.5c.3 2.1 1.9 3.7 4 4v2.1c-1.5 0-2.9-.5-4-1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * PHASE O — footer floral redesign.
 *
 * Phase N's fix (a `pair` Bougainvillea instance masked at each corner with a
 * radial gradient) still read, on live inspection, as a rectangular photo of
 * flowers parked in two corners: a soft-edged sticker, not something grown
 * into the page. The corner box's own top/bottom edges were still straight
 * lines the mask didn't reach, the two corners mirrored each other into a
 * symmetrical "frame," and at mobile widths the same box scaled down into a
 * small accidental smudge near the fine print rather than a deliberate
 * composition.
 *
 * This replaces that with two structurally different pieces, validated live
 * against the real bougainvillea-source.png (see phase-o report §2 for the
 * strategies considered):
 *
 *  - FooterFloralBand: a low, wide strip that sits ABOVE the footer's own
 *    mint background, in the normal document flow (not layered on top of
 *    content) — a soft-edged (linear mask, top+bottom feather) glimpse of
 *    the branch at the seam between the last page section and the footer,
 *    the "organic border/interruption" the brief asks for rather than a
 *    hard color-block boundary.
 *  - EdgeBloom (x2): large fragments anchored at the true left/right edges
 *    of the layout, translated mostly off-canvas, each faded on every side
 *    by a radial mask anchored at its own outward point — the source of the
 *    old "rectangular sticker" complaint. Desktop and mobile use different
 *    vertical placements (not just a scaled-down copy of the same layout):
 *    desktop reads left-top / right-bottom; mobile flips to right-top /
 *    left-bottom, since the corner nearer the credit line got crowded when
 *    tested at the old bottom-anchored position on a tall mobile footer.
 *
 * The footer's info architecture, full logo, links, contact panel, and
 * color system are all unchanged — only the floral treatment and the
 * footer's own layout wrapper (split into a band + a solid-mint content
 * area, instead of one bordered box) changed.
 */
function FooterFloralBand() {
  return (
    <div aria-hidden="true" className="relative h-[110px] w-full overflow-hidden md:h-[170px]">
      <Image
        src="/images/logo/bougainvillea-source.png"
        alt=""
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          objectPosition: "50% 40%",
          transform: "scale(1.3)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 68%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%, black 68%, transparent 100%)",
        }}
      />
    </div>
  );
}

function EdgeBloom({
  side,
  focus,
  posClass,
  sizeClass,
}: {
  side: "left" | "right";
  focus: string;
  posClass: string;
  sizeClass: string;
}) {
  // Anchor the fade at the fragment's own outward point (the edge already
  // bleeding off-canvas) so the taper costs nothing there and instead eats
  // into the box's inward/top/bottom edges — the same idea as
  // Bougainvillea.tsx's cornerMask, but a wide ellipse anchored at a true
  // viewport edge rather than a section corner.
  const anchor = side === "left" ? "0% 30%" : "100% 78%";
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${posClass} ${sizeClass}`}
      style={{
        maskImage: `radial-gradient(ellipse 70% 65% at ${anchor}, black 40%, transparent 78%)`,
        WebkitMaskImage: `radial-gradient(ellipse 70% 65% at ${anchor}, black 40%, transparent 78%)`,
      }}
    >
      <Image
        src="/images/logo/bougainvillea-source.png"
        alt=""
        fill
        sizes="(min-width: 768px) 560px, 260px"
        style={{ objectFit: "cover", objectPosition: focus, transform: "scale(1.3)" }}
      />
    </span>
  );
}

export default function Footer({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const base = `/${locale}`;
  const locations = getLocations();
  const year = 2026;

  return (
    <footer
      data-mode="day"
      className="relative border-t"
      style={{ color: "var(--on-surface)", borderColor: "var(--border-soft)" }}
    >
      <FooterFloralBand />
      <div
        className="relative overflow-hidden pb-24 pt-16 md:pb-16"
        style={{ backgroundColor: "var(--kapu-mint)" }}
      >
        {/* Desktop: stem enters top-left, bloom mass exits bottom-right —
            asymmetric, not a mirrored pair. Mobile flips to right-top /
            left-bottom (see the component comment above) since a tall
            stacked mobile footer crowded the credit line otherwise. */}
        <EdgeBloom
          side="left"
          focus="6% 55%"
          posClass="-left-[90px] bottom-10 md:bottom-auto md:-left-[180px] md:top-[-30px]"
          sizeClass="w-[230px] h-[210px] md:w-[460px] md:h-[420px]"
        />
        <EdgeBloom
          side="right"
          focus="88% 30%"
          posClass="-right-[100px] top-5 md:top-auto md:-right-[200px] md:bottom-[-40px]"
          sizeClass="w-[260px] h-[230px] md:w-[560px] md:h-[480px]"
        />
        <div className="relative mx-auto max-w-6xl px-5">
        {/* PHASE N — Section 5A: was icon PNG + a live "KAPU" text span
            standing in for a wordmark (the same pattern Phase I already
            flagged and fixed in Nav.tsx). Replaced with the actual full
            logo asset (icon + wordmark already lettered together in one
            image, same file Nav.tsx uses) instead of recreating the text —
            aspect-ratio wrapper (not a fixed width+height) so it can't be
            squashed or stretched at this footer's smaller scale. */}
        <Link href={base} className="inline-flex items-center" aria-label="KAPU — home">
          <span className="relative block h-12" style={{ aspectRatio: "1454 / 1584" }}>
            <Image
              src="/images/logo/kapu-logo-full.png"
              alt=""
              fill
              sizes="44px"
              style={{ objectFit: "contain" }}
            />
          </span>
        </Link>
        <p lang="el" className="mt-5 font-display text-2xl md:text-3xl" style={{ color: "var(--accent)" }}>
          {dict.footer.tagline}
        </p>
        <WobbleDivider className="my-6 max-w-xs" color="var(--accent)" />

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.footer.locationsHeading}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`${base}/locations/${loc.slug}`} className="hover:opacity-70">
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.footer.menuHeading}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={`${base}/menu?mode=cafe`} className="hover:opacity-70">
                  {dict.menu.modeCafe}
                </Link>
              </li>
              <li>
                <Link href={`${base}/menu?mode=bar`} className="hover:opacity-70">
                  {dict.menu.modeBar}
                </Link>
              </li>
              <li>
                <Link href={`${base}/story`} className="hover:opacity-70">
                  {dict.nav.story}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.footer.followHeading}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {locations.flatMap((loc) =>
                [
                  loc.social.instagram && (
                    <a
                      key={`${loc.slug}-ig`}
                      href={loc.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${loc.name} · Instagram`}
                      title={`${loc.name} · Instagram`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:opacity-85"
                      style={{ backgroundColor: "var(--accent-fill)" }}
                    >
                      <InstagramGlyph />
                    </a>
                  ),
                  loc.social.facebook && (
                    <a
                      key={`${loc.slug}-fb`}
                      href={loc.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${loc.name} · Facebook`}
                      title={`${loc.name} · Facebook`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:opacity-85"
                      style={{ backgroundColor: "var(--accent-fill)" }}
                    >
                      <FacebookGlyph />
                    </a>
                  ),
                  loc.social.tiktok?.handle && (
                    <a
                      key={`${loc.slug}-tt`}
                      href={`https://www.tiktok.com/@${loc.social.tiktok.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${loc.name} · TikTok`}
                      title={`${loc.name} · TikTok`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:opacity-85"
                      style={{ backgroundColor: "var(--accent-fill)" }}
                    >
                      <TikTokGlyph />
                    </a>
                  ),
                ].filter(Boolean)
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
              {dict.nav.order}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={`${base}/order`} className="hover:opacity-70">
                  {dict.order.heading}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact box — mirrors the PDF's actual back-page footer: a
            teal-bordered panel holding both locations' address + phone. */}
        <div className="kapu-panel mt-12 grid gap-6 border-2 p-6 sm:grid-cols-2" style={{ borderColor: "var(--brand)" }}>
          {locations.map((loc) => (
            <div key={loc.slug}>
              {/* PHASE N — Section 5B: Majesty removed from location names. */}
              <p className="text-lg font-semibold tracking-tight" style={{ color: "var(--brand)" }}>
                {loc.name}
              </p>
              <p className="mt-1 text-sm opacity-75">{loc.address}</p>
              <a href={`tel:${loc.phone}`} className="mt-1 block text-sm opacity-75 hover:opacity-100">
                {loc.phoneDisplay}
              </a>
            </div>
          ))}
        </div>

        {/* Phase H: compacted onto one line at the user's request (was two
            separate <p> elements) — same size/weight/opacity throughout so
            the design credit still reads as quiet small print, not a second
            competing line of footer content. `flex-wrap` + `gap-x-1` (rather
            than relying on inline whitespace alone) is what lets this wrap
            cleanly after the "·" separator on narrow mobile widths instead
            of overflowing or breaking mid-word. */}
        <p className="mt-10 flex flex-wrap items-baseline gap-x-1 text-xs opacity-50">
          <span>
            © {year} {dict.footer.rights}
          </span>
          <span>·</span>
          <span>
            {dict.footer.designedBy}{" "}
            <a
              href="https://www.instagram.com/omarky/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Omar Kayyali on Instagram, @omarky"
              className="underline decoration-dotted underline-offset-2 hover:opacity-100"
            >
              Omar Kayyali · @omarky
            </a>
          </span>
        </p>
        </div>
      </div>
    </footer>
  );
}