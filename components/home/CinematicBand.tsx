import Image from "next/image";

/**
 * BEAT 3 — a short, wide photographic interlude: visual breathing space
 * between two text-heavy beats, not another card. Intentionally carries
 * little or no copy — the photograph is the content.
 */
export default function CinematicBand({
  src,
  alt,
  label,
  objectPosition = "50% 50%",
}: {
  src: string;
  alt: string;
  /** Optional short caption — omit for a pure photographic pause. */
  label?: string;
  objectPosition?: string;
}) {
  return (
    <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden md:h-[52vh]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition }}
      />
      {label && (
        <p className="absolute bottom-6 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 md:left-12">
          {label}
        </p>
      )}
    </div>
  );
}
