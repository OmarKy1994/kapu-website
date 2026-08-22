/**
 * The hand-drawn "wobble" — an imperfect, slightly asymmetric stroke that
 * extends the logo's own hand-drawn line quality into dividers, underlines
 * and icon strokes. This is what should still read as KAPU with the logo
 * removed. Kept subtle and applied sparingly, per the Creative Direction
 * doc's two-motif rule (bougainvillea + wobble, nothing else decorative).
 */
export default function WobbleDivider({
  color = "currentColor",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      className={`h-3 w-full ${className}`}
    >
      <path
        d="M2 7c14-5 22 4 36-1s20 6 34 1 22-6 36-1 24 5 38 0 20-5 30 0"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
