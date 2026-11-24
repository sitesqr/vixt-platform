import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logotipo VIXT — monograma com barra de energia, sem imagem externa. */
export function Logo({
  href = "/",
  compact = false,
  inverse = false,
  className,
}: {
  href?: string | null;
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#2f6bff] to-[#06b6d4] shadow-[0_8px_20px_-8px_rgba(47,107,255,0.9)]"
        aria-hidden="true"
      >
        <span className="absolute h-4 w-[3px] -rotate-12 rounded-full bg-white/95" />
        <span className="absolute h-5 w-[3px] -rotate-12 translate-x-[6px] rounded-full bg-white/70" />
      </span>
      {!compact && (
        <span
          className={cn(
            "text-xl font-black tracking-[-0.06em]",
            inverse ? "text-white" : "text-[#0b1220]",
          )}
        >
          VIXT
        </span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} aria-label="VIXT — página inicial" className="shrink-0">
      {inner}
    </Link>
  ) : (
    inner
  );
}
