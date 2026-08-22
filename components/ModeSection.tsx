import type { CSSProperties, ReactNode } from "react";

/**
 * Day/night is a section-level attribute, never a global dark-mode class.
 * Components read mode-scoped CSS custom properties (see globals.css:
 * [data-mode="night"]) so the same tokens resolve to different values —
 * the same room, a different hour, not a theme switch.
 */
export default function ModeSection({
  mode,
  as: Tag = "section",
  className = "",
  id,
  style,
  children,
}: {
  mode: "day" | "night";
  as?: "section" | "div";
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag data-mode={mode} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
