import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "green" | "amber" | "gray" | "slate";

const tones: Record<Tone, string> = {
  blue: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
  green: "bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]",
  amber: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  gray: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
  slate: "bg-[#0b1220] text-white border-[#0b1220]",
};

export function Badge({
  tone = "blue",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
