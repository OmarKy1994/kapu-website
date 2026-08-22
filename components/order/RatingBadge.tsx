import type { Locale } from "@/lib/i18n";

/**
 * A small aggregate trust signal — a number and a review count, never a
 * quote. The user supplied Box (4.8★, 3,084 reviews), efood (4.9★, 1,944
 * reviews) and Google (4.7★, 338 reviews) directly; Wolt's own rating was
 * explicitly left blank and must not be estimated, so there is no Wolt
 * entry here — callers simply don't render one for that platform.
 */
export default function RatingBadge({
  label,
  rating,
  count,
  locale,
  className = "",
}: {
  label: string;
  rating: string;
  count: number;
  locale: Locale;
  className?: string;
}) {
  const countLabel = count.toLocaleString(locale === "el" ? "el-GR" : "en-US");
  const srText =
    locale === "el"
      ? `${label}: ${rating} στα 5, ${countLabel} κριτικές`
      : `${label}: ${rating} out of 5, ${countLabel} reviews`;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${className}`} style={{ color: "var(--on-surface-muted)" }}>
      <span aria-hidden="true" className="font-semibold" style={{ color: "var(--on-surface)" }}>
        {label}
      </span>
      <span aria-hidden="true">{rating}★</span>
      <span aria-hidden="true">· {countLabel}</span>
      <span className="sr-only">{srText}</span>
    </span>
  );
}
