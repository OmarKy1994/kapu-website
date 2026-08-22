"use client";

/**
 * The café/bar switch, styled after flipping a physical two-sided café sign
 * rather than a generic SaaS tab pair — a firm click between two states, an
 * angled "flip" transform on the active label, no pill/underline tab chrome.
 */
export default function MenuModeSwitch({
  mode,
  onChange,
  cafeLabel,
  barLabel,
  switchLabel,
}: {
  mode: "cafe" | "bar";
  onChange: (mode: "cafe" | "bar") => void;
  cafeLabel: string;
  barLabel: string;
  switchLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={switchLabel}
      className="kapu-panel inline-flex overflow-hidden border-2"
      style={{ borderColor: "var(--brand)" }}
    >
      {(["cafe", "bar"] as const).map((value) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className="min-h-[44px] px-8 py-2.5 font-display text-lg tracking-wide transition-transform duration-200"
            style={{
              // Fixed teal-deep fill regardless of café/bar (day/night) mode —
              // the bar-mode --brand token resolves to a light mint-green
              // that read as near-white-on-light when paired with the
              // off-white active label (2.3:1, fails WCAG). A constant dark
              // fill keeps the switch legible and visually stable in both.
              backgroundColor: active ? "var(--kapu-teal-deep)" : "transparent",
              color: active ? "var(--kapu-offwhite)" : "var(--on-surface)",
              transform: active ? "skewX(-4deg)" : "none",
            }}
          >
            <span style={{ display: "inline-block", transform: active ? "skewX(4deg)" : "none" }}>
              {value === "cafe" ? cafeLabel : barLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
