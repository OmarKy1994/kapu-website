"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { SiteDict } from "@/lib/content";
import { getLocations } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import OrderButtons from "@/components/order/OrderButtons";

/**
 * PHASE I — Section 7. The primary Order CTA (desktop nav button + mobile
 * bottom bar) used to be a plain Link to a full /order page — a page
 * navigation, full reload of context, just to pick a location and a
 * delivery platform. The brief calls this an "unnecessary detour": Order
 * → choose location → choose platform → external page should be one fast
 * in-page interaction, not a page hop.
 *
 * This is a single context provider mounted once near the root of the
 * locale layout (wrapping Nav / main / Footer / MobileNav) so both the
 * desktop and mobile Order triggers can open the exact same modal instance
 * via `useOrderModal()`, rather than each owning separate modal state.
 * The /order page itself still exists as the brief allows ("can remain
 * available as a secondary destination") — this modal is just the fast
 * path for the primary CTA.
 */

type OrderModalContextValue = {
  openOrderModal: () => void;
};

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export function useOrderModal(): OrderModalContextValue {
  const ctx = useContext(OrderModalContext);
  if (!ctx) {
    throw new Error("useOrderModal must be used within an OrderModalProvider");
  }
  return ctx;
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function OrderModalProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: SiteDict;
  children: ReactNode;
}) {
  const locations = useMemo(() => getLocations(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openOrderModal = useCallback(() => {
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setSelectedSlug(locations.length === 1 ? locations[0].slug : null);
    setIsOpen(true);
  }, [locations]);

  const closeOrderModal = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus?.();
  }, []);

  // Escape to close, focus trap while open, restore body scroll on close.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      panelRef.current ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

    // Move focus into the panel as soon as it mounts.
    const raf = requestAnimationFrame(() => {
      getFocusable()[0]?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeOrderModal();
        return;
      }
      if (event.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, closeOrderModal]);

  const selectedLocation = locations.find((location) => location.slug === selectedSlug) ?? null;

  return (
    <OrderModalContext.Provider value={{ openOrderModal }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6"
          style={{ backgroundColor: "color-mix(in srgb, var(--kapu-charcoal) 55%, transparent)" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeOrderModal();
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            className="w-full max-w-md rounded-t-3xl border shadow-2xl md:rounded-3xl"
            style={{
              backgroundColor: "var(--kapu-cream)",
              borderColor: "var(--border-soft)",
              maxHeight: "min(82vh, 640px)",
              display: "flex",
              flexDirection: "column",
            }}
            // Closing on any in-panel link click (the platform buttons are
            // target="_blank" external links, so this doesn't interrupt the
            // navigation — it just tidies the modal away behind the new tab
            // rather than leaving it open over the now-stale page).
            onClickCapture={(event) => {
              if ((event.target as HTMLElement).closest("a")) {
                closeOrderModal();
              }
            }}
          >
            <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5">
              <h2 id="order-modal-title" className="font-display text-2xl" style={{ color: "var(--accent)" }}>
                {selectedLocation ? dict.order.choosePlatform : dict.order.chooseLocation}
              </h2>
              <button
                type="button"
                onClick={closeOrderModal}
                aria-label={dict.order.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:opacity-70"
                style={{ backgroundColor: "var(--surface)", minWidth: "36px", minHeight: "36px" }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
                  <path d="M1 1L14 14M14 1L1 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-5 pb-8 pt-3">
              {!selectedLocation ? (
                <div className="space-y-3">
                  {locations.map((location) => (
                    <button
                      key={location.slug}
                      type="button"
                      onClick={() => setSelectedSlug(location.slug)}
                      className="flex w-full flex-col items-start gap-0.5 border px-4 py-3 text-left transition hover:opacity-80"
                      style={{ borderColor: "var(--border-soft)", borderRadius: "12px", minHeight: "44px" }}
                    >
                      <span className="font-display text-xl" style={{ color: "var(--accent)" }}>
                        {location.name}
                      </span>
                      <span className="text-xs opacity-60">{location.neighborhood[locale]}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(null)}
                    className="mb-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide opacity-60 transition hover:opacity-100"
                    style={{ minHeight: "32px" }}
                  >
                    <span aria-hidden="true">←</span> {dict.order.back}
                  </button>
                  <p className="text-xs opacity-60">{selectedLocation.neighborhood[locale]}</p>
                  <p className="mb-4 font-display text-xl" style={{ color: "var(--accent)" }}>
                    {selectedLocation.name}
                  </p>
                  <OrderButtons location={selectedLocation} dict={dict} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </OrderModalContext.Provider>
  );
}
