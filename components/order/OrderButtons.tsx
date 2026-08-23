import type { LocationData } from "@/lib/types";
import type { SiteDict } from "@/lib/content";
import PlatformLogo from "@/components/order/PlatformLogo";

const PLATFORM_LABEL_KEY = {
  wolt: "wolt",
  efood: "efood",
  box: "box",
} as const;

/**
 * Renders only the ordering platforms KAPU has actually confirmed and
 * verified for this location — an unverified listing (e.g. Kallithea's
 * efood, whose hours/menu content couldn't be confirmed during research)
 * is simply not shown, rather than shown with a caveat. Users should never
 * see "unverified" or similar internal QA language in the interface; the
 * honest fix is to not display an unconfirmed link at all, not to display
 * it with a warning label.
 *
 * Phase F: real platform marks in a shared neutral (cream) chip instead of
 * plain-teal text buttons — Wolt/efood are transparent wordmarks and Box is
 * an opaque orange square, so each needs the same neutral field behind it
 * to read cleanly against mint, cream, or charcoal alike, and to keep
 * Box's orange from colliding directly with the surrounding brand color.
 *
 * CRO fix: "default" size now also shows the platform's own visible CTA
 * text ("Order with Wolt") next to the mark, not just an icon with the
 * label buried in aria-label — a first-time visitor shouldn't have to
 * recognize a wordmark to know what the button does. "compact" (used in
 * space-constrained spots like location cards) stays icon-only.
 */
export default function OrderButtons({
  location,
  dict,
  size = "default",
}: {
  location: LocationData;
  dict: SiteDict;
  size?: "default" | "compact";
}) {
  const entries = Object.entries(location.orderingLinks) as Array<
    [keyof typeof PLATFORM_LABEL_KEY, LocationData["orderingLinks"]["wolt"]]
  >;
  const available = entries.filter(([, link]) => link && link.url && link.verified);

  if (available.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {available.map(([platform, link]) => (
        <a
          key={platform}
          href={link!.url!}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 border transition hover:opacity-80 ${
            size === "compact" ? "h-10 px-3" : "h-11 px-4"
          }`}
          style={{
            backgroundColor: "var(--kapu-cream)",
            borderColor: "var(--border-soft)",
            borderRadius: "10px",
            minHeight: "44px",
          }}
        >
          <PlatformLogo platform={platform} scale={size === "compact" ? 0.82 : 1} />
          {size === "default" && (
            <span className="text-sm font-semibold" style={{ color: "var(--kapu-charcoal)" }}>
              {dict.order[PLATFORM_LABEL_KEY[platform]]}
            </span>
          )}
          {size === "compact" && <span className="sr-only">{dict.order[PLATFORM_LABEL_KEY[platform]]}</span>}
        </a>
      ))}
    </div>
  );
}
