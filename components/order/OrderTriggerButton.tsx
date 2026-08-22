"use client";

import type { ReactNode } from "react";
import { useOrderModal } from "@/components/order/OrderModalProvider";

/**
 * PHASE I — Section 7. Any other "primary Order CTA" on the site (the
 * homepage's own dedicated Order section, for instance) should open the
 * same quick location → platform chooser as the nav buttons, not send the
 * visitor to /order first — this is the shared trigger for those spots
 * that aren't already inside a client component of their own.
 */
export default function OrderTriggerButton({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const { openOrderModal } = useOrderModal();
  return (
    <button type="button" onClick={openOrderModal} className={className} style={style}>
      {children}
    </button>
  );
}
