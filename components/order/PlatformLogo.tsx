import Image from "next/image";

/**
 * Real platform marks, not text links. Sizes are tuned per-asset (not one
 * shared square) since Wolt/efood are wide wordmark lockups and Box is a
 * solid square badge — forcing all three into identical boxes was exactly
 * what the brief warned against. The surrounding chip (in OrderButtons)
 * supplies a consistent-height neutral/cream field so all three still read
 * as one family despite their different native proportions.
 */
const PLATFORM_LOGO: Record<
  "wolt" | "efood" | "box",
  { src: string; width: number; height: number; alt: string }
> = {
  // Wordmark-only Wolt asset (not the circular "Delivered." badge) — reads
  // better at small UI sizes without a redundant tagline.
  wolt: { src: "/images/order/wolt-wordmark.png", width: 62, height: 35, alt: "Wolt" },
  efood: { src: "/images/order/efood-logo.webp", width: 68, height: 22, alt: "efood" },
  // Phase G: replaced the client's second Box upload — a wider "BOX‑ / Food
  // for your mood" lockup — cropped down to just its square icon mark. The
  // old box-logo.png was a fully opaque 1880×1880 orange square (zero alpha
  // anywhere, confirmed by inspecting the raw pixels), so even inside the
  // shared cream chip it always read as a small colored block sitting on
  // top of another surface. This crop keeps the same recognizable mark at
  // more than enough resolution for a 32px chip, but as a real transparent
  // PNG, matching how Wolt/efood already sit in the chip with no color
  // field of their own. The full lockup's "Food for your mood" tagline was
  // left out of the crop — at chip scale it would be illegible mush, the
  // same reasoning Phase F already applied when it chose Wolt's tagline-free
  // wordmark over the circular "Delivered." badge.
  box: { src: "/images/order/box-icon.png", width: 32, height: 32, alt: "Box" },
};

export default function PlatformLogo({
  platform,
  scale = 1,
  className = "",
}: {
  platform: "wolt" | "efood" | "box";
  scale?: number;
  className?: string;
}) {
  const logo = PLATFORM_LOGO[platform];
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={Math.round(logo.width * scale)}
      height={Math.round(logo.height * scale)}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
