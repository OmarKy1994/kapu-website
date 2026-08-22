import type { LocationData } from "@/lib/types";
import type { SiteDict } from "@/lib/content";
import PlatformLogo from "@/components/order/PlatformLogo";

const PLATFORM_LABEL_KEY = {
  wolt: "wolt",
  efood: "efood",
  box: "box",
} as const;

/**
 * Renders only the ordering platforms KAPU actually supplied links for.
 * Unverified listings still show (so the link is usable) but carry a small
 * "unverified" note rather than being presented with false confidence.
 *
 * Phase F: real platform marks in a shared neutral (cream) chip instead of
 * plain-teal text buttons — Wolt/efood are transparent wordmarks and Box is
 * an opaque orange square, so each needs the same neutral field behind it
 * to read cleanly against mint, cream, or charcoal alike, and to keep
 * Box's orange from colliding directly with the surrounding brand color.
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
  const available = entries.filter(([, link]) => link && link.url);

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
          aria-label={`${dict.order[PLATFORM_LABEL_KEY[platform]]}${!link!.verified ? ` — ${dict.order.unverified}` : ""}`}
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
          {!link!.verified && (
            <span className="text-[9px] font-semibold uppercase leading-tight tracking-wider opacity-60" style={{ color: "var(--kapu-charcoal)" }}>
              {dict.order.unverified}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
