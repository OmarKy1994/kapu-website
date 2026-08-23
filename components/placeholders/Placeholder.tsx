import type { LocalizedString } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import WobbleDivider from "@/components/motifs/WobbleDivider";

/**
 * The single reusable placeholder for every missing photograph on the site.
 * Aspect-ratio-locked, on-brand, clearly (but not apologetically) labeled —
 * never a broken-image icon, never generic stock photography. Styled as a
 * small KAPU panel (off-white card, mint-deep stripe, pink label) rather
 * than a generic grey "missing image" box, so it reads as an intentional
 * placeholder, not a broken one.
 *
 * Deliberately does NOT carry a bougainvillea corner (Phase D had one on
 * every instance) — a site with several placeholders on one page was
 * printing the same floral crop several times in the same viewport, which
 * is exactly the "wallpaper" effect the brand asset is supposed to avoid.
 * The floral motif now only appears at real chapter moments; this stays a
 * quiet, striped, branded-but-neutral placeholder.
 *
 * To replace with a real photo later: swap this component out for
 * <KapuImage src="..." /> at the call site, or extend it to accept an
 * optional `src` prop that short-circuits to a real <Image> — the content
 * reference (locations/*.json `images.*`) is what actually needs to change,
 * not the surrounding layout.
 */
export default function Placeholder({
  subject,
  aspect = "16/9",
  locale,
  labelPrefix,
  temporaryLabel,
  className = "",
}: {
  subject: LocalizedString;
  aspect?: string;
  locale: Locale;
  labelPrefix: string;
  temporaryLabel: string;
  className?: string;
}) {
  return (
    <div
      className={`kapu-panel relative flex w-full flex-col items-center justify-center overflow-hidden border p-6 text-center ${className}`}
      style={{
        aspectRatio: aspect,
        borderColor: "var(--border-soft)",
        background:
          "repeating-linear-gradient(135deg, color-mix(in srgb, var(--kapu-mint-deep) 30%, var(--panel)) 0px, color-mix(in srgb, var(--kapu-mint-deep) 30%, var(--panel)) 14px, var(--panel) 14px, var(--panel) 28px)",
      }}
      role="img"
      aria-label={`${labelPrefix}: ${subject[locale]}`}
    >
      <p className="font-display text-lg" style={{ color: "var(--brand)" }}>
        KAPU
      </p>
      <WobbleDivider className="my-2 w-14 opacity-60" color="var(--accent)" />
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--kapu-pink-deep)" }}>
        {labelPrefix}
      </p>
      <p className="mt-2 max-w-xs text-sm font-medium" style={{ color: "var(--on-surface)", opacity: 0.85 }}>
        {subject[locale]}
      </p>
      <p className="mt-3 max-w-xs text-[11px] italic opacity-50">{temporaryLabel}</p>
    </div>
  );
}
