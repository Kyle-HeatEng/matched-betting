import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}
