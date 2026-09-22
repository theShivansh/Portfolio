import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { direction?: "forward" | "back" };

/**
 * A Link that tags its navigation with a direction, so pages slide the way
 * the reader is moving: deeper into a case, or back out of it. Browsers
 * without View Transitions navigate normally.
 */
export function ViewTransitionLink({ direction = "forward", ...props }: Props) {
  return <Link transitionTypes={[direction === "forward" ? "nav-forward" : "nav-back"]} {...props} />;
}
