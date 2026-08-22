"use client";

import type { Locale } from "@/lib/i18n";
import type { SiteDict } from "@/lib/content";
import { useOrderModal } from "@/components/order/OrderModalProvider";

/**
 * Phase G: this bar's job changed. It used to duplicate the entire primary
 * nav (Menu / Find Your KAPU / Order as three equal tabs) — which is exactly
 * what made Menu feel "buried" down here instead of live in the header where
 * a visitor actually looks first. Menu and Locations moved to the top header
 * (see Nav.tsx); this bar now has one job — a persistent, thumb-reachable
 * Order action — so it reads as a conversion prompt, not a second nav
 * system. Still hidden at md and up, where the desktop header's own Order
 * button already does this.
 *
 * PHASE I — Section 7: this was a Link to /order (a full page hop before a
 * visitor could even pick a platform). It now opens the same quick
 * location → platform chooser modal as the desktop nav's Order button —
 * "Order" here is an action, not a nav destination, so it's a <button> and
 * no longer carries an aria-current="page" active state.
 */
export default function MobileNav({ dict }: { locale: Locale; dict: SiteDict }) {
  const { openOrderModal } = useOrderModal();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-2.5 md:hidden"
      style={{
        borderColor: "var(--border-soft)",
        backgroundColor: "color-mix(in srgb, var(--surface) 96%, transparent)",
        backdropFilter: "blur(8px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.625rem)",
      }}
    >
      <button
        type="button"
        onClick={openOrderModal}
        className="kapu-button flex min-h-[46px] w-full items-center justify-center text-sm font-semibold tracking-wide text-white hover:opacity-90"
        style={{ backgroundColor: "var(--kapu-teal-deep)" }}
      >
        {dict.nav.order}
      </button>
    </div>
  );
}
