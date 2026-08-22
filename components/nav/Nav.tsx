"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import LanguageSwitcher from "@/components/nav/LanguageSwitcher";
import { useOrderModal } from "@/components/order/OrderModalProvider";

export default function Nav({ locale, dict }: { locale: Locale; dict: SiteDict }) {
  const base = `/${locale}`;
  const pathname = usePathname();
  const { openOrderModal } = useOrderModal();

  // PHASE I — Section 5 fix. Phase H made the logo an unconditional
  // scroll-to-top button, on every route, which the brief calls out
  // explicitly as wrong: on an interior page (e.g. /en/menu) a visitor
  // clicking the logo expects to go HOME, not bounce to the top of the
  // menu page they're already reading. The correct behavior depends on
  // where you currently are:
  //   - on the homepage itself (`pathname === base`): scroll to top,
  //     no navigation — a real <a>/<Link> to the current URL is either a
  //     no-op or (worse) a full reload depending on the router, neither
  //     of which is "smoothly scroll up." A <button> is the correct
  //     element here since it performs an in-page action, not navigation.
  //   - anywhere else: a real <Link href={base}> — genuine navigation
  //     needs a genuine link (correct semantics, middle-click/open-in-new-
  //     tab support, no JS-required dependency), not a button faking it
  //     with router.push.
  // Two-arg scrollTo (not an options object with an explicit `behavior`)
  // is intentional: that form defers to the global `scroll-behavior:
  // smooth` on <html> in globals.css, which already has its own
  // `prefers-reduced-motion` override — an explicit `behavior: "smooth"`
  // here would bypass that and animate regardless of the user's motion
  // preference.
  const isHome = pathname === base;
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // PHASE N — Section 2 fix. Root cause of the "Menu is always green" bug:
  // the mobile Menu <Link> below had a hardcoded style={{color:"var(--brand)"}}
  // with nothing route-aware about it, so it read as "active" on every page
  // (Locations, Order, Menu itself) — desktop had no active-state logic at
  // all. Real route matching instead, using the already-available
  // `pathname`: exact match for Menu/Order (no nested routes to worry
  // about), startsWith for Locations since it has a `/locations/[slug]`
  // detail route that should still read as active. `/order` is a real,
  // independently-reachable route (see app/[locale]/order/page.tsx) even
  // though the header's Order control is a modal trigger, so it gets the
  // same real route check rather than being hardcoded false.
  const isMenuActive = pathname === `${base}/menu`;
  const isLocationsActive = pathname === `${base}/locations` || pathname.startsWith(`${base}/locations/`);
  const isOrderActive = pathname === `${base}/order`;
  const activeStyle = { color: "var(--brand)" } as const;

  // PHASE I — Section 3. The real supplied KAPU LOGO.png (full icon +
  // wordmark lockup, not reconstructed from the separate icon PNG + a
  // live "KAPU" text span the way Phase H did it) — see
  // public/images/logo/kapu-logo-full.png and the Phase I asset
  // inventory for the crop/derivation notes. The source master is a
  // vertical stack (mask icon above the wordmark) at roughly a 0.92:1
  // width:height ratio, preserved here via a fixed aspect-ratio wrapper
  // rather than a fixed width+height, so it can never look squashed or
  // stretched at any of the sizes below. Sized taller than Phase H's
  // icon-only mark (which was ~36px) so the "KAPU" wordmark baked into
  // this image stays legible rather than shrinking to a blur; h-14 gives
  // clean retina rendering at typical device pixel ratios since the
  // source master is 1454x1584px, far above what's ever displayed here.
  const logoImage = (
    <span className="relative block h-11 md:h-14" style={{ aspectRatio: "1454 / 1584" }}>
      <Image
        src="/images/logo/kapu-logo-full.png"
        alt=""
        fill
        sizes="(min-width: 768px) 56px, 44px"
        style={{ objectFit: "contain" }}
        preload
      />
    </span>
  );

  return (
    <header
      data-mode="day"
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: "var(--border-soft)", backgroundColor: "color-mix(in srgb, var(--surface) 92%, transparent)", backdropFilter: "blur(8px)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {isHome ? (
          <button
            type="button"
            onClick={scrollToTop}
            className="flex shrink-0 items-center bg-transparent p-0"
            aria-label={dict.nav.backToTop}
          >
            {logoImage}
          </button>
        ) : (
          <Link href={base} className="flex shrink-0 items-center" aria-label={dict.nav.goToHomepage}>
            {logoImage}
          </Link>
        )}

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <Link
            href={`${base}/menu`}
            aria-current={isMenuActive ? "page" : undefined}
            className="text-sm font-medium tracking-wide hover:opacity-70"
            style={isMenuActive ? activeStyle : undefined}
          >
            {dict.nav.menu}
          </Link>
          <Link
            href={`${base}/locations`}
            aria-current={isLocationsActive ? "page" : undefined}
            className="text-sm font-medium tracking-wide hover:opacity-70"
            style={isLocationsActive ? activeStyle : undefined}
          >
            {dict.nav.findYourKapu}
          </Link>
          {/* PHASE I — Section 7: opens the quick location → platform
              chooser instead of navigating to /order first. It's already a
              solid-fill brand-color button (visually distinct from the text
              links above), so PHASE N gives it aria-current for correctness
              when the real /order route is open, without adding a second,
              redundant visual "active" treatment on top of the fill. */}
          <button
            type="button"
            onClick={openOrderModal}
            aria-current={isOrderActive ? "page" : undefined}
            className="kapu-button px-4 py-2 text-sm font-semibold tracking-wide text-white hover:opacity-90"
            style={{ backgroundColor: "var(--kapu-teal-deep)" }}
          >
            {dict.nav.order}
          </button>
          <LanguageSwitcher locale={locale} label={dict.nav.languageSwitchLabel} />
        </nav>

        {/* Mobile — Phase G: Menu was previously reachable only from the fixed
            bottom bar, which read as "buried" since it's off-screen from the
            header a visitor sees first. Menu now lives directly in the top
            header (matching desktop's own hierarchy — it's the single most
            important nav destination); Locations stays alongside it since
            both are lightweight text links that fit comfortably next to the
            2-letter language pill. Order moves out of this row entirely —
            it's now the bottom bar's one job, not duplicated here. */}
        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <Link
            href={`${base}/menu`}
            aria-current={isMenuActive ? "page" : undefined}
            className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-wide hover:opacity-70"
            style={isMenuActive ? activeStyle : undefined}
          >
            {dict.nav.menu}
          </Link>
          <Link
            href={`${base}/locations`}
            aria-current={isLocationsActive ? "page" : undefined}
            className="min-w-0 truncate text-xs font-medium tracking-wide opacity-80 hover:opacity-100"
            style={isLocationsActive ? activeStyle : undefined}
          >
            {dict.nav.findYourKapu}
          </Link>
          <LanguageSwitcher locale={locale} label={dict.nav.languageSwitchLabel} compact />
        </div>
      </div>
    </header>
  );
}